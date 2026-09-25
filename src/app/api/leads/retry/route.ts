import { dispatchLeadEmails, isRetryAuthorized } from "@/lib/leads/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!isRetryAuthorized(request))
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    return Response.json(await dispatchLeadEmails(), { headers });
  } catch {
    console.error("lead_retry_failed");
    return Response.json(
      { error: "Retry service unavailable" },
      { status: 503, headers },
    );
  }
}

// Vercel Cron invokes GET with its configured CRON_SECRET bearer token.
export const GET = POST;
