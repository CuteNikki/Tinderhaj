import { defineConfig, devices } from '@playwright/test';

import { BASE_URL, MAIL_URL, PORT, databaseURL } from './e2e/env';

/**
 * End-to-end tests against a production build: `bun run build` first, then
 * `bun run test:e2e`. They make accounts, so they need a database of their
 * own in E2E_DATABASE_URL, never the one in .env.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `bunx next start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // Set here, so they win over the ones in .env.
    env: {
      DATABASE_URL: databaseURL(),
      BETTER_AUTH_URL: BASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? 'e2e-only-secret-e2e-only-secret-0123456789',
      // Emails go to a stand-in from global-setup.ts, not to Resend.
      RESEND_API_KEY: 're_e2e',
      RESEND_BASE_URL: MAIL_URL,
    },
  },
});
