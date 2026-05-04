import { defineConfig, devices } from '@playwright/test'
import { ENV } from './env'

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
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
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
        },
        {
            name: 'mobile-chromium',
            grep: /@mobile/,
            use: { ...devices['Pixel 7'], viewport: { width: 375, height: 812 } },
        },
    ],
})
