import { createHmac, timingSafeEqual } from "node:crypto";
import {
  BOOKING_URL,
  InputError,
  parseLead,
  readJson,
  requireSameOrigin,
  type LeadInput,
} from "./validation";

type EmailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  reply_to: string;
};
type EmailJob = {
  id: string;
  lead_id: string;
  kind: string;
  payload: EmailPayload;
  lease_token: string;
};
export type SavedLead = { id: string; created: boolean };
export type LeadConfig = {
  supabaseUrl: string;
  supabaseKey: string;
  resendKey: string;
  from: string;
  owner: string;
  hashSecret: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function leadConfig(): LeadConfig {
  const config = {
    supabaseUrl: required("SUPABASE_URL").replace(/\/$/, ""),
    supabaseKey: required("SUPABASE_SECRET_KEY"),
    resendKey: required("RESEND_API_KEY"),
    from: required("LEAD_EMAIL_FROM"),
    owner: required("LEAD_OWNER_EMAIL"),
    hashSecret: required("LEAD_HASH_SECRET"),
  };
  if (config.hashSecret.length < 32)
    throw new Error("LEAD_HASH_SECRET must contain at least 32 characters");
  const url = new URL(config.supabaseUrl);
  const local =
    process.env.NODE_ENV !== "production" &&
    ["127.0.0.1", "localhost"].includes(url.hostname);
  if (url.protocol !== "https:" && !local)
    throw new Error("SUPABASE_URL must use HTTPS");
  if (
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.owner) ||
    /[\r\n]/.test(config.from)
  )
    throw new Error("Invalid lead email configuration");
  return config;
}

export class StorageError extends Error {
  constructor(
    public code: string,
    public httpStatus: number,
  ) {
    super(code);
  }
}

export async function databaseRpc<T>(
  config: LeadConfig,
  name: string,
  body: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: config.supabaseKey,
  };
  // New secret keys belong in apikey; legacy service_role JWTs also use Authorization.
  if (!config.supabaseKey.startsWith("sb_secret_"))
    headers.Authorization = `Bearer ${config.supabaseKey}`;
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const known = ["rate_limited", "submission_conflict"].includes(
      error.message,
    )
      ? error.message
      : "storage_unavailable";
    throw new StorageError(known, response.status);
  }
  return response.json() as Promise<T>;
}

export function buildEmails(
  lead: LeadInput,
  config: LeadConfig,
): { kind: string; payload: EmailPayload }[] {
  // Freeze the payload at acceptance so provider idempotency retries are identical.
  return [
    {
      kind: "owner",
      payload: {
        from: config.from,
        to: [config.owner],
        reply_to: lead.email,
        subject: "New contractor website review request",
        text: [
          "A new website review request has been saved.",
          "",
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Website: ${lead.website}`,
          "",
          "Main problem:",
          lead.problem,
          "",
          "Next action: review the website and reply with three improvements within one business day.",
          "",
          `Attribution: ${JSON.stringify(lead.attribution)}`,
        ].join("\n"),
      },
    },
    {
      kind: "acknowledgment",
      payload: {
        from: config.from,
        to: [lead.email],
        reply_to: config.owner,
        subject: "Kredance received your website review request",
        // Do not reflect untrusted free text/URLs in auto-replies to arbitrary recipients.
        text: `Thanks for requesting a website review from Kredance.\n\nWe have your request and will reply within one business day with three practical improvements. No call is required.\n\nIf you would like to talk, you can optionally book a 30-minute consultation: ${BOOKING_URL}\n\nThis message confirms your request; you have not been subscribed to marketing emails. If you did not make this request, you can ignore this message.\n\nKredance\nOttawa, ON\n${config.owner}`,
      },
    },
  ];
}

export function hashValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function trustedClientIp(request: Request) {
  return process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    : "local-or-unconfigured-proxy";
}

export type IntakeDependencies = {
  config: () => LeadConfig;
  save: (
    config: LeadConfig,
    body: Record<string, unknown>,
  ) => Promise<SavedLead>;
  accepted: (lead: SavedLead) => void;
};

export async function handleLeadRequest(
  request: Request,
  dependencies: IntakeDependencies,
): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  try {
    requireSameOrigin(request);
    const lead = parseLead(await readJson(request));
    const config = dependencies.config();
    // On Vercel this header is overwritten by the trusted proxy, unlike user-supplied X-Forwarded-For.
    const ip = trustedClientIp(request);
    const payloadHash = hashValue(
      JSON.stringify([
        lead.name,
        lead.email,
        lead.website,
        lead.problem,
        lead.attribution,
      ]),
      config.hashSecret,
    );
    const saved = await dependencies.save(config, {
      p_submission_id: lead.submissionId,
      p_payload_hash: payloadHash,
      p_ip_hash: hashValue(ip || "unknown", config.hashSecret),
      p_lead: lead,
      p_emails: buildEmails(lead, config),
    });
    try {
      dependencies.accepted(saved);
    } catch {
      console.error("lead_dispatch_schedule_failed", { leadId: saved.id });
    }
    return Response.json(
      { accepted: true },
      { status: saved.created ? 201 : 200, headers },
    );
  } catch (error) {
    if (error instanceof InputError)
      return Response.json(
        { error: error.message },
        { status: error.status, headers },
      );
    if (error instanceof StorageError && error.code === "rate_limited") {
      return Response.json(
        {
          error:
            "Too many requests. Please try again in an hour or email us directly.",
        },
        { status: 429, headers: { ...headers, "Retry-After": "3600" } },
      );
    }
    if (error instanceof StorageError && error.code === "submission_conflict") {
      return Response.json(
        {
          error:
            "This request was already received with different details. Submit again to send an updated request.",
        },
        { status: 409, headers },
      );
    }
    console.error("lead_intake_unavailable"); // No request bodies, credentials, or provider responses in logs.
    return Response.json(
      {
        error:
          "We couldn't save your request right now. Please try again or email us directly.",
      },
      { status: 503, headers },
    );
  }
}

export async function sendEmail(
  config: LeadConfig,
  job: EmailJob,
): Promise<string> {
  let endpoint = "https://api.resend.com/emails";
  if (process.env.NODE_ENV === "development" && process.env.LEAD_DEV_MAIL_URL) {
    const local = new URL(process.env.LEAD_DEV_MAIL_URL);
    if (
      local.protocol !== "http:" ||
      !["127.0.0.1", "localhost"].includes(local.hostname)
    )
      throw new Error("Invalid local mail capture URL");
    endpoint = local.toString();
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `lead-${job.lead_id}-${job.kind}`,
    },
    body: JSON.stringify(job.payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`email_http_${response.status}`);
  const result = await response.json();
  if (typeof result.id !== "string") throw new Error("email_missing_id");
  return result.id;
}

export async function dispatchLeadEmails(
  leadId: string | null = null,
  config = leadConfig(),
  rpc = databaseRpc,
  send = sendEmail,
) {
  const jobs = await rpc<EmailJob[]>(config, "claim_lead_emails", {
    p_lead_id: leadId,
    p_limit: 2,
  });
  let sent = 0;
  for (const job of jobs) {
    let providerId: string | null = null;
    let failure: string | null = null;
    try {
      providerId = await send(config, job);
    } catch (error) {
      failure =
        error instanceof Error &&
        /^email_(http_\d{3}|missing_id)$/.test(error.message)
          ? error.message
          : "email_network_error";
    }
    // If completion storage fails, the lease expires and the same idempotency key is retried.
    const finished = await rpc<boolean>(config, "finish_lead_email", {
      p_id: job.id,
      p_lease_token: job.lease_token,
      p_provider_id: providerId,
      p_error: failure,
    });
    if (finished && !failure) sent++;
    if (failure)
      console.error("lead_email_queued_for_retry", {
        jobId: job.id,
        reason: failure,
      });
  }
  return { claimed: jobs.length, sent };
}

export function isRetryAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const actual = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32) return false;
  const expected = `Bearer ${secret}`;
  return (
    Buffer.byteLength(actual) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  );
}
