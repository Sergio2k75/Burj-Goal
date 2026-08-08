import { defineConfig, devices } from "@playwright/test";

/**
 * Opt-in config for README screenshot capture.
 * Uses port 3001 so a local `next dev` on 3000 is never reused
 * (dev hydration can leave seeded localStorage unread until interaction).
 */
export default defineConfig({
  testDir: "./tests/screenshots",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3001",
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npm run build && npx next start --port 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
