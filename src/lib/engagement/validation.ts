import { InputError, cleanAttribution } from "@/lib/leads/validation";
import { cleanService, publicEvents, UUID } from "./shared";
import { publicAnalyticsPages as pages } from "./pages";

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
