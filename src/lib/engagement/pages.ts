import { portfolioProjects } from "@/lib/portfolio-projects";
import { guides } from "@/lib/guides";
import { serviceOptions } from "./shared";

// Only known public routes may be sent to analytics; arbitrary paths may contain PII.
export const publicAnalyticsPages = new Set([
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/testimonials",
  "/contact",
  "/guides",
  "/insights",
  "/ai-automation",
  "/websites-for-contractors",
  "/privacy",
  "/terms",
  ...serviceOptions.filter(([slug]) => slug !== "news").map(([slug]) => `/services/${slug}`),
  ...guides.map(({ path }) => path),
  ...portfolioProjects.map(({ link }) => link),
]);
