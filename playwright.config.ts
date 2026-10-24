import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  forbidOnly: !!process.env.CI, retries: 0, timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "node --import tsx scripts/preview-leads.ts",
    url: "http://127.0.0.1:3000/dashboard", reuseExistingServer: false,
    timeout: 120_000, env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
