import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-neon-navy px-6 pb-16 pt-24 text-sunset sm:pb-20 sm:pt-36 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <p className="hidden text-xs font-medium uppercase tracking-[0.18em] text-sunset/70 sm:block">
            Local businesses. A clearer next step.
          </p>
          <h1 className="max-w-2xl text-[clamp(2.5rem,10.7vw,4.5rem)] font-semibold leading-[1.07] tracking-tight sm:mt-6 sm:text-6xl xl:text-7xl">
            Websites built for{" "}
            <span className="text-[#c4cba7]">Ottawa contractors.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-sunset/80">
            Show your work and make it easy for homeowners to request a quote.
            Start with a review of your current website.
          </p>
          <Link
            href="/websites-for-contractors#website-review"
            data-track="service_click"
            data-service="website-development"
            data-placement="hero"
            className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-sunset px-6 py-4 text-sm font-semibold text-neon-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunset"
          >
            Get my free website review
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sunset/70">
            Three practical improvements within one business day.
            <br />
            No call required.
          </p>
          <Link
            href="/websites-for-contractors"
            data-track="service_click"
            data-service="website-development"
            data-placement="hero"
            className="mt-7 inline-flex items-center gap-2 text-sm text-sunset/80 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunset"
          >
            Explore the contractor website package
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
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
