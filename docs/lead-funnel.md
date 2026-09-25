# Contractor lead funnel

## What is implemented

The `/websites-for-contractors` page contains the offer, Fidan project scope, delivery process, and a short website-review form. It is linked from the homepage, Services menu, and sitemap.

The form sends to `POST /api/leads`. A single database transaction saves the inquiry, first-visit attribution, follow-up action/date, two email jobs, and a saved-inquiry conversion. Only then does the visitor see success. Email delivery runs after the response; a provider outage does not lose the inquiry. All configuration and privileged database access stay on the server.

The existing general Contact and Insights email forms retain EmailJS. The Contact calendar uses the same tracked Calendly component as the review confirmation screen.

## Kredance setup status — September 25, 2026

The dedicated `kredance-website` Supabase project (`jsticdyoptfqtysklclr`) is active. Both committed migrations have been applied; filenames match the versions in its migration history.

A rolled-back database check verified lead creation, duplicate handling, two queued email jobs, follow-up fields, and one saved-inquiry event. All three tables have RLS enabled, deny browser roles access, and allow the backend service role. Automatic RLS still works for new tables. No test leads, queued mail, or analytics events remain.

Security advisors report no warnings or errors. Three informational [RLS Enabled No Policy notices](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) are expected: browser access is deliberately denied and the backend uses the service role. Public execution grants on the dashboard's automatic-RLS helper were revoked while preserving the trigger.

Pending: Resend account and sender verification, server environment variables in Vercel, retry schedule activation, staging email/booking checks, and production launch. Database readiness alone does not activate the website form.
## Preview without accounts

```sh
npm ci
npm run preview:leads
```

Open `http://127.0.0.1:3000/websites-for-contractors?utm_source=preview&utm_campaign=contractor-test` and submit synthetic data such as `preview@example.com`. This runs the actual SQL migration on an ephemeral local PostgreSQL engine and captures both emails. No email is sent externally. The fixture binds to loopback, resets when stopped, and is not a production database.

The local fixture's read-only `http://127.0.0.1:4317/__test/state` reports test inquiries, jobs, captured messages, and funnel events. Use it only for synthetic data. It is not included in the deployed Next.js app.

## Connect production services

1. Create a Supabase project dedicated to Kredance in the intended organization and region. Do not reuse an unrelated project. Apply `supabase/migrations/20260925203437_contractor_lead_capture.sql` and `supabase/migrations/20260925203559_restrict_auto_rls_function.sql` in order through the normal migration process or SQL Editor. Run Supabase's security advisors afterward. The tables/functions grant access only to the backend service role; there are no public lead-reading policies.
2. Create a Resend account and verify a domain you control. Add its required DNS records. Choose an actual verified sender for `LEAD_EMAIL_FROM`; the example sender is not automatically verified. Create a server-side API key authorized to send from that domain.
3. Set all server variables from `.env.example` in the appropriate Vercel environments: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_OWNER_EMAIL`, `LEAD_HASH_SECRET`, `CRON_SECRET`. Use independent random values of at least 32 characters for the two secrets. Never use `NEXT_PUBLIC_` for them or paste them into source control. New `sb_secret_` keys and legacy service-role JWTs are supported; publishable/anon keys are not suitable for this backend.
4. Deploy to a Vercel preview with a separate test database and mailboxes you control. Verify both messages, the saved row, source information, and the scheduled next action. A Resend `sent` queue status means the provider accepted the message; inspect provider delivery/bounce logs to verify actual delivery.
5. Configure email retries before launch. In Supabase, enable Cron and pg_net. In Vault, add `kredance_lead_retry_url` containing the final HTTPS `/api/leads/retry` URL and `kredance_lead_retry_token` containing the matching `CRON_SECRET`. Review and run `supabase/enable-lead-retries.sql`. It schedules a request every five minutes, avoiding a dependency on Vercel's Cron plan. Monitor HTTP results, not only cron execution success. Preview deployments protected by Vercel authentication need an appropriate authenticated test scheduler; do not disable production access protections for a test.
6. Verify on desktop and a real phone. Then merge/deploy and repeat one controlled production inquiry. No production accounts, DNS changes, scheduler, or real email delivery are created by the code alone.

Until the required variables and schema are configured, the API responds with a visible retry/direct-email error rather than claiming the request was saved.

## Lead tracker

Use Supabase Table Editor → `website_leads`. Start with the `status`, `next_action`, and `next_action_at` columns, sorted by the next action date. Statuses: `new`, `contacted`, `call_booked`, `proposal_sent`, `won`, `lost`. These are operator-managed fields; booking analytics do not silently mark a lead's sales status.

The initial task is due 24 hours after submission; adjust the date for weekends and holidays when reviewing your queue. The customer-facing commitment is one business day. Decide a retention period for lead records and abuse-control hashes before launch.

## Funnel reporting

Core counters are stored in `lead_funnel_events`; an analytics upgrade is not required. In Supabase SQL Editor:

```sql
select event_name, location, count(*) as events
from public.lead_funnel_events
where created_at >= now() - interval '30 days'
group by event_name, location
order by event_name, location;
```

| Event | Trigger |
| --- | --- |
| `contractor_page_viewed` | Contractor page mounts |
| `review_cta_clicked` | Hero or offer review link clicked |
| `review_form_started` | First form edit |
| `review_inquiry_saved` | Inquiry transaction commits; retries do not add another conversion |
| `booking_confirmed` | Calendly emits `calendly.event_scheduled` from the mounted scheduling iframe |

Browser event payloads have only a random event ID, an allowed event name, and a fixed placement. The server adds a daily scoped network-address hash for abuse throttling. Form contents and UTM values are not attached to analytics events. Inquiries retain sanitized first-touch UTM labels, the entry path, and referrer hostname in their private lead records. Attribution persists for the browser tab's session; browser-storage restrictions fall back to memory.

These are event counts, not unique-person counts or a full attribution model. Browser blocking/network failure can reduce page/click/booking counts. Saved inquiries remain transactionally recorded. Events from the Contact calendar have `location = 'contact'`; filter to `review` for bookings from this funnel. Bookings made on Calendly's external fallback link are not observed by the embed; use Calendly reporting for those. No appointment is created during automated tests.

Events also forward to the existing Vercel Analytics integration when available. Its custom-event dashboard depends on the Vercel plan; the Supabase counters remain the independent source. URLs sent to Vercel Web Analytics have query strings and fragments removed.

## Delivery recovery and controls

- Same-origin JSON requests, field/body limits, a honeypot, and transactional per-IP/per-email limits protect intake. On Vercel, IP throttling uses its trusted `x-vercel-forwarded-for` header. Another host must supply an explicitly trusted proxy adapter; without one all requests share a conservative bucket.
- A submission UUID remains stable across network retries. Reusing it with different contents returns a conflict instead of silently overwriting the saved lead. Refreshing the browser starts a new submission.
- Email jobs have exclusive two-minute leases and per-message Resend idempotency keys. Failed jobs use backoff and are retried by the protected endpoint. The scheduler processes two due messages per invocation; increase capacity deliberately if volume grows.
- After five failed attempts, or once an uncertain send is older than 23 hours, a job moves to `review`. Resend idempotency expires after 24 hours; automatically retrying after that could duplicate an email. Check provider logs before manually deciding whether to resend.
- Inspect `lead_email_jobs` for `pending`/`review` jobs and the redacted error code. No provider response bodies, email content, or secrets are printed to application logs. `GET` and `POST /api/leads/retry` both require the full bearer secret.

## Verification

```sh
npm test
npx tsc --noEmit
npm run ci:seo
npm run check:lighthouse
```

The tests execute the migration against local PostgreSQL, including transaction rollback, duplicate requests, rate limits, role permissions, event validation, job leases, retries, and the provider retry window. Production builds use the Next.js runtime because the intake endpoints need a server. SEO checks inspect prerendered HTML in `.next/server/app`; Lighthouse starts the production server.

Relevant references: [Supabase data security](https://supabase.com/docs/guides/database/secure-data), [Supabase Cron](https://supabase.com/docs/guides/cron), [Resend email API](https://resend.com/docs/api-reference/emails/send-email), [Calendly completion events](https://calendly.com/help/advanced-calendly-embed-for-developers), [Vercel custom events](https://vercel.com/docs/analytics/custom-events).
