import { test, expect, type Locator, type Page } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

/**
 * Locator notes — verified against the actual SUT DOM.
 * --------------------------------------------------------------------
 * OrgBreadcrumb (TopBar.tsx ~line 184) and ProjectSwitcher
 * (ProjectSwitcher.tsx ~line 60) both render their dropdown as:
 *
 *   <button>{Org|Project name}</button>           ← navigate-only label
 *   <DropdownMenuTrigger asChild>
 *     <button> <ChevronsUpDown /> </button>       ← THIS is the trigger
 *   </DropdownMenuTrigger>
 *
 * Both triggers are tiny icon-only buttons whose only child is a
 * Lucide `ChevronsUpDown` SVG (rendered with class
 * `lucide-chevrons-up-down`).
 *
 * Org breadcrumb is the FIRST chevron in the topbar. Project switcher
 * is the SECOND, but is only mounted on project-scoped pages
 * (/dashboard, /api-tester, etc.). On org-level pages
 * (/organizations, /org/projects, /org/team) ProjectSwitcher is
 * intentionally omitted.
 *
 * Inside each popup, list items are plain <button> elements (NOT
 * role="menuitem"), so we scope to the popup container and select
 * by button text.
 */

const TOPBAR_CHEVRON = 'button:has(svg.lucide-chevrons-up-down):visible'

async function waitForTopbar(page: Page): Promise<void> {
    await page.locator('header').waitFor({ state: 'visible', timeout: 10_000 })
    // Memoised TopBar can briefly mount without children. Wait for at least
    // one chevron trigger before iterating.
    await page.locator(TOPBAR_CHEVRON).first().waitFor({ state: 'visible', timeout: 8_000 })
}

async function openOrgSwitcher(page: Page): Promise<void> {
    await waitForTopbar(page)
    await page.locator(TOPBAR_CHEVRON).first().click()
    await page
        .locator('input[placeholder="Find organization..."]')
        .waitFor({ state: 'visible', timeout: 6_000 })
}

async function openProjectSwitcher(page: Page): Promise<void> {
    await waitForTopbar(page)
    const triggers = page.locator(TOPBAR_CHEVRON)
    const count = await triggers.count()
    if (count < 2) {
        throw new Error(
            `Project switcher chevron not visible. Found ${count} chevron trigger(s) in the topbar. ` +
                'The page must be a project-scoped route (e.g. /dashboard). On org-level pages ' +
                '(/organizations, /org/projects, /org/team) ProjectSwitcher is intentionally omitted.',
        )
    }
    await triggers.last().click()
    await page
        .locator('input[placeholder="Find project..."]')
        .waitFor({ state: 'visible', timeout: 6_000 })
}

/** Open dropdown popup. Walk up from the visible "Find …" input to the
 *  Radix popover content root, so list-item assertions are scoped to
 *  the popup and don't accidentally match buttons in the underlying page.
 */
function popupContent(page: Page): Locator {
    return page
        .locator('input[placeholder^="Find"]')
        .locator('xpath=ancestor::div[contains(@class, "p-0")][1]')
}

// ============================================================
// Org switcher (TC-056..058)
// ============================================================

test('TC-056 — Verify Organization Switch dropdown shows orgs', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openOrgSwitcher(page)
    const popup = popupContent(page)

    await expect(popup.locator('input[placeholder="Find organization..."]')).toBeVisible({
        timeout: 5_000,
    })
    const items = popup.locator('button').filter({ hasNotText: /^All Organizations$/ })
    expect(await items.count(), 'at least one org row should be listed').toBeGreaterThan(0)
})

test('TC-057 — Verify Organization search inside dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openOrgSwitcher(page)
    const popup = popupContent(page)
    const search = popup.locator('input[placeholder="Find organization..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    await search.fill('XiTester')
    await expect(
        popup.locator('button', { hasText: /XiTester/i }).first(),
        '"XiTester" should remain visible when filtering by "XiTester"',
    ).toBeVisible({ timeout: 4_000 })

    await search.fill(`xt-nomatch-${Date.now()}`)
    // The SUT shows "No organizations found" for an empty filter (TopBar.tsx ~line 215).
    await expect(popup.getByText(/no organizations found/i)).toBeVisible({ timeout: 4_000 })
})

test('TC-058 — Verify "All Organizations" navigates to /organizations', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openOrgSwitcher(page)
    const popup = popupContent(page)
    await popup.locator('button', { hasText: /^All Organizations$/ }).click()

    await page.waitForURL(/\/organizations\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/organizations\b/)
})

// ============================================================
// Project switcher (TC-059..062)
// ============================================================

test('TC-059 — Verify "All Projects" + "New project" navigation from project dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    // "All Projects" → /org/projects
    await openProjectSwitcher(page)
    let popup = popupContent(page)
    await popup.locator('button', { hasText: /^All Projects$/ }).click()
    await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/org\/projects\b/)

    // "New project" → /org/projects (the SUT opens its create dialog from there)
    await page.goto('/dashboard')
    await openProjectSwitcher(page)
    popup = popupContent(page)
    await popup.locator('button', { hasText: /^New project$/ }).click()
    await page.waitForURL(/\/org\/projects\b/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/org\/projects\b/)
})

test('TC-060 — Verify Project switch dropdown lists projects', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openProjectSwitcher(page)
    const popup = popupContent(page)

    await expect(popup.locator('input[placeholder="Find project..."]')).toBeVisible({
        timeout: 5_000,
    })
    const items = popup
        .locator('button')
        .filter({ hasNotText: /^(All Projects|New project)$/ })
    expect(await items.count(), 'at least one project row should be listed').toBeGreaterThan(0)
})

test('TC-061 — Verify Project search inside dropdown', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openProjectSwitcher(page)
    const popup = popupContent(page)
    const search = popup.locator('input[placeholder="Find project..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    await search.fill('Default')
    await expect(
        popup.locator('button', { hasText: /Default Project/i }).first(),
    ).toBeVisible({ timeout: 4_000 })

    await search.fill(`xt-nomatch-${Date.now()}`)
    const items = popup
        .locator('button')
        .filter({ hasNotText: /^(All Projects|New project)$/ })
    await expect(items).toHaveCount(0, { timeout: 4_000 })
})

test('TC-062 — Verify Project search inside dropdown (clear restores list)', async ({ page }) => {
    // Per source data this row is identical to TC-061. Re-asserts from a
    // different angle — search → clear → all rows return.
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    await page.goto('/dashboard')

    await openProjectSwitcher(page)
    const popup = popupContent(page)
    const search = popup.locator('input[placeholder="Find project..."]')
    await expect(search).toBeVisible({ timeout: 5_000 })

    const items = popup
        .locator('button')
        .filter({ hasNotText: /^(All Projects|New project)$/ })
    const initialCount = await items.count()
    expect(initialCount).toBeGreaterThan(0)

    await search.fill('Default')
    await expect(
        popup.locator('button', { hasText: /Default Project/i }).first(),
    ).toBeVisible({ timeout: 4_000 })

    await search.fill('')
    expect(
        await items.count(),
        'clearing the search should restore the full list',
    ).toBeGreaterThanOrEqual(initialCount)
})
