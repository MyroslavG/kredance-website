"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { captureAttribution } from "@/lib/leads/attribution";
import { redactAnalyticsUrl } from "@/lib/leads/analytics";

export function SiteAnalytics() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return (
    <Analytics
      beforeSend={(event) => ({ ...event, url: redactAnalyticsUrl(event.url) })}
    />
  );
}
