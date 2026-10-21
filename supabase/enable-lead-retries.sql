-- Administrator preparation. No token or job is created by this script.
-- Apply before deploying production with LEAD_RETRY_SETUP_ENABLED=1.
-- Next.js instrumentation transfers its existing CRON_SECRET directly to the
-- service-role-only setup RPC; the token never passes through this file.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
commit;

-- Apply the configure_lead_email_retries migration, deploy, then verify with
-- supabase/check-lead-retries.sql. See docs/lead-funnel.md for HTTPS checks.
-- Disable the setup flag and redeploy before unscheduling for rollback;
-- otherwise a later cold start will restore the configured schedule.
