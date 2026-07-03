// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright configuration for EgoTECH e2e tests.
 * The Express static server (server.js) must be running on port 3000.
 * `webServer` starts it automatically before the test run.
 */
module.exports = defineConfig({
  // Location of e2e test files
  testDir: './tests/e2e',

  // Match only .spec.js files
  testMatch: '**/*.spec.js',

  // Max 30 s per test
  timeout: 30_000,

  // Retry once on CI to handle flaky timing
  retries: process.env.CI ? 1 : 0,

  // Parallelism — run tests in parallel within each file
  fullyParallel: false,

  // Reporter: show each test + summary
  reporter: [['list'], ['html', { outputFolder: 'tests/playwright-report', open: 'never' }]],

  use: {
    // Base URL — all page.goto('/path') calls are relative to this
    baseURL: 'http://localhost:3000',

    // Capture a screenshot on failure
    screenshot: 'only-on-failure',

    // Record traces on first retry
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start the static file server before running tests and stop after
  webServer: {
    command: 'node server.js',
    url:     'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
