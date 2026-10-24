"use client";

import { captureAttribution } from "./leads/attribution";
import { analyticsAllowed, cleanService, UUID } from "./engagement/shared";
import { publicAnalyticsPages } from "./engagement/pages";
import type { Attribution } from "./leads/validation";

export const GOOGLE_ANALYTICS_ID = "G-6DG9G4KKS4";
const LEAD_EVENTS_KEY = "kredance:ga-saved-leads:v1";
const productionHosts = new Set(["www.kredance.com", "kredance.com"]);
const excludedSources = new Set(["setup-test", "internal", "preview"]);
const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

type Context = {
  consent: boolean;
  url: string;
  referrer: string;
  attribution: Attribution;
};
type Environment = {
  context: () => Context;
  emit: (...args: unknown[]) => void;
  load: () => void;
  disable: (disabled: boolean) => void;
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
};
export type SavedLeadEvent = { submissionId: string; service?: string };

export function googleAnalyticsPage(context: Context) {
  if (!context.consent) return null;
  try {
    const url = new URL(context.url);
    if (
      url.protocol !== "https:" ||
      !productionHosts.has(url.host) ||
      !publicAnalyticsPages.has(url.pathname) ||
      excludedSources.has((url.searchParams.get("utm_source") || "").toLowerCase()) ||
      excludedSources.has((context.attribution.utm.utm_source || "").toLowerCase())
    ) return null;
    let referrer = "";
    try {
      const source = new URL(context.referrer);
      if (["http:", "https:"].includes(source.protocol)) {
        // External paths, query values and fragments may contain personal data.
        referrer = source.origin;
      }
    } catch { /* A direct visit has no referrer. */ }
    return {
      page_location: `${url.origin}${url.pathname}`,
      page_referrer: referrer,
      // A known route is stable and cannot interpolate customer/form values.
      page_title: url.pathname === "/" ? "Kredance" : `Kredance | ${url.pathname}`,
    };
  } catch {
    return null;
  }
}

function campaignParameters(attribution: Attribution) {
  const parameters: Record<string, string> = {};
  for (const [utm, ga] of [
    ["utm_source", "campaign_source"],
    ["utm_medium", "campaign_medium"],
    ["utm_campaign", "campaign_name"],
    ["utm_content", "campaign_content"],
    ["utm_term", "campaign_term"],
  ] as const) {
    const value = attribution.utm[utm];
    if (value && /^[a-zA-Z][a-zA-Z0-9_.-]{0,99}$/.test(value)) parameters[ga] = value;
  }
  return parameters;
}

// Dependency injection keeps consent, deduplication and payload checks testable
// without loading Google or making any analytics requests during tests.
export function createGoogleAnalytics(environment: Environment) {
  let initialized = false;
  let active = false;
  let lastPage = "";
  let previousPage = "";
  const savedLeads = new Set<string>();
  try {
    const stored: unknown = JSON.parse(environment.storage?.getItem(LEAD_EVENTS_KEY) || "[]");
    if (Array.isArray(stored)) {
      for (const id of stored) if (typeof id === "string" && UUID.test(id)) savedLeads.add(id);
    }
  } catch { /* Session storage is optional. */ }

  function prepare() {
    const context = environment.context();
    const page = googleAnalyticsPage(context);
    if (!page) return null;
    environment.disable(false);
    if (!initialized) {
      environment.emit("consent", "default", deniedConsent);
      environment.emit("consent", "update", { ...deniedConsent, analytics_storage: "granted" });
      environment.emit("js", new Date());
      environment.emit("config", GOOGLE_ANALYTICS_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...page,
        ...campaignParameters(context.attribution),
      });
      initialized = true;
      active = true;
      environment.load();
    } else if (!active) {
      environment.emit("consent", "update", { ...deniedConsent, analytics_storage: "granted" });
      active = true;
    }
    environment.emit("set", page);
    return page;
  }

  return {
    pageView() {
      const page = prepare();
      if (!page || lastPage === page.page_location) return false;
      const referrer = previousPage || page.page_referrer;
      lastPage = page.page_location;
      previousPage = page.page_location;
      environment.emit("event", "page_view", {
        ...page,
        page_referrer: referrer,
        send_to: GOOGLE_ANALYTICS_ID,
      });
      return true;
    },
    event(event: string, location: string, lead?: SavedLeadEvent) {
      if (event === "lead_submitted" && (!lead || !UUID.test(lead.submissionId) || savedLeads.has(lead.submissionId))) return false;
      const page = prepare();
      if (!page) return false;
      // Only fixed event/location labels and an allowlisted service reach GA.
      const allowedEvents: Record<string, readonly string[]> = {
        contractor_page_viewed: ["contractor"],
        review_cta_clicked: ["hero", "offer"],
        review_form_started: ["review"],
        booking_confirmed: ["review", "contact"],
        lead_submitted: ["review", "contact", "campaign"],
      };
      if (!allowedEvents[event]?.includes(location)) return false;
      if (event === "lead_submitted" && lead) {
        savedLeads.add(lead.submissionId);
        try {
          environment.storage?.setItem(LEAD_EVENTS_KEY, JSON.stringify([...savedLeads].slice(-100)));
        } catch { /* In-memory deduplication still works. */ }
      }
      environment.emit("event", event === "lead_submitted" ? "generate_lead" : event, {
        ...page,
        location,
        ...(event === "lead_submitted" ? { lead_source: location === "review" ? "website_review" : location === "campaign" ? "campaign_review" : "contact_form", service: cleanService(lead?.service) } : {}),
        send_to: GOOGLE_ANALYTICS_ID,
      });
      return true;
    },
    revoke() {
      environment.disable(true);
      if (initialized && active) environment.emit("consent", "update", deniedConsent);
      active = false;
      lastPage = "";
      try { environment.storage?.removeItem(LEAD_EVENTS_KEY); } catch { /* Optional storage. */ }
    },
    isLoaded: () => initialized,
  };
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-6DG9G4KKS4"?: boolean;
  }
}

let client: ReturnType<typeof createGoogleAnalytics> | undefined;
function browserContext(): Context {
  return { consent: analyticsAllowed(), url: window.location.href, referrer: document.referrer, attribution: captureAttribution() };
}
function googleAnalytics() {
  if (typeof window === "undefined") return undefined;
  if (!client) {
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Optional storage. */ }
    client = createGoogleAnalytics({
      context: browserContext,
      emit: (...args) => {
        window.dataLayer ??= [];
        window.gtag ??= function () {
          // Google's command queue expects the function's arguments object.
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer?.push(arguments);
        };
        window.gtag(...args);
      },
      load: () => {
        const script = document.createElement("script");
        script.id = "kredance-google-analytics";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);
      },
      disable: (disabled) => { window["ga-disable-G-6DG9G4KKS4"] = disabled; },
      storage,
    });
  }
  return client;
}

export function trackGooglePageView() {
  try { return googleAnalytics()?.pageView() ?? false; } catch { return false; }
}
export const trackGoogleEvent = (event: string, location: string, lead?: SavedLeadEvent) => googleAnalytics()?.event(event, location, lead) ?? false;
export function stopGoogleAnalytics() {
  try { client?.revoke(); } catch { /* Optional analytics cannot interrupt navigation. */ }
}
export const isGoogleAnalyticsLoaded = () => client?.isLoaded() ?? false;
export const canTrackGoogleAnalytics = () => typeof window !== "undefined" && googleAnalyticsPage(browserContext()) !== null;
