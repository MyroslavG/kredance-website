import Link from "next/link";
import { guides } from "@/lib/guides";
import { createGuideMetadata, GuideArticle } from "../_components/guide-article";
import styles from "../guides.module.css";

const guide = guides[1];
export const metadata = createGuideMetadata(guide);

const contents = [
  { id: "define-the-offer", title: "Define the offer" },
  { id: "connect-the-creative", title: "Connect the creative" },
  { id: "design-the-form", title: "Design the form" },
  { id: "own-the-follow-up", title: "Own the follow-up" },
  { id: "test-the-handoff", title: "Test the handoff" },
  { id: "agree-the-scope", title: "Agree the scope" },
  { id: "review-real-enquiries", title: "Review real enquiries" },
] as const;

export default function FacebookLeadHandoffGuidePage() {
  return (
    <GuideArticle
      guide={guide}
      intro="An ad starts a conversation. The form and follow-up determine whether your team can continue it. Use this checklist to brief the complete journey, from the creative to the person receiving the enquiry."
      takeaway="Every enquiry should arrive with enough context for a useful response, in a place someone is responsible for checking. Agree on that handoff before the campaign goes live."
      contents={contents}
      cta={{
        title: "Build the campaign and the handoff together.",
        description: "Tell us about your offer, the people you want to reach, and how your team handles enquiries. We’ll help define the creative, form, and delivery workflow.",
        href: "/contact?service=facebook-lead-generation#inquiry-form",
        label: "Discuss my campaign",
        serviceHref: "/services/facebook-lead-generation",
        serviceLabel: "Explore the service",
      }}
    >
      <section id="define-the-offer" className={styles.section}>
        <h2>1. Define the conversation the ad is starting.</h2>
        <p>Start with the offer and the response your team can provide. An estimate request, a consultation, and a product enquiry all create different expectations. The words in the ad should describe the next step accurately, and the form should carry that promise through.</p>
        <p>Write down the service, intended customer, relevant location or eligibility, and the reason to get in touch. Then decide what makes an enquiry useful. For some businesses, that is a project in a serviceable area. For others, it is a team with a particular need or a launch within an agreed timeframe.</p>
        <div className={styles.example}><p className={styles.eyebrow}>The project behind this guide</p><p>For <Link href="/portfolio/prime-metal-roofing">Prime Metal Roofing</Link>, Kredance connected a video made from real project footage to a Facebook enquiry form and Telegram notifications through Make. The form collected contact and property details, and the handoff was checked with sample submissions before delivery.</p></div>
        <p>That project is one implementation. The same planning questions apply to other businesses selling through a conversation. Choose the questions and destination around the team’s actual work.</p>
      </section>

      <section id="connect-the-creative" className={styles.section}>
        <h2>2. Make the creative and the form tell the same story.</h2>
        <p>Review the ad and form side by side. Someone who responds to a specific offer should recognise it immediately after clicking. Keep the service name, invitation, and any important conditions consistent through the journey.</p>
        <p>Choose footage or imagery that helps explain the work. In the Prime Metal Roofing creative, completed roofing work gave the offer a concrete visual basis. A studio, consultancy, or product business will need different proof: finished projects, a demonstration, or a clear explanation of the service.</p>
        <ul>
          <li><strong>Check the opening.</strong> Can a viewer understand the subject without waiting for the end?</li>
          <li><strong>Check the framing.</strong> Review the actual versions used for the agreed placements so important text and details remain visible.</li>
          <li><strong>Check sound-off viewing.</strong> Keep the offer readable and provide accurate captions when spoken audio carries useful information.</li>
          <li><strong>Check permission.</strong> Confirm the footage, logo, images, and client references are available for this use.</li>
        </ul>
        <p>Agree who approves the final creative and copy. Keep an accessible copy of the approved version so the team can see exactly what a prospective customer was shown.</p>
      </section>

      <section id="design-the-form" className={styles.section}>
        <h2>3. Collect the details that change the response.</h2>
        <p>Give each question a purpose. Contact information enables a reply. A location may determine whether you can serve the customer. A service choice can route the enquiry to the right person. A detailed technical specification often belongs in the follow-up conversation.</p>
        <p>The Prime Metal Roofing form used contact and property information to support an estimate conversation. For a different business, a project type or intended start date may be more useful. Do not copy another company’s fields without asking what your team will do with the answers.</p>
        <div className={styles.brief}><dl>
          <dt>Question</dt><dd>What is the minimum information needed to give a useful first response?</dd>
          <dt>Reason</dt><dd>Does this answer affect fit, routing, or the next conversation?</dd>
          <dt>Expectation</dt><dd>Does the person know how the team will contact them and what happens next?</dd>
          <dt>Privacy</dt><dd>Is the business’s privacy information accessible and consistent with how the details will be used?</dd>
        </dl></div>
        <p>Read the form aloud from a customer’s point of view. Replace internal language with everyday words. If a question needs a long explanation, simplify it or move it to the conversation. Confirm the final fields, access, and current account requirements during setup.</p>
      </section>

      <section id="own-the-follow-up" className={styles.section}>
        <h2>4. Give the handoff an owner.</h2>
        <p>“The team gets a notification” leaves a critical decision open: who acts on it? Name the person or role responsible for first contact, the person who covers absence, and where the outcome is recorded. Agree what happens outside normal working hours.</p>
        <p>Choose a destination people already check and can manage appropriately. Telegram suited the Prime Metal Roofing workflow. An inbox or CRM may suit another business. Before promising an integration, confirm the available access, required fields, and what the receiving system supports.</p>
        <ul>
          <li><strong>Keep the message useful.</strong> Include the service or offer, contact details, relevant answers, and source context needed for the reply.</li>
          <li><strong>Limit access.</strong> Only people handling the enquiry should receive the personal details.</li>
          <li><strong>Keep a reliable record.</strong> Decide where an enquiry can be found again if a notification is missed.</li>
          <li><strong>Make ownership visible.</strong> Use a simple status or note so colleagues know someone has picked it up.</li>
        </ul>
        <p>Agree a response practice the team can sustain. The first message can confirm the request and ask the next useful question. Automation can carry information to the team; the quality of the conversation still matters.</p>
      </section>

      <section id="test-the-handoff" className={styles.section}>
        <h2>5. Test what happens after submission.</h2>
        <p>Use clearly marked test details and follow a sample enquiry from the form to its destination. Check the information against the original submission. A successful test proves that the tested route works under those conditions; it does not guarantee that every future delivery will succeed.</p>
        <ul className={styles.checklist}>
          <li>The correct ad leads to the intended form and offer.</li>
          <li>Required answers, optional answers, and contact details appear correctly in the destination.</li>
          <li>The assigned person can access the enquiry and understands the next step.</li>
          <li>The team knows where the original record lives if a notification is missed.</li>
          <li>The workflow has an agreed way to identify and recover from a delivery failure.</li>
          <li>Repeated submissions or notifications have a clear handling process.</li>
          <li>Test records are labelled so they do not enter the campaign’s genuine enquiry count.</li>
        </ul>
        <p>Ask the person who will handle real enquiries to participate in the test. A technically correct notification can still be missing the information they need. Document the approved destination, field mapping, and account owner so future changes can be checked against them.</p>
      </section>

      <section id="agree-the-scope" className={styles.section}>
        <h2>6. Agree what launch includes.</h2>
        <p>Write a short handoff brief before work starts. It should make clear what will be created, what access is needed, and who approves the result. Keep setup, advertising spend, and ongoing work visible as separate parts of the decision.</p>
        <div className={styles.brief}><dl>
          <dt>Offer & audience</dt><dd>The service, intended customer, and invitation in the ad.</dd>
          <dt>Creative</dt><dd>Source assets, agreed formats, copy, and approval owner.</dd>
          <dt>Enquiry form</dt><dd>Fields, privacy information, and the customer’s next step.</dd>
          <dt>Delivery</dt><dd>Destination, required access, responsible person, and backup process.</dd>
          <dt>Budget</dt><dd>Setup scope, agreed advertising spend, and who controls the account.</dd>
          <dt>After launch</dt><dd>Monitoring, reporting, maintenance, and creative changes included in the agreement.</dd>
        </dl></div>
        <p>A launched campaign and ongoing management involve different work. Confirm who checks delivery, reviews enquiry quality, and authorises changes after launch. Additional destinations or a new CRM should be assessed before they become part of the promise.</p>
      </section>

      <section id="review-real-enquiries" className={styles.section}>
        <h2>7. Review the conversation, as well as the campaign.</h2>
        <p>Record actual enquiries and their outcomes: new, contacted, relevant, next step agreed, or not a fit. Use a short reason when an enquiry is unsuitable. Those reasons can reveal whether the offer, audience, questions, or follow-up needs attention.</p>
        <p>Keep different measures distinct. A form submission is not automatically a qualified opportunity, and an opportunity is not a sale. Compare campaign reporting with the records your team receives, investigate gaps, and avoid counting tests or duplicates as new enquiries.</p>
        <p>The Prime Metal Roofing case shows the creative, form, and tested delivery we built. It does not establish a lead volume or cost benchmark for another business. Set expectations around your offer, audience, budget, and capacity to follow up, then review the evidence from your own campaign.</p>
        <p>If a website is part of the journey, use our <Link href="/guides/website-enquiry-checklist">website enquiry checklist</Link> to check the message, proof, and contact step alongside the campaign.</p>
      </section>
    </GuideArticle>
  );
}
