import { test, expect, type APIRequestContext, type Page } from '@playwright/test'
import { ENV } from '../env'

// Every test in this file starts already authenticated, courtesy of the
// `setup` project (auth.setup.ts) which runs once per workflow execution
// and saves storageState to playwright/.auth/user.json. Zero login attempts
// in this spec — the orgs suite reuses the single workflow-wide login.
test.use({ storageState: 'playwright/.auth/user.json' })

const ORG_API = `${ENV.apiBase}/api/v1/organizations`

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

interface CreatedOrg {
    id: string
    name: string
    slug?: string
}

/**
 * IMPORTANT: API helpers receive `page.request`, NOT the worker-scoped
 * `request` fixture. The SUT uses HTTP-only auth cookies that live on
 * the page's context — `page.request` automatically sends them, while
 * the standalone `request` fixture would 401 because it has no cookies.
 */
async function createTempOrg(request: APIRequestContext, name: string): Promise<CreatedOrg> {
    const res = await request.post(ORG_API, {
        data: { name, description: 'Created by Playwright orgs.spec.ts' },
        failOnStatusCode: false,
    })
    if (res.status() === 403 || res.status() === 402) {
        throw new Error(`PLAN_BLOCKED:${res.status()}`)
    }
    if (!res.ok()) {
        const txt = await res.text().catch(() => '')
        throw new Error(`createTempOrg ${res.status()}: ${txt}`)
    }
    const data = (await res.json()) as { id: string; name: string; slug?: string }
    return { id: data.id, name: data.name, slug: data.slug }
}

async function deleteCurrentOrg(request: APIRequestContext): Promise<void> {
    await request.delete(ORG_API, { failOnStatusCode: false })
}

async function gotoOrgSettings(page: Page, tab: 'general' | 'danger-zone' = 'general'): Promise<void> {
    await page.goto(`/org/settings/${tab}`)
    await page.waitForLoadState('domcontentloaded')
}

const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

// ============================================================
// A. Browse & Search
// ============================================================

test.describe('A. Browse & Search', () => {
    test('TC-ORG-001 — View organization list', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

        await page.goto('/organizations')
        await expect(
            page.locator('input[placeholder="Search for an organization"]'),
            'org search input should be visible',
        ).toBeVisible({ timeout: 10_000 })

        const orgButtons = page
            .locator('main button')
            .filter({ hasNotText: 'New organization' })
        await expect(
            orgButtons.first(),
            'at least one org card should be visible',
        ).toBeVisible({ timeout: 10_000 })
    })

    test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

        await page.goto('/organizations')
        const search = page.locator('input[placeholder="Search for an organization"]')
        await expect(search).toBeVisible({ timeout: 10_000 })

        const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
        const initialCount = await orgButtons.count()
        expect(initialCount, 'expected at least one org for search test').toBeGreaterThan(0)

        const noMatch = `xt-nomatch-${ts()}`
        await search.fill(noMatch)
        await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })

        await search.fill('')
        await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
    })
})

// ============================================================
// B. View
// ============================================================

test.describe('B. View', () => {
    test('TC-ORG-003 — View organization settings', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

        await page.goto('/organizations')
        const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
        await orgButtons.first().click()

        await gotoOrgSettings(page, 'general')

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
})

// ============================================================
// C. Create
// ============================================================

test.describe('C. Create', () => {
    let createdOrgId: string | null = null
    let pageRef: Page | null = null

    test.afterEach(async () => {
        if (createdOrgId && pageRef) {
            try {
                // Use the page's request context so the auth cookie is sent.
                await deleteCurrentOrg(pageRef.request)
            } catch {
                /* swallow cleanup errors so they don't mask the test failure */
            }
            createdOrgId = null
            pageRef = null
        }
    })

    test('TC-ORG-004 — Create a new organization', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        pageRef = page

        await page.goto('/organizations')
        const newBtn = page.locator('button', { hasText: 'New organization' }).first()
        await expect(newBtn).toBeVisible({ timeout: 10_000 })

        const enabled = await newBtn.isEnabled()
        test.skip(!enabled, 'Create button is disabled — likely a plan-tier restriction.')

        await newBtn.click()
        const nameInput = page.locator('#orgName')
        const descInput = page.locator('#orgDesc')
        await expect(nameInput).toBeVisible({ timeout: 5_000 })

        const tempName = `qa-tmp-${ts()}`
        await nameInput.fill(tempName)
        await descInput.fill('Created by Playwright TC-ORG-004')

        const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
        const [response] = await Promise.all([
            page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
            submit.click(),
        ])
        expect([200, 201]).toContain(response.status())

        try {
            const body = (await response.json()) as { id?: string }
            createdOrgId = body.id ?? null
        } catch {
            /* ignore */
        }

        // Modal should close and the new org name should be visible somewhere on the page.
        await expect(nameInput).toBeHidden({ timeout: 5_000 })
        await expect(page.getByText(tempName)).toBeVisible({ timeout: 8_000 })
    })

    test('TC-ORG-007 — Create rejects duplicate name', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        pageRef = page

        // Seed: create the first org via the SAME context so auth cookies flow.
        const sharedName = `qa-dup-${ts()}`
        let temp: CreatedOrg
        try {
            temp = await createTempOrg(page.request, sharedName)
        } catch (err) {
            if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
                test.skip(true, 'Org creation blocked by plan tier — cannot test duplicate-name without a seed.')
                return
            }
            throw err
        }
        createdOrgId = temp.id

        await page.goto('/organizations')
        const newBtn = page.locator('button', { hasText: 'New organization' }).first()
        await expect(newBtn).toBeVisible({ timeout: 10_000 })
        const enabled = await newBtn.isEnabled()
        test.skip(!enabled, 'Create button disabled (plan tier).')

        await newBtn.click()
        const nameInput = page.locator('#orgName')
        await expect(nameInput).toBeVisible({ timeout: 5_000 })
        await nameInput.fill(temp.name)

        const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
        const [response] = await Promise.all([
            page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
            submit.click(),
        ])

        expect(response.status(), 'duplicate-name create should fail with 4xx').toBeGreaterThanOrEqual(400)
        expect(response.status()).toBeLessThan(500)

        await expect(nameInput, 'modal should remain open after duplicate error').toBeVisible()

        const ERR_RE = /(already|exists|duplicate|taken|in use)/i
        const inlineErr = page.locator('div[role="dialog"]').getByText(ERR_RE).first()
        const toastErr = page.locator('[data-sonner-toaster]').getByText(ERR_RE).first()
        await expect(
            inlineErr.or(toastErr),
            'an "already exists / duplicate / taken / in use" error should be visible',
        ).toBeVisible({ timeout: 5_000 })
    })
})

// ============================================================
// D. Update
// ============================================================

test.describe('D. Update', () => {
    let tempOrgId: string | null = null
    let pageRef: Page | null = null

    test.afterEach(async () => {
        if (tempOrgId && pageRef) {
            try {
                await deleteCurrentOrg(pageRef.request)
            } catch {
                /* swallow */
            }
            tempOrgId = null
            pageRef = null
        }
    })

    test('TC-ORG-005 — Update organization name', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        pageRef = page

        const tempName = `qa-tmp-${ts()}`
        let temp: CreatedOrg
        try {
            temp = await createTempOrg(page.request, tempName)
        } catch (err) {
            if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
                test.skip(true, 'Org creation blocked by plan tier — cannot test update without writable temp org.')
                return
            }
            throw err
        }
        tempOrgId = temp.id

        await gotoOrgSettings(page, 'general')

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
    })
})

// ============================================================
// E. Delete
// ============================================================

test.describe('E. Delete', () => {
    test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

        const tempName = `qa-del-${ts()}`
        let temp: CreatedOrg
        try {
            temp = await createTempOrg(page.request, tempName)
        } catch (err) {
            if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
                test.skip(true, 'Org creation blocked by plan tier — cannot test delete without writable temp org.')
                return
            }
            throw err
        }

        await gotoOrgSettings(page, 'danger-zone')

        const deleteBtn = page.locator('button', { hasText: 'Delete this organization' }).first()
        await expect(deleteBtn).toBeVisible({ timeout: 10_000 })
        await deleteBtn.click()

        const confirmInput = page.locator('div[role="dialog"] input').first()
        await expect(confirmInput).toBeVisible({ timeout: 5_000 })
        await confirmInput.fill(temp.name)

        const confirmBtn = page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first()
        const [response] = await Promise.all([
            page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
            confirmBtn.click(),
        ])
        expect([200, 204]).toContain(response.status())

        await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
        await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 8_000 })
    })
})
