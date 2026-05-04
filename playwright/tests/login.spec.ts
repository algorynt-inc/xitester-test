import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

async function gotoLogin(page: Page): Promise<void> {
    await page.goto('/login')
    await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
    await page.locator('button[type="submit"]').waitFor({ state: 'visible', timeout: 15_000 })
}

async function isInvalid(page: Page, selector: string): Promise<boolean> {
    return page.$eval(selector, (el) => !(el as HTMLInputElement).validity.valid)
}

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

// ============================================================
// A. Happy Path
// ============================================================

test.describe('A. Happy Path', () => {
    test('TC-LI-001 — Successful login with valid credentials', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

        await gotoLogin(page)
        await page.fill('#email', ENV.user.email)
        await page.fill('#password', ENV.user.password)

        // Brief loading state — button text changes and is disabled.
        const submit = page.locator('button[type="submit"]')
        const [response] = await Promise.all([
            page.waitForResponse(/\/api\/v1\/auth\/login\b/),
            submit.click(),
        ])
        expect(response.status(), 'login API should return 200').toBe(200)

        // App navigates away from /login.
        await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 })
        expect(page.url()).not.toMatch(/\/login(\?|$|#)/)
    })
})

// ============================================================
// B. Error Handling
// ============================================================

test.describe('B. Error Handling', () => {
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

        // Toast surfaces somewhere in the Sonner container.
        const toaster = page.locator('[data-sonner-toaster]')
        await expect(toaster).toContainText(/login failed|invalid|incorrect/i, { timeout: 5_000 })

        // URL stays on /login and submit re-enables.
        expect(page.url()).toMatch(/\/login(\?|$|#)/)
        await expect(page.locator('button[type="submit"]')).toBeEnabled()

        // Field values preserved.
        await expect(page.locator('#email')).toHaveValue(ENV.user.email)
        await expect(page.locator('#password')).toHaveValue('definitely-not-the-real-password')
    })

    test('TC-LI-003 — Empty fields blocked by browser validation', async ({ page }) => {
        let loginRequestFired = false
        page.on('request', (req) => {
            if (req.method() === 'POST' && req.url().includes('/api/v1/auth/login')) {
                loginRequestFired = true
            }
        })

        await gotoLogin(page)
        await page.locator('button[type="submit"]').click()
        // Give the browser a beat to surface the native validation tooltip.
        await page.waitForTimeout(300)

        expect(await isInvalid(page, '#email'), 'Email should be reported invalid by HTML5').toBe(true)
        expect(loginRequestFired, 'no API request should fire on empty submit').toBe(false)
        expect(page.url()).toMatch(/\/login(\?|$|#)/)
    })

    test('TC-LI-007 — Invalid email format blocked by browser validation', async ({ page }) => {
        let loginRequestFired = false
        page.on('request', (req) => {
            if (req.method() === 'POST' && req.url().includes('/api/v1/auth/login')) {
                loginRequestFired = true
            }
        })

        await gotoLogin(page)
        await page.fill('#email', 'notanemail')
        await page.fill('#password', 'anything')
        await page.locator('button[type="submit"]').click()
        await page.waitForTimeout(300)

        expect(
            await isInvalid(page, '#email'),
            'Email field should be reported invalid by HTML5 (no @)',
        ).toBe(true)
        expect(loginRequestFired, 'no API request should fire when email is malformed').toBe(false)
        expect(page.url()).toMatch(/\/login(\?|$|#)/)
    })
})

// ============================================================
// C. UI Affordances
// ============================================================

test.describe('C. UI Affordances', () => {
    test('TC-LI-004 — Password visibility toggle', async ({ page }) => {
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
})

// ============================================================
// D. Adjacent Links
// ============================================================

test.describe('D. Adjacent Links', () => {
    test('TC-LI-005 — Forgot password link navigates correctly', async ({ page }) => {
        await gotoLogin(page)
        await page.locator('a[href="/forgot-password"]').click()
        await page.waitForURL(/\/forgot-password\b/, { timeout: 5_000 })
        expect(page.url()).toMatch(/\/forgot-password\b/)
        // No console errors on landing.
        const errors: string[] = []
        page.on('pageerror', (e) => errors.push(e.message))
        await page.waitForLoadState('domcontentloaded')
        expect(errors, 'forgot-password page should render without JS errors').toEqual([])
    })

    test('TC-LI-006 — Create account link navigates correctly', async ({ page }) => {
        await gotoLogin(page)
        await page.locator('a', { hasText: 'Create account' }).first().click()
        await page.waitForURL(/\/signup\b/, { timeout: 5_000 })
        expect(page.url()).toMatch(/\/signup\b/)

        const errors: string[] = []
        page.on('pageerror', (e) => errors.push(e.message))
        await page.waitForLoadState('domcontentloaded')
        expect(errors, 'signup page should render without JS errors').toEqual([])
    })
})
