import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";
import styles from "./guides.module.css";

export const metadata = createPageMetadata({
  title: "Practical Website & Campaign Guides | Kredance",
  description: "Practical guides for planning a website, improving the enquiry journey, and connecting Facebook campaigns to your team. Start with a clearer project brief.",
  path: "/guides",
});

export default function GuidesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kredance Guides",
    url: `${siteConfig.url}/guides`,
    description: "Practical guides for planning websites, campaigns, and the workflows behind them.",
    hasPart: guides.map((guide) => ({ "@type": "Article", headline: guide.title, url: `${siteConfig.url}${guide.path}` })),
  };
  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <header className={styles.hubHero}>
        <div className={styles.container}>
          <div className={styles.hubHeading}><h1>A clearer plan.<br />A better project.</h1><p>Practical ways to shape your website, campaign, and the work behind it. Start with the decisions that matter before you build.</p></div>
          <div className={styles.heroFoot}><span>For people with something to build.</span><span>Websites · Advertising</span></div>
        </div>
      </header>
      <section className={`${styles.container} ${styles.guideCollection}`} aria-labelledby="guide-list-title">
        <div className={styles.collectionHeading}><h2 id="guide-list-title">Start here.</h2><p>Two guides. Useful questions. A practical next step.</p></div>
        <div className={styles.guideGrid}>
          {guides.map((guide, index) => (
            <Link href={guide.path} key={guide.slug} className={styles.guideCard}>
              <div className={styles.cardTop}><span className={styles.eyebrow}>{guide.category}</span><span className={styles.cardNumber} aria-hidden="true">0{index + 1}</span></div>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <div className={styles.cardBottom}><span>{guide.outcome}</span><ArrowRight size={22} aria-hidden="true" /></div>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.hubCta}>
        <div className={`${styles.container} ${styles.hubCtaGrid}`}>
          <div><h2>Bring your idea.<br />Let’s shape the next step.</h2></div>
          <div><p>We design websites, create campaigns, and connect the tools that help your team do its work. Tell us what you have in mind, even if the brief is still taking shape.</p><div className={styles.actions}><Link href="/contact#inquiry-form" className={styles.primaryButton}>Discuss a project<ArrowRight size={17} aria-hidden="true" /></Link><Link href="/contact?intent=review#inquiry-form" className={styles.textLink}>Get a free website review<ArrowRight size={15} aria-hidden="true" /></Link></div></div>
        </div>
      </section>
    </div>
  );
}
