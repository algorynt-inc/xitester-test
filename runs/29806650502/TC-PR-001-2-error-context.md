# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> TC-PR-001 — View project list
- Location: tests/projects.spec.ts:111:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Search for a project"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]: 404 page not found
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | test.describe.configure({ mode: 'serial' })
  5   | // Authenticated via auth.setup.
  6   | test.use({ storageState: '.auth/user.json' })
  7   | 
  8   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  9   | // const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  10  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  11  | 
  12  | // "Default Project" is seeded in every XiTester organisation; the View test
  13  | // uses it deterministically rather than picking the first card it sees.
  14  | const DEFAULT_PROJECT_NAME = 'Default Project'
  15  | 
  16  | // ============================================================
  17  | // Helpers — drive the actual SPA modals like a real user would.
  18  | // ------------------------------------------------------------
  19  | // Important: shadcn <Input> components have NO id attribute. Inputs are
  20  | // identified by placeholder text, scoped to the open dialog so the create
  21  | // and edit modals don't collide on shared placeholders.
  22  | // ============================================================
  23  | 
  24  | async function gotoProjects(page: Page): Promise<void> {
  25  |     await page.goto('/org/projects')
> 26  |     await page.locator('input[placeholder="Search for a project"]').waitFor({ state: 'visible', timeout: 15_000 })
      |                                                                     ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  27  | }
  28  | 
  29  | /**
  30  |  * Locate the project card whose visible name is `name`. Project cards are
  31  |  * <div onClick> elements (not buttons) wrapping an h3 (grid view) or a
  32  |  * .font-medium div (list view) that displays the name. We climb to the
  33  |  * nearest cursor-pointer ancestor, which is the clickable card root and
  34  |  * also contains the kebab button.
  35  |  */
  36  | function projectCard(page: Page, name: string): Locator {
  37  |     return page
  38  |         .locator('main')
  39  |         .getByText(name, { exact: true })
  40  |         .locator('xpath=ancestor::div[contains(@class, "cursor-pointer")][1]')
  41  | }
  42  | 
  43  | async function uiCreateProject(page: Page, name: string, description?: string): Promise<void> {
  44  |     await gotoProjects(page)
  45  |     await page.locator('button', { hasText: 'New project' }).first().click()
  46  | 
  47  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create New Project' })
  48  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  49  | 
  50  |     await dialog.getByPlaceholder('My Project').fill(name)
  51  |     if (description) {
  52  |         await dialog.getByPlaceholder('Optional description...').fill(description)
  53  |     }
  54  | 
  55  |     await Promise.all([
  56  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'POST'),
  57  |         dialog.locator('button', { hasText: 'Create Project' }).first().click(),
  58  |     ])
  59  |     // SPA closes the dialog and navigates to /dashboard on success.
  60  |     await dialog.waitFor({ state: 'hidden', timeout: 10_000 })
  61  | }
  62  | 
  63  | async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
  64  |     await gotoProjects(page)
  65  |     const card = projectCard(page, projectName)
  66  |     await expect(card, `card for "${projectName}" should be in the list`).toBeVisible({ timeout: 8_000 })
  67  | 
  68  |     // Kebab is `opacity-0 group-hover:opacity-100` — hover the card first
  69  |     // so the button becomes visible and clickable like for a real user.
  70  |     await card.hover()
  71  |     const kebab = card.locator('button').first()
  72  |     await kebab.click({ force: true })
  73  | 
  74  |     await page.getByRole('menuitem', { name: action }).click()
  75  | }
  76  | 
  77  | async function uiUpdateProjectName(page: Page, currentName: string, newName: string): Promise<void> {
  78  |     await openKebabAction(page, currentName, 'Edit')
  79  | 
  80  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Project' })
  81  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  82  | 
  83  |     const nameInput = dialog.getByPlaceholder('My Project')
  84  |     await nameInput.fill(newName)
  85  | 
  86  |     await Promise.all([
  87  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
  88  |         dialog.locator('button', { hasText: 'Save changes' }).first().click(),
  89  |     ])
  90  |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  91  | }
  92  | 
  93  | async function uiDeleteProject(page: Page, name: string): Promise<void> {
  94  |     await openKebabAction(page, name, 'Delete')
  95  | 
  96  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Delete Project' })
  97  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  98  | 
  99  |     await Promise.all([
  100 |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
  101 |         dialog.locator('button', { hasText: 'Delete Project' }).first().click(),
  102 |     ])
  103 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  104 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  105 | }
  106 | 
  107 | // ============================================================
  108 | // Tests — flat list, no categories
  109 | // ============================================================
  110 | 
  111 | test('TC-PR-001 — View project list', async ({ page }) => {
  112 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  113 | 
  114 |     await gotoProjects(page)
  115 |     await expect(
  116 |         page.locator('input[placeholder="Search for a project"]'),
  117 |     ).toBeVisible({ timeout: 10_000 })
  118 |     await expect(
  119 |         page.locator('button', { hasText: 'New project' }).first(),
  120 |     ).toBeVisible()
  121 | })
  122 | 
  123 | test('TC-PR-002 — Create a new project', async ({ page }) => {
  124 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  125 |     const tempName = `qa-prj-${ts()}`
  126 | 
```