# Dependency security maintenance

Updated on October 24, 2026:

- Next.js and eslint-config-next are pinned together at 16.4.3; Next's image
  dependency is now sharp 0.35.5.
- shadcn 4.22.1 is a development dependency. Its CSS is compiled by Tailwind at
  build time; the CLI is not needed by the deployed server. Build environments
  must install development dependencies (the existing `npm ci` workflow does).
- Compatible transitive security updates are recorded in package-lock.json.

Run `npm run check:security` to check production dependencies. CI runs this after
installation and fails on high or critical advisories. The production audit on
October 24 reported zero vulnerabilities; this is a dependency advisory check,
not a guarantee that the application has no security defects.

The full audit still reports 16 development-tool findings (13 high, 1 moderate,
2 low), all in the Lighthouse CI dependency tree. npm's suggested force-fix
would downgrade @lhci/cli to 0.1.0, so it was not applied. Lighthouse runs against
the local build; its packages are not imported by the application. Keep that
tooling limited to trusted project builds and review its upstream updates
separately. Do not use `npm audit fix --force` as a release shortcut.

Framework changes require unit/database and desktop/mobile browser tests, lint,
the production build, SEO validation, and the existing Lighthouse checks.

References: [Next.js release](https://github.com/vercel/next.js/releases/tag/v16.4.3),
[image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw),
[cache advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr).
