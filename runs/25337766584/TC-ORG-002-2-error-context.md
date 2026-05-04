# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> A. Browse & Search >> TC-ORG-002 — Search filters the org list
- Location: tests/orgs.spec.ts:76:5

# Error details

```
Error: expected at least one org for search test

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
        - generic [ref=e28]:
          - generic [ref=e29]: DEV
          - generic [ref=e30]: v1.1.0
          - button "A" [ref=e31] [cursor=pointer]
    - generic [ref=e33]:
      - heading "Your Organizations" [level=1] [ref=e34]
      - generic [ref=e35]:
        - generic [ref=e36]:
          - img [ref=e37]
          - textbox "Search for an organization" [ref=e40]
        - separator [ref=e41]
        - button "Sort Name" [ref=e42] [cursor=pointer]:
          - img [ref=e43]
          - text: Sort
          - separator [ref=e45]
          - generic [ref=e47]: Name
        - generic [ref=e48]:
          - generic [ref=e49]:
            - button [ref=e50] [cursor=pointer]:
              - img [ref=e51]
            - button [ref=e56] [cursor=pointer]:
              - img [ref=e57]
          - generic [ref=e58]:
            - button "New organization" [disabled]:
              - img
              - text: New organization
      - generic [ref=e60]:
        - button "API-Tester Enterprise Plan · 1 project" [ref=e61] [cursor=pointer]:
          - generic [ref=e62]:
            - img [ref=e63]
            - generic [ref=e67]:
              - generic [ref=e68]: API-Tester
              - generic [ref=e69]: Enterprise Plan · 1 project
        - button "qa-del-20260504185310 Free Plan · 0 projects" [ref=e70] [cursor=pointer]:
          - generic [ref=e71]:
            - img [ref=e72]
            - generic [ref=e76]:
              - generic [ref=e77]: qa-del-20260504185310
              - generic [ref=e78]: Free Plan · 0 projects
        - button "qa-del-20260504185321 Free Plan · 0 projects" [ref=e79] [cursor=pointer]:
          - generic [ref=e80]:
            - img [ref=e81]
            - generic [ref=e85]:
              - generic [ref=e86]: qa-del-20260504185321
              - generic [ref=e87]: Free Plan · 0 projects
        - button "qa-dup-20260504185303 Free Plan · 0 projects" [ref=e88] [cursor=pointer]:
          - generic [ref=e89]:
            - img [ref=e90]
            - generic [ref=e94]:
              - generic [ref=e95]: qa-dup-20260504185303
              - generic [ref=e96]: Free Plan · 0 projects
        - button "qa-renamed-20260504185309 Enterprise Plan · 2 projects" [ref=e97] [cursor=pointer]:
          - generic [ref=e98]:
            - img [ref=e99]
            - generic [ref=e103]:
              - generic [ref=e104]: qa-renamed-20260504185309
              - generic [ref=e105]: Enterprise Plan · 2 projects
        - button "qa-tmp-20260504185303 Free Plan · 0 projects" [ref=e106] [cursor=pointer]:
          - generic [ref=e107]:
            - img [ref=e108]
            - generic [ref=e112]:
              - generic [ref=e113]: qa-tmp-20260504185303
              - generic [ref=e114]: Free Plan · 0 projects
        - button "Regression_Test_Success Enterprise Plan · 5 projects" [ref=e115] [cursor=pointer]:
          - generic [ref=e116]:
            - img [ref=e117]
            - generic [ref=e121]:
              - generic [ref=e122]: Regression_Test_Success
              - generic [ref=e123]: Enterprise Plan · 5 projects
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
> 85  |         expect(initialCount, 'expected at least one org for search test').toBeGreaterThan(0)
      |                                                                           ^ Error: expected at least one org for search test
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
  137 |     })
  138 | })
  139 | 
  140 | // ============================================================
  141 | // C. Create
  142 | // ============================================================
  143 | 
  144 | test.describe('C. Create', () => {
  145 |     let createdOrgId: string | null = null
  146 |     let pageRef: Page | null = null
  147 | 
  148 |     test.afterEach(async () => {
  149 |         if (createdOrgId && pageRef) {
  150 |             try {
  151 |                 // Use the page's request context so the auth cookie is sent.
  152 |                 await deleteCurrentOrg(pageRef.request)
  153 |             } catch {
  154 |                 /* swallow cleanup errors so they don't mask the test failure */
  155 |             }
  156 |             createdOrgId = null
  157 |             pageRef = null
  158 |         }
  159 |     })
  160 | 
  161 |     test('TC-ORG-004 — Create a new organization', async ({ page }) => {
  162 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  163 |         pageRef = page
  164 | 
  165 |         await page.goto('/organizations')
  166 |         const newBtn = page.locator('button', { hasText: 'New organization' }).first()
  167 |         await expect(newBtn).toBeVisible({ timeout: 10_000 })
  168 | 
  169 |         const enabled = await newBtn.isEnabled()
  170 |         test.skip(!enabled, 'Create button is disabled — likely a plan-tier restriction.')
  171 | 
  172 |         await newBtn.click()
  173 |         const nameInput = page.locator('#orgName')
  174 |         const descInput = page.locator('#orgDesc')
  175 |         await expect(nameInput).toBeVisible({ timeout: 5_000 })
  176 | 
  177 |         const tempName = `qa-tmp-${ts()}`
  178 |         await nameInput.fill(tempName)
  179 |         await descInput.fill('Created by Playwright TC-ORG-004')
  180 | 
  181 |         const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
  182 |         const [response] = await Promise.all([
  183 |             page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
  184 |             submit.click(),
  185 |         ])
```