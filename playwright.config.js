import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
  },

  // PW_CHANNEL lets you use a browser you already have: "chrome" or "msedge".
  // Leave it unset to use Playwright's own Chromium.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.PW_CHANNEL || undefined },
    },
  ],

  // Playwright starts the FULL stack (frontend + backend + database) before the tests.
  // If the stack is already running on port 5173, it is reused.
  webServer: {
    command: "docker compose up --build",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
