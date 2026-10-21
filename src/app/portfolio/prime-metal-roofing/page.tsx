import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { CampaignVideo, LeadFlow, LeadGenerationCta } from "@/components/lead-generation";
import { SharePage } from "@/components/share-page";
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
              <p className={styles.eyebrow}>PRIME METAL ROOFING / SELECTED WORK</p>
              <h1>The work<br />gets seen.<br /><em>The lead<br />gets through.</em></h1>
              <p className={styles.intro}>A Facebook video campaign and connected enquiry flow for an Ontario roofing business. From the first view to the team’s Telegram inbox.</p>
              <div className={styles.actions}><Link href="/services/facebook-lead-generation" className={styles.primaryButton}>Explore this service <ArrowRight size={17} aria-hidden="true" /></Link></div>
              <dl className={styles.projectMeta}><div><dt>Client</dt><dd>Prime Metal Roofing</dd></div><div><dt>Service</dt><dd>Ads + automation</dd></div><div><dt>Market</dt><dd>Ontario, Canada</dd></div></dl>
            </div>
            <div id="the-ad" className="scroll-mt-24"><CampaignVideo /></div>
          </div>
          <div className={styles.heroFoot}><p><span>Facebook video creative</span><span aria-hidden="true">/</span><span>Instant Form</span><span aria-hidden="true">/</span><span>Make + Telegram</span></p><SharePage className={styles.shareButton} /></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>THE BRIEF</p><h2>Show the craftsmanship.<br />Connect the enquiry.</h2></div><p>The project brought together a video-led Facebook campaign, a form for homeowners requesting an estimate, and an automatic notification to the people handling enquiries.</p></div>
          <LeadFlow />
        </div>
      </section>

      <section className={styles.caseFeature}>
        <div className={`${styles.container} ${styles.caseGrid}`}>
          <div><p className={styles.eyebrow}>THE CREATIVE</p><h2>Real projects.<br />A straightforward offer.</h2><p className={styles.bodyText}>Roof installation footage puts the work at the centre of the ad. The message invites homeowners to request a detailed estimate, with creative prepared for Facebook Feed and vertical placements.</p><p className={styles.bodyText}>The featured version uses a dedicated Feed composition that fills the frame without blurred side panels.</p></div>
          <div className={styles.casePanel}><p className={styles.miniLabel}>CAMPAIGN COPY</p><blockquote className={styles.quote}>“Considering a new metal roof? See Prime Metal Roofing’s installation work and finished roofs. Fill out the form to request a free detailed estimate for your home.”</blockquote><p className={styles.copyLabel}>HEADLINE</p><p className={styles.copyHeadline}>Request a Metal Roofing Quote</p><p className={styles.copyLabel}>CALL TO ACTION</p><p className={styles.copyHeadline}>Get quote</p></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.scope}`}>
          <div className={styles.scopeIntro}><p className={styles.eyebrow}>BEHIND THE AD</p><h2>A useful handoff.<br />Built into the flow.</h2><p className={styles.bodyText}>The form and automation give the team the context to follow up. The customer stays in Facebook to submit the enquiry.</p></div>
          <div className={styles.scopeRows}>
            <div className={styles.scopeRow}><span className={styles.scopeNumber}>01</span><div><h3>Contact and property details</h3><p>The higher-intent form collects full name, property address, postal code, phone, and email. Customers review their details before submitting.</p></div></div>
            <div className={styles.scopeRow}><span className={styles.scopeNumber}>02</span><div><h3>Automatic lead delivery</h3><p>Make retrieves the submitted details and sends a notification to the team’s private Telegram group. A retry handler is configured for notification failures.</p></div></div>
            <div className={styles.scopeRow}><span className={styles.scopeNumber}>03</span><div><h3>Verified from form to inbox</h3><p>Two end-to-end test submissions passed, including an automatic trigger. The mapped fields arrived correctly, and the intended recipients confirmed receipt.</p></div></div>
          </div>
        </div>
      </section>

      <section className={styles.caseFeature}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>PROJECT DELIVERY</p><h2>Creative and systems.<br />One connected setup.</h2></div></div>
          <div className={styles.caseColumns}>
            <div><h3>What we delivered</h3><ul className={styles.deliverableList}>{["Facebook campaign setup and ad copy", "Placement-specific video creative", "Published higher-intent enquiry form", "Active Make-to-Telegram workflow", "End-to-end integration testing"].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
            <div><h3>Built, launched, and tested</h3><p>The campaign was published in October 2026, with the dedicated Feed creative updated on October 21. The enquiry-to-notification workflow was activated and tested.</p><p className="mt-5">This case study documents the implementation. Lead volume, acquisition cost, and revenue results for the featured creative are not reported here.</p><Link href="/services/facebook-lead-generation" className={`${styles.textLink} mt-7`}>See what this service includes <ArrowRight size={17} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>
      <LeadGenerationCta />
    </div>
  );
}
