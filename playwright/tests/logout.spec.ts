import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

// Both tests start authenticated; logout is the action under test.
// test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

/**
 * Log in through the UI so this test owns a fresh, independent session.
 *
 * We deliberately do NOT share the saved storageState (.auth/user.json)
 * here: logout invalidates its token server-side, so if both logout tests
 * reused the one shared token, whichever logged out first would break the
 * other. A per-test login gives each test its own token.
 */
async function loginViaUI(page: Page): Promise<void> {
    await page.goto('/login')
    await page.locator('#email').waitFor({ state: 'visible', timeout: 30_000 })
    await page.fill('#email', ENV.user.email)
    await page.fill('#password', ENV.user.password)
    await Promise.all([
        page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
        page.locator('button[type="submit"]').click(),
    ])
}

// Each test gets its OWN session, so one test's logout can't invalidate
// another test's token.
test.beforeEach(async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await loginViaUI(page)
})

/**
 * Open the user-menu dropdown in the top bar.
 *
 * The SUT renders <UserMenu /> twice — once for the desktop layout
 * (`hidden sm:flex`) and once for the mobile layout (`flex sm:hidden`).
 * Both produce a button with aria-haspopup="menu", but only one is
 * actually rendered visibly at any given viewport. Filtering with
 * `:visible` picks the right copy regardless of viewport size.
 *
 * The user menu is the LAST visible aria-haspopup button in the header
 * (the org switcher and other menus appear earlier).
 */
async function openUserMenu(page: Page): Promise<void> {
    const trigger = page.locator('header button[aria-haspopup="menu"]:visible').last()
    await expect(trigger).toBeVisible({ timeout: 15_000 })
    await trigger.click()
}

// ============================================================
// Logout — flat list, no categories
// ============================================================

test('TC-LO-001 — Logout via user menu redirects to /login', async ({ page }) => {
    // test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

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
    // test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await expect(
        page.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeVisible({ timeout: 8_000 })
    await openUserMenu(page)
    await page.getByRole('menuitem', { name: /^Log out$/i }).click()
    await page.waitForURL(/\/login\b/, { timeout: 10_000 })

    // Now try to load a protected page directly. The auth guard should
    // bounce us back to /login because the token / cookie was cleared.
    await page.goto('/dashboard')
    await page.waitForURL(/\/login\b/, { timeout: 8_000 })
    expect(page.url(), 'protected route should redirect to /login when logged out').toMatch(/\/login\b/)
})
