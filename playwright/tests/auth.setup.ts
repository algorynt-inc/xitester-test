import { test as setup, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { ENV } from '../env'

/**
 * One-time UI login per workflow run. Drives the actual login form (so the
 * SPA hits the right backend regardless of apiBase config), waits for the
 * post-login redirect, and saves the resulting browser state — including
 * localStorage.auth_token_v1 — to playwright/.auth/user.json.
 *
 * Specs that need an authenticated session opt in via:
 *   test.use({ storageState: 'playwright/.auth/user.json' })
 *
 * Specs that test login itself (login.spec.ts) intentionally do NOT opt in
 * so they start from a fresh, unauthenticated state.
 */

export const AUTH_FILE = 'playwright/.auth/user.json'
const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] }, null, 2)

setup('authenticate once per run', async ({ page }) => {
    await mkdir(dirname(AUTH_FILE), { recursive: true })

    if (!ENV.user.email || !ENV.user.password) {
        // No creds in the env — write an empty state so dependent specs can
        // still load it (their own test.skip guards prevent execution).
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

    const token = await page.evaluate(() => window.localStorage.getItem('auth_token_v1'))
    expect(token, 'auth_token_v1 should be in localStorage after login').toBeTruthy()

    await page.context().storageState({ path: AUTH_FILE })
    // eslint-disable-next-line no-console
    console.log(`[auth.setup] Saved storageState for ${ENV.name} (token length=${token?.length ?? 0}).`)
})
