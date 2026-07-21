# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: theme.spec.ts >> TC-042 — Verify theme switch from light to dark
- Location: tests/theme.spec.ts:36:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('header button[aria-haspopup="menu"]:visible').last()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('header button[aria-haspopup="menu"]:visible').last()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - status "Loading" [ref=e3]
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test'
  2  | import { ENV } from '../env'
  3  | 
  4  | test.use({ storageState: '.auth/user.json' })
  5  | test.describe.configure({ mode: 'serial' })
  6  | 
  7  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  8  | 
  9  | async function openUserMenu(page: Page): Promise<void> {
  10 |     const trigger = page.locator('header button[aria-haspopup="menu"]:visible').last()
> 11 |     await expect(trigger).toBeVisible({ timeout: 10_000 })
     |                           ^ Error: expect(locator).toBeVisible() failed
  12 |     await trigger.click()
  13 | }
  14 | 
  15 | async function getThemeClass(page: Page): Promise<'dark' | 'light'> {
  16 |     const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  17 |     return isDark ? 'dark' : 'light'
  18 | }
  19 | 
  20 | /** Click the user-menu item that toggles theme — its label flips between
  21 |  *  "Light Mode" and "Dark Mode" depending on current state.
  22 |  */
  23 | async function clickThemeMenuItem(page: Page, expectedLabel: 'Light Mode' | 'Dark Mode'): Promise<void> {
  24 |     await openUserMenu(page)
  25 |     await page.getByRole('menuitem', { name: expectedLabel }).click()
  26 | }
  27 | 
  28 | async function ensureTheme(page: Page, target: 'light' | 'dark'): Promise<void> {
  29 |     const current = await getThemeClass(page)
  30 |     if (current === target) return
  31 |     // Menu item label is the OPPOSITE of current theme.
  32 |     await clickThemeMenuItem(page, target === 'dark' ? 'Dark Mode' : 'Light Mode')
  33 |     await expect.poll(() => getThemeClass(page)).toBe(target)
  34 | }
  35 | 
  36 | test('TC-042 — Verify theme switch from light to dark', async ({ page }) => {
  37 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  38 | 
  39 |     await page.goto('/dashboard')
  40 |     await page.waitForLoadState('domcontentloaded')
  41 | 
  42 |     // Setup: ensure starting state is light.
  43 |     await ensureTheme(page, 'light')
  44 | 
  45 |     // Switch to dark via the user menu.
  46 |     await clickThemeMenuItem(page, 'Dark Mode')
  47 |     await expect.poll(() => getThemeClass(page)).toBe('dark')
  48 | 
  49 |     // Persistence — refresh and verify the dark theme stays.
  50 |     await page.reload()
  51 |     await page.waitForLoadState('domcontentloaded')
  52 |     expect(await getThemeClass(page)).toBe('dark')
  53 | 
  54 |     // Cleanup: revert to light so TC-043 starts from a known state.
  55 |     await ensureTheme(page, 'light')
  56 | })
  57 | 
  58 | test('TC-043 — Verify theme switch from dark to light', async ({ page }) => {
  59 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  60 | 
  61 |     await page.goto('/dashboard')
  62 |     await page.waitForLoadState('domcontentloaded')
  63 | 
  64 |     // Setup: dark.
  65 |     await ensureTheme(page, 'dark')
  66 | 
  67 |     // Switch to light.
  68 |     await clickThemeMenuItem(page, 'Light Mode')
  69 |     await expect.poll(() => getThemeClass(page)).toBe('light')
  70 | 
  71 |     // Refresh → still light.
  72 |     await page.reload()
  73 |     await page.waitForLoadState('domcontentloaded')
  74 |     expect(await getThemeClass(page)).toBe('light')
  75 | })
  76 | 
```