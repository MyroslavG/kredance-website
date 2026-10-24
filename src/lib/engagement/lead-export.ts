import { InputError } from "../leads/validation";
import { entryLabel, leadViews, type LeadRecord } from "./lead-record";
import { serviceLabel } from "./shared";

export function parseExportFilters(url: URL) {
  const days = Number(url.searchParams.get("days") || 30);
  const view = url.searchParams.get("view") || "all";
  const query = (url.searchParams.get("q") || "").trim();
  if (![7, 30, 90].includes(days) || !leadViews.includes(view) || query.length > 200 || /[\x00-\x1f]/.test(query))
    throw new InputError("Choose a valid reporting period, status and search.");
  return { days, view, query };
}
function cell(value: unknown) {
  let text = value == null ? "" : String(value);
  // Quote every cell, escape separators/quotes, and neutralize formula-like input.
  // The apostrophe is part of the exported text; this is a viewing export, not a raw backup.
  if (/^[\s\uFEFF]*[=+\-@＝＋－＠]/u.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function leadsCsv(leads: LeadRecord[]) {
  const rows: unknown[][] = [["Lead ID", "Contact name", "Business", "Email", "Other contact", "Entry channel", "Service", "Request", "Status", "Qualified", "Deal value CAD (estimate)", "Received UTC", "Follow-up UTC", "Next action", "Notes", "Website", "Source", "Campaign", "Post", "Landing page"]];
  for (const lead of leads) rows.push([
    lead.id, lead.name, lead.business_name, lead.email, lead.contact_detail,
    entryLabel(lead.entry_channel), serviceLabel(lead.service), lead.problem,
    lead.status, lead.qualified ? "Yes" : "No", lead.deal_value,
    new Date(lead.created_at).toISOString(), new Date(lead.next_action_at).toISOString(), lead.next_action, lead.notes, lead.website,
    lead.attribution.utm?.utm_source || lead.attribution.referrerHost || "direct / unknown",
    lead.attribution.utm?.utm_campaign || "", lead.attribution.utm?.utm_content || "", lead.attribution.landingPath || "",
  ]);
  return "\uFEFF" + rows.map(row => row.map(cell).join(",")).join("\r\n") + "\r\n";
}
