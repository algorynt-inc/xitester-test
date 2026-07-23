# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-072 — Clone a recorded test case
- Location: tests/test-cases.spec.ts:445:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('button[data-tour="ai-test-create"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e3]:
        - button "Close toast" [ref=e4] [cursor=pointer]:
          - img [ref=e5]
        - img [ref=e9]
        - generic [ref=e14]: Your Free tier has ended. Upgrade to continue.
  - generic [ref=e15]:
    - banner [ref=e16]:
      - generic [ref=e17]:
        - img [ref=e18]
        - generic [ref=e22]: Your Free plan has ended. Upgrade to continue.
        - button "Upgrade" [ref=e23] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e24]
      - generic [ref=e26]:
        - img "Xitester" [ref=e28]
        - generic [ref=e29]:
          - generic [ref=e30]: /
          - generic [ref=e31]:
            - button "XiTester Automation Free" [ref=e32] [cursor=pointer]:
              - img [ref=e33]
              - generic [ref=e37]: XiTester Automation
              - generic [ref=e38]: Free
            - button [ref=e39] [cursor=pointer]:
              - img [ref=e40]
          - generic [ref=e43]: /
          - 'generic "Current project: Default Project" [ref=e44]':
            - img [ref=e45]
            - generic [ref=e47]: Default Project
      - generic [ref=e48]:
        - button "Search... ⌘K" [ref=e49] [cursor=pointer]:
          - img [ref=e50]
          - generic [ref=e53]: Search...
          - generic [ref=e54]: ⌘K
        - generic [ref=e55]:
          - button "Help" [ref=e56] [cursor=pointer]:
            - img [ref=e57]
          - button "Notifications" [ref=e60] [cursor=pointer]:
            - img [ref=e61]
            - generic [ref=e64]: "5"
        - generic [ref=e66]:
          - generic [ref=e67]: QA
          - generic [ref=e68]: v1.2.6+patch.607
          - button "T" [ref=e69] [cursor=pointer]
    - generic [ref=e70]:
      - complementary:
        - navigation [ref=e71]:
          - button "Dashboard" [ref=e72] [cursor=pointer]:
            - img [ref=e74]
            - generic: Dashboard
          - button "Test Cases" [ref=e79] [cursor=pointer]:
            - img [ref=e81]
            - generic: Test Cases
          - button "Test Plans" [ref=e84] [cursor=pointer]:
            - img [ref=e86]
            - generic: Test Plans
          - button "Discovery" [ref=e90] [cursor=pointer]:
            - img [ref=e92]
            - generic: Discovery
          - button "Test Plan AI" [ref=e99] [cursor=pointer]:
            - img [ref=e101]
            - generic: Test Plan AI
          - button "Test Data" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Test Data
          - button "Quality" [ref=e119] [cursor=pointer]:
            - img [ref=e121]
            - generic: Quality
          - button "Api Tester" [ref=e124] [cursor=pointer]:
            - img [ref=e126]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e130] [cursor=pointer]:
            - img [ref=e132]
            - generic: Figma-to-web
          - button "Reports" [ref=e138] [cursor=pointer]:
            - img [ref=e140]
            - generic: Reports
          - button "Settings" [ref=e144] [cursor=pointer]:
            - img [ref=e146]
            - generic: Settings
        - button "Logout" [ref=e151] [cursor=pointer]:
          - img [ref=e153]
          - generic: Logout
      - main [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]:
              - heading "Test Cases" [level=1] [ref=e161]
              - paragraph [ref=e162]: View and manage your test case analysis sessions
            - generic [ref=e163]:
              - button "Import" [ref=e164] [cursor=pointer]:
                - img [ref=e165]
                - text: Import
              - button "Refresh" [ref=e168] [cursor=pointer]:
                - img [ref=e169]
                - text: Refresh
              - button "New Test Case" [active] [ref=e175] [cursor=pointer]:
                - img [ref=e176]
                - text: New Test Case
                - img [ref=e177]
          - generic [ref=e180]:
            - generic [ref=e181]:
              - img [ref=e182]
              - textbox "Search test cases…" [ref=e185]
            - tablist "Session type" [ref=e186]:
              - tab "Test Cases" [selected] [ref=e187] [cursor=pointer]
              - tab "Test Modules" [ref=e188] [cursor=pointer]
            - button "Status" [ref=e189] [cursor=pointer]:
              - img [ref=e190]
              - text: Status
            - button "Last Run" [ref=e192] [cursor=pointer]:
              - img [ref=e193]
              - text: Last Run
            - button "Created By" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
              - text: Created By
            - button "Test Plan" [ref=e198] [cursor=pointer]:
              - img [ref=e199]
              - text: Test Plan
            - button "Source" [ref=e201] [cursor=pointer]:
              - img [ref=e202]
              - text: Source
          - table [ref=e206]:
            - rowgroup [ref=e207]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e208]:
                - columnheader [ref=e209]:
                  - checkbox [ref=e210] [cursor=pointer]
                - columnheader "#" [ref=e211]
                - columnheader "Title / Prompt" [ref=e212]
                - columnheader "Tags" [ref=e213]
                - columnheader "Analysis Status" [ref=e214]
                - columnheader "Last Run" [ref=e215]
                - columnheader "Steps" [ref=e216]
                - columnheader "Created" [ref=e217]
                - columnheader "Actions" [ref=e218]
            - rowgroup [ref=e219]:
              - link "1 record test2 Recorded Add tags Ready to Record No Runs 1 May 6, 2026, 01:08 PM by Midhilaj Clone test case Edit test case Delete test case" [ref=e220] [cursor=pointer]:
                - cell [ref=e221]:
                  - checkbox [ref=e222]
                - cell "1" [ref=e223]
                - cell "record test2 Recorded" [ref=e224]:
                  - generic [ref=e226]:
                    - generic [ref=e227]: record test2
                    - generic [ref=e228]:
                      - img [ref=e229]
                      - text: Recorded
                - cell "Add tags" [ref=e232]:
                  - button "Add tags" [ref=e233]:
                    - generic [ref=e234]:
                      - img [ref=e235]
                      - text: Add tags
                - cell "Ready to Record" [ref=e238]:
                  - generic [ref=e239]: Ready to Record
                - cell "No Runs" [ref=e241]:
                  - generic [ref=e244]: No Runs
                - cell "1" [ref=e245]
                - cell "May 6, 2026, 01:08 PM by Midhilaj" [ref=e246]:
                  - generic [ref=e247]:
                    - generic [ref=e248]: May 6, 2026, 01:08 PM
                    - generic [ref=e249]: by Midhilaj
                - cell "Clone test case Edit test case Delete test case" [ref=e250]:
                  - generic [ref=e251]:
                    - button "Clone test case" [ref=e252]:
                      - img [ref=e253]
                    - button "Edit test case" [ref=e256]:
                      - img [ref=e257]
                    - button "Delete test case" [ref=e260]:
                      - img [ref=e261]
          - generic [ref=e266]:
            - generic [ref=e267]: 1–1 of 1 test cases
            - generic [ref=e268]:
              - generic [ref=e269]:
                - generic [ref=e270]: Rows per page
                - combobox [ref=e271] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e272]
              - generic [ref=e274]:
                - generic [ref=e275]: Page 1of1
                - generic [ref=e276]:
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
  6   | // the right scope. Tests don't switch orgs explicitly — the user spec asks
  7   | // for "Regression_test_success" but we honour whatever the storage state
  8   | // already has, since switching orgs is a separate concern (covered in nav).
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | // Tests run one-at-a-time (config sets `workers: 1`, `fullyParallel: false`), so
  12  | // they never fight over the shared account's list. `default` mode (not `serial`)
  13  | // keeps each test independent: if one fails, the rest still run.
  14  | test.describe.configure({ mode: 'default' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | 
  18  | // Every test in this file needs a logged-in user. Guard once here instead of
  19  | // repeating the check at the top of each test.
  20  | test.beforeEach(() => {
  21  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  22  | })
  23  | 
  24  | // ============================================================
  25  | // Constants
  26  | // ============================================================
  27  | 
  28  | /** Shared selectors for elements the whole suite touches. */
  29  | const SEL = {
  30  |     searchInput: 'input[placeholder="Search test cases…"]',
  31  |     row: 'table tbody tr.test-case-row',
  32  |     toaster: '[data-sonner-toaster]',
  33  | } as const
  34  | 
  35  | /** Unique-enough suffix (epoch ms + 4 random chars) for throwaway names. */
  36  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  37  | 
  38  | // ============================================================
  39  | // Locator + assertion helpers
  40  | // ============================================================
  41  | 
  42  | const searchInput = (page: Page): Locator => page.locator(SEL.searchInput)
  43  | 
  44  | /**
  45  |  * Match a test case by name. Long names are JS-truncated in the name cell (the
  46  |  * DOM text becomes e.g. `qa-rec-clone-…`), so exact visible-text matching misses
  47  |  * them. The full name is preserved in the cell's `title` attribute — match that
  48  |  * first, falling back to exact text for anything without a title attribute.
  49  |  */
  50  | function nameMatch(page: Page, name: string): Locator {
  51  |     return page.locator(`[title="${name}"]`).or(page.getByText(name, { exact: true }))
  52  | }
  53  | 
  54  | /** The `tr.test-case-row` whose name cell matches `name`. */
  55  | function testCaseRow(page: Page, name: string): Locator {
  56  |     return page.locator(SEL.row).filter({ has: nameMatch(page, name) }).first()
  57  | }
  58  | 
  59  | /** A `name`-matching row that also carries the "Recording" status badge. */
  60  | function recordedTestCaseRow(page: Page, name: string): Locator {
  61  |     return page
  62  |         .locator(SEL.row)
  63  |         .filter({ has: nameMatch(page, name) })
  64  |         .filter({ has: page.getByText(/^Recording$/) })
  65  |         .first()
  66  | }
  67  | 
  68  | /** Assert a Sonner toast containing `pattern` appears. */
  69  | async function expectToast(page: Page, pattern: RegExp, timeout = 5_000): Promise<void> {
  70  |     await expect(page.locator(SEL.toaster)).toContainText(pattern, { timeout })
  71  | }
  72  | 
  73  | /** Wait for the SUT's own client to make a matching API call. */
  74  | function waitForApi(
  75  |     page: Page,
  76  |     pattern: RegExp,
  77  |     method: string,
  78  |     timeout = 15_000,
  79  | ): Promise<Response> {
  80  |     return page.waitForResponse(
  81  |         r => pattern.test(r.url()) && r.request().method() === method,
  82  |         { timeout },
  83  |     )
  84  | }
  85  | 
  86  | // ============================================================
  87  | // UI flows — drive the SPA so the SUT's own client does the network work.
  88  | // ============================================================
  89  | 
  90  | async function gotoTestCases(page: Page): Promise<void> {
  91  |     await page.goto('/test-cases')
  92  |     await searchInput(page).waitFor({ state: 'visible', timeout: 15_000 })
  93  |     // Wait for either rows or the empty-state to settle so the list is
  94  |     // stable before the test interacts with it.
  95  |     await page
  96  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  97  |         .first()
  98  |         .waitFor({ state: 'visible', timeout: 10_000 })
  99  |         .catch(() => undefined)
  100 | }
  101 | 
  102 | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  103 |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  104 |     // The "AI Test Create" item is rendered conditionally on the dropdown
  105 |     // being open — wait for it before continuing.
> 106 |     await page.locator('button[data-tour="ai-test-create"]').waitFor({ state: 'visible', timeout: 5_000 })
      |                                                              ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  107 | }
  108 | 
  109 | async function searchFor(page: Page, query: string): Promise<void> {
  110 |     const input = searchInput(page)
  111 |     await expect(input).toBeVisible()
  112 |     await input.fill(query)
  113 |     await expect(input).toHaveValue(query)
  114 |     // The list is server-side filtered after a 300ms debounce.
  115 |     await expect(
  116 |         page.locator(SEL.row).filter({ has: nameMatch(page, query) }),
  117 |     ).toBeVisible({ timeout: 50_000 })
  118 | }
  119 | 
  120 | async function clearSearch(page: Page): Promise<void> {
  121 |     const input = searchInput(page)
  122 |     await expect(input).toBeVisible()
  123 |     await input.fill('')
  124 | }
  125 | 
  126 | /**
  127 |  * Open the row's overflow actions and trigger a specific icon button.
  128 |  * The row's action cell exposes plain buttons with `aria-label`s like
  129 |  * "Clone test case", "Edit test case", "Delete test case".
  130 |  */
  131 | async function clickRowAction(
  132 |     row: Locator,
  133 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  134 | ): Promise<void> {
  135 |     // Hover the row so the actions cell becomes interactive in case CSS
  136 |     // hides it until hover (matches user behaviour).
  137 |     await row.hover()
  138 |     await row.locator(`button[aria-label="${action}"]`).click()
  139 | }
  140 | 
  141 | /**
  142 |  * Create an AI test case and return its session id. On success the SPA
  143 |  * navigates to `/test-analysis/<sessionId>`; we parse the id from the URL so
  144 |  * callers can return to `/test-cases` and clean up.
  145 |  */
  146 | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  147 |     await gotoTestCases(page)
  148 |     await openNewTestCaseDropdown(page)
  149 |     await page.locator('button[data-tour="ai-test-create"]').click()
  150 | 
  151 |     // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
  152 |     // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
  153 |     // outer dialog by visible heading instead.
  154 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
  155 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  156 | 
  157 |     await dialog.locator('#test-case-name').fill(name)
  158 |     if (description) {
  159 |         await dialog.locator('#test-case-description').fill(description)
  160 |     }
  161 | 
  162 |     const [response] = await Promise.all([
  163 |         waitForApi(page, /\/api\/analysis\/sessions\b/, 'POST'),
  164 |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  165 |     ])
  166 |     if (!response.ok()) {
  167 |         const body = await response.text().catch(() => '')
  168 |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  169 |     }
  170 | 
  171 |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
  172 |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  173 |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  174 |     return match[1]
  175 | }
  176 | 
  177 | async function uiCreateRecordTestCase(page: Page, name: string): Promise<void> {
  178 |     await gotoTestCases(page)
  179 |     await openNewTestCaseDropdown(page)
  180 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  181 | 
  182 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
  183 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  184 | 
  185 |     await dialog.locator('#recordTestName').fill(name)
  186 |     await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
  187 |     await dialog.locator('#startUrl').fill('https://xitester.com')
  188 | 
  189 |     await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
  190 | 
  191 |     // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
  192 |     await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
  193 |     expect(page.url()).toMatch(/\/test-analysis/)
  194 |     await page.getByRole('button', { name: 'Analysis', exact: true }).click()
  195 |     await expect(page.getByText('Recording started (playwright')).toBeVisible({ timeout: 50_000 })
  196 | }
  197 | 
  198 | async function uiUpdateTestCase(
  199 |     page: Page,
  200 |     row: Locator,
  201 |     newTitle: string,
  202 |     newDescription?: string,
  203 | ): Promise<void> {
  204 |     await clickRowAction(row, 'Edit test case')
  205 | 
  206 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Test Case' })
```