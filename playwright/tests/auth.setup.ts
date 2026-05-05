import { test as setup, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { ENV } from '../env'

/**
 * One-time UI login per workflow run. Drives the actual login form (so the
 * SPA hits the right backend regardless of apiBase config), waits for the
 * post-login redirect, and saves the resulting browser state to
 * playwright/.auth/user.json.
 *
 * NOTE: the SUT now uses HTTP-only cookies for auth (xitester_access_token)
 * and returns access_token: null in the login response body, so the SPA
 * does NOT populate localStorage.auth_token_v1. We therefore don't assert
 * any specific localStorage key — storageState captures cookies + whatever
 * IS in localStorage, and that's all subsequent tests need. They send the
 * cookie automatically when they use `page.request` (or any
 * page-context-bound request).
 *
 * Specs that need an authenticated session opt in via:
 *   test.use({ storageState: 'playwright/.auth/user.json' })
 *
 * Specs that test login itself (login.spec.ts) intentionally do NOT opt
 * in so they start from a fresh, unauthenticated state.
 */

// Path is relative to the Playwright project's cwd (the `playwright/` dir),
// so the file lands at `playwright/.auth/user.json` from the repo root.
export const AUTH_FILE = '.auth/user.json'
const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] }, null, 2)

setup('authenticate once per run', async ({ page }) => {
    await mkdir(dirname(AUTH_FILE), { recursive: true })

    if (!ENV.user.email || !ENV.user.password) {
        await writeFile(AUTH_FILE, EMPTY_STATE, 'utf8')
        // eslint-disable-next-line no-console
        console.warn(`[auth.setup] No TEST_USER_EMAIL/PASSWORD for ${ENV.name}; wrote empty storageState.`)
        return
    }

    await page.goto('/login')
    await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
    await page.fill('#email', ENV.user.email)
    await page.fill('#password', ENV.user.password)
    await Promise.all([
        page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
        page.locator('button[type="submit"]').click(),
    ])

    // Sanity-check: the page should now be inside the app, not bouncing back
    // to /login. If we're still on /login, login silently failed and saving
    // an unauthed storageState is worse than failing now.
    expect(page.url(), 'login should have navigated away from /login').not.toMatch(/\/login(\?|$|#)/)

    // Diagnostics: log which auth carriers we captured. Either is fine.
    const cookies = await page.context().cookies()
    const authCookie = cookies.find(c => /xitester|access|session|token/i.test(c.name))
    const lsToken = await page.evaluate(() => {
        try {
            return window.localStorage.getItem('auth_token_v1')
        } catch {
            return null
        }
    })

    if (!authCookie && !lsToken) {
        throw new Error(
            'Login completed but no auth cookie or auth_token_v1 found. ' +
                `Cookies seen: ${cookies.map(c => c.name).join(', ') || '(none)'}. ` +
                'Storage state would be unauthenticated — failing fast so dependent tests skip cleanly.',
        )
    }

    await page.context().storageState({ path: AUTH_FILE })

    // eslint-disable-next-line no-console
    console.log(
        `[auth.setup] Saved storageState for ${ENV.name}. ` +
            `cookie=${authCookie?.name ?? 'none'} (${authCookie?.value ? authCookie.value.length + ' chars' : '-'}), ` +
            `localStorage.auth_token_v1=${lsToken ? lsToken.length + ' chars' : 'absent'}.`,
    )
})
