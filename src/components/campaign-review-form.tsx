"use client";
import Link from "next/link";
import { useRef } from "react";
import { trackSite } from "@/lib/engagement/client";
import { useLeadForm } from "@/lib/leads/use-lead-form";
import styles from "./lead-generation.module.css";
const service = "facebook-lead-generation";
export function CampaignReviewForm() {
  const started = useRef(false);
  const { submit, onInput, status, error } = useLeadForm({
    kind: "contact", service, subject: "Free Facebook campaign review",
    placement: "hero", location: "campaign",
  });
  return (
    <div id="campaign-review" className={styles.reviewCard}>
      {status === "sent" ? (
        <div role="status" className={styles.reviewSuccess}>
          <h2>Your request is in.</h2>
          <p>We’ve saved your details. We’ll reply within one business day with a practical next step.</p>
          <Link href="/contact#book-a-call" className={styles.textLink}>Prefer to talk? Book a free consultation.</Link>
        </div>
      ) : (
        <form onSubmit={submit} onInput={onInput} onChange={() => {
          if (!started.current) { started.current = true; trackSite("form_start", service, "hero"); }
        }} aria-label="Request a free campaign review" data-clarity-mask="true">
          <h2>Let’s look at your next campaign.</h2>
          <p className={styles.reviewIntro}>Tell us what you do. We’ll suggest a useful starting point. No call required.</p>
          <fieldset disabled={status === "sending"}>
            <div className={styles.formPair}>
              <label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            </div>
            <label>Website <span>(optional)</span><input name="website" inputMode="url" autoComplete="url" minLength={4} maxLength={500} placeholder="yourbusiness.ca" /></label>
            <label>What do you do, and where do you work?<textarea name="message" rows={3} required minLength={10} maxLength={2000} placeholder="For example: roof replacements across Ottawa. We’d like more estimate requests." /></label>
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label>Company fax<input name="companyFax" tabIndex={-1} autoComplete="off" /></label></div>
            {error && <p role="alert" className={styles.formError}>{error} You can also <a href="mailto:myroslav@kredance.com">email Myroslav</a>.</p>}
            <button type="submit" className={styles.reviewSubmit}>{status === "sending" ? "Saving your request…" : "Get my free campaign review"}</button>
          </fieldset>
          <p className={styles.formNote}>We’ll reply within one business day. Your details are used to respond to this request. <Link href="/privacy">Privacy policy</Link>.</p>
        </form>
      )}
    </div>
  );
}
