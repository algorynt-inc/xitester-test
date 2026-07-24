# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> TC-046 — Verify Active Suites count is visible
- Location: tests/dashboard.spec.ts:54:1

# Error details

```
Error: metric card "Active Suites" should render

expect(locator).toBeVisible() failed

Locator: locator('div').filter({ has: getByText('Active Suites', { exact: true }) }).filter({ has: locator('div, span') }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - metric card "Active Suites" should render with timeout 10000ms
  - waiting for locator('div').filter({ has: getByText('Active Suites', { exact: true }) }).filter({ has: locator('div, span') }).first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - status "Loading" [ref=e3]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Tests run one-at-a-time (config: `workers: 1`, `fullyParallel: false`), so they
  5   | // don't fight over the shared account. `default` mode (not `serial`) keeps tests
  6   | // independent: one failing test won't skip the rest.
  7   | test.describe.configure({ mode: 'default' })
  8   | test.use({ storageState: '.auth/user.json' })
  9   | 
  10  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  11  | 
  12  | async function gotoDashboard(page: Page, tab?: 'overview' | 'regression' | 'coverage'): Promise<void> {
  13  |     await page.goto('/dashboard')
  14  |     await page.waitForLoadState('domcontentloaded')
  15  |     if (tab && tab !== 'overview') {
  16  |         const label = tab === 'regression' ? 'Regression Test Result Charts' : 'Test Coverage'
  17  |         await page.locator('button', { hasText: label }).first().click()
  18  |     }
  19  | }
  20  | 
  21  | /**
  22  |  * Most "verify count is accurate" tests below can't truly verify accuracy
  23  |  * from the UI alone — they smoke-check that the metric is visible and
  24  |  * contains a numeric / non-empty value. Cross-check accuracy manually or
  25  |  * via API integration if needed.
  26  |  */
  27  | async function expectMetricCard(page: Page, title: string): Promise<void> {
  28  |     const card = page
  29  |         .locator('div', { has: page.getByText(title, { exact: true }) })
  30  |         .filter({ has: page.locator('div, span') })
  31  |         .first()
> 32  |     await expect(card, `metric card "${title}" should render`).toBeVisible({ timeout: 10_000 })
      |                                                                ^ Error: metric card "Active Suites" should render
  33  | }
  34  | 
  35  | // ============================================================
  36  | // Overview tab
  37  | // ============================================================
  38  | 
  39  | test('TC-044 — Verify Total Test Plan Runs display', async ({ page }) => {
  40  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  41  |     await gotoDashboard(page, 'overview')
  42  |     await expectMetricCard(page, 'Total Test Plan Runs')
  43  | })
  44  | 
  45  | test('TC-045 — Verify Pass Rate calculation display', async ({ page }) => {
  46  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  47  |     await gotoDashboard(page, 'overview')
  48  |     await expectMetricCard(page, 'Pass Rate')
  49  |     // Pass-rate value should look like a percentage or a numeric value.
  50  |     const passRateRegion = page.locator('div', { hasText: /Pass Rate/i }).first()
  51  |     await expect(passRateRegion).toContainText(/\d+(\.\d+)?\s*%?/, { timeout: 5_000 })
  52  | })
  53  | 
  54  | test('TC-046 — Verify Active Suites count is visible', async ({ page }) => {
  55  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  56  |     await gotoDashboard(page, 'overview')
  57  |     await expectMetricCard(page, 'Active Suites')
  58  |     // NOTE: full dynamic verification (count goes 0→1→0 around a run) needs
  59  |     // the test to also dispatch a test-plan run, which depends on seeded
  60  |     // plans + execution infra. Smoke-only here.
  61  | })
  62  | 
  63  | test('TC-047 — Verify Average Duration display', async ({ page }) => {
  64  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  65  |     await gotoDashboard(page, 'overview')
  66  |     await expectMetricCard(page, 'Avg. Duration')
  67  | })
  68  | 
  69  | test('TC-048 — Verify Test Plan Run Analysis display', async ({ page }) => {
  70  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  71  |     await gotoDashboard(page, 'overview')
  72  |     await expect(page.getByText('Test Plan Runs Analysis').first()).toBeVisible({ timeout: 20_000 })
  73  |     // Selector dropdown that scopes the chart to a chosen plan should render.
  74  |     await expect(page.locator('[aria-label="Select test plan"]').first()).toBeVisible({
  75  |         timeout: 5_000,
  76  |     })
  77  | })
  78  | 
  79  | test('TC-049 — Verify Top Active Test Plans (bar chart) display', async ({ page }) => {
  80  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  81  |     await gotoDashboard(page, 'overview')
  82  |     await expect(page.getByText('Top Active Test Plans').first()).toBeVisible({ timeout: 20_000 })
  83  | })
  84  | 
  85  | // ============================================================
  86  | // Regression Test Results Charts tab
  87  | // ============================================================
  88  | 
  89  | test('TC-050 — Verify Regression Pass Rate Trend chart', async ({ page }) => {
  90  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  91  |     await gotoDashboard(page, 'regression')
  92  |     await expect(page.getByText('Regression Pass Rate Trend').first()).toBeVisible({ timeout: 20_000 })
  93  | })
  94  | 
  95  | test('TC-051 — Verify Regression Defects Found chart', async ({ page }) => {
  96  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  97  |     await gotoDashboard(page, 'regression')
  98  |     await expect(page.getByText('Regression Defects Found').first()).toBeVisible({ timeout: 20_000 })
  99  | })
  100 | 
  101 | test('TC-052 — Verify Suite Breakdown chart', async ({ page }) => {
  102 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  103 |     await gotoDashboard(page, 'regression')
  104 |     await expect(page.getByText(/Suite Breakdown/i).first()).toBeVisible({ timeout: 20_000 })
  105 | })
  106 | 
  107 | // ============================================================
  108 | // Test Coverage tab
  109 | // ============================================================
  110 | 
  111 | test('TC-053 — Verify Overall System Health display', async ({ page }) => {
  112 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  113 |     await gotoDashboard(page, 'coverage')
  114 |     await expect(page.getByText('Overall System Health').first()).toBeVisible({ timeout: 20_000 })
  115 | })
  116 | 
  117 | test('TC-054 — Verify Module Quality Analysis display', async ({ page }) => {
  118 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  119 |     await gotoDashboard(page, 'coverage')
  120 |     await expect(page.getByText('Module Quality Analysis').first()).toBeVisible({ timeout: 20_000 })
  121 | })
  122 | 
  123 | test('TC-055 — Verify System Hotspots display', async ({ page }) => {
  124 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  125 |     await gotoDashboard(page, 'coverage')
  126 |     await expect(page.getByText('System Hotspots').first()).toBeVisible({ timeout: 20_000 })
  127 | })
  128 | 
```