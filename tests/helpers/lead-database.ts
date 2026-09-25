import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import { StorageError, type LeadConfig } from "../../src/lib/leads/server";

export async function createLeadDatabase() {
  const db = await PGlite.create();
  await db.exec(
    "create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to service_role, anon, authenticated;",
  );
  const migrations = new URL("../../supabase/migrations/", import.meta.url);
  const files = (await readdir(migrations))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const file of files) {
    await db.exec(await readFile(new URL(file, migrations), "utf8"));
  }
  async function rpc<T>(
    _config: LeadConfig,
    name: string,
    raw: unknown,
  ): Promise<T> {
    const body = raw as Record<string, unknown>;
    try {
      // Fixed SQL only: this helper never interpolates incoming RPC names/arguments.
      if (name === "accept_website_lead") {
        const result = await db.query<{ result: T }>(
          "select public.accept_website_lead($1::uuid, $2, $3, $4::jsonb, $5::jsonb) as result",
          [
            body.p_submission_id,
            body.p_payload_hash,
            body.p_ip_hash,
            JSON.stringify(body.p_lead),
            JSON.stringify(body.p_emails),
          ],
        );
        return result.rows[0].result;
      }
      if (name === "claim_lead_emails") {
        const result = await db.query(
          "select * from public.claim_lead_emails($1::uuid, $2::integer)",
          [body.p_lead_id, body.p_limit],
        );
        return result.rows as T;
      }
      if (name === "finish_lead_email") {
        const result = await db.query<{ result: T }>(
          "select public.finish_lead_email($1::uuid, $2::uuid, $3, $4) as result",
          [body.p_id, body.p_lease_token, body.p_provider_id, body.p_error],
        );
        return result.rows[0].result;
      }
      if (name === "record_funnel_event") {
        const result = await db.query<{ result: T }>(
          "select public.record_funnel_event($1::uuid, $2, $3, $4) as result",
          [body.p_id, body.p_event_name, body.p_location, body.p_ip_hash],
        );
        return result.rows[0].result;
      }
      throw new Error("Unknown test RPC");
    } catch (error) {
      if (
        error instanceof Error &&
        ["rate_limited", "submission_conflict"].includes(error.message)
      )
        throw new StorageError(error.message, 400);
      throw error;
    }
  }
  return { db, rpc };
}

export const testConfig: LeadConfig = {
  supabaseUrl: "http://127.0.0.1:4317",
  supabaseKey: "local-test-key",
  emailjsServiceId: "service_local_test",
  emailjsPublicKey: "public-local-test-key",
  emailjsPrivateKey: "private-local-test-key",
  emailjsOwnerTemplateId: "template_owner_test",
  hashSecret: "test-only-secret-32-characters-minimum",
};
