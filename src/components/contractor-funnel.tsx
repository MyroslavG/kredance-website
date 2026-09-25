"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { captureAttribution } from "@/lib/leads/attribution";
import { trackFunnel } from "@/lib/leads/analytics";
import { CalendlyEmbed } from "@/components/calendly-embed";

export function ContractorPageTracking() {
  const tracked = useRef(false);
  useEffect(() => {
    captureAttribution();
    if (!tracked.current) {
      trackFunnel("contractor_page_viewed", "contractor");
      tracked.current = true;
    }
  }, []);
  return null;
}

export function ReviewCTA({
  location,
  children,
  className = "",
}: {
  location: "hero" | "offer";
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#website-review"
      onClick={() => trackFunnel("review_cta_clicked", location)}
      className={`inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

export function WebsiteReviewForm() {
  const started = useRef(false);
  const submissionId = useRef<string | undefined>(undefined);
  const inFlight = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (status === "sent") successHeading.current?.focus();
  }, [status]);

  function start() {
    if (!started.current) {
      started.current = true;
      trackFunnel("review_form_started", "review");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setError("");
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    submissionId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId.current,
          name: form.get("name"),
          email: form.get("email"),
          website: form.get("website"),
          problem: form.get("problem"),
          companyFax: form.get("companyFax"),
          attribution: captureAttribution(),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.accepted) {
        // Validation/conflict responses confirm that this attempt was not accepted.
        if ([400, 409, 422].includes(response.status))
          submissionId.current = undefined;
        throw new Error(
          result.error || "We couldn't save your request. Please try again.",
        );
      }
      setStatus("sent");
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "We couldn't confirm your request. Please try again; duplicate requests are safely handled.",
      );
      setStatus("idle");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "sent")
    return (
      <div className="rounded-3xl border border-neon-navy/10 bg-white p-6 sm:p-9">
        <CheckCircle2
          className="h-10 w-10 text-emerald-700"
          aria-hidden="true"
        />
        <h3
          ref={successHeading}
          tabIndex={-1}
          className="mt-5 text-2xl font-semibold text-neon-navy focus:outline-none"
        >
          Your review request is in.
        </h3>
        <p className="mt-3 leading-relaxed text-nebulosity/75">
          We&apos;ll review your website and reply within one business day with
          three practical improvements. No call is required.
        </p>
        <p className="mt-5 text-sm text-nebulosity/75">
          Prefer to talk through your goals? You can also book a free 30-minute
          consultation.
        </p>
        <button
          onClick={() => setShowBooking(true)}
          className="mt-5 rounded-full bg-neon-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          disabled={showBooking}
        >
          Choose a time
        </button>
        {showBooking && (
          <div className="mt-6 -mx-4 sm:mx-0">
            <CalendlyEmbed location="review" />
          </div>
        )}
      </div>
    );

  const inputClass =
    "mt-2 w-full rounded-xl border border-neon-navy/20 bg-white px-4 py-3 text-base text-nebulosity placeholder:text-nebulosity/45 focus:border-neon-navy focus:outline-2 focus:outline-neon-navy/20 disabled:opacity-60";
  return (
    <form
      onSubmit={submit}
      onChange={start}
      className="rounded-3xl border border-neon-navy/10 bg-white p-6 shadow-sm sm:p-9"
      aria-label="Request a free website review"
    >
      <h3 className="text-xl font-semibold text-neon-navy">
        Tell us where to take a look.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-nebulosity/70">
        A few details help us make your review useful.
      </p>
      <fieldset disabled={status === "sending"} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="text-sm font-medium">
              Your name
            </label>
            <input
              id="review-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Alex Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="review-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="review-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="alex@yourbusiness.ca"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="review-website" className="text-sm font-medium">
            Business website
          </label>
          <input
            id="review-website"
            name="website"
            autoComplete="url"
            inputMode="url"
            required
            minLength={4}
            maxLength={500}
            placeholder="yourbusiness.ca"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="review-problem" className="text-sm font-medium">
            What would you like your website to do better?
          </label>
          <textarea
            id="review-problem"
            name="problem"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            placeholder="For example: make it easier for homeowners to request a renovation estimate."
            className={`${inputClass} resize-y`}
          />
        </div>
        <div
          className="absolute -left-[10000px] h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="review-fax">Company fax</label>
          <input
            id="review-fax"
            name="companyFax"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-neon-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-nebulosity disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving your request…
            </>
          ) : (
            <>
              Get my free website review
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </fieldset>
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-900"
        >
          {error} You can also email{" "}
          <a className="underline" href="mailto:myroslav@kredance.com">
            myroslav@kredance.com
          </a>
          .
        </div>
      )}
      <p className="mt-4 text-xs leading-relaxed text-nebulosity/65">
        We&apos;ll use these details to respond to your request. This does not
        subscribe you to marketing emails.{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy policy
        </Link>
      </p>
    </form>
  );
}
