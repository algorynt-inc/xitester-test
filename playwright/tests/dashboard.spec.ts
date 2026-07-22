import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

// Tests run one-at-a-time (config: `workers: 1`, `fullyParallel: false`), so they
// don't fight over the shared account. `default` mode (not `serial`) keeps tests
// independent: one failing test won't skip the rest.
test.describe.configure({ mode: 'default' })
test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

async function gotoDashboard(page: Page, tab?: 'overview' | 'regression' | 'coverage'): Promise<void> {
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')
    if (tab && tab !== 'overview') {
        const label = tab === 'regression' ? 'Regression Test Result Charts' : 'Test Coverage'
        await page.locator('button', { hasText: label }).first().click()
    }
}

/**
 * Most "verify count is accurate" tests below can't truly verify accuracy
 * from the UI alone — they smoke-check that the metric is visible and
 * contains a numeric / non-empty value. Cross-check accuracy manually or
 * via API integration if needed.
 */
async function expectMetricCard(page: Page, title: string): Promise<void> {
    const card = page
        .locator('div', { has: page.getByText(title, { exact: true }) })
        .filter({ has: page.locator('div, span') })
        .first()
    await expect(card, `metric card "${title}" should render`).toBeVisible({ timeout: 10_000 })
}

// ============================================================
// Overview tab
// ============================================================

test('TC-044 — Verify Total Test Plan Runs display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expectMetricCard(page, 'Total Test Plan Runs')
})

test('TC-045 — Verify Pass Rate calculation display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expectMetricCard(page, 'Pass Rate')
    // Pass-rate value should look like a percentage or a numeric value.
    const passRateRegion = page.locator('div', { hasText: /Pass Rate/i }).first()
    await expect(passRateRegion).toContainText(/\d+(\.\d+)?\s*%?/, { timeout: 5_000 })
})

test('TC-046 — Verify Active Suites count is visible', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expectMetricCard(page, 'Active Suites')
    // NOTE: full dynamic verification (count goes 0→1→0 around a run) needs
    // the test to also dispatch a test-plan run, which depends on seeded
    // plans + execution infra. Smoke-only here.
})

test('TC-047 — Verify Average Duration display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expectMetricCard(page, 'Avg. Duration')
})

test('TC-048 — Verify Test Plan Run Analysis display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expect(page.getByText('Test Plan Runs Analysis').first()).toBeVisible({ timeout: 20_000 })
    // Selector dropdown that scopes the chart to a chosen plan should render.
    await expect(page.locator('[aria-label="Select test plan"]').first()).toBeVisible({
        timeout: 5_000,
    })
})

test('TC-049 — Verify Top Active Test Plans (bar chart) display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'overview')
    await expect(page.getByText('Top Active Test Plans').first()).toBeVisible({ timeout: 20_000 })
})

// ============================================================
// Regression Test Results Charts tab
// ============================================================

test('TC-050 — Verify Regression Pass Rate Trend chart', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'regression')
    await expect(page.getByText('Regression Pass Rate Trend').first()).toBeVisible({ timeout: 20_000 })
})

test('TC-051 — Verify Regression Defects Found chart', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'regression')
    await expect(page.getByText('Regression Defects Found').first()).toBeVisible({ timeout: 20_000 })
})

test('TC-052 — Verify Suite Breakdown chart', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'regression')
    await expect(page.getByText(/Suite Breakdown/i).first()).toBeVisible({ timeout: 20_000 })
})

// ============================================================
// Test Coverage tab
// ============================================================

test('TC-053 — Verify Overall System Health display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'coverage')
    await expect(page.getByText('Overall System Health').first()).toBeVisible({ timeout: 20_000 })
})

test('TC-054 — Verify Module Quality Analysis display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'coverage')
    await expect(page.getByText('Module Quality Analysis').first()).toBeVisible({ timeout: 20_000 })
})

test('TC-055 — Verify System Hotspots display', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await gotoDashboard(page, 'coverage')
    await expect(page.getByText('System Hotspots').first()).toBeVisible({ timeout: 20_000 })
})
