import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-neon-navy px-6 pb-16 pt-24 text-sunset sm:pb-20 sm:pt-36 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <p className="hidden text-xs font-medium uppercase tracking-[0.18em] text-sunset/70 sm:block">
            Websites & Advertising
          </p>
          <h1 className="max-w-2xl text-[clamp(2.125rem,8.5vw,3rem)] font-medium leading-[1.1] tracking-tight sm:mt-6 sm:text-5xl xl:text-[3.5rem]">
            <span className="block">Websites that make an impression.</span>{" "}
            <span className="mt-2 block text-[#c4cba7]">Campaigns that start conversations.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-sunset/80 sm:text-lg">
            We design websites and create advertising that helps your business
            get noticed and generate enquiries.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/services/website-development"
              data-track="service_click"
              data-service="website-development"
              data-placement="hero"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-sunset px-5 py-4 text-sm font-semibold text-neon-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunset sm:px-6"
            >
              Websites
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/services/advertisement-creation"
              data-track="service_click"
              data-service="advertisement-creation"
              data-placement="hero"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-sunset/50 px-5 py-4 text-sm font-semibold text-sunset transition-colors hover:bg-sunset/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunset sm:px-6"
            >
              Advertising
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <Link
            href="/contact?service=website-development&intent=review#inquiry-form"
            data-service="website-development"
            data-placement="hero"
            className="mt-7 inline-flex items-center gap-2 text-sm text-sunset/80 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunset"
          >
            Get a free website review
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-sunset/65">
            Three practical improvements within one business day. No call required.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
          <Link
            href="/portfolio/fidan-construction"
            className="group block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sunset"
          >
            <div className="flex items-center justify-between gap-4 px-6 pt-7 sm:px-8 sm:pt-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-sunset/60">
                  Website project · Ottawa
                </p>
                <h2 className="mt-2 text-xl font-semibold">Fidan Construction</h2>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-sunset/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </Link>
          <figure className="px-6 pb-7 pt-6 sm:px-8 sm:pb-8">
            {/* Client-approved wording recorded in docs/testimonial-sources.md. */}
            <blockquote className="text-xl leading-relaxed tracking-tight text-sunset/90 sm:text-2xl">
              “Myroslav handled our website, SEO and Google Ads. It was useful to
              have someone take care of all three and understand the services we
              offer.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-sunset/60">
              Seyfullah Fidan · Fidan Construction
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
