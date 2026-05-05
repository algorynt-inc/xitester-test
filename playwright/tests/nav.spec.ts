import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

/** The org switcher trigger has a "Find organization..." search inside its menu. */
async function openOrgSwitcher(page: Page): Promise<void> {
    // The breadcrumb shows the current org name; the haspopup button next to
    // it is the trigger. Pick the one that opens the menu containing
    // "Find organization...".
    const triggers = page.locator('header button[aria-haspopup="menu"]:visible')
    const count = await triggers.count()
    for (let i = 0; i < count; i++) {
        await triggers.nth(i).click()
        const search = page.locator('input[placeholder="Find organization..."]')
        if (await search.isVisible().catch(() => false)) return
        // Close and try next.
        await page.keyboard.press('Escape')
    }
    throw new Error('Could not locate the org switcher dropdown trigger')
}

async function openProjectSwitcher(page: Page): Promise<void> {
    const triggers = page.locator('header button[aria-haspopup="menu"]:visible')
    const count = await triggers.count()
    for (let i = 0; i < count; i++) {
        await triggers.nth(i).click()
        const search = page.locator('input[placeholder="Find project..."]')
        if (await search.isVisible().catch(() => false)) return
        await page.keyboard.press('Escape')
    }
    throw new Error('Could not locate the project switcher dropdown trigger')
}

// ============================================================
// Org switcher (TC-056..058)
// ============================================================

test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openOrgSwitcher(page)
    // The popup should contain the search input plus at least one org row.
    await expect(page.locator('input[placeholder="Find organization..."]')).toBeVisible({
        timeout: 5_000,
    })
    // At least one org item should be listed (excluding the search input + footer).
    const items = page.locator('[role="menuitem"]:visible')
    expect(await items.count()).toBeGreaterThan(0)
})

test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openOrgSwitcher(page)
    const search = page.locator('input[placeholder="Find organization..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    // Type a partial name that should match the seeded "XiTester" org.
    await search.fill('XiTester')
    await expect(
        page.getByRole('menuitem', { name: /XiTester/i }).first(),
    ).toBeVisible({ timeout: 4_000 })

    // Filter to nonsense → no items.
    await search.fill(`xt-nomatch-${Date.now()}`)
    await expect(page.getByRole('menuitem')).toHaveCount(0, { timeout: 4_000 })
})

test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openOrgSwitcher(page)
    await page.getByRole('menuitem', { name: /All Organizations/i }).click()
    await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/organizations\b/)
})

// ============================================================
// Project switcher (TC-059..062)
// ============================================================

test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    // "All Projects" → /org/projects.
    await openProjectSwitcher(page)
    await page.getByRole('menuitem', { name: /All Projects/i }).click()
    await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/org\/projects\b/)

    // Navigate back to dashboard, then "New project" → /org/projects (same
    // page, but with create-modal context). The SUT routes both to the same
    // page; the assertion is just that the URL still matches /org/projects.
    await page.goto('/dashboard')
    await openProjectSwitcher(page)
    await page.getByRole('menuitem', { name: /New project/i }).click()
    await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/org\/projects\b/)
})

test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openProjectSwitcher(page)
    await expect(page.locator('input[placeholder="Find project..."]')).toBeVisible({
        timeout: 5_000,
    })

    const items = page.locator('[role="menuitem"]:visible').filter({
        hasNotText: /(All Projects|New project)/i,
    })
    expect(await items.count()).toBeGreaterThan(0)
})

test('TC-061 — Verify Project search inside dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openProjectSwitcher(page)
    const search = page.locator('input[placeholder="Find project..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    await search.fill('Default')
    await expect(
        page.getByRole('menuitem', { name: /Default Project/i }).first(),
    ).toBeVisible({ timeout: 4_000 })

    await search.fill(`xt-nomatch-${Date.now()}`)
    await expect(
        page.locator('[role="menuitem"]:visible').filter({
            hasNotText: /(All Projects|New project)/i,
        }),
    ).toHaveCount(0, { timeout: 4_000 })
})

test('TC-062 — Verify Project search inside dropdown (clear restores list)', async ({ page }) => {
    // Per the source data this row is identical to TC-061. Re-asserting from
    // a different angle — search → clear → all results return — so we get
    // distinct coverage rather than a literal duplicate.
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')
    await page.waitForLoadState('domcontentloaded')

    await openProjectSwitcher(page)
    const search = page.locator('input[placeholder="Find project..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    const items = page.locator('[role="menuitem"]:visible').filter({
        hasNotText: /(All Projects|New project)/i,
    })
    const initialCount = await items.count()
    expect(initialCount).toBeGreaterThan(0)

    await search.fill('Default')
    await expect(
        page.getByRole('menuitem', { name: /Default Project/i }).first(),
    ).toBeVisible({ timeout: 4_000 })

    await search.fill('')
    await expect(items.first()).toBeVisible({ timeout: 4_000 })
    expect(await items.count(), 'clearing search should restore the full list').toBeGreaterThanOrEqual(
        initialCount,
    )
})
