import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

// Authenticated via auth.setup.
test.use({ storageState: 'playwright/.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

// ============================================================
// Helpers — UI-only. The SUT exposes project CRUD as modal dialogs
// on /org/projects (no separate routes), driven via "New project",
// kebab → Edit, kebab → Delete.
// ============================================================

async function gotoProjects(page: Page): Promise<void> {
    await page.goto('/org/projects')
    await page.locator('input[placeholder="Search for a project"]').waitFor({ state: 'visible', timeout: 15_000 })
}

async function uiCreateProject(page: Page, name: string, description?: string): Promise<void> {
    await gotoProjects(page)
    await page.locator('button', { hasText: 'New project' }).first().click()

    const nameInput = page.locator('#createName')
    await expect(nameInput).toBeVisible({ timeout: 5_000 })
    await nameInput.fill(name)
    if (description) {
        await page.locator('#createDescription').fill(description)
    }

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'POST'),
        page.locator('button', { hasText: 'Create Project' }).first().click(),
    ])
    // SPA navigates to /dashboard for the new project on success. Wait for that
    // OR for the modal to close — either is success.
    await page.waitForLoadState('domcontentloaded')
}

/** Open the kebab menu on the project card matching `name` and click an action. */
async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
    await gotoProjects(page)
    // Each card is a flex row containing the project name; the kebab is its
    // sibling. We scope to the row that contains the name.
    const card = page
        .locator('main')
        .locator('article, [role="button"], div')
        .filter({ has: page.getByText(projectName, { exact: true }) })
        .first()
    // Try multiple kebab-button shapes — Lucide MoreHorizontal usually has aria-label.
    const kebab = card
        .locator('button[aria-haspopup], button[aria-label*="menu" i], button[aria-label*="more" i]')
        .first()
    await kebab.click()
    await page.getByRole('menuitem', { name: action }).click()
}

async function uiUpdateProject(page: Page, currentName: string, newName: string): Promise<void> {
    await openKebabAction(page, currentName, 'Edit')
    const nameInput = page.locator('#editName')
    await expect(nameInput).toBeVisible({ timeout: 5_000 })
    await nameInput.fill(newName)
    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
        page.locator('button', { hasText: 'Save changes' }).first().click(),
    ])
}

async function uiDeleteProject(page: Page, name: string): Promise<void> {
    await openKebabAction(page, name, 'Delete')
    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
        page.locator('div[role="dialog"] button', { hasText: 'Delete Project' }).first().click(),
    ])
    await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
}

// ============================================================
// Tests — flat list, no categories
// ============================================================

test('TC-PR-001 — View project list', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProjects(page)
    await expect(
        page.locator('input[placeholder="Search for a project"]'),
        'project search input should be visible',
    ).toBeVisible({ timeout: 10_000 })
    await expect(
        page.locator('button', { hasText: 'New project' }).first(),
        '"New project" button should be visible',
    ).toBeVisible()
})

test('TC-PR-002 — Create a new project', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-prj-${ts()}`

    await uiCreateProject(page, tempName, 'Created by Playwright TC-PR-002')

    // After create, the SPA selects the new project and navigates to the
    // dashboard. Going back to /org/projects should list the new card.
    await gotoProjects(page)
    await expect(page.getByText(tempName, { exact: true })).toBeVisible({ timeout: 8_000 })

    // Cleanup
    await uiDeleteProject(page, tempName)
})

test('TC-PR-003 — View an existing project', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProjects(page)

    // Click the first project card.
    const firstCardName = page
        .locator('main')
        .locator('button, article, [role="button"]')
        .filter({ hasNotText: /New project|Search|Active|Inactive|Name|Date/i })
        .first()
    await expect(firstCardName).toBeVisible({ timeout: 10_000 })
    await firstCardName.click()

    // SPA navigates to /dashboard scoped to the project.
    await page.waitForURL(/\/(dashboard|api-tester|test-cases|test-plans)/, { timeout: 8_000 })
})

test('TC-PR-004 — Update project name', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-prj-${ts()}`
    const renamed = `qa-renamed-${ts()}`

    await uiCreateProject(page, tempName)
    await uiUpdateProject(page, tempName, renamed)

    await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })

    await gotoProjects(page)
    await expect(page.getByText(renamed, { exact: true })).toBeVisible({ timeout: 6_000 })
    await expect(page.getByText(tempName, { exact: true })).toBeHidden()

    // Cleanup
    await uiDeleteProject(page, renamed)
})

test('TC-PR-005 — Delete a project', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-del-${ts()}`

    await uiCreateProject(page, tempName)

    // Delete is the test — no separate cleanup.
    await uiDeleteProject(page, tempName)

    // Final guard: refresh the list and confirm the card is gone.
    await gotoProjects(page)
    await expect(page.getByText(tempName, { exact: true })).toBeHidden({ timeout: 6_000 })
})
