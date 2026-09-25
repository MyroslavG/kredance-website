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
  it("uses the browser-facing host while rejecting cross-origin requests", () => {
    const localRequest = (origin: string) => new Request("http://localhost:3000/api/leads", {
      headers: { host: "127.0.0.1:3000", origin },
    });
    assert.doesNotThrow(() => requireSameOrigin(localRequest("http://127.0.0.1:3000")));
    assert.throws(() => requireSameOrigin(localRequest("https://evil.example")));
    assert.throws(() => requireSameOrigin(localRequest("http://127.0.0.1:3001")));
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
  it("does not reflect customer-provided links/content in acknowledgment emails", () => {
    const emails = buildEmails(
      parseLead(
        input({ problem: "Click https://untrusted.example for a discount" }),
      ),
      testConfig,
    );
    assert.equal(emails[0].payload.reply_to, "alex@example.com");
    assert.ok(!emails[1].payload.text.includes("untrusted.example"));
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

  it("saves the inquiry, attribution, follow-up task and two durable email jobs", async () => {
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
      2,
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
      2,
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
      2,
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
  it("rolls back the lead if either queued email cannot be inserted", async () => {
    const lead = parseLead(input());
    const emails = buildEmails(lead, testConfig);
    await assert.rejects(
      fixture.rpc(testConfig, "accept_website_lead", {
        p_submission_id: lead.submissionId,
        p_payload_hash: "hash",
        p_ip_hash: "ip",
        p_lead: lead,
        p_emails: [emails[0], emails[0]],
      }),
    );
    assert.equal(
      (await fixture.db.query("select * from public.website_leads")).rows
        .length,
      0,
    );
  });
  it("retries only failed email jobs and leaves successful delivery intact", async () => {
    await handleLeadRequest(request(input()), dependencies);
    const delivered: string[] = [];
    const first = await dispatchLeadEmails(
      null,
      testConfig,
      fixture.rpc,
      async (_config, job) => {
        if (job.kind === "acknowledgment") throw new Error("email_http_429");
        delivered.push(job.kind);
        return "provider-owner";
      },
    );
    assert.equal(first.sent, 1);
    const pending = await fixture.db.query<{
      status: string;
      last_error: string;
    }>(
      "select status, last_error from public.lead_email_jobs where kind = 'acknowledgment'",
    );
    assert.equal(pending.rows[0].status, "pending");
    assert.equal(pending.rows[0].last_error, "email_http_429");
    assert.equal(
      (
        await dispatchLeadEmails(
          null,
          testConfig,
          fixture.rpc,
          async () => "unused",
        )
      ).claimed,
      0,
    );
    await fixture.db.exec(
      "update public.lead_email_jobs set available_at = now() - interval '1 second' where status = 'pending'",
    );
    await dispatchLeadEmails(
      null,
      testConfig,
      fixture.rpc,
      async (_config, job) => {
        delivered.push(job.kind);
        return "provider-ack";
      },
    );
    assert.deepEqual(delivered.sort(), ["acknowledgment", "owner"]);
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_email_jobs where status = 'sent'",
        )
      ).rows.length,
      2,
    );
  });
  it("leases jobs once and refuses stale workers and retries outside the provider window", async () => {
    await handleLeadRequest(request(input()), dependencies);
    const jobs = await fixture.rpc<{ id: string; lease_token: string }[]>(
      testConfig,
      "claim_lead_emails",
      { p_lead_id: null, p_limit: 2 },
    );
    assert.equal(
      (
        await fixture.rpc<unknown[]>(testConfig, "claim_lead_emails", {
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
        p_provider_id: "stale",
        p_error: null,
      }),
      false,
    );
    await fixture.db.exec(
      "update public.lead_email_jobs set lease_until = now() - interval '1 minute', first_attempt_at = now() - interval '25 hours'",
    );
    assert.equal(
      (
        await fixture.rpc<unknown[]>(testConfig, "claim_lead_emails", {
          p_lead_id: null,
          p_limit: 2,
        })
      ).length,
      0,
    );
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.lead_email_jobs where status = 'review'",
        )
      ).rows.length,
      2,
    );
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
