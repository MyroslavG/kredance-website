"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { captureAttribution } from "@/lib/leads/attribution";
import { redactAnalyticsUrl } from "@/lib/leads/analytics";
import { clearEngagementSession, trackSite } from "@/lib/engagement/client";
import { CONSENT_KEY, cleanService } from "@/lib/engagement/shared";
import {
  canTrackGoogleAnalytics,
  isGoogleAnalyticsLoaded,
  stopGoogleAnalytics,
  trackGooglePageView,
} from "@/lib/google-analytics";

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}
const project = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "yz8ppr5607";
function snapshot() {
  try {
    return localStorage.getItem(CONSENT_KEY) || "pending";
  } catch {
    return "denied";
  }
}
function subscribe(update: () => void) {
  window.addEventListener("kredance-consent", update);
  window.addEventListener("storage", update);
  return () => {
    window.removeEventListener("kredance-consent", update);
    window.removeEventListener("storage", update);
  };
}

export function SiteAnalytics() {
  return <Suspense fallback={null}><SiteAnalyticsContent /></Suspense>;
}

function SiteAnalyticsContent() {
  const path = usePathname();
  const search = useSearchParams().toString();
  const consent = useSyncExternalStore(subscribe, snapshot, () => "pending");
  const [settings, setSettings] = useState(false);
  const lastPath = useRef("");
  const privatePage = path.startsWith("/dashboard");
  const allowed = consent === "granted" && !privatePage;
  useEffect(() => {
    const open = () => setSettings(true);
    window.addEventListener("kredance-privacy-settings", open);
    return () => window.removeEventListener("kredance-privacy-settings", open);
  }, []);
  useEffect(() => {
    if (!privatePage) captureAttribution();
    // A full navigation unloads recording scripts before the owner signs in.
    if (privatePage && (window.clarity || isGoogleAnalyticsLoaded())) {
      stopGoogleAnalytics();
      window.location.reload();
      return;
    }
    if (!allowed) {
      lastPath.current = "";
      return;
    }
    if (lastPath.current !== path) {
      lastPath.current = path;
      trackSite("page_view");
    }
    const click = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      const placement = anchor.dataset.placement || "page";
      if (anchor.dataset.track === "service_click")
        trackSite("service_click", anchor.dataset.service, placement);
      else if (
        url.origin === window.location.origin &&
        url.pathname.startsWith("/services/") &&
        cleanService(url.pathname.split("/").at(-1))
      )
        trackSite("service_click", url.pathname.split("/").at(-1), placement);
      else if (url.protocol === "mailto:") trackSite("email_click");
      else if (url.protocol === "tel:") trackSite("phone_click");
      else if (
        url.origin === window.location.origin &&
        url.pathname === "/contact"
      )
        trackSite(
          "contact_click",
          url.searchParams.get("service") || "",
          placement,
        );
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [allowed, path, privatePage]);
  useEffect(() => {
    // Hydration briefly uses the server snapshot before reading saved consent.
    // Another component may already have initialized GA using that saved choice.
    if (consent === "pending") return;
    if (!allowed || !canTrackGoogleAnalytics()) {
      const loaded = isGoogleAnalyticsLoaded();
      stopGoogleAnalytics();
      // Unload Google's listeners on revocation or entry into a private/test URL.
      if (loaded) window.location.reload();
      return;
    }
    trackGooglePageView();
  }, [allowed, consent, path, search]);
  useEffect(() => {
    if (!allowed || !/^[a-z0-9]+$/i.test(project) || window.clarity) return;
    if (!["www.kredance.com", "kredance.com"].includes(location.hostname))
      return;
    // Do not send unknown URL parameters (which may contain private data) to replays.
    if (
      [...new URLSearchParams(location.search)].some(
        ([key, value]) =>
          !/^(utm_(source|medium|campaign|content|term)|service|intent)$/.test(
            key,
          ) || !/^[a-zA-Z0-9 _.-]{1,100}$/.test(value),
      )
    )
      return;
    const queue: NonNullable<Window["clarity"]> = (...args) => {
      queue.q?.push(args);
    };
    queue.q = [];
    window.clarity = queue;
    queue("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${project}`;
    document.head.appendChild(script);
  }, [allowed]);
  function choose(value: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* Optional storage. */
    }
    window.dispatchEvent(new Event("kredance-consent"));
    setSettings(false);
    if (value === "denied") {
      stopGoogleAnalytics();
      clearEngagementSession();
      window.clarity?.("consentv2", {
        analytics_Storage: "denied",
        ad_Storage: "denied",
      });
      if (consent === "granted") window.location.reload();
    }
  }
  if (privatePage) return null;
  return (
    <>
      {allowed && (
        <Analytics
          beforeSend={(event) =>
            new URL(event.url).pathname.startsWith("/dashboard")
              ? null
              : { ...event, url: redactAnalyticsUrl(event.url) }
          }
        />
      )}
      {allowed && (
        <SpeedInsights
          beforeSend={(event) =>
            new URL(event.url).pathname.startsWith("/dashboard")
              ? null
              : { ...event, url: redactAnalyticsUrl(event.url) }
          }
        />
      )}
      {(consent === "pending" || settings) && (
        <aside
          aria-label="Analytics preferences"
          className="fixed bottom-4 inset-x-4 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-slate-900 shadow-xl"
        >
          <p className="font-semibold">Analytics preferences</p>
          <p className="mt-1 text-xs leading-relaxed sm:text-sm text-slate-600">
            Optional analytics{project && " and masked session recordings"} help us improve this site.
            Your choice won’t affect enquiries.{" "}
            <a className="underline" href="/privacy">
              Privacy details
            </a>
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => choose("granted")}
              className="flex-1 sm:flex-none rounded-lg bg-neon-navy px-3 py-2 text-sm text-white"
            >
              Allow analytics
            </button>
            <button
              onClick={() => choose("denied")}
              className="flex-1 sm:flex-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Essential only
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
