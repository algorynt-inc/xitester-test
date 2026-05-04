# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> A. Browse & Search >> TC-ORG-001 — View organization list
- Location: tests/orgs.spec.ts:58:5

# Error details

```
Error: at least one org card should be visible

expect(locator).toBeVisible() failed

Locator: locator('main button').filter({ hasNotText: 'New organization' }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - at least one org card should be visible with timeout 10000ms
  - waiting for locator('main button').filter({ hasNotText: 'New organization' }).first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img "Xitester" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: /
          - generic [ref=e10]: Organizations
      - generic [ref=e11]:
        - button "Search... ⌘K" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e16]: Search...
          - generic [ref=e17]: ⌘K
        - generic [ref=e18]:
          - button "Help" [ref=e19] [cursor=pointer]:
            - img [ref=e20]
          - button "Notifications" [ref=e23] [cursor=pointer]:
            - img [ref=e24]
            - generic [ref=e27]: 99+
        - generic [ref=e29]:
          - generic [ref=e30]: DEV
          - generic [ref=e31]: v1.1.0
          - button "A" [ref=e32] [cursor=pointer]
    - generic [ref=e34]:
      - heading "Your Organizations" [level=1] [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - img [ref=e38]
          - textbox "Search for an organization" [ref=e41]
        - separator [ref=e42]
        - button "Sort Name" [ref=e43] [cursor=pointer]:
          - img [ref=e44]
          - text: Sort
          - separator [ref=e46]
          - generic [ref=e48]: Name
        - generic [ref=e49]:
          - generic [ref=e50]:
            - button [ref=e51] [cursor=pointer]:
              - img [ref=e52]
            - button [ref=e57] [cursor=pointer]:
              - img [ref=e58]
          - generic [ref=e59]:
            - button "New organization" [disabled]:
              - img
              - text: New organization
      - generic [ref=e61]:
        - button "API-Tester Enterprise Plan · 1 project" [ref=e62] [cursor=pointer]:
          - generic [ref=e63]:
            - img [ref=e64]
            - generic [ref=e68]:
              - generic [ref=e69]: API-Tester
              - generic [ref=e70]: Enterprise Plan · 1 project
        - button "Regression_Test_Success Enterprise Plan · 5 projects" [ref=e71] [cursor=pointer]:
          - generic [ref=e72]:
            - img [ref=e73]
            - generic [ref=e77]:
              - generic [ref=e78]: Regression_Test_Success
              - generic [ref=e79]: Enterprise Plan · 5 projects
        - button "XiTester Enterprise Plan · 2 projects" [ref=e80] [cursor=pointer]:
          - generic [ref=e81]:
            - img [ref=e82]
            - generic [ref=e86]:
              - generic [ref=e87]: XiTester
              - generic [ref=e88]: Enterprise Plan · 2 projects
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
  36  |         throw new Error(`createTempOrg ${res.status()}: ${txt}`)
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
> 73  |         ).toBeVisible({ timeout: 10_000 })
      |           ^ Error: at least one org card should be visible
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
  87  |         const noMatch = `xt-nomatch-${ts()}`
  88  |         await search.fill(noMatch)
  89  |         await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
  90  | 
  91  |         await search.fill('')
  92  |         await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
  93  |     })
  94  | })
  95  | 
  96  | // ============================================================
  97  | // B. View
  98  | // ============================================================
  99  | 
  100 | test.describe('B. View', () => {
  101 |     test('TC-ORG-003 — View organization settings', async ({ page }) => {
  102 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  103 | 
  104 |         await page.goto('/organizations')
  105 |         const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
  106 |         await orgButtons.first().click()
  107 | 
  108 |         await gotoOrgSettings(page, 'general')
  109 | 
  110 |         const orgName = page.locator('#orgName')
  111 |         const orgSlug = page.locator('#orgSlug')
  112 |         const orgDescription = page.locator('#orgDescription')
  113 | 
  114 |         await expect(orgName).toBeVisible({ timeout: 10_000 })
  115 |         await expect(orgSlug).toBeVisible()
  116 |         await expect(orgDescription).toBeVisible()
  117 | 
  118 |         await expect(orgName).not.toHaveValue('')
  119 |         await expect(orgSlug).not.toHaveValue('')
  120 |         await expect(orgSlug).toHaveAttribute('readonly', '')
  121 |     })
  122 | })
  123 | 
  124 | // ============================================================
  125 | // C. Create
  126 | // ============================================================
  127 | 
  128 | test.describe('C. Create', () => {
  129 |     let createdOrgId: string | null = null
  130 |     let pageRef: Page | null = null
  131 | 
  132 |     test.afterEach(async () => {
  133 |         if (createdOrgId && pageRef) {
  134 |             try {
  135 |                 // Use the page's request context so the auth cookie is sent.
  136 |                 await deleteCurrentOrg(pageRef.request)
  137 |             } catch {
  138 |                 /* swallow cleanup errors so they don't mask the test failure */
  139 |             }
  140 |             createdOrgId = null
  141 |             pageRef = null
  142 |         }
  143 |     })
  144 | 
  145 |     test('TC-ORG-004 — Create a new organization', async ({ page }) => {
  146 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  147 |         pageRef = page
  148 | 
  149 |         await page.goto('/organizations')
  150 |         const newBtn = page.locator('button', { hasText: 'New organization' }).first()
  151 |         await expect(newBtn).toBeVisible({ timeout: 10_000 })
  152 | 
  153 |         const enabled = await newBtn.isEnabled()
  154 |         test.skip(!enabled, 'Create button is disabled — likely a plan-tier restriction.')
  155 | 
  156 |         await newBtn.click()
  157 |         const nameInput = page.locator('#orgName')
  158 |         const descInput = page.locator('#orgDesc')
  159 |         await expect(nameInput).toBeVisible({ timeout: 5_000 })
  160 | 
  161 |         const tempName = `qa-tmp-${ts()}`
  162 |         await nameInput.fill(tempName)
  163 |         await descInput.fill('Created by Playwright TC-ORG-004')
  164 | 
  165 |         const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
  166 |         const [response] = await Promise.all([
  167 |             page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
  168 |             submit.click(),
  169 |         ])
  170 |         expect([200, 201]).toContain(response.status())
  171 | 
  172 |         try {
  173 |             const body = (await response.json()) as { id?: string }
```