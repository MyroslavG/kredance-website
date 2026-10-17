import { databaseRpc, leadConfig } from "@/lib/leads/server";
import {
  InputError,
  readJson,
  requireSameOrigin,
} from "@/lib/leads/validation";
import {
  privateHeaders,
  requireOwner,
  parseLeadUpdate,
} from "@/lib/engagement/dashboard";
export const runtime = "nodejs";
function failure(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof InputError
          ? error.message
          : "The dashboard could not load. Please try again.",
    },
    {
      status: error instanceof InputError ? error.status : 503,
      headers: privateHeaders,
    },
  );
}
export async function GET(request: Request) {
  try {
    const session = await requireOwner(request);
    const days = Number(new URL(request.url).searchParams.get("days") || 30);
    if (![7, 30, 90].includes(days))
      throw new InputError("Choose 7, 30, or 90 days.");
    const report = await databaseRpc(leadConfig(), "dashboard_report", {
      p_session_hash: session,
      p_days: days,
    });
    return Response.json(report, { headers: privateHeaders });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: Request) {
  try {
    requireSameOrigin(request);
    const session = await requireOwner(request);
    const raw = await readJson(request);
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new InputError("Invalid update.");
    const update = parseLeadUpdate(raw as Record<string, unknown>);
    const saved = await databaseRpc<boolean>(
      leadConfig(),
      "dashboard_update_lead",
      { p_session_hash: session, p_id: update.id, p_changes: update.changes },
    );
    if (!saved)
      throw new InputError(
        "This lead changed since you opened it. Refresh the dashboard and try again.",
        409,
      );
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) {
    return failure(error);
  }
}
