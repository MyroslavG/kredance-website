-- Additive owner workflow. Existing leads and their chosen follow-up dates are preserved.
create function public.next_lead_follow_up(p_received timestamptz)
returns timestamptz language plpgsql immutable strict security invoker set search_path = '' as $$
declare local_due timestamp := (p_received at time zone 'America/Toronto') + interval '1 day';
begin
  while extract(isodow from local_due) in (6,7) loop
    local_due := local_due + interval '1 day';
  end loop;
  return local_due at time zone 'America/Toronto';
end; $$;
revoke all on function public.next_lead_follow_up(timestamptz) from public,anon,authenticated;
grant execute on function public.next_lead_follow_up(timestamptz) to service_role;

alter table public.website_leads
  add column entry_channel text not null default 'website' check (entry_channel in ('website','referral','email','social','conversation','other')),
  add column business_name text not null default '' check (char_length(business_name)<=150),
  add column contact_detail text not null default '' check (char_length(contact_detail)<=300),
  alter column email drop not null,
  alter column next_action_at set default public.next_lead_follow_up(now()),
  add constraint website_leads_contact_required check (
    (entry_channel='website' and email is not null) or
    (entry_channel<>'website' and (email is not null or char_length(btrim(contact_detail))>0))
  );

create function public.dashboard_create_lead(p_session_hash text,p_submission_id uuid,p_payload_hash text,p_lead jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing public.website_leads; new_id uuid;
  channel text := p_lead->>'entry_channel'; received timestamptz := (p_lead->>'received_at')::timestamptz;
begin
  if not public.dashboard_session_valid(p_session_hash) then raise exception 'unauthorized'; end if;
  if channel is null or channel not in ('referral','email','social','conversation','other')
    or received is null or received<'2000-01-01'::timestamptz or received>now()+interval '5 minutes'
    or p_submission_id is null or p_payload_hash is null or char_length(p_payload_hash)<>64
    or coalesce(char_length(btrim(p_lead->>'next_action')),0) not between 2 and 500 then
    raise exception 'invalid_manual_lead';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('submission:' || p_submission_id::text,0));
  select * into existing from public.website_leads where submission_id=p_submission_id;
  if found then
    if existing.payload_hash<>p_payload_hash or existing.entry_channel='website' then raise exception 'submission_conflict'; end if;
    return jsonb_build_object('id',existing.id,'created',false);
  end if;
  insert into public.website_leads(submission_id,payload_hash,ip_hash,name,email,website,problem,offer,service,subject,attribution,
    entry_channel,business_name,contact_detail,next_action,next_action_at,created_at)
  values(p_submission_id,p_payload_hash,'manual-owner',p_lead->>'name',nullif(p_lead->>'email',''),coalesce(p_lead->>'website',''),
    p_lead->>'problem','manual-inquiry',coalesce(p_lead->>'service',''),'Manually recorded enquiry',
    jsonb_build_object('landingPath','/dashboard','referrerHost','','utm',jsonb_build_object('utm_source',channel,'utm_medium','manual')),
    channel,coalesce(p_lead->>'business_name',''),coalesce(p_lead->>'contact_detail',''),p_lead->>'next_action',public.next_lead_follow_up(received),received)
  returning id into new_id;
  -- Intentionally no notification job, website conversion, or visitor event.
  return jsonb_build_object('id',new_id,'created',true);
end; $$;
revoke all on function public.dashboard_create_lead(text,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.dashboard_create_lead(text,uuid,text,jsonb) to service_role;

create function public.dashboard_export_leads(p_session_hash text,p_days integer default 30,p_view text default 'all',p_query text default '')
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare cutoff timestamptz := now()-make_interval(days=>p_days);
begin
  if not public.dashboard_session_valid(p_session_hash) then raise exception 'unauthorized'; end if;
  if p_days is null or p_days not in (7,30,90) or p_view is null or p_view not in ('all','overdue','new','contacted','call_booked','proposal_sent','won','lost')
    or p_query is null or char_length(p_query)>200 then raise exception 'invalid_filters'; end if;
  return coalesce((select jsonb_agg(to_jsonb(l) order by l.created_at desc,l.id) from (
    select id,name,email,business_name,contact_detail,entry_channel,website,problem,offer,service,subject,attribution,status,qualified,deal_value,notes,next_action,next_action_at,created_at,updated_at
    from public.website_leads
    where coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'
      and ((p_view='overdue' and status not in ('won','lost') and next_action_at<now())
        or (p_view<>'overdue' and created_at>=cutoff and (p_view='all' or status=p_view)))
      and position(lower(btrim(p_query)) in lower(concat_ws(' ',name,email,nullif(business_name,''),nullif(contact_detail,''),subject,service)))>0
    order by created_at desc,id limit 10001
  ) l),'[]'::jsonb);
end; $$;
revoke all on function public.dashboard_export_leads(text,integer,text,text) from public,anon,authenticated;
grant execute on function public.dashboard_export_leads(text,integer,text,text) to service_role;

-- Preserve existing report fields and add manual contact details.
create or replace function public.dashboard_report(p_session_hash text,p_days integer default 30)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare cutoff timestamptz := now()-make_interval(days=>greatest(1,least(p_days,90)));
begin
  if not public.dashboard_session_valid(p_session_hash) then raise exception 'unauthorized'; end if;
  return jsonb_build_object(
    'leads',coalesce((select jsonb_agg(to_jsonb(l) order by l.created_at desc) from
      (select id,name,email,business_name,contact_detail,entry_channel,website,problem,offer,service,subject,attribution,status,qualified,deal_value,notes,next_action,next_action_at,created_at,updated_at
       from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' order by created_at desc limit 500) l),'[]'::jsonb),
    'leadTotal',(select count(*) from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'websiteLeadTotal',(select count(*) from public.website_leads where entry_channel='website' and created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'outcomes',(select jsonb_build_object('qualified',count(*) filter(where qualified),'won',count(*) filter(where status='won'),'value',coalesce(sum(deal_value) filter(where status='won'),0)) from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'followups',coalesce((select jsonb_agg(to_jsonb(l) order by l.next_action_at) from
      (select id,name,email,business_name,contact_detail,entry_channel,website,problem,offer,service,subject,attribution,status,qualified,deal_value,notes,next_action,next_action_at,created_at,updated_at
       from public.website_leads where status not in ('won','lost') and next_action_at<now() and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' order by next_action_at limit 500) l),'[]'::jsonb),
    'overdue',(select count(*) from public.website_leads where status not in ('won','lost') and next_action_at<now() and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'emailAttention',(select count(*) from public.lead_email_jobs j join public.website_leads l on l.id=j.lead_id where j.status<>'sent' and coalesce(l.attribution->'utm'->>'utm_source','')<>'setup-test'),
    'events',coalesce((select jsonb_agg(to_jsonb(e)) from
      (select event_name,count(*) as count,count(distinct session_hash) as sessions from public.site_events where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' group by event_name) e),'[]'::jsonb),
    'pages',coalesce((select jsonb_agg(to_jsonb(p)) from
      (select page,count(*) as views,count(distinct session_hash) as sessions from public.site_events where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' and event_name='page_view' group by page order by views desc limit 30) p),'[]'::jsonb),
    'sources',coalesce((select jsonb_agg(to_jsonb(s)) from
      (select coalesce(nullif(attribution->'utm'->>'utm_source',''),nullif(attribution->>'referrerHost',''),'direct / unknown') as source,
       count(distinct session_hash) filter(where event_name='page_view') as sessions,
       count(*) filter(where event_name='lead_saved') as leads
       from public.site_events where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' group by source order by leads desc,sessions desc limit 30) s),'[]'::jsonb),
    'campaigns',coalesce((select jsonb_agg(to_jsonb(c)) from
      (select coalesce(nullif(attribution->'utm'->>'utm_campaign',''),'untagged') as campaign,
       coalesce(nullif(attribution->'utm'->>'utm_source',''),nullif(attribution->>'referrerHost',''),'direct / unknown') as source,
       count(*) as leads,count(*) filter(where qualified) as qualified,count(*) filter(where status='won') as won,coalesce(sum(deal_value) filter(where status='won'),0) as value
       from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' group by campaign,source order by leads desc limit 50) c),'[]'::jsonb),
    'posts',coalesce((select jsonb_agg(to_jsonb(p) order by p.leads desc,p.campaign,p.source,p.content nulls last) from
      (select coalesce(nullif(attribution->'utm'->>'utm_campaign',''),'untagged') as campaign,
       coalesce(nullif(attribution->'utm'->>'utm_source',''),nullif(attribution->>'referrerHost',''),'direct / unknown') as source,
       nullif(attribution->'utm'->>'utm_content','') as content,
       count(*) as leads,count(*) filter(where qualified) as qualified,count(*) filter(where status='won') as won,coalesce(sum(deal_value) filter(where status='won'),0) as value
       from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'
       group by campaign,source,content order by leads desc,campaign,source,content nulls last limit 100) p),'[]'::jsonb),
    'services',coalesce((select jsonb_agg(to_jsonb(s)) from
      (select service,count(*) filter(where event_name='service_click') as clicks,count(*) filter(where event_name='lead_saved') as leads
       from public.site_events where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' and service<>'' group by service order by leads desc,clicks desc) s),'[]'::jsonb)
  );
end; $$;

revoke all on function public.dashboard_report(text,integer) from public,anon,authenticated;
grant execute on function public.dashboard_report(text,integer) to service_role;
