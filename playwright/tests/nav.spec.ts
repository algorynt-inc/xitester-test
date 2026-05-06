import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

type SwitcherKind = 'organization' | 'project'

/**
 * Open one of the topbar switcher dropdowns by iterating every visible
 * haspopup-style trigger on the page, clicking each, and checking
 * whether the resulting popup contains the expected search input.
 *
 * - Doesn't scope to <header>: in this SUT the switchers live inside a
 *   wider banner/topbar that may not be a literal <header>.
 * - Loosened placeholder match: case-insensitive substring on
 *   "organization" / "project" so wording differences ("Find a
 *   project") don't break it.
 * - Diagnostics: when no trigger matches, the thrown error includes
 *   a list of every haspopup button text found, so failure is debuggable
 *   from the trace.
 */
async function openSwitcher(page: Page, kind: SwitcherKind): Promise<void> {
    const triggers = page
        .locator('button[aria-haspopup="menu"]:visible, button[aria-haspopup="true"]:visible')
    const total = await triggers.count()

    const placeholderRegex = kind === 'organization' ? /organization/i : /project/i
    const seen: string[] = []

    for (let i = 0; i < total; i++) {
        const trigger = triggers.nth(i)
        const label = (await trigger.textContent().catch(() => '')) || '(no text)'
        seen.push(`#${i}: "${label.trim().slice(0, 40)}"`)

        try {
            await trigger.click()
        } catch {
            continue
        }
        // Radix renders the dropdown content asynchronously; give it a beat.
        await page.waitForTimeout(250)

        const search = page
            .locator('input:visible')
            .filter({ has: page.locator('xpath=self::input') })
            .filter({ hasText: '' }) // any input
        // Match by placeholder containing the kind keyword.
        const match = page
            .locator(`input[placeholder*="${kind}" i]:visible`)
            .first()
        if (await match.isVisible({ timeout: 1_500 }).catch(() => false)) {
            void search // keep typed
            return
        }
        // Close so the next iteration's click reaches a fresh trigger.
        await page.keyboard.press('Escape')
        await page.waitForTimeout(150)
    }

    throw new Error(
        `Could not open the ${kind} switcher. Tried ${total} haspopup triggers: ${seen.join(' | ') || '(none)'}.\n` +
            `Look at the most recent trace.zip for this test in the dashboard / Actions.`,
    )
}

async function openOrgSwitcher(page: Page): Promise<void> {
    return openSwitcher(page, 'organization')
}

async function openProjectSwitcher(page: Page): Promise<void> {
    return openSwitcher(page, 'project')
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
