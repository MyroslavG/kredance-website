// Local-only preview: real PostgreSQL migration, synthetic lead data, captured emails.
// No production services, credentials, or customer mailboxes are used.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createLeadDatabase, testConfig } from "../tests/helpers/lead-database";

async function main() {
  const fixture = await createLeadDatabase();
  const emails = new Map<string, { id: string; payload: unknown }>();
  const server = createServer(async (request, response) => {
    response.setHeader("Content-Type", "application/json");
    try {
      if (request.url === "/__test/state" && request.method === "GET") {
        response.end(
          JSON.stringify({
            leads: (
              await fixture.db.query("select * from public.website_leads")
            ).rows,
            jobs: (
              await fixture.db.query(
                "select id, kind, status, attempts from public.lead_email_jobs",
              )
            ).rows,
            emails: [...emails.values()],
            events: (
              await fixture.db.query(
                "select event_name, location from public.lead_funnel_events order by created_at",
              )
            ).rows,
          }),
        );
        return;
      }
      let body = "";
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 32_768) throw new Error("Too large");
      }
      const parsed = JSON.parse(body);
      if (request.url === "/emails" && request.method === "POST") {
        const key = String(request.headers["idempotency-key"]);
        const email = emails.get(key) ?? { id: randomUUID(), payload: parsed };
        emails.set(key, email);
        response.end(JSON.stringify({ id: email.id }));
        return;
      }
      if (
        !request.url?.startsWith("/rest/v1/rpc/") ||
        request.headers.apikey !== "local-test-key"
      ) {
        response.statusCode = 403;
        response.end("{}");
        return;
      }
      const name = request.url.slice("/rest/v1/rpc/".length);
      response.end(JSON.stringify(await fixture.rpc(testConfig, name, parsed)));
    } catch (error) {
      response.statusCode = 400;
      response.end(
        JSON.stringify({
          message: error instanceof Error ? error.message : "fixture_error",
        }),
      );
    }
  });
  server.listen(4317, "127.0.0.1", () => {
    console.log(
      "LOCAL TEST MODE: inquiries use an ephemeral database; emails are captured, never sent.",
    );
    console.log(
      "Preview: http://127.0.0.1:3000/websites-for-contractors?utm_source=preview&utm_campaign=contractor-test",
    );
  });
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--port",
      "3000",
      "--hostname",
      "127.0.0.1",
    ],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        SUPABASE_URL: testConfig.supabaseUrl,
        SUPABASE_SECRET_KEY: testConfig.supabaseKey,
        RESEND_API_KEY: testConfig.resendKey,
        LEAD_EMAIL_FROM: testConfig.from,
        LEAD_OWNER_EMAIL: testConfig.owner,
        LEAD_HASH_SECRET: testConfig.hashSecret,
        LEAD_DEV_MAIL_URL: "http://127.0.0.1:4317/emails",
        CRON_SECRET: "local-preview-only-cron-secret-32-chars",
      },
    },
  );
  child.on("exit", async (code) => {
    server.close();
    await fixture.db.close();
    process.exit(code ?? 0);
  });
  process.on("SIGINT", () => child.kill("SIGINT"));
}

void main();
