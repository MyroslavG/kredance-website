import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import { cleanLeadDiagnostic } from "../src/lib/leads/errors";
import { parseLead } from "../src/lib/leads/validation";
import { submitLead, submissionFailure, LeadSubmissionError } from "../src/lib/leads/submit";
import { handleLeadRequest } from "../src/lib/leads/server";

const payload = () => ({ submissionId: randomUUID(), kind: "contact", service: "design",
  name: "Synthetic Enquiry", email: "test@example.com", website: "",
  problem: "A website and advertising project.", attribution: {} });
const reply = (status: number, body: unknown) => (async () => Response.json(body, { status })) as typeof fetch;

describe("public form validation and recovery", () => {
  it("accepts a whitespace-only optional website while keeping review websites required", () => {
    assert.equal(parseLead({ ...payload(), website: "    " }).website, "");
    assert.throws(() => parseLead({ ...payload(), kind: "website_review", website: "    " }));
  });

  it("identifies the invalid field before making a request", async () => {
    let requests = 0;
    await assert.rejects(submitLead({ ...payload(), website: "not a website" }, async () => {
      requests++; return Response.json({ accepted: true });
    }), error => {
      const failure = submissionFailure(error);
      assert.deepEqual(failure.diagnostic, { code: "validation", field: "website" });
      return true;
    });
    assert.equal(requests, 0);
  });

  it("returns safe field diagnostics from the server before storage or mail", async () => {
    const request = new Request("https://www.kredance.com/api/leads", {
      method: "POST", headers: { origin: "https://www.kredance.com", "content-type": "application/json" },
      body: JSON.stringify({ ...payload(), problem: "    short " }),
    });
    const response = await handleLeadRequest(request, {
      config: () => { throw new Error("Must not configure storage for invalid input"); },
      save: async () => { throw new Error("Must not save invalid input"); }, accepted: () => assert.fail("Must not notify"),
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Project details must contain 10–2000 characters.", code: "validation", field: "problem",
    });
  });

  it("submits valid data with a cancellable request and requires explicit acceptance", async () => {
    const input = payload();
    await submitLead(input, async (url, init) => {
      assert.equal(url, "/api/leads");
      assert.equal(init?.method, "POST");
      assert.ok(init?.signal instanceof AbortSignal);
      assert.deepEqual(JSON.parse(String(init?.body)), input);
      return Response.json({ accepted: true }, { status: 201 });
    });
    for (const body of [{}, { accepted: "true" }]) {
      await assert.rejects(submitLead(input, reply(200, body)), error => {
        assert.ok(error instanceof LeadSubmissionError);
        assert.equal(error.diagnostic.code, "unexpected_response");
        assert.equal(error.resetSubmissionId, false);
        return true;
      });
    }
  });

  it("keeps uncertain attempts retryable and distinguishes confirmed rejections", async () => {
    for (const [status, code, reset] of [[400, "validation", true], [409, "submission_conflict", true],
      [429, "rate_limited", false], [503, "service_unavailable", false]] as const) {
      await assert.rejects(submitLead(payload(), reply(status, { error: "Synthetic failure." })), error => {
        assert.ok(error instanceof LeadSubmissionError);
        assert.deepEqual(error.diagnostic, { code, httpStatus: status });
        assert.equal(error.resetSubmissionId, reset);
        return true;
      });
    }
  });

  it("distinguishes connection failure from timeout without exposing exception text", async () => {
    await assert.rejects(submitLead(payload(), async () => { throw new TypeError("private@example.com"); }), error => {
      assert.ok(error instanceof LeadSubmissionError);
      assert.equal(error.diagnostic.code, "network");
      assert.equal(error.resetSubmissionId, false);
      assert.doesNotMatch(error.message, /private@example/);
      return true;
    });
    await assert.rejects(submitLead(payload(), async (_url, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }), 1), error => {
      assert.ok(error instanceof LeadSubmissionError);
      assert.equal(error.diagnostic.code, "timeout");
      assert.equal(error.resetSubmissionId, false);
      return true;
    });
  });

  it("allows only fixed diagnostics, never arbitrary values or raw messages", () => {
    assert.deepEqual(cleanLeadDiagnostic({ code: "validation", field: "website", httpStatus: 400,
      email: "private@example.com", message: "Private details" }), { code: "validation", field: "website", httpStatus: 400 });
    assert.deepEqual(cleanLeadDiagnostic({ code: "network", field: "private@example.com", httpStatus: 900 }), { code: "network" });
    assert.equal(cleanLeadDiagnostic({ code: "private@example.com" }), undefined);
  });
});
