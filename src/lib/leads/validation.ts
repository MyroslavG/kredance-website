export const CONTRACTOR_PATH = "/websites-for-contractors";
export const BOOKING_URL = "https://calendly.com/kredance/30min";
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const eventLocations = {
  contractor_page_viewed: ["contractor"],
  review_cta_clicked: ["hero", "offer"],
  review_form_started: ["review"],
  booking_confirmed: ["contact", "review"],
} as const;

export function parseFunnelEvent(value: unknown) {
  const raw = record(value);
  if (
    typeof raw.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      raw.id,
    ) ||
    typeof raw.event !== "string" ||
    !Object.hasOwn(eventLocations, raw.event)
  )
    throw new InputError("Invalid event.");
  const event = raw.event as keyof typeof eventLocations;
  if (!(eventLocations[event] as readonly unknown[]).includes(raw.location))
    throw new InputError("Invalid event location.");
  return { id: raw.id, event, location: raw.location as string };
}

export type Attribution = {
  landingPath: string;
  referrerHost: string;
  utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
};

export type LeadInput = {
  submissionId: string;
  name: string;
  email: string;
  website: string;
  problem: string;
  attribution: Attribution;
};

export class InputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function field(
  value: unknown,
  label: string,
  min: number,
  max: number,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  ) {
    throw new InputError(`${label} must contain ${min}–${max} characters.`);
  }
  return value.trim();
}

export function cleanAttribution(value: unknown): Attribution {
  const raw = record(value);
  const utm: Attribution["utm"] = {};
  for (const key of UTM_KEYS) {
    const candidate = record(raw.utm)[key];
    // Campaign labels only. Never persist arbitrary query strings or identifiers.
    if (
      typeof candidate === "string" &&
      /^[a-zA-Z0-9 _.-]{1,100}$/.test(candidate)
    )
      utm[key] = candidate;
  }
  const landingPath =
    typeof raw.landingPath === "string" &&
    /^\/[a-z0-9/-]{0,150}$/i.test(raw.landingPath)
      ? raw.landingPath
      : CONTRACTOR_PATH;
  const referrerHost =
    typeof raw.referrerHost === "string" &&
    /^[a-z0-9.-]{1,200}$/i.test(raw.referrerHost)
      ? raw.referrerHost
      : "";
  return { landingPath, referrerHost, utm };
}

export function parseLead(value: unknown): LeadInput {
  const raw = record(value);
  if (raw.companyFax)
    throw new InputError(
      "Please email myroslav@kredance.com to request your review.",
    );
  const submissionId = field(raw.submissionId, "Submission ID", 36, 36);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      submissionId,
    )
  ) {
    throw new InputError("Please refresh the page and try again.");
  }
  const name = field(raw.name, "Name", 2, 100);
  const email = field(raw.email, "Email", 3, 254).toLowerCase();
  if (
    /[\r\n\x00-\x1f]/.test(name) ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)
  ) {
    throw new InputError("Please enter a valid name and email address.");
  }
  let website = field(raw.website, "Website", 4, 500);
  try {
    if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
    const url = new URL(website);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !url.hostname.includes(".") ||
      url.username ||
      url.password
    )
      throw new Error();
    url.search = "";
    url.hash = "";
    website = url.toString();
  } catch {
    throw new InputError(
      "Enter a valid business website, such as example.com.",
    );
  }
  const problem = field(raw.problem, "Main problem", 10, 2000);
  return {
    submissionId,
    name,
    email,
    website,
    problem,
    attribution: cleanAttribution(raw.attribution),
  };
}

export async function readJson(request: Request): Promise<unknown> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    throw new InputError("Content-Type must be application/json.", 415);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("A request body is required.");
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) {
        await reader.cancel();
        throw new InputError("Request is too large.", 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError("Invalid JSON request.");
  } finally {
    reader.releaseLock();
  }
}

export function requireSameOrigin(request: Request) {
  const url = new URL(request.url);
  // Next may normalize the URL hostname locally. Host preserves the public
  // authority used by the browser, including the development port.
  const expectedOrigin = `${url.protocol}//${request.headers.get("host") || url.host}`;
  if (request.headers.get("origin") !== expectedOrigin) {
    throw new InputError("Submit the form from the Kredance website.", 403);
  }
}
