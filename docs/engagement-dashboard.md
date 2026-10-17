# Kredance engagement and lead workspace

Open https://www.kredance.com/dashboard and sign in as **myroslav@kredance.com**.
The eight-digit code goes to the existing EmailJS Contact template's fixed notification inbox.
Codes expire in ten minutes, allow five attempts, and work once. Login emails are limited
to one per minute and five per hour. Sessions expire after eight hours; signing out revokes them.
The dashboard is excluded from search, visitor analytics, and Clarity.

## Daily use

1. Open overdue follow-ups. This queue includes all dates, regardless of reporting period.
2. Open each inquiry, reply using the email link, and set its status and next action.
3. Mark qualified inquiries and enter a deal value in CAD. Mark won/lost when decided.
4. Check notifications awaiting delivery/review. A saved inquiry remains available even when email fails.
   The existing manual email recovery process remains in `docs/lead-funnel.md`;
   no new retry schedule or booking verification was enabled.

## Weekly review

- Compare campaign results by qualified inquiries and won value, not just page views.
- Look for form errors and service pages with interest but few inquiries.
- Review Clarity recordings/heatmaps for confusing interactions.
- Use Google Search Console for search queries, impressions, clicks, and indexing.
- Use the link builder for LinkedIn, email, or advertising campaigns. Labels must not contain personal data.

Reports show rolling 7/30/90-day periods. Visits are consenting browser-tab sessions with a
30-minute inactivity timeout, **not identified people**. Declined consent, blockers, and best-effort
network delivery reduce engagement counts. Saved leads include all successfully stored inquiries.
The event table contains independent action counts, not an ordered funnel. Traffic-source/service
event reports start at this deployment; the lead/campaign reports also include older saved leads.
Qualified/won/value totals use the inquiry's creation date and current status, not the closing date.
Lead lists cap at 500; summary totals cover the full selected period. Overdue lists show the oldest 500.
Test submissions tagged `utm_source=setup-test` are excluded. Reporting filters do not delete data.

## Configuration

- Existing Supabase and EmailJS server secrets are reused. No new secret is needed.
- `DASHBOARD_OWNER_EMAIL` optionally overrides the approved default owner. The Contact template's
  fixed recipient must belong to that owner. Changing this variable does not change EmailJS recipients.
- Clarity project `yz8ppr5607` is public configuration. `NEXT_PUBLIC_CLARITY_PROJECT_ID` can override it;
  an explicitly empty value disables Clarity. It loads only on kredance.com/www.kredance.com after consent.
- Clarity project settings use Strict masking. Inquiry forms also carry `data-clarity-mask`.
  No form values or private lead details are submitted as analytics properties.
- Vercel analytics/performance measurements and first-party visit events require analytics consent.
  Submission storage, abuse prevention, and inquiry source attribution remain operational without consent.
- Search Console verification is a public Google verification tag in the root metadata. Keep it in place.

## Deployment and security

Migration `20261017172347_engagement_dashboard.sql` is additive and compatible with the previous
contractor form. It adds private analytics/auth tables, lead-management fields, and restricted RPCs.
All tables have RLS enabled and deny `anon`/`authenticated` access. Only the server service role can
call the RPCs; dashboard reads and edits additionally require an unexpired hashed owner session.
Requests are bounded, mutations enforce same origin, cookies are HttpOnly/Secure/SameSite=Strict
in production, and private API responses use no-store. Codes and session tokens are stored as HMACs.

The migration tool returned an expired request-state error, so the tested SQL was applied through
the project's SQL editor in one transaction and recorded in `supabase_migrations.schema_migrations`.
No customer records were deleted. The paused database was restored before deployment.

For local verification, run `npm run preview:leads`. This uses an ephemeral PGlite database and
captures EmailJS messages locally, including sign-in codes; it never sends those emails. Run
`npm test`, `npm run build`, and `npm run check:seo` before deployment.
