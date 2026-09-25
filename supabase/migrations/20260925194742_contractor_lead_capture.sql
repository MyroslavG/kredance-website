-- Server-only lead intake. No browser/anon/authenticated access to personal data.
create table public.website_leads (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  payload_hash text not null,
  ip_hash text not null,
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  website text not null,
  problem text not null check (char_length(problem) between 10 and 2000),
  offer text not null default 'contractor-website-review',
  attribution jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'call_booked', 'proposal_sent', 'won', 'lost')),
  next_action text not null default 'Review website and reply with three improvements',
  next_action_at timestamptz not null default (now() + interval '1 day'),
  created_at timestamptz not null default now()
);
create index website_leads_ip_created_idx on public.website_leads (ip_hash, created_at desc);
create index website_leads_email_created_idx on public.website_leads (email, created_at desc);
create index website_leads_follow_up_idx on public.website_leads (next_action_at) where status not in ('won', 'lost');

create table public.lead_email_jobs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.website_leads(id) on delete cascade,
  kind text not null check (kind in ('owner', 'acknowledgment')),
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'review')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  first_attempt_at timestamptz,
  lease_until timestamptz,
  lease_token uuid,
  provider_id text,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (lead_id, kind)
);
create index lead_email_jobs_available_idx on public.lead_email_jobs (available_at) where status in ('pending', 'processing');

alter table public.website_leads enable row level security;
alter table public.lead_email_jobs enable row level security;
revoke all on public.website_leads, public.lead_email_jobs from public, anon, authenticated;
grant select, insert, update, delete on public.website_leads, public.lead_email_jobs to service_role;

create table public.lead_funnel_events (
  id uuid primary key,
  event_name text not null check (event_name in ('contractor_page_viewed', 'review_cta_clicked', 'review_form_started', 'review_inquiry_saved', 'booking_confirmed')),
  location text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index lead_funnel_events_date_idx on public.lead_funnel_events (created_at desc, event_name);
create index lead_funnel_events_rate_idx on public.lead_funnel_events (ip_hash, created_at desc) where ip_hash is not null;
alter table public.lead_funnel_events enable row level security;
revoke all on public.lead_funnel_events from public, anon, authenticated;
grant select, insert, delete on public.lead_funnel_events to service_role;

create function public.record_funnel_event(p_id uuid, p_event_name text, p_location text, p_ip_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  -- Saved inquiries are written by accept_website_lead only, never the public event endpoint.
  if p_event_name not in ('contractor_page_viewed', 'review_cta_clicked', 'review_form_started', 'booking_confirmed') then raise exception 'invalid_event'; end if;
  perform pg_advisory_xact_lock(hashtextextended('funnel:' || p_ip_hash, 0));
  if exists (select 1 from public.lead_funnel_events where id = p_id) then return false; end if;
  if (select count(*) from public.lead_funnel_events where ip_hash = p_ip_hash and created_at > now() - interval '5 minutes') >= 100 then return false; end if;
  insert into public.lead_funnel_events (id, event_name, location, ip_hash) values (p_id, p_event_name, p_location, p_ip_hash);
  return true;
end;
$$;
revoke all on function public.record_funnel_event(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.record_funnel_event(uuid, text, text, text) to service_role;

-- One transaction saves the inquiry, follow-up fields, and both emails.
-- Advisory locks serialize rate-limit checks across serverless instances.
create function public.accept_website_lead(
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
  if jsonb_typeof(p_emails) <> 'array' or jsonb_array_length(p_emails) <> 2 then raise exception 'invalid_emails'; end if;
  insert into public.website_leads (submission_id, payload_hash, ip_hash, name, email, website, problem, attribution)
  values (p_submission_id, p_payload_hash, p_ip_hash, p_lead->>'name', p_lead->>'email', p_lead->>'website', p_lead->>'problem', p_lead->'attribution')
  returning id into new_id;
  insert into public.lead_email_jobs (lead_id, kind, payload)
  select new_id, item->>'kind', item->'payload' from jsonb_array_elements(p_emails) as item;
  insert into public.lead_funnel_events (id, event_name, location) values (new_id, 'review_inquiry_saved', 'contractor');
  return jsonb_build_object('id', new_id, 'created', true);
end;
$$;

create function public.claim_lead_emails(p_lead_id uuid default null, p_limit integer default 2)
returns setof public.lead_email_jobs language plpgsql security invoker set search_path = '' as $$
begin
  -- Stop uncertain retries before Resend's 24-hour idempotency window expires.
  -- Leave these visible for an operator to reconcile against provider logs.
  update public.lead_email_jobs set status = 'review', last_error = 'retry_window_exhausted'
  where status in ('pending', 'processing') and (lease_until is null or lease_until < now())
    and (attempts >= 5 or first_attempt_at < now() - interval '23 hours');
  return query
  with candidates as (
    select id from public.lead_email_jobs
    where (p_lead_id is null or lead_id = p_lead_id)
      and available_at <= now() and attempts < 5
      and (status = 'pending' or (status = 'processing' and lease_until < now()))
    order by available_at, id for update skip locked limit greatest(1, least(p_limit, 4))
  )
  update public.lead_email_jobs as jobs
  set status = 'processing', attempts = attempts + 1, lease_until = now() + interval '2 minutes',
    lease_token = gen_random_uuid(), first_attempt_at = coalesce(first_attempt_at, now())
  from candidates where jobs.id = candidates.id returning jobs.*;
end;
$$;

create function public.finish_lead_email(p_id uuid, p_lease_token uuid, p_provider_id text, p_error text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare changed integer;
begin
  update public.lead_email_jobs set
    status = case when p_error is null then 'sent' when attempts >= 5 then 'review' else 'pending' end,
    provider_id = coalesce(p_provider_id, provider_id), last_error = p_error,
    sent_at = case when p_error is null then now() else null end,
    available_at = now() + make_interval(secs => least(3600, (power(2, attempts) * 60)::integer)),
    lease_until = null, lease_token = null
  where id = p_id and lease_token = p_lease_token and status = 'processing';
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

revoke all on function public.accept_website_lead(uuid, text, text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.claim_lead_emails(uuid, integer) from public, anon, authenticated;
revoke all on function public.finish_lead_email(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.accept_website_lead(uuid, text, text, jsonb, jsonb) to service_role;
grant execute on function public.claim_lead_emails(uuid, integer) to service_role;
grant execute on function public.finish_lead_email(uuid, uuid, text, text) to service_role;
