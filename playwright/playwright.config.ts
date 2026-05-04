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
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
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
