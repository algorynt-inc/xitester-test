import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

async function gotoLogin(page: Page): Promise<void> {
    await page.goto('/login')
    await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
    await page.locator('button[type="submit"]').waitFor({ state: 'visible', timeout: 15_000 })
}

// ============================================================
// Login Suite (Lean Version) — 5 tests, flat (no describe blocks)
// ============================================================

test('TC-LI-001 — Successful login with valid credentials', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoLogin(page)
    await page.fill('#email', ENV.user.email)
    await page.fill('#password', ENV.user.password)

    const submit = page.locator('button[type="submit"]')
    const [response] = await Promise.all([
        page.waitForResponse(/\/api\/v1\/auth\/login\b/),
        submit.click(),
    ])
    expect(response.status(), 'login API should return 200').toBe(200)

    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 })
    expect(page.url()).not.toMatch(/\/login(\?|$|#)/)
})

test('TC-LI-002 — Wrong password shows error', async ({ page }) => {
    test.skip(!ENV.user.email, SKIP_NO_CREDS)

    await gotoLogin(page)
    await page.fill('#email', ENV.user.email)
    await page.fill('#password', 'definitely-not-the-real-password')

    const [response] = await Promise.all([
        page.waitForResponse(/\/api\/v1\/auth\/login\b/),
        page.locator('button[type="submit"]').click(),
    ])
    expect(response.status(), 'wrong password should return 401').toBe(401)

    const toaster = page.locator('[data-sonner-toaster]')
    await expect(toaster).toContainText(/login failed|invalid|incorrect/i, { timeout: 5_000 })

    expect(page.url()).toMatch(/\/login(\?|$|#)/)
    await expect(page.locator('button[type="submit"]')).toBeEnabled()

    await expect(page.locator('#email')).toHaveValue(ENV.user.email)
    await expect(page.locator('#password')).toHaveValue('definitely-not-the-real-password')
})

test('TC-LI-003 — Password visibility toggle', async ({ page }) => {
    await gotoLogin(page)
    await page.fill('#password', 'secret-value-123')

    const password = page.locator('#password')
    const eye = page.locator('button[aria-label="Show password"], button[aria-label="Hide password"]')

    await expect(password).toHaveAttribute('type', 'password')
    await expect(eye).toHaveAttribute('aria-label', 'Show password')

    await eye.click()
    await expect(password).toHaveAttribute('type', 'text')
    await expect(eye).toHaveAttribute('aria-label', 'Hide password')

    await eye.click()
    await expect(password).toHaveAttribute('type', 'password')
    await expect(eye).toHaveAttribute('aria-label', 'Show password')
})

test('TC-LI-004 — Forgot password link navigates correctly', async ({ page }) => {
    await gotoLogin(page)
    await page.locator('a[href="/forgot-password"]').click()
    await page.waitForURL(/\/forgot-password\b/, { timeout: 5_000 })
    expect(page.url()).toMatch(/\/forgot-password\b/)

    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.waitForLoadState('domcontentloaded')
    expect(errors, 'forgot-password page should render without JS errors').toEqual([])
})

test('TC-LI-005 — Create account link navigates correctly', async ({ page }) => {
    await gotoLogin(page)
    await page.locator('a', { hasText: 'Create account' }).first().click()
    await page.waitForURL(/\/signup\b/, { timeout: 5_000 })
    expect(page.url()).toMatch(/\/signup\b/)

    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.waitForLoadState('domcontentloaded')
    expect(errors, 'signup page should render without JS errors').toEqual([])
})
