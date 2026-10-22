import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HomeCampaignFeature() {
  return (
    <section className="bg-[#f5f5f1] px-6 py-14 text-neon-navy sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_170px] lg:gap-20">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Advertising with a clear next step.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neon-navy/75">
              For Prime Metal Roofing, we created a Facebook video ad and
              connected the enquiry form to the team’s Telegram notifications.
            </p>
            <figure className="mt-6 max-w-2xl border-l-2 border-neon-navy/20 pl-5">
              {/* Approved wording matches the Prime Metal Roofing testimonial. */}
              <blockquote className="text-lg leading-relaxed text-neon-navy/90">
                “Myroslav had our Facebook ad campaign set up in just a few
                hours, and leads started coming in right away.”
              </blockquote>
              <figcaption className="mt-3 text-sm text-neon-navy/65">
                Alex Fedoriuk · Prime Metal Roofing
              </figcaption>
            </figure>
            <Link
              href="/services/advertisement-creation"
              data-track="service_click"
              data-service="advertisement-creation"
              data-placement="card"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-nebulosity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
            >
              Explore advertising
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <Link
            href="/portfolio/prime-metal-roofing#the-ad"
            className="group flex items-center gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy sm:block"
          >
            <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-neon-navy sm:w-full">
              <Image
                src="/images/prime-metal-roofing-poster.jpg"
                alt="Prime Metal Roofing Facebook video advertisement"
                fill
                sizes="(min-width: 640px) 170px, 96px"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-neon-navy/70 text-white transition-colors group-hover:bg-neon-navy">
                  <Play aria-hidden="true" className="h-4 w-4" />
                </span>
              </span>
            </div>
            <span className="text-sm font-medium sm:mt-3 sm:block sm:text-center sm:text-xs">
              Watch the roofing ad
            </span>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-neon-navy/15 pt-6 text-sm text-neon-navy/70">
          <p>We can also connect your tools and automate the enquiry handoff.</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-medium text-neon-navy underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
          >
            View all services
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
