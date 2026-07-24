# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-057 — Verify Organization search inside dropdown
- Location: tests/nav.spec.ts:126:1

# Error details

```
Error: "XiTester Automation" should remain visible when filtering by "XiTester"

expect(locator).toBeVisible() failed

Locator: locator('[role="menu"][data-state="open"]:visible').first().locator('button').filter({ hasText: /XiTester Automation/i }).first()
Expected: visible
Timeout: 4000ms
Error: element(s) not found

Call log:
  - "XiTester Automation" should remain visible when filtering by "XiTester" with timeout 4000ms
  - waiting for locator('[role="menu"][data-state="open"]:visible').first().locator('button').filter({ hasText: /XiTester Automation/i }).first()

```

# Page snapshot

```yaml
- generic:
  - generic:
    - region "Notifications alt+T"
    - generic:
      - banner:
        - generic [ref=e1]:
          - img [ref=e2]
          - generic [ref=e5]:
            - generic [ref=e6]: You're on the Free plan (14 Days Left)
            - generic [ref=e7]: — unlock full access
          - button [ref=e8] [cursor=pointer]:
            - text: Upgrade
            - img [ref=e9]
        - generic:
          - generic:
            - img
          - generic:
            - generic: /
            - generic:
              - button:
                - img
                - generic: qa-del-1784841164846-pw7a
                - generic: Free
              - button [expanded]:
                - img
            - generic: /
            - button:
              - img
              - generic: Create project
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
            - generic: STAGE
            - generic: v1.2.5+patch.601
            - button: T
      - generic:
        - complementary:
          - navigation [ref=e11]:
            - button [ref=e12] [cursor=pointer]:
              - img [ref=e14]
            - button [ref=e19] [cursor=pointer]:
              - img [ref=e21]
            - button [ref=e24] [cursor=pointer]:
              - img [ref=e26]
            - button [ref=e30] [cursor=pointer]:
              - img [ref=e32]
            - button [ref=e39] [cursor=pointer]:
              - img [ref=e41]
            - button [ref=e53] [cursor=pointer]:
              - img [ref=e55]
            - button [ref=e59] [cursor=pointer]:
              - img [ref=e61]
            - button [ref=e64] [cursor=pointer]:
              - img [ref=e66]
            - button [ref=e70] [cursor=pointer]:
              - img [ref=e72]
            - button [ref=e78] [cursor=pointer]:
              - img [ref=e80]
            - button [ref=e84] [cursor=pointer]:
              - img [ref=e86]
          - button [ref=e91] [cursor=pointer]:
            - img [ref=e93]
        - generic:
          - main:
            - generic:
              - generic:
                - heading [level=1]: Dashboard
              - generic:
                - generic:
                  - button:
                    - img
                    - text: Overview
                  - button:
                    - img
                    - text: Regression Test Result Charts
                  - button:
                    - img
                    - text: Test Coverage
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - img
                      - generic:
                        - heading [level=3]: Total Test Plan Runs
                      - generic:
                        - generic: …
                        - generic:
                          - generic: …
                    - generic:
                      - generic:
                        - img
                      - generic:
                        - heading [level=3]: Pass Rate
                      - generic:
                        - generic: …
                        - generic:
                          - generic: …
                    - generic:
                      - generic:
                        - img
                      - generic:
                        - heading [level=3]: Active Suites
                      - generic:
                        - generic: …
                        - generic:
                          - generic: …
                    - generic:
                      - generic:
                        - img
                      - generic:
                        - heading [level=3]: Avg. Duration
                      - generic:
                        - generic: …
                        - generic:
                          - generic: …
                  - generic:
                    - generic:
                      - generic:
                        - combobox
                      - generic:
                        - generic:
                          - heading [level=3]: Test Plan Runs Analysis
                          - button:
                            - img
                        - generic:
                          - generic:
                            - generic:
                              - application:
                                - generic:
                                  - generic: Test Cases
                                  - generic: Duration (min)
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - heading [level=3]: Top Active Test Plans
                          - button:
                            - img
                        - generic:
                          - generic:
                            - generic:
                              - application
                    - generic:
                      - generic:
                        - heading [level=3]: Recent Activity
                        - button:
                          - img
  - menu [ref=e96]:
    - generic [ref=e97]:
      - img [ref=e98]
      - textbox "Find organization..." [active] [ref=e101]: XiTester
    - img [ref=e104]
    - button "All Organizations" [ref=e107] [cursor=pointer]
```

# Test source

```ts
  39  | 
  40  | async function waitForTopbar(page: Page): Promise<void> {
  41  |     await page.locator('header').waitFor({ state: 'visible', timeout: 15_000 })
  42  |     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({timeout: 30000,});
  43  |     // Memoised TopBar can briefly mount without children. Wait for at least
  44  |     // one chevron trigger before iterating.
  45  |     await page.locator(TOPBAR_CHEVRON).first().waitFor({ state: 'visible', timeout: 20_000 })
  46  | }
  47  | 
  48  | /** Wait for the open Radix popup to finish loading its list (spinner gone). */
  49  | async function waitForPopupReady(page: Page): Promise<void> {
  50  |     const popup = popupContent(page)
  51  |     await popup.waitFor({ state: 'visible', timeout: 10_000 })
  52  | 
  53  |     // Org / project lists are fetched async; the SUT shows a Loader2 spinner
  54  |     // (svg.lucide-loader-2) inside the popup while loading. Wait for it to
  55  |     // disappear before downstream assertions count buttons.
  56  |     const loader = popup.locator('svg.lucide-loader-2')
  57  |     if (await loader.first().isVisible({ timeout: 250 }).catch(() => false)) {
  58  |         await loader.first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined)
  59  |     }
  60  | }
  61  | 
  62  | async function openOrgSwitcher(page: Page): Promise<void> {
  63  |     await waitForTopbar(page)
  64  |     await page.locator(TOPBAR_CHEVRON).first().click()
  65  |     await page
  66  |         .locator('input[placeholder="Find organization..."]')
  67  |         .waitFor({ state: 'visible', timeout: 10_000 })
  68  |     await waitForPopupReady(page)
  69  | }
  70  | 
  71  | async function openProjectSwitcher(page: Page): Promise<void> {
  72  |     await waitForTopbar(page)
  73  |     const triggers = page.locator(TOPBAR_CHEVRON)
  74  |     const count = await triggers.count()
  75  |     if (count < 2) {
  76  |         throw new Error(
  77  |             `Project switcher chevron not visible. Found ${count} chevron trigger(s) in the topbar. ` +
  78  |             'The page must be a project-scoped route (e.g. /dashboard). On org-level pages ' +
  79  |             '(/organizations, /org/projects, /org/team) ProjectSwitcher is intentionally omitted.',
  80  |         )
  81  |     }
  82  |     await triggers.last().click()
  83  |     await page
  84  |         .locator('input[placeholder="Find project..."]')
  85  |         .waitFor({ state: 'visible', timeout: 10_000 })
  86  |     await waitForPopupReady(page)
  87  | }
  88  | 
  89  | /**
  90  |  * Locate the open Radix DropdownMenu content root. Radix renders it as
  91  |  * a portal'd `<div role="menu" data-state="open">…</div>`, which is the
  92  |  * stable handle for everything inside the popup (search input, list,
  93  |  * footer items). Avoids brittle xpath ancestor-class lookups.
  94  |  */
  95  | function popupContent(page: Page): Locator {
  96  |     return page.locator('[role="menu"][data-state="open"]:visible').first()
  97  | }
  98  | 
  99  | // ============================================================
  100 | // Org switcher (TC-056..058)
  101 | // ============================================================
  102 | 
  103 | test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
  104 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  105 |     await page.goto('/dashboard')
  106 | 
  107 |     await openOrgSwitcher(page)
  108 |     const popup = popupContent(page)
  109 | 
  110 |     await expect(popup.locator('input[placeholder="Find organization..."]')).toBeVisible({
  111 |         timeout: 5_000,
  112 |     })
  113 | 
  114 |     // The org list loads async, and Radix may still be settling layout
  115 |     // even after waitForPopupReady. Use poll-style assertion so the test
  116 |     // waits up to 8s for at least one org row to appear before failing.
  117 |     const items = popup.locator('button').filter({ hasNotText: /^All Organizations$/ })
  118 |     await expect
  119 |         .poll(() => items.count(), {
  120 |             message: 'at least one org row should be listed in the popup',
  121 |             timeout: 8_000,
  122 |         })
  123 |         .toBeGreaterThan(0)
  124 | })
  125 | 
  126 | test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
  127 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  128 |     await page.goto('/dashboard')
  129 | 
  130 |     await openOrgSwitcher(page)
  131 |     const popup = popupContent(page)
  132 |     const search = popup.locator('input[placeholder="Find organization..."]')
  133 |     await expect(search).toBeVisible({ timeout: 5_000 })
  134 | 
  135 |     await search.fill('XiTester')
  136 |     await expect(
  137 |         popup.locator('button', { hasText: /XiTester Automation/i }).first(),
  138 |         '"XiTester Automation" should remain visible when filtering by "XiTester"',
> 139 |     ).toBeVisible({ timeout: 4_000 })
      |       ^ Error: "XiTester Automation" should remain visible when filtering by "XiTester"
  140 | 
  141 |     await search.fill(`xt-nomatch-${Date.now()}`)
  142 |     // The SUT shows "No organizations found" for an empty filter (TopBar.tsx ~line 215).
  143 |     await expect(popup.getByText(/no organizations found/i)).toBeVisible({ timeout: 4_000 })
  144 | })
  145 | 
  146 | test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
  147 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  148 |     await page.goto('/dashboard')
  149 | 
  150 |     await openOrgSwitcher(page)
  151 |     const popup = popupContent(page)
  152 |     await popup.locator('button', { hasText: /^All Organizations$/ }).click()
  153 | 
  154 |     await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
  155 |     expect(page.url()).toMatch(/\/organizations\b/)
  156 |     await expect(page.getByRole('heading', { name: 'Your Organizations' })).toBeVisible({timeout: 30_000,})
  157 | })
  158 | 
  159 | // ============================================================
  160 | // Project switcher (TC-059..062)
  161 | // ============================================================
  162 | 
  163 | test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
  164 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  165 |     await page.goto('/dashboard')
  166 | 
  167 |     // "All Projects" → /org/projects
  168 |     await openProjectSwitcher(page)
  169 |     let popup = popupContent(page)
  170 |     await popup.locator('button', { hasText: /^Manage Projects$/ }).click()
  171 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 15_000 })
  172 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  173 |     await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({timeout: 30_000,})
  174 | 
  175 |     // "New project" → /org/projects (the SUT opens its create dialog from there)
  176 |     await page.locator('button', { hasText: /^New project$/ }).click()
  177 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  178 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  179 |     await expect(page.getByRole('heading', { name: 'Create New Project' })).toBeVisible({timeout: 30_000,})
  180 | })
  181 | 
  182 | test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
  183 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  184 |     await page.goto('/dashboard')
  185 | 
  186 |     await openProjectSwitcher(page)
  187 |     const popup = popupContent(page)
  188 | 
  189 |     await expect(popup.locator('input[placeholder="Find project..."]')).toBeVisible({
  190 |         timeout: 5_000,
  191 |     })
  192 | 
  193 |     const items = popup
  194 |         .locator('button')
  195 |         .filter({ hasNotText: /^(Manage Projects)$/ })
  196 |     await expect
  197 |         .poll(() => items.count(), {
  198 |             message: 'at least one project row should be listed in the popup',
  199 |             timeout: 8_000,
  200 |         })
  201 |         .toBeGreaterThan(0)
  202 | })
  203 | 
  204 | test('TC-061 — Verify Project search inside dropdown', async ({ page }) => {
  205 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  206 |     await page.goto('/dashboard')
  207 | 
  208 |     await openProjectSwitcher(page)
  209 |     const popup = popupContent(page)
  210 |     const search = popup.locator('input[placeholder="Find project..."]')
  211 |     await expect(search).toBeVisible({ timeout: 5_000 })
  212 | 
  213 |     await search.fill('Default')
  214 |     await expect(
  215 |         popup.locator('button', { hasText: /Default Project/i }).first(),
  216 |     ).toBeVisible({ timeout: 4_000 })
  217 | 
  218 |     await search.fill(`xt-nomatch-${Date.now()}`)
  219 |     const items = popup
  220 |         .locator('button')
  221 |         .filter({ hasNotText: /^(Manage Projects)$/ })
  222 |     await expect(items).toHaveCount(0, { timeout: 4_000 })
  223 | })
  224 | 
  225 | test('TC-062 — Verify Project search inside dropdown (clear restores list)', async ({ page }) => {
  226 |     // Per source data this row is identical to TC-061. Re-asserts from a
  227 |     // different angle — search → clear → all rows return.
  228 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  229 |     await page.goto('/dashboard')
  230 | 
  231 |     await openProjectSwitcher(page)
  232 |     const popup = popupContent(page)
  233 |     const search = popup.locator('input[placeholder="Find project..."]')
  234 |     await expect(search).toBeVisible({ timeout: 5_000 })
  235 | 
  236 |     const items = popup
  237 |         .locator('button')
  238 |         .filter({ hasNotText: /^(Manage Projects)$/ })
  239 |     const initialCount = await items.count()
```