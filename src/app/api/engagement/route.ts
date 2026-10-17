import {
  databaseRpc,
  hashValue,
  leadConfig,
  leadFailureDetails,
  trustedClientIp,
} from "@/lib/leads/server";
import {
  InputError,
  readJson,
  requireSameOrigin,
} from "@/lib/leads/validation";
import { parseSiteEvent } from "@/lib/engagement/validation";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    requireSameOrigin(request);
    const event = parseSiteEvent(await readJson(request));
    const config = leadConfig();
    await databaseRpc(config, "record_site_event", {
      p_event: {
        ...event,
        sessionId: undefined,
        sessionHash: hashValue(`visit:${event.sessionId}`, config.hashSecret),
      },
      p_ip_hash: hashValue(
        `analytics:${new Date().toISOString().slice(0, 10)}:${trustedClientIp(request)}`,
        config.hashSecret,
      ),
    });
    return new Response(null, { status: 204, headers });
  } catch (error) {
    if (error instanceof InputError)
      return Response.json(
        { error: error.message },
        { status: error.status, headers },
      );
    console.error("engagement_unavailable", leadFailureDetails(error));
    return new Response(null, { status: 503, headers });
  }
}
