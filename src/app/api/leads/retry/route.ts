import { dispatchLeadEmails, isRetryAuthorized } from "@/lib/leads/server";

export const runtime = "nodejs";
export const maxDuration = 60;
const worker = "kredance-lead-email-retries";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!isRetryAuthorized(request))
    return Response.json({ worker, error: "Unauthorized" }, { status: 401, headers });
  try {
    return Response.json({ worker, ...await dispatchLeadEmails() }, { headers });
  } catch {
    console.error("lead_retry_failed");
    return Response.json(
      { worker, error: "Retry service unavailable" },
      { status: 503, headers },
    );
  }
}

// Supabase Cron uses POST; GET also supports an authenticated operator check.
export const GET = POST;
