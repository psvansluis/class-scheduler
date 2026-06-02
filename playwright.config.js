import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173/class-scheduler/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Tell Playwright to spin up your local Vite development server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/class-scheduler/",
    reuseExistingServer: !process.env.CI,
  },
});
