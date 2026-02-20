import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory where test files are located
  testDir: './src/tests',

  // Run tests sequentially to avoid rate-limiting on the live site
  fullyParallel: false,

  // Fail the build on CI if test.only is left in source
  forbidOnly: !!process.env.CI,

  // Retry once on failure (network hiccups on live site)
  retries: 1,

  // Single worker to avoid hammering the live site
  workers: 1,

  // Reporter configuration: HTML for detailed report + list for console output
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // Base URL – all page.goto('/') calls are relative to this
    baseURL: 'https://www.imdb.com',

    // Collect trace on first retry to help debug flaky tests
    trace: 'on-first-retry',

    // Screenshot on failure for debugging
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // Standard desktop viewport
    viewport: { width: 1280, height: 720 },

    // Generous timeouts for a real-world, JavaScript-heavy site
    navigationTimeout: 30_000,
    actionTimeout: 15_000,

    // Realistic browser headers to reduce bot-detection false positives
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true' ? true : false,
        launchOptions: {
          args: [           
            '--disable-infobars',
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      },
    },
  ],

  outputDir: 'test-results',
});
