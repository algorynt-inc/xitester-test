# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nav.spec.ts >> TC-060 — Verify Project switch dropdown lists projects
- Location: tests/nav.spec.ts:112:1

# Error details

```
Error: Could not locate the project switcher dropdown trigger
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
  8   | /** The org switcher trigger has a "Find organization..." search inside its menu. */
  9   | async function openOrgSwitcher(page: Page): Promise<void> {
  10  |     // The breadcrumb shows the current org name; the haspopup button next to
  11  |     // it is the trigger. Pick the one that opens the menu containing
  12  |     // "Find organization...".
  13  |     const triggers = page.locator('header button[aria-haspopup="menu"]:visible')
  14  |     const count = await triggers.count()
  15  |     for (let i = 0; i < count; i++) {
  16  |         await triggers.nth(i).click()
  17  |         const search = page.locator('input[placeholder="Find organization..."]')
  18  |         if (await search.isVisible().catch(() => false)) return
  19  |         // Close and try next.
  20  |         await page.keyboard.press('Escape')
  21  |     }
  22  |     throw new Error('Could not locate the org switcher dropdown trigger')
  23  | }
  24  | 
  25  | async function openProjectSwitcher(page: Page): Promise<void> {
  26  |     const triggers = page.locator('header button[aria-haspopup="menu"]:visible')
  27  |     const count = await triggers.count()
  28  |     for (let i = 0; i < count; i++) {
  29  |         await triggers.nth(i).click()
  30  |         const search = page.locator('input[placeholder="Find project..."]')
  31  |         if (await search.isVisible().catch(() => false)) return
  32  |         await page.keyboard.press('Escape')
  33  |     }
> 34  |     throw new Error('Could not locate the project switcher dropdown trigger')
      |           ^ Error: Could not locate the project switcher dropdown trigger
  35  | }
  36  | 
  37  | // ============================================================
  38  | // Org switcher (TC-056..058)
  39  | // ============================================================
  40  | 
  41  | test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
  42  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  43  |     await page.goto('/dashboard')
  44  |     await page.waitForLoadState('domcontentloaded')
  45  | 
  46  |     await openOrgSwitcher(page)
  47  |     // The popup should contain the search input plus at least one org row.
  48  |     await expect(page.locator('input[placeholder="Find organization..."]')).toBeVisible({
  49  |         timeout: 5_000,
  50  |     })
  51  |     // At least one org item should be listed (excluding the search input + footer).
  52  |     const items = page.locator('[role="menuitem"]:visible')
  53  |     expect(await items.count()).toBeGreaterThan(0)
  54  | })
  55  | 
  56  | test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
  57  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  58  |     await page.goto('/dashboard')
  59  |     await page.waitForLoadState('domcontentloaded')
  60  | 
  61  |     await openOrgSwitcher(page)
  62  |     const search = page.locator('input[placeholder="Find organization..."]')
  63  |     await expect(search).toBeVisible({ timeout: 5_000 })
  64  | 
  65  |     // Type a partial name that should match the seeded "XiTester" org.
  66  |     await search.fill('XiTester')
  67  |     await expect(
  68  |         page.getByRole('menuitem', { name: /XiTester/i }).first(),
  69  |     ).toBeVisible({ timeout: 4_000 })
  70  | 
  71  |     // Filter to nonsense → no items.
  72  |     await search.fill(`xt-nomatch-${Date.now()}`)
  73  |     await expect(page.getByRole('menuitem')).toHaveCount(0, { timeout: 4_000 })
  74  | })
  75  | 
  76  | test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
  77  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  78  |     await page.goto('/dashboard')
  79  |     await page.waitForLoadState('domcontentloaded')
  80  | 
  81  |     await openOrgSwitcher(page)
  82  |     await page.getByRole('menuitem', { name: /All Organizations/i }).click()
  83  |     await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
  84  |     expect(page.url()).toMatch(/\/organizations\b/)
  85  | })
  86  | 
  87  | // ============================================================
  88  | // Project switcher (TC-059..062)
  89  | // ============================================================
  90  | 
  91  | test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
  92  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  93  |     await page.goto('/dashboard')
  94  |     await page.waitForLoadState('domcontentloaded')
  95  | 
  96  |     // "All Projects" → /org/projects.
  97  |     await openProjectSwitcher(page)
  98  |     await page.getByRole('menuitem', { name: /All Projects/i }).click()
  99  |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  100 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  101 | 
  102 |     // Navigate back to dashboard, then "New project" → /org/projects (same
  103 |     // page, but with create-modal context). The SUT routes both to the same
  104 |     // page; the assertion is just that the URL still matches /org/projects.
  105 |     await page.goto('/dashboard')
  106 |     await openProjectSwitcher(page)
  107 |     await page.getByRole('menuitem', { name: /New project/i }).click()
  108 |     await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
  109 |     expect(page.url()).toMatch(/\/org\/projects\b/)
  110 | })
  111 | 
  112 | test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
  113 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  114 |     await page.goto('/dashboard')
  115 |     await page.waitForLoadState('domcontentloaded')
  116 | 
  117 |     await openProjectSwitcher(page)
  118 |     await expect(page.locator('input[placeholder="Find project..."]')).toBeVisible({
  119 |         timeout: 5_000,
  120 |     })
  121 | 
  122 |     const items = page.locator('[role="menuitem"]:visible').filter({
  123 |         hasNotText: /(All Projects|New project)/i,
  124 |     })
  125 |     expect(await items.count()).toBeGreaterThan(0)
  126 | })
  127 | 
  128 | test('TC-061 — Verify Project search inside dropdown', async ({ page }) => {
  129 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  130 |     await page.goto('/dashboard')
  131 |     await page.waitForLoadState('domcontentloaded')
  132 | 
  133 |     await openProjectSwitcher(page)
  134 |     const search = page.locator('input[placeholder="Find project..."]')
```