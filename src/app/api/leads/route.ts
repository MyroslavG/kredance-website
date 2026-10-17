import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import {
  databaseRpc,
  dispatchLeadEmails,
  handleLeadRequest,
  leadConfig,
  type SavedLead,
} from "@/lib/leads/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleLeadRequest(request, {
    config: leadConfig,
    save: (config, body) =>
      databaseRpc<SavedLead>(config, "accept_website_lead", body),
    accepted: (saved, input) =>
      after(async () => {
        await Promise.allSettled([
          dispatchLeadEmails(saved.id).catch(() =>
            console.error("lead_dispatch_failed", { leadId: saved.id }),
          ),
          saved.created && input.sessionId
            ? track(input.kind === "contact" ? "contact_inquiry_saved" : "review_inquiry_saved", {
                offer: input.kind,
              }).catch(() => console.error("lead_analytics_failed"))
            : Promise.resolve(),
        ]);
      }),
  });
}
