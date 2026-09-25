import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Hammer,
  MapPin,
  MousePointer2,
  Smartphone,
} from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import {
  ContractorPageTracking,
  ReviewCTA,
  WebsiteReviewForm,
} from "@/components/contractor-funnel";

export const metadata = createPageMetadata({
  path: "/websites-for-contractors",
  title: "Websites for Ottawa Contractors | Kredance",
  description:
    "Make it easier for customers to request a quote. Kredance builds websites for Ottawa contractors. Get a free review with three practical improvements.",
});

const included = [
  "Up to five focused pages",
  "Clear services and service areas",
  "Project photos that show your work",
  "A mobile-friendly quote-request form",
  "Basic search setup and conversion tracking",
  "A walkthrough so you know how it works",
];

export default function ContractorsPage() {
  return (
    <div className="flex-1">
      <ContractorPageTracking />
      <section className="overflow-hidden bg-nebulosity px-6 pb-20 pt-32 text-sunset sm:pb-28 sm:pt-40 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sunset/75">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Ottawa contractors &amp; home services
            </p>
            <h1 className="mt-7 max-w-3xl text-[clamp(2.6rem,5.2vw,4.8rem)] font-semibold leading-[1.05] tracking-tight">
              Your work speaks for itself.
              <br />
              <span className="text-sunset/60">Your website should, too.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-sunset/80">
              Make it easier for homeowners to see what you do, trust your
              business, and request a quote. We build websites around that next
              step.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <ReviewCTA
                location="hero"
                className="bg-sunset text-neon-navy hover:bg-white"
              >
                Get a free website review
              </ReviewCTA>
              <a
                href="#client-work"
                className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
              >
                See our contractor work
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-5 text-xs text-sunset/65">
              Three practical improvements. No obligation. No call required.
            </p>
          </div>
          <div className="relative rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-6">
              <span className="text-xs uppercase tracking-[0.18em] text-sunset/70">
                A clearer path to an inquiry
              </span>
              <Hammer className="h-5 w-5 text-sunset/70" aria-hidden="true" />
            </div>
            {[
              [
                "01",
                "Show the right work",
                "Help customers recognize the service they need.",
              ],
              [
                "02",
                "Give them a reason to trust you",
                "Bring projects, service areas, and experience together.",
              ],
              [
                "03",
                "Make the next step obvious",
                "A simple quote request, ready on every screen.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="flex gap-5 border-b border-white/10 py-6 last:border-0 last:pb-0"
              >
                <span className="pt-1 font-mono text-xs text-sunset/70">
                  {number}
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-sunset/65">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f1] px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
          {[
            [
              Smartphone,
              "Easy to use on a phone",
              "Give customers a clear route from your service page to a quote request.",
            ],
            [
              Hammer,
              "Built around your business",
              "Show the jobs you take on, the areas you serve, and the work you’re proud of.",
            ],
            [
              MousePointer2,
              "Know what brings inquiries",
              "Track completed requests and understand where those visitors came from.",
            ],
          ].map(([Icon, title, description]) => {
            const FeatureIcon = Icon as typeof Smartphone;
            return (
              <div key={title as string}>
                <FeatureIcon
                  className="h-6 w-6 text-neon-navy"
                  aria-hidden="true"
                />
                <h2 className="mt-5 text-lg font-semibold text-neon-navy">
                  {title as string}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-nebulosity/75">
                  {description as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="client-work"
        className="scroll-mt-24 bg-white px-6 py-20 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="rounded-3xl bg-neon-navy p-8 text-sunset sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sunset/65">
              Project snapshot
            </p>
            <dl className="mt-8 divide-y divide-white/15">
              {[
                ["Business", "Demolition & restoration"],
                ["Market", "Ottawa, Ontario"],
                ["Scope", "Website, local SEO & Google Ads"],
              ].map(([label, value]) => (
                <div key={label} className="py-5 first:pt-0 last:pb-0">
                  <dt className="text-xs uppercase tracking-widest text-sunset/60">
                    {label}
                  </dt>
                  <dd className="mt-2 text-xl font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-nebulosity/70">
              Relevant work · Ottawa, Ontario
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neon-navy sm:text-4xl">
              Fidan Construction
            </h2>
            <p className="mt-5 leading-relaxed text-nebulosity/75">
              A website for an Ottawa demolition and restoration company, with
              service information, project work, and a clear way to get in
              touch.
            </p>
            <p className="mt-4 leading-relaxed text-nebulosity/75">
              Kredance&apos;s work included website development, local SEO, and
              Google Ads implementation.
            </p>
            <Link
              href="/portfolio/fidan-construction"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-neon-navy underline underline-offset-4"
            >
              Explore the project
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f1] px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-nebulosity/70">
              Contractor Website Launch
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neon-navy sm:text-4xl">
              A focused website.
              <br />A clear scope.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-nebulosity/75">
              We agree on the pages, price, timeline, and revisions before work
              starts. Your review helps us recommend what your business actually
              needs.
            </p>
            <ReviewCTA
              location="offer"
              className="mt-7 bg-neon-navy text-white hover:bg-nebulosity"
            >
              Start with a free review
            </ReviewCTA>
          </div>
          <ul className="divide-y divide-neon-navy/10 rounded-3xl border border-neon-navy/10 bg-white px-7 py-3">
            {included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 py-4 text-sm font-medium text-neon-navy"
              >
                <Check
                  className="h-5 w-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neon-navy">
            From first look to launch.
          </h2>
          <div className="mt-10 grid gap-9 sm:grid-cols-3">
            {[
              [
                "01 / Review",
                "We look at your current website and send three practical improvements.",
              ],
              [
                "02 / Agree & build",
                "We define the scope, gather your content, and build a site around your services.",
              ],
              [
                "03 / Test & launch",
                "We test the mobile experience, inquiry delivery, and tracking before launch.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="border-t border-neon-navy/20 pt-6">
                <h3 className="text-lg font-semibold text-neon-navy">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-nebulosity/75">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="website-review"
        className="scroll-mt-20 bg-[#f5f5f1] px-6 py-20 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-nebulosity/70">
              Your next step
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neon-navy sm:text-4xl">
              Let&apos;s find the friction
              <br />
              in your website.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-nebulosity/75">
              Send us your website. We&apos;ll look at the mobile experience,
              how clearly you explain your services, and how easy it is to
              request a quote.
            </p>
            <p className="mt-5 max-w-md leading-relaxed text-nebulosity/75">
              You&apos;ll receive three practical improvements within one
              business day. You decide what happens next.
            </p>
            <p className="mt-7 text-sm text-nebulosity/75">
              Starting without a website?{" "}
              <Link
                href="/contact"
                className="font-medium text-neon-navy underline underline-offset-4"
              >
                Tell us about your business.
              </Link>
            </p>
          </div>
          <WebsiteReviewForm />
        </div>
      </section>
    </div>
  );
}
