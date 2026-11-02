"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { engagementSession, trackSite } from "../engagement/client";
import { captureAttribution } from "./attribution";
import { trackFunnel } from "./analytics";
import { submitLead, submissionFailure, type LeadSubmissionError } from "./submit";

type Options = {
  kind: "contact" | "website_review" | "contractor_review";
  service: string;
  subject?: string;
  placement: string;
  location: "contact" | "review" | "campaign";
};

export function useLeadForm(options: Options) {
  const submissionId = useRef<string | undefined>(undefined);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<LeadSubmissionError>();

  useEffect(() => {
    const field = failure?.diagnostic.field;
    if (!field || status !== "idle") return;
    const fields = formRef.current?.elements;
    const input = fields?.namedItem(field) || (field === "problem" ? fields?.namedItem("message") : null);
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.setCustomValidity(failure.message);
      input.focus();
      input.reportValidity();
    }
  }, [failure, status]);

  function onInput(event: FormEvent<HTMLFormElement>) {
    const input = event.target;
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)
      input.setCustomValidity("");
    setFailure(undefined);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    formRef.current = event.currentTarget;
    setFailure(undefined);
    setStatus("sending");
    let service = options.service;
    try {
      const form = new FormData(event.currentTarget);
      service = String(form.get("service") || options.service);
      submissionId.current ??= crypto.randomUUID();
      let sessionId: string | undefined;
      try { sessionId = engagementSession(); } catch { /* Optional analytics. */ }
      await submitLead({
        submissionId: submissionId.current, sessionId, kind: options.kind,
        service, subject: options.subject,
        name: form.get("name"), email: form.get("email"), website: form.get("website"),
        problem: form.get("message") ?? form.get("problem"), companyFax: form.get("companyFax"),
        attribution: captureAttribution(),
      });
      setStatus("sent");
      trackFunnel("lead_submitted", options.location, { submissionId: submissionId.current, service });
    } catch (cause) {
      const error = submissionFailure(cause);
      if (error.resetSubmissionId) submissionId.current = undefined;
      setFailure(error);
      trackSite("form_error", service, options.placement, error.diagnostic);
      setStatus("idle");
    } finally { inFlight.current = false; }
  }

  return { submit, onInput, status, error: failure?.message || "" };
}
