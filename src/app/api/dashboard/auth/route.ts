import {
  InputError,
  readJson,
  requireSameOrigin,
} from "@/lib/leads/validation";
import {
  privateHeaders,
  requestOwnerCode,
  verifyOwnerCode,
  logoutOwner,
} from "@/lib/engagement/dashboard";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const raw = (await readJson(request)) as Record<string, unknown>;
    if (!raw || typeof raw !== "object")
      throw new InputError("Invalid request.");
    const cookie =
      raw.action === "request"
        ? await requestOwnerCode(request, raw.email)
        : raw.action === "verify"
          ? await verifyOwnerCode(request, raw.code)
          : raw.action === "logout"
            ? await logoutOwner(request)
            : null;
    if (cookie === null) throw new InputError("Invalid action.");
    return Response.json(
      { ok: true },
      {
        headers: {
          ...privateHeaders,
          ...(cookie ? { "Set-Cookie": cookie } : {}),
        },
      },
    );
  } catch (error) {
    const known = error instanceof InputError;
    return Response.json(
      {
        error: known
          ? error.message
          : "Sign-in is temporarily unavailable. Please try again later.",
      },
      { status: known ? error.status : 503, headers: privateHeaders },
    );
  }
}
