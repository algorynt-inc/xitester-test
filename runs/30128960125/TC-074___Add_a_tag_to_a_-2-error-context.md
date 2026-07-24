# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-074 — Add a tag to a test case
- Location: tests/test-cases.spec.ts:486:1

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
        - img "Xitester" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: /
          - generic [ref=e10]:
            - button "XiTester Automation Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: XiTester Automation
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
            - generic [ref=e47]: "12"
        - generic [ref=e49]:
          - generic [ref=e50]: QA
          - generic [ref=e51]: v1.2.6+patch.607
          - button "T" [ref=e52] [cursor=pointer]
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
          - button "Figma-to-web" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Figma-to-web
          - button "Reports" [ref=e121] [cursor=pointer]:
            - img [ref=e123]
            - generic: Reports
          - button "Settings" [ref=e127] [cursor=pointer]:
            - img [ref=e129]
            - generic: Settings
        - button "Logout" [ref=e134] [cursor=pointer]:
          - img [ref=e136]
          - generic: Logout
      - main [ref=e140]:
        - generic [ref=e141]:
          - generic [ref=e142]:
            - generic [ref=e143]:
              - heading "Test Cases" [level=1] [ref=e144]
              - paragraph [ref=e145]: View and manage your test case analysis sessions
            - generic [ref=e146]:
              - button "Import" [ref=e147] [cursor=pointer]:
                - img [ref=e148]
                - text: Import
              - button "Refresh" [ref=e151] [cursor=pointer]:
                - img [ref=e152]
                - text: Refresh
              - button "New Test Case" [ref=e158] [cursor=pointer]:
                - img [ref=e159]
                - text: New Test Case
                - img [ref=e160]
          - generic [ref=e163]:
            - generic [ref=e164]:
              - img [ref=e165]
              - textbox "Search test cases…" [ref=e168]: qa-tag-1784930224709-voii
            - tablist "Session type" [ref=e169]:
              - tab "Test Cases" [selected] [ref=e170] [cursor=pointer]
              - tab "Test Modules" [ref=e171] [cursor=pointer]
            - button "Status" [ref=e172] [cursor=pointer]:
              - img [ref=e173]
              - text: Status
            - button "Last Run" [ref=e175] [cursor=pointer]:
              - img [ref=e176]
              - text: Last Run
            - button "Created By" [ref=e178] [cursor=pointer]:
              - img [ref=e179]
              - text: Created By
            - button "Test Plan" [ref=e181] [cursor=pointer]:
              - img [ref=e182]
              - text: Test Plan
            - button "Source" [ref=e184] [cursor=pointer]:
              - img [ref=e185]
              - text: Source
            - button "Reset" [ref=e187] [cursor=pointer]:
              - img [ref=e188]
              - text: Reset
          - table [ref=e193]:
            - rowgroup [ref=e194]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e195]:
                - columnheader [ref=e196]:
                  - checkbox [ref=e197] [cursor=pointer]
                - columnheader "#" [ref=e198]
                - columnheader "Title / Prompt" [ref=e199]
                - columnheader "Tags" [ref=e200]
                - columnheader "Analysis Status" [ref=e201]
                - columnheader "Last Run" [ref=e202]
                - columnheader "Steps" [ref=e203]
                - columnheader "Created" [ref=e204]
                - columnheader "Actions" [ref=e205]
            - rowgroup [ref=e206]:
              - link "1 qa-tag-1784930224709-voii Manual Idle No Runs 0 Jul 24, 2026, 09:57 PM by Tester Clone test case Edit test case Delete test case" [ref=e207] [cursor=pointer]:
                - cell [ref=e208]:
                  - checkbox [ref=e209]
                - cell "1" [ref=e210]
                - cell "qa-tag-1784930224709-voii Manual" [ref=e211]:
                  - generic [ref=e213]:
                    - generic [ref=e214]: qa-tag-1784930224709-voii
                    - generic [ref=e215]:
                      - img [ref=e216]
                      - text: Manual
                - cell [ref=e219]:
                  - combobox "Add tags…" [ref=e223]
                - cell "Idle" [ref=e224]:
                  - generic [ref=e225]: Idle
                - cell "No Runs" [ref=e227]:
                  - generic [ref=e230]: No Runs
                - cell "0" [ref=e231]
                - cell "Jul 24, 2026, 09:57 PM by Tester" [ref=e232]:
                  - generic [ref=e233]:
                    - generic [ref=e234]: Jul 24, 2026, 09:57 PM
                    - generic [ref=e235]: by Tester
                - cell "Clone test case Edit test case Delete test case" [ref=e236]:
                  - generic [ref=e237]:
                    - button "Clone test case" [ref=e238]:
                      - img [ref=e239]
                    - button "Edit test case" [ref=e242]:
                      - img [ref=e243]
                    - button "Delete test case" [ref=e246]:
                      - img [ref=e247]
          - generic [ref=e252]:
            - generic [ref=e253]: 1–1 of 1 test cases
            - generic [ref=e254]:
              - generic [ref=e255]:
                - generic [ref=e256]: Rows per page
                - combobox [ref=e257] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e258]
              - generic [ref=e260]:
                - generic [ref=e261]: Page 1of1
                - generic [ref=e262]:
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