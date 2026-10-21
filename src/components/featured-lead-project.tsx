import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function FeaturedLeadProject() {
  return (
    <section
      aria-labelledby="featured-lead-project-heading"
      className="border-t border-neon-navy/10 bg-sunset/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-neon-navy/15 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neon-navy/70">
            Featured project
          </p>
          <p className="text-sm text-neon-navy/70">Prime Metal Roofing · Ontario</p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <h2
              id="featured-lead-project-heading"
              className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-neon-navy sm:text-5xl lg:text-6xl"
            >
              The ad is just
              <br />
              the beginning.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-nebulosity/75">
              For Prime Metal Roofing, we connected a Facebook video ad to a
              higher-intent instant form and a tested lead handoff to Telegram.
              One clear path from first impression to follow-up.
            </p>

            <ol className="mt-9 divide-y divide-neon-navy/15 border-y border-neon-navy/15">
              {[
                ["01", "Make the introduction", "Facebook video creative"],
                ["02", "Ask the right questions", "Higher-intent instant form"],
                ["03", "Connect the team", "Make → Telegram automation"],
              ].map(([number, title, detail]) => (
                <li key={number} className="flex items-baseline gap-4 py-4">
                  <span aria-hidden="true" className="text-xs tabular-nums text-neon-navy/70">
                    {number}
                  </span>
                  <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-neon-navy">{title}</span>
                    <span className="text-xs text-nebulosity/65">{detail}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-5">
              <Link
                href="/portfolio/prime-metal-roofing"
                className="group inline-flex items-center gap-2 rounded-full bg-neon-navy px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-nebulosity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
              >
                Explore the project
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services/facebook-lead-generation"
                data-track="service_click"
                data-service="facebook-lead-generation"
                data-placement="card"
                className="text-sm font-medium text-neon-navy underline decoration-neon-navy/30 underline-offset-4 hover:decoration-neon-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
              >
                Build this for your business
              </Link>
            </div>
          </div>

          <Link
            href="/portfolio/prime-metal-roofing#the-ad"
            aria-label="See the creative in action: watch the Prime Metal Roofing video ad in the case study"
            className="group block overflow-hidden rounded-2xl bg-neon-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
          >
            <div className="relative h-[420px] sm:h-[500px]">
              <Image
                src="/images/prime-metal-roofing-poster.jpg"
                alt="A frame from the Prime Metal Roofing Facebook video ad"
                fill
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/15 px-6 py-5 text-white">
              <div>
                <p className="text-sm font-medium">See the creative in action</p>
                <p className="mt-1 text-xs text-white/65">Facebook video ad · Prime Metal Roofing</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:bg-white group-hover:text-neon-navy">
                <Play aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
