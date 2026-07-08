import { test, expect, type Locator, type Page } from '@playwright/test'
import { ENV } from '../env'

test.describe.configure({ mode: 'serial' })
// Authenticated via auth.setup.
test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
// const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

// "Default Project" is seeded in every XiTester organisation; the View test
// uses it deterministically rather than picking the first card it sees.
const DEFAULT_PROJECT_NAME = 'Default Project'

// ============================================================
// Helpers — drive the actual SPA modals like a real user would.
// ------------------------------------------------------------
// Important: shadcn <Input> components have NO id attribute. Inputs are
// identified by placeholder text, scoped to the open dialog so the create
// and edit modals don't collide on shared placeholders.
// ============================================================

async function gotoProjects(page: Page): Promise<void> {
    await page.goto('/org/projects')
    await page.locator('input[placeholder="Search for a project"]').waitFor({ state: 'visible', timeout: 15_000 })
}

/**
 * Locate the project card whose visible name is `name`. Project cards are
 * <div onClick> elements (not buttons) wrapping an h3 (grid view) or a
 * .font-medium div (list view) that displays the name. We climb to the
 * nearest cursor-pointer ancestor, which is the clickable card root and
 * also contains the kebab button.
 */
function projectCard(page: Page, name: string): Locator {
    return page
        .locator('main')
        .getByText(name, { exact: true })
        .locator('xpath=ancestor::div[contains(@class, "cursor-pointer")][1]')
}

async function uiCreateProject(page: Page, name: string, description?: string): Promise<void> {
    await gotoProjects(page)
    await page.locator('button', { hasText: 'New project' }).first().click()

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Create New Project' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.getByPlaceholder('My Project').fill(name)
    if (description) {
        await dialog.getByPlaceholder('Optional description...').fill(description)
    }

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'POST'),
        dialog.locator('button', { hasText: 'Create Project' }).first().click(),
    ])
    // SPA closes the dialog and navigates to /dashboard on success.
    await dialog.waitFor({ state: 'hidden', timeout: 10_000 })
}

async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
    await gotoProjects(page)
    const card = projectCard(page, projectName)
    await expect(card, `card for "${projectName}" should be in the list`).toBeVisible({ timeout: 8_000 })

    // Kebab is `opacity-0 group-hover:opacity-100` — hover the card first
    // so the button becomes visible and clickable like for a real user.
    await card.hover()
    const kebab = card.locator('button').first()
    await kebab.click({ force: true })

    await page.getByRole('menuitem', { name: action }).click()
}

async function uiUpdateProjectName(page: Page, currentName: string, newName: string): Promise<void> {
    await openKebabAction(page, currentName, 'Edit')

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Project' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    const nameInput = dialog.getByPlaceholder('My Project')
    await nameInput.fill(newName)

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
        dialog.locator('button', { hasText: 'Save changes' }).first().click(),
    ])
    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiDeleteProject(page: Page, name: string): Promise<void> {
    await openKebabAction(page, name, 'Delete')

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Delete Project' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
        dialog.locator('button', { hasText: 'Delete Project' }).first().click(),
    ])
    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
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
    ).toBeVisible({ timeout: 10_000 })
    await expect(
        page.locator('button', { hasText: 'New project' }).first(),
    ).toBeVisible()
})

test('TC-PR-002 — Create a new project', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-prj-${ts()}`

    await uiCreateProject(page, tempName, 'Created by Playwright TC-PR-002')

    // After create, return to the list and confirm the new card appears.
    await gotoProjects(page)
    await expect(projectCard(page, tempName)).toBeVisible({ timeout: 8_000 })

    // Cleanup — delete the project we just created (per user spec).
    await uiDeleteProject(page, tempName)
})

test('TC-PR-003 — Open Default Project and land on the dashboard', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProjects(page)

    // Default Project is seeded in every org — deterministic target.
    const card = projectCard(page, DEFAULT_PROJECT_NAME)
    await expect(
        card,
        `"${DEFAULT_PROJECT_NAME}" card should be present in /org/projects`,
    ).toBeVisible({ timeout: 10_000 })
    await card.click()

    // Project selection navigates to /dashboard. Wait for the route change
    // and the page's H1 specifically so we're confident the dashboard
    // actually mounted (not just that the URL flipped). Targeting the H1
    // by name avoids the sidebar's "Dashboard" link, which would otherwise
    // collide under strict mode.
    await page.waitForURL(/\/dashboard\b/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/dashboard\b/)
    await expect(
        page.getByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeVisible({ timeout: 8_000 })
})

test('TC-PR-004 — Update project name (and revert)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const original = `qa-prj-${ts()}`
    const renamed = `qa-renamed-${ts()}`

    await uiCreateProject(page, original)

    // 1. Rename original → renamed.
    await uiUpdateProjectName(page, original, renamed)
    await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })
    await gotoProjects(page)
    await expect(projectCard(page, renamed)).toBeVisible({ timeout: 6_000 })
    await expect(page.getByText(original, { exact: true })).toBeHidden()

    // 2. Revert renamed → original. Two purposes: (a) verify bidirectional
    //    update works, (b) leave the name in a state we can confidently
    //    delete in cleanup if the rename in step 1 partially succeeded.
    await uiUpdateProjectName(page, renamed, original)
    await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })
    await gotoProjects(page)
    await expect(projectCard(page, original)).toBeVisible({ timeout: 6_000 })
    await expect(page.getByText(renamed, { exact: true })).toBeHidden()

    // Cleanup — delete the project we created.
    await uiDeleteProject(page, original)
})

test('TC-PR-005 — Delete a project we just created', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const tempName = `qa-del-${ts()}`

    await uiCreateProject(page, tempName)

    // Delete IS the test — uiDeleteProject already asserts the card is gone.
    await uiDeleteProject(page, tempName)
})

test('TC-041 — Project name shown in header after selecting Default Project', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProjects(page)
    const card = projectCard(page, DEFAULT_PROJECT_NAME)
    await expect(card).toBeVisible({ timeout: 10_000 })
    await card.click()

    // URL changes to /dashboard.
    await page.waitForURL(/\/dashboard\b/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/dashboard\b/)

    // The project name should appear in the topbar (project switcher button
    // text). The breadcrumb / project switcher shows the current project's
    // name on the left side of the header.
    const projectInHeader = page
        .locator('header')
        .getByText(DEFAULT_PROJECT_NAME, { exact: true })
        .first()
    await expect(
        projectInHeader,
        `"${DEFAULT_PROJECT_NAME}" should be visible in the header after selection`,
    ).toBeVisible({ timeout: 8_000 })
})
