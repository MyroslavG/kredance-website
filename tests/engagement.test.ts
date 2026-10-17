import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createLeadDatabase, testConfig } from "./helpers/lead-database";
import { parseSiteEvent } from "../src/lib/engagement/validation";
import { parseLead } from "../src/lib/leads/validation";
import {
  buildEmails,
  handleLeadRequest,
  hashValue,
} from "../src/lib/leads/server";
import { GET, PATCH } from "../src/app/api/dashboard/route";
import { POST as auth } from "../src/app/api/dashboard/auth/route";

const event = () => ({
  id: randomUUID(),
  sessionId: randomUUID(),
  event: "page_view",
  page: "/contact",
  placement: "page",
  device: "mobile",
  attribution: { landingPath: "/contact", utm: { utm_source: "linkedin" } },
});
const inquiry = () => ({
  submissionId: randomUUID(),
  kind: "contact",
  subject: "A new website",
  name: "Test Customer",
  email: "customer@example.com",
  website: "",
  problem: "I need an online store for my products.",
  service: "ecommerce",
  attribution: {
    landingPath: "/services/ecommerce",
    utm: { utm_source: "linkedin", utm_campaign: "october" },
  },
});
describe("engagement input and endpoint protection", () => {
  it("rejects private paths and client-generated conversions, and strips arbitrary data", () => {
    assert.throws(() => parseSiteEvent({ ...event(), page: "/dashboard" }));
    assert.throws(() => parseSiteEvent({ ...event(), event: "lead_saved" }));
    const parsed = parseSiteEvent({
      ...event(),
      email: "private@example.com",
      service: "unexpected",
      attribution: {
        landingPath: "/unknown/user",
        utm: { utm_source: "private@example.com" },
      },
    });
    assert.equal(parsed.service, "");
    assert.equal(parsed.attribution.landingPath, "/");
    assert.deepEqual(parsed.attribution.utm, {});
    assert.equal("email" in parsed, false);
  });
  it("accepts contact inquiries without a website, but requires a website for reviews", () => {
    assert.equal(parseLead(inquiry()).website, "");
    assert.throws(() => parseLead({ ...inquiry(), kind: "website_review" }));
    assert.throws(() => parseLead({ ...inquiry(), subject: "bad\nsubject" }));
    assert.match(
      buildEmails(parseLead(inquiry()), testConfig)[0].payload.template_params
        .message,
      /Ecommerce/,
    );
  });
  it("denies anonymous dashboard reads and cross-origin mutations", async () => {
    const response = await GET(
      new Request("https://www.kredance.com/api/dashboard"),
    );
    assert.equal(response.status, 401);
    assert.match(response.headers.get("cache-control")!, /no-store/);
    const denied = await PATCH(
      new Request("https://www.kredance.com/api/dashboard", {
        method: "PATCH",
        headers: { origin: "https://evil.example" },
      }),
    );
    assert.equal(denied.status, 403);
    const signIn = await auth(
      new Request("https://www.kredance.com/api/dashboard/auth", {
        method: "POST",
        headers: { origin: "https://evil.example" },
      }),
    );
    assert.equal(signIn.status, 403);
  });
  it("does not send sign-in emails for an unconfigured address", async () => {
    const response = await auth(
      new Request("https://www.kredance.com/api/dashboard/auth", {
        method: "POST",
        headers: {
          origin: "https://www.kredance.com",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: "request",
          email: "stranger@example.com",
        }),
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("set-cookie"), null);
  });
});

describe("private lead dashboard database", () => {
  let fixture: Awaited<ReturnType<typeof createLeadDatabase>>;
  const rpc = <T>(name: string, body: unknown) =>
    fixture.rpc<T>(testConfig, name, body);
  before(async () => {
    fixture = await createLeadDatabase();
  });
  after(async () => {
    await fixture.db.close();
  });
  beforeEach(async () => {
    await fixture.db.exec(
      "truncate public.website_leads,public.lead_email_jobs,public.lead_funnel_events,public.site_events,public.dashboard_challenges,public.dashboard_sessions cascade;",
    );
  });
  async function session() {
    const id = randomUUID();
    assert.equal(
      await rpc("dashboard_issue_code", {
        p_id: id,
        p_code_hash: "hash",
        p_ip_hash: "ip",
      }),
      true,
    );
    assert.equal(
      await rpc("dashboard_verify_code", {
        p_id: id,
        p_code_hash: "hash",
        p_session_hash: "session",
      }),
      true,
    );
    return "session";
  }
  it("makes codes single use, enforces expiry and attempt limits, and revokes sessions", async () => {
    const id = randomUUID();
    await rpc("dashboard_issue_code", {
      p_id: id,
      p_code_hash: "correct",
      p_ip_hash: "ip",
    });
    assert.equal(
      await rpc("dashboard_issue_code", {
        p_id: randomUUID(),
        p_code_hash: "other",
        p_ip_hash: "different",
      }),
      false,
    );
    for (let i = 0; i < 5; i++)
      assert.equal(
        await rpc("dashboard_verify_code", {
          p_id: id,
          p_code_hash: "wrong",
          p_session_hash: "bad",
        }),
        false,
      );
    assert.equal(
      await rpc("dashboard_verify_code", {
        p_id: id,
        p_code_hash: "correct",
        p_session_hash: "bad",
      }),
      false,
    );
    await fixture.db.exec("truncate public.dashboard_challenges;");
    await session();
    const challenge = (
      await fixture.db.query<{ id: string }>(
        "select id from public.dashboard_challenges",
      )
    ).rows[0];
    assert.equal(
      await rpc("dashboard_verify_code", {
        p_id: challenge.id,
        p_code_hash: "hash",
        p_session_hash: "replayed",
      }),
      false,
    );
    assert.equal(
      await rpc("dashboard_session_valid", { p_session_hash: "session" }),
      true,
    );
    await rpc("dashboard_logout", { p_session_hash: "session" });
    assert.equal(
      await rpc("dashboard_session_valid", { p_session_hash: "session" }),
      false,
    );
    await fixture.db.exec("truncate public.dashboard_challenges;");
    const expired = randomUUID();
    await rpc("dashboard_issue_code", {
      p_id: expired,
      p_code_hash: "hash",
      p_ip_hash: "ip",
    });
    await fixture.db.exec(
      "update public.dashboard_challenges set expires_at=now()-interval '1 second';",
    );
    assert.equal(
      await rpc("dashboard_verify_code", {
        p_id: expired,
        p_code_hash: "hash",
        p_session_hash: "expired",
      }),
      false,
    );
  });
  it("keeps auth tables and functions unavailable to browser database roles", async () => {
    for (const role of ["anon", "authenticated"]) {
      await fixture.db.exec(`set role ${role};`);
      for (const table of [
        "site_events",
        "dashboard_challenges",
        "dashboard_sessions",
      ])
        await assert.rejects(
          fixture.db.query(`select * from public.${table}`),
          /permission denied/,
        );
      await assert.rejects(
        rpc("dashboard_issue_code", {
          p_id: randomUUID(),
          p_code_hash: "hash",
          p_ip_hash: "ip",
        }),
        /permission denied/,
      );
      await assert.rejects(
        rpc("dashboard_report", { p_session_hash: "unknown", p_days: 30 }),
        /permission denied/,
      );
      await fixture.db.exec("reset role;");
    }
    await assert.rejects(
      rpc("dashboard_report", { p_session_hash: "unknown", p_days: 30 }),
      /unauthorized/,
    );
  });
  it("stores contact leads once, hashes session IDs, reports outcomes, and prevents stale edits", async () => {
    await session();
    const body = { ...inquiry(), sessionId: randomUUID() };
    const request = () =>
      new Request("https://www.kredance.com/api/leads", {
        method: "POST",
        headers: {
          origin: "https://www.kredance.com",
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    const dependencies = {
      config: () => testConfig,
      save: (_config: typeof testConfig, data: Record<string, unknown>) =>
        rpc<{ id: string; created: boolean }>("accept_website_lead", data),
      accepted: () => {},
    };
    assert.equal(
      (await handleLeadRequest(request(), dependencies)).status,
      201,
    );
    assert.equal(
      (await handleLeadRequest(request(), dependencies)).status,
      200,
    );
    const row = (
      await fixture.db.query<Record<string, unknown>>(
        "select * from public.website_leads",
      )
    ).rows[0];
    assert.equal(row.offer, "project-inquiry");
    assert.equal(
      row.session_hash,
      hashValue(`visit:${body.sessionId}`, testConfig.hashSecret),
    );
    assert.equal(
      (await fixture.db.query("select * from public.lead_email_jobs")).rows
        .length,
      1,
    );
    assert.equal(
      (
        await fixture.db.query(
          "select * from public.site_events where event_name='lead_saved'",
        )
      ).rows.length,
      1,
    );
    const changes = {
      status: "won",
      qualified: true,
      deal_value: 2500,
      notes: "Ready to proceed",
      next_action: "Send agreement",
      next_action_at: new Date().toISOString(),
      updated_at: row.updated_at,
    };
    assert.equal(
      await rpc("dashboard_update_lead", {
        p_session_hash: "session",
        p_id: row.id,
        p_changes: changes,
      }),
      true,
    );
    assert.equal(
      await rpc("dashboard_update_lead", {
        p_session_hash: "session",
        p_id: row.id,
        p_changes: changes,
      }),
      false,
    );
    const report = await rpc<{
      leadTotal: number;
      outcomes: { won: number; value: number };
      leads: Record<string, unknown>[];
    }>("dashboard_report", { p_session_hash: "session", p_days: 30 });
    assert.equal(report.leadTotal, 1);
    assert.equal(report.outcomes.value, 2500);
    assert.equal(report.outcomes.won, 1);
    assert.equal("ip_hash" in report.leads[0], false);
    await fixture.db.exec(
      "update public.website_leads set attribution=jsonb_build_object('utm',jsonb_build_object('utm_source','setup-test'));update public.site_events set attribution=jsonb_build_object('utm',jsonb_build_object('utm_source','setup-test'));",
    );
    const hidden = await rpc<{ leadTotal: number; events: unknown[] }>(
      "dashboard_report",
      { p_session_hash: "session", p_days: 30 },
    );
    assert.equal(hidden.leadTotal, 0);
    assert.deepEqual(hidden.events, []);
  });
  it("records events idempotently and rejects forged saved-lead events", async () => {
    const parsed = parseSiteEvent(event());
    const data = { ...parsed, sessionHash: "visit-hash" };
    assert.equal(
      await rpc("record_site_event", { p_event: data, p_ip_hash: "ip" }),
      true,
    );
    assert.equal(
      await rpc("record_site_event", { p_event: data, p_ip_hash: "ip" }),
      false,
    );
    await assert.rejects(
      rpc("record_site_event", {
        p_event: { ...data, id: randomUUID(), event: "lead_saved" },
        p_ip_hash: "ip",
      }),
      /invalid_event/,
    );
  });
});
