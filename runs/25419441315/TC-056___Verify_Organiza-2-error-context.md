# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-056 — Verify Organization Switch dropdown shows orgs
- Location: tests/nav.spec.ts:82:1

# Error details

```
Error: at least one org row should be listed

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic:
  - generic:
    - region "Notifications alt+T"
    - generic:
      - banner:
        - generic:
          - generic:
            - img
          - generic:
            - generic: /
            - generic:
              - button:
                - img
                - generic: XiTester
                - generic: Enterprise
              - button [expanded]:
                - img
            - generic: /
            - generic:
              - button:
                - img
                - generic: Default Project
              - button:
                - img
        - generic:
          - button:
            - img
            - generic: Search...
            - generic: ⌘K
          - generic:
            - button:
              - img
            - button:
              - img
          - generic:
            - generic: DEV
            - generic: v1.1.0
            - button: A
      - generic:
        - complementary:
          - navigation [ref=e1]:
            - button [ref=e2] [cursor=pointer]:
              - img [ref=e4]
            - button [ref=e9] [cursor=pointer]:
              - img [ref=e11]
            - button [ref=e14] [cursor=pointer]:
              - img [ref=e16]
            - button [ref=e20] [cursor=pointer]:
              - img [ref=e22]
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e31]
            - button [ref=e43] [cursor=pointer]:
              - img [ref=e45]
            - button [ref=e49] [cursor=pointer]:
              - img [ref=e51]
            - button [ref=e56] [cursor=pointer]:
              - img [ref=e58]
          - button [ref=e63] [cursor=pointer]:
            - img [ref=e65]
        - generic:
          - main:
            - generic: Loading charts...
  - menu [ref=e68]:
    - generic [ref=e69]:
      - img [ref=e70]
      - textbox "Find organization..." [active] [ref=e73]
    - generic [ref=e74]:
      - button "XiTester" [ref=e75] [cursor=pointer]:
        - generic [ref=e76]: XiTester
        - img [ref=e77]
      - button "API-Tester" [ref=e79] [cursor=pointer]:
        - generic [ref=e80]: API-Tester
      - button "Regression_Test_Success" [ref=e81] [cursor=pointer]:
        - generic [ref=e82]: Regression_Test_Success
    - button "All Organizations" [ref=e84] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | test.use({ storageState: '.auth/user.json' })
  5   | 
  6   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  7   | 
  8   | /**
  9   |  * Locator notes — verified against the actual SUT DOM.
  10  |  * --------------------------------------------------------------------
  11  |  * OrgBreadcrumb (TopBar.tsx ~line 184) and ProjectSwitcher
  12  |  * (ProjectSwitcher.tsx ~line 60) both render their dropdown as:
  13  |  *
  14  |  *   <button>{Org|Project name}</button>           ← navigate-only label
  15  |  *   <DropdownMenuTrigger asChild>
  16  |  *     <button> <ChevronsUpDown /> </button>       ← THIS is the trigger
  17  |  *   </DropdownMenuTrigger>
  18  |  *
  19  |  * Both triggers are tiny icon-only buttons whose only child is a
  20  |  * Lucide `ChevronsUpDown` SVG (rendered with class
  21  |  * `lucide-chevrons-up-down`).
  22  |  *
  23  |  * Org breadcrumb is the FIRST chevron in the topbar. Project switcher
  24  |  * is the SECOND, but is only mounted on project-scoped pages
  25  |  * (/dashboard, /api-tester, etc.). On org-level pages
  26  |  * (/organizations, /org/projects, /org/team) ProjectSwitcher is
  27  |  * intentionally omitted.
  28  |  *
  29  |  * Inside each popup, list items are plain <button> elements (NOT
  30  |  * role="menuitem"), so we scope to the popup container and select
  31  |  * by button text.
  32  |  */
  33  | 
  34  | const TOPBAR_CHEVRON = 'button:has(svg.lucide-chevrons-up-down):visible'
  35  | 
  36  | async function waitForTopbar(page: Page): Promise<void> {
  37  |     await page.locator('header').waitFor({ state: 'visible', timeout: 10_000 })
  38  |     // Memoised TopBar can briefly mount without children. Wait for at least
  39  |     // one chevron trigger before iterating.
  40  |     await page.locator(TOPBAR_CHEVRON).first().waitFor({ state: 'visible', timeout: 8_000 })
  41  | }
  42  | 
  43  | async function openOrgSwitcher(page: Page): Promise<void> {
  44  |     await waitForTopbar(page)
  45  |     await page.locator(TOPBAR_CHEVRON).first().click()
  46  |     await page
  47  |         .locator('input[placeholder="Find organization..."]')
  48  |         .waitFor({ state: 'visible', timeout: 6_000 })
  49  | }
  50  | 
  51  | async function openProjectSwitcher(page: Page): Promise<void> {
  52  |     await waitForTopbar(page)
  53  |     const triggers = page.locator(TOPBAR_CHEVRON)
  54  |     const count = await triggers.count()
  55  |     if (count < 2) {
  56  |         throw new Error(
  57  |             `Project switcher chevron not visible. Found ${count} chevron trigger(s) in the topbar. ` +
  58  |                 'The page must be a project-scoped route (e.g. /dashboard). On org-level pages ' +
  59  |                 '(/organizations, /org/projects, /org/team) ProjectSwitcher is intentionally omitted.',
  60  |         )
  61  |     }
  62  |     await triggers.last().click()
  63  |     await page
  64  |         .locator('input[placeholder="Find project..."]')
  65  |         .waitFor({ state: 'visible', timeout: 6_000 })
  66  | }
  67  | 
  68  | /** Open dropdown popup. Walk up from the visible "Find …" input to the
  69  |  *  Radix popover content root, so list-item assertions are scoped to
  70  |  *  the popup and don't accidentally match buttons in the underlying page.
  71  |  */
  72  | function popupContent(page: Page): Locator {
  73  |     return page
  74  |         .locator('input[placeholder^="Find"]')
  75  |         .locator('xpath=ancestor::div[contains(@class, "p-0")][1]')
  76  | }
  77  | 
  78  | // ============================================================
  79  | // Org switcher (TC-056..058)
  80  | // ============================================================
  81  | 
  82  | test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
  83  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  84  |     await page.goto('/dashboard')
  85  | 
  86  |     await openOrgSwitcher(page)
  87  |     const popup = popupContent(page)
  88  | 
  89  |     await expect(popup.locator('input[placeholder="Find organization..."]')).toBeVisible({
  90  |         timeout: 5_000,
  91  |     })
  92  |     const items = popup.locator('button').filter({ hasNotText: /^All Organizations$/ })
> 93  |     expect(await items.count(), 'at least one org row should be listed').toBeGreaterThan(0)
      |                                                                          ^ Error: at least one org row should be listed
  94  | })
  95  | 
  96  | test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
  97  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  98  |     await page.goto('/dashboard')
  99  | 
  100 |     await openOrgSwitcher(page)
  101 |     const popup = popupContent(page)
  102 |     const search = popup.locator('input[placeholder="Find organization..."]')
  103 |     await expect(search).toBeVisible({ timeout: 5_000 })
  104 | 
  105 |     await search.fill('XiTester')
  106 |     await expect(
  107 |         popup.locator('button', { hasText: /XiTester/i }).first(),
  108 |         '"XiTester" should remain visible when filtering by "XiTester"',
  109 |     ).toBeVisible({ timeout: 4_000 })
  110 | 
  111 |     await search.fill(`xt-nomatch-${Date.now()}`)
  112 |     // The SUT shows "No organizations found" for an empty filter (TopBar.tsx ~line 215).
  113 |     await expect(popup.getByText(/no organizations found/i)).toBeVisible({ timeout: 4_000 })
  114 | })
  115 | 
  116 | test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
  117 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  118 |     await page.goto('/dashboard')
  119 | 
  120 |     await openOrgSwitcher(page)
  121 |     const popup = popupContent(page)
  122 |     await popup.locator('button', { hasText: /^All Organizations$/ }).click()
  123 | 
  124 |     await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
  125 |     expect(page.url()).toMatch(/\/organizations\b/)
  126 | })
  127 | 
  128 | // ============================================================
  129 | // Project switcher (TC-059..062)
  130 | // ============================================================
  131 | 
  132 | test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
  133 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  134 |     await page.goto('/dashboard')
  135 | 
  136 |     // "All Projects" → /org/projects
  137 |     await openProjectSwitcher(page)
  138 |     let popup = popupContent(page)
  139 |     await popup.locator('button', { hasText: /^All Projects$/ }).click()
  140 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  141 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  142 | 
  143 |     // "New project" → /org/projects (the SUT opens its create dialog from there)
  144 |     await page.goto('/dashboard')
  145 |     await openProjectSwitcher(page)
  146 |     popup = popupContent(page)
  147 |     await popup.locator('button', { hasText: /^New project$/ }).click()
  148 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  149 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  150 | })
  151 | 
  152 | test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
  153 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  154 |     await page.goto('/dashboard')
  155 | 
  156 |     await openProjectSwitcher(page)
  157 |     const popup = popupContent(page)
  158 | 
  159 |     await expect(popup.locator('input[placeholder="Find project..."]')).toBeVisible({
  160 |         timeout: 5_000,
  161 |     })
  162 |     const items = popup
  163 |         .locator('button')
  164 |         .filter({ hasNotText: /^(All Projects|New project)$/ })
  165 |     expect(await items.count(), 'at least one project row should be listed').toBeGreaterThan(0)
  166 | })
  167 | 
  168 | test('TC-061 — Verify Project search inside dropdown', async ({ page }) => {
  169 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  170 |     await page.goto('/dashboard')
  171 | 
  172 |     await openProjectSwitcher(page)
  173 |     const popup = popupContent(page)
  174 |     const search = popup.locator('input[placeholder="Find project..."]')
  175 |     await expect(search).toBeVisible({ timeout: 5_000 })
  176 | 
  177 |     await search.fill('Default')
  178 |     await expect(
  179 |         popup.locator('button', { hasText: /Default Project/i }).first(),
  180 |     ).toBeVisible({ timeout: 4_000 })
  181 | 
  182 |     await search.fill(`xt-nomatch-${Date.now()}`)
  183 |     const items = popup
  184 |         .locator('button')
  185 |         .filter({ hasNotText: /^(All Projects|New project)$/ })
  186 |     await expect(items).toHaveCount(0, { timeout: 4_000 })
  187 | })
  188 | 
  189 | test('TC-062 — Verify Project search inside dropdown (clear restores list)', async ({ page }) => {
  190 |     // Per source data this row is identical to TC-061. Re-asserts from a
  191 |     // different angle — search → clear → all rows return.
  192 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  193 |     await page.goto('/dashboard')
```