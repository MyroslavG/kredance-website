"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

type BreadcrumbJsonLdProps = {
  sectionName: string;
  sectionPath: `/${string}`;
  currentName: string;
};

export function BreadcrumbJsonLd({
  sectionName,
  sectionPath,
  currentName,
}: BreadcrumbJsonLdProps) {
  const pathname = usePathname();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: sectionName,
        item: `${siteConfig.url}${sectionPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: currentName,
        item: `${siteConfig.url}${pathname}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
