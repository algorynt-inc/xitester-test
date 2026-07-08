# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-070 — Update an existing recorded test case
- Location: tests/test-cases.spec.ts:353:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table tbody tr.test-case-row').filter({ hasText: 'qa-rec-1783516495816-tyrd' })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('table tbody tr.test-case-row').filter({ hasText: 'qa-rec-1783516495816-tyrd' })

```

# Page snapshot

```yaml
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
          - 'button "Switch project. Current project: Default Project" [ref=e24] [cursor=pointer]':
            - img [ref=e25]
            - generic [ref=e27]: Default Project
            - img [ref=e28]
      - generic [ref=e31]:
        - button "Search... ⌘K" [ref=e32] [cursor=pointer]:
          - img [ref=e33]
          - generic [ref=e36]: Search...
          - generic [ref=e37]: ⌘K
        - generic [ref=e38]:
          - button "Help" [ref=e39] [cursor=pointer]:
            - img [ref=e40]
          - button "Notifications" [ref=e43] [cursor=pointer]:
            - img [ref=e44]
            - generic [ref=e47]: 99+
        - generic [ref=e49]:
          - generic [ref=e50]: DEV
          - generic [ref=e51]: v1.2.0
          - button "A" [ref=e52] [cursor=pointer]
    - generic [ref=e53]:
      - complementary:
        - navigation [ref=e54]:
          - button "Dashboard" [ref=e55] [cursor=pointer]:
            - img [ref=e57]
            - generic: Dashboard
          - button "Test Cases" [ref=e62] [cursor=pointer]:
            - img [ref=e64]
            - generic: Test Cases
          - button "Test Plans" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Test Plans
          - button "Discovery" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Discovery
          - button "Test Plan AI" [ref=e82] [cursor=pointer]:
            - img [ref=e84]
            - generic: Test Plan AI
          - button "Test Data" [ref=e96] [cursor=pointer]:
            - img [ref=e98]
            - generic: Test Data
          - button "Quality" [ref=e102] [cursor=pointer]:
            - img [ref=e104]
            - generic: Quality
          - button "Api Tester" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Api Tester
          - button "Reports" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Reports
          - button "Settings" [ref=e119] [cursor=pointer]:
            - img [ref=e121]
            - generic: Settings
        - button "Logout" [ref=e126] [cursor=pointer]:
          - img [ref=e128]
          - generic: Logout
      - main [ref=e132]:
        - generic [ref=e133]:
          - generic [ref=e134]:
            - generic [ref=e135]:
              - heading "Test Cases" [level=1] [ref=e136]
              - paragraph [ref=e137]: View and manage your test case analysis sessions
            - generic [ref=e138]:
              - button "Import" [ref=e139] [cursor=pointer]:
                - img [ref=e140]
                - text: Import
              - button "Refresh" [ref=e143] [cursor=pointer]:
                - img [ref=e144]
                - text: Refresh
              - button "New Test Case" [ref=e150] [cursor=pointer]:
                - img [ref=e151]
                - text: New Test Case
                - img [ref=e152]
          - generic [ref=e155]:
            - generic [ref=e156]:
              - img [ref=e157]
              - textbox "Search test cases…" [active] [ref=e160]: qa-rec-1783516495816-tyrd
            - tablist "Session type" [ref=e161]:
              - tab "Test Cases" [selected] [ref=e162] [cursor=pointer]
              - tab "Test Modules" [ref=e163] [cursor=pointer]
            - button "Status" [ref=e164] [cursor=pointer]:
              - img [ref=e165]
              - text: Status
            - button "Last Run" [ref=e167] [cursor=pointer]:
              - img [ref=e168]
              - text: Last Run
            - button "Tags" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Tags
            - button "Test Plan" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
              - text: Test Plan
            - button "Source" [ref=e176] [cursor=pointer]:
              - img [ref=e177]
              - text: Source
            - button "Reset" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
              - text: Reset
          - generic [ref=e185]:
            - img [ref=e187]
            - heading "No test cases found" [level=3] [ref=e190]
            - paragraph [ref=e191]: Try adjusting your search or filters to find what you looking for.
            - button "Clear all filters" [ref=e192] [cursor=pointer]
          - generic [ref=e195]:
            - generic [ref=e196]: No test cases
            - generic [ref=e197]:
              - generic [ref=e198]:
                - generic [ref=e199]: Rows per page
                - combobox [ref=e200] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e201]
              - generic [ref=e203]:
                - generic [ref=e204]: Page 1of1
                - generic [ref=e205]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [disabled]:
                    - img
                  - button "Last page" [disabled]:
                    - img
```

# Test source

```ts
  4   | // Authenticated via auth.setup. Storage state carries the user's currently
  5   | // selected organisation + project, which already places `/test-cases` inside
  6   | // the right scope. Tests don't switch orgs explicitly — the user spec asks
  7   | // for "Regression_test_success" but we honour whatever the storage state
  8   | // already has, since switching orgs is a separate concern (covered in nav).
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | // All test-case mutations land in the same account/project. Run serial so
  12  | // that two tests don't fight over the same list (search box, bulk-select,
  13  | // pagination state).
  14  | test.describe.configure({ mode: 'serial' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | // const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  18  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  19  | 
  20  | // ============================================================
  21  | // Helpers — UI-only, no API helper calls. Each helper drives the SPA so
  22  | // the SUT's own client/SDK does the actual network work.
  23  | // ============================================================
  24  | 
  25  | async function gotoTestCases(page: Page): Promise<void> {
  26  |     await page.goto('/test-cases')
  27  |     await page
  28  |         .locator('input[placeholder="Search test cases…"]')
  29  |         .waitFor({ state: 'visible', timeout: 15_000 })
  30  |     // Wait for either rows or the empty-state to settle so the list is
  31  |     // stable before the test interacts with it.
  32  |     await page
  33  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  34  |         .first()
  35  |         .waitFor({ state: 'visible', timeout: 10_000 })
  36  |         .catch(() => undefined)
  37  | }
  38  | 
  39  | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  40  |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  41  |     // The "AI Test Create" item is rendered conditionally on the dropdown
  42  |     // being open — wait for it before continuing.
  43  |     await page
  44  |         .locator('button[data-tour="ai-test-create"]')
  45  |         .waitFor({ state: 'visible', timeout: 5_000 })
  46  | }
  47  | 
  48  | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  49  |     await gotoTestCases(page)
  50  |     await openNewTestCaseDropdown(page)
  51  |     await page.locator('button[data-tour="ai-test-create"]').click()
  52  | 
  53  |     // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
  54  |     // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
  55  |     // outer dialog by visible heading instead.
  56  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
  57  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  58  | 
  59  |     await dialog.locator('#test-case-name').fill(name)
  60  |     if (description) {
  61  |         await dialog.locator('#test-case-description').fill(description)
  62  |     }
  63  | 
  64  |     const [response] = await Promise.all([
  65  |         page.waitForResponse(
  66  |             r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
  67  |             { timeout: 15_000 },
  68  |         ),
  69  |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  70  |     ])
  71  |     if (!response.ok()) {
  72  |         const body = await response.text().catch(() => '')
  73  |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  74  |     }
  75  |     // SPA navigates to /test-analysis/<sessionId> on success. Pull the id
  76  |     // from the URL so callers can return to /test-cases and clean up.
  77  |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
  78  |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  79  |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  80  |     return match[1]
  81  | 
  82  | }
  83  | 
  84  | /**
  85  |  * Locate the row whose visible title equals `name`. Each row has a `tr`
  86  |  * wrapper carrying the `test-case-row` class; we anchor on the title cell
  87  |  * and climb to the row.
  88  |  */
  89  | function testCaseRow(page: Page, name: string): Locator {
  90  |     return page
  91  |         .locator('table tbody tr.test-case-row')
  92  |         .filter({ has: page.getByText(name, { exact: true }) })
  93  |         .first()
  94  | }
  95  | 
  96  | async function searchFor(page: Page, query: string): Promise<void> {
  97  |     const input = page.locator('input[placeholder="Search test cases…"]')
  98  |     await expect(input).toBeVisible()
  99  |     await input.fill(query)
  100 |     await expect(input).toHaveValue(query)
  101 |     // The list is server-side filtered after a 300ms debounce.
  102 |     await expect(
  103 |         page.locator('table tbody tr.test-case-row').filter({ hasText: query })
> 104 |     ).toBeVisible({ timeout: 20_000 });
      |       ^ Error: expect(locator).toBeVisible() failed
  105 | }
  106 | 
  107 | async function clearSearch(page: Page): Promise<void> {
  108 |     const input = page.locator('input[placeholder="Search test cases…"]')
  109 |     await expect(input).toBeVisible()
  110 |     await input.fill('')
  111 |     // await page.waitForTimeout(5000)
  112 | }
  113 | 
  114 | /**
  115 |  * Open the row's overflow actions and trigger a specific icon button.
  116 |  * The row's action cell exposes plain buttons with `aria-label`s like
  117 |  * "Clone test case", "Edit test case", "Delete test case".
  118 |  */
  119 | async function clickRowAction(
  120 |     row: Locator,
  121 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  122 | ): Promise<void> {
  123 |     // Hover the row so the actions cell becomes interactive in case CSS
  124 |     // hides it until hover (matches user behaviour).
  125 |     await row.hover()
  126 |     await row.locator(`button[aria-label="${action}"]`).click()
  127 | }
  128 | 
  129 | async function uiUpdateTestCase(
  130 |     page: Page,
  131 |     row: Locator,
  132 |     newTitle: string,
  133 |     newDescription?: string,
  134 | ): Promise<void> {
  135 |     await clickRowAction(row, 'Edit test case')
  136 | 
  137 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Test Case' })
  138 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  139 | 
  140 |     await dialog.locator('#edit-test-case-name').fill(newTitle)
  141 |     if (newDescription !== undefined) {
  142 |         await dialog.locator('#edit-test-case-description').fill(newDescription)
  143 |     }
  144 | 
  145 |     await Promise.all([
  146 |         page.waitForResponse(
  147 |             r =>
  148 |                 /\/api\/analysis\/sessions\/[^/]+\/title\b/.test(r.url()) &&
  149 |                 r.request().method() === 'PATCH',
  150 |             { timeout: 10_000 },
  151 |         ),
  152 |         dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
  153 |     ])
  154 | 
  155 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  156 | }
  157 | 
  158 | async function uiDeleteTestCase(page: Page, row: Locator): Promise<void> {
  159 |     await clickRowAction(row, 'Delete test case')
  160 | 
  161 |     // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
  162 |     const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
  163 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  164 | 
  165 |     await Promise.all([
  166 |         page.waitForResponse(
  167 |             r =>
  168 |                 /\/api\/analysis\/sessions\/[^/]+$/.test(r.url()) &&
  169 |                 r.request().method() === 'DELETE',
  170 |             { timeout: 10_000 },
  171 |         ),
  172 |         dialog.locator('button', { hasText: /^Delete$/ }).first().click(),
  173 |     ])
  174 | 
  175 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  176 | }
  177 | 
  178 | async function uiCloneTestCase(page: Page, row: Locator, newTitle: string): Promise<void> {
  179 |     await clickRowAction(row, 'Clone test case')
  180 | 
  181 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Clone Test Case' })
  182 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  183 | 
  184 |     await dialog.locator('#cloneTitle').fill(newTitle)
  185 | 
  186 |     await Promise.all([
  187 |         page.waitForResponse(
  188 |             r =>
  189 |                 /\/api\/analysis\/sessions\/[^/]+\/clone\b/.test(r.url()) &&
  190 |                 r.request().method() === 'POST',
  191 |             { timeout: 15_000 },
  192 |         ),
  193 |         dialog.locator('button[type="submit"]', { hasText: /^Clone$/ }).click(),
  194 |     ])
  195 | 
  196 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  197 | }
  198 | 
  199 | async function uiCreateRecordTestCase(page: Page, name: string): Promise<void> {
  200 |     await gotoTestCases(page)
  201 |     await openNewTestCaseDropdown(page)
  202 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  203 | 
  204 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
```