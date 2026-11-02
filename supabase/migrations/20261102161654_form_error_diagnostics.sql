-- Add only fixed, non-personal diagnostics. Existing rows remain unknown.
alter table public.site_events
  add column error_code text check (error_code in ('validation','request_blocked','rate_limited','submission_conflict','service_unavailable','network','timeout','unexpected_response','client_error')),
  add column error_field text check (error_field in ('name','email','website','problem','subject')),
  add column http_status integer check (http_status between 400 and 599),
  add constraint site_event_diagnostics_only_on_errors check (
    event_name = 'form_error' or (error_code is null and error_field is null and http_status is null)
  );

create or replace function public.record_site_event(p_event jsonb, p_ip_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare diagnostic jsonb; code text; field_name text; status_code integer;
begin
  if p_event->>'event' not in ('page_view','service_click','contact_click','form_start','form_error','email_click','phone_click') then raise exception 'invalid_event'; end if;
  if p_event->>'event' = 'form_error' then
    diagnostic := p_event->'diagnostic';
    if diagnostic->>'code' in ('validation','request_blocked','rate_limited','submission_conflict','service_unavailable','network','timeout','unexpected_response','client_error') then
      code := diagnostic->>'code';
      if code = 'validation' and diagnostic->>'field' in ('name','email','website','problem','subject') then field_name := diagnostic->>'field'; end if;
      if jsonb_typeof(diagnostic->'httpStatus') = 'number' and diagnostic->>'httpStatus' ~ '^[45][0-9]{2}$' then status_code := (diagnostic->>'httpStatus')::integer; end if;
    end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended('site-event:' || p_ip_hash, 0));
  if (select count(*) from public.site_events where ip_hash = p_ip_hash and created_at > now() - interval '5 minutes') >= 150 then return false; end if;
  insert into public.site_events(id,event_name,session_hash,page,service,placement,device,attribution,ip_hash,error_code,error_field,http_status)
  values ((p_event->>'id')::uuid,p_event->>'event',p_event->>'sessionHash',p_event->>'page',coalesce(p_event->>'service',''),p_event->>'placement',p_event->>'device',p_event->'attribution',p_ip_hash,code,field_name,status_code)
  on conflict(id) do nothing;
  return found;
end; $$;
revoke all on function public.record_site_event(jsonb,text) from public,anon,authenticated;
grant execute on function public.record_site_event(jsonb,text) to service_role;
