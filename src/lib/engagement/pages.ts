import { portfolioProjects } from "@/lib/portfolio-projects";
import { serviceOptions } from "./shared";

// Only known public routes may be sent to analytics; arbitrary paths may contain PII.
export const publicAnalyticsPages = new Set([
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/testimonials",
  "/contact",
  "/insights",
  "/ai-automation",
  "/websites-for-contractors",
  "/privacy",
  "/terms",
  ...serviceOptions.map(([slug]) => `/services/${slug}`),
  ...portfolioProjects.map(({ link }) => link),
]);
