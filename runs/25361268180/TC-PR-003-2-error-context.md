# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> TC-PR-003 — View an existing project
- Location: tests/projects.spec.ts:112:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 8000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications alt+T"
    - generic [ref=e3]:
      - banner [ref=e4]:
        - generic [ref=e5]:
          - img "Xitester" [ref=e7]
          - generic [ref=e8]:
            - generic [ref=e9]: /
            - generic [ref=e10]:
              - button "qa-renamed-20260504190531 Enterprise" [ref=e11] [cursor=pointer]:
                - img [ref=e12]
                - generic [ref=e16]: qa-renamed-20260504190531
                - generic [ref=e17]: Enterprise
              - button [ref=e18] [cursor=pointer]:
                - img [ref=e19]
            - generic [ref=e22]: /
            - generic [ref=e23]: Projects
        - generic [ref=e24]:
          - button "Search... ⌘K" [ref=e25] [cursor=pointer]:
            - img [ref=e26]
            - generic [ref=e29]: Search...
            - generic [ref=e30]: ⌘K
          - generic [ref=e31]:
            - button "Help" [ref=e32] [cursor=pointer]:
              - img [ref=e33]
            - button "Notifications" [ref=e36] [cursor=pointer]:
              - img [ref=e37]
              - generic [ref=e40]: 99+
          - generic [ref=e42]:
            - generic [ref=e43]: DEV
            - generic [ref=e44]: v1.1.0
            - button "A" [ref=e45] [cursor=pointer]
      - generic [ref=e46]:
        - complementary:
          - navigation [ref=e47]:
            - button "Projects" [ref=e48] [cursor=pointer]:
              - img [ref=e50]
              - generic: Projects
            - button "Team" [ref=e52] [cursor=pointer]:
              - img [ref=e54]
              - generic: Team
            - button "Integrations" [ref=e59] [cursor=pointer]:
              - img [ref=e61]
              - generic: Integrations
            - button "Usage" [ref=e63] [cursor=pointer]:
              - img [ref=e65]
              - generic: Usage
            - button "Billing" [ref=e67] [cursor=pointer]:
              - img [ref=e69]
              - generic: Billing
            - button "Organization Settings" [ref=e71] [cursor=pointer]:
              - img [ref=e73]
              - generic: Organization Settings
          - button "Logout" [ref=e78] [cursor=pointer]:
            - img [ref=e80]
            - generic: Logout
        - main [ref=e84]:
          - generic [ref=e85]:
            - heading "Projects" [level=1] [ref=e86]
            - generic [ref=e87]:
              - generic [ref=e88]:
                - img [ref=e89]
                - textbox "Search for a project" [ref=e92]
              - separator [ref=e93]
              - button "Status" [expanded] [ref=e94] [cursor=pointer]:
                - img [ref=e95]
                - text: Status
              - button "Sort Name" [ref=e97] [cursor=pointer]:
                - img [ref=e98]
                - text: Sort
                - separator [ref=e100]
                - generic [ref=e102]: Name
              - generic [ref=e103]:
                - generic [ref=e104]:
                  - button [ref=e105] [cursor=pointer]:
                    - img [ref=e106]
                  - button [ref=e111] [cursor=pointer]:
                    - img [ref=e112]
                - button "New project" [ref=e113] [cursor=pointer]:
                  - img [ref=e114]
                  - text: New project
            - generic [ref=e116]:
              - generic [ref=e117] [cursor=pointer]:
                - generic [ref=e118]:
                  - generic [ref=e119]:
                    - heading "Default Project" [level=3] [ref=e120]
                    - paragraph [ref=e121]: Auto-created default project
                  - button [ref=e122]:
                    - img [ref=e123]
                - generic [ref=e128]: active
              - generic [ref=e129] [cursor=pointer]:
                - generic [ref=e130]:
                  - heading "xs" [level=3] [ref=e132]
                  - button [ref=e133]:
                    - img [ref=e134]
                - generic [ref=e139]: active
  - dialog [ref=e141]:
    - listbox "Status" [ref=e142]:
      - option "Active" [active] [ref=e143] [cursor=pointer]:
        - generic [ref=e145]: Active
      - option "Inactive" [ref=e146] [cursor=pointer]:
        - generic [ref=e148]: Inactive
```

# Test source

```ts
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
> 127 |     await page.waitForURL(/\/(dashboard|api-tester|test-cases|test-plans)/, { timeout: 8_000 })
      |                ^ TimeoutError: page.waitForURL: Timeout 8000ms exceeded.
  128 | })
  129 | 
  130 | test('TC-PR-004 — Update project name', async ({ page }) => {
  131 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  132 |     const tempName = `qa-prj-${ts()}`
  133 |     const renamed = `qa-renamed-${ts()}`
  134 | 
  135 |     await uiCreateProject(page, tempName)
  136 |     await uiUpdateProject(page, tempName, renamed)
  137 | 
  138 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })
  139 | 
  140 |     await gotoProjects(page)
  141 |     await expect(page.getByText(renamed, { exact: true })).toBeVisible({ timeout: 6_000 })
  142 |     await expect(page.getByText(tempName, { exact: true })).toBeHidden()
  143 | 
  144 |     // Cleanup
  145 |     await uiDeleteProject(page, renamed)
  146 | })
  147 | 
  148 | test('TC-PR-005 — Delete a project', async ({ page }) => {
  149 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  150 |     const tempName = `qa-del-${ts()}`
  151 | 
  152 |     await uiCreateProject(page, tempName)
  153 | 
  154 |     // Delete is the test — no separate cleanup.
  155 |     await uiDeleteProject(page, tempName)
  156 | 
  157 |     // Final guard: refresh the list and confirm the card is gone.
  158 |     await gotoProjects(page)
  159 |     await expect(page.getByText(tempName, { exact: true })).toBeHidden({ timeout: 6_000 })
  160 | })
  161 | 
```