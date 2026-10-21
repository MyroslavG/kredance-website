export const serviceOptions = [
  ["website-development", "Website Development"],
  ["website-seo", "Website SEO"],
  ["ecommerce", "Ecommerce"],
  ["advertisement-creation", "Advertising"],
  ["facebook-lead-generation", "Facebook Lead Generation"],
  ["google-ads", "Google Ads"],
  ["ai-automation", "AI Automation"],
  ["ai-integration", "AI Integration"],
  ["mobile-app-development", "Mobile App Development"],
  ["design", "Design & Branding"],
  ["cybersecurity", "Cybersecurity"],
  ["data-migration", "Data Migration"],
  ["data-mining", "Data Mining"],
  ["small-business-it", "Small Business IT"],
  ["universal-plugin-solutions", "Plugins & Integrations"],
  ["news", "Other"],
] as const;

export function cleanService(value: unknown): string {
  return typeof value === "string" &&
    serviceOptions.some(([slug]) => slug === value)
    ? value
    : "";
}

export function serviceLabel(value: string): string {
  return (
    serviceOptions.find(([slug]) => slug === value)?.[1] || "General inquiry"
  );
}

export const publicEvents = [
  "page_view",
  "service_click",
  "contact_click",
  "form_start",
  "form_error",
  "email_click",
  "phone_click",
] as const;
export type SiteEvent = (typeof publicEvents)[number];
export const leadStatuses = [
  "new",
  "contacted",
  "call_booked",
  "proposal_sent",
  "won",
  "lost",
] as const;
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const CONSENT_KEY = "kredance:analytics-consent:v1";

export function analyticsAllowed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}
