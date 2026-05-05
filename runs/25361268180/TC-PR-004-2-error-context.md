# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> TC-PR-004 — Update project name
- Location: tests/projects.spec.ts:130:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#createName')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#createName')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - region "Notifications alt+T"
    - generic:
      - banner:
        - generic:
          - generic:
            - img
          - generic:
            - generic: /
            - generic:
              - button:
                - img
                - generic: qa-renamed-20260504190531
                - generic: Enterprise
              - button:
                - img
            - generic: /
            - generic: Projects
        - generic:
          - button:
            - img
            - generic: Search...
            - generic: ⌘K
          - generic:
            - button:
              - img
            - button:
              - img
              - generic: 99+
          - generic:
            - generic: DEV
            - generic: v1.1.0
            - button: A
      - generic:
        - complementary:
          - navigation [ref=e1]:
            - button [ref=e2] [cursor=pointer]:
              - img [ref=e4]
            - button [ref=e6] [cursor=pointer]:
              - img [ref=e8]
            - button [ref=e13] [cursor=pointer]:
              - img [ref=e15]
            - button [ref=e17] [cursor=pointer]:
              - img [ref=e19]
            - button [ref=e21] [cursor=pointer]:
              - img [ref=e23]
            - button [ref=e25] [cursor=pointer]:
              - img [ref=e27]
          - button [ref=e32] [cursor=pointer]:
            - img [ref=e34]
        - generic:
          - main:
            - generic:
              - heading [level=1]: Projects
              - generic:
                - generic:
                  - img
                  - textbox:
                    - /placeholder: Search for a project
                - separator
                - button:
                  - img
                  - text: Status
                - button:
                  - img
                  - text: Sort
                  - separator
                  - generic:
                    - generic: Name
                - generic:
                  - generic:
                    - button:
                      - img
                    - button:
                      - img
                  - button:
                    - img
                    - text: New project
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - heading [level=3]: Default Project
                        - paragraph: Auto-created default project
                      - button:
                        - img
                    - generic:
                      - generic: active
                  - generic:
                    - generic:
                      - generic:
                        - heading [level=3]: xs
                      - button:
                        - img
                    - generic:
                      - generic: active
  - dialog "Create New Project" [ref=e38]:
    - generic [ref=e39]:
      - heading "Create New Project" [level=2] [ref=e40]
      - paragraph [ref=e41]: Create a new project to organize your test cases and plans.
    - generic [ref=e42]:
      - generic [ref=e43]:
        - text: Name *
        - textbox "My Project" [active] [ref=e44]
        - paragraph [ref=e45]: Project name is required
      - generic [ref=e46]:
        - text: Description
        - textbox "Optional description..." [ref=e47]
      - generic [ref=e48]:
        - text: Application URL
        - textbox "https://app.example.com" [ref=e49]
    - generic [ref=e50]:
      - button "Cancel" [ref=e51] [cursor=pointer]
      - button "Create Project" [disabled]
    - button "Close" [ref=e52] [cursor=pointer]:
      - img [ref=e53]
      - generic [ref=e56]: Close
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Authenticated via auth.setup.
  5   | test.use({ storageState: 'playwright/.auth/user.json' })
  6   | 
  7   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  8   | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  9   | 
  10  | // ============================================================
  11  | // Helpers — UI-only. The SUT exposes project CRUD as modal dialogs
  12  | // on /org/projects (no separate routes), driven via "New project",
  13  | // kebab → Edit, kebab → Delete.
  14  | // ============================================================
  15  | 
  16  | async function gotoProjects(page: Page): Promise<void> {
  17  |     await page.goto('/org/projects')
  18  |     await page.locator('input[placeholder="Search for a project"]').waitFor({ state: 'visible', timeout: 15_000 })
  19  | }
  20  | 
  21  | async function uiCreateProject(page: Page, name: string, description?: string): Promise<void> {
  22  |     await gotoProjects(page)
  23  |     await page.locator('button', { hasText: 'New project' }).first().click()
  24  | 
  25  |     const nameInput = page.locator('#createName')
> 26  |     await expect(nameInput).toBeVisible({ timeout: 5_000 })
      |                             ^ Error: expect(locator).toBeVisible() failed
  27  |     await nameInput.fill(name)
  28  |     if (description) {
  29  |         await page.locator('#createDescription').fill(description)
  30  |     }
  31  | 
  32  |     await Promise.all([
  33  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'POST'),
  34  |         page.locator('button', { hasText: 'Create Project' }).first().click(),
  35  |     ])
  36  |     // SPA navigates to /dashboard for the new project on success. Wait for that
  37  |     // OR for the modal to close — either is success.
  38  |     await page.waitForLoadState('domcontentloaded')
  39  | }
  40  | 
  41  | /** Open the kebab menu on the project card matching `name` and click an action. */
  42  | async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
  43  |     await gotoProjects(page)
  44  |     // Each card is a flex row containing the project name; the kebab is its
  45  |     // sibling. We scope to the row that contains the name.
  46  |     const card = page
  47  |         .locator('main')
  48  |         .locator('article, [role="button"], div')
  49  |         .filter({ has: page.getByText(projectName, { exact: true }) })
  50  |         .first()
  51  |     // Try multiple kebab-button shapes — Lucide MoreHorizontal usually has aria-label.
  52  |     const kebab = card
  53  |         .locator('button[aria-haspopup], button[aria-label*="menu" i], button[aria-label*="more" i]')
  54  |         .first()
  55  |     await kebab.click()
  56  |     await page.getByRole('menuitem', { name: action }).click()
  57  | }
  58  | 
  59  | async function uiUpdateProject(page: Page, currentName: string, newName: string): Promise<void> {
  60  |     await openKebabAction(page, currentName, 'Edit')
  61  |     const nameInput = page.locator('#editName')
  62  |     await expect(nameInput).toBeVisible({ timeout: 5_000 })
  63  |     await nameInput.fill(newName)
  64  |     await Promise.all([
  65  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
  66  |         page.locator('button', { hasText: 'Save changes' }).first().click(),
  67  |     ])
  68  | }
  69  | 
  70  | async function uiDeleteProject(page: Page, name: string): Promise<void> {
  71  |     await openKebabAction(page, name, 'Delete')
  72  |     await Promise.all([
  73  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
  74  |         page.locator('div[role="dialog"] button', { hasText: 'Delete Project' }).first().click(),
  75  |     ])
  76  |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  77  | }
  78  | 
  79  | // ============================================================
  80  | // Tests — flat list, no categories
  81  | // ============================================================
  82  | 
  83  | test('TC-PR-001 — View project list', async ({ page }) => {
  84  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  85  | 
  86  |     await gotoProjects(page)
  87  |     await expect(
  88  |         page.locator('input[placeholder="Search for a project"]'),
  89  |         'project search input should be visible',
  90  |     ).toBeVisible({ timeout: 10_000 })
  91  |     await expect(
  92  |         page.locator('button', { hasText: 'New project' }).first(),
  93  |         '"New project" button should be visible',
  94  |     ).toBeVisible()
  95  | })
  96  | 
  97  | test('TC-PR-002 — Create a new project', async ({ page }) => {
  98  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  99  |     const tempName = `qa-prj-${ts()}`
  100 | 
  101 |     await uiCreateProject(page, tempName, 'Created by Playwright TC-PR-002')
  102 | 
  103 |     // After create, the SPA selects the new project and navigates to the
  104 |     // dashboard. Going back to /org/projects should list the new card.
  105 |     await gotoProjects(page)
  106 |     await expect(page.getByText(tempName, { exact: true })).toBeVisible({ timeout: 8_000 })
  107 | 
  108 |     // Cleanup
  109 |     await uiDeleteProject(page, tempName)
  110 | })
  111 | 
  112 | test('TC-PR-003 — View an existing project', async ({ page }) => {
  113 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  114 | 
  115 |     await gotoProjects(page)
  116 | 
  117 |     // Click the first project card.
  118 |     const firstCardName = page
  119 |         .locator('main')
  120 |         .locator('button, article, [role="button"]')
  121 |         .filter({ hasNotText: /New project|Search|Active|Inactive|Name|Date/i })
  122 |         .first()
  123 |     await expect(firstCardName).toBeVisible({ timeout: 10_000 })
  124 |     await firstCardName.click()
  125 | 
  126 |     // SPA navigates to /dashboard scoped to the project.
```