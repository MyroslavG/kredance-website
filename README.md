# Kredance website

The Kredance website is a Next.js application deployed on Vercel.

## Local development

Copy `.env.example` to `.env.local`, fill in the EmailJS values, then run:

```bash
npm ci
npm run dev
```

The site is available at [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run ci:seo
npm run check:lighthouse
```

`ci:seo` builds the native Next.js application and validates its prerendered pages. Lighthouse starts the production server. The lead intake endpoints require a server runtime; static export is no longer used.

## Contractor lead funnel

The contractor landing page, durable lead intake, email queue, and conversion events are documented in [docs/lead-funnel.md](docs/lead-funnel.md). Run `npm run preview:leads` to test the complete flow locally with synthetic data and captured emails, without connecting external accounts.

Production activation requires the Supabase schema, a verified Resend sender, server environment variables, and the retry scheduler described in that guide. Existing Contact/Insights EmailJS settings remain in use.

## Vercel migration

1. Import the GitHub repository into Vercel and keep Next.js as the detected framework.
2. Use `main` as the production branch. No custom build or output-directory override is required.
3. Add all variables listed in `.env.example` to both the Preview and Production environments.
4. Confirm the Vercel preview passes the contact and insights form smoke tests.
5. Add `www.kredance.com` and `kredance.com` to the Vercel project, then update DNS using the records Vercel provides.
6. After the custom domains serve the Vercel deployment successfully, disable GitHub Pages for the repository.

The GitHub workflow runs validation only. Deployments are handled by Vercel's Git integration: pull requests receive preview deployments, while merges to `main` create production deployments.
