import { ConfigurationError, databaseRpc } from "./server";

export async function configureLeadEmailRetries(
  env: NodeJS.ProcessEnv = process.env,
  rpc = databaseRpc,
) {
  const supabaseUrl = env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const supabaseKey = env.SUPABASE_SECRET_KEY?.trim();
  const token = env.CRON_SECRET;
  if (!supabaseUrl || !URL.canParse(supabaseUrl) || new URL(supabaseUrl).protocol !== "https:")
    throw new ConfigurationError("SUPABASE_URL");
  if (!supabaseKey) throw new ConfigurationError("SUPABASE_SECRET_KEY");
  // Match the HTTP header exactly; do not silently trim a misconfigured secret.
  if (!token || token.length < 32 || token.length > 512 || /[^!-~]/.test(token))
    throw new ConfigurationError("CRON_SECRET");
  const result = await rpc<{ configured: boolean; changed: boolean }>(
    { supabaseUrl, supabaseKey },
    "configure_lead_email_retries",
    { p_url: "https://www.kredance.com/api/leads/retry", p_token: token },
  );
  if (result.configured !== true || typeof result.changed !== "boolean")
    throw new Error("retry_setup_unconfirmed");
  return { configured: true, changed: result.changed };
}
