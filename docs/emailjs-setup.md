# Existing EmailJS setup

The contractor funnel reuses the site's existing EmailJS account, Gmail service `service_tdjf70m`, and Contact template `template_k0nuuq2`. The Insights form keeps `template_c7mv3gp`. No new service, template, sending domain, or paid upgrade is needed for the chosen workflow.

## Public Vercel configuration

Use Vercel's **Config** type for these values. Vercel rejects public-framework prefixes on Secret entries. Verified Config entries are saved for Production and general Preview, and the working contractor-branch overrides are retained. The account owner approved replacing the old public Secret entries; private credentials remain Secret.

| Variable | Public value |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | `service_tdjf70m` |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | `template_k0nuuq2` |
| `NEXT_PUBLIC_EMAILJS_INSIGHTS_TEMPLATE_ID` | `template_c7mv3gp` |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | `JWGZjO3KXrRoBb_3Z` |

## Notification behavior

One notification goes to the existing recipient fixed in the Contact template. Customer confirmation appears on the website after the database transaction commits. No automatic customer email is sent. Replying to the notification uses the visitor's email address.

The queue freezes these template inputs at acceptance:

| Template input | Value |
| --- | --- |
| `name`, `from_name` | Visitor name |
| `from_email`, `reply_to` | Visitor email |
| `subject` | New contractor website review request |
| `message` | Website, problem, contact details, campaign attribution, and next action |
| `time` | Request timestamp |
| `lead_reference` | Saved lead ID, added when sending for Email History reconciliation |

The current Contact template already uses `from_name`, `from_email`, `subject`, and `message`. Its recipient remains fixed in EmailJS; the API never accepts a visitor-selected notification recipient. Its Auto-Reply is unlinked, avoiding extra messages.

## Server access

The website server sends after saving the inquiry, so it needs the existing EmailJS account's non-browser API access. On September 25, 2026, with the account owner's confirmation, **Allow EmailJS API for non-browser applications** was enabled in **Account → Security → API Settings**. **Use Private Key** remains checked; both settings were verified after reloading the page.

The existing private key is saved in Vercel as the server-only secret **EMAILJS_PRIVATE_KEY** for Production and the `codex/contractor-lead-funnel` preview branch. It was transferred with the account owner's confirmation without displaying its value. Never send it in chat, embed it in the browser, or commit it. The existing public service/template/key environment variables remain in use. An optional `EMAILJS_LEAD_OWNER_TEMPLATE_ID` override is available but not needed for this account.

No EmailJS security setting changes the database permissions. Supabase tables remain accessible only to the website backend.

## Verification

The approved deployed-preview test on September 25, 2026 saved one inquiry and one conversion, displayed the customer confirmation, and sent one owner notification. The job finished as `sent` with one attempt and no error; EmailJS Email History showed `OK` through the existing Gmail service and Contact Us template at 21:34 UTC. The account owner confirmed receipt in the inbox. No automatic customer email was sent.

After the server settings and Vercel variables are configured, submit one controlled inquiry and verify: one saved lead, one owner email, and one saved-inquiry conversion. Check EmailJS Email History and the inbox. Customer confirmation should appear on the page. Review jobs with uncertain delivery before attempting another send.

References: [EmailJS server setup](https://github.com/emailjs-com/emailjs-nodejs), [REST send contract and rate limit](https://www.emailjs.com/docs/rest-api/send/), [Email History](https://www.emailjs.com/docs/rest-api/history/).
