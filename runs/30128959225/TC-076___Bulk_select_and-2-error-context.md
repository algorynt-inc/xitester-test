# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-076 — Bulk select and bulk delete test cases
- Location: tests/test-cases.spec.ts:541:1

# Error details

```
Error: createSession 409: {"detail":{"error_code":"PLAN_LIMIT_EXCEEDED","plan_tier":"free","resource":"test_cases_ai","limit":5,"current":5,"upgrade_hint":"Upgrade this organization to enterprise to remove limits."}}
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
        - generic [ref=e13]:
          - generic [ref=e14]: Something went wrong
          - generic [ref=e15]: An action did not complete. Please try again.
      - listitem [ref=e16]:
        - button "Close toast" [ref=e17] [cursor=pointer]:
          - img [ref=e18]
        - img [ref=e22]
        - generic [ref=e27]: "Plan limit reached: test_cases_ai limit is 5 on free plan."
  - generic [ref=e28]:
    - banner [ref=e29]:
      - generic [ref=e30]:
        - img [ref=e31]
        - generic [ref=e34]:
          - generic [ref=e35]: You're on the Free plan (14 Days Left)
          - generic [ref=e36]: — unlock full access
        - button "Upgrade" [ref=e37] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e38]
      - generic [ref=e40]:
        - img "Xitester" [ref=e42]
        - generic [ref=e43]:
          - generic [ref=e44]: /
          - generic [ref=e45]:
            - button "qa-del-1784841164846-pw7a Free" [ref=e46] [cursor=pointer]:
              - img [ref=e47]
              - generic [ref=e51]: qa-del-1784841164846-pw7a
              - generic [ref=e52]: Free
            - button [ref=e53] [cursor=pointer]:
              - img [ref=e54]
          - generic [ref=e57]: /
          - 'generic "Current project: qa-prj-1784930899028-fm11" [ref=e58]':
            - img [ref=e59]
            - generic [ref=e61]: qa-prj-1784930899028-fm11
      - generic [ref=e62]:
        - button "Search... ⌘K" [ref=e63] [cursor=pointer]:
          - img [ref=e64]
          - generic [ref=e67]: Search...
          - generic [ref=e68]: ⌘K
        - generic [ref=e69]:
          - button "Help" [ref=e70] [cursor=pointer]:
            - img [ref=e71]
          - button "Notifications" [ref=e74] [cursor=pointer]:
            - img [ref=e75]
            - generic [ref=e78]: "4"
        - generic [ref=e80]:
          - generic [ref=e81]: STAGE
          - generic [ref=e82]: v1.2.5+patch.601
          - button "T" [ref=e83] [cursor=pointer]
    - generic [ref=e84]:
      - complementary:
        - navigation [ref=e85]:
          - button "Dashboard" [ref=e86] [cursor=pointer]:
            - img [ref=e88]
            - generic: Dashboard
          - button "Test Cases" [ref=e93] [cursor=pointer]:
            - img [ref=e95]
            - generic: Test Cases
          - button "Test Plans" [ref=e98] [cursor=pointer]:
            - img [ref=e100]
            - generic: Test Plans
          - button "Discovery" [ref=e104] [cursor=pointer]:
            - img [ref=e106]
            - generic: Discovery
          - button "Test Plan AI" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Test Plan AI
          - button "Test Data" [ref=e127] [cursor=pointer]:
            - img [ref=e129]
            - generic: Test Data
          - button "Quality" [ref=e133] [cursor=pointer]:
            - img [ref=e135]
            - generic: Quality
          - button "Api Tester" [ref=e138] [cursor=pointer]:
            - img [ref=e140]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e144] [cursor=pointer]:
            - img [ref=e146]
            - generic: Figma-to-web
          - button "Reports" [ref=e152] [cursor=pointer]:
            - img [ref=e154]
            - generic: Reports
          - button "Settings" [ref=e158] [cursor=pointer]:
            - img [ref=e160]
            - generic: Settings
        - button "Logout" [ref=e165] [cursor=pointer]:
          - img [ref=e167]
          - generic: Logout
      - main [ref=e171]:
        - generic [ref=e172]:
          - generic [ref=e173]:
            - generic [ref=e174]:
              - heading "Test Cases" [level=1] [ref=e175]
              - paragraph [ref=e176]: View and manage your test case analysis sessions
            - generic [ref=e177]:
              - button "Import" [ref=e178] [cursor=pointer]:
                - img [ref=e179]
                - text: Import
              - button "Refresh" [ref=e182] [cursor=pointer]:
                - img [ref=e183]
                - text: Refresh
              - generic "Your plan allows up to 10 test cases." [ref=e188]:
                - generic [ref=e189]:
                  - img [ref=e190]
                  - generic [ref=e193]:
                    - generic [ref=e194]: 5 / 10
                    - text: used
                - link "Upgrade" [ref=e195] [cursor=pointer]:
                  - /url: /org/billing
                  - text: Upgrade
                  - img [ref=e196]
              - button "New Test Case" [ref=e199] [cursor=pointer]:
                - img [ref=e200]
                - text: New Test Case
                - img [ref=e201]
          - generic [ref=e204]:
            - generic [ref=e205]:
              - img [ref=e206]
              - textbox "Search test cases…" [ref=e209]
            - tablist "Session type" [ref=e210]:
              - tab "Test Cases" [selected] [ref=e211] [cursor=pointer]
              - tab "Test Modules" [ref=e212] [cursor=pointer]
            - button "Status" [ref=e213] [cursor=pointer]:
              - img [ref=e214]
              - text: Status
            - button "Last Run" [ref=e216] [cursor=pointer]:
              - img [ref=e217]
              - text: Last Run
            - button "Created By" [ref=e219] [cursor=pointer]:
              - img [ref=e220]
              - text: Created By
            - button "Test Plan" [ref=e222] [cursor=pointer]:
              - img [ref=e223]
              - text: Test Plan
            - button "Source" [ref=e225] [cursor=pointer]:
              - img [ref=e226]
              - text: Source
          - table [ref=e230]:
            - rowgroup [ref=e231]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e232]:
                - columnheader [ref=e233]:
                  - checkbox [ref=e234] [cursor=pointer]
                - columnheader "#" [ref=e235]
                - columnheader "Title / Prompt" [ref=e236]
                - columnheader "Tags" [ref=e237]
                - columnheader "Analysis Status" [ref=e238]
                - columnheader "Last Run" [ref=e239]
                - columnheader "Steps" [ref=e240]
                - columnheader "Created" [ref=e241]
                - columnheader "Actions" [ref=e242]
            - rowgroup [ref=e243]:
              - link "1 qa-bulk-A-1784931248341-g4ef Manual Add tags Idle No Runs 0 Jul 24, 2026, 10:14 PM by Tester Clone test case Edit test case Delete test case" [ref=e244] [cursor=pointer]:
                - cell [ref=e245]:
                  - checkbox [ref=e246]
                - cell "1" [ref=e247]
                - cell "qa-bulk-A-1784931248341-g4ef Manual" [ref=e248]:
                  - generic [ref=e250]:
                    - generic [ref=e251]: qa-bulk-A-1784931248341-g4ef
                    - generic [ref=e252]:
                      - img [ref=e253]
                      - text: Manual
                - cell "Add tags" [ref=e256]:
                  - button "Add tags" [ref=e257]:
                    - generic [ref=e258]:
                      - img [ref=e259]
                      - text: Add tags
                - cell "Idle" [ref=e262]:
                  - generic [ref=e263]: Idle
                - cell "No Runs" [ref=e265]:
                  - generic [ref=e268]: No Runs
                - cell "0" [ref=e269]
                - cell "Jul 24, 2026, 10:14 PM by Tester" [ref=e270]:
                  - generic [ref=e271]:
                    - generic [ref=e272]: Jul 24, 2026, 10:14 PM
                    - generic [ref=e273]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e274]:
                  - generic [ref=e275]:
                    - button "Clone test case" [ref=e276]:
                      - img [ref=e277]
                    - button "Edit test case" [ref=e280]:
                      - img [ref=e281]
                    - button "Delete test case" [ref=e284]:
                      - img [ref=e285]
              - link "2 qa-rmtag-1784931234268-ipp0 Manual Add tags Idle No Runs 0 Jul 24, 2026, 10:13 PM by Tester Clone test case Edit test case Delete test case" [ref=e288] [cursor=pointer]:
                - cell [ref=e289]:
                  - checkbox [ref=e290]
                - cell "2" [ref=e291]
                - cell "qa-rmtag-1784931234268-ipp0 Manual" [ref=e292]:
                  - generic [ref=e294]:
                    - generic [ref=e295]: qa-rmtag-1784931234268-ipp0
                    - generic [ref=e296]:
                      - img [ref=e297]
                      - text: Manual
                - cell "Add tags" [ref=e300]:
                  - button "Add tags" [ref=e301]:
                    - generic [ref=e302]:
                      - img [ref=e303]
                      - text: Add tags
                - cell "Idle" [ref=e306]:
                  - generic [ref=e307]: Idle
                - cell "No Runs" [ref=e309]:
                  - generic [ref=e312]: No Runs
                - cell "0" [ref=e313]
                - cell "Jul 24, 2026, 10:13 PM by Tester" [ref=e314]:
                  - generic [ref=e315]:
                    - generic [ref=e316]: Jul 24, 2026, 10:13 PM
                    - generic [ref=e317]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e318]:
                  - generic [ref=e319]:
                    - button "Clone test case" [ref=e320]:
                      - img [ref=e321]
                    - button "Edit test case" [ref=e324]:
                      - img [ref=e325]
                    - button "Delete test case" [ref=e328]:
                      - img [ref=e329]
              - link "3 qa-rmtag-1784931220033-62v8 Manual Add tags Idle No Runs 0 Jul 24, 2026, 10:13 PM by Tester Clone test case Edit test case Delete test case" [ref=e332] [cursor=pointer]:
                - cell [ref=e333]:
                  - checkbox [ref=e334]
                - cell "3" [ref=e335]
                - cell "qa-rmtag-1784931220033-62v8 Manual" [ref=e336]:
                  - generic [ref=e338]:
                    - generic [ref=e339]: qa-rmtag-1784931220033-62v8
                    - generic [ref=e340]:
                      - img [ref=e341]
                      - text: Manual
                - cell "Add tags" [ref=e344]:
                  - button "Add tags" [ref=e345]:
                    - generic [ref=e346]:
                      - img [ref=e347]
                      - text: Add tags
                - cell "Idle" [ref=e350]:
                  - generic [ref=e351]: Idle
                - cell "No Runs" [ref=e353]:
                  - generic [ref=e356]: No Runs
                - cell "0" [ref=e357]
                - cell "Jul 24, 2026, 10:13 PM by Tester" [ref=e358]:
                  - generic [ref=e359]:
                    - generic [ref=e360]: Jul 24, 2026, 10:13 PM
                    - generic [ref=e361]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e362]:
                  - generic [ref=e363]:
                    - button "Clone test case" [ref=e364]:
                      - img [ref=e365]
                    - button "Edit test case" [ref=e368]:
                      - img [ref=e369]
                    - button "Delete test case" [ref=e372]:
                      - img [ref=e373]
              - link "4 qa-tag-1784931205768-2al0 Manual Add tags Idle No Runs 0 Jul 24, 2026, 10:13 PM by Tester Clone test case Edit test case Delete test case" [ref=e376] [cursor=pointer]:
                - cell [ref=e377]:
                  - checkbox [ref=e378]
                - cell "4" [ref=e379]
                - cell "qa-tag-1784931205768-2al0 Manual" [ref=e380]:
                  - generic [ref=e382]:
                    - generic [ref=e383]: qa-tag-1784931205768-2al0
                    - generic [ref=e384]:
                      - img [ref=e385]
                      - text: Manual
                - cell "Add tags" [ref=e388]:
                  - button "Add tags" [ref=e389]:
                    - generic [ref=e390]:
                      - img [ref=e391]
                      - text: Add tags
                - cell "Idle" [ref=e394]:
                  - generic [ref=e395]: Idle
                - cell "No Runs" [ref=e397]:
                  - generic [ref=e400]: No Runs
                - cell "0" [ref=e401]
                - cell "Jul 24, 2026, 10:13 PM by Tester" [ref=e402]:
                  - generic [ref=e403]:
                    - generic [ref=e404]: Jul 24, 2026, 10:13 PM
                    - generic [ref=e405]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e406]:
                  - generic [ref=e407]:
                    - button "Clone test case" [ref=e408]:
                      - img [ref=e409]
                    - button "Edit test case" [ref=e412]:
                      - img [ref=e413]
                    - button "Delete test case" [ref=e416]:
                      - img [ref=e417]
              - link "5 qa-tag-1784931191773-xjaj Manual Add tags Idle No Runs 0 Jul 24, 2026, 10:13 PM by Tester Clone test case Edit test case Delete test case" [ref=e420] [cursor=pointer]:
                - cell [ref=e421]:
                  - checkbox [ref=e422]
                - cell "5" [ref=e423]
                - cell "qa-tag-1784931191773-xjaj Manual" [ref=e424]:
                  - generic [ref=e426]:
                    - generic [ref=e427]: qa-tag-1784931191773-xjaj
                    - generic [ref=e428]:
                      - img [ref=e429]
                      - text: Manual
                - cell "Add tags" [ref=e432]:
                  - button "Add tags" [ref=e433]:
                    - generic [ref=e434]:
                      - img [ref=e435]
                      - text: Add tags
                - cell "Idle" [ref=e438]:
                  - generic [ref=e439]: Idle
                - cell "No Runs" [ref=e441]:
                  - generic [ref=e444]: No Runs
                - cell "0" [ref=e445]
                - cell "Jul 24, 2026, 10:13 PM by Tester" [ref=e446]:
                  - generic [ref=e447]:
                    - generic [ref=e448]: Jul 24, 2026, 10:13 PM
                    - generic [ref=e449]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e450]:
                  - generic [ref=e451]:
                    - button "Clone test case" [ref=e452]:
                      - img [ref=e453]
                    - button "Edit test case" [ref=e456]:
                      - img [ref=e457]
                    - button "Delete test case" [ref=e460]:
                      - img [ref=e461]
          - generic [ref=e466]:
            - generic [ref=e467]: 1–5 of 5 test cases
            - generic [ref=e468]:
              - generic [ref=e469]:
                - generic [ref=e470]: Rows per page
                - combobox [ref=e471] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e472]
              - generic [ref=e474]:
                - generic [ref=e475]: Page 1of1
                - generic [ref=e476]:
                  - button "First page" [disabled]:
                    - img
                  - button "Previous page" [disabled]:
                    - img
                  - button "Next page" [disabled]:
                    - img
                  - button "Last page" [disabled]:
                    - img
          - dialog [ref=e477]:
            - generic [ref=e479]:
              - generic [ref=e480]:
                - generic [ref=e481]:
                  - img [ref=e482]
                  - heading "Create Test Case" [level=2] [ref=e485]
                - button "Close" [ref=e486] [cursor=pointer]:
                  - img [ref=e487]
              - generic [ref=e490]:
                - paragraph [ref=e491]: Enter the test case name. AI will use this name when generating and saving the test case.
                - generic [ref=e492]:
                  - generic [ref=e493]: Name *
                  - textbox "Name *" [ref=e494]:
                    - /placeholder: My Test Case
                    - text: qa-bulk-A-1784931257822-qig1
                  - generic [ref=e496]: 28/200
                - generic [ref=e497]:
                  - generic [ref=e498]: Description
                  - textbox "Description" [ref=e499]:
                    - /placeholder: Optional description for this test case...
                  - generic [ref=e501]: 0/5000
                - generic [ref=e502]:
                  - button "Cancel" [ref=e503] [cursor=pointer]
                  - button "Create" [ref=e504] [cursor=pointer]
```

# Test source

```ts
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
  106 |     await page.locator('button[data-tour="ai-test-create"]').waitFor({ state: 'visible', timeout: 5_000 })
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
> 168 |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
      |               ^ Error: createSession 409: {"detail":{"error_code":"PLAN_LIMIT_EXCEEDED","plan_tier":"free","resource":"test_cases_ai","limit":5,"current":5,"upgrade_hint":"Upgrade this organization to enterprise to remove limits."}}
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
  207 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  208 | 
  209 |     await dialog.locator('#edit-test-case-name').fill(newTitle)
  210 |     if (newDescription !== undefined) {
  211 |         await dialog.locator('#edit-test-case-description').fill(newDescription)
  212 |     }
  213 | 
  214 |     await Promise.all([
  215 |         waitForApi(page, /\/api\/analysis\/sessions\/[^/]+\/title\b/, 'PATCH', 10_000),
  216 |         dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
  217 |     ])
  218 | 
  219 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  220 | }
  221 | 
  222 | async function uiCloneTestCase(page: Page, row: Locator, newTitle: string): Promise<void> {
  223 |     await clickRowAction(row, 'Clone test case')
  224 | 
  225 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Clone Test Case' })
  226 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  227 | 
  228 |     await dialog.locator('#cloneTitle').fill(newTitle)
  229 | 
  230 |     const [response] = await Promise.all([
  231 |         waitForApi(page, /\/api\/analysis\/sessions\/[^/]+\/clone\b/, 'POST'),
  232 |         dialog.locator('button[type="submit"]', { hasText: /^Clone$/ }).click(),
  233 |     ])
  234 |     expect(response.status()).toBe(200)
  235 | 
  236 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  237 | }
  238 | 
  239 | async function uiDeleteTestCase(page: Page, name: string, row: Locator): Promise<void> {
  240 |     await clickRowAction(row, 'Delete test case')
  241 | 
  242 |     // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
  243 |     const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
  244 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  245 | 
  246 |     await Promise.all([
  247 |         waitForApi(page, /\/api\/analysis\/sessions\/[^/]+$/, 'DELETE', 10_000),
  248 |         dialog.locator('button', { hasText: /^Delete$/ }).first().click(),
  249 |     ])
  250 | 
  251 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  252 |     await expectToast(page, /test case deleted/i)
  253 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 10_000 })
  254 | }
  255 | 
  256 | /** The portaled "Edit tags" dialog opened from a row's tags cell. */
  257 | function tagEditor(page: Page): Locator {
  258 |     return page.getByRole('dialog').filter({ hasText: 'Edit tags' })
  259 | }
  260 | 
  261 | /** Open a row's tags cell, revealing the portaled "Edit tags" combobox. */
  262 | async function openTagEditor(page: Page, row: Locator): Promise<Locator> {
  263 |     // The tags cell opens a dialog portaled to <body> — the combobox is NOT a
  264 |     // descendant of the row, so target the dialog rather than the row.
  265 |     await row.locator('button[title="Click to edit tags"]').click()
  266 |     const input = tagEditor(page).getByRole('combobox')
  267 |     await expect(input).toBeVisible({ timeout: 5_000 })
  268 |     return input
```