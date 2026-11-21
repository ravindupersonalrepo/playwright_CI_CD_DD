import { defineConfig } from '@playwright/test';
import { environment } from '@utils/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: environment.isCi,
  retries: environment.isCi ? 2 : 0,
  workers: environment.isCi ? 1 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['monocart-reporter', { name: 'Automation Report', outputFile: 'monocart-report/index.html' }],
  ],
  use: {
    baseURL: environment.baseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: environment.ignoreHttpsErrors,
    viewport: { width: 1440, height: 900 },
  },
  outputDir: 'test-results/artifacts',
  projects: [
    {
      name: 'api',
      testMatch: /tests\\api\\.*\.spec\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /tests\\api\\.*\.spec\.ts/,
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      testIgnore: /tests\\api\\.*\.spec\.ts/,
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      testIgnore: /tests\\api\\.*\.spec\.ts/,
      use: { browserName: 'webkit' },
    },
  ],
});
