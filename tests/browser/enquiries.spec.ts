import { test, expect, type APIRequestContext, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const fixture = "http://127.0.0.1:4317";
async function state(request: APIRequestContext) { return (await request.get(`${fixture}/__test/state`)).json(); }
test.beforeEach(async ({ page, request }) => {
  await request.post(`${fixture}/__test/reset`);
  // These tests must never reach EmailJS, Calendly, analytics or another real service.
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    return ["127.0.0.1", "localhost"].includes(url.hostname) ? route.continue() : route.abort();
  });
});

const publicForms = [
  { path: "/services/facebook-lead-generation", form: "Request a free campaign review", website: false, details: "message", success: "Your request is in." },
  { path: "/contact", form: "Project inquiry", website: false, details: "message", success: "Your message is in." },
  { path: "/contact?intent=review", form: "Request a website review", website: true, details: "message", success: "Your review request is in." },
  { path: "/websites-for-contractors", form: "Request a free website review", website: true, details: "problem", success: "Your review request is in." },
];
for (const item of publicForms) test(`${item.form}: required fields, saved enquiry and captured notification`, async ({ page, request }) => {
  await page.goto(item.path + (item.path.includes("?") ? "&" : "?") + "utm_source=browser-test&utm_campaign=workflow");
  const form = page.getByRole("form", { name: item.form, exact: true });
  const submit = form.getByRole("button", { name: /send|get my|request/i });
  await submit.click();
  expect((await state(request)).leads).toHaveLength(0);
  await form.locator('[name="name"]').fill("Synthetic Browser Enquiry");
  await form.locator('[name="email"]').fill("browser@example.com");
  if (item.website) await form.locator('[name="website"]').fill("example.com");
  await form.locator(`[name="${item.details}"]`).fill("Synthetic request for a website and advertising review.");
  await submit.click();
  await expect(page.getByRole("heading", { name: item.success, exact: true })).toBeVisible();
  await expect.poll(async () => (await state(request)).jobs.filter((job: { status: string }) => job.status === "sent").length).toBe(1);
  const saved = await state(request);
  expect(saved.leads).toHaveLength(1); expect(saved.emails).toHaveLength(1);
  expect(saved.leads[0].attribution.utm.utm_source).toBe("browser-test");
  expect(saved.siteEvents.filter((event: { event_name: string }) => event.event_name === "lead_saved")).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("campaign form: corrected validation and uncertain-response retry never duplicate the lead", async ({ page, request }) => {
  await page.goto("/services/facebook-lead-generation");
  const form = page.getByRole("form", { name: "Request a free campaign review" });
  await form.getByLabel("Name", { exact: true }).fill("Synthetic Retry Enquiry");
  await form.getByLabel("Email", { exact: true }).fill("retry@example.com");
  await form.getByLabel("Website", { exact: false }).fill("not a valid website");
  await form.locator('[name="message"]').fill("Synthetic review request to test safe retries.");
  await form.getByRole("button", { name: "Get my free campaign review" }).click();
  await expect(form.getByRole("alert")).toContainText("valid business website");
  expect((await state(request)).leads).toHaveLength(0);
  await form.getByLabel("Website", { exact: false }).fill("");
  let first = true; const ids: string[] = [];
  await page.route("**/api/leads", async route => {
    ids.push(route.request().postDataJSON().submissionId);
    const response = await route.fetch(); // The real local transaction commits.
    if (first) { first = false; await route.fulfill({ status: 503, json: { error: "Synthetic response interruption. Please retry." } }); }
    else await route.fulfill({ response });
  });
  await form.getByRole("button", { name: "Get my free campaign review" }).click({ clickCount: 2 });
  await expect(form.getByRole("alert")).toContainText("Synthetic response interruption");
  expect(ids).toHaveLength(1);
  await form.getByRole("button", { name: "Get my free campaign review" }).click();
  await expect(page.getByRole("heading", { name: "Your request is in." })).toBeVisible();
  expect(ids).toHaveLength(2); expect(ids[1]).toBe(ids[0]);
  await expect.poll(async () => (await state(request)).emails.length).toBe(1);
  const saved = await state(request);
  expect(saved.leads).toHaveLength(1); expect(saved.jobs).toHaveLength(1);
  expect(saved.siteEvents.filter((event: { event_name: string }) => event.event_name === "lead_saved")).toHaveLength(1);
});

async function signIn(page: Page, request: APIRequestContext) {
  await page.goto("/dashboard");
  await page.getByLabel("Email", { exact: true }).fill("myroslav@kredance.com");
  await page.getByRole("button", { name: "Send sign-in code" }).click();
  await expect(page.getByLabel("Eight-digit code")).toBeVisible();
  const messages = (await state(request)).emails;
  const code = messages[0].payload.template_params.message.match(/code is: (\d{8})/)[1];
  await page.getByLabel("Eight-digit code").fill(code);
  await page.getByRole("button", { name: "Open dashboard", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Follow up with leads" })).toBeVisible();
}

test("owner can record a referral, update it, and download a filtered CSV without sending mail", async ({ page, request }) => {
  await signIn(page, request);
  await page.getByRole("button", { name: "Add enquiry", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Add an enquiry" });
  await dialog.getByLabel("Contact name").fill("Synthetic Referral");
  await dialog.getByRole("textbox", { name: "Business (optional)", exact: true }).fill("Café Roofing, Inc.");
  await dialog.getByLabel("What are they interested in?").fill("A synthetic referral asking about a website.");
  await dialog.getByRole("button", { name: "Add enquiry", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("email address or another way");
  await dialog.getByLabel("Other contact details").fill("+1 555 010 2000");
  const manualRequests: string[] = [];
  await page.route("**/api/dashboard", async route => {
    if (route.request().method() !== "POST") return route.continue();
    manualRequests.push(route.request().postData()!);
    const response = await route.fetch();
    if (manualRequests.length === 1) await route.fulfill({ status: 503, json: { error: "Synthetic interruption after save." } });
    else await route.fulfill({ response });
  });
  await dialog.getByRole("button", { name: "Add enquiry", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Synthetic interruption");
  await expect(dialog.getByLabel("Contact name")).toBeDisabled();
  await dialog.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect(manualRequests).toHaveLength(2); expect(manualRequests[1]).toBe(manualRequests[0]);
  await expect(page.getByRole("status")).toContainText("No message was sent");
  await page.getByLabel("Search leads").fill("Café Roofing");
  await page.getByRole("button", { name: /Synthetic Referral ·/ }).click();
  const editor = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Synthetic Referral", exact: true }) });
  await expect(editor).toHaveAttribute("aria-labelledby", "lead-editor-heading");
  await editor.getByRole("combobox", { name: "Status", exact: true }).selectOption("contacted");
  await editor.getByLabel("Next action", { exact: true }).fill("Prepare a website review");
  await editor.getByRole("button", { name: "Save lead" }).click();
  await expect(editor).not.toBeVisible();
  await page.getByLabel("Filter leads").selectOption("contacted");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const csv = await readFile((await download.path())!, "utf8");
  expect(csv).toContain('"Café Roofing, Inc."'); expect(csv).toContain('"contacted"');
  expect(csv).toContain('"\'+1 555 010 2000"');
  expect(csv).not.toContain("payload_hash");
  const saved = await state(request);
  expect(saved.leads).toHaveLength(1); expect(saved.jobs).toHaveLength(0);
  expect(saved.emails).toHaveLength(1); // Only the captured owner login code.
  expect(saved.siteEvents).toHaveLength(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
