"use client";

import { track } from "@vercel/analytics";
import { analyticsAllowed } from "../engagement/shared";
import { trackGoogleEvent, type SavedLeadEvent } from "../google-analytics";

export type FunnelEvent =
  | "contractor_page_viewed"
  | "review_cta_clicked"
  | "review_form_started"
  | "booking_confirmed"
  | "lead_submitted";
export type FunnelLocation =
  | "hero"
  | "offer"
  | "review"
  | "contractor"
  | "contact";

export function trackFunnel(event: Exclude<FunnelEvent, "lead_submitted">, location: FunnelLocation): boolean;
export function trackFunnel(event: "lead_submitted", location: "review" | "contact", lead: SavedLeadEvent): boolean;
export function trackFunnel(event: FunnelEvent, location: FunnelLocation, lead?: SavedLeadEvent) {
  if (!analyticsAllowed()) return false;
  try {
    const recorded = trackGoogleEvent(event, location, lead);
    // The database already records saved inquiries transactionally. Never accept
    // a browser-generated conversion through the public funnel-events endpoint.
    if (event === "lead_submitted") return recorded;
  } catch {
    /* Optional analytics must never block an inquiry. */
    if (event === "lead_submitted") return false;
  }
  try {
    track(event, { location });
  } catch {
    /* Analytics must never block an inquiry. */
  }
  try {
    void fetch("/api/funnel-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ id: crypto.randomUUID(), event, location }),
    }).catch(() => {
      /* Best-effort browser events must never block the form. */
    });
  } catch {
    /* Browsers without crypto/fetch can still submit inquiries. */
  }
  return true;
}

// Only remove sensitive URL components; do not send form values as analytics properties.
export function redactAnalyticsUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "/";
  }
}

export function isBookingMessage(
  event: Pick<MessageEvent, "origin" | "source" | "data">,
  frame: Window | null,
): boolean {
  return (
    !!frame &&
    event.source === frame &&
    event.origin === "https://calendly.com" &&
    event.data?.event === "calendly.event_scheduled" &&
    typeof event.data?.payload?.invitee?.uri === "string"
  );
}
