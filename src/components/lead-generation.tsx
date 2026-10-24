import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Film, Send } from "lucide-react";
import styles from "./lead-generation.module.css";
export const leadGenerationContact = "/services/facebook-lead-generation#campaign-review";
export function CampaignHandoff() {
  return (
    <figure className={styles.handoff}>
      <ol aria-label="Facebook ad to business owner">
        {[
          ["Facebook ad", "Show the service and invite an enquiry."],
          ["Instant Form", "Collect contact and project details."],
          ["Make automation", "Pass the submitted details to Telegram."],
          ["Business owner", "Review the enquiry and follow up."],
        ].map(([title, text]) => <li key={title}><span aria-hidden="true" className={styles.handoffDot} /><div><strong>{title}</strong><p>{text}</p></div></li>)}
      </ol>
      <figcaption>Workflow illustration. No customer details shown.</figcaption>
    </figure>
  );
}
const steps = [
  { number: "01", icon: Film, title: "Show the work people need", text: "A clear offer and creative built from your own project photos or video. We agree who to reach and what to spend." },
  { number: "02", icon: ClipboardList, title: "Make it easy to enquire", text: "A short Facebook form asks for contact details and the information your team needs to assess the request." },
  { number: "03", icon: Send, title: "Get the details to your team", text: "Enquiries arrive in the agreed inbox or notification channel, so the person following up has the context." },
];
export function LeadFlow() {
  return (
    <ol className={styles.flow} aria-label="From Facebook advertisement to team follow-up">
      {steps.map(({ number, icon: Icon, title, text }) => (
        <li key={number} className={styles.flowStep}>
          <div className={styles.flowStepTop}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span>{number}</span></div>
          <h3>{title}</h3><p>{text}</p>
        </li>
      ))}
    </ol>
  );
}
export function LeadGenerationCta({ inline = false }: { inline?: boolean }) {
  return (
    <section className={styles.cta}><div className={styles.container}>
      <div className={styles.ctaRow}>
        <div><h2>Let’s find your<br />next opportunity.</h2><p>Start with a free campaign review. We’ll look at your service, your audience, and how enquiries reach your team.</p></div>
        <Link href={inline ? "#campaign-review" : leadGenerationContact} data-track="contact_click" data-service="facebook-lead-generation" data-placement="cta" className={styles.primaryButton}>Get my free campaign review <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className={styles.ctaNotes}><span><Check size={15} aria-hidden="true" />Scope and budget agreed before launch</span><span><Check size={15} aria-hidden="true" />Ad spend separate from service fees</span></div>
    </div></section>
  );
}
