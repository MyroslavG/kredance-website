import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { LeadFlow, LeadGenerationCta, CampaignHandoff } from "@/components/lead-generation";
import { CampaignReviewForm } from "@/components/campaign-review-form";
import styles from "@/components/lead-generation.module.css";

const description = "Facebook lead campaigns for service businesses. Reach potential customers, ask useful questions, and deliver enquiries to your team. Get a free campaign review.";
export const metadata = createPageMetadata({
  title: "Facebook Lead Generation for Service Businesses | Kredance", description,
  path: "/services/facebook-lead-generation",
});
const faqs = [
  ["Who is this for?", "Service businesses that sell through an estimate or a conversation: roofers, plumbers, HVAC teams, renovation companies, and other service providers. We agree on the area you serve, the work you want, and your capacity to respond."],
  ["What makes an enquiry useful?", "We agree on your qualification criteria before launch, then ask questions that help: the service needed, location, and timing. Your team confirms fit when it follows up. A submitted form is an enquiry, not a guaranteed customer."],
  ["What is included?", "A clear offer, campaign setup, ad copy and creative using your assets, a Facebook enquiry form, and a tested notification handoff. Ongoing management includes the campaign checks and reporting agreed in your proposal."],
  ["Do I need a new website or more software?", "Usually not. A Facebook Instant Form lets people enquire without leaving Facebook. You need accurate business information and an accessible privacy policy. We use a destination your team already checks where the integration supports it."],
  ["What does it cost?", "We quote setup and monthly management separately after the review. Ad spend is separate and paid directly from your Meta account. You approve the scope and campaign budget before launch."],
  ["What happens after I enquire?", "Myroslav reviews your service, audience, and current setup, then replies within one business day. If there is a fit, we arrange a short consultation and a scoped proposal. There is no obligation to launch."],
  ["Do you guarantee leads or sales?", "No. Results depend on your offer, audience, budget, competition, and follow-up. We track useful enquiries, booked consultations, and paying customers so decisions are based on business outcomes."],
];
export default function FacebookLeadGenerationPage() {
  const schema = { "@context": "https://schema.org", "@type": "Service", name: "Facebook Lead Generation", serviceType: "Facebook advertising and automated lead delivery", description, url: siteConfig.url + "/services/facebook-lead-generation", provider: { "@type": "Organization", "@id": siteConfig.url + "/#organization", name: siteConfig.name } };
  return (
    <div className={styles.page}>
      <BreadcrumbJsonLd sectionName="Services" sectionPath="/services" currentName="Facebook Lead Generation" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className={styles.hero + " " + styles.conversionHero}>
        <div className={styles.container}><div className={styles.conversionGrid}>
          <div>
            <h1>Facebook ads<br />that start<br /><em>conversations.</em></h1>
            <p className={styles.intro}>We help service businesses attract customer enquiries and get the details straight to the people who can respond.</p>
            <ul className={styles.heroBenefits}>
              <li><Check size={17} aria-hidden="true" />Reach people who need your service</li>
              <li><Check size={17} aria-hidden="true" />Ask the questions that help you qualify them</li>
              <li><Check size={17} aria-hidden="true" />Keep the handoff simple for your team</li>
            </ul>
            <div className={styles.actions}>
              <a href="#campaign-review" data-track="contact_click" data-service="facebook-lead-generation" data-placement="hero" className={styles.primaryButton}>Get more leads <ArrowRight size={17} aria-hidden="true" /></a>
              <Link href="/portfolio/roofing-lead-generation" className={styles.textLink}>See the roofing project <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <CampaignReviewForm />
        </div></div>
      </section>
      <section className={styles.section} id="how-it-works"><div className={styles.container}>
        <div className={styles.sectionHeading}><h2>Make the next<br />step easy.</h2><p>The ad starts the conversation. A short form and a clear handoff help your team turn it into an estimate, a consultation, or a useful reply.</p></div>
        <LeadFlow />
      </div></section>
      <section className={styles.caseFeature}><div className={styles.container + " " + styles.caseGrid}>
        <div><h2>A simpler enquiry flow<br />for a roofing business.</h2>
          <p className={styles.bodyText}>We connected a Facebook campaign to an Instant Form and automatic notifications. The owner receives contact and project details together, ready to follow up.</p>
          <p className={styles.bodyText}>We checked the complete journey with sample submissions before handoff.</p>
          <Link href="/portfolio/roofing-lead-generation" className={styles.textLink}>Read the case study <ArrowRight size={17} aria-hidden="true" /></Link>
        </div><CampaignHandoff />
      </div></section>
      <section className={styles.section + " " + styles.faq}><div className={styles.container + " " + styles.scope}>
        <div><h2>Before we start.</h2><p className={styles.bodyText + " " + styles.faqIntro}>A clear scope, a budget you approve, and someone responsible for every enquiry.</p></div>
        <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </div></section>
      <LeadGenerationCta inline />
    </div>
  );
}
