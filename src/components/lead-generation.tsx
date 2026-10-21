import Link from "next/link";
import { ArrowRight, Check, ClipboardList, Film, Send } from "lucide-react";
import styles from "./lead-generation.module.css";

export const leadGenerationContact = "/contact?service=facebook-lead-generation#inquiry-form";

export function CampaignVideo() {
  return (
    <figure className={styles.videoFigure}>
      <div className={styles.videoTopline}>
        <span><span className={styles.dot} /> THE WORK</span>
        <span>01 / PRIME METAL ROOFING</span>
      </div>
      <video
        className={styles.video}
        controls
        playsInline
        preload="none"
        poster="/images/prime-metal-roofing-poster.jpg"
        width={810}
        height={1080}
        aria-label="Prime Metal Roofing Facebook video advertisement"
        aria-describedby="campaign-video-description"
      >
        <source src="/videos/prime-metal-roofing-ad.mp4" type="video/mp4" />
        <track kind="captions" src="/videos/prime-metal-roofing-ad.en.vtt" srcLang="en" label="English" />
        Your browser does not support embedded video. <a href="/videos/prime-metal-roofing-ad.mp4">Watch the advertisement</a>.
      </video>
      <figcaption id="campaign-video-description" className={styles.videoCaption}>
        Prime Metal Roofing: “Need a new metal roof?” Watch the project footage and invitation to request a free detailed estimate. English captions available.
      </figcaption>
    </figure>
  );
}

const steps = [
  { number: "01", icon: Film, title: "An ad that shows your work", text: "Project footage, a clear offer, and a reason to get in touch. Formatted for the placements your customers use.", label: "VIDEO CREATIVE" },
  { number: "02", icon: ClipboardList, title: "An enquiry that has context", text: "A native Facebook form collects contact and project details, with a review step before the customer submits.", label: "INSTANT FORM" },
  { number: "03", icon: Send, title: "A lead your team can act on", text: "The submitted details arrive in your team’s Telegram group, ready for a conversation about the project.", label: "AUTOMATED HANDOFF" },
];

export function LeadFlow() {
  return (
    <ol className={styles.flow} aria-label="From Facebook advertisement to team follow-up">
      {steps.map(({ number, icon: Icon, title, text, label }) => (
        <li key={number} className={styles.flowStep}>
          <div className={styles.flowStepTop}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><span>{number}</span></div>
          <p className={styles.miniLabel}>{label}</p>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

export function LeadGenerationCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>LET’S BUILD YOUR NEXT CAMPAIGN</p>
        <div className={styles.ctaRow}>
          <div><h2>You do the work.<br />Let’s get it seen.</h2><p>Tell us what you offer, where you work, and how you handle enquiries. We’ll map out the next step.</p></div>
          <Link href={leadGenerationContact} className={styles.primaryButton}>Talk about your campaign <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className={styles.ctaNotes}><span><Check size={15} aria-hidden="true" /> Scope agreed before launch</span><span><Check size={15} aria-hidden="true" /> Ad spend separate from service fees</span></div>
      </div>
    </section>
  );
}
