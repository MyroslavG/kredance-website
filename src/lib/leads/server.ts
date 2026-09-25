import { createHmac, timingSafeEqual } from "node:crypto";
import {
  InputError,
  parseLead,
  readJson,
  requireSameOrigin,
  type LeadInput,
} from "./validation";

export type EmailPayload = {
  template_id: string;
  template_params: Record<string, string>;
};
export type EmailJob = {
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
  emailjsServiceId: string;
  emailjsPublicKey: string;
  emailjsPrivateKey: string;
  emailjsOwnerTemplateId: string;
  hashSecret: string;
};
type ConfigField =
  | "SUPABASE_URL"
  | "SUPABASE_SECRET_KEY"
  | "NEXT_PUBLIC_EMAILJS_SERVICE_ID"
  | "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"
  | "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"
  | "EMAILJS_PRIVATE_KEY"
  | "LEAD_HASH_SECRET";

export class ConfigurationError extends Error {
  constructor(public field: ConfigField) {
    super(`Missing or invalid ${field}`);
  }
}

function required(name: ConfigField, rawValue: string | undefined): string {
  const value = rawValue?.trim();
  if (!value) throw new ConfigurationError(name);
  return value;
}

export function leadConfig(): LeadConfig {
  const config = {
    supabaseUrl: required("SUPABASE_URL", process.env.SUPABASE_URL).replace(
      /\/$/,
      "",
    ),
    supabaseKey: required(
      "SUPABASE_SECRET_KEY",
      process.env.SUPABASE_SECRET_KEY,
    ),
    // Direct references let Next.js inline the existing public settings at build time.
    emailjsServiceId: required(
      "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    ),
    emailjsPublicKey: required(
      "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    ),
    emailjsPrivateKey: required(
      "EMAILJS_PRIVATE_KEY",
      process.env.EMAILJS_PRIVATE_KEY,
    ),
    emailjsOwnerTemplateId:
      process.env.EMAILJS_LEAD_OWNER_TEMPLATE_ID?.trim() ||
      required(
        "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      ),
    hashSecret: required("LEAD_HASH_SECRET", process.env.LEAD_HASH_SECRET),
  };
  if (config.hashSecret.length < 32)
    throw new ConfigurationError("LEAD_HASH_SECRET");
  let url: URL;
  try {
    url = new URL(config.supabaseUrl);
  } catch {
    throw new ConfigurationError("SUPABASE_URL");
  }
  const local =
    process.env.NODE_ENV !== "production" &&
    ["127.0.0.1", "localhost"].includes(url.hostname);
  if (url.protocol !== "https:" && !local)
    throw new ConfigurationError("SUPABASE_URL");
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

export function leadFailureDetails(error: unknown) {
  if (error instanceof ConfigurationError)
    return { code: "configuration_invalid", field: error.field };
  if (error instanceof StorageError)
    return { code: "storage_unavailable", httpStatus: error.httpStatus };
  return { code: "unexpected_error" };
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
  // Freeze the template and its inputs at acceptance; never store credentials.
  const emails: { kind: string; payload: EmailPayload }[] = [
    {
      kind: "owner",
      payload: {
        template_id: config.emailjsOwnerTemplateId,
        template_params: {
          name: lead.name,
          time: new Date().toISOString(),
          from_name: lead.name,
          from_email: lead.email,
          reply_to: lead.email,
          subject: "New contractor website review request",
          message: [
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
    },
  ];
  return emails;
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
    // Only fixed error codes, configuration names, and HTTP status; never raw error messages.
    console.error("lead_intake_unavailable", leadFailureDetails(error));
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
  request: typeof fetch = fetch,
): Promise<string | null> {
  if (!job.payload.template_id || !job.payload.template_params) {
    throw new Error("email_invalid_payload");
  }
  let endpoint = "https://api.emailjs.com/api/v1.0/email/send";
  if (process.env.NODE_ENV === "development" && process.env.LEAD_DEV_MAIL_URL) {
    const local = new URL(process.env.LEAD_DEV_MAIL_URL);
    if (
      local.protocol !== "http:" ||
      !["127.0.0.1", "localhost"].includes(local.hostname)
    )
      throw new Error("Invalid local mail capture URL");
    endpoint = local.toString();
  }
  const response = await request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: config.emailjsServiceId,
      user_id: config.emailjsPublicKey,
      ...(config.emailjsPrivateKey
        ? { accessToken: config.emailjsPrivateKey }
        : {}),
      template_id: job.payload.template_id,
      template_params: {
        ...job.payload.template_params,
        lead_reference: job.lead_id,
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`email_http_${response.status}`);
  // EmailJS returns HTTP 200 + plain "OK", not a provider message ID.
  // Treat any unexpected response as uncertain; a second send could duplicate mail.
  if (response.status !== 200 || (await response.text()).trim() !== "OK") {
    throw new Error("email_delivery_uncertain");
  }
  return null;
}

export async function dispatchLeadEmails(
  leadId: string | null = null,
  config = leadConfig(),
  rpc = databaseRpc,
  send = sendEmail,
) {
  let claimed = 0;
  let sent = 0;
  // Claim one at a time. The database serializes workers and enforces cooldown.
  const limit = leadId ? 1 : 2;
  for (let index = 0; index < limit; index++) {
    const jobs = await rpc<EmailJob[]>(config, "claim_lead_emails", {
      p_lead_id: leadId,
      p_limit: 1,
    });
    const job = jobs[0];
    if (!job) break;
    claimed++;
    let providerId: string | null = null;
    let failure: string | null = null;
    try {
      providerId = await send(config, job);
    } catch (error) {
      failure =
        error instanceof Error &&
        /^email_(http_\d{3}|invalid_payload|delivery_uncertain)$/.test(
          error.message,
        )
          ? error.message
          : "email_delivery_uncertain";
    }
    // A timeout, unknown response, or lost completion write must not resend blindly.
    // Only a confirmed 429 rejection is automatically retried by the database.
    const finished = await rpc<boolean>(config, "finish_lead_email", {
      p_id: job.id,
      p_lease_token: job.lease_token,
      p_provider_id: providerId,
      p_error: failure,
    });
    if (finished && !failure) sent++;
    if (failure)
      console.error("lead_email_needs_attention", {
        jobId: job.id,
        reason: failure,
      });
    if (index + 1 < limit)
      await new Promise((resolve) => setTimeout(resolve, 1150));
  }
  return { claimed, sent };
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
