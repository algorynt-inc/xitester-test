# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> TC-PR-004 — Update project name (and revert)
- Location: tests/projects.spec.ts:165:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('div[role="dialog"]').filter({ hasText: 'Create New Project' }) to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e6]
        - generic [ref=e9]:
          - generic [ref=e10]: You're on the Free plan (14 Days Left)
          - generic [ref=e11]: — unlock full access
        - button "Upgrade" [ref=e12] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e13]
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]:
            - button "qa-del-1784841164846-pw7a Free" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: qa-del-1784841164846-pw7a
              - generic [ref=e27]: Free
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - generic [ref=e32]: /
          - generic [ref=e33]: Projects
      - generic [ref=e34]:
        - button "Search... ⌘K" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
          - generic [ref=e39]: Search...
          - generic [ref=e40]: ⌘K
        - generic [ref=e41]:
          - button "Help" [ref=e42] [cursor=pointer]:
            - img [ref=e43]
          - button "Notifications" [ref=e46] [cursor=pointer]:
            - img [ref=e47]
            - generic [ref=e50]: "4"
        - generic [ref=e52]:
          - generic [ref=e53]: STAGE
          - generic [ref=e54]: v1.2.5+patch.601
          - button "T" [ref=e55] [cursor=pointer]
    - generic [ref=e56]:
      - complementary:
        - navigation [ref=e57]:
          - button "Projects" [ref=e58] [cursor=pointer]:
            - img [ref=e60]
            - generic: Projects
          - button "Team" [ref=e62] [cursor=pointer]:
            - img [ref=e64]
            - generic: Team
          - button "Integrations" [ref=e69] [cursor=pointer]:
            - img [ref=e71]
            - generic: Integrations
          - button "Usage" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Usage
          - button "Billing" [ref=e77] [cursor=pointer]:
            - img [ref=e79]
            - generic: Billing
          - button "Organization Settings" [ref=e81] [cursor=pointer]:
            - img [ref=e83]
            - generic: Organization Settings
        - button "Logout" [ref=e88] [cursor=pointer]:
          - img [ref=e90]
          - generic: Logout
      - main [ref=e94]:
        - generic [ref=e95]:
          - heading "Projects" [level=1] [ref=e96]
          - generic [ref=e97]:
            - generic [ref=e98]:
              - img [ref=e99]
              - textbox "Search for a project" [ref=e102]
            - separator [ref=e103]
            - button "Status" [ref=e104] [cursor=pointer]:
              - img [ref=e105]
              - text: Status
            - button "Sort Name" [ref=e107] [cursor=pointer]:
              - img [ref=e108]
              - text: Sort
              - separator [ref=e110]
              - generic [ref=e112]: Name
            - generic [ref=e113]:
              - generic [ref=e114]:
                - button [ref=e115] [cursor=pointer]:
                  - img [ref=e116]
                - button [ref=e121] [cursor=pointer]:
                  - img [ref=e122]
              - generic "Your plan allows up to 1 project(s)." [ref=e123]:
                - generic [ref=e124]:
                  - img [ref=e125]
                  - generic [ref=e128]:
                    - generic [ref=e129]: 1 / 1
                    - text: used
                - link "Upgrade" [ref=e130] [cursor=pointer]:
                  - /url: /org/billing
                  - text: Upgrade
                  - img [ref=e131]
              - button "New project" [active] [ref=e133] [cursor=pointer]:
                - img [ref=e134]
                - text: New project
          - generic [ref=e137] [cursor=pointer]:
            - generic [ref=e138]:
              - generic [ref=e139]:
                - heading "qa-prj-1784930899028-fm11" [level=3] [ref=e140]
                - paragraph [ref=e141]: Created by Playwright TC-PR-002
              - button [ref=e142]:
                - img [ref=e143]
            - generic [ref=e148]: active
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Tests run one-at-a-time (config: `workers: 1`, `fullyParallel: false`), so they
  5   | // don't fight over the shared account. `default` mode (not `serial`) keeps tests
  6   | // independent: one failing test won't skip the rest.
  7   | test.describe.configure({ mode: 'default' })
  8   | // Authenticated via auth.setup.
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  12  | // const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  13  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  14  | 
  15  | // "Default Project" is seeded in every XiTester organisation; the View test
  16  | // uses it deterministically rather than picking the first card it sees.
  17  | const DEFAULT_PROJECT_NAME = 'Default Project'
  18  | 
  19  | // ============================================================
  20  | // Helpers — drive the actual SPA modals like a real user would.
  21  | // ------------------------------------------------------------
  22  | // Important: shadcn <Input> components have NO id attribute. Inputs are
  23  | // identified by placeholder text, scoped to the open dialog so the create
  24  | // and edit modals don't collide on shared placeholders.
  25  | // ============================================================
  26  | 
  27  | async function gotoProjects(page: Page): Promise<void> {
  28  |     await page.goto('/org/projects')
  29  |     await page.locator('input[placeholder="Search for a project"]').waitFor({ state: 'visible', timeout: 15_000 })
  30  | }
  31  | 
  32  | /**
  33  |  * Locate the project card whose visible name is `name`. Project cards are
  34  |  * <div onClick> elements (not buttons) wrapping an h3 (grid view) or a
  35  |  * .font-medium div (list view) that displays the name. We climb to the
  36  |  * nearest cursor-pointer ancestor, which is the clickable card root and
  37  |  * also contains the kebab button.
  38  |  */
  39  | function projectCard(page: Page, name: string): Locator {
  40  |     return page
  41  |         .locator('main')
  42  |         .getByText(name, { exact: true })
  43  |         .locator('xpath=ancestor::div[contains(@class, "cursor-pointer")][1]')
  44  | }
  45  | 
  46  | async function uiCreateProject(page: Page, name: string, description?: string): Promise<void> {
  47  |     await gotoProjects(page)
  48  |     await page.locator('button', { hasText: 'New project' }).first().click()
  49  | 
  50  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create New Project' })
> 51  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
      |                  ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  52  | 
  53  |     await dialog.getByPlaceholder('My Project').fill(name)
  54  |     if (description) {
  55  |         await dialog.getByPlaceholder('Optional description...').fill(description)
  56  |     }
  57  | 
  58  |     await Promise.all([
  59  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'POST'),
  60  |         dialog.locator('button', { hasText: 'Create Project' }).first().click(),
  61  |     ])
  62  |     // SPA closes the dialog and navigates to /dashboard on success.
  63  |     await dialog.waitFor({ state: 'hidden', timeout: 10_000 })
  64  | }
  65  | 
  66  | async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
  67  |     await gotoProjects(page)
  68  |     const card = projectCard(page, projectName)
  69  |     await expect(card, `card for "${projectName}" should be in the list`).toBeVisible({ timeout: 8_000 })
  70  | 
  71  |     // Kebab is `opacity-0 group-hover:opacity-100` — hover the card first
  72  |     // so the button becomes visible and clickable like for a real user.
  73  |     await card.hover()
  74  |     const kebab = card.locator('button').first()
  75  |     await kebab.click({ force: true })
  76  | 
  77  |     await page.getByRole('menuitem', { name: action }).click()
  78  | }
  79  | 
  80  | async function uiUpdateProjectName(page: Page, currentName: string, newName: string): Promise<void> {
  81  |     await openKebabAction(page, currentName, 'Edit')
  82  | 
  83  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Project' })
  84  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  85  | 
  86  |     const nameInput = dialog.getByPlaceholder('My Project')
  87  |     await nameInput.fill(newName)
  88  | 
  89  |     await Promise.all([
  90  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
  91  |         dialog.locator('button', { hasText: 'Save changes' }).first().click(),
  92  |     ])
  93  |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  94  | }
  95  | 
  96  | async function uiDeleteProject(page: Page, name: string): Promise<void> {
  97  |     await openKebabAction(page, name, 'Delete')
  98  | 
  99  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Delete Project' })
  100 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  101 | 
  102 |     await Promise.all([
  103 |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
  104 |         dialog.locator('button', { hasText: 'Delete Project' }).first().click(),
  105 |     ])
  106 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  107 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  108 | }
  109 | 
  110 | // ============================================================
  111 | // Tests — flat list, no categories
  112 | // ============================================================
  113 | 
  114 | test('TC-PR-001 — View project list', async ({ page }) => {
  115 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  116 | 
  117 |     await gotoProjects(page)
  118 |     await expect(
  119 |         page.locator('input[placeholder="Search for a project"]'),
  120 |     ).toBeVisible({ timeout: 10_000 })
  121 |     await expect(
  122 |         page.locator('button', { hasText: 'New project' }).first(),
  123 |     ).toBeVisible()
  124 | })
  125 | 
  126 | test('TC-PR-002 — Create a new project', async ({ page }) => {
  127 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  128 |     const tempName = `qa-prj-${ts()}`
  129 | 
  130 |     await uiCreateProject(page, tempName, 'Created by Playwright TC-PR-002')
  131 | 
  132 |     // After create, return to the list and confirm the new card appears.
  133 |     await gotoProjects(page)
  134 |     await expect(projectCard(page, tempName)).toBeVisible({ timeout: 8_000 })
  135 | 
  136 |     // Cleanup — delete the project we just created (per user spec).
  137 |     await uiDeleteProject(page, tempName)
  138 | })
  139 | 
  140 | test('TC-PR-003 — Open Default Project and land on the dashboard', async ({ page }) => {
  141 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  142 | 
  143 |     await gotoProjects(page)
  144 | 
  145 |     // Default Project is seeded in every org — deterministic target.
  146 |     const card = projectCard(page, DEFAULT_PROJECT_NAME)
  147 |     await expect(
  148 |         card,
  149 |         `"${DEFAULT_PROJECT_NAME}" card should be present in /org/projects`,
  150 |     ).toBeVisible({ timeout: 10_000 })
  151 |     await card.click()
```