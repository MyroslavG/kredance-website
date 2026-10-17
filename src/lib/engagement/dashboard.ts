import { randomBytes, randomInt, randomUUID } from "node:crypto";
import {
  databaseRpc,
  hashValue,
  leadConfig,
  sendEmail,
  trustedClientIp,
} from "@/lib/leads/server";
import { InputError } from "@/lib/leads/validation";
import { leadStatuses, UUID } from "./shared";

export const privateHeaders = {
  "Cache-Control": "no-store, private",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};
const sessionName = () =>
  process.env.NODE_ENV === "production"
    ? "__Host-kredance-owner"
    : "kredance-owner";
function cookie(request: Request, name: string) {
  return (
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || ""
  );
}
function setCookie(name: string, value: string, maxAge: number, path = "/") {
  return `${name}=${value}; Path=${path}; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export function sessionHash(request: Request) {
  const token = cookie(request, sessionName());
  if (!/^[a-zA-Z0-9_-]{43}$/.test(token))
    throw new InputError("Please sign in.", 401);
  return hashValue(`owner-session:${token}`, leadConfig().hashSecret);
}
export async function requireOwner(request: Request) {
  const hash = sessionHash(request);
  if (
    !(await databaseRpc<boolean>(leadConfig(), "dashboard_session_valid", {
      p_session_hash: hash,
    }))
  )
    throw new InputError("Your session expired. Please sign in.", 401);
  return hash;
}
export async function requestOwnerCode(request: Request, email: unknown) {
  const owner = (process.env.DASHBOARD_OWNER_EMAIL || "myroslav@kredance.com")
    .trim()
    .toLowerCase();
  if (!owner)
    throw new InputError("Dashboard sign-in is not configured yet.", 503);
  if (typeof email !== "string" || email.trim().toLowerCase() !== owner)
    return "";
  const config = leadConfig();
  const id = randomUUID();
  const code = randomInt(0, 100_000_000).toString().padStart(8, "0");
  const allowed = await databaseRpc<boolean>(config, "dashboard_issue_code", {
    p_id: id,
    p_code_hash: hashValue(`owner-code:${id}:${code}`, config.hashSecret),
    p_ip_hash: hashValue(
      `owner-login:${trustedClientIp(request)}`,
      config.hashSecret,
    ),
  });
  if (!allowed)
    throw new InputError(
      "Please wait before requesting another code. Sign-in emails are limited to five per hour.",
      429,
    );
  await sendEmail(config, {
    id,
    lead_id: id,
    kind: "owner-login",
    lease_token: "",
    payload: {
      template_id: config.emailjsOwnerTemplateId,
      template_params: {
        name: "Kredance",
        from_name: "Kredance Dashboard",
        from_email: owner,
        reply_to: owner,
        time: new Date().toISOString(),
        subject: "Your Kredance dashboard sign-in code",
        message: `Your sign-in code is: ${code}\n\nEnter it in the browser where you requested it. It expires in 10 minutes and can be used once.\n\nIf you did not request this, ignore this email.`,
      },
    },
  });
  return setCookie("kredance-owner-challenge", id, 600, "/api/dashboard/auth");
}
export async function verifyOwnerCode(request: Request, code: unknown) {
  const id = cookie(request, "kredance-owner-challenge");
  if (!UUID.test(id) || typeof code !== "string" || !/^\d{8}$/.test(code))
    throw new InputError("Enter the eight-digit code from your email.", 401);
  const config = leadConfig();
  const token = randomBytes(32).toString("base64url");
  const verified = await databaseRpc<boolean>(config, "dashboard_verify_code", {
    p_id: id,
    p_code_hash: hashValue(`owner-code:${id}:${code}`, config.hashSecret),
    p_session_hash: hashValue(`owner-session:${token}`, config.hashSecret),
  });
  if (!verified)
    throw new InputError(
      "That code is invalid, expired, or already used. Request a new code if needed.",
      401,
    );
  return setCookie(sessionName(), token, 8 * 3600);
}
export async function logoutOwner(request: Request) {
  try {
    await databaseRpc(leadConfig(), "dashboard_logout", {
      p_session_hash: sessionHash(request),
    });
  } catch (error) {
    if (!(error instanceof InputError)) throw error;
  }
  return setCookie(sessionName(), "", 0);
}
export function parseLeadUpdate(raw: Record<string, unknown>) {
  if (
    typeof raw.id !== "string" ||
    !UUID.test(raw.id) ||
    !(leadStatuses as readonly unknown[]).includes(raw.status) ||
    typeof raw.qualified !== "boolean"
  )
    throw new InputError("Invalid lead update.");
  for (const [key, limit] of [
    ["notes", 4000],
    ["next_action", 500],
  ] as const) {
    if (typeof raw[key] !== "string" || raw[key].length > limit)
      throw new InputError(`Invalid ${key.replace("_", " ")}.`);
  }
  for (const key of ["next_action_at", "updated_at"])
    if (typeof raw[key] !== "string" || !Number.isFinite(Date.parse(raw[key])))
      throw new InputError("Enter a valid follow-up date.");
  const amount =
    raw.deal_value === "" || raw.deal_value === null
      ? null
      : Number(raw.deal_value);
  if (
    amount !== null &&
    (!Number.isFinite(amount) || amount < 0 || amount > 9999999999.99)
  )
    throw new InputError("Enter a valid deal value.");
  return {
    id: raw.id,
    changes: {
      status: raw.status,
      qualified: raw.qualified,
      notes: raw.notes,
      next_action: raw.next_action,
      next_action_at: raw.next_action_at,
      updated_at: raw.updated_at,
      deal_value: amount,
    },
  };
}
