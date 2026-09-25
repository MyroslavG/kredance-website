import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  parseLead,
  cleanAttribution,
  readJson,
  parseFunnelEvent,
  requireSameOrigin,
} from "../src/lib/leads/validation";
import {
  buildEmails,
  sendEmail,
  leadConfig,
  ConfigurationError,
  StorageError,
  leadFailureDetails,
  type EmailJob,
  dispatchLeadEmails,
  handleLeadRequest,
  isRetryAuthorized,
  type SavedLead,
} from "../src/lib/leads/server";
import {
  isBookingMessage,
  redactAnalyticsUrl,
} from "../src/lib/leads/analytics";
import { createLeadDatabase, testConfig } from "./helpers/lead-database";

function input(overrides = {}) {
  return {
    submissionId: randomUUID(),
    name: "Alex Smith",
    email: "alex@example.com",
    website: "example.com?email=private@example.com",
    problem: "Make estimate requests easier on mobile.",
    attribution: {
      landingPath: "/websites-for-contractors",
      referrerHost: "google.com",
      utm: { utm_source: "outreach", utm_campaign: "ottawa-contractors" },
    },
    ...overrides,
  };
}
function request(body: unknown, origin = "https://www.kredance.com") {
  return new Request("https://www.kredance.com/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}

describe("validation and privacy", () => {
  it("diagnoses configuration and storage failures without logging provider or request secrets", () => {
    assert.deepEqual(
      leadFailureDetails(new ConfigurationError("SUPABASE_SECRET_KEY")),
      {
        code: "configuration_invalid",
        field: "SUPABASE_SECRET_KEY",
      },
    );
    assert.deepEqual(
      leadFailureDetails(new StorageError("private provider response", 401)),
      {
        code: "storage_unavailable",
        httpStatus: 401,
      },
    );
    assert.deepEqual(
      leadFailureDetails(new Error("secret key and private form contents")),
      {
        code: "unexpected_error",
      },
    );
  });
  it("uses the browser-facing host while rejecting cross-origin requests", () => {
    const localRequest = (origin: string) =>
      new Request("http://localhost:3000/api/leads", {
        headers: { host: "127.0.0.1:3000", origin },
      });
    assert.doesNotThrow(() =>
      requireSameOrigin(localRequest("http://127.0.0.1:3000")),
    );
    assert.throws(() =>
      requireSameOrigin(localRequest("https://evil.example")),
    );
    assert.throws(() =>
      requireSameOrigin(localRequest("http://127.0.0.1:3001")),
    );
  });
  it("normalizes input and removes website query strings", () => {
    const lead = parseLead(input({ email: " Alex@Example.com " }));
    assert.equal(lead.email, "alex@example.com");
    assert.equal(lead.website, "https://example.com/");
    assert.equal(lead.attribution.utm.utm_campaign, "ottawa-contractors");
  });
  it("rejects bots, invalid email, invalid URL schemes, and oversized content", () => {
    for (const changes of [
      { companyFax: "bot" },
      { email: "bad\r\n@example.com" },
      { website: "javascript:alert(1)" },
      { website: "https://user:password@example.com" },
      { problem: "x".repeat(2001) },
      { submissionId: "bad" },
    ])
      assert.throws(() => parseLead(input(changes)));
  });
  it("discards arbitrary attribution properties and personal query values", () => {
    assert.deepEqual(
      cleanAttribution({
        landingPath: "/?email=alex@example.com",
        referrerHost: "https://example.com/private",
        email: "private",
        utm: {
          utm_source: "alex@example.com",
          utm_medium: "email",
          user_id: "123",
        },
      }),
      {
        landingPath: "/websites-for-contractors",
        referrerHost: "",
        utm: { utm_medium: "email" },
      },
    );
    assert.equal(
      redactAnalyticsUrl(
        "https://www.kredance.com/contact?email=private@example.com#secret",
      ),
      "https://www.kredance.com/contact",
    );
  });
  it("reuses the existing contact template and keeps credentials out of the queue", () => {
    const emails = buildEmails(parseLead(input()), testConfig);
    assert.equal(emails.length, 1);
    assert.equal(emails[0].kind, "owner");
    assert.equal(
      emails[0].payload.template_id,
      testConfig.emailjsOwnerTemplateId,
    );
    assert.equal(
      emails[0].payload.template_params.from_email,
      "alex@example.com",
    );
    assert.equal(emails[0].payload.template_params.from_name, "Alex Smith");
    assert.match(
      emails[0].payload.template_params.message,
      /Make estimate requests easier/,
    );
    assert.ok(!JSON.stringify(emails).includes(testConfig.emailjsPrivateKey));
  });
  it("rejects an oversized body even without Content-Length", async () => {
    await assert.rejects(
      readJson(request({ x: "x".repeat(17_000) })),
      /too large/,
    );
  });
  it("counts only completion messages from the actual Calendly frame", () => {
    const frame = {} as Window;
    const event = {
      origin: "https://calendly.com",
      source: frame,
      data: {
        event: "calendly.event_scheduled",
        payload: {
          invitee: {
            uri: "https://api.calendly.com/scheduled_events/test/invitees/test",
          },
        },
      },
    };
    assert.equal(isBookingMessage(event, frame), true);
    assert.equal(
      isBookingMessage({ ...event, origin: "https://evil.example" }, frame),
      false,
    );
    assert.equal(
      isBookingMessage({ ...event, source: {} as Window }, frame),
      false,
    );
    assert.equal(
      isBookingMessage(
        { ...event, data: { event: "calendly.date_and_time_selected" } },
        frame,
      ),
      false,
    );
  });
  it("requires the full retry endpoint secret", () => {
    const previous = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "x".repeat(32);
    try {
      assert.equal(
        isRetryAuthorized(
          new Request("https://example.com", {
            headers: { authorization: `Bearer ${"x".repeat(32)}` },
          }),
        ),
        true,
      );
      assert.equal(
        isRetryAuthorized(new Request("https://example.com")),
        false,
      );
    } finally {
      if (previous === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = previous;
    }
  });
  it("limits browser analytics to named events and drops arbitrary properties", () => {
    const id = randomUUID();
    assert.deepEqual(
      parseFunnelEvent({
        id,
        event: "review_cta_clicked",
        location: "hero",
        email: "private@example.com",
      }),
      { id, event: "review_cta_clicked", location: "hero" },
    );
    assert.throws(() =>
      parseFunnelEvent({
        id,
        event: "review_inquiry_saved",
        location: "contractor",
      }),
    );
    assert.throws(() =>
      parseFunnelEvent({ id, event: "booking_confirmed", location: "hero" }),
    );
  });
});

describe("real PostgreSQL lead workflow", () => {
  let fixture: Awaited<ReturnType<typeof createLeadDatabase>>;
  let accepted: SavedLead[];
  const dependencies = {
    config: () => testConfig,
    save: (_config: typeof testConfig, body: Record<string, unknown>) =>
      fixture.rpc<SavedLead>(testConfig, "accept_website_lead", body),
    accepted: (saved: SavedLead) => {
      accepted.push(saved);
    },
  };
  before(async () => {
    fixture = await createLeadDatabase();
  });
  beforeEach(async () => {
    accepted = [];
    await fixture.db.exec(
      "reset role; truncate public.website_leads cascade; truncate public.lead_funnel_events;",
    );
  });
  after(async () => {
    await fixture?.db.close();
  });

  it("saves the inquiry, attribution, follow-up task and one durable owner notification", async () => {
    const response = await handleLeadRequest(request(input()), dependencies);
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { accepted: true });
    const { rows } = await fixture.db.query<{
      status: string;
      next_action: string;
      attribution: { utm: { utm_source: string } };
    }>("select * from public.website_leads");
    assert.equal(rows.length, 1);
    assert.equal(rows[0].status, "new");
    assert.match(rows[0].next_action, /three improvements/);
    assert.equal(rows[0].attribution.utm.utm_source, "outreach");
    assert.equal(
      (await fixture.db.query("select * from public.lead_email_jobs")).rows
        .length,
      1,
    );
    assert.equal(accepted[0].created, true);
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_funnel_events where event_name = 'review_inquiry_saved'",
        )
      ).rows.length,
      1,
    );
  });
  it("handles repeat submissions without duplicate leads, emails, or a second conversion", async () => {
    const body = input();
    assert.equal(
      (await handleLeadRequest(request(body), dependencies)).status,
      201,
    );
    assert.equal(
      (await handleLeadRequest(request(body), dependencies)).status,
      200,
    );
    assert.equal(accepted.filter((value) => value.created).length, 1);
    assert.equal(
      (await fixture.db.query("select * from public.lead_funnel_events")).rows
        .length,
      1,
    );
    assert.equal(
      (await fixture.db.query("select * from public.website_leads")).rows
        .length,
      1,
    );
    assert.equal(
      (await fixture.db.query("select * from public.lead_email_jobs")).rows
        .length,
      1,
    );
    assert.equal(
      (
        await handleLeadRequest(
          request({ ...body, name: "Different Name" }),
          dependencies,
        )
      ).status,
      409,
    );
  });
  it("rejects cross-origin requests and validation failures before storing anything", async () => {
    assert.equal(
      (
        await handleLeadRequest(
          request(input(), "https://evil.example"),
          dependencies,
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await handleLeadRequest(
          request(input({ companyFax: "spam" })),
          dependencies,
        )
      ).status,
      400,
    );
    assert.equal(
      (await fixture.db.query("select * from public.website_leads")).rows
        .length,
      0,
    );
  });
  it("fails honestly when persistence/configuration is unavailable", async () => {
    const response = await handleLeadRequest(request(input()), {
      ...dependencies,
      save: async () => {
        throw new Error("unavailable");
      },
    });
    assert.equal(response.status, 503);
    assert.equal(accepted.length, 0);
    assert.equal(
      (await fixture.db.query("select * from public.lead_email_jobs")).rows
        .length,
      0,
    );
  });
  it("keeps a saved inquiry successful when background scheduling fails", async () => {
    const response = await handleLeadRequest(request(input()), {
      ...dependencies,
      accepted: () => {
        throw new Error("scheduler down");
      },
    });
    assert.equal(response.status, 201);
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_email_jobs where status = 'pending'",
        )
      ).rows.length,
      1,
    );
  });
  it("enforces database-backed IP and email limits", async () => {
    for (let i = 0; i < 3; i++)
      assert.equal(
        (await handleLeadRequest(request(input()), dependencies)).status,
        201,
      );
    assert.equal(
      (await handleLeadRequest(request(input()), dependencies)).status,
      429,
    );
    for (let i = 0; i < 2; i++)
      assert.equal(
        (
          await handleLeadRequest(
            request(input({ email: `other${i}@example.com` })),
            dependencies,
          )
        ).status,
        201,
      );
    assert.equal(
      (
        await handleLeadRequest(
          request(input({ email: "another@example.com" })),
          dependencies,
        )
      ).status,
      429,
    );
  });
  it("rolls back the lead when the notification cannot be queued", async () => {
    const lead = parseLead(input());
    await assert.rejects(
      fixture.rpc(testConfig, "accept_website_lead", {
        p_submission_id: lead.submissionId,
        p_payload_hash: "hash",
        p_ip_hash: "ip",
        p_lead: lead,
        p_emails: [{ kind: "owner" }],
      }),
    );
    assert.equal(
      (await fixture.db.query("select * from public.website_leads")).rows
        .length,
      0,
    );
  });
  it("retries confirmed rate-limit rejections without resending successful jobs", async () => {
    await handleLeadRequest(request(input()), dependencies);
    await handleLeadRequest(
      request(input({ email: "retry@example.com" })),
      dependencies,
    );
    const delivered: string[] = [];
    const first = await dispatchLeadEmails(
      null,
      testConfig,
      fixture.rpc,
      async (_config, job) => {
        const recipient = job.payload.template_params.from_email;
        if (recipient === "retry@example.com")
          throw new Error("email_http_429");
        delivered.push(recipient);
        return null;
      },
    );
    assert.equal(first.sent, 1);
    const pending = await fixture.db.query<{
      status: string;
      last_error: string;
    }>(
      "select status, last_error from public.lead_email_jobs where status = 'pending'",
    );
    assert.equal(pending.rows.length, 1);
    assert.equal(pending.rows[0].last_error, "email_http_429");
    assert.equal(
      (
        await dispatchLeadEmails(
          null,
          testConfig,
          fixture.rpc,
          async () => null,
        )
      ).claimed,
      0,
    );
    await fixture.db.exec(
      "update public.lead_email_jobs set available_at = now() - interval '1 second', last_activity_at = now() - interval '2 seconds'",
    );
    await dispatchLeadEmails(
      null,
      testConfig,
      fixture.rpc,
      async (_config, job) => {
        delivered.push(job.payload.template_params.from_email);
        return null;
      },
    );
    assert.deepEqual(delivered.sort(), [
      "alex@example.com",
      "retry@example.com",
    ]);
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_email_jobs where status = 'sent'",
        )
      ).rows.length,
      2,
    );
  });
  it("holds uncertain delivery and permanent errors for review instead of sending again", async () => {
    for (const message of [
      "network timeout",
      "email_http_500",
      "email_http_403",
    ]) {
      await handleLeadRequest(
        request(input({ email: `case${accepted.length}@example.com` })),
        dependencies,
      );
      const id = accepted.at(-1)!.id;
      await fixture.db.exec(
        "update public.lead_email_jobs set last_activity_at = now() - interval '2 seconds'",
      );
      await dispatchLeadEmails(id, testConfig, fixture.rpc, async () => {
        throw new Error(message);
      });
      const jobs = await fixture.db.query<{ status: string }>(
        "select status from public.lead_email_jobs where lead_id = $1",
        [id],
      );
      assert.equal(jobs.rows[0].status, "review");
      assert.equal(
        (
          await dispatchLeadEmails(id, testConfig, fixture.rpc, async () => {
            throw new Error("Must not resend");
          })
        ).claimed,
        0,
      );
    }
  });
  it("serializes workers, enforces cooldown, and leaves expired leases for review", async () => {
    await handleLeadRequest(request(input()), dependencies);
    await handleLeadRequest(
      request(input({ email: "second@example.com" })),
      dependencies,
    );
    const jobs = await fixture.rpc<EmailJob[]>(
      testConfig,
      "claim_lead_emails",
      { p_lead_id: null, p_limit: 2 },
    );
    assert.equal(jobs.length, 1);
    assert.equal(
      (
        await fixture.rpc<EmailJob[]>(testConfig, "claim_lead_emails", {
          p_lead_id: null,
          p_limit: 2,
        })
      ).length,
      0,
    );
    assert.equal(
      await fixture.rpc(testConfig, "finish_lead_email", {
        p_id: jobs[0].id,
        p_lease_token: randomUUID(),
        p_provider_id: null,
        p_error: null,
      }),
      false,
    );
    await fixture.db.exec(
      "update public.lead_email_jobs set lease_until = now() - interval '1 second', last_activity_at = now() - interval '2 seconds' where status = 'processing'",
    );
    const next = await fixture.rpc<EmailJob[]>(
      testConfig,
      "claim_lead_emails",
      { p_lead_id: null, p_limit: 2 },
    );
    assert.equal(next.length, 1);
    assert.notEqual(next[0].id, jobs[0].id);
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_email_jobs where status = 'review'",
        )
      ).rows.length,
      1,
    );
    assert.equal(
      await fixture.rpc(testConfig, "finish_lead_email", {
        p_id: jobs[0].id,
        p_lease_token: jobs[0].lease_token,
        p_provider_id: null,
        p_error: null,
      }),
      false,
    );
    await fixture.rpc(testConfig, "finish_lead_email", {
      p_id: next[0].id,
      p_lease_token: next[0].lease_token,
      p_provider_id: null,
      p_error: null,
    });
    await handleLeadRequest(
      request(input({ email: "third@example.com" })),
      dependencies,
    );
    assert.equal(
      (
        await fixture.rpc<EmailJob[]>(testConfig, "claim_lead_emails", {
          p_lead_id: null,
          p_limit: 2,
        })
      ).length,
      0,
    );
  });
  it("does not resend when the provider accepted mail but the completion write was lost", async () => {
    await handleLeadRequest(request(input()), dependencies);
    let deliveries = 0;
    const rpc: typeof fixture.rpc = async (config, name, body) => {
      if (name === "finish_lead_email") throw new Error("database unavailable");
      return fixture.rpc(config, name, body);
    };
    await assert.rejects(
      dispatchLeadEmails(accepted[0].id, testConfig, rpc, async () => {
        deliveries++;
        return null;
      }),
    );
    await fixture.db.exec(
      "update public.lead_email_jobs set lease_until = now() - interval '1 second', last_activity_at = now() - interval '2 seconds'",
    );
    assert.equal(
      (
        await dispatchLeadEmails(
          accepted[0].id,
          testConfig,
          fixture.rpc,
          async () => {
            deliveries++;
            return null;
          },
        )
      ).claimed,
      0,
    );
    assert.equal(deliveries, 1);
  });
  it("denies anonymous/authenticated access and permits the trusted service role", async () => {
    for (const role of ["anon", "authenticated"]) {
      await fixture.db.exec(`set role ${role}`);
      await assert.rejects(
        fixture.db.query("select * from public.website_leads"),
        /permission denied/,
      );
      await assert.rejects(
        fixture.db.query("select * from public.claim_lead_emails()"),
        /permission denied/,
      );
      await assert.rejects(
        fixture.db.query("select * from public.lead_funnel_events"),
        /permission denied/,
      );
      await fixture.db.exec("reset role");
    }
    await fixture.db.exec("set role service_role");
    assert.equal(
      (await handleLeadRequest(request(input()), dependencies)).status,
      201,
    );
    await fixture.db.exec("reset role");
  });
  it("records browser events once and cannot manufacture saved-inquiry conversions", async () => {
    const body = {
      p_id: randomUUID(),
      p_event_name: "contractor_page_viewed",
      p_location: "contractor",
      p_ip_hash: "daily-hash",
    };
    assert.equal(
      await fixture.rpc(testConfig, "record_funnel_event", body),
      true,
    );
    assert.equal(
      await fixture.rpc(testConfig, "record_funnel_event", body),
      false,
    );
    await assert.rejects(
      fixture.rpc(testConfig, "record_funnel_event", {
        ...body,
        p_id: randomUUID(),
        p_event_name: "review_inquiry_saved",
      }),
    );
    assert.equal(
      (await fixture.db.query("select * from public.lead_funnel_events")).rows
        .length,
      1,
    );
  });
});

describe("EmailJS transport", () => {
  function job(): EmailJob {
    return {
      id: randomUUID(),
      lead_id: randomUUID(),
      kind: "owner",
      lease_token: randomUUID(),
      payload: buildEmails(parseLead(input()), testConfig)[0].payload,
    };
  }
  it("uses the EmailJS REST contract and accepts a plain-text success without inventing a message ID", async () => {
    const sample = job();
    const result = await sendEmail(testConfig, sample, async (url, init) => {
      assert.equal(url, "https://api.emailjs.com/api/v1.0/email/send");
      const body = JSON.parse(String(init?.body));
      assert.equal(body.service_id, testConfig.emailjsServiceId);
      assert.equal(body.user_id, testConfig.emailjsPublicKey);
      assert.equal(body.accessToken, testConfig.emailjsPrivateKey);
      assert.equal(body.template_id, testConfig.emailjsOwnerTemplateId);
      assert.equal(body.template_params.lead_reference, sample.lead_id);
      assert.equal(new Headers(init?.headers).has("Idempotency-Key"), false);
      return new Response("OK", { status: 200 });
    });
    assert.equal(result, null);
  });
  it("classifies HTTP rejections and refuses unexpected success bodies", async () => {
    await assert.rejects(
      sendEmail(
        testConfig,
        job(),
        async () => new Response("rate limited", { status: 429 }),
      ),
      /email_http_429/,
    );
    await assert.rejects(
      sendEmail(
        testConfig,
        job(),
        async () => new Response("<html>proxy</html>", { status: 200 }),
      ),
      /email_delivery_uncertain/,
    );
    await assert.rejects(
      sendEmail(testConfig, job(), async () => {
        throw new Error("socket reset");
      }),
      /socket reset/,
    );
  });
  it("uses existing contact settings without a new provider or template", () => {
    const vars = {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "test",
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "existing-service",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "existing-public",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "existing-template",
      EMAILJS_PRIVATE_KEY: "private-test",
      EMAILJS_LEAD_OWNER_TEMPLATE_ID: "",
      LEAD_HASH_SECRET: "x".repeat(32),
    };
    const before = Object.fromEntries(
      Object.keys(vars).map((key) => [key, process.env[key]]),
    );
    Object.assign(process.env, vars);
    try {
      const config = leadConfig();
      assert.equal(config.emailjsOwnerTemplateId, "existing-template");
      assert.equal(buildEmails(parseLead(input()), config).length, 1);
    } finally {
      for (const [key, value] of Object.entries(before)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
