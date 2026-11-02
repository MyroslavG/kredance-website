import { cleanLeadDiagnostic, type LeadDiagnostic } from "./errors";
import { InputError, parseLead } from "./validation";

export class LeadSubmissionError extends Error {
  constructor(message: string, public diagnostic: LeadDiagnostic, public resetSubmissionId = false) {
    super(message);
  }
}

export function submissionFailure(error: unknown): LeadSubmissionError {
  if (error instanceof LeadSubmissionError) return error;
  if (error instanceof InputError)
    return new LeadSubmissionError(error.message, { code: error.code, field: error.field }, true);
  return new LeadSubmissionError(
    "We couldn’t send your request. Please try again or email us directly.",
    { code: "client_error" },
  );
}

export async function submitLead(
  payload: Record<string, unknown>, fetcher: typeof fetch = fetch, timeoutMs = 20_000,
): Promise<void> {
  // The same rules run before sending and on the server. Keep the original
  // payload so that the server still checks the honeypot and request identity.
  parseLead(payload);
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
    const response = await fetcher("/api/leads", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (response.ok && result?.accepted === true) return;
    const fallback = response.status === 429 ? "rate_limited"
      : response.status === 409 ? "submission_conflict"
      : response.status >= 500 ? "service_unavailable"
      : response.status === 403 ? "request_blocked"
      : [400, 422].includes(response.status) ? "validation" : "unexpected_response";
    const diagnostic = cleanLeadDiagnostic({
      code: result?.code, field: result?.field, httpStatus: response.status,
    }) || cleanLeadDiagnostic({ code: fallback, httpStatus: response.status })!;
    throw new LeadSubmissionError(
      typeof result?.error === "string" ? result.error.slice(0, 300)
        : "We couldn’t confirm your request. Please retry; duplicate requests are safely handled.",
      diagnostic, [400, 409, 422].includes(response.status),
    );
  } catch (error) {
    if (error instanceof LeadSubmissionError) throw error;
    throw new LeadSubmissionError(
      timedOut ? "We couldn’t confirm your request in time. Please retry; duplicate requests are safely handled."
        : "We couldn’t connect to save your request. Check your connection and try again.",
      { code: timedOut ? "timeout" : "network" },
    );
  } finally { clearTimeout(timer); }
}
