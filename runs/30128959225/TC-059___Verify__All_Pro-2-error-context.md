# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-059 — Verify "All Projects" + "New project" navigation from project dropdown
- Location: tests/nav.spec.ts:163:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('header') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - status "Loading" [ref=e3]
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
> 41  |     await page.locator('header').waitFor({ state: 'visible', timeout: 15_000 })
      |                                  ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  139 |     ).toBeVisible({ timeout: 4_000 })
  140 | 
  141 |     await search.fill(`xt-nomatch-${Date.now()}`)
```