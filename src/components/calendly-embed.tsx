"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";
import { BOOKING_URL } from "@/lib/leads/validation";
import { isBookingMessage, trackFunnel } from "@/lib/leads/analytics";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

export function CalendlyEmbed({
  location = "contact",
}: {
  location?: "contact" | "review";
}) {
  const container = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const initialize = useCallback(() => {
    if (
      container.current &&
      window.Calendly &&
      !container.current.querySelector("iframe")
    ) {
      window.Calendly.initInlineWidget({
        url: BOOKING_URL,
        parentElement: container.current,
      });
    }
  }, []);

  useEffect(() => {
    initialize();
    const listener = (event: MessageEvent) => {
      const frame =
        container.current?.querySelector("iframe")?.contentWindow ?? null;
      if (!isBookingMessage(event, frame)) return;
      const key: string = event.data.payload.invitee.uri;
      if (seen.current.has(key)) return;
      seen.current.add(key);
      trackFunnel("booking_confirmed", location);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [initialize, location]);

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        onReady={initialize}
      />
      <div
        ref={container}
        className="w-full min-w-0"
        style={{ height: 740 }}
        aria-label="Book a consultation with Kredance"
      />
      <p className={`mt-3 text-center text-sm ${location === "contact" ? "text-sunset/80" : "text-nebulosity/75"}`}>
        Calendar not loading?{" "}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open Calendly
        </a>
        .
      </p>
    </>
  );
}
