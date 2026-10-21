import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCampaignLink } from "../src/lib/engagement/campaign";

const labels = {
  source: "linkedin",
  medium: "social",
  campaign: "website-reviews",
};

describe("campaign links", () => {
  it("preserves service, review intent, and the form section while replacing tracking", () => {
    const url = new URL(buildCampaignLink({
      ...labels,
      destination: "https://www.kredance.com/contact?service=website-development&intent=review&utm_source=old&utm_source=duplicate&utm_medium=old&utm_campaign=old&utm_content=old&utm_term=old&email=private%40example.com#inquiry-form",
      content: " review-post-1 ",
    }));
    assert.equal(url.pathname, "/contact");
    assert.equal(url.hash, "#inquiry-form");
    assert.deepEqual([...url.searchParams], [
      ["service", "website-development"],
      ["intent", "review"],
      ["utm_source", "linkedin"],
      ["utm_medium", "social"],
      ["utm_campaign", "website-reviews"],
      ["utm_content", "review-post-1"],
    ]);
  });

  it("keeps service and case-study anchors without requiring form context", () => {
    for (const destination of [
      "https://www.kredance.com/services/facebook-lead-generation#the-ad",
      "https://www.kredance.com/portfolio/prime-metal-roofing#the-ad",
      "https://www.kredance.com/contact?service=facebook-lead-generation#inquiry-form",
    ]) {
      const original = new URL(destination);
      const link = new URL(buildCampaignLink({ ...labels, destination }));
      assert.equal(link.pathname, original.pathname);
      assert.equal(link.hash, original.hash);
      assert.equal(link.searchParams.get("service"), original.searchParams.get("service"));
      assert.equal(link.searchParams.has("intent"), false);
    }
  });

  it("omits a blank post label and removes any previous one", () => {
    for (const content of [undefined, "", "   "]) {
      const url = new URL(buildCampaignLink({
        ...labels,
        destination: "https://www.kredance.com/?utm_content=old",
        content,
      }));
      assert.equal(url.searchParams.has("utm_content"), false);
    }
  });

  it("accepts normalized canonical HTTPS URLs but rejects credentials and foreign origins", () => {
    assert.match(buildCampaignLink({
      ...labels,
      destination: "https://WWW.KREDANCE.COM:443/contact",
    }), /^https:\/\/www\.kredance\.com\/contact\?/);
    for (const destination of [
      "http://www.kredance.com/contact",
      "https://www.kredance.com:444/contact",
      "https://kredance.com/contact",
      "https://www.kredance.com.evil.example/contact",
      "https://user:password@www.kredance.com/contact",
      "https://user@www.kredance.com/contact",
      "javascript:alert(1)",
    ]) assert.throws(() => buildCampaignLink({ ...labels, destination }));
  });

  it("rejects ambiguous or unsupported form context instead of changing its meaning", () => {
    for (const query of [
      "service=unknown",
      "service=",
      "service=ecommerce&service=website-development",
      "intent=other",
      "intent=",
      "intent=review&intent=other",
    ]) assert.throws(() => buildCampaignLink({
      ...labels,
      destination: `https://www.kredance.com/contact?${query}#inquiry-form`,
    }), /supported service/);
  });

  it("uses the attribution label limits and rejects private or malformed labels", () => {
    for (const key of ["source", "medium", "campaign", "content"]) {
      for (const value of ["private@example.com", "https://example.com", "a".repeat(101), "line\nbreak"]) {
        assert.throws(() => buildCampaignLink({
          ...labels,
          destination: "https://www.kredance.com/",
          [key]: value,
        }), /tracking labels/);
      }
    }
    assert.throws(() => buildCampaignLink({ ...labels, source: " ", destination: "https://www.kredance.com/" }));
    assert.throws(() => buildCampaignLink({ ...labels, destination: "https://www.kredance.com/#private@example.com" }), /page section/);
  });
});
