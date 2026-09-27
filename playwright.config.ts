import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4173/class-scheduler/";

const { CI } = process.env;

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: !!CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: baseURL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run preview",
    url: baseURL,
    reuseExistingServer: !CI,
  },
});
