import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { portfolioAdditions } from "@/lib/portfolio-additions";
import { guides } from "@/lib/guides";

export const dynamic = "force-static";

const routes = [
  "",
  "/ai-automation",
  "/contact",
  "/guides",
  "/websites-for-contractors",
  "/portfolio",
  "/portfolio/roofing-lead-generation",
  "/portfolio/ai-content-publisher",
  "/portfolio/ai-user-activity-plugin",
  "/portfolio/ai-video-ad-generation",
  "/portfolio/australian-travel-data-mining",
  "/portfolio/aux-mobile-app",
  "/portfolio/beauty-stories",
  "/portfolio/brp-truck-advertising",
  "/portfolio/car-washing-security",
  "/portfolio/cfmoto-kyiv",
  "/portfolio/consolegroup",
  "/portfolio/cv-processing",
  "/portfolio/dzikus-media-app",
  "/portfolio/dzvinski",
  "/portfolio/eboss-recruitment-crm",
  "/portfolio/eleve-design-website",
  "/portfolio/fidan-construction",
  "/portfolio/green-agro",
  "/portfolio/hide-seek-chrome-extension",
  "/portfolio/iamqr",
  "/portfolio/linkedin-data-scraping",
  "/portfolio/neon-vibez",
  "/portfolio/restaurant-menu-design",
  "/portfolio/shopify-loyalty-plugin",
  "/portfolio/shopklub",
  "/portfolio/talent-connect",
  "/portfolio/tamar-film-website",
  "/portfolio/telegram-shopify-integration",
  "/portfolio/the-wow-camp-website",
  "/portfolio/whatsapp-chatbox-integration",
  "/portfolio/zahid-power-motors",
  "/privacy",
  "/services",
  "/services/facebook-lead-generation",
  "/services/advertisement-creation",
  "/services/ai-automation",
  "/services/ai-integration",
  "/services/cybersecurity",
  "/services/data-migration",
  "/services/data-mining",
  "/services/design",
  "/services/ecommerce",
  "/services/google-ads",
  "/services/mobile-app-development",
  "/services/small-business-it",
  "/services/universal-plugin-solutions",
  "/services/website-development",
  "/services/website-seo",
  "/terms",
  "/testimonials",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes,
    ...guides.map(({ path }) => path),
    ...portfolioAdditions.map(({ slug }) => `/portfolio/${slug}`),
  ].map((route) => ({ url: `${siteConfig.url}${route}` }));
}
