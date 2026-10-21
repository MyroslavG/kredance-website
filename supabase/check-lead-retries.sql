-- Read-only checks after production activation. No secret values or lead PII.
select extname, extversion
from pg_extension
where extname in ('pg_cron', 'pg_net');

select n.nspname as schema_name, p.proname, p.prosecdef as security_definer,
  p.proconfig as function_settings,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute,
  has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_can_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where p.proname = 'configure_lead_email_retries'
  and n.nspname in ('public', 'kredance_private');

select
  exists (select 1 from vault.decrypted_secrets
    where name = 'kredance_lead_retry_url'
      and decrypted_secret = 'https://www.kredance.com/api/leads/retry') as canonical_url_configured,
  exists (select 1 from vault.decrypted_secrets
    where name = 'kredance_lead_retry_token'
      and char_length(decrypted_secret) >= 32) as token_configured;

select jobid, jobname, schedule, active
from cron.job
where jobname = 'kredance-lead-email-retries';

select r.start_time, r.end_time, r.status
from cron.job_run_details r
join cron.job j on j.jobid = r.jobid
where j.jobname = 'kredance-lead-email-retries'
order by r.start_time desc limit 10;

select status, count(*) as jobs,
  count(*) filter (where available_at <= now()) as due_jobs
from public.lead_email_jobs
group by status;

-- pg_net retains responses for six hours by default. Empty queues produce no
-- scheduled HTTP calls; use the documented authenticated check after deploy.
select id, created, status_code, timed_out,
  error_msg is not null as transport_error
from net._http_response
where content like '%"worker":"kredance-lead-email-retries"%'
order by created desc limit 10;
