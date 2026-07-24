# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-075 — Removing a tag persists after page reload
- Location: tests/test-cases.spec.ts:502:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').filter({ hasText: 'Edit tags' }).getByRole('combobox')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog').filter({ hasText: 'Edit tags' }).getByRole('combobox')

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
          - 'generic "Current project: qa-prj-1784930899028-fm11" [ref=e33]':
            - img [ref=e34]
            - generic [ref=e36]: qa-prj-1784930899028-fm11
      - generic [ref=e37]:
        - button "Search... ⌘K" [ref=e38] [cursor=pointer]:
          - img [ref=e39]
          - generic [ref=e42]: Search...
          - generic [ref=e43]: ⌘K
        - generic [ref=e44]:
          - button "Help" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
          - button "Notifications" [ref=e49] [cursor=pointer]:
            - img [ref=e50]
            - generic [ref=e53]: "4"
        - generic [ref=e55]:
          - generic [ref=e56]: STAGE
          - generic [ref=e57]: v1.2.5+patch.601
          - button "T" [ref=e58] [cursor=pointer]
    - generic [ref=e59]:
      - complementary:
        - navigation [ref=e60]:
          - button "Dashboard" [ref=e61] [cursor=pointer]:
            - img [ref=e63]
            - generic: Dashboard
          - button "Test Cases" [ref=e68] [cursor=pointer]:
            - img [ref=e70]
            - generic: Test Cases
          - button "Test Plans" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Test Plans
          - button "Discovery" [ref=e79] [cursor=pointer]:
            - img [ref=e81]
            - generic: Discovery
          - button "Test Plan AI" [ref=e88] [cursor=pointer]:
            - img [ref=e90]
            - generic: Test Plan AI
          - button "Test Data" [ref=e102] [cursor=pointer]:
            - img [ref=e104]
            - generic: Test Data
          - button "Quality" [ref=e108] [cursor=pointer]:
            - img [ref=e110]
            - generic: Quality
          - button "Api Tester" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e119] [cursor=pointer]:
            - img [ref=e121]
            - generic: Figma-to-web
          - button "Reports" [ref=e127] [cursor=pointer]:
            - img [ref=e129]
            - generic: Reports
          - button "Settings" [ref=e133] [cursor=pointer]:
            - img [ref=e135]
            - generic: Settings
        - button "Logout" [ref=e140] [cursor=pointer]:
          - img [ref=e142]
          - generic: Logout
      - main [ref=e146]:
        - generic [ref=e147]:
          - generic [ref=e148]:
            - generic [ref=e149]:
              - heading "Test Cases" [level=1] [ref=e150]
              - paragraph [ref=e151]: View and manage your test case analysis sessions
            - generic [ref=e152]:
              - button "Import" [ref=e153] [cursor=pointer]:
                - img [ref=e154]
                - text: Import
              - button "Refresh" [ref=e157] [cursor=pointer]:
                - img [ref=e158]
                - text: Refresh
              - generic "Your plan allows up to 10 test cases." [ref=e163]:
                - generic [ref=e164]:
                  - img [ref=e165]
                  - generic [ref=e168]:
                    - generic [ref=e169]: 4 / 10
                    - text: used
                - link "Upgrade" [ref=e170] [cursor=pointer]:
                  - /url: /org/billing
                  - text: Upgrade
                  - img [ref=e171]
              - button "New Test Case" [ref=e174] [cursor=pointer]:
                - img [ref=e175]
                - text: New Test Case
                - img [ref=e176]
          - generic [ref=e179]:
            - generic [ref=e180]:
              - img [ref=e181]
              - textbox "Search test cases…" [ref=e184]: qa-rmtag-1784931234268-ipp0
            - tablist "Session type" [ref=e185]:
              - tab "Test Cases" [selected] [ref=e186] [cursor=pointer]
              - tab "Test Modules" [ref=e187] [cursor=pointer]
            - button "Status" [ref=e188] [cursor=pointer]:
              - img [ref=e189]
              - text: Status
            - button "Last Run" [ref=e191] [cursor=pointer]:
              - img [ref=e192]
              - text: Last Run
            - button "Created By" [ref=e194] [cursor=pointer]:
              - img [ref=e195]
              - text: Created By
            - button "Test Plan" [ref=e197] [cursor=pointer]:
              - img [ref=e198]
              - text: Test Plan
            - button "Source" [ref=e200] [cursor=pointer]:
              - img [ref=e201]
              - text: Source
            - button "Reset" [ref=e203] [cursor=pointer]:
              - img [ref=e204]
              - text: Reset
          - table [ref=e209]:
            - rowgroup [ref=e210]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e211]:
                - columnheader [ref=e212]:
                  - checkbox [ref=e213] [cursor=pointer]
                - columnheader "#" [ref=e214]
                - columnheader "Title / Prompt" [ref=e215]
                - columnheader "Tags" [ref=e216]
                - columnheader "Analysis Status" [ref=e217]
                - columnheader "Last Run" [ref=e218]
                - columnheader "Steps" [ref=e219]
                - columnheader "Created" [ref=e220]
                - columnheader "Actions" [ref=e221]
            - rowgroup [ref=e222]:
              - link "1 qa-rmtag-1784931234268-ipp0 Manual Idle No Runs 0 Jul 24, 2026, 10:13 PM by Tester Clone test case Edit test case Delete test case" [ref=e223] [cursor=pointer]:
                - cell [ref=e224]:
                  - checkbox [ref=e225]
                - cell "1" [ref=e226]
                - cell "qa-rmtag-1784931234268-ipp0 Manual" [ref=e227]:
                  - generic [ref=e229]:
                    - generic [ref=e230]: qa-rmtag-1784931234268-ipp0
                    - generic [ref=e231]:
                      - img [ref=e232]
                      - text: Manual
                - cell [ref=e235]:
                  - combobox "Add tags…" [ref=e239]
                - cell "Idle" [ref=e240]:
                  - generic [ref=e241]: Idle
                - cell "No Runs" [ref=e243]:
                  - generic [ref=e246]: No Runs
                - cell "0" [ref=e247]
                - cell "Jul 24, 2026, 10:13 PM by Tester" [ref=e248]:
                  - generic [ref=e249]:
                    - generic [ref=e250]: Jul 24, 2026, 10:13 PM
                    - generic [ref=e251]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e252]:
                  - generic [ref=e253]:
                    - button "Clone test case" [ref=e254]:
                      - img [ref=e255]
                    - button "Edit test case" [ref=e258]:
                      - img [ref=e259]
                    - button "Delete test case" [ref=e262]:
                      - img [ref=e263]
          - generic [ref=e268]:
            - generic [ref=e269]: 1–1 of 1 test cases
            - generic [ref=e270]:
              - generic [ref=e271]:
                - generic [ref=e272]: Rows per page
                - combobox [ref=e273] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e274]
              - generic [ref=e276]:
                - generic [ref=e277]: Page 1of1
                - generic [ref=e278]:
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
> 267 |     await expect(input).toBeVisible({ timeout: 5_000 })
      |                         ^ Error: expect(locator).toBeVisible() failed
  268 |     return input
  269 | }
  270 | 
  271 | /** Attach a new tag to a row via the "Edit tags" dialog. */
  272 | async function uiAddTag(page: Page, row: Locator, tagName: string): Promise<void> {
  273 |     const tagInput = await openTagEditor(page, row)
  274 | 
  275 |     await tagInput.fill(tagName)
  276 |     // First creates the tag via POST /api/tags, then attaches it via
  277 |     // POST /api/tags/session/<id>. Wait for the attach call (the second one)
  278 |     // since it's the persistence boundary the assertion cares about.
  279 |     await Promise.all([
  280 |         waitForApi(page, /\/api\/tags\/session\/[^/]+\b/, 'POST'),
  281 |         tagInput.press('Enter'),
  282 |     ])
  283 | 
  284 |     // Close the editor and confirm the chip landed on the row.
  285 |     await page.keyboard.press('Escape')
  286 |     await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })
  287 | }
  288 | 
  289 | // ============================================================
  290 | // Tests — preserve user-supplied numbering TC-065 .. TC-076
  291 | // ============================================================
  292 | 
  293 | test('TC-065 — Create AI test case with name and description', async ({ page }) => {
  294 |     const name = `qa-ai-${ts()}`
  295 | 
  296 |     const sessionId = await uiCreateAITestCase(page, name, 'Created by Playwright TC-065')
  297 | 
  298 |     // Step 7 — verify navigation to test analysis page.
  299 |     expect(page.url()).toMatch(new RegExp(`/test-analysis/${sessionId}`))
  300 |     await expect(page.getByText('Start a test')).toBeVisible({ timeout: 30_000 })
  301 | 
  302 |     // Verify it's listed when we go back.
  303 |     await gotoTestCases(page)
  304 |     await searchFor(page, name)
  305 |     await expect(testCaseRow(page, name)).toBeVisible({ timeout: 8_000 })
  306 | 
  307 |     // Cleanup so the project ends clean.
  308 |     await uiDeleteTestCase(page, name, testCaseRow(page, name))
  309 | })
  310 | 
  311 | test('TC-066 — Update existing AI test case name and description', async ({ page }) => {
  312 |     const original = `qa-ai-${ts()}`
  313 |     const renamed = `qa-renamed-${ts()}`
  314 | 
  315 |     await uiCreateAITestCase(page, original, 'Original description')
  316 |     await gotoTestCases(page)
  317 |     await searchFor(page, original)
  318 |     const row = testCaseRow(page, original)
  319 |     await expect(row).toBeVisible({ timeout: 8_000 })
  320 | 
  321 |     await uiUpdateTestCase(page, row, renamed, 'Edited by Playwright TC-066')
  322 | 
  323 |     // Verify success toast + new name visible after edit.
  324 |     await expectToast(page, /test case updated/i)
  325 |     await clearSearch(page)
  326 |     await searchFor(page, renamed)
  327 |     await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
  328 |     await expect(page.getByText(original, { exact: true })).toBeHidden()
  329 | 
  330 |     // Cleanup.
  331 |     await uiDeleteTestCase(page, original, testCaseRow(page, renamed))
  332 | })
  333 | 
  334 | test('TC-067 — Delete AI test case', async ({ page }) => {
  335 |     const name = `qa-del-${ts()}`
  336 | 
  337 |     await uiCreateAITestCase(page, name)
  338 |     await gotoTestCases(page)
  339 |     await searchFor(page, name)
  340 |     const row = testCaseRow(page, name)
  341 |     await expect(row).toBeVisible({ timeout: 8_000 })
  342 | 
  343 |     await uiDeleteTestCase(page, name, row)
  344 | 
  345 |     // After delete: row is gone.
  346 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  347 | })
  348 | 
  349 | test('TC-068 — Clone AI test case', async ({ page }) => {
  350 |     const original = `qa-src-${ts()}`
  351 |     const cloneName = `qa-clone-${ts()}`
  352 | 
  353 |     await uiCreateAITestCase(page, original, 'Source for clone')
  354 |     await gotoTestCases(page)
  355 |     await searchFor(page, original)
  356 |     const sourceRow = testCaseRow(page, original)
  357 |     await expect(sourceRow).toBeVisible({ timeout: 8_000 })
  358 |     await uiCloneTestCase(page, sourceRow, cloneName)
  359 | 
  360 |     // Both rows should now exist. Search for clone first to give the list
  361 |     // time to refresh.
  362 |     await clearSearch(page)
  363 |     await searchFor(page, cloneName)
  364 |     await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })
  365 | 
  366 |     await clearSearch(page)
  367 |     await searchFor(page, original)
```