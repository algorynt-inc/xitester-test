# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> E. Delete >> TC-ORG-006 — Delete an organization via danger zone
- Location: tests/orgs.spec.ts:312:5

# Error details

```
Error: createTempOrg 409: {"detail":"You can belong to at most 10 organizations."}
```

# Test source

```ts
  1   | import { test, expect, type APIRequestContext, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Every test in this file starts already authenticated, courtesy of the
  5   | // `setup` project (auth.setup.ts) which runs once per workflow execution
  6   | // and saves storageState to playwright/.auth/user.json. Zero login attempts
  7   | // in this spec — the orgs suite reuses the single workflow-wide login.
  8   | test.use({ storageState: 'playwright/.auth/user.json' })
  9   | 
  10  | const ORG_API = `${ENV.apiBase}/api/v1/organizations`
  11  | 
  12  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  13  | 
  14  | interface CreatedOrg {
  15  |     id: string
  16  |     name: string
  17  |     slug?: string
  18  | }
  19  | 
  20  | /**
  21  |  * IMPORTANT: API helpers receive `page.request`, NOT the worker-scoped
  22  |  * `request` fixture. The SUT uses HTTP-only auth cookies that live on
  23  |  * the page's context — `page.request` automatically sends them, while
  24  |  * the standalone `request` fixture would 401 because it has no cookies.
  25  |  */
  26  | async function createTempOrg(request: APIRequestContext, name: string): Promise<CreatedOrg> {
  27  |     const res = await request.post(ORG_API, {
  28  |         data: { name, description: 'Created by Playwright orgs.spec.ts' },
  29  |         failOnStatusCode: false,
  30  |     })
  31  |     if (res.status() === 403 || res.status() === 402) {
  32  |         throw new Error(`PLAN_BLOCKED:${res.status()}`)
  33  |     }
  34  |     if (!res.ok()) {
  35  |         const txt = await res.text().catch(() => '')
> 36  |         throw new Error(`createTempOrg ${res.status()}: ${txt}`)
      |               ^ Error: createTempOrg 409: {"detail":"You can belong to at most 10 organizations."}
  37  |     }
  38  |     const data = (await res.json()) as { id: string; name: string; slug?: string }
  39  |     return { id: data.id, name: data.name, slug: data.slug }
  40  | }
  41  | 
  42  | async function deleteCurrentOrg(request: APIRequestContext): Promise<void> {
  43  |     await request.delete(ORG_API, { failOnStatusCode: false })
  44  | }
  45  | 
  46  | async function gotoOrgSettings(page: Page, tab: 'general' | 'danger-zone' = 'general'): Promise<void> {
  47  |     await page.goto(`/org/settings/${tab}`)
  48  |     await page.waitForLoadState('domcontentloaded')
  49  | }
  50  | 
  51  | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  52  | 
  53  | // ============================================================
  54  | // A. Browse & Search
  55  | // ============================================================
  56  | 
  57  | test.describe('A. Browse & Search', () => {
  58  |     test('TC-ORG-001 — View organization list', async ({ page }) => {
  59  |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  60  | 
  61  |         await page.goto('/organizations')
  62  |         await expect(
  63  |             page.locator('input[placeholder="Search for an organization"]'),
  64  |             'org search input should be visible',
  65  |         ).toBeVisible({ timeout: 10_000 })
  66  | 
  67  |         const orgButtons = page
  68  |             .locator('main button')
  69  |             .filter({ hasNotText: 'New organization' })
  70  |         await expect(
  71  |             orgButtons.first(),
  72  |             'at least one org card should be visible',
  73  |         ).toBeVisible({ timeout: 10_000 })
  74  |     })
  75  | 
  76  |     test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
  77  |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  78  | 
  79  |         await page.goto('/organizations')
  80  |         const search = page.locator('input[placeholder="Search for an organization"]')
  81  |         await expect(search).toBeVisible({ timeout: 10_000 })
  82  | 
  83  |         const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
  84  |         const initialCount = await orgButtons.count()
  85  |         expect(initialCount, 'expected at least one org for search test').toBeGreaterThan(0)
  86  | 
  87  |         // Positive: searching for "XiTester" should leave the XiTester card visible.
  88  |         await search.fill('XiTester')
  89  |         await expect(
  90  |             page.locator('main button').filter({ hasText: /XiTester/i }).first(),
  91  |             '"XiTester" card should remain visible when filtering by "XiTester"',
  92  |         ).toBeVisible({ timeout: 4_000 })
  93  | 
  94  |         // Positive: searching for "API" should leave the API-Tester card visible.
  95  |         await search.fill('API')
  96  |         await expect(
  97  |             page.locator('main button').filter({ hasText: /API-?Tester/i }).first(),
  98  |             '"API-Tester" card should remain visible when filtering by "API"',
  99  |         ).toBeVisible({ timeout: 4_000 })
  100 | 
  101 |         // Negative: a string that matches no org should hide every card.
  102 |         const noMatch = `xt-nomatch-${ts()}`
  103 |         await search.fill(noMatch)
  104 |         await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
  105 | 
  106 |         // Clearing restores the full list.
  107 |         await search.fill('')
  108 |         await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
  109 |     })
  110 | })
  111 | 
  112 | // ============================================================
  113 | // B. View
  114 | // ============================================================
  115 | 
  116 | test.describe('B. View', () => {
  117 |     test('TC-ORG-003 — View organization settings', async ({ page }) => {
  118 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  119 | 
  120 |         await page.goto('/organizations')
  121 |         const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
  122 |         await orgButtons.first().click()
  123 | 
  124 |         await gotoOrgSettings(page, 'general')
  125 | 
  126 |         const orgName = page.locator('#orgName')
  127 |         const orgSlug = page.locator('#orgSlug')
  128 |         const orgDescription = page.locator('#orgDescription')
  129 | 
  130 |         await expect(orgName).toBeVisible({ timeout: 10_000 })
  131 |         await expect(orgSlug).toBeVisible()
  132 |         await expect(orgDescription).toBeVisible()
  133 | 
  134 |         await expect(orgName).not.toHaveValue('')
  135 |         await expect(orgSlug).not.toHaveValue('')
  136 |         await expect(orgSlug).toHaveAttribute('readonly', '')
```