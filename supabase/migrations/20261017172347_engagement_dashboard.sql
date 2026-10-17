-- Additive migration. Existing review forms and email dispatch continue to work.
alter table public.website_leads
  add column service text not null default '',
  add column subject text not null default 'Website review',
  add column session_hash text,
  add column qualified boolean not null default false,
  add column deal_value numeric(12,2) check (deal_value >= 0),
  add column notes text not null default '' check (char_length(notes) <= 4000),
  add column updated_at timestamptz not null default now();

create table public.site_events (
  id uuid primary key,
  event_name text not null check (event_name in ('page_view','service_click','contact_click','form_start','form_error','email_click','phone_click','lead_saved')),
  session_hash text,
  page text not null,
  service text not null default '',
  placement text not null default 'page',
  device text not null default 'unknown',
  attribution jsonb not null default '{}',
  ip_hash text,
  created_at timestamptz not null default now()
);
create index site_events_date_idx on public.site_events(created_at desc);
create index site_events_session_idx on public.site_events(session_hash, created_at desc);
create index site_events_rate_idx on public.site_events(ip_hash, created_at desc) where ip_hash is not null;
alter table public.site_events enable row level security;
revoke all on public.site_events from public, anon, authenticated;
grant select, insert, delete on public.site_events to service_role;

create function public.record_site_event(p_event jsonb, p_ip_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if p_event->>'event' not in ('page_view','service_click','contact_click','form_start','form_error','email_click','phone_click') then raise exception 'invalid_event'; end if;
  perform pg_advisory_xact_lock(hashtextextended('site-event:' || p_ip_hash, 0));
  if (select count(*) from public.site_events where ip_hash = p_ip_hash and created_at > now() - interval '5 minutes') >= 150 then return false; end if;
  insert into public.site_events(id,event_name,session_hash,page,service,placement,device,attribution,ip_hash)
  values ((p_event->>'id')::uuid,p_event->>'event',p_event->>'sessionHash',p_event->>'page',coalesce(p_event->>'service',''),p_event->>'placement',p_event->>'device',p_event->'attribution',p_ip_hash)
  on conflict(id) do nothing;
  return found;
end; $$;
revoke all on function public.record_site_event(jsonb,text) from public,anon,authenticated;
grant execute on function public.record_site_event(jsonb,text) to service_role;

create or replace function public.accept_website_lead(p_submission_id uuid,p_payload_hash text,p_ip_hash text,p_lead jsonb,p_emails jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing public.website_leads; new_id uuid; kind text := coalesce(p_lead->>'kind','contractor_review');
begin
  perform pg_advisory_xact_lock(hashtextextended('ip:' || p_ip_hash,0));
  perform pg_advisory_xact_lock(hashtextextended('email:' || (p_lead->>'email'),0));
  perform pg_advisory_xact_lock(hashtextextended('submission:' || p_submission_id::text,0));
  select * into existing from public.website_leads where submission_id = p_submission_id;
  if found then
    if existing.payload_hash <> p_payload_hash then raise exception 'submission_conflict'; end if;
    return jsonb_build_object('id',existing.id,'created',false);
  end if;
  if (select count(*) from public.website_leads where ip_hash=p_ip_hash and created_at>now()-interval '15 minutes')>=5
    or (select count(*) from public.website_leads where email=p_lead->>'email' and created_at>now()-interval '1 hour')>=3 then raise exception 'rate_limited'; end if;
  if kind not in ('contractor_review','website_review','contact') then raise exception 'invalid_kind'; end if;
  if jsonb_typeof(p_emails)<>'array' or jsonb_array_length(p_emails)<>1 or p_emails->0->>'kind'<>'owner' then raise exception 'invalid_emails'; end if;
  insert into public.website_leads(submission_id,payload_hash,ip_hash,name,email,website,problem,attribution,offer,service,subject,session_hash,next_action)
  values(p_submission_id,p_payload_hash,p_ip_hash,p_lead->>'name',p_lead->>'email',coalesce(p_lead->>'website',''),p_lead->>'problem',p_lead->'attribution',
    case kind when 'contact' then 'project-inquiry' when 'website_review' then 'website-review' else 'contractor-website-review' end,
    coalesce(p_lead->>'service',''),coalesce(p_lead->>'subject','Website review'),p_lead->>'sessionHash',
    case when kind='contact' then 'Reply to the project inquiry' else 'Review website and reply with three improvements' end)
  returning id into new_id;
  insert into public.lead_email_jobs(lead_id,kind,payload) select new_id,item->>'kind',item->'payload' from jsonb_array_elements(p_emails) item;
  if kind='contractor_review' then
    insert into public.lead_funnel_events(id,event_name,location) values(new_id,'review_inquiry_saved','contractor');
  end if;
  insert into public.site_events(id,event_name,session_hash,page,service,placement,attribution)
  values(new_id,'lead_saved',p_lead->>'sessionHash',case when kind='contractor_review' then '/websites-for-contractors' else '/contact' end,coalesce(p_lead->>'service',''),'server',p_lead->'attribution');
  return jsonb_build_object('id',new_id,'created',true);
end; $$;

-- One-time sign-in codes are delivered only to the configured owner's existing EmailJS inbox.
create table public.dashboard_challenges (
  id uuid primary key, code_hash text not null, ip_hash text not null,
  attempts integer not null default 0, used boolean not null default false,
  created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '10 minutes'
);
create table public.dashboard_sessions (
  token_hash text primary key, created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '8 hours'
);
alter table public.dashboard_challenges enable row level security;
alter table public.dashboard_sessions enable row level security;
revoke all on public.dashboard_challenges,public.dashboard_sessions from public,anon,authenticated;
grant select,insert,update,delete on public.dashboard_challenges,public.dashboard_sessions to service_role;

create function public.dashboard_issue_code(p_id uuid,p_code_hash text,p_ip_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('dashboard-login',0));
  if (select count(*) from public.dashboard_challenges where created_at>now()-interval '1 hour')>=5
    or exists(select 1 from public.dashboard_challenges where created_at>now()-interval '1 minute') then return false; end if;
  delete from public.dashboard_challenges where created_at<now()-interval '1 day';
  delete from public.dashboard_sessions where expires_at<now();
  insert into public.dashboard_challenges(id,code_hash,ip_hash) values(p_id,p_code_hash,p_ip_hash);
  return true;
end; $$;

create function public.dashboard_verify_code(p_id uuid,p_code_hash text,p_session_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare challenge public.dashboard_challenges;
begin
  select * into challenge from public.dashboard_challenges where id=p_id for update;
  if not found or challenge.used or challenge.expires_at<now() or challenge.attempts>=5 then return false; end if;
  update public.dashboard_challenges set attempts=attempts+1 where id=p_id;
  if challenge.code_hash<>p_code_hash then return false; end if;
  update public.dashboard_challenges set used=true where id=p_id;
  insert into public.dashboard_sessions(token_hash) values(p_session_hash);
  return true;
end; $$;

create function public.dashboard_session_valid(p_session_hash text)
returns boolean language sql security invoker set search_path = '' as $$
  select exists(select 1 from public.dashboard_sessions where token_hash=p_session_hash and expires_at>now());
$$;
create function public.dashboard_logout(p_session_hash text)
returns void language sql security invoker set search_path = '' as $$
  delete from public.dashboard_sessions where token_hash=p_session_hash;
$$;

create function public.dashboard_report(p_session_hash text,p_days integer default 30)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare cutoff timestamptz := now()-make_interval(days=>greatest(1,least(p_days,90)));
begin
  if not public.dashboard_session_valid(p_session_hash) then raise exception 'unauthorized'; end if;
  return jsonb_build_object(
    'leads',coalesce((select jsonb_agg(to_jsonb(l) order by l.created_at desc) from
      (select id,name,email,website,problem,offer,service,subject,attribution,status,qualified,deal_value,notes,next_action,next_action_at,created_at,updated_at
       from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' order by created_at desc limit 500) l),'[]'::jsonb),
    'leadTotal',(select count(*) from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'outcomes',(select jsonb_build_object('qualified',count(*) filter(where qualified),'won',count(*) filter(where status='won'),'value',coalesce(sum(deal_value) filter(where status='won'),0)) from public.website_leads where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test'),
    'followups',coalesce((select jsonb_agg(to_jsonb(l) order by l.next_action_at) from
      (select id,name,email,website,problem,offer,service,subject,attribution,status,qualified,deal_value,notes,next_action,next_action_at,created_at,updated_at
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
    'services',coalesce((select jsonb_agg(to_jsonb(s)) from
      (select service,count(*) filter(where event_name='service_click') as clicks,count(*) filter(where event_name='lead_saved') as leads
       from public.site_events where created_at>=cutoff and coalesce(attribution->'utm'->>'utm_source','')<>'setup-test' and service<>'' group by service order by leads desc,clicks desc) s),'[]'::jsonb)
  );
end; $$;

create function public.dashboard_update_lead(p_session_hash text,p_id uuid,p_changes jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  if not public.dashboard_session_valid(p_session_hash) then raise exception 'unauthorized'; end if;
  update public.website_leads set status=p_changes->>'status',qualified=(p_changes->>'qualified')::boolean,
    deal_value=nullif(p_changes->>'deal_value','')::numeric,notes=p_changes->>'notes',next_action=p_changes->>'next_action',
    next_action_at=(p_changes->>'next_action_at')::timestamptz,updated_at=clock_timestamp()
  where id=p_id and updated_at=(p_changes->>'updated_at')::timestamptz;
  return found;
end; $$;

revoke all on function public.dashboard_issue_code(uuid,text,text),public.dashboard_verify_code(uuid,text,text),public.dashboard_session_valid(text),public.dashboard_logout(text),public.dashboard_report(text,integer),public.dashboard_update_lead(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.dashboard_issue_code(uuid,text,text),public.dashboard_verify_code(uuid,text,text),public.dashboard_session_valid(text),public.dashboard_logout(text),public.dashboard_report(text,integer),public.dashboard_update_lead(text,uuid,jsonb) to service_role;
