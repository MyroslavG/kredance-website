import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { siteConfig } from "@/lib/site";

const title = "Kredance | AI Automation, Web Development & Digital Marketing";

export const metadata: Metadata = {
  title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    images: [{ url: "/kredance_logo_2026.png", alt: "Kredance digital agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: ["/kredance_logo_2026.png"],
  },
};

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
    </div>
  );
}
