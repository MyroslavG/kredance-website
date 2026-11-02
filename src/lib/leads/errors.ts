// Fixed diagnostic values only. Never record submitted values or raw exceptions.
export const leadErrorCodes = [
  "validation", "request_blocked", "rate_limited", "submission_conflict",
  "service_unavailable", "network", "timeout", "unexpected_response", "client_error",
] as const;
export const leadErrorFields = ["name", "email", "website", "problem", "subject"] as const;
export type LeadErrorCode = (typeof leadErrorCodes)[number];
export type LeadErrorField = (typeof leadErrorFields)[number];
export type LeadDiagnostic = { code: LeadErrorCode; field?: LeadErrorField; httpStatus?: number };

export function cleanLeadDiagnostic(value: unknown): LeadDiagnostic | undefined {
  if (!value || typeof value !== "object") return;
  const raw = value as Record<string, unknown>;
  if (!(leadErrorCodes as readonly unknown[]).includes(raw.code)) return;
  return {
    code: raw.code as LeadErrorCode,
    ...(raw.code === "validation" && (leadErrorFields as readonly unknown[]).includes(raw.field)
      ? { field: raw.field as LeadErrorField } : {}),
    ...(typeof raw.httpStatus === "number" && Number.isInteger(raw.httpStatus) && raw.httpStatus >= 400 && raw.httpStatus <= 599
      ? { httpStatus: raw.httpStatus } : {}),
  };
}
