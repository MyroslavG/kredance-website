"use client";

import { captureAttribution } from "@/lib/leads/attribution";
import { analyticsAllowed, cleanService, UUID, type SiteEvent } from "./shared";

let session: { id: string; last: number } | undefined;
export function engagementSession(): string | undefined {
  if (!analyticsAllowed() || window.location.pathname.startsWith("/dashboard"))
    return;
  const now = Date.now();
  if (!session) {
    try {
      session = JSON.parse(
        sessionStorage.getItem("kredance:visit:v1") || "null",
      );
    } catch {
      /* Storage is optional. */
    }
  }
  if (
    !session ||
    !UUID.test(session.id) ||
    !Number.isFinite(session.last) ||
    now - session.last > 30 * 60_000
  ) {
    session = { id: crypto.randomUUID(), last: now };
  }
  session.last = now;
  try {
    sessionStorage.setItem("kredance:visit:v1", JSON.stringify(session));
  } catch {
    /* Memory fallback. */
  }
  return session.id;
}

export function clearEngagementSession() {
  session = undefined;
  try {
    sessionStorage.removeItem("kredance:visit:v1");
  } catch {
    /* Storage is optional. */
  }
}

export function trackSite(event: SiteEvent, service = "", placement = "page") {
  try {
    const sessionId = engagementSession();
    if (!sessionId) return;
    void fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        id: crypto.randomUUID(),
        sessionId,
        event,
        page: window.location.pathname,
        service: cleanService(service),
        placement,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        attribution: captureAttribution(),
      }),
    }).catch(() => {});
  } catch {
    /* Analytics must never interrupt navigation or forms. */
  }
}
