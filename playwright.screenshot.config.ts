import { defineConfig, devices } from "@playwright/test";

/**
 * Opt-in config for README screenshot capture.
 * Uses port 3002 so it never collides with `npm run dev` (:3000) or e2e (:3001).
 */
export default defineConfig({
  testDir: "./tests/screenshots",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3002",
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npm run build && npx next start --port 3002",
    url: "http://127.0.0.1:3002",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
