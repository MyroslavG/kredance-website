import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createLeadDatabase, testConfig } from "./helpers/lead-database";
import { parseManualLead } from "../src/lib/engagement/manual-lead";
import { leadsCsv, parseExportFilters } from "../src/lib/engagement/lead-export";
import { matchesLeadSearch, type LeadRecord } from "../src/lib/engagement/lead-record";
import { POST } from "../src/app/api/dashboard/route";
import { GET as exportLeads } from "../src/app/api/dashboard/export/route";

const manual = () => ({ submissionId: randomUUID(), name: "Test Owner", business_name: "Example Roofing", email: "", contact_detail: "+1 555 010 1000", entry_channel: "referral", website: "example.com?private=yes", service: "website-development", problem: "Interested in a new business website.", next_action: "Arrange a short call", received_at: new Date().toISOString() });
describe("manual enquiry input and export boundaries", () => {
  it("accepts non-email contact details without inventing an email or website visit", () => {
    const lead = parseManualLead(manual());
    assert.equal(lead.email, null); assert.equal(lead.entry_channel, "referral");
    assert.equal(lead.website, "https://example.com/");
    assert.equal("sessionId" in lead, false);
  });
  it("rejects invalid dates, sources, contacts, lengths and service values", () => {
    for (const patch of [{ contact_detail: "" }, { email: "bad@" }, { entry_channel: "website" }, { service: "unknown" }, { received_at: "not-a-date" }, { received_at: "2099-01-01T00:00:00Z" }, { received_at: "1999-01-01T00:00:00Z" }, { next_action: "" }, { name: "bad\nname" }, { website: "javascript:alert(1)" }, { problem: "x".repeat(2001) }]) assert.throws(() => parseManualLead({ ...manual(), ...patch }));
  });
  it("protects owner-only creation/export and rejects cross-origin writes", async () => {
    assert.equal((await POST(new Request("https://www.kredance.com/api/dashboard", { method: "POST", headers: { origin: "https://evil.example" } }))).status, 403);
    assert.equal((await POST(new Request("https://www.kredance.com/api/dashboard", { method: "POST", headers: { origin: "https://www.kredance.com" } }))).status, 401);
    const response = await exportLeads(new Request("https://www.kredance.com/api/dashboard/export"));
    assert.equal(response.status, 401); assert.match(response.headers.get("Cache-Control")!, /no-store/);
  });
  it("validates export filters", () => {
    assert.deepEqual(parseExportFilters(new URL("https://example.com?days=7&view=overdue&q=%20roofer%20")), { days: 7, view: "overdue", query: "roofer" });
    for (const query of ["days=365", "view=deleted", `q=${"a".repeat(201)}`, "q=%00"]) assert.throws(() => parseExportFilters(new URL(`https://example.com?${query}`)));
  });
  it("quotes CSV separators, newlines and formulas, preserves UTF-8 and empty amounts", () => {
    const lead = { id: "id", name: '=HYPERLINK("https://example.com")', email: null, business_name: "Café, Inc.", contact_detail: "+15550101", entry_channel: "referral", service: "", problem: "Line one\nLine two", status: "new", qualified: false, deal_value: null, notes: "  ＝1+1", attribution: { utm: {} } } as unknown as LeadRecord;
    lead.created_at = "2026-10-23T10:00:00-04:00";
    lead.next_action_at = "2026-10-26T10:00:00-04:00";
    const csv = leadsCsv([lead]);
    assert.ok(csv.startsWith("\uFEFF")); assert.ok(csv.includes('"\'=HYPERLINK(""https://example.com"")"'));
    assert.ok(csv.includes('"Café, Inc."')); assert.ok(csv.includes('"\'+15550101"'));
    assert.ok(csv.includes('"Line one\nLine two"')); assert.ok(csv.includes('"\'  ＝1+1"'));
    assert.ok(csv.includes('"new","No",""')); assert.ok(matchesLeadSearch(lead, " café "));
    assert.ok(csv.includes('"2026-10-23T14:00:00.000Z","2026-10-26T14:00:00.000Z"'));
  });
});

describe("manual enquiries, exports and follow-up dates in PostgreSQL", () => {
  let fixture: Awaited<ReturnType<typeof createLeadDatabase>>;
  const rpc = <T>(name: string, body: object) => fixture.rpc<T>(testConfig, name, body);
  before(async () => { fixture = await createLeadDatabase(); });
  after(async () => { await fixture.db.close(); });
  beforeEach(async () => {
    await fixture.db.exec("truncate public.lead_email_jobs,public.lead_funnel_events,public.site_events,public.website_leads,public.dashboard_sessions cascade; insert into public.dashboard_sessions(token_hash) values('test-owner');");
  });
  const save = (lead = parseManualLead(manual()), session = "test-owner", hash = "a".repeat(64)) => rpc<{ id: string; created: boolean }>("dashboard_create_lead", { p_session_hash: session, p_submission_id: lead.submissionId, p_payload_hash: hash, p_lead: lead });
  const exportRows = (view = "all", query = "", session = "test-owner") => rpc<LeadRecord[]>("dashboard_export_leads", { p_session_hash: session, p_days: 30, p_view: view, p_query: query });
  it("saves once, handles retry conflicts, and does not send mail or create visitor conversions", async () => {
    const input = parseManualLead(manual()); const saved = await save(input);
    assert.equal(saved.created, true); assert.deepEqual(await save(input), { ...saved, created: false });
    await assert.rejects(save(input, "test-owner", "b".repeat(64)), /submission_conflict/);
    const counts = await fixture.db.query<{ leads: number; jobs: number; events: number }>("select (select count(*)::int from public.website_leads) leads,(select count(*)::int from public.lead_email_jobs) jobs,(select count(*)::int from public.site_events) events");
    assert.deepEqual(counts.rows[0], { leads: 1, jobs: 0, events: 0 });
    const report = await rpc<{ leadTotal: number; websiteLeadTotal: number; leads: LeadRecord[] }>("dashboard_report", { p_session_hash: "test-owner", p_days: 30 });
    assert.equal(report.leadTotal, 1); assert.equal(report.websiteLeadTotal, 0);
    assert.equal(report.leads[0].email, null); assert.equal(report.leads[0].contact_detail, input.contact_detail);
  });
  it("denies expired sessions and browser database roles", async () => {
    await assert.rejects(save(undefined, "expired"), /unauthorized/);
    await assert.rejects(exportRows("all", "", "expired"), /unauthorized/);
    for (const role of ["anon", "authenticated"]) {
      await fixture.db.exec(`set role ${role}`);
      try {
        await assert.rejects(save(), /permission denied/);
        await assert.rejects(exportRows(), /permission denied/);
        await assert.rejects(fixture.db.query("select * from public.website_leads"), /permission denied/);
      } finally { await fixture.db.exec("reset role"); }
    }
  });
  it("uses Toronto weekdays across weekends, year boundaries and both DST changes", async () => {
    await fixture.db.exec("set timezone='Asia/Tokyo'");
    const cases = [
      ["2026-10-23T14:00:00Z", "2026-10-26T14:00:00Z"],
      ["2026-10-24T14:00:00Z", "2026-10-26T14:00:00Z"],
      ["2026-10-25T14:00:00Z", "2026-10-26T14:00:00Z"],
      ["2026-10-26T14:00:00Z", "2026-10-27T14:00:00Z"],
      ["2026-03-06T15:30:00Z", "2026-03-09T14:30:00Z"],
      ["2026-10-30T15:00:00Z", "2026-11-02T16:00:00Z"],
      ["2027-12-31T15:00:00Z", "2028-01-03T15:00:00Z"],
    ];
    for (const [received, expected] of cases) {
      const result = await fixture.db.query<{ due: Date }>("select public.next_lead_follow_up($1::timestamptz) due", [received]);
      assert.equal(new Date(result.rows[0].due).toISOString(), new Date(expected).toISOString());
    }
  });
  it("exports beyond the dashboard's 500-row display cap and honors literal search/status/date filters", async () => {
    await fixture.db.exec("insert into public.website_leads(submission_id,payload_hash,ip_hash,name,email,website,problem) select gen_random_uuid(),'hash','ip','Export '||n,'test@example.com','','A synthetic export enquiry' from generate_series(1,501) n;");
    assert.equal((await exportRows()).length, 501);
    const lead = parseManualLead({ ...manual(), business_name: "100% Roofing_One" }); await save(lead);
    assert.equal((await exportRows("all", "%" )).length, 1);
    assert.equal((await exportRows("won")).length, 0);
    await fixture.db.exec("update public.website_leads set created_at=now()-interval '100 days',next_action_at=now()-interval '1 day' where entry_channel<>'website'");
    assert.equal((await exportRows("all", "%")).length, 0);
    assert.equal((await exportRows("overdue", "%")).length, 1);
    await fixture.db.exec("update public.website_leads set attribution='{\"utm\":{\"utm_source\":\"setup-test\"}}'::jsonb");
    assert.equal((await exportRows("overdue")).length, 0);
  });
});
