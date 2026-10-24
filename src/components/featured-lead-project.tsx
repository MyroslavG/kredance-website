import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CampaignHandoff } from "./lead-generation";
export function FeaturedLeadProject() {
  return (
    <section aria-labelledby="featured-lead-project-heading" className="border-t border-neon-navy/10 bg-sunset/50 px-6 py-20 text-neon-navy">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div><h2 id="featured-lead-project-heading" className="text-4xl font-semibold tracking-tight sm:text-5xl">From an ad<br />to an enquiry.</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-nebulosity/75">A roofing campaign with a short Facebook form and automatic notifications for the owner. A practical example of how we connect advertising to follow-up.</p>
          <div className="mt-8 flex flex-wrap gap-6"><Link href="/portfolio/roofing-lead-generation" className="inline-flex items-center gap-2 rounded-full bg-neon-navy px-6 py-3.5 text-sm text-white">Read the case study <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/services/facebook-lead-generation" data-track="service_click" data-service="facebook-lead-generation" data-placement="card" className="py-3 text-sm underline underline-offset-4">Build this for your business</Link></div>
        </div><CampaignHandoff />
      </div>
    </section>
  );
}
