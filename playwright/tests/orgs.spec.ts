import { test, expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'
import { ENV } from '../env'

const LOGIN_API = `${ENV.apiBase}/api/v1/auth/login`
const ORG_API = `${ENV.apiBase}/api/v1/organizations`
const TOKEN_KEY = 'auth_token_v1'

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

/** One token per worker — avoids hammering /auth/login. */
let cachedToken: Promise<string> | null = null

async function loginViaApi(request: APIRequestContext): Promise<string> {
    const res = await request.post(LOGIN_API, {
        data: { email: ENV.user.email, password: ENV.user.password },
        failOnStatusCode: false,
    })
    if (!res.ok()) {
        throw new Error(`POST /auth/login returned ${res.status()}`)
    }
    const body = (await res.json()) as { access_token?: string; token?: string }
    const token = body.access_token ?? body.token
    if (!token) throw new Error('login response had no token')
    return token
}

async function ensureToken(request: APIRequestContext): Promise<string> {
    if (!cachedToken) cachedToken = loginViaApi(request)
    return cachedToken
}

async function seedAuth(context: BrowserContext, token: string): Promise<void> {
    await context.addInitScript(t => {
        try {
            window.localStorage.setItem('auth_token_v1', t as string)
        } catch {
            /* ignore */
        }
    }, token)
}

interface CreatedOrg {
    id: string
    name: string
    slug?: string
}

async function createTempOrg(request: APIRequestContext, token: string, name: string): Promise<CreatedOrg> {
    const res = await request.post(ORG_API, {
        headers: { Authorization: `Bearer ${token}` },
        data: { name, description: 'Created by Playwright orgs.spec.ts' },
        failOnStatusCode: false,
    })
    if (res.status() === 403 || res.status() === 402) {
        // Plan-tier restriction — surface clearly so the calling test can skip.
        throw new Error(`PLAN_BLOCKED:${res.status()}`)
    }
    if (!res.ok()) {
        const txt = await res.text().catch(() => '')
        throw new Error(`createTempOrg ${res.status()}: ${txt}`)
    }
    const data = (await res.json()) as { id: string; name: string; slug?: string }
    return { id: data.id, name: data.name, slug: data.slug }
}

async function deleteCurrentOrg(request: APIRequestContext, token: string): Promise<void> {
    await request.delete(ORG_API, {
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
    })
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
    test('TC-ORG-001 — View organization list', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

        await page.goto('/organizations')
        await expect(
            page.locator('input[placeholder="Search for an organization"]'),
            'org search input should be visible',
        ).toBeVisible({ timeout: 10_000 })

        // Heuristic: at least one org card should render. Cards are buttons that
        // contain the org name; we filter to "real" buttons (not the new-org CTA).
        const orgButtons = page
            .locator('main button')
            .filter({ hasNotText: 'New organization' })
        await expect(
            orgButtons.first(),
            'at least one org card should be visible',
        ).toBeVisible({ timeout: 10_000 })
    })

    test('TC-ORG-002 — Search filters the org list', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

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
    test('TC-ORG-003 — View organization settings', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

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

        // Name and slug should be populated for a real org.
        await expect(orgName).not.toHaveValue('')
        await expect(orgSlug).not.toHaveValue('')
        // Slug is read-only.
        await expect(orgSlug).toHaveAttribute('readonly', '')
    })
})

// ============================================================
// C. Create
// ============================================================

test.describe('C. Create', () => {
    let createdOrgId: string | null = null

    test.afterEach(async ({ request }) => {
        if (createdOrgId) {
            const token = await ensureToken(request).catch(() => null)
            if (token) await deleteCurrentOrg(request, token)
            createdOrgId = null
        }
    })

    test('TC-ORG-004 — Create a new organization', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

        await page.goto('/organizations')
        const newBtn = page.locator('button', { hasText: 'New organization' }).first()
        await expect(newBtn).toBeVisible({ timeout: 10_000 })

        // Plan-tier guard: if the create button is disabled, skip cleanly.
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

        // Capture the new org id for afterEach cleanup.
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
})

// ============================================================
// D. Update
// ============================================================

test.describe('D. Update', () => {
    let tempOrgId: string | null = null

    test.afterEach(async ({ request }) => {
        if (tempOrgId) {
            const token = await ensureToken(request).catch(() => null)
            if (token) await deleteCurrentOrg(request, token)
            tempOrgId = null
        }
    })

    test('TC-ORG-005 — Update organization name', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

        const tempName = `qa-tmp-${ts()}`
        let temp: CreatedOrg
        try {
            temp = await createTempOrg(request, token, tempName)
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
    test('TC-ORG-006 — Delete an organization via danger zone', async ({ page, context, request }) => {
        test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
        const token = await ensureToken(request)
        await seedAuth(context, token)

        const tempName = `qa-del-${ts()}`
        let temp: CreatedOrg
        try {
            temp = await createTempOrg(request, token, tempName)
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

        // Confirmation dialog requires typing the org name exactly.
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
        // App routes away from /org/settings — either to /organizations or signs out (login).
        await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 8_000 })
    })
})
