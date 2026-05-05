import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

// Both tests start authenticated; logout is the action under test.
test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

/**
 * Open the user-menu dropdown in the top bar. The trigger is a Radix
 * shadcn DropdownMenuTrigger that exposes aria-haspopup="menu". The
 * topbar may have multiple haspopup buttons (org switcher etc.); the
 * user menu is the last one on the right.
 */
async function openUserMenu(page: Page): Promise<void> {
    const trigger = page.locator('header button[aria-haspopup="menu"]').last()
    await expect(trigger).toBeVisible({ timeout: 10_000 })
    await trigger.click()
}

// ============================================================
// Logout — flat list, no categories
// ============================================================

test('TC-LO-001 — Logout via user menu redirects to /login', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    // Land on any authed page first so the topbar renders.
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openUserMenu(page)
    await page.getByRole('menuitem', { name: /^Log out$/i }).click()

    // Logout fires POST /api/v1/auth/logout best-effort and navigates to /login.
    await page.waitForURL(/\/login\b/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/login\b/)

    // The login form should be visible again.
    await expect(page.locator('#email')).toBeVisible({ timeout: 5_000 })
})

test('TC-LO-002 — Protected routes redirect to /login after logout', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openUserMenu(page)
    await page.getByRole('menuitem', { name: /^Log out$/i }).click()
    await page.waitForURL(/\/login\b/, { timeout: 10_000 })

    // Now try to load a protected page directly. The auth guard should
    // bounce us back to /login because the token / cookie was cleared.
    await page.goto('/dashboard')
    await page.waitForURL(/\/login\b/, { timeout: 8_000 })
    expect(page.url(), 'protected route should redirect to /login when logged out').toMatch(/\/login\b/)
})
