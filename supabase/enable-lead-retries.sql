-- Activation step, not part of the data migration. Run only after the final
-- HTTPS endpoint and matching CRON_SECRET are configured. Add the two named
-- secrets through Supabase Vault first; no credentials belong in this file.
create extension if not exists pg_cron;
create extension if not exists pg_net;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'kredance_lead_retry_url' and decrypted_secret ~ '^https://[^/]+/api/leads/retry$')
    or not exists (select 1 from vault.decrypted_secrets where name = 'kredance_lead_retry_token' and char_length(decrypted_secret) >= 32)
  then raise exception 'Configure the Kredance retry URL and token in Vault first'; end if;
end;
$$;

select cron.schedule(
  'kredance-lead-email-retries',
  '*/5 * * * *',
  $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_url'),
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
        'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_token')),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$
);

-- Inspect HTTP response status in net._http_response as well as Cron run history.
-- Pause with: select cron.unschedule('kredance-lead-email-retries');
