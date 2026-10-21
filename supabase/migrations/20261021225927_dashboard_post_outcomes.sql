-- Add saved-inquiry outcomes by existing post attribution. All earlier report keys
-- and owner-session checks remain unchanged; no event join or new tracking is needed.
-- Missing/empty content is JSON null, distinct from an explicit label like 'untagged'.
create or replace function public.dashboard_report(p_session_hash text,p_days integer default 30)
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
