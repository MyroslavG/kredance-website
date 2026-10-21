export async function register() {
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.VERCEL_ENV !== "production" ||
    process.env.LEAD_RETRY_SETUP_ENABLED !== "1" ||
    process.env.NEXT_PHASE === "phase-production-build"
  ) return;

  const { configureLeadEmailRetries } = await import("./lib/leads/retry-setup");
  try {
    const result = await configureLeadEmailRetries();
    if (result.changed) console.info("lead_retry_setup_configured");
  } catch {
    // Keep the website available; operators verify Cron + HTTP after deployment.
    // Neither credentials nor provider errors may enter application logs.
    console.error("lead_retry_setup_failed");
  }
}
