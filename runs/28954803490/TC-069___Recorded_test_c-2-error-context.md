# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-069 — Recorded test case modal accepts name + URL and routes to recording flow
- Location: tests/test-cases.spec.ts:327:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('https://xitester.com')
Expected: visible
Error: strict mode violation: getByText('https://xitester.com') resolved to 2 elements:
    1) <span>Recording session starting at https://xitester.com</span> aka getByText('Recording session starting at')
    2) <span title="https://xitester.com" class="text-white text-[13px] truncate font-mono flex-1 min-w-0">https://xitester.com</span> aka getByText('https://xitester.com', { exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('https://xitester.com')

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
        - generic [ref=e13]: Recording session started
  - generic [ref=e14]:
    - banner [ref=e15]:
      - generic [ref=e16]:
        - img "Xitester" [ref=e18]
        - generic [ref=e19]:
          - generic [ref=e20]: /
          - generic [ref=e21]:
            - button "XiTester Enterprise" [ref=e22] [cursor=pointer]:
              - img [ref=e23]
              - generic [ref=e27]: XiTester
              - generic [ref=e28]: Enterprise
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e30]
          - generic [ref=e33]: /
          - 'button "Switch project. Current project: Default Project" [ref=e35] [cursor=pointer]':
            - img [ref=e36]
            - generic [ref=e38]: Default Project
            - img [ref=e39]
      - generic [ref=e42]:
        - button "Search... ⌘K" [ref=e43] [cursor=pointer]:
          - img [ref=e44]
          - generic [ref=e47]: Search...
          - generic [ref=e48]: ⌘K
        - generic [ref=e49]:
          - button "Help" [ref=e50] [cursor=pointer]:
            - img [ref=e51]
          - button "Notifications" [ref=e54] [cursor=pointer]:
            - img [ref=e55]
            - generic [ref=e58]: 99+
        - generic [ref=e60]:
          - generic [ref=e61]: DEV
          - generic [ref=e62]: v1.2.0
          - button "A" [ref=e63] [cursor=pointer]
    - generic [ref=e64]:
      - complementary:
        - navigation [ref=e65]:
          - button "Dashboard" [ref=e66] [cursor=pointer]:
            - img [ref=e68]
            - generic: Dashboard
          - button "Test Cases" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Test Cases
          - button "Test Plans" [ref=e78] [cursor=pointer]:
            - img [ref=e80]
            - generic: Test Plans
          - button "Discovery" [ref=e84] [cursor=pointer]:
            - img [ref=e86]
            - generic: Discovery
          - button "Test Plan AI" [ref=e93] [cursor=pointer]:
            - img [ref=e95]
            - generic: Test Plan AI
          - button "Test Data" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Test Data
          - button "Quality" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Quality
          - button "Api Tester" [ref=e118] [cursor=pointer]:
            - img [ref=e120]
            - generic: Api Tester
          - button "Reports" [ref=e124] [cursor=pointer]:
            - img [ref=e126]
            - generic: Reports
          - button "Settings" [ref=e130] [cursor=pointer]:
            - img [ref=e132]
            - generic: Settings
        - button "Logout" [ref=e137] [cursor=pointer]:
          - img [ref=e139]
          - generic: Logout
      - main [ref=e143]:
        - generic [ref=e144]:
          - generic [ref=e145]:
            - button "Back to test cases" [ref=e146] [cursor=pointer]:
              - img [ref=e147]
            - generic [ref=e149]:
              - heading "qa-rec-1783524706106-xs3u" [level=2] [ref=e150]
              - button "Edit test case" [ref=e151] [cursor=pointer]:
                - img [ref=e152]
              - generic [ref=e155]:
                - img [ref=e157]
                - text: Ready to Record
          - generic [ref=e160]:
            - generic [ref=e161]:
              - generic [ref=e162]:
                - generic [ref=e163]: Analysis Steps
                - generic [ref=e164]:
                  - button "Link Test Data" [ref=e166] [cursor=pointer]:
                    - img [ref=e167]
                  - button "Variables" [ref=e171] [cursor=pointer]:
                    - img [ref=e172]
                  - button "Filter and display" [ref=e175] [cursor=pointer]:
                    - img [ref=e176]
                  - button "Reset" [ref=e178] [cursor=pointer]:
                    - img [ref=e179]
                    - text: Reset
                - button "Analysis settings" [ref=e182] [cursor=pointer]:
                  - img [ref=e183]
              - generic [ref=e195] [cursor=pointer]:
                - generic [ref=e196]:
                  - generic [ref=e198]: "1"
                  - img [ref=e200]
                - generic [ref=e203]:
                  - generic "https://xitester.com" [ref=e205]
                  - generic [ref=e206]:
                    - button "Disable action" [ref=e207]:
                      - img [ref=e208]
                    - button "Toggle details" [ref=e214]:
                      - img [ref=e215]
              - button "Open prompt" [ref=e219] [cursor=pointer]:
                - img [ref=e220]
            - img [ref=e224]
            - generic [ref=e232]:
              - generic [ref=e233]:
                - button "Analysis" [ref=e234] [cursor=pointer]:
                  - img [ref=e235]
                  - text: Analysis
                - button "Execution" [ref=e237] [cursor=pointer]:
                  - img [ref=e238]
                  - text: Execution
              - generic [ref=e241]:
                - paragraph [ref=e247]: Starting live browser…
                - generic [ref=e249]:
                  - button "Live Browser" [ref=e250] [cursor=pointer]
                  - button "Screenshots" [ref=e251] [cursor=pointer]
                  - button "Logs" [ref=e252] [cursor=pointer]
```

# Test source

```ts
  252 |     await gotoTestCases(page)
  253 |     await searchFor(page, original)
  254 |     const row = testCaseRow(page, original)
  255 |     await expect(row).toBeVisible({ timeout: 8_000 })
  256 | 
  257 |     await uiUpdateTestCase(page, row, renamed, 'Edited by Playwright TC-066')
  258 | 
  259 |     // Verify success toast + new name visible after edit.
  260 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  261 |         /test case updated/i,
  262 |         { timeout: 5_000 },
  263 |     )
  264 |     await clearSearch(page)
  265 |     await searchFor(page, renamed)
  266 |     await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
  267 |     await expect(page.getByText(original, { exact: true })).toBeHidden()
  268 | 
  269 |     // Cleanup.
  270 |     await uiDeleteTestCase(page, testCaseRow(page, renamed))
  271 | })
  272 | 
  273 | test('TC-067 — Delete AI test case', async ({ page }) => {
  274 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  275 |     const name = `qa-del-${ts()}`
  276 | 
  277 |     await uiCreateAITestCase(page, name)
  278 |     await gotoTestCases(page)
  279 |     await searchFor(page, name)
  280 |     const row = testCaseRow(page, name)
  281 |     await expect(row).toBeVisible({ timeout: 8_000 })
  282 | 
  283 |     await uiDeleteTestCase(page, row)
  284 | 
  285 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  286 |         /test case deleted/i,
  287 |         { timeout: 5_000 },
  288 |     )
  289 |     // After delete: row is gone.
  290 |     await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
  291 | })
  292 | 
  293 | test('TC-068 — Clone AI test case', async ({ page }) => {
  294 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  295 |     const original = `qa-src-${ts()}`
  296 |     const cloneName = `qa-clone-${ts()}`
  297 | 
  298 |     await uiCreateAITestCase(page, original, 'Source for clone')
  299 |     await gotoTestCases(page)
  300 |     await searchFor(page, original)
  301 |     const sourceRow = testCaseRow(page, original)
  302 |     await expect(sourceRow).toBeVisible({ timeout: 8_000 })
  303 | 
  304 |     await uiCloneTestCase(page, sourceRow, cloneName)
  305 | 
  306 |     // Both rows should now exist. Search for clone first to give the list
  307 |     // time to refresh.
  308 |     await clearSearch(page)
  309 |     await searchFor(page, cloneName)
  310 |     await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })
  311 | 
  312 |     await clearSearch(page)
  313 |     await searchFor(page, original)
  314 |     await expect(testCaseRow(page, original)).toBeVisible({ timeout: 8_000 })
  315 | 
  316 |     // Cleanup both.
  317 |     await clearSearch(page)
  318 |     await searchFor(page, cloneName)
  319 |     await uiDeleteTestCase(page, testCaseRow(page, cloneName))
  320 |     await clearSearch(page)
  321 |     await searchFor(page, original)
  322 |     await uiDeleteTestCase(page, testCaseRow(page, original))
  323 | })
  324 | 
  325 | const recordTestCaseName = `qa-rec-${ts()}`
  326 | 
  327 | test('TC-069 — Recorded test case modal accepts name + URL and routes to recording flow', async ({ page }) => {
  328 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  329 |     // We don't actually start a recording (it spins up a remote browser
  330 |     // container). We assert that the modal collects the inputs, validates
  331 |     // the URL, and routes the user into the /test-analysis recording entry
  332 |     // — that's the user-driven boundary on this page.
  333 | 
  334 |     // const name = `qa-rec-${ts()}`
  335 |     await gotoTestCases(page)
  336 |     await openNewTestCaseDropdown(page)
  337 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  338 | 
  339 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
  340 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  341 | 
  342 |     await dialog.locator('#recordTestName').fill(recordTestCaseName)
  343 |     await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
  344 |     await dialog.locator('#startUrl').fill('https://xitester.com')
  345 | 
  346 |     await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
  347 | 
  348 |     // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
  349 |     await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
  350 |     expect(page.url()).toMatch(/\/test-analysis/)
  351 |     await expect(page.getByText('Analysis Steps')).toBeVisible();
> 352 |     await expect(page.getByText('https://xitester.com')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  353 |     await gotoTestCases(page)
  354 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  355 |     await searchFor(page, recordTestCaseName)
  356 | 
  357 | })
  358 | 
  359 | test('TC-070 — Update an existing recorded test case', async ({ page }) => {
  360 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  361 |     // Recorded test cases are produced by the recording-browser flow, which
  362 |     // requires a remote container we deliberately don't drive in CI. So we
  363 |     // pick the first session in the list whose row carries the "Recorded"
  364 |     // badge. Skip cleanly when the project doesn't have one yet.
  365 | 
  366 |     await gotoTestCases(page)
  367 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  368 |     await searchFor(page, recordTestCaseName)
  369 |     const recordedRow = page
  370 |         .locator('table tbody tr.test-case-row')
  371 |         .filter({ has: page.getByText(recordTestCaseName) })
  372 |         .filter({ has: page.getByText(/^Recorded$/) })
  373 |         .first()
  374 |     if (!(await recordedRow.isVisible().catch(() => false))) {
  375 |         test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
  376 |     }
  377 | 
  378 |     // Capture the original title so we can revert in cleanup.
  379 |     const titleCell = recordedRow.locator('td').nth(2)
  380 |     const originalTitle = (await titleCell.locator('.font-medium').first().innerText()).trim()
  381 |     const renamed = `qa-rec-edit-${ts()}`
  382 | 
  383 |     await uiUpdateTestCase(page, recordedRow, renamed)
  384 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  385 |         /test case updated/i,
  386 |         { timeout: 5_000 },
  387 |     )
  388 |     await searchFor(page, renamed)
  389 |     await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
  390 | 
  391 |     // Revert so we leave the project as we found it.
  392 |     await uiUpdateTestCase(page, testCaseRow(page, renamed), originalTitle)
  393 |     await clearSearch(page)
  394 | })
  395 | 
  396 | test('TC-071 — Delete a recorded test case', async ({ page }) => {
  397 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  398 |     // Hard to safely delete a real recorded session (it may be load-bearing
  399 |     // for the user). Instead, find a recorded one named with our `qa-rec-*`
  400 |     // prefix from prior runs (orphans), and delete that. If none, skip.
  401 | 
  402 |     await gotoTestCases(page)
  403 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  404 |     await searchFor(page, recordTestCaseName)
  405 |     const orphan = page
  406 |         .locator('table tbody tr.test-case-row')
  407 |         .filter({ has: page.getByText(recordTestCaseName) })
  408 |         .filter({ has: page.getByText(/^Recorded$/) })
  409 |         .first()
  410 |     if (!(await orphan.isVisible().catch(() => false))) {
  411 |         test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
  412 |     }
  413 |     await uiDeleteTestCase(page, orphan)
  414 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  415 |         /test case deleted/i,
  416 |         { timeout: 5_000 },
  417 |     )
  418 |     await clearSearch(page)
  419 | })
  420 | 
  421 | test('TC-072 — Clone a recorded test case', async ({ page }) => {
  422 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  423 |     // Same constraint as TC-070: the project must already contain at least
  424 |     // one recorded test case. Skip if none.
  425 | 
  426 |     const name = `qa-rec-${ts()}`
  427 |     await gotoTestCases(page)
  428 |     await uiCreateRecordTestCase(page, name)
  429 |     await gotoTestCases(page)
  430 |     await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
  431 |     const recordedRow = page
  432 |         .locator('table tbody tr.test-case-row')
  433 |         .filter({ has: page.getByText(name, { exact: true }) })
  434 |         .filter({ has: page.getByText(/^Recorded$/) })
  435 |         .first()
  436 |     await expect(recordedRow).toBeVisible({ timeout: 15000 })
  437 |     // if (!(await recordedRow.isVisible().catch(() => false))) {
  438 |     //     test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
  439 |     // }
  440 | 
  441 |     const cloneName = `qa-rec-clone-${ts()}`
  442 |     await uiCloneTestCase(page, recordedRow, cloneName)
  443 |     await searchFor(page, cloneName)
  444 |     await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })
  445 | 
  446 |     // Cleanup.
  447 |     await uiDeleteTestCase(page, testCaseRow(page, cloneName))
  448 |     await clearSearch(page)
  449 | })
  450 | 
  451 | test('TC-073 — Search filters the list to matching test cases', async ({ page }) => {
  452 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
```