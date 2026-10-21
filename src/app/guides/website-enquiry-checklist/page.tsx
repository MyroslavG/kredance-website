import Link from "next/link";
import { guides } from "@/lib/guides";
import { createGuideMetadata, GuideArticle } from "../_components/guide-article";
import styles from "../guides.module.css";

const guide = guides[0];
export const metadata = createGuideMetadata(guide);

const contents = [
  { id: "choose-the-enquiry", title: "Choose the enquiry" },
  { id: "plan-the-page", title: "Plan the page" },
  { id: "choose-your-proof", title: "Choose your proof" },
  { id: "make-contact-easy", title: "Make contact easy" },
  { id: "test-the-journey", title: "Test the journey" },
  { id: "write-the-brief", title: "Write the brief" },
  { id: "learn-after-launch", title: "Learn after launch" },
] as const;

export default function WebsiteEnquiryGuidePage() {
  return (
    <GuideArticle
      guide={guide}
      intro="Before choosing a layout or commissioning a redesign, decide what a useful enquiry looks like. That decision gives your content, design, and contact form a shared purpose."
      takeaway="A visitor needs to understand what you offer, see a reason to trust you, and know what will happen when they get in touch. Plan those three things together."
      contents={contents}
      cta={{
        title: "Put your website through the same checks.",
        description: "Send us your website for a free review. We’ll look at the message, the path to an enquiry, and practical improvements worth making next.",
        href: "/contact?service=website-development&intent=review#inquiry-form",
        label: "Get a free website review",
        serviceHref: "/services/website-development",
        serviceLabel: "Explore website development",
      }}
    >
      <section id="choose-the-enquiry" className={styles.section}>
        <h2>1. Choose the enquiry you want to receive.</h2>
        <p>“More leads” is too broad to guide a website project. A request for an estimate, a product demonstration, and a conversation about a creative brief need different information. Start with the conversation your team is prepared to have.</p>
        <p>Write down who the page is for, what they need, and the next step you can offer. If you serve several audiences, choose the priority for each page. A homepage can introduce the business; a service page should help someone assess a specific offer.</p>
        <div className={styles.example}><p className={styles.eyebrow}>An illustrative brief</p><p>A creative studio wants enquiries about brand identity projects. Its priority visitor is a founder preparing a launch. The next step is a conversation about the business, timing, and scope. The website needs to show relevant identity work and explain how a project begins.</p></div>
        <p>Keep the invitation honest. Use “Request an estimate” if the team needs to assess the work before quoting. Use “Book a consultation” only when the visitor can actually arrange one. The button should describe the step that follows.</p>
      </section>

      <section id="plan-the-page" className={styles.section}>
        <h2>2. Give each part of the page a job.</h2>
        <p>Plan the reading order before the visual treatment. Visitors may arrive through a recommendation, a search, or a campaign, with very different levels of familiarity. The page should stand on its own without requiring them to explore the whole website.</p>
        <ol>
          <li><strong>Orientation:</strong> name the service or offer, the audience it suits, and the next action.</li>
          <li><strong>Fit:</strong> explain what you do, what the work includes, and any constraints that affect the decision.</li>
          <li><strong>Proof:</strong> show relevant work and describe your contribution.</li>
          <li><strong>Process:</strong> explain how the project starts and what the customer needs to provide.</li>
          <li><strong>Action:</strong> make the enquiry step easy to find when the visitor is ready.</li>
        </ol>
        <p>Use headings that answer real questions. “What we build” or “How the project starts” is more useful than an impressive phrase that leaves the reader guessing. Design can express your personality while the words carry the information.</p>
        <p>If two services require different proof, process, or questions, they may deserve separate pages. If their content would be almost identical, a clear section on one page may be enough. Give each page a reason to exist.</p>
      </section>

      <section id="choose-your-proof" className={styles.section}>
        <h2>3. Choose proof that answers the buyer’s concern.</h2>
        <p>A portfolio image shows the result. A short explanation helps the visitor understand why it matters. For each example, describe the starting situation, what you delivered, and how the work fits the customer’s business. Make your role clear when others contributed.</p>
        <p>Match the proof to the question. A buyer commissioning a website may want to see how services and contact information are organised. Someone commissioning a campaign may need to understand the creative and the enquiry journey. A testimonial can add the client’s perspective when you have permission to use it.</p>
        <div className={styles.example}><p className={styles.eyebrow}>In practice / Fidan Construction</p><p>Our <Link href="/portfolio/fidan-construction">Fidan Construction project</Link> brings website development, SEO, and Google Ads into one project story. The site organises the company’s services, projects, and contact information. That is a useful example of connecting a broad service offer to a navigable website.</p></div>
        <p>Separate what you delivered from what you measured. If you have reliable evidence of a business result, explain its context. If you do not, show the work itself and the problem it was designed to address. Specific, accurate detail is enough to make a case study useful.</p>
      </section>

      <section id="make-contact-easy" className={styles.section}>
        <h2>4. Ask for what the first conversation needs.</h2>
        <p>Review every form field with one question: will this change how we respond? Contact details and a service choice may be enough to begin. A property location, project date, or short description can be useful when it determines whether you can help. Questions that only matter after a consultation can wait.</p>
        <ul>
          <li><strong>Label the fields clearly.</strong> Keep labels visible while people type and mark optional details as optional.</li>
          <li><strong>Explain what follows.</strong> Say who will respond and through which channel. Only promise a response time your team can maintain.</li>
          <li><strong>Make mistakes recoverable.</strong> Show a helpful error beside the relevant field and preserve the details the visitor has already entered.</li>
          <li><strong>Confirm successful receipt.</strong> The success message should appear after the enquiry is accepted, with a clear next step.</li>
        </ul>
        <p>Keep privacy information accessible next to the form. An enquiry should not quietly become an unrelated marketing subscription. Ask your delivery partner how form data is stored, who receives it, and how access is managed.</p>
      </section>

      <section id="test-the-journey" className={styles.section}>
        <h2>5. Test the whole journey before launch.</h2>
        <p>Review the site on a real phone as well as a larger screen. Open it as a first-time visitor, including any consent banner. Then complete the same task you expect a customer to complete. A polished page is only part of the check.</p>
        <ul className={styles.checklist}>
          <li>The offer and primary action are readable without dismissing something that covers them.</li>
          <li>Menus, buttons, and form labels work with touch and keyboard navigation.</li>
          <li>Project images are legible, video controls work, and important information is available without sound.</li>
          <li>An incomplete form explains what needs fixing without losing the rest of the enquiry.</li>
          <li>A clearly marked test enquiry is saved and reaches the person responsible for follow-up.</li>
          <li>A delivery problem has a recovery path; the team knows where to find the saved enquiry.</li>
        </ul>
        <p>Agree who owns each issue before launch. Include content corrections, delivery settings, access, and ongoing updates in the handoff. Keep the launch checklist with the project so it can be reused after substantial changes.</p>
      </section>

      <section id="write-the-brief" className={styles.section}>
        <h2>6. Bring a one-page brief to the first meeting.</h2>
        <p>You do not need a complete specification to start a productive conversation. A short brief helps a designer or developer identify what is clear, what needs exploration, and which decisions affect the scope.</p>
        <div className={styles.brief}><dl>
          <dt>Audience</dt><dd>Who should this page help, and what are they trying to decide?</dd>
          <dt>Offer</dt><dd>What do we provide, and what is outside the scope?</dd>
          <dt>Enquiry</dt><dd>What action should the visitor take? What information is needed?</dd>
          <dt>Proof</dt><dd>Which projects, images, and approved client comments can we use?</dd>
          <dt>Follow-up</dt><dd>Who receives enquiries, and what happens next?</dd>
          <dt>Constraints</dt><dd>What timing, budget, tools, and approval process should shape the work?</dd>
          <dt>Ownership</dt><dd>Who can approve copy, provide assets, and maintain the site?</dd>
        </dl></div>
        <p>Mark unknowns openly. An agency can help shape an offer or organise content, but that work needs to be part of the scope. Bring examples of websites you like and explain what is useful about them: the clarity, the photography, the navigation, or the way a service is explained.</p>
      </section>

      <section id="learn-after-launch" className={styles.section}>
        <h2>7. Learn from visits and actual conversations.</h2>
        <p>A website needs a way for the right people to find it. Include a distribution plan: relevant search content, useful social posts, existing business relationships, or an agreed campaign. A redesign alone does not establish demand.</p>
        <p>Keep a simple record of where visitors come from, which enquiries arrive, and whether those enquiries fit your services. Check that analytics respects the visitor’s choices, and use the saved enquiry record to confirm submissions. A button click is an expression of interest; a received enquiry is a different event.</p>
        <p>When traffic is limited, avoid drawing strong conclusions from a few visits. Combine the available data with questions customers ask. Improve the explanation, proof, or follow-up step that those conversations reveal, then observe the effect before making another large change.</p>
      </section>
    </GuideArticle>
  );
}
