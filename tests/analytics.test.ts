import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { randomUUID } from "node:crypto";
import { createGoogleAnalytics, googleAnalyticsPage, GOOGLE_ANALYTICS_ID } from "../src/lib/google-analytics";
import { publicAnalyticsPages } from "../src/lib/engagement/pages";
import { parseSiteEvent } from "../src/lib/engagement/validation";
import { legacyRedirects } from "../src/lib/legacy-redirects";
import type { Attribution } from "../src/lib/leads/validation";

function fixture() {
  const context = {
    consent: false,
    url: "https://www.kredance.com/websites-for-contractors",
    referrer: "https://www.google.com/search?q=private@example.com#private",
    attribution: { landingPath: "/websites-for-contractors", referrerHost: "www.google.com", utm: {} } as Attribution,
  };
  const commands: unknown[][] = [];
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
  let loads = 0;
  let disabled = true;
  const environment = {
    context: () => context,
    emit: (...args: unknown[]) => { commands.push(args); },
    load: () => { loads++; },
    disable: (value: boolean) => { disabled = value; },
    storage,
  };
  const client = createGoogleAnalytics(environment);
  return { client, environment, context, commands, storage, loads: () => loads, disabled: () => disabled };
}

describe("consent-aware Google Analytics", () => {
  it("does not load, queue commands, or record events before consent", () => {
    const f = fixture();
    assert.equal(f.client.pageView(), false);
    assert.equal(f.client.event("lead_submitted", "review", { submissionId: randomUUID() }), false);
    assert.equal(f.loads(), 0);
    assert.deepEqual(f.commands, []);
  });

  it("loads once after consent with ads disabled and manual pageviews", () => {
    const f = fixture();
    f.context.consent = true;
    assert.equal(f.client.pageView(), true);
    assert.equal(f.client.pageView(), false); // React effect replay / same route.
    f.context.url = "https://www.kredance.com/contact?service=website-development#form";
    assert.equal(f.client.pageView(), true);
    assert.equal(f.client.pageView(), false);
    assert.equal(f.loads(), 1);
    assert.equal(f.disabled(), false);
    assert.deepEqual(f.commands.slice(0, 2), [
      ["consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }],
      ["consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }],
    ]);
    const config = f.commands.find(([command]) => command === "config")!;
    assert.equal(config[1], GOOGLE_ANALYTICS_ID);
    assert.equal((config[2] as Record<string, unknown>).send_page_view, false);
    assert.equal((config[2] as Record<string, unknown>).allow_google_signals, false);
    assert.equal((config[2] as Record<string, unknown>).allow_ad_personalization_signals, false);
    const pages = f.commands.filter(([command, name]) => command === "event" && name === "page_view");
    assert.equal(pages.length, 2);
    assert.equal((pages[1][2] as Record<string, unknown>).page_referrer, "https://www.kredance.com/websites-for-contractors");
  });

  it("strips arbitrary queries, fragments, private referrer paths and unsafe campaign values", () => {
    const f = fixture();
    f.context.consent = true;
    f.context.url += "?email=private@example.com&token=secret&gclid=tracking-id#private";
    f.context.attribution.utm = { utm_source: "linkedin", utm_campaign: "ottawa-contractors", utm_term: "private@example.com", utm_content: "Jane Smith" };
    assert.equal(f.client.pageView(), true);
    const serialized = JSON.stringify(f.commands);
    for (const secret of ["private@example.com", "secret", "tracking-id", "#private", "Jane Smith", "?", "search?q"]) assert.equal(serialized.includes(secret), false);
    const config = f.commands.find(([command]) => command === "config")![2] as Record<string, unknown>;
    assert.equal(config.campaign_source, "linkedin");
    assert.equal(config.campaign_name, "ottawa-contractors");
    assert.equal(config.page_referrer, "https://www.google.com");
    assert.equal("campaign_term" in config, false);
  });

  it("excludes preview hosts, local traffic, unknown/private routes, and test visits", () => {
    for (const url of [
      "https://kredance-preview.vercel.app/contact",
      "http://localhost:3000/contact",
      "https://www.kredance.com:3000/contact",
      "https://www.kredance.com.evil.example/contact",
      "https://www.kredance.com/dashboard",
      "https://www.kredance.com/dashboard/private",
      "https://www.kredance.com/customer/private@example.com",
      "https://www.kredance.com/contact?utm_source=setup-test",
      "https://www.kredance.com/contact?utm_source=internal",
      "https://www.kredance.com/contact?utm_source=preview",
    ]) {
      const f = fixture();
      f.context.consent = true;
      f.context.url = url;
      assert.equal(f.client.pageView(), false, url);
      assert.equal(f.loads(), 0, url);
    }
    for (const source of ["setup-test", "internal", "preview"]) {
      const f = fixture();
      f.context.consent = true;
      f.context.attribution.utm.utm_source = source;
      assert.equal(f.client.pageView(), false); // Still excluded after navigation drops the query.
    }
  });

  it("stops collection when consent is revoked", () => {
    const f = fixture();
    f.context.consent = true;
    f.client.pageView();
    f.context.consent = false;
    f.client.revoke();
    assert.equal(f.disabled(), true);
    const commandsAfterRevocation = f.commands.length;
    assert.equal(f.client.pageView(), false);
    assert.equal(f.client.event("review_cta_clicked", "hero"), false);
    assert.equal(f.commands.length, commandsAfterRevocation);
    assert.equal(f.loads(), 1);
  });

  it("counts a confirmed saved inquiry once, without transmitting its identifier", () => {
    const f = fixture();
    f.context.consent = true;
    const lead = { submissionId: randomUUID(), service: "website-development" };
    assert.equal(f.client.event("lead_submitted", "review"), false);
    assert.equal(f.client.event("lead_submitted", "review", { submissionId: "bad" }), false);
    assert.equal(f.client.event("lead_submitted", "review", lead), true);
    assert.equal(f.client.event("lead_submitted", "review", lead), false);
    const reload = createGoogleAnalytics(f.environment);
    assert.equal(reload.event("lead_submitted", "review", lead), false);
    assert.equal(f.commands.filter(([command, event]) => command === "event" && event === "generate_lead").length, 1);
    assert.equal(JSON.stringify(f.commands).includes(lead.submissionId), false);
    assert.equal(JSON.stringify(f.commands).includes("website_review"), true);
  });

  it("counts a saved campaign review once after consent and keeps form details private", () => {
    const f = fixture();
    f.context.url = "https://www.kredance.com/services/facebook-lead-generation?email=private@example.com#campaign-review";
    const lead = { submissionId: randomUUID(), service: "facebook-lead-generation" };
    assert.equal(f.client.event("lead_submitted", "campaign", lead), false);
    assert.equal(f.loads(), 0);
    f.context.consent = true;
    assert.equal(f.client.event("lead_submitted", "campaign", lead), true);
    assert.equal(f.client.event("lead_submitted", "campaign", lead), false);
    assert.equal(createGoogleAnalytics(f.environment).event("lead_submitted", "campaign", lead), false);
    const events = f.commands.filter(([command, event]) => command === "event" && event === "generate_lead");
    assert.equal(events.length, 1);
    const payload = events[0][2] as Record<string, unknown>;
    assert.equal(payload.lead_source, "campaign_review");
    assert.equal(payload.service, "facebook-lead-generation");
    assert.equal(payload.page_location, "https://www.kredance.com/services/facebook-lead-generation");
    assert.equal(JSON.stringify(f.commands).includes(lead.submissionId), false);
    assert.equal(JSON.stringify(f.commands).includes("private@example.com"), false);
  });

  it("does not turn a form start or booking into a generated lead", () => {
    const f = fixture();
    f.context.consent = true;
    assert.equal(f.client.event("review_form_started", "review"), true);
    assert.equal(f.client.event("booking_confirmed", "review"), true);
    assert.equal(f.client.event("private@example.com", "review"), false);
    assert.equal(f.client.event("review_cta_clicked", "private@example.com"), false);
    assert.equal(JSON.stringify(f.commands).includes("generate_lead"), false);
    assert.equal(JSON.stringify(f.commands).includes("private@example.com"), false);
  });

  it("permits /insights in first-party page events as well as GA", () => {
    const f = fixture();
    f.context.consent = true;
    f.context.url = "https://www.kredance.com/insights";
    assert.ok(googleAnalyticsPage(f.context));
    const parsed = parseSiteEvent({ id: randomUUID(), sessionId: randomUUID(), event: "page_view", page: "/insights", attribution: { landingPath: "/insights" } });
    assert.equal(parsed.page, "/insights");
    assert.equal(parsed.attribution.landingPath, "/insights");
  });
});

describe("verified legacy redirects", () => {
  it("maps thirteen distinct old paths directly to existing public pages, without speculative redirects", () => {
    assert.equal(legacyRedirects.length, 13);
    assert.equal(new Set(legacyRedirects.map(([source]) => source)).size, 13);
    for (const [source, destination] of legacyRedirects) {
      assert.ok(publicAnalyticsPages.has(destination), destination);
      assert.notEqual(source, destination);
      assert.equal(legacyRedirects.some(([otherSource]) => String(otherSource) === destination), false);
      assert.equal(source.includes("help-me-study"), false);
    }
  });
});
