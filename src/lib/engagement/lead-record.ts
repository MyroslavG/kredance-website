import { leadStatuses } from "./shared";

export const manualSources = [
  ["referral", "Referral"], ["email", "Email"], ["social", "Social / DM"],
  ["conversation", "Conversation / phone"], ["other", "Other"],
] as const;
export function entryLabel(channel: string) {
  return channel === "website" ? "Website" : manualSources.find(([key]) => key === channel)?.[1] || "Website";
}
export type LeadRecord = {
  id: string; name: string; email: string | null; business_name: string;
  contact_detail: string; entry_channel: string; website: string; problem: string;
  offer: string; service: string; subject: string; status: string; qualified: boolean;
  deal_value: number | null; notes: string; next_action: string; next_action_at: string;
  created_at: string; updated_at: string;
  attribution: { landingPath?: string; referrerHost?: string; utm?: Record<string, string> };
};
export const leadViews: readonly string[] = ["all", "overdue", ...leadStatuses];
export function matchesLeadSearch(lead: LeadRecord, query: string) {
  return [lead.name, lead.email, lead.business_name, lead.contact_detail, lead.subject, lead.service]
    .filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
}
