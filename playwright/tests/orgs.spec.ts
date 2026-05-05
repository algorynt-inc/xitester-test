import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

// Every test in this file starts already authenticated, courtesy of the
// `setup` project (auth.setup.ts). Zero login attempts in this spec.
test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

// ============================================================
// Helpers — UI-only, no API calls. Each helper drives the actual SPA
// just like a real user would, so the SUT's own client/SDK does the
// network work.
// ============================================================

const PLAN_BLOCKED = 'PLAN_BLOCKED:UI'

/**
 * Click "New organization", fill the modal, submit. Throws PLAN_BLOCKED
 * when the button is disabled (free-tier accounts). The newly created
 * org becomes the user's current context (the SPA switches automatically
 * after a successful create).
 */
async function uiCreateOrg(page: Page, name: string, description?: string): Promise<void> {
    await page.goto('/organizations')
    const newBtn = page.locator('button', { hasText: 'New organization' }).first()
    await expect(newBtn).toBeVisible({ timeout: 10_000 })
    if (!(await newBtn.isEnabled())) {
        throw new Error(PLAN_BLOCKED)
    }
    await newBtn.click()

    const nameInput = page.locator('#orgName')
    await expect(nameInput).toBeVisible({ timeout: 5_000 })
    await nameInput.fill(name)
    if (description) {
        await page.locator('#orgDesc').fill(description)
    }

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
        page.locator('button[type="submit"]', { hasText: /^Create/ }).first().click(),
    ])
    // Modal closes on success.
    await expect(nameInput).toBeHidden({ timeout: 5_000 })
}

/** Click an org card on /organizations to switch context to it. */
async function uiSwitchToOrg(page: Page, name: string): Promise<void> {
    await page.goto('/organizations')
    await page.locator('main button', { hasText: name }).first().click()
    await page.waitForLoadState('domcontentloaded')
}

/** Drive the danger-zone delete dialog. Assumes the named org is the current context. */
async function uiDeleteOrg(page: Page, name: string): Promise<void> {
    await page.goto('/org/settings/danger-zone')
    await page.locator('button', { hasText: 'Delete this organization' }).first().click()

    const confirmInput = page.locator('div[role="dialog"] input').first()
    await expect(confirmInput).toBeVisible({ timeout: 5_000 })
    await confirmInput.fill(name)

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
        page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first().click(),
    ])
    await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
}

// ============================================================
// Tests — flat list, no categories
// ============================================================

test('TC-ORG-001 — View organization list', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/organizations')
    await expect(
        page.locator('input[placeholder="Search for an organization"]'),
    ).toBeVisible({ timeout: 10_000 })

    const orgButtons = page
        .locator('main button')
        .filter({ hasNotText: 'New organization' })
    await expect(orgButtons.first()).toBeVisible({ timeout: 10_000 })
})

test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/organizations')
    const search = page.locator('input[placeholder="Search for an organization"]')
    await expect(search).toBeVisible({ timeout: 10_000 })

    const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
    expect(await orgButtons.count()).toBeGreaterThan(0)

    // Positive: searching for "XiTester" keeps the XiTester card visible.
    await search.fill('XiTester')
    await expect(
        page.locator('main button').filter({ hasText: /XiTester/i }).first(),
        '"XiTester" card should remain visible when filtering by "XiTester"',
    ).toBeVisible({ timeout: 4_000 })

    // Positive: searching for "API" keeps the API-Tester card visible.
    await search.fill('API')
    await expect(
        page.locator('main button').filter({ hasText: /API-?Tester/i }).first(),
        '"API-Tester" card should remain visible when filtering by "API"',
    ).toBeVisible({ timeout: 4_000 })

    // Negative: a string that matches no org hides every card.
    await search.fill(`xt-nomatch-${ts()}`)
    await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })

    // Clearing restores the full list.
    await search.fill('')
    await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
})

test('TC-ORG-003 — View organization settings', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/organizations')
    await page.locator('main button').filter({ hasNotText: 'New organization' }).first().click()

    await page.goto('/org/settings/general')

    const orgName = page.locator('#orgName')
    const orgSlug = page.locator('#orgSlug')
    const orgDescription = page.locator('#orgDescription')

    await expect(orgName).toBeVisible({ timeout: 10_000 })
    await expect(orgSlug).toBeVisible()
    await expect(orgDescription).toBeVisible()

    await expect(orgName).not.toHaveValue('')
    await expect(orgSlug).not.toHaveValue('')
    await expect(orgSlug).toHaveAttribute('readonly', '')
})

test('TC-ORG-004 — Create a new organization', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-tmp-${ts()}`

    try {
        await uiCreateOrg(page, tempName, 'Created by Playwright TC-ORG-004')
    } catch (err) {
        if ((err as Error).message === PLAN_BLOCKED) {
            test.skip(true, 'Create button is disabled — likely a plan-tier restriction.')
            return
        }
        throw err
    }

    // The new org should be visible somewhere on the page (org list or top bar).
    await page.goto('/organizations')
    await expect(page.locator('main button', { hasText: tempName }).first()).toBeVisible({ timeout: 8_000 })

    // Cleanup via UI — switch to the org and delete it.
    await uiSwitchToOrg(page, tempName)
    await uiDeleteOrg(page, tempName)
})

test('TC-ORG-005 — Update organization name', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-tmp-${ts()}`

    try {
        await uiCreateOrg(page, tempName)
    } catch (err) {
        if ((err as Error).message === PLAN_BLOCKED) {
            test.skip(true, 'Org creation disabled — plan tier.')
            return
        }
        throw err
    }
    await uiSwitchToOrg(page, tempName)

    await page.goto('/org/settings/general')
    const nameInput = page.locator('#orgName')
    await expect(nameInput).toBeVisible({ timeout: 10_000 })

    const newName = `qa-renamed-${ts()}`
    await nameInput.fill(newName)

    const save = page.locator('button', { hasText: 'Save Changes' }).first()
    const [response] = await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'PUT'),
        save.click(),
    ])
    expect(response.status()).toBe(200)

    await expect(page.locator('[data-sonner-toaster]')).toContainText(/updated successfully/i, { timeout: 5_000 })
    await expect(save).toBeDisabled({ timeout: 3_000 })

    // Cleanup
    await uiDeleteOrg(page, newName)
})

test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-del-${ts()}`

    try {
        await uiCreateOrg(page, tempName)
    } catch (err) {
        if ((err as Error).message === PLAN_BLOCKED) {
            test.skip(true, 'Org creation disabled — plan tier.')
            return
        }
        throw err
    }
    await uiSwitchToOrg(page, tempName)

    // The delete IS the test — no separate cleanup needed.
    await page.goto('/org/settings/danger-zone')
    await page.locator('button', { hasText: 'Delete this organization' }).first().click()

    const confirmInput = page.locator('div[role="dialog"] input').first()
    await expect(confirmInput).toBeVisible({ timeout: 5_000 })
    await confirmInput.fill(tempName)

    const [response] = await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
        page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first().click(),
    ])
    expect([200, 204]).toContain(response.status())

    await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
    await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
})

test('TC-ORG-007 — Create rejects duplicate name', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const sharedName = `qa-dup-${ts()}`

    // Seed the first org via the same UI flow.
    try {
        await uiCreateOrg(page, sharedName)
    } catch (err) {
        if ((err as Error).message === PLAN_BLOCKED) {
            test.skip(true, 'Org creation disabled — plan tier.')
            return
        }
        throw err
    }

    // Now try to create another with the SAME name.
    await page.goto('/organizations')
    const newBtn = page.locator('button', { hasText: 'New organization' }).first()
    await newBtn.click()

    const nameInput = page.locator('#orgName')
    await expect(nameInput).toBeVisible({ timeout: 5_000 })
    await nameInput.fill(sharedName)

    const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
    const [response] = await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
        submit.click(),
    ])
    expect(response.status(), 'duplicate-name create should fail with 4xx').toBeGreaterThanOrEqual(400)
    expect(response.status()).toBeLessThan(500)

    // Modal stays open + an error message surfaces somewhere.
    await expect(nameInput).toBeVisible()
    const ERR_RE = /(already|exists|duplicate|taken|in use)/i
    const inlineErr = page.locator('div[role="dialog"]').getByText(ERR_RE).first()
    const toastErr = page.locator('[data-sonner-toaster]').getByText(ERR_RE).first()
    await expect(inlineErr.or(toastErr)).toBeVisible({ timeout: 5_000 })

    // Close the modal so cleanup doesn't fight it.
    await page.locator('div[role="dialog"] button', { hasText: /^Cancel/i }).first().click().catch(() => undefined)

    // Cleanup the seeded org.
    await uiSwitchToOrg(page, sharedName)
    await uiDeleteOrg(page, sharedName)
})
