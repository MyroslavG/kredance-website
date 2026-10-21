import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HomeCampaignFeature() {
  return (
    <section className="bg-[#f5f5f1] px-6 py-14 text-neon-navy sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 sm:grid-cols-[1fr_170px] lg:gap-20">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-neon-navy/65">
              Already have a good website?
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Put your work in front of more customers.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neon-navy/75">
              For Prime Metal Roofing, we connected a Facebook video ad to an
              enquiry form and automatic Telegram notifications. We can scope a
              campaign around your audience, offer, and goals.
            </p>
            <Link
              href="/services/facebook-lead-generation"
              data-track="service_click"
              data-service="facebook-lead-generation"
              data-placement="card"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-nebulosity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
            >
              Explore Facebook lead generation
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
          <p>Have something else in mind? We also build apps, shops, and automation.</p>
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
