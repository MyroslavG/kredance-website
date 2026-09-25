-- EmailJS /send has no documented idempotency key. Unknown outcomes require review.
alter table public.lead_email_jobs add column last_activity_at timestamptz;
create index lead_email_jobs_activity_idx on public.lead_email_jobs (last_activity_at desc) where last_activity_at is not null;

-- Preserve historical payloads for review; never send them through a new provider.
update public.lead_email_jobs set status = 'review', last_error = 'provider_configuration_changed'
where status in ('pending','processing') and not (payload ? 'template_id');

create or replace function public.claim_lead_emails(p_lead_id uuid default null, p_limit integer default 2)
returns setof public.lead_email_jobs language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('kredance-emailjs-dispatch', 0));
  update public.lead_email_jobs set status = 'review', last_error = 'email_delivery_uncertain', lease_token = null, lease_until = null
  where status = 'processing' and lease_until < clock_timestamp();
  update public.lead_email_jobs set status = 'review', last_error = 'retry_limit_reached'
  where status = 'pending' and attempts >= 5;
  -- One request at a time across all instances, with >1 second between completions.
  if p_limit < 1
    or exists (select 1 from public.lead_email_jobs where status = 'processing')
    or exists (select 1 from public.lead_email_jobs where last_activity_at > clock_timestamp() - interval '1.1 seconds')
  then return; end if;
  return query
  with candidate as (
    select id from public.lead_email_jobs
    where (p_lead_id is null or lead_id = p_lead_id)
      and available_at <= clock_timestamp() and attempts < 5 and status = 'pending'
    order by available_at, case when kind = 'owner' then 0 else 1 end, id
    for update skip locked limit 1
  )
  update public.lead_email_jobs as jobs
  set status = 'processing', attempts = attempts + 1, lease_until = clock_timestamp() + interval '2 minutes',
    lease_token = gen_random_uuid(), first_attempt_at = coalesce(first_attempt_at, clock_timestamp()), last_activity_at = clock_timestamp()
  from candidate where jobs.id = candidate.id returning jobs.*;
end;
$$;

create or replace function public.finish_lead_email(p_id uuid, p_lease_token uuid, p_provider_id text, p_error text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare changed integer;
begin
  update public.lead_email_jobs set
    status = case when p_error is null then 'sent' when p_error = 'email_http_429' and attempts < 5 then 'pending' else 'review' end,
    provider_id = p_provider_id, last_error = p_error,
    sent_at = case when p_error is null then clock_timestamp() else null end,
    available_at = clock_timestamp() + make_interval(secs => least(3600, (power(2, attempts) * 60)::integer)),
    last_activity_at = clock_timestamp(), lease_until = null, lease_token = null
  where id = p_id and lease_token = p_lease_token and status = 'processing';
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

revoke all on function public.claim_lead_emails(uuid, integer), public.finish_lead_email(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.claim_lead_emails(uuid, integer), public.finish_lead_email(uuid, uuid, text, text) to service_role;

create or replace function public.accept_website_lead(
  p_submission_id uuid, p_payload_hash text, p_ip_hash text, p_lead jsonb, p_emails jsonb
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing public.website_leads; new_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended('ip:' || p_ip_hash, 0));
  perform pg_advisory_xact_lock(hashtextextended('email:' || (p_lead->>'email'), 0));
  perform pg_advisory_xact_lock(hashtextextended('submission:' || p_submission_id::text, 0));
  select * into existing from public.website_leads where submission_id = p_submission_id;
  if found then
    if existing.payload_hash <> p_payload_hash then raise exception 'submission_conflict'; end if;
    return jsonb_build_object('id', existing.id, 'created', false);
  end if;
  if (select count(*) from public.website_leads where ip_hash = p_ip_hash and created_at > now() - interval '15 minutes') >= 5
    or (select count(*) from public.website_leads where email = p_lead->>'email' and created_at > now() - interval '1 hour') >= 3
  then raise exception 'rate_limited'; end if;
  if jsonb_typeof(p_emails) <> 'array' or jsonb_array_length(p_emails) <> 1 then raise exception 'invalid_emails'; end if;
  if (select count(*) from jsonb_array_elements(p_emails) as item where item->>'kind' = 'owner') <> 1 then raise exception 'invalid_emails'; end if;
  insert into public.website_leads (submission_id, payload_hash, ip_hash, name, email, website, problem, attribution)
  values (p_submission_id, p_payload_hash, p_ip_hash, p_lead->>'name', p_lead->>'email', p_lead->>'website', p_lead->>'problem', p_lead->'attribution')
  returning id into new_id;
  insert into public.lead_email_jobs (lead_id, kind, payload)
  select new_id, item->>'kind', item->'payload' from jsonb_array_elements(p_emails) as item;
  insert into public.lead_funnel_events (id, event_name, location) values (new_id, 'review_inquiry_saved', 'contractor');
  return jsonb_build_object('id', new_id, 'created', true);
end;
$$;
