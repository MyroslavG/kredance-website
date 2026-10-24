import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { after, before, beforeEach, describe, it } from "node:test";
import { createLeadDatabase, testConfig } from "./helpers/lead-database";

type Post = {
  campaign: string;
  source: string;
  content: string | null;
  leads: number;
  qualified: number;
  won: number;
  value: number;
};
type Report = {
  leadTotal: number;
  websiteLeadTotal: number;
  leads: Record<string, unknown>[];
  followups: Record<string, unknown>[];
  posts: Post[];
  campaigns: Omit<Post, "content">[];
  outcomes: { qualified: number; won: number; value: number };
};

describe("private post outcome reporting", () => {
  let fixture: Awaited<ReturnType<typeof createLeadDatabase>>;
  before(async () => { fixture = await createLeadDatabase(); });
  after(async () => { await fixture.db.close(); });
  beforeEach(async () => {
    await fixture.db.exec("truncate public.website_leads,public.site_events,public.dashboard_sessions cascade;");
    await fixture.db.query("insert into public.dashboard_sessions(token_hash) values ($1)", ["owner-session"]);
  });

  async function lead(options: {
    content?: string;
    source?: string;
    campaign?: string;
    referrerHost?: string;
    untagged?: boolean;
    qualified?: boolean;
    status?: string;
    value?: number;
    daysAgo?: number;
    sessionHash?: string;
  } = {}) {
    const attribution = {
      referrerHost: options.referrerHost,
      utm: options.untagged ? {} : {
        utm_source: options.source ?? "linkedin",
        utm_campaign: options.campaign ?? "website-reviews",
        utm_content: options.content,
      },
    };
    await fixture.db.query(
      `insert into public.website_leads
       (submission_id,payload_hash,ip_hash,name,email,website,problem,attribution,qualified,status,deal_value,created_at,session_hash)
       values ($1::uuid,'fixture-payload','fixture-ip','Synthetic Customer','customer@example.com','','A synthetic website inquiry.',
       $2::jsonb,$3,$4,$5,now()-make_interval(days=>$6::integer),$7)`,
      [randomUUID(), JSON.stringify(attribution), options.qualified ?? false, options.status ?? "new", options.value ?? null, options.daysAgo ?? 1, options.sessionHash ?? null],
    );
  }

  async function report(days = 30, session = "owner-session") {
    await fixture.db.exec("set role service_role;");
    try {
      return await fixture.rpc<Report>(testConfig, "dashboard_report", { p_session_hash: session, p_days: days });
    } finally {
      await fixture.db.exec("reset role;");
    }
  }

  it("separates posts and unlabelled leads, respects date/test boundaries, and counts each saved lead once", async () => {
    await lead({ content: "post-a", value: 999, sessionHash: "visit-1" });
    await lead({ content: "post-a", qualified: true, status: "won", value: 2500, sessionHash: "visit-1" });
    // No analytics session or page view: still a saved, qualified inquiry.
    await lead({ content: "post-b", qualified: true, daysAgo: 8 });
    await lead();
    await lead({ content: "" });
    await lead({ content: "untagged" });
    await lead({ content: "post-a", campaign: "another-campaign" });
    await lead({ content: "post-a", source: "facebook" });
    await lead({ untagged: true, referrerHost: "example.com" });
    await lead({ untagged: true });
    await lead({ content: "post-a", source: "setup-test", qualified: true, status: "won", value: 99999 });
    await lead({ content: "older-post", daysAgo: 31 });
    await lead({ content: "outside-report", daysAgo: 91 });
    // Several page events from one visit must not multiply the saved inquiries.
    for (let i = 0; i < 3; i++) {
      await fixture.db.query(
        "insert into public.site_events(id,event_name,session_hash,page,attribution) values($1::uuid,'page_view','visit-1','/contact',$2::jsonb)",
        [randomUUID(), JSON.stringify({ utm: { utm_source: "linkedin", utm_campaign: "website-reviews", utm_content: "post-a" } })],
      );
    }
    const data = await report();
    assert.equal(data.leadTotal, 10);
    assert.equal(data.posts.length, 8);
    assert.equal(data.posts.reduce((total, p) => total + p.leads, 0), 10);
    assert.deepEqual(data.outcomes, { qualified: 2, won: 1, value: 2500 });
    const mainPosts = data.posts.filter((p) => p.source === "linkedin" && p.campaign === "website-reviews");
    assert.deepEqual(mainPosts.find((p) => p.content === "post-a"), {
      campaign: "website-reviews", source: "linkedin", content: "post-a", leads: 2, qualified: 1, won: 1, value: 2500,
    });
    assert.equal(mainPosts.find((p) => p.content === "post-b")?.qualified, 1);
    assert.equal(mainPosts.find((p) => p.content === null)?.leads, 2);
    assert.equal(mainPosts.find((p) => p.content === "untagged")?.leads, 1);
    assert.equal(data.posts.find((p) => p.source === "example.com")?.campaign, "untagged");
    assert.equal(data.posts.find((p) => p.source === "direct / unknown")?.leads, 1);
    assert.equal(data.posts.some((p) => p.source === "setup-test" || p.content === "older-post"), false);
    assert.equal((await report(7)).leadTotal, 9);
    const longer = await report(90);
    assert.equal(longer.leadTotal, 11);
    assert.equal(longer.posts.find((p) => p.content === "older-post")?.leads, 1);
    assert.equal(longer.posts.some((p) => p.content === "outside-report"), false);
    for (const p of data.posts) assert.deepEqual(Object.keys(p).sort(), ["campaign", "content", "leads", "qualified", "source", "value", "won"]);
  });

  it("preserves legacy report fields while adding posts and manual-entry metadata", async () => {
    await lead({ content: "post-a", qualified: true, status: "won", value: 2500 });
    await lead({ content: "post-b" });
    const current = await report();
    const definition = (await fixture.db.query<{ definition: string }>(
      "select pg_get_functiondef('public.dashboard_report(text,integer)'::regprocedure) as definition",
    )).rows[0].definition;
    const historical = await readFile(new URL("../supabase/migrations/20261017172347_engagement_dashboard.sql", import.meta.url), "utf8");
    const original = historical.slice(historical.indexOf("create function public.dashboard_report("), historical.indexOf("create function public.dashboard_update_lead("))
      .replace("create function public.dashboard_report(", "create or replace function public.dashboard_report(");
    try {
      await fixture.db.exec(original);
      const previous = await report();
      const { posts, websiteLeadTotal, leads, followups, ...unchanged } = current;
      assert.equal(posts.length, 2);
      assert.equal(websiteLeadTotal, current.leadTotal);
      const legacyLead = ({ entry_channel, business_name, contact_detail, ...lead }: Record<string, unknown>) => {
        assert.equal(entry_channel, "website");
        assert.equal(business_name, "");
        assert.equal(contact_detail, "");
        return lead;
      };
      assert.deepEqual({ ...unchanged, leads: leads.map(legacyLead), followups: followups.map(legacyLead) }, previous);
    } finally {
      await fixture.db.exec(definition);
    }
  });

  it("retains owner-session checks and service-role-only execution", async () => {
    await lead({ content: "post-a" });
    assert.equal((await report()).posts.length, 1);
    await assert.rejects(report(30, "unknown-session"), /unauthorized/);
    for (const role of ["anon", "authenticated"]) {
      await fixture.db.exec(`set role ${role};`);
      try {
        await assert.rejects(fixture.db.query("select public.dashboard_report('owner-session',30)"), /permission denied/);
      } finally {
        await fixture.db.exec("reset role;");
      }
    }
    await fixture.db.exec("update public.dashboard_sessions set expires_at=now()-interval '1 second'");
    await assert.rejects(report(), /unauthorized/);
    const config = (await fixture.db.query<{ prosecdef: boolean; proconfig: string[] }>(
      "select prosecdef,proconfig from pg_proc where oid='public.dashboard_report(text,integer)'::regprocedure",
    )).rows[0];
    assert.equal(config.prosecdef, false);
    assert.deepEqual(config.proconfig, ['search_path=""']);
  });
});
