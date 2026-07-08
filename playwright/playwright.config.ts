import { defineConfig, devices } from '@playwright/test'
import { ENV } from './env'

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    // Lower CI retries (2 → 1) so flaky login-form tests don't retry their
    // wrong-password attempts twice and burn the SUT's
    // LOGIN_RATE_LIMIT_MAX_ATTEMPTS=10/300s budget.
    retries: process.env.CI ? 1 : 0,
    // Single worker so all tests run sequentially (one at a time).
    workers: 1,
    reporter: [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['list'],
        ['./reporter/json-result-reporter.ts', { outputFile: '.results/run.json' }],
    ],

    use: {
        baseURL: ENV.baseURL,
        // Capture for EVERY test (passed + failed) so the dashboard can offer
        // playback regardless of outcome. Trace files are gzipped; video uses
        // a smaller capture frame to keep per-run storage reasonable.
        trace: 'on',
        video: { mode: 'on', size: { width: 1024, height: 576 } },
        // Screenshots remain failure-only — they're per-action and noisy
        // on green runs; the video covers the visual story for passed tests.
        screenshot: 'only-on-failure',
        actionTimeout: 10_000,
        navigationTimeout: 15_000,
    },

    projects: [
        // One-time UI login per workflow run. Saves storageState to
        // playwright/.auth/user.json so authenticated specs can opt in via
        // `test.use({ storageState: '...' })` instead of re-logging.
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
            // Don't retry login attempts — we want to fail fast and surface
            // the error rather than burn rate-limit budget.
            retries: 0,
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
            dependencies: ['setup'],
        },
        {
            name: 'mobile-chromium',
            grep: /@mobile/,
            use: { ...devices['Pixel 7'], viewport: { width: 375, height: 812 } },
            dependencies: ['setup'],
        },
    ],
})
