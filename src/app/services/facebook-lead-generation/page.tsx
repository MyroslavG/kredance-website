import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { CampaignVideo, LeadFlow, LeadGenerationCta, leadGenerationContact } from "@/components/lead-generation";
import { SharePage } from "@/components/share-page";
import styles from "@/components/lead-generation.module.css";

const title = "Facebook Lead Generation for Service Businesses | Kredance";
const description = "Facebook video ads, enquiry forms, and automated lead delivery for service businesses. See the complete lead flow we built for Prime Metal Roofing.";
const baseMetadata = createPageMetadata({ title, description, path: "/services/facebook-lead-generation" });
export const metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, images: [{ url: "/images/facebook-lead-generation-og.jpg", width: 1200, height: 630, alt: "Kredance — Facebook ads. Leads delivered. Featuring Prime Metal Roofing." }] },
  twitter: { ...baseMetadata.twitter, images: ["/images/facebook-lead-generation-og.jpg"] },
};

const scope = [
  ["A campaign with a clear offer", "We shape the message around your service, your audience, and the kind of enquiry you want to receive. Then we set up the audience, placements, and agreed campaign budget."],
  ["Creative made for the feed", "We turn your project footage and brand assets into a video ad, with copy and a direct call to action. Placement-specific versions keep the work properly framed."],
  ["A form that asks the useful questions", "We build the enquiry form around what your team needs to follow up: contact details, location, and relevant project information, with clear privacy information."],
  ["A handoff tested before launch", "We connect the form to your team’s notification workflow and test the journey with sample submissions. You know where enquiries arrive and who picks them up."],
];
const faqs = [
  ["Who is this service for?", "Businesses that sell through a conversation, consultation, or estimate. Whether your customers are nearby or further afield, we start with your offer, audience, and capacity to respond to new enquiries."],
  ["Do we need a website or a landing page?", "Customers can submit an enquiry directly in a Facebook Instant Form. You still need an accessible privacy policy and accurate business information. A dedicated landing page can be scoped separately if it fits your campaign."],
  ["What do you need from us?", "Your service details, target audience, logo, usable photos or video, and access to the relevant Meta business assets. We agree on the offer, ad budget, launch timeline, and who will respond to enquiries before work begins."],
  ["Do all leads have to go to Telegram?", "Telegram is the delivery destination in the Prime Metal Roofing project. If your team uses a different inbox or CRM, we can assess the integration and include it in the scope before work begins."],
  ["How do pricing and ad spend work?", "We quote the setup based on the creative, campaign, and integrations you need. Advertising spend is paid separately through your Meta ad account. Ongoing management, creative refreshes, and additional integrations can be scoped separately."],
  ["Can you guarantee a number of leads?", "No. Campaign performance depends on the offer, audience, competition, budget, and follow-up. We build and test the campaign and enquiry flow; results are measured after launch using actual campaign data."],
];

export default function FacebookLeadGenerationPage() {
  const schema = { "@context": "https://schema.org", "@type": "Service", name: "Facebook Lead Generation", serviceType: "Facebook advertising and automated lead delivery", description, url: `${siteConfig.url}/services/facebook-lead-generation`, provider: { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name } };
  return (
    <div className={styles.page}>
      <BreadcrumbJsonLd sectionName="Services" sectionPath="/services" currentName="Facebook Lead Generation" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}><Link href="/services">Services</Link><ChevronRight size={12} aria-hidden="true" /><span>Facebook Lead Generation</span></nav>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>FACEBOOK LEAD GENERATION</p>
              <h1>Your next<br />customer<br />is <em>scrolling.</em></h1>
              <p className={styles.intro}>We build your Facebook campaign, from video creative and the enquiry form to tested notifications for your team.</p>
              <div className={styles.actions}><Link href={leadGenerationContact} className={styles.primaryButton}>Discuss my campaign <ArrowRight size={17} aria-hidden="true" /></Link><a href="#how-it-works" className={styles.textLink}>See how it works <ArrowDown size={16} aria-hidden="true" /></a></div>
            </div>
            <CampaignVideo />
          </div>
          <div className={styles.heroFoot}><p><span>Built for service businesses</span><span aria-hidden="true">/</span><span>From first impression to first conversation</span></p><SharePage className={styles.shareButton} /></div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.section} scroll-mt-20`}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>THE COMPLETE JOURNEY</p><h2>Good creative opens<br />the conversation.</h2></div><p>The rest of the experience matters just as much. We connect the ad to a clear enquiry form and a practical handoff, so your team has the details to respond.</p></div>
          <LeadFlow />
        </div>
      </section>

      <section className={styles.caseFeature}>
        <div className={`${styles.container} ${styles.caseGrid}`}>
          <div><p className={styles.caseLabel}>IN PRACTICE / PRIME METAL ROOFING</p><h2>From roof footage<br />to a connected<br />enquiry flow.</h2><p className={styles.bodyText}>For an Ontario roofing business, we connected a project-led video campaign to a Facebook form and automated Telegram notifications. One journey, built around how the team works.</p><Link href="/portfolio/prime-metal-roofing" className={styles.textLink}>Explore the project <ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className={styles.casePanel}>
            <div className={styles.casePanelHeader}><span className={styles.caseMonogram} aria-hidden="true">PMR</span><div><h3>Prime Metal Roofing</h3><p>Roofing · Ontario · Facebook</p></div></div>
            <ul className={styles.deliverableList}>{["Video creative adapted for Facebook placements", "Higher-intent form with contact and property details", "Make automation delivering enquiries to Telegram", "End-to-end handoff verified with test submissions"].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
            <figure className={styles.clientFeedback}>
              <blockquote>“Myroslav had our Facebook ad campaign set up in just a few hours, and leads started coming in right away.”</blockquote>
              <figcaption>Alex Fedoriuk · Prime Metal Roofing</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.scope}`}>
          <div className={styles.scopeIntro}><p className={styles.eyebrow}>WHAT WE BUILD</p><h2>Every part.<br />Working together.</h2><p className={styles.bodyText}>Creative, campaign setup, enquiry capture, and delivery. A practical setup that supports the way you sell.</p></div>
          <div className={styles.scopeRows}>{scope.map(([heading, text], index) => <div className={styles.scopeRow} key={heading}><span className={styles.scopeNumber}>0{index + 1}</span><div><h3>{heading}</h3><p>{text}</p></div></div>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faq}`}>
        <div className={`${styles.container} ${styles.scope}`}>
          <div><p className={styles.eyebrow}>BEFORE WE START</p><h2>A few useful<br />details.</h2></div>
          <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>
      <LeadGenerationCta />
    </div>
  );
}
