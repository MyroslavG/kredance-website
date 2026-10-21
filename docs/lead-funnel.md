# Contractor lead funnel

## What is implemented

The `/websites-for-contractors` page contains the offer, Fidan project scope, delivery process, and a short website-review form. It is linked from the homepage, Services menu, and sitemap.

The form sends to `POST /api/leads`. A single database transaction saves the inquiry, first-visit attribution, follow-up action/date, one owner-notification email job, and a saved-inquiry conversion. Only then does the visitor see success. Email delivery runs after the response; a provider outage does not lose the inquiry. All configuration and privileged database access stay on the server.

General Contact inquiries, contractor reviews, and Insights website-review requests use the same durable intake and EmailJS queue. The Contact calendar uses the same tracked Calendly component as the review confirmation screen.

## Kredance setup status — September 25, 2026

The dedicated `kredance-website` Supabase project (`jsticdyoptfqtysklclr`) is active. All three committed migrations have been applied; filenames match the versions in its migration history.

A rolled-back database check verified lead creation, duplicate handling, one queued EmailJS notification, follow-up fields, and one saved-inquiry event. All three tables have RLS enabled, deny browser roles access, and allow the backend service role. Automatic RLS still works for new tables.

Security advisors report no warnings or errors. Three informational [RLS Enabled No Policy notices](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) are expected: browser access is deliberately denied and the backend uses the service role. Public execution grants on the dashboard's automatic-RLS helper were revoked while preserving the trigger.

EmailJS non-browser API access is enabled with the account owner's confirmation. Private-key protection remains enabled, and both settings were verified after reloading the account page.

Vercel access to `ua-connect/kredance-website` is confirmed. `EMAILJS_PRIVATE_KEY`, `SUPABASE_SECRET_KEY`, `LEAD_HASH_SECRET`, and `CRON_SECRET` are saved as secrets, and `SUPABASE_URL` is saved as configuration, each scoped to Production and the `codex/contractor-lead-funnel` preview branch. The account owner entered the Supabase key directly.

The four `NEXT_PUBLIC_EMAILJS_*` values are saved as **Config** for Production and general Preview, with the working contractor-branch overrides retained. With the account owner's approval, the old Secret entries were replaced using the verified public values from `docs/emailjs-setup.md`. All four names, types, and scopes were verified in Vercel after saving. The private EmailJS/Supabase keys and hashing/retry secrets remain Secret.

The approved deployed-preview test passed at 21:34 UTC on September 25: one synthetic `Kredance Setup Test` inquiry was saved with `setup-test` / `emailjs-verification` attribution, the next action and date, and one saved-inquiry conversion. The page showed its success confirmation. The owner-notification job is `sent` after exactly one attempt, and EmailJS Email History shows one `OK` request through Gmail / Contact Us. The account owner confirmed receipt in the inbox. The labeled test lead, its sent job, and three test funnel events remain for verification; exclude them from sales reporting.

The account owner approved the September launch without a retry schedule or a real booking check. That historical launch state must not be treated as proof that a worker is active. The October 21 audit found no Cron/pg_net extensions, no real saved inquiries, and no pending notification jobs; the only saved lead was the original setup test. The scheduler rollout below closes a latent notification gap, rather than recovering an identified lost real inquiry. Real booking behavior remains unverified. Saved environment variables require a new deployment before they take effect.

## Preview without accounts

```sh
npm ci
npm run preview:leads
```

Open `http://127.0.0.1:3000/websites-for-contractors?utm_source=preview&utm_campaign=contractor-test` and submit synthetic data such as `preview@example.com`. This runs the actual SQL migration on an ephemeral local PostgreSQL engine and captures the owner notification. No email is sent externally. The fixture binds to loopback, resets when stopped, and is not a production database.

The local fixture's read-only `http://127.0.0.1:4317/__test/state` reports test inquiries, jobs, captured messages, and funnel events. Use it only for synthetic data. It is not included in the deployed Next.js app.

## Connect production services

1. Create a Supabase project dedicated to Kredance in the intended organization and region. Do not reuse an unrelated project. Apply `supabase/migrations/20260925203437_contractor_lead_capture.sql` , `supabase/migrations/20260925203559_restrict_auto_rls_function.sql`, and `supabase/migrations/20260925204943_emailjs_delivery_queue.sql` in order through the normal migration process or SQL Editor. Run Supabase's security advisors afterward. The tables/functions grant access only to the backend service role; there are no public lead-reading policies.
2. Reuse the existing EmailJS Gmail service and Contact template. The inspected account has two templates, both used by Contact and Insights. This funnel sends one notification to the Contact template's existing recipient and shows confirmation on the page; no customer email or new template is required. See `docs/emailjs-setup.md` for the field mapping and server setting.
3. Retain `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`. Set server-only `EMAILJS_PRIVATE_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `LEAD_HASH_SECRET`, and `CRON_SECRET` in Vercel. `EMAILJS_LEAD_OWNER_TEMPLATE_ID` is an optional override; leave it empty to use the existing Contact template. Use independent random values of at least 32 characters for the two generated secrets. Never prefix private keys with `NEXT_PUBLIC_` or put them in source control. The old `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, and `LEAD_OWNER_EMAIL` variables are no longer used.
4. On a Vercel preview, verify the saved lead, source information, next action, and one notification in the existing inbox. `sent` means EmailJS returned success; check its Email History and the inbox for delivery. EmailJS returns plain `OK`, so `provider_id` is left null rather than fabricating an email ID.
5. Activate the email retry scheduler using the rollout below. It is required for notifications skipped by concurrent sends or deferred after a confirmed provider rate limit. A deployed retry endpoint without a recurring worker is incomplete.
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

## Google Analytics

Production uses GA4 property `464893846`, web stream `9870582209`, measurement ID `G-6DG9G4KKS4`. The tag loads only after analytics consent on the canonical production hosts and known public pages. Enhanced Measurement is disabled in the stream: page views are sent explicitly so query strings, form contents, and private routes are not collected automatically. Advertising storage, Google Signals, and ad personalization stay disabled.

`generate_lead` is registered as a key event with once-per-event counting and no default monetary value. It fires only after the server confirms that an enquiry was saved. The submission ID is used locally to suppress repeat events and is never transmitted to Google. Setup-test, internal, and preview attribution are excluded. Form values are never included; service and placement values are allowlisted. Consent refusal and blockers reduce analytics counts, so saved records in `website_leads` remain the authoritative enquiry count.

The October 21 rollout passed 53 automated tests, the production build, the SEO check for 68 pages, and all configured Lighthouse checks. Browser checks submitted the contractor review, general enquiry, and service-specific review against an isolated local database and email capture: three saved requests, three notification jobs sent once, and no real email sent.

## Delivery recovery and controls

- Same-origin JSON requests, field/body limits, a honeypot, and transactional per-IP/per-email limits protect intake. On Vercel, IP throttling uses its trusted `x-vercel-forwarded-for` header. Another host must supply an explicitly trusted proxy adapter; without one all requests share a conservative bucket.
- A submission UUID remains stable across network retries. Reusing it with different contents returns a conflict instead of silently overwriting the saved lead. Refreshing the browser starts a new submission.
- Email jobs have exclusive two-minute leases. The database allows one active sender across workers and a 1.1-second cooldown after each attempt, matching EmailJS's one-request-per-second limit. The existing browser forms share the account quota; any confirmed 429 rejection is queued with backoff.
- Intake attempts the new lead's notification immediately. The scheduled worker drains up to ten due jobs, waits 1.2 seconds between deliveries, and retries an initially empty claim once to cross a recent sender's cooldown. It stops starting new jobs after 30 seconds, leaving room for the three eight-second network timeouts within the route's 60-second limit. A future worker handles remaining due jobs.
- Only explicit HTTP 429 rejections retry automatically, up to five attempts. Timeouts, connection loss, unexpected success bodies, 5xx responses, permanent errors, and expired leases move to `review`. EmailJS does not document a send-idempotency contract, so delivery uncertainty is not treated as permission to resend. If the provider accepted mail but saving its status failed, lease expiry also requires review.
- For a `review` job, check EmailJS Email History using the `lead_reference` template parameter and timestamp before deciding on any manual retry. Do not blindly reset the status. Existing queued payloads from the old provider are preserved for review and never sent through EmailJS.
- Inspect `lead_email_jobs` for `pending`/`review` jobs and the redacted error code. No provider response bodies, email content, or secrets are printed to application logs. `GET` and `POST /api/leads/retry` both require the full bearer secret.

## Production scheduler rollout

Use Supabase Cron + pg_net. Vercel Hobby Cron only runs daily, which is too slow for timely enquiry notifications. No new token is needed: the existing server-only `CRON_SECRET` authenticates the worker. A production-only setup hook passes it directly from Vercel to a restricted Supabase RPC over HTTPS. It never prints or returns the value. Extension installation remains an explicit administrator operation, separate from the portable application schema.

1. As project administrator, run `supabase/enable-lead-retries.sql` to install Cron and pg_net. Then apply `supabase/migrations/20261021213041_configure_lead_email_retries.sql` through the normal migration process. The migration creates an invoker RPC and a private definer core with an empty search path. Only `service_role` can execute them; the core also checks the active role. Do not expose `kredance_private` through the Data API or grant browser roles access to Vault/Cron. Run security advisors after applying it.
2. Save nonsecret `LEAD_RETRY_SETUP_ENABLED=1` for **Production only** in Vercel. Retain the existing production `CRON_SECRET`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY`. Do not rotate or copy the protected token. The setup hook runs only in a production Node server, skips builds/preview/local development, and uses the existing backend key. It accepts only the exact canonical retry URL, writes the two fixed Vault entries, and creates one fixed job. A database lock serializes concurrent cold starts; unchanged settings cause no writes.
3. Deploy the updated worker and instrumentation. A production server start invokes the restricted setup RPC, storing `kredance_lead_retry_url` and `kredance_lead_retry_token` in Vault and activating `kredance-lead-email-retries` every minute. The cron command contains Vault lookups, never a literal token. It calls the site only when a pending job is due or a processing lease has expired. Jobs marked `review` are never automatically resent. The fixed `lead_retry_setup_configured` log indicates a configuration change; `lead_retry_setup_failed` requires investigation. A failed setup does not prevent the website starting. An unauthenticated request to `https://www.kredance.com/api/leads/retry` must return HTTP 401 with `worker: kredance-lead-email-retries` and no job details.
4. Run `supabase/check-lead-retries.sql`. Confirm one active named job, both Vault configuration checks, and a successful scheduled SQL execution. An empty queue intentionally produces no HTTP request.
5. Verify the HTTPS path separately with the following authenticated call through pg_net. It returns only a request ID. With no due jobs it sends no email. If jobs exist, inspect their status before invoking the worker because this is a real dispatch, not a dry run.

   ```sql
   select net.http_post(
     url := (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_url'),
     headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
       'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'kredance_lead_retry_token')),
     body := '{}'::jsonb,
     timeout_milliseconds := 60000
   ) as request_id;
   ```

   After the transaction commits, inspect the returned ID in `net._http_response`: HTTP 200, no timeout, and the expected worker name plus `claimed`/`sent` counts. HTTP 401 indicates a token mismatch; HTTP 503 indicates worker/configuration failure; redirects or HTML indicate the wrong endpoint/proxy. A successful Cron SQL run alone proves only that the request was queued. pg_net response records expire after six hours by default.
6. Complete the authorized production smoke test and confirm one lead, one sent owner job, and actual inbox receipt. For an end-to-end scheduler check, arrange a clearly marked test notification that is pending until its `available_at`, then confirm it is sent by a subsequent scheduled run. Do not reset a real `review` job to manufacture a test. Record activation and verification evidence after the live checks; this source document alone does not prove activation.

Rollback: first disable `LEAD_RETRY_SETUP_ENABLED` and redeploy, then run `select cron.unschedule('kredance-lead-email-retries');`. Otherwise a later production cold start will restore the schedule. Unscheduling stops future wakeups without deleting leads, jobs, or Vault entries. A worker already running can finish its claimed job. Continue checking saved enquiries manually while scheduling is disabled. Do not drop the extensions, which could affect unrelated jobs.

Sources checked for this rollout: [Supabase Cron installation](https://supabase.com/docs/guides/cron/install), [named job updates](https://supabase.com/docs/guides/cron/quickstart), [Vault-backed scheduling](https://supabase.com/docs/guides/functions/schedule-functions), [pg_net response verification](https://supabase.com/docs/guides/database/extensions/pg_net), and [Vercel Cron plan limits](https://vercel.com/docs/cron-jobs/usage-and-pricing). The current Supabase changelog was checked for relevant Cron/pg_net breaking changes.

## Verification

```sh
npm test
npx tsc --noEmit
npm run ci:seo
npm run check:lighthouse
```

The tests execute the migrations against local PostgreSQL, including restricted setup role checks, fixed configuration validation, idempotent registration, burst draining, deadline bounds, transaction rollback, duplicate requests, rate limits, role permissions, event validation, job leases, retries, uncertain outcomes, lost completion writes, and the EmailJS HTTP contract. Production builds use the Next.js runtime because the intake endpoints need a server. SEO checks inspect prerendered HTML in `.next/server/app`; Lighthouse starts the production server.

Relevant references: [Supabase data security](https://supabase.com/docs/guides/database/secure-data), [Supabase Cron](https://supabase.com/docs/guides/cron), [EmailJS send API](https://www.emailjs.com/docs/rest-api/send/), [Calendly completion events](https://calendly.com/help/advanced-calendly-embed-for-developers), [Vercel custom events](https://vercel.com/docs/analytics/custom-events).
