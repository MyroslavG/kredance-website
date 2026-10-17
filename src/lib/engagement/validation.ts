import { portfolioProjects } from "@/lib/portfolio-projects";
import { InputError, cleanAttribution } from "@/lib/leads/validation";
import { cleanService, publicEvents, serviceOptions, UUID } from "./shared";

const pages = new Set([
  "/",
  "/services",
  "/portfolio",
  "/testimonials",
  "/contact",
  "/ai-automation",
  "/websites-for-contractors",
  "/privacy",
  "/terms",
  ...serviceOptions.map(([slug]) => `/services/${slug}`),
  ...portfolioProjects.map(({ link }) => link),
]);

export function parseSiteEvent(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InputError("Invalid event.");
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.id !== "string" ||
    !UUID.test(raw.id) ||
    typeof raw.sessionId !== "string" ||
    !UUID.test(raw.sessionId) ||
    !(publicEvents as readonly unknown[]).includes(raw.event) ||
    !pages.has(String(raw.page))
  )
    throw new InputError("Invalid event.");
  const attribution = cleanAttribution(raw.attribution);
  if (!pages.has(attribution.landingPath)) attribution.landingPath = "/";
  return {
    id: raw.id,
    sessionId: raw.sessionId,
    event: String(raw.event),
    page: String(raw.page),
    service: cleanService(raw.service),
    placement: [
      "page",
      "hero",
      "card",
      "cta",
      "contact",
      "review",
      "footer",
    ].includes(String(raw.placement))
      ? String(raw.placement)
      : "page",
    device: raw.device === "mobile" ? "mobile" : "desktop",
    attribution,
  };
}
