-- Extension installation is an explicit operational step, not part of the
-- portable application schema. See supabase/enable-lead-retries.sql.
create schema if not exists kredance_private;
revoke all on schema kredance_private from public, anon, authenticated;
grant usage on schema kredance_private to service_role;

create or replace function kredance_private.configure_lead_email_retries(p_url text, p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_secret record;
  v_name text;
  v_value text;
  v_job record;
  v_changed boolean := false;
  v_command constant text := $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_url'),
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
        'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_token')),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    ) as request_id
    where exists (
      select 1 from public.lead_email_jobs
      where (status = 'pending' and available_at <= now())
        or (status = 'processing' and lease_until < now())
    );
  $job$;
begin
  -- A definer's current_user is its owner. The active request role must still
  -- be the server's service_role; no browser role can execute either function.
  if current_setting('role', true) is distinct from 'service_role' then
    raise exception 'retry_setup_forbidden' using errcode = '42501';
  end if;
  if p_url is distinct from 'https://www.kredance.com/api/leads/retry'
    or p_token is null or char_length(p_token) not between 32 and 512
    or p_token ~ '[^!-~]' then
    raise exception 'retry_setup_invalid_configuration' using errcode = '22023';
  end if;
  if to_regclass('vault.decrypted_secrets') is null
    or to_regprocedure('cron.schedule(text,text,text)') is null
    or to_regnamespace('net') is null then
    raise exception 'retry_setup_extensions_required';
  end if;

  -- Cold starts can overlap. Only the two fixed entries and one fixed job can
  -- be changed. All statements are static, with an empty function search_path.
  perform pg_advisory_xact_lock(21212414);
  foreach v_name in array array['kredance_lead_retry_url', 'kredance_lead_retry_token'] loop
    v_value := case v_name when 'kredance_lead_retry_url' then p_url else p_token end;
    select id, decrypted_secret into v_secret from vault.decrypted_secrets where name = v_name;
    if not found then
      perform vault.create_secret(v_value, v_name, 'Kredance lead notification retry worker');
      v_changed := true;
    elsif v_secret.decrypted_secret is distinct from v_value then
      perform vault.update_secret(v_secret.id, v_value, v_name, 'Kredance lead notification retry worker');
      v_changed := true;
    end if;
  end loop;

  select jobid, schedule, command, active into v_job from cron.job
  where jobname = 'kredance-lead-email-retries' and username = current_user;
  if not found then
    perform cron.schedule('kredance-lead-email-retries', '* * * * *', v_command);
    v_changed := true;
  elsif v_job.schedule is distinct from '* * * * *'
    or v_job.command is distinct from v_command or v_job.active is distinct from true then
    perform cron.alter_job(v_job.jobid, schedule := '* * * * *', command := v_command, active := true);
    v_changed := true;
  end if;
  return jsonb_build_object('configured', true, 'changed', v_changed);
end;
$function$;

revoke all on function kredance_private.configure_lead_email_retries(text, text) from public, anon, authenticated;
grant execute on function kredance_private.configure_lead_email_retries(text, text) to service_role;

-- Only this invoker wrapper is exposed through PostgREST. The private schema
-- must not be added to the Data API's exposed schemas.
create or replace function public.configure_lead_email_retries(p_url text, p_token text)
returns jsonb
language sql
security invoker
set search_path = ''
as $function$
  select kredance_private.configure_lead_email_retries(p_url, p_token);
$function$;

revoke all on function public.configure_lead_email_retries(text, text) from public, anon, authenticated;
grant execute on function public.configure_lead_email_retries(text, text) to service_role;
