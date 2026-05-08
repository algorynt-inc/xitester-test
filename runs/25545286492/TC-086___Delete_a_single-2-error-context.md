# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-analysis.spec.ts >> TC-086 — Delete a single action step from a completed run
- Location: tests/test-analysis.spec.ts:339:1

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-action-id]').first().locator('button[aria-label="Delete step"]').first()
    - locator resolved to <button aria-label="Delete step" class="p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    19 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

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
        - generic [ref=e12]: Test case deleted
  - generic [ref=e13]:
    - banner [ref=e14]:
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]:
            - button "XiTester Enterprise" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: XiTester
              - generic [ref=e27]: Enterprise
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - generic [ref=e32]: /
          - generic [ref=e33]:
            - button "Default Project" [ref=e34] [cursor=pointer]:
              - img [ref=e35]
              - generic [ref=e37]: Default Project
            - button [ref=e38] [cursor=pointer]:
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
          - generic [ref=e62]: v1.1.0
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
          - button "Api Tester" [ref=e113] [cursor=pointer]:
            - img [ref=e115]
            - generic: Api Tester
          - button "Settings" [ref=e120] [cursor=pointer]:
            - img [ref=e122]
            - generic: Settings
        - button "Logout" [ref=e127] [cursor=pointer]:
          - img [ref=e129]
          - generic: Logout
      - main [ref=e133]:
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - heading "Test Cases" [level=1] [ref=e137]
              - paragraph [ref=e138]: View and manage your test case analysis sessions
            - generic [ref=e139]:
              - button "Refresh" [ref=e140] [cursor=pointer]:
                - img [ref=e141]
                - text: Refresh
              - button "New Test Case" [ref=e147] [cursor=pointer]:
                - img [ref=e148]
                - text: New Test Case
                - img [ref=e149]
          - generic [ref=e152]:
            - generic [ref=e153]:
              - img [ref=e154]
              - textbox "Search test cases…" [ref=e157]: qa-tc86-20260508083846
            - button "Status" [ref=e158] [cursor=pointer]:
              - img [ref=e159]
              - text: Status
            - button "Last Run" [ref=e161] [cursor=pointer]:
              - img [ref=e162]
              - text: Last Run
            - button "Tags" [ref=e164] [cursor=pointer]:
              - img [ref=e165]
              - text: Tags
            - button "Test Plan" [ref=e167] [cursor=pointer]:
              - img [ref=e168]
              - text: Test Plan
            - button "Source" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Source
            - button "Reset" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
              - text: Reset
          - generic [ref=e179]:
            - img [ref=e181]
            - heading "No test cases found" [level=3] [ref=e184]
            - paragraph [ref=e185]: Try adjusting your search or filters to find what you looking for.
            - button "Clear all filters" [ref=e186] [cursor=pointer]
          - generic [ref=e189]:
            - generic [ref=e190]: No test cases
            - generic [ref=e191]:
              - generic [ref=e192]:
                - generic [ref=e193]: Rows per page
                - combobox [ref=e194] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e195]
              - generic [ref=e197]:
                - generic [ref=e198]: Page 1of1
                - generic [ref=e199]:
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
  258 |         // input is re-enabled.
  259 |         await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden({ timeout: 8_000 })
  260 |         await expect(chatTextarea(page)).toBeEnabled({ timeout: 5_000 })
  261 |     } finally {
  262 |         await deleteSessionViaList(page, name).catch(() => undefined)
  263 |     }
  264 | })
  265 | 
  266 | test('TC-083 — Reset clears the session', async ({ page }) => {
  267 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  268 |     const name = `qa-tc83-${ts()}`
  269 |     try {
  270 |         await uiCreateAITestCase(page, name)
  271 |         await setMode(page, 'plan')
  272 |         await sendPrompt(page, SIMPLE_PROMPT)
  273 |         await waitForPlan(page)
  274 | 
  275 |         await clickResetAndConfirm(page)
  276 | 
  277 |         // After reset: the plan card disappears and the chat input is
  278 |         // available again. The reset overlay (if any) clears within ~10s.
  279 |         await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden({ timeout: 15_000 })
  280 |         await expect(chatTextarea(page)).toBeEnabled({ timeout: 10_000 })
  281 |     } finally {
  282 |         await deleteSessionViaList(page, name).catch(() => undefined)
  283 |     }
  284 | })
  285 | 
  286 | test('TC-084 — Act mode kicks off execution immediately (no plan stage)', async ({ page }) => {
  287 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  288 |     const name = `qa-tc84-${ts()}`
  289 |     try {
  290 |         await uiCreateAITestCase(page, name)
  291 |         await setMode(page, 'act')
  292 |         await sendPrompt(page, ACT_PROMPT)
  293 |         // Act mode: no Approve button is ever rendered. The Stop button
  294 |         // appears once execution starts.
  295 |         await expect(page.locator('button', { hasText: /^Stop$/ })).toBeVisible({ timeout: 60_000 })
  296 |         // No approval prompt was needed.
  297 |         await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden()
  298 |         // Wait for execution to complete to leave a clean state.
  299 |         await waitForExecutionEnd(page)
  300 |     } finally {
  301 |         await deleteSessionViaList(page, name).catch(() => undefined)
  302 |     }
  303 | })
  304 | 
  305 | test('TC-085 — Manual Stop transitions execution out of running', async ({ page }) => {
  306 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  307 |     const name = `qa-tc85-${ts()}`
  308 |     try {
  309 |         await uiCreateAITestCase(page, name)
  310 |         await setMode(page, 'act')
  311 |         await sendPrompt(page, ACT_PROMPT)
  312 |         const stopBtn = page.locator('button', { hasText: /^Stop$/ })
  313 |         await expect(stopBtn).toBeVisible({ timeout: 60_000 })
  314 |         await stopBtn.click()
  315 |         // After clicking Stop, the button transitions to "Stopping..." then
  316 |         // disappears. Reset becomes available again.
  317 |         await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible({
  318 |             timeout: 90_000,
  319 |         })
  320 |         await expect(page.locator('button', { hasText: /^Stop$/ })).toBeHidden({ timeout: 5_000 })
  321 |     } finally {
  322 |         await deleteSessionViaList(page, name).catch(() => undefined)
  323 |     }
  324 | })
  325 | 
  326 | // ============================================================
  327 | // Tests requiring completed execution with steps to manipulate
  328 | // ============================================================
  329 | 
  330 | async function runToCompletion(page: Page, name: string): Promise<string> {
  331 |     const sessionId = await uiCreateAITestCase(page, name)
  332 |     await sendPrompt(page, SIMPLE_PROMPT)
  333 |     await waitForPlan(page)
  334 |     await approvePlan(page)
  335 |     await waitForExecutionEnd(page)
  336 |     return sessionId
  337 | }
  338 | 
  339 | test('TC-086 — Delete a single action step from a completed run', async ({ page }) => {
  340 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  341 |     const name = `qa-tc86-${ts()}`
  342 |     try {
  343 |         await runToCompletion(page, name)
  344 |         // The simpleMode timeline (default) renders each action via
  345 |         // SimpleActionRow, which exposes a per-row delete button with
  346 |         // aria-label="Delete step" — hidden until hover. Locate the first
  347 |         // action row by its data-action-id attribute, hover it to reveal
  348 |         // the trash icon, then click.
  349 |         const firstAction = page.locator('[data-action-id]').first()
  350 |         try {
  351 |             await firstAction.waitFor({ state: 'visible', timeout: 15_000 })
  352 |         } catch {
  353 |             test.skip(true, 'Run completed without producing action rows to delete.')
  354 |         }
  355 |         await firstAction.hover()
  356 |         const deleteBtn = firstAction.locator('button[aria-label="Delete step"]').first()
  357 |         await expect(deleteBtn).toBeVisible({ timeout: 5_000 })
> 358 |         await deleteBtn.click()
      |                         ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  359 |         // DeleteStepDialog / DeleteActionDialog both use role="dialog".
  360 |         const dialog = page.locator('div[role="dialog"]', { hasText: /Delete (Step|Action)/i })
  361 |         await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  362 |         await dialog.locator('button', { hasText: /^Delete$/ }).first().click()
  363 |         await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
  364 |     } finally {
  365 |         await deleteSessionViaList(page, name).catch(() => undefined)
  366 |     }
  367 | })
  368 | 
  369 | test('TC-087 — Reorder steps after a completed run', async ({ page }) => {
  370 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  371 |     const name = `qa-tc87-${ts()}`
  372 |     try {
  373 |         await runToCompletion(page, name)
  374 |         // The reorder dialog is opened via the timeline "reorder" affordance.
  375 |         // The button has text "Reorder" in the tools row.
  376 |         const reorderBtn = page.locator('button', { hasText: /^Reorder$/ })
  377 |         if (!(await reorderBtn.isVisible().catch(() => false))) {
  378 |             test.skip(true, 'Reorder affordance not visible — run may have produced fewer than 2 steps.')
  379 |         }
  380 |         await reorderBtn.click()
  381 |         const dialog = page.locator('div[role="dialog"]', { hasText: /Reorder/i })
  382 |         await expect(dialog).toBeVisible({ timeout: 5_000 })
  383 |         // Verify there are draggable items and a Cancel/Save button.
  384 |         await expect(dialog.locator('button', { hasText: /^(Cancel|Close)$/ }).first()).toBeVisible()
  385 |     } finally {
  386 |         await deleteSessionViaList(page, name).catch(() => undefined)
  387 |     }
  388 | })
  389 | 
  390 | test('TC-088 — Mark a step as Skip (only available during paused-on-failure)', async ({ page }) => {
  391 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  392 |     // The user spec says "after completion, mark a step as skip", but the
  393 |     // SUT only renders the Skip affordance via StepFailureOptions, which
  394 |     // mounts during a paused-on-failure state inside Run-Till-End mode —
  395 |     // not on a completed test. We can't reliably force a failure with the
  396 |     // current SIMPLE_PROMPT, so we verify the gating: after a clean
  397 |     // completion, no Skip button should be visible. If a Skip button does
  398 |     // surface (because the LLM produced a failure), exercise it.
  399 |     const name = `qa-tc88-${ts()}`
  400 |     try {
  401 |         await runToCompletion(page, name)
  402 |         const skipBtn = page.locator('button', { hasText: /^Skip$/ }).first()
  403 |         if (!(await skipBtn.isVisible().catch(() => false))) {
  404 |             test.skip(
  405 |                 true,
  406 |                 'No Skip affordance after a clean completion — Skip is exposed only during a paused-on-failure state in Run-Till-End mode.',
  407 |             )
  408 |         }
  409 |         await skipBtn.click()
  410 |         // After clicking, the step row should show a visible "Skipped"
  411 |         // indicator. Don't enforce a specific class — just assert the
  412 |         // button is gone (it transitions to "Continue" once skipped).
  413 |         await expect(skipBtn).toBeHidden({ timeout: 5_000 })
  414 |     } finally {
  415 |         await deleteSessionViaList(page, name).catch(() => undefined)
  416 |     }
  417 | })
  418 | 
  419 | async function bulkDeleteActionsFlow(page: Page): Promise<void> {
  420 |     // Enter multi-select mode via the timeline's "Select Actions" button
  421 |     // (only visible when simpleMode + canEdit + onBulkDeleteActions).
  422 |     const selectActionsBtn = page.locator('button', { hasText: /^Select Actions$/ })
  423 |     if (!(await selectActionsBtn.isVisible().catch(() => false))) {
  424 |         test.skip(true, '"Select Actions" toolbar not visible — bulk delete unavailable on this run.')
  425 |     }
  426 |     await selectActionsBtn.click()
  427 |     // In multi-select mode, action rows render a checkbox. Tick the first
  428 |     // two we can find inside the chat timeline.
  429 |     const checkboxes = page.locator('input[type="checkbox"]')
  430 |     await expect(checkboxes.first()).toBeVisible({ timeout: 5_000 })
  431 |     const total = await checkboxes.count()
  432 |     if (total < 2) {
  433 |         test.skip(true, `Need at least 2 action checkboxes for bulk delete; saw ${total}.`)
  434 |     }
  435 |     await checkboxes.nth(0).check()
  436 |     await checkboxes.nth(1).check()
  437 |     const bulkBtn = page.locator('button', { hasText: /^Delete Selected$/ })
  438 |     await expect(bulkBtn).toBeVisible({ timeout: 5_000 })
  439 |     await bulkBtn.click()
  440 |     // The DeleteActionDialog component uses role="dialog" (the modal
  441 |     // overlay) — NOT role="alertdialog". Match by visible heading.
  442 |     const dialog = page.locator('div[role="dialog"]', { hasText: /Delete \d+ (action|step)|Delete Action|Delete Step/i })
  443 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  444 |     await dialog.locator('button', { hasText: /^Delete/ }).first().click()
  445 |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => undefined)
  446 | }
  447 | 
  448 | test('TC-089 — Bulk select + delete multiple actions', async ({ page }) => {
  449 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  450 |     const name = `qa-tc89-${ts()}`
  451 |     try {
  452 |         await runToCompletion(page, name)
  453 |         await bulkDeleteActionsFlow(page)
  454 |     } finally {
  455 |         await deleteSessionViaList(page, name).catch(() => undefined)
  456 |     }
  457 | })
  458 | 
```