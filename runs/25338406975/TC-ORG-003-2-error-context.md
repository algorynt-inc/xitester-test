# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> B. View >> TC-ORG-003 — View organization settings
- Location: tests/orgs.spec.ts:117:5

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
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
        - button "qa-del-20260504185310 Free Plan · 0 projects" [ref=e71] [cursor=pointer]:
          - generic [ref=e72]:
            - img [ref=e73]
            - generic [ref=e77]:
              - generic [ref=e78]: qa-del-20260504185310
              - generic [ref=e79]: Free Plan · 0 projects
        - button "qa-del-20260504185321 Free Plan · 0 projects" [ref=e80] [cursor=pointer]:
          - generic [ref=e81]:
            - img [ref=e82]
            - generic [ref=e86]:
              - generic [ref=e87]: qa-del-20260504185321
              - generic [ref=e88]: Free Plan · 0 projects
        - button "qa-del-20260504190531 Free Plan · 0 projects" [ref=e89] [cursor=pointer]:
          - generic [ref=e90]:
            - img [ref=e91]
            - generic [ref=e95]:
              - generic [ref=e96]: qa-del-20260504190531
              - generic [ref=e97]: Free Plan · 0 projects
        - button "qa-dup-20260504185303 Free Plan · 0 projects" [ref=e98] [cursor=pointer]:
          - generic [ref=e99]:
            - img [ref=e100]
            - generic [ref=e104]:
              - generic [ref=e105]: qa-dup-20260504185303
              - generic [ref=e106]: Free Plan · 0 projects
        - button "qa-dup-20260504190525 Free Plan · 0 projects" [ref=e107] [cursor=pointer]:
          - generic [ref=e108]:
            - img [ref=e109]
            - generic [ref=e113]:
              - generic [ref=e114]: qa-dup-20260504190525
              - generic [ref=e115]: Free Plan · 0 projects
        - button "qa-renamed-20260504190531 Enterprise Plan · 2 projects" [ref=e116] [cursor=pointer]:
          - generic [ref=e117]:
            - img [ref=e118]
            - generic [ref=e122]:
              - generic [ref=e123]: qa-renamed-20260504190531
              - generic [ref=e124]: Enterprise Plan · 2 projects
        - button "qa-tmp-20260504185303 Free Plan · 0 projects" [ref=e125] [cursor=pointer]:
          - generic [ref=e126]:
            - img [ref=e127]
            - generic [ref=e131]:
              - generic [ref=e132]: qa-tmp-20260504185303
              - generic [ref=e133]: Free Plan · 0 projects
        - button "qa-tmp-20260504190526 Free Plan · 0 projects" [ref=e134] [cursor=pointer]:
          - generic [ref=e135]:
            - img [ref=e136]
            - generic [ref=e140]:
              - generic [ref=e141]: qa-tmp-20260504190526
              - generic [ref=e142]: Free Plan · 0 projects
        - button "Regression_Test_Success Enterprise Plan · 5 projects" [ref=e143] [cursor=pointer]:
          - generic [ref=e144]:
            - img [ref=e145]
            - generic [ref=e149]:
              - generic [ref=e150]: Regression_Test_Success
              - generic [ref=e151]: Enterprise Plan · 5 projects
```

# Test source

```ts
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
> 122 |         await orgButtons.first().click()
      |                                  ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
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
  186 |         expect([200, 201]).toContain(response.status())
  187 | 
  188 |         try {
  189 |             const body = (await response.json()) as { id?: string }
  190 |             createdOrgId = body.id ?? null
  191 |         } catch {
  192 |             /* ignore */
  193 |         }
  194 | 
  195 |         // Modal should close and the new org name should be visible somewhere on the page.
  196 |         await expect(nameInput).toBeHidden({ timeout: 5_000 })
  197 |         await expect(page.getByText(tempName)).toBeVisible({ timeout: 8_000 })
  198 |     })
  199 | 
  200 |     test('TC-ORG-007 — Create rejects duplicate name', async ({ page }) => {
  201 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  202 |         pageRef = page
  203 | 
  204 |         // Seed: create the first org via the SAME context so auth cookies flow.
  205 |         const sharedName = `qa-dup-${ts()}`
  206 |         let temp: CreatedOrg
  207 |         try {
  208 |             temp = await createTempOrg(page.request, sharedName)
  209 |         } catch (err) {
  210 |             if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
  211 |                 test.skip(true, 'Org creation blocked by plan tier — cannot test duplicate-name without a seed.')
  212 |                 return
  213 |             }
  214 |             throw err
  215 |         }
  216 |         createdOrgId = temp.id
  217 | 
  218 |         await page.goto('/organizations')
  219 |         const newBtn = page.locator('button', { hasText: 'New organization' }).first()
  220 |         await expect(newBtn).toBeVisible({ timeout: 10_000 })
  221 |         const enabled = await newBtn.isEnabled()
  222 |         test.skip(!enabled, 'Create button disabled (plan tier).')
```