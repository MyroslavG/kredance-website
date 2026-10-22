"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendlyEmbed } from "@/components/calendly-embed";
import { captureAttribution } from "@/lib/leads/attribution";
import { engagementSession, trackSite } from "@/lib/engagement/client";
import { cleanService, serviceOptions } from "@/lib/engagement/shared";
import { trackFunnel } from "@/lib/leads/analytics";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40 focus:outline-2 focus:outline-sunset";

export function Contact() {
  return (
    <Suspense fallback={<ContactForm review={false} initialService="" />}>
      <ContactWithParams />
    </Suspense>
  );
}

function ContactWithParams() {
  const params = useSearchParams();
  const review = params.get("intent") === "review";
  const initialService = cleanService(params.get("service"));
  return (
    <ContactForm
      key={`${review}:${initialService}`}
      review={review}
      initialService={initialService}
    />
  );
}
function ContactForm({
  review,
  initialService,
}: {
  review: boolean;
  initialService: string;
}) {
  const submissionId = useRef<string | undefined>(undefined);
  const started = useRef(false);
  const inFlight = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    submissionId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          submissionId: submissionId.current,
          sessionId: engagementSession(),
          kind: review ? "website_review" : "contact",
          service: form.get("service"),
          name: form.get("name"),
          email: form.get("email"),
          website: form.get("website"),
          problem: form.get("message"),
          companyFax: form.get("companyFax"),
          attribution: captureAttribution(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.accepted) {
        if ([400, 409, 422].includes(response.status))
          submissionId.current = undefined;
        throw new Error(
          result.error || "We couldn’t save your request. Please try again.",
        );
      }
      setStatus("sent");
      trackFunnel("lead_submitted", "contact", {
        submissionId: submissionId.current,
        service: String(form.get("service") || ""),
      });
    } catch (cause) {
      trackSite("form_error", String(form.get("service") || ""), "contact");
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "We couldn’t confirm your request. Please retry; duplicate requests are safely handled.",
      );
      setStatus("idle");
    } finally {
      inFlight.current = false;
    }
  }
  return (
    <>
      <section
        id="inquiry-form"
        className="bg-nebulosity px-6 pt-32 pb-24 scroll-mt-24"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:gap-x-16 lg:grid-cols-2">
          <div className="text-sunset">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              {review
                ? "Get three ideas for a better website."
                : "What would you like to build?"}
            </h1>
            <p className="mt-6 text-lg text-sunset/70">
              {review
                ? "Share your website. We’ll send three practical improvements within one business day. No call required."
                : "Tell us a little about your project. We’ll reply within one business day with a useful next step."}
            </p>
          </div>
          {status === "sent" ? (
            <div
              role="status"
              className="h-fit rounded-2xl border border-white/15 bg-white/5 p-8 text-sunset"
            >
              <h2 className="text-2xl font-semibold">
                Your {review ? "review request" : "message"} is in.
              </h2>
              <p className="mt-4">
                We’ve saved your request and will reply within one business day.
                You don’t need to submit it again.
              </p>
              <a href="#book-a-call" className="mt-6 inline-block underline">
                You can also book a free consultation.
              </a>
            </div>
          ) : (
            <form
              onSubmit={submit}
              onChange={() => {
                if (!started.current) {
                  started.current = true;
                  trackSite("form_start", initialService, "contact");
                }
              }}
              data-clarity-mask="true"
              aria-label={
                review ? "Request a website review" : "Project inquiry"
              }
              className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-sunset"
            >
              <fieldset disabled={status === "sending"} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block text-sm">
                    Name
                    <input
                      className={inputClass}
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </label>
                  <label className="block text-sm">
                    Email
                    <input
                      className={inputClass}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </label>
                </div>
                {review ? (
                  <input type="hidden" name="service" value={initialService || "website-development"} />
                ) : <label className="block text-sm">
                  Service
                  <select
                    key={initialService}
                    name="service"
                    defaultValue={initialService}
                    className={`${inputClass} [&>option]:bg-nebulosity`}
                  >
                    <option value="">Not sure yet</option>
                    {serviceOptions.map(([slug, label]) => (
                      <option key={slug} value={slug}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>}
                <label className="block text-sm">
                  Website {review ? "" : "(optional)"}
                  <input
                    className={inputClass}
                    name="website"
                    inputMode="url"
                    autoComplete="url"
                    required={review}
                    minLength={4}
                    maxLength={500}
                    placeholder="yourbusiness.ca"
                  />
                </label>
                <label className="block text-sm">
                  {review
                    ? "Anything you’d like us to look at? (optional)"
                    : "Tell us about your project"}
                  <textarea
                    className={inputClass}
                    name="message"
                    rows={4}
                    required={!review}
                    minLength={10}
                    maxLength={2000}
                    placeholder={
                      review
                        ? "For example: help visitors request a quote."
                        : "What do you need, and when would you like to start?"
                    }
                  />
                </label>
                <div
                  aria-hidden="true"
                  className="absolute -left-[10000px] h-px w-px overflow-hidden"
                >
                  <label>
                    Company fax
                    <input name="companyFax" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <button
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-sunset px-6 py-3.5 font-medium text-neon-navy hover:bg-white disabled:opacity-60"
                >
                  {status === "sending"
                    ? "Saving your request…"
                    : review
                      ? "Get my free website review"
                      : "Send message"}
                </button>
              </fieldset>
              {error && (
                <p role="alert" className="mt-4 text-red-200">
                  {error} You can also email us directly.
                </p>
              )}
              <p className="mt-4 text-xs text-sunset/60">
                We use these details to respond to your request. No marketing
                subscription.{" "}
                <Link href="/privacy" className="underline">
                  Privacy policy
                </Link>
              </p>
            </form>
          )}
          <div className="lg:col-span-2 border-t border-white/15 pt-6 text-sm text-sunset/75">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <a href="mailto:myroslav@kredance.com" className="underline underline-offset-4">myroslav@kredance.com</a>
              <a href="tel:+14384973894" className="underline underline-offset-4">+1 (438) 497-3894</a>
              <a href="#book-a-call" className="underline underline-offset-4">Prefer a call? Choose a time</a>
            </div>
            <p className="mt-4">
              {review ? (
                <Link href="/contact#inquiry-form" className="underline underline-offset-4">Have a new project instead?</Link>
              ) : (
                <Link href="/contact?intent=review#inquiry-form" className="underline underline-offset-4">Already have a website? Request a free review.</Link>
              )}
            </p>
          </div>
        </div>
      </section>
      <section
        id="book-a-call"
        className="bg-nebulosity px-6 pb-24 scroll-mt-24"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-sunset">
            Schedule a free consultation
          </h2>
          <p className="mt-3 mb-8 text-center text-sunset/60">
            A 30-minute conversation about your project.
          </p>
          <CalendlyEmbed />
        </div>
      </section>
    </>
  );
}
