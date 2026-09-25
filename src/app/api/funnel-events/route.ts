import {
  databaseRpc,
  hashValue,
  leadConfig,
  trustedClientIp,
} from "@/lib/leads/server";
import {
  InputError,
  parseFunnelEvent,
  readJson,
  requireSameOrigin,
} from "@/lib/leads/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    requireSameOrigin(request);
    const event = parseFunnelEvent(await readJson(request));
    const config = leadConfig();
    await databaseRpc(config, "record_funnel_event", {
      p_id: event.id,
      p_event_name: event.event,
      p_location: event.location,
      // Daily scoped abuse-control hash. No contact information or browser IDs.
      p_ip_hash: hashValue(
        `funnel:${new Date().toISOString().slice(0, 10)}:${trustedClientIp(request)}`,
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
    return new Response(null, { status: 503, headers });
  }
}
