import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { defaultSocialImage, siteConfig } from "@/lib/site";
import { guides, type Guide } from "@/lib/guides";
import styles from "../guides.module.css";

export function createGuideMetadata(guide: Guide): Metadata {
  const base = createPageMetadata({
    title: `${guide.title} | Kredance`,
    description: guide.description,
    path: guide.path,
  });
  return {
    ...base,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: guide.published,
      authors: [siteConfig.url],
    },
  };
}

type GuideArticleProps = {
  guide: Guide;
  intro: string;
  takeaway: string;
  contents: readonly { id: string; title: string }[];
  children: ReactNode;
  cta: { title: string; description: string; href: string; label: string; serviceHref: string; serviceLabel: string };
};

export function GuideArticle({ guide, intro, takeaway, contents, children, cta }: GuideArticleProps) {
  const url = `${siteConfig.url}${guide.path}`;
  const related = guides.find(({ slug }) => slug !== guide.slug)!;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.description,
      datePublished: guide.published,
      inLanguage: "en",
      mainEntityOfPage: url,
      image: `${siteConfig.url}${defaultSocialImage.url}`,
      author: { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, url: siteConfig.url },
      publisher: { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.name, url: siteConfig.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${siteConfig.url}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    },
  ];

  return (
    <article className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }} />
      <header className={styles.articleHero}>
        <div className={styles.container}>
          <Link href="/guides" className={styles.backLink}><ArrowLeft size={15} aria-hidden="true" /> All guides</Link>
          <p className={styles.eyebrow}>{guide.category} / A practical guide</p>
          <h1>{guide.title}</h1>
          <p className={styles.articleIntro}>{intro}</p>
          <div className={styles.byline}><span>By Kredance</span><span aria-hidden="true">·</span><time dateTime={guide.published}>21 October 2026</time></div>
        </div>
      </header>

      <div className={`${styles.container} ${styles.articleLayout}`}>
        <aside className={styles.contents}>
          <nav aria-label="On this page">
            <p className={styles.eyebrow}>In this guide</p>
            <ol>{contents.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol>
          </nav>
        </aside>
        <div className={styles.articleBody}>
          <div className={styles.takeaway}><p className={styles.eyebrow}>The starting point</p><p>{takeaway}</p></div>
          {children}
          <div className={styles.articleCta}>
            <p className={styles.eyebrow}>Put the plan to work</p>
            <h2>{cta.title}</h2>
            <p>{cta.description}</p>
            <div className={styles.actions}><Link className={styles.primaryButton} href={cta.href}>{cta.label}<ArrowRight size={17} aria-hidden="true" /></Link><Link className={styles.textLink} href={cta.serviceHref}>{cta.serviceLabel}<ArrowRight size={15} aria-hidden="true" /></Link></div>
          </div>
          <div className={styles.relatedGuide}><p className={styles.eyebrow}>Keep planning</p><Link href={related.path}>{related.title}<ArrowRight size={20} aria-hidden="true" /></Link></div>
        </div>
      </div>
    </article>
  );
}
