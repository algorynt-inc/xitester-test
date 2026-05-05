import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })
test.describe.configure({ mode: 'serial' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

async function openUserMenu(page: Page): Promise<void> {
    const trigger = page.locator('header button[aria-haspopup="menu"]:visible').last()
    await expect(trigger).toBeVisible({ timeout: 10_000 })
    await trigger.click()
}

async function getThemeClass(page: Page): Promise<'dark' | 'light'> {
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    return isDark ? 'dark' : 'light'
}

/** Click the user-menu item that toggles theme — its label flips between
 *  "Light Mode" and "Dark Mode" depending on current state.
 */
async function clickThemeMenuItem(page: Page, expectedLabel: 'Light Mode' | 'Dark Mode'): Promise<void> {
    await openUserMenu(page)
    await page.getByRole('menuitem', { name: expectedLabel }).click()
}

async function ensureTheme(page: Page, target: 'light' | 'dark'): Promise<void> {
    const current = await getThemeClass(page)
    if (current === target) return
    // Menu item label is the OPPOSITE of current theme.
    await clickThemeMenuItem(page, target === 'dark' ? 'Dark Mode' : 'Light Mode')
    await expect.poll(() => getThemeClass(page)).toBe(target)
}

test('TC-042 — Verify theme switch from light to dark', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    // Setup: ensure starting state is light.
    await ensureTheme(page, 'light')

    // Switch to dark via the user menu.
    await clickThemeMenuItem(page, 'Dark Mode')
    await expect.poll(() => getThemeClass(page)).toBe('dark')

    // Persistence — refresh and verify the dark theme stays.
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    expect(await getThemeClass(page)).toBe('dark')

    // Cleanup: revert to light so TC-043 starts from a known state.
    await ensureTheme(page, 'light')
})

test('TC-043 — Verify theme switch from dark to light', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    // Setup: dark.
    await ensureTheme(page, 'dark')

    // Switch to light.
    await clickThemeMenuItem(page, 'Light Mode')
    await expect.poll(() => getThemeClass(page)).toBe('light')

    // Refresh → still light.
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    expect(await getThemeClass(page)).toBe('light')
})
