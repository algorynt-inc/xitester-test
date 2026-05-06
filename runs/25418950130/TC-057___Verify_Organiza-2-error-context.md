# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-057 — Verify Organization search inside dropdown
- Location: tests/nav.spec.ts:95:1

# Error details

```
Error: Could not open the organization switcher. Tried 0 haspopup triggers: (none).
Look at the most recent trace.zip for this test in the dashboard / Actions.
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
  4   | test.use({ storageState: '.auth/user.json' })
  5   | 
  6   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  7   | 
  8   | type SwitcherKind = 'organization' | 'project'
  9   | 
  10  | /**
  11  |  * Open one of the topbar switcher dropdowns by iterating every visible
  12  |  * haspopup-style trigger on the page, clicking each, and checking
  13  |  * whether the resulting popup contains the expected search input.
  14  |  *
  15  |  * - Doesn't scope to <header>: in this SUT the switchers live inside a
  16  |  *   wider banner/topbar that may not be a literal <header>.
  17  |  * - Loosened placeholder match: case-insensitive substring on
  18  |  *   "organization" / "project" so wording differences ("Find a
  19  |  *   project") don't break it.
  20  |  * - Diagnostics: when no trigger matches, the thrown error includes
  21  |  *   a list of every haspopup button text found, so failure is debuggable
  22  |  *   from the trace.
  23  |  */
  24  | async function openSwitcher(page: Page, kind: SwitcherKind): Promise<void> {
  25  |     const triggers = page
  26  |         .locator('button[aria-haspopup="menu"]:visible, button[aria-haspopup="true"]:visible')
  27  |     const total = await triggers.count()
  28  | 
  29  |     const placeholderRegex = kind === 'organization' ? /organization/i : /project/i
  30  |     const seen: string[] = []
  31  | 
  32  |     for (let i = 0; i < total; i++) {
  33  |         const trigger = triggers.nth(i)
  34  |         const label = (await trigger.textContent().catch(() => '')) || '(no text)'
  35  |         seen.push(`#${i}: "${label.trim().slice(0, 40)}"`)
  36  | 
  37  |         try {
  38  |             await trigger.click()
  39  |         } catch {
  40  |             continue
  41  |         }
  42  |         // Radix renders the dropdown content asynchronously; give it a beat.
  43  |         await page.waitForTimeout(250)
  44  | 
  45  |         const search = page
  46  |             .locator('input:visible')
  47  |             .filter({ has: page.locator('xpath=self::input') })
  48  |             .filter({ hasText: '' }) // any input
  49  |         // Match by placeholder containing the kind keyword.
  50  |         const match = page
  51  |             .locator(`input[placeholder*="${kind}" i]:visible`)
  52  |             .first()
  53  |         if (await match.isVisible({ timeout: 1_500 }).catch(() => false)) {
  54  |             void search // keep typed
  55  |             return
  56  |         }
  57  |         // Close so the next iteration's click reaches a fresh trigger.
  58  |         await page.keyboard.press('Escape')
  59  |         await page.waitForTimeout(150)
  60  |     }
  61  | 
> 62  |     throw new Error(
      |           ^ Error: Could not open the organization switcher. Tried 0 haspopup triggers: (none).
  63  |         `Could not open the ${kind} switcher. Tried ${total} haspopup triggers: ${seen.join(' | ') || '(none)'}.\n` +
  64  |             `Look at the most recent trace.zip for this test in the dashboard / Actions.`,
  65  |     )
  66  | }
  67  | 
  68  | async function openOrgSwitcher(page: Page): Promise<void> {
  69  |     return openSwitcher(page, 'organization')
  70  | }
  71  | 
  72  | async function openProjectSwitcher(page: Page): Promise<void> {
  73  |     return openSwitcher(page, 'project')
  74  | }
  75  | 
  76  | // ============================================================
  77  | // Org switcher (TC-056..058)
  78  | // ============================================================
  79  | 
  80  | test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
  81  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  82  |     await page.goto('/dashboard')
  83  |     await page.waitForLoadState('domcontentloaded')
  84  | 
  85  |     await openOrgSwitcher(page)
  86  |     // The popup should contain the search input plus at least one org row.
  87  |     await expect(page.locator('input[placeholder="Find organization..."]')).toBeVisible({
  88  |         timeout: 5_000,
  89  |     })
  90  |     // At least one org item should be listed (excluding the search input + footer).
  91  |     const items = page.locator('[role="menuitem"]:visible')
  92  |     expect(await items.count()).toBeGreaterThan(0)
  93  | })
  94  | 
  95  | test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
  96  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  97  |     await page.goto('/dashboard')
  98  |     await page.waitForLoadState('domcontentloaded')
  99  | 
  100 |     await openOrgSwitcher(page)
  101 |     const search = page.locator('input[placeholder="Find organization..."]')
  102 |     await expect(search).toBeVisible({ timeout: 5_000 })
  103 | 
  104 |     // Type a partial name that should match the seeded "XiTester" org.
  105 |     await search.fill('XiTester')
  106 |     await expect(
  107 |         page.getByRole('menuitem', { name: /XiTester/i }).first(),
  108 |     ).toBeVisible({ timeout: 4_000 })
  109 | 
  110 |     // Filter to nonsense → no items.
  111 |     await search.fill(`xt-nomatch-${Date.now()}`)
  112 |     await expect(page.getByRole('menuitem')).toHaveCount(0, { timeout: 4_000 })
  113 | })
  114 | 
  115 | test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
  116 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  117 |     await page.goto('/dashboard')
  118 |     await page.waitForLoadState('domcontentloaded')
  119 | 
  120 |     await openOrgSwitcher(page)
  121 |     await page.getByRole('menuitem', { name: /All Organizations/i }).click()
  122 |     await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
  123 |     expect(page.url()).toMatch(/\/organizations\b/)
  124 | })
  125 | 
  126 | // ============================================================
  127 | // Project switcher (TC-059..062)
  128 | // ============================================================
  129 | 
  130 | test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
  131 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  132 |     await page.goto('/dashboard')
  133 |     await page.waitForLoadState('domcontentloaded')
  134 | 
  135 |     // "All Projects" → /org/projects.
  136 |     await openProjectSwitcher(page)
  137 |     await page.getByRole('menuitem', { name: /All Projects/i }).click()
  138 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  139 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  140 | 
  141 |     // Navigate back to dashboard, then "New project" → /org/projects (same
  142 |     // page, but with create-modal context). The SUT routes both to the same
  143 |     // page; the assertion is just that the URL still matches /org/projects.
  144 |     await page.goto('/dashboard')
  145 |     await openProjectSwitcher(page)
  146 |     await page.getByRole('menuitem', { name: /New project/i }).click()
  147 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  148 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  149 | })
  150 | 
  151 | test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
  152 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  153 |     await page.goto('/dashboard')
  154 |     await page.waitForLoadState('domcontentloaded')
  155 | 
  156 |     await openProjectSwitcher(page)
  157 |     await expect(page.locator('input[placeholder="Find project..."]')).toBeVisible({
  158 |         timeout: 5_000,
  159 |     })
  160 | 
  161 |     const items = page.locator('[role="menuitem"]:visible').filter({
  162 |         hasNotText: /(All Projects|New project)/i,
```