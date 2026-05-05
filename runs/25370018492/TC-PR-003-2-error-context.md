# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> TC-PR-003 — Open Default Project and land on the dashboard
- Location: tests/projects.spec.ts:135:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { level: 1 }).or(getByText(/dashboard/i).first())
Expected: visible
Error: strict mode violation: getByRole('heading', { level: 1 }).or(getByText(/dashboard/i).first()) resolved to 2 elements:
    1) <span class="min-w-0 flex-1 truncate text-sm font-medium">Dashboard</span> aka getByRole('banner').getByText('Dashboard')
    2) <h1 class="text-2xl font-bold">Dashboard</h1> aka getByRole('heading', { name: 'Dashboard' })

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByRole('heading', { level: 1 }).or(getByText(/dashboard/i).first())
    5 × locator resolved to <span class="min-w-0 flex-1 truncate text-sm font-medium">Dashboard</span>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications alt+T"
    - generic [ref=e3]:
      - banner [ref=e4]:
        - generic [ref=e5]:
          - img "Xitester" [ref=e7]
          - generic [ref=e8]:
            - generic [ref=e9]: /
            - generic [ref=e10]:
              - button "XiTester Enterprise" [ref=e11] [cursor=pointer]:
                - img [ref=e12]
                - generic [ref=e16]: XiTester
                - generic [ref=e17]: Enterprise
              - button [ref=e18] [cursor=pointer]:
                - img [ref=e19]
            - generic [ref=e22]: /
            - generic [ref=e23]:
              - button "Default Project" [ref=e24] [cursor=pointer]:
                - img [ref=e25]
                - generic [ref=e27]: Default Project
              - button [ref=e28] [cursor=pointer]:
                - img [ref=e29]
        - generic [ref=e32]:
          - button "Search... ⌘K" [ref=e33] [cursor=pointer]:
            - img [ref=e34]
            - generic [ref=e37]: Search...
            - generic [ref=e38]: ⌘K
          - generic [ref=e39]:
            - button "Help" [ref=e40] [cursor=pointer]:
              - img [ref=e41]
            - button "Notifications" [ref=e44] [cursor=pointer]:
              - img [ref=e45]
              - generic [ref=e48]: 99+
          - generic [ref=e50]:
            - generic [ref=e51]: DEV
            - generic [ref=e52]: v1.1.0
            - button "A" [ref=e53] [cursor=pointer]
      - generic [ref=e54]:
        - complementary:
          - navigation [ref=e55]:
            - button "Dashboard" [ref=e56] [cursor=pointer]:
              - img [ref=e58]
              - generic: Dashboard
            - button "Test Cases" [ref=e63] [cursor=pointer]:
              - img [ref=e65]
              - generic: Test Cases
            - button "Test Plans" [ref=e68] [cursor=pointer]:
              - img [ref=e70]
              - generic: Test Plans
            - button "Discovery" [ref=e74] [cursor=pointer]:
              - img [ref=e76]
              - generic: Discovery
            - button "Test Plan AI" [ref=e83] [cursor=pointer]:
              - img [ref=e85]
              - generic: Test Plan AI
            - button "Test Data" [ref=e97] [cursor=pointer]:
              - img [ref=e99]
              - generic: Test Data
            - button "Api Tester" [ref=e103] [cursor=pointer]:
              - img [ref=e105]
              - generic: Api Tester
            - button "Settings" [ref=e110] [cursor=pointer]:
              - img [ref=e112]
              - generic: Settings
          - button "Logout" [ref=e117] [cursor=pointer]:
            - img [ref=e119]
            - generic: Logout
        - main [ref=e123]:
          - generic [ref=e124]:
            - heading "Dashboard" [level=1] [ref=e126]
            - generic [ref=e128]:
              - button "Overview" [ref=e129] [cursor=pointer]:
                - img [ref=e130]
                - text: Overview
              - button "Regression Test Result Charts" [ref=e135] [cursor=pointer]:
                - img [ref=e136]
                - text: Regression Test Result Charts
              - button "Test Coverage" [ref=e139] [cursor=pointer]:
                - img [ref=e140]
                - text: Test Coverage
            - generic [ref=e143]:
              - generic [ref=e144]:
                - generic [ref=e145]:
                  - img [ref=e147]
                  - heading "Total Test Plan Runs" [level=3] [ref=e150]
                  - generic [ref=e151]:
                    - generic [ref=e152]: "338"
                    - generic [ref=e154]: ↓ -86.9% from the last month
                - generic [ref=e156]:
                  - img [ref=e158]
                  - heading "Pass Rate" [level=3] [ref=e162]
                  - generic [ref=e163]:
                    - generic [ref=e164]: 48%
                    - generic [ref=e166]: ↓ -3.3% from the last week
                - generic [ref=e168]:
                  - img [ref=e170]
                  - heading "Active Suites" [level=3] [ref=e176]
                  - generic [ref=e177]:
                    - generic [ref=e178]: "0"
                    - generic [ref=e180]: Currently active test plan runs
                - generic [ref=e182]:
                  - img [ref=e184]
                  - heading "Avg. Duration" [level=3] [ref=e188]
                  - generic [ref=e189]:
                    - generic [ref=e190]: 8m 29s
                    - generic [ref=e192]: Avg across recent runs
              - generic [ref=e195]:
                - combobox "Select test plan" [ref=e197]:
                  - option "KIMS TVM ALL_Modules Testcase"
                  - option "ZZZ-Iter6-Boundary"
                  - option "Test 1"
                  - option "https://cigclouds.com/demoit/index.php"
                  - option "downlaod" [selected]
                  - option "Shine - First One - Imp*"
                - generic [ref=e198]:
                  - generic [ref=e200]:
                    - heading "Test Plan Runs Analysis" [level=3] [ref=e201]
                    - button "Maximize Test Plan Runs Analysis chart" [ref=e202] [cursor=pointer]:
                      - img [ref=e203]
                  - application [ref=e211]:
                    - generic [ref=e460]:
                      - generic [ref=e461]: Test Cases
                      - generic [ref=e462]: Duration (min)
                      - generic [ref=e463]:
                        - generic [ref=e465]: "0.75"
                        - generic [ref=e467]: "1.5"
                        - generic [ref=e469]: "2.25"
                        - generic [ref=e471]: "3"
                      - generic [ref=e472]:
                        - generic [ref=e474]: "7"
                        - generic [ref=e476]: "14"
                        - generic [ref=e478]: "21"
                        - generic [ref=e480]: "28"
              - generic [ref=e483]:
                - generic [ref=e485]:
                  - generic [ref=e487]:
                    - heading "Top Active Test Plans" [level=3] [ref=e488]
                    - button "Maximize Top Active Test Plans chart" [ref=e489] [cursor=pointer]:
                      - img [ref=e490]
                  - application [ref=e498]:
                    - generic [ref=e516]:
                      - generic [ref=e517]:
                        - generic [ref=e519]: downlaod
                        - generic [ref=e521]: Shine - First One - Imp*
                      - generic [ref=e522]:
                        - generic [ref=e524]: "0"
                        - generic [ref=e526]: "2"
                        - generic [ref=e528]: "4"
                        - generic [ref=e530]: "6"
                        - generic [ref=e532]: "8"
                - generic [ref=e535]:
                  - generic [ref=e537]:
                    - heading "Recent Activity" [level=3] [ref=e538]
                    - button "Maximize Recent Activity chart" [ref=e539] [cursor=pointer]:
                      - img [ref=e540]
                  - generic [ref=e546]:
                    - generic [ref=e547]:
                      - img [ref=e549]
                      - generic [ref=e551]:
                        - paragraph [ref=e552]: Shine - First One - Imp*
                        - paragraph [ref=e553]:
                          - generic [ref=e554]: Shine
                          - generic [ref=e555]: •
                          - generic [ref=e556]: May 4, 11:30 PM
                      - generic [ref=e558]: Failed
                    - generic [ref=e559]:
                      - img [ref=e561]
                      - generic [ref=e563]:
                        - paragraph [ref=e564]: Shine - First One - Imp*
                        - paragraph [ref=e565]:
                          - generic [ref=e566]: Shine
                          - generic [ref=e567]: •
                          - generic [ref=e568]: May 4, 11:00 PM
                      - generic [ref=e570]: Failed
                    - generic [ref=e571]:
                      - img [ref=e573]
                      - generic [ref=e575]:
                        - paragraph [ref=e576]: downlaod
                        - paragraph [ref=e577]:
                          - generic [ref=e578]: Admin User
                          - generic [ref=e579]: •
                          - generic [ref=e580]: May 4, 10:20 PM
                      - generic [ref=e582]: Passed
                    - generic [ref=e583]:
                      - img [ref=e585]
                      - generic [ref=e587]:
                        - paragraph [ref=e588]: downlaod
                        - paragraph [ref=e589]:
                          - generic [ref=e590]: Admin User
                          - generic [ref=e591]: •
                          - generic [ref=e592]: May 4, 10:20 PM
                      - generic [ref=e594]: Passed
                    - generic [ref=e595]:
                      - img [ref=e597]
                      - generic [ref=e599]:
                        - paragraph [ref=e600]: Shine - First One - Imp*
                        - paragraph [ref=e601]:
                          - generic [ref=e602]: Shine
                          - generic [ref=e603]: •
                          - generic [ref=e604]: May 3, 11:30 PM
                      - generic [ref=e606]: Failed
  - generic [ref=e609]: "7"
```

# Test source

```ts
  58  |     await dialog.waitFor({ state: 'hidden', timeout: 10_000 })
  59  | }
  60  | 
  61  | async function openKebabAction(page: Page, projectName: string, action: 'Edit' | 'Delete'): Promise<void> {
  62  |     await gotoProjects(page)
  63  |     const card = projectCard(page, projectName)
  64  |     await expect(card, `card for "${projectName}" should be in the list`).toBeVisible({ timeout: 8_000 })
  65  | 
  66  |     // Kebab is `opacity-0 group-hover:opacity-100` — hover the card first
  67  |     // so the button becomes visible and clickable like for a real user.
  68  |     await card.hover()
  69  |     const kebab = card.locator('button').first()
  70  |     await kebab.click({ force: true })
  71  | 
  72  |     await page.getByRole('menuitem', { name: action }).click()
  73  | }
  74  | 
  75  | async function uiUpdateProjectName(page: Page, currentName: string, newName: string): Promise<void> {
  76  |     await openKebabAction(page, currentName, 'Edit')
  77  | 
  78  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Project' })
  79  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  80  | 
  81  |     const nameInput = dialog.getByPlaceholder('My Project')
  82  |     await nameInput.fill(newName)
  83  | 
  84  |     await Promise.all([
  85  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'PUT'),
  86  |         dialog.locator('button', { hasText: 'Save changes' }).first().click(),
  87  |     ])
  88  |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  89  | }
  90  | 
  91  | async function uiDeleteProject(page: Page, name: string): Promise<void> {
  92  |     await openKebabAction(page, name, 'Delete')
  93  | 
  94  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Delete Project' })
  95  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  96  | 
  97  |     await Promise.all([
  98  |         page.waitForResponse(r => /\/api\/v1\/projects\/?\b/.test(r.url()) && r.request().method() === 'DELETE'),
  99  |         dialog.locator('button', { hasText: 'Delete Project' }).first().click(),
  100 |     ])
  101 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  102 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  103 | }
  104 | 
  105 | // ============================================================
  106 | // Tests — flat list, no categories
  107 | // ============================================================
  108 | 
  109 | test('TC-PR-001 — View project list', async ({ page }) => {
  110 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  111 | 
  112 |     await gotoProjects(page)
  113 |     await expect(
  114 |         page.locator('input[placeholder="Search for a project"]'),
  115 |     ).toBeVisible({ timeout: 10_000 })
  116 |     await expect(
  117 |         page.locator('button', { hasText: 'New project' }).first(),
  118 |     ).toBeVisible()
  119 | })
  120 | 
  121 | test('TC-PR-002 — Create a new project', async ({ page }) => {
  122 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  123 |     const tempName = `qa-prj-${ts()}`
  124 | 
  125 |     await uiCreateProject(page, tempName, 'Created by Playwright TC-PR-002')
  126 | 
  127 |     // After create, return to the list and confirm the new card appears.
  128 |     await gotoProjects(page)
  129 |     await expect(projectCard(page, tempName)).toBeVisible({ timeout: 8_000 })
  130 | 
  131 |     // Cleanup — delete the project we just created (per user spec).
  132 |     await uiDeleteProject(page, tempName)
  133 | })
  134 | 
  135 | test('TC-PR-003 — Open Default Project and land on the dashboard', async ({ page }) => {
  136 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  137 | 
  138 |     await gotoProjects(page)
  139 | 
  140 |     // Default Project is seeded in every org — deterministic target.
  141 |     const card = projectCard(page, DEFAULT_PROJECT_NAME)
  142 |     await expect(
  143 |         card,
  144 |         `"${DEFAULT_PROJECT_NAME}" card should be present in /org/projects`,
  145 |     ).toBeVisible({ timeout: 10_000 })
  146 |     await card.click()
  147 | 
  148 |     // Project selection navigates to /dashboard. Wait for the route change
  149 |     // and a dashboard-y signal so we're confident the dashboard actually
  150 |     // mounted (not just that the URL flipped).
  151 |     await page.waitForURL(/\/dashboard\b/, { timeout: 10_000 })
  152 |     expect(page.url()).toMatch(/\/dashboard\b/)
  153 |     // Loose dashboard heuristic: the page should render some recognisable
  154 |     // dashboard content. Anything containing "Dashboard" in a heading or
  155 |     // the layout's nav is fine.
  156 |     await expect(
  157 |         page.getByRole('heading', { level: 1 }).or(page.getByText(/dashboard/i).first()),
> 158 |     ).toBeVisible({ timeout: 8_000 })
      |       ^ Error: expect(locator).toBeVisible() failed
  159 | })
  160 | 
  161 | test('TC-PR-004 — Update project name (and revert)', async ({ page }) => {
  162 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  163 |     const original = `qa-prj-${ts()}`
  164 |     const renamed = `qa-renamed-${ts()}`
  165 | 
  166 |     await uiCreateProject(page, original)
  167 | 
  168 |     // 1. Rename original → renamed.
  169 |     await uiUpdateProjectName(page, original, renamed)
  170 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })
  171 |     await gotoProjects(page)
  172 |     await expect(projectCard(page, renamed)).toBeVisible({ timeout: 6_000 })
  173 |     await expect(page.getByText(original, { exact: true })).toBeHidden()
  174 | 
  175 |     // 2. Revert renamed → original. Two purposes: (a) verify bidirectional
  176 |     //    update works, (b) leave the name in a state we can confidently
  177 |     //    delete in cleanup if the rename in step 1 partially succeeded.
  178 |     await uiUpdateProjectName(page, renamed, original)
  179 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/project updated/i, { timeout: 5_000 })
  180 |     await gotoProjects(page)
  181 |     await expect(projectCard(page, original)).toBeVisible({ timeout: 6_000 })
  182 |     await expect(page.getByText(renamed, { exact: true })).toBeHidden()
  183 | 
  184 |     // Cleanup — delete the project we created.
  185 |     await uiDeleteProject(page, original)
  186 | })
  187 | 
  188 | test('TC-PR-005 — Delete a project we just created', async ({ page }) => {
  189 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  190 |     const tempName = `qa-del-${ts()}`
  191 | 
  192 |     await uiCreateProject(page, tempName)
  193 | 
  194 |     // Delete IS the test — uiDeleteProject already asserts the card is gone.
  195 |     await uiDeleteProject(page, tempName)
  196 | })
  197 | 
```