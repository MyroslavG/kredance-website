import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { CampaignHandoff, LeadGenerationCta } from "@/components/lead-generation";
import styles from "@/components/lead-generation.module.css";
export const metadata = createPageMetadata({
  path: "/portfolio/roofing-lead-generation", title: "Roofing Lead Generation Case Study | Kredance",
  description: "How Kredance connected a roofing campaign, Facebook Instant Form, Make automation, and Telegram notifications into one tested enquiry flow.",
});
export default function RoofingLeadGenerationPage() {
  return (
    <div className={styles.page}>
      <BreadcrumbJsonLd sectionName="Portfolio" sectionPath="/portfolio" currentName="Roofing lead generation" />
      <section className={styles.hero}><div className={styles.container + " " + styles.heroGrid}>
        <div><h1>From a roofing ad<br />to a real<br /><em>conversation.</em></h1>
          <p className={styles.intro}>A Facebook campaign, a short enquiry form, and a direct handoff to the business owner. Built and tested as one connected experience.</p>
          <div className={styles.actions}><Link href="/services/facebook-lead-generation#campaign-review" className={styles.primaryButton}>Plan a campaign like this <ArrowRight size={17} aria-hidden="true" /></Link></div>
        </div><div id="the-ad" className="scroll-mt-24"><CampaignHandoff /></div>
      </div></section>
      <section className={styles.section}><div className={styles.container}>
        <div className={styles.sectionHeading}><h2>Fewer steps.<br />A clearer handoff.</h2><p>The brief was to simplify how potential customers enquired and how those details reached the person following up.</p></div>
        <div className={styles.projectSummary}>
          <div><h3>The problem</h3><p>Lead collection had unnecessary steps. The business needed a more direct way for someone interested in roofing work to share their details.</p></div>
          <div><h3>The change</h3><p>A Facebook Instant Form collects contact and property information without sending the customer through another website journey.</p></div>
          <div><h3>The handoff</h3><p>Make sends the submitted details to Telegram, where the business owner can review the enquiry and start the conversation.</p></div>
        </div>
      </div></section>
      <section className={styles.caseFeature}><div className={styles.container + " " + styles.caseGrid}>
        <div><h2>Built around<br />the owner’s day.</h2><p className={styles.bodyText}>Contact and project details arrive together. There is a clear destination for enquiries and a clear person to respond, with less manual copying between tools.</p></div>
        <div className={styles.casePanel}><h3 className={styles.resultHeading}>What we verified</h3><ul className={styles.deliverableList}>{["Campaign creative and a clear invitation to request an estimate", "A form collecting contact and property details", "Automatic delivery from the form through Make to Telegram", "The complete handoff checked with sample submissions"].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><p className={styles.smallNote}>Client identity and campaign figures are private. This case study shows the implementation; it does not establish a lead-volume or sales forecast.</p></div>
      </div></section>
      <LeadGenerationCta />
    </div>
  );
}
