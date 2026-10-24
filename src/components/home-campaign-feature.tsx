import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CampaignHandoff } from "./lead-generation";
export function HomeCampaignFeature() {
  return (
    <section className="bg-[#f5f5f1] px-6 py-14 text-neon-navy sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Advertising with a clear next step.</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neon-navy/75">For a roofing business, we connected a Facebook ad to a short enquiry form and automatic notifications. The owner gets the details together, ready to respond.</p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <Link href="/services/facebook-lead-generation" data-track="service_click" data-service="facebook-lead-generation" data-placement="card" className="inline-flex items-center gap-2 rounded-full bg-neon-navy px-6 py-3.5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy">Get more leads <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/portfolio/roofing-lead-generation" className="text-sm font-medium underline underline-offset-4">See how it works</Link>
          </div>
        </div>
        <CampaignHandoff />
      </div>
    </section>
  );
}
