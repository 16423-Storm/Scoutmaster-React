import { defineConfig, devices } from "@playwright/test";

const hasE2ECredentials = Boolean(
    process.env.E2E_EMAIL && process.env.E2E_PASSWORD,
);

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "html",
    use: {
        baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:5173",
        trace: "on-first-retry",
    },
    webServer: process.env.E2E_BASE_URL || !hasE2ECredentials
        ? undefined
        : {
              command: "npm run dev -- --host 127.0.0.1",
              url: "http://127.0.0.1:5173",
              reuseExistingServer: !process.env.CI,
          },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
