import { requireOwner, privateHeaders } from "@/lib/engagement/dashboard";
import { leadsCsv, parseExportFilters } from "@/lib/engagement/lead-export";
import type { LeadRecord } from "@/lib/engagement/lead-record";
import { databaseRpc, leadConfig } from "@/lib/leads/server";
import { InputError } from "@/lib/leads/validation";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const session = await requireOwner(request);
    const { days, view, query } = parseExportFilters(new URL(request.url));
    const leads = await databaseRpc<LeadRecord[]>(leadConfig(), "dashboard_export_leads", {
      p_session_hash: session, p_days: days, p_view: view, p_query: query,
    });
    if (leads.length > 10_000) throw new InputError("More than 10,000 enquiries match. Narrow the period, status or search before exporting.");
    return new Response(leadsCsv(leads), { headers: {
      ...privateHeaders, "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kredance-leads-${view === "overdue" ? "overdue" : `${days}-days`}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "X-Content-Type-Options": "nosniff",
    } });
  } catch (error) {
    return Response.json({ error: error instanceof InputError ? error.message : "The export could not load. Please try again." }, {
      status: error instanceof InputError ? error.status : 503, headers: privateHeaders,
    });
  }
}
