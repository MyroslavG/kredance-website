import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";
import { createLeadDatabase, testConfig } from "./helpers/lead-database";
import { parseSiteEvent } from "../src/lib/engagement/validation";

describe("private form error diagnostics", () => {
  let fixture: Awaited<ReturnType<typeof createLeadDatabase>>;
  before(async () => { fixture = await createLeadDatabase(); });
  after(async () => { await fixture.db.close(); });
  const event = () => ({ id: randomUUID(), sessionId: randomUUID(), event: "form_error", page: "/contact",
    service: "design", placement: "contact", device: "desktop", attribution: {} });

  it("stores safe diagnostics while preserving compatibility with old clients", async () => {
    const current = event(); const legacy = event();
    for (const input of [{ ...current, diagnostic: { code: "validation", field: "website", httpStatus: 400 } }, legacy]) {
      await fixture.rpc(testConfig, "record_site_event", { p_event: parseSiteEvent(input), p_ip_hash: "diagnostic-test" });
    }
    const { rows } = await fixture.db.query<{ id: string; error_code: string | null; error_field: string | null; http_status: number | null }>("select id,error_code,error_field,http_status from public.site_events");
    assert.deepEqual(rows.find(row => row.id === current.id), { id: current.id, error_code: "validation", error_field: "website", http_status: 400 });
    assert.deepEqual(rows.find(row => row.id === legacy.id), { id: legacy.id, error_code: null, error_field: null, http_status: null });
  });

  it("filters diagnostics again in the database and ignores them on other events", async () => {
    for (const raw of [
      { ...event(), diagnostic: { code: "private@example.com", field: "secret", httpStatus: "400" } },
      { ...event(), event: "page_view", diagnostic: { code: "network", httpStatus: 503 } },
    ]) {
      await fixture.rpc(testConfig, "record_site_event", { p_event: raw, p_ip_hash: "diagnostic-test" });
      const { rows } = await fixture.db.query("select error_code,error_field,http_status from public.site_events where id=$1", [raw.id]);
      assert.deepEqual(rows[0], { error_code: null, error_field: null, http_status: null });
    }
    await fixture.db.exec("set role anon");
    await assert.rejects(fixture.db.query("select error_code from public.site_events"), /permission denied/);
    await fixture.db.exec("reset role");
  });
});
