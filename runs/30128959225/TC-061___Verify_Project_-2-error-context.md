# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-061 — Verify Project search inside dropdown
- Location: tests/nav.spec.ts:204:1

# Error details

```
Error: Project switcher chevron not visible. Found 1 chevron trigger(s) in the topbar. The page must be a project-scoped route (e.g. /dashboard). On org-level pages (/organizations, /org/projects, /org/team) ProjectSwitcher is intentionally omitted.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e6]
        - generic [ref=e9]:
          - generic [ref=e10]: You're on the Free plan (14 Days Left)
          - generic [ref=e11]: — unlock full access
        - button "Upgrade" [ref=e12] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e13]
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]:
            - button "qa-del-1784841164846-pw7a Free" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: qa-del-1784841164846-pw7a
              - generic [ref=e27]: Free
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - generic [ref=e32]: /
          - button "Create project" [ref=e33] [cursor=pointer]:
            - img [ref=e34]
            - generic [ref=e36]: Create project
      - generic [ref=e37]:
        - button "Search... ⌘K" [ref=e38] [cursor=pointer]:
          - img [ref=e39]
          - generic [ref=e42]: Search...
          - generic [ref=e43]: ⌘K
        - generic [ref=e44]:
          - button "Help" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
          - button "Notifications" [ref=e49] [cursor=pointer]:
            - img [ref=e50]
        - generic [ref=e54]:
          - generic [ref=e55]: STAGE
          - generic [ref=e56]: v1.2.5+patch.601
          - button "T" [ref=e57] [cursor=pointer]
    - generic [ref=e58]:
      - complementary:
        - navigation [ref=e59]:
          - button "Dashboard" [ref=e60] [cursor=pointer]:
            - img [ref=e62]
            - generic: Dashboard
          - button "Test Cases" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Test Cases
          - button "Test Plans" [ref=e72] [cursor=pointer]:
            - img [ref=e74]
            - generic: Test Plans
          - button "Discovery" [ref=e78] [cursor=pointer]:
            - img [ref=e80]
            - generic: Discovery
          - button "Test Plan AI" [ref=e87] [cursor=pointer]:
            - img [ref=e89]
            - generic: Test Plan AI
          - button "Test Data" [ref=e101] [cursor=pointer]:
            - img [ref=e103]
            - generic: Test Data
          - button "Quality" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Quality
          - button "Api Tester" [ref=e112] [cursor=pointer]:
            - img [ref=e114]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e118] [cursor=pointer]:
            - img [ref=e120]
            - generic: Figma-to-web
          - button "Reports" [ref=e126] [cursor=pointer]:
            - img [ref=e128]
            - generic: Reports
          - button "Settings" [ref=e132] [cursor=pointer]:
            - img [ref=e134]
            - generic: Settings
        - button "Logout" [ref=e139] [cursor=pointer]:
          - img [ref=e141]
          - generic: Logout
      - main [ref=e145]:
        - generic [ref=e146]:
          - heading "Dashboard" [level=1] [ref=e148]
          - generic [ref=e150]:
            - button "Overview" [ref=e151] [cursor=pointer]:
              - img [ref=e152]
              - text: Overview
            - button "Regression Test Result Charts" [ref=e157] [cursor=pointer]:
              - img [ref=e158]
              - text: Regression Test Result Charts
            - button "Test Coverage" [ref=e161] [cursor=pointer]:
              - img [ref=e162]
              - text: Test Coverage
          - generic [ref=e165]:
            - generic [ref=e166]:
              - generic [ref=e167]:
                - img [ref=e169]
                - heading "Total Test Plan Runs" [level=3] [ref=e172]
                - generic [ref=e173]:
                  - generic [ref=e174]: …
                  - generic [ref=e176]: …
              - generic [ref=e177]:
                - img [ref=e179]
                - heading "Pass Rate" [level=3] [ref=e183]
                - generic [ref=e184]:
                  - generic [ref=e185]: …
                  - generic [ref=e187]: …
              - generic [ref=e188]:
                - img [ref=e190]
                - heading "Active Suites" [level=3] [ref=e196]
                - generic [ref=e197]:
                  - generic [ref=e198]: …
                  - generic [ref=e200]: …
              - generic [ref=e201]:
                - img [ref=e203]
                - heading "Avg. Duration" [level=3] [ref=e207]
                - generic [ref=e208]:
                  - generic [ref=e209]: …
                  - generic [ref=e211]: …
            - generic [ref=e213]:
              - combobox "Select test plan" [ref=e215]:
                - option "No Plans Found" [selected]
              - generic [ref=e216]:
                - generic [ref=e218]:
                  - heading "Test Plan Runs Analysis" [level=3] [ref=e219]
                  - button "Maximize Test Plan Runs Analysis chart" [ref=e220] [cursor=pointer]:
                    - img [ref=e221]
                - application [ref=e229]:
                  - generic [ref=e233]:
                    - generic [ref=e234]: Test Cases
                    - generic [ref=e235]: Duration (min)
            - generic [ref=e238]:
              - generic [ref=e240]:
                - generic [ref=e242]:
                  - heading "Top Active Test Plans" [level=3] [ref=e243]
                  - button "Maximize Top Active Test Plans chart" [ref=e244] [cursor=pointer]:
                    - img [ref=e245]
                - application [ref=e253]
              - generic [ref=e261]:
                - heading "Recent Activity" [level=3] [ref=e262]
                - button "Maximize Recent Activity chart" [ref=e263] [cursor=pointer]:
                  - img [ref=e264]
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
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
  12  | /**
  13  |  * Locator notes — verified against the actual SUT DOM.
  14  |  * --------------------------------------------------------------------
  15  |  * OrgBreadcrumb (TopBar.tsx ~line 184) and ProjectSwitcher
  16  |  * (ProjectSwitcher.tsx ~line 60) both render their dropdown as:
  17  |  *
  18  |  *   <button>{Org|Project name}</button>           ← navigate-only label
  19  |  *   <DropdownMenuTrigger asChild>
  20  |  *     <button> <ChevronsUpDown /> </button>       ← THIS is the trigger
  21  |  *   </DropdownMenuTrigger>
  22  |  *
  23  |  * Both triggers are tiny icon-only buttons whose only child is a
  24  |  * Lucide `ChevronsUpDown` SVG (rendered with class
  25  |  * `lucide-chevrons-up-down`).
  26  |  *
  27  |  * Org breadcrumb is the FIRST chevron in the topbar. Project switcher
  28  |  * is the SECOND, but is only mounted on project-scoped pages
  29  |  * (/dashboard, /api-tester, etc.). On org-level pages
  30  |  * (/organizations, /org/projects, /org/team) ProjectSwitcher is
  31  |  * intentionally omitted.
  32  |  *
  33  |  * Inside each popup, list items are plain <button> elements (NOT
  34  |  * role="menuitem"), so we scope to the popup container and select
  35  |  * by button text.
  36  |  */
  37  | 
  38  | const TOPBAR_CHEVRON = 'button:has(svg.lucide-chevrons-up-down):visible'
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
> 76  |         throw new Error(
      |               ^ Error: Project switcher chevron not visible. Found 1 chevron trigger(s) in the topbar. The page must be a project-scoped route (e.g. /dashboard). On org-level pages (/organizations, /org/projects, /org/team) ProjectSwitcher is intentionally omitted.
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
  139 |     ).toBeVisible({ timeout: 4_000 })
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
```