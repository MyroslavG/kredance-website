import { InputError, normalizeWebsite } from "../leads/validation";
import { cleanService, UUID } from "./shared";
import { manualSources } from "./lead-record";

export function parseManualLead(value: unknown, now = Date.now()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Invalid enquiry.");
  const raw = value as Record<string, unknown>;
  const text = (key: string, label: string, min: number, max: number, multiline = false) => {
    const value = raw[key] ?? "";
    if (typeof value !== "string" || value.trim().length < min || value.trim().length > max ||
      (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f]/ : /[\x00-\x1f]/).test(value))
      throw new InputError(`${label} must contain ${min}–${max} valid characters.`);
    return value.trim();
  };
  const submissionId = text("submissionId", "Submission ID", 36, 36);
  if (!UUID.test(submissionId)) throw new InputError("Reopen the form and try again.");
  const channel = text("entry_channel", "Source", 1, 30);
  if (!manualSources.some(([key]) => key === channel)) throw new InputError("Choose an enquiry source.");
  const email = text("email", "Email", 0, 254).toLowerCase();
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new InputError("Enter a valid email address.");
  const contact = text("contact_detail", "Other contact details", 0, 300);
  if (!email && !contact) throw new InputError("Add an email address or another way to contact this person.");
  const received = text("received_at", "Received date", 1, 40);
  const timestamp = Date.parse(received);
  if (!Number.isFinite(timestamp) || !/T.*(?:Z|[+-]\d\d:\d\d)$/.test(received) || timestamp < Date.UTC(2000, 0, 1) || timestamp > now + 300_000)
    throw new InputError("Choose a received date between 2000 and now.");
  const service = cleanService(raw.service);
  if (raw.service && !service) throw new InputError("Choose a service from the list.");
  return {
    submissionId, name: text("name", "Contact name", 2, 100),
    business_name: text("business_name", "Business name", 0, 150),
    email: email || null, contact_detail: contact, entry_channel: channel,
    website: normalizeWebsite(text("website", "Website", 0, 500)), service,
    problem: text("problem", "Enquiry details", 10, 2000, true),
    next_action: text("next_action", "Next action", 2, 500),
    received_at: new Date(timestamp).toISOString(),
  };
}
