import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
//require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  //globalSetup: require.resolve('./storageState.json'),
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 50 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    toMatchSnapshot: { threshold: 0.1, maxDiffPixelRatio: 0.0007},
    timeout: 5000
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  //forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  retries: 1,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    viewport: { width: 1366, height: 800 },
    //channel: 'chrome',
    //browserName: 'chromium',
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    baseURL: 'http://localhost:3000/transfers/online/',
    locale: 'ru-RU',
    trace: 'on',
   //video: 'on-first-retry',
    launchOptions: {
      // force GPU hardware acceleration
      // (even in headless mode)
      // slowMo: 100,
      // devtools: true
      //args: ["--use-gl=egl"]
    },
   // storageState: 'storageState.json'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: { width: 1366, height: 800 },
        ...devices['Desktop Chrome'],
      }
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     viewport: { width: 1366, height: 800 },
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: {
    //     viewport: { width: 1366, height: 800 },
    //     ...devices['Desktop Safari'],
    //   },
    // }
    ]

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  // ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
