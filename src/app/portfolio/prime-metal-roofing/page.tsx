import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { CampaignVideo } from "@/components/lead-generation";
import styles from "@/components/lead-generation.module.css";

const baseMetadata = createPageMetadata({
  path: "/portfolio/prime-metal-roofing",
  title: "Prime Metal Roofing — Facebook Ads & Lead Automation | Kredance",
  description: "See the Prime Metal Roofing video ad and the connected Facebook-to-Telegram enquiry flow built by Kredance, from campaign creative to tested lead delivery.",
});
export const metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, images: [{ url: "/images/facebook-lead-generation-og.jpg", width: 1200, height: 630, alt: "Prime Metal Roofing Facebook campaign and lead flow by Kredance" }] },
  twitter: { ...baseMetadata.twitter, images: ["/images/facebook-lead-generation-og.jpg"] },
};

export default function PrimeMetalRoofingPage() {
  return (
    <div className={styles.page}>
      <BreadcrumbJsonLd sectionName="Portfolio" sectionPath="/portfolio" currentName="Prime Metal Roofing" />
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}><Link href="/portfolio">Portfolio</Link><ChevronRight size={12} aria-hidden="true" /><span>Prime Metal Roofing</span></nav>
          <div className={styles.heroGrid}>
            <div>
              <h1>Prime Metal<br /><em>Roofing.</em></h1>
              <p className={styles.intro}>A Facebook video ad for Prime Metal Roofing, connected to an enquiry form and automatic notifications for their team.</p>
              <div className={styles.actions}><Link href="/services/facebook-lead-generation" className={styles.primaryButton}>Explore this service <ArrowRight size={17} aria-hidden="true" /></Link></div>
            </div>
            <div id="the-ad" className="scroll-mt-24"><CampaignVideo /></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>From the ad<br />to the team.</h2>
            <p>We brought the creative, enquiry form, and lead delivery together in one simple flow.</p>
          </div>
          <div className={styles.projectSummary}>
            <div>
              <h3>A video that shows the work</h3>
              <p>Real roof installations, a clear offer, and an invitation to request an estimate.</p>
            </div>
            <div>
              <h3>An easy way to enquire</h3>
              <p>A Facebook form collects the homeowner’s contact and property details.</p>
            </div>
            <div>
              <h3>The details, delivered</h3>
              <p>Enquiries go straight to the team’s Telegram group, ready for follow-up.</p>
            </div>
          </div>
          <p className={styles.smallNote}>The complete flow was tested with sample submissions before handoff.</p>
        </div>
      </section>

      <section className={styles.caseFeature}>
        <div className={`${styles.container} ${styles.projectNext}`}>
          <div>
            <h2>Want this for your business?</h2>
            <p className={styles.bodyText}>See how we connect Facebook ads to your next customer conversation.</p>
          </div>
          <Link href="/services/facebook-lead-generation" className={styles.projectButton}>Explore this service <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
