# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-analysis.spec.ts >> TC-078 — Status transitions: idle → generating plan → completed
- Location: tests/test-analysis.spec.ts:161:1

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: locator('[data-tour="chat-input"] textarea, textarea[data-tour="chat-input"]').first()
Expected: disabled
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 8000ms
  - waiting for locator('[data-tour="chat-input"] textarea, textarea[data-tour="chat-input"]').first()

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
          - generic [ref=e51]: v1.1.4
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
              - textbox "Search test cases…" [active] [ref=e160]: qa-tc78-20260708113754
            - tablist "Session type" [ref=e161]:
              - tab "Test Cases" [selected] [ref=e162] [cursor=pointer]
              - tab "Test Modules" [ref=e163] [cursor=pointer]
            - button "Status" [ref=e164] [cursor=pointer]:
              - img [ref=e165]
              - text: Status
            - button "Last Run" [ref=e167] [cursor=pointer]:
              - img [ref=e168]
              - text: Last Run
            - button "Created By" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Created By
            - button "Tags" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
              - text: Tags
            - button "Test Plan" [ref=e176] [cursor=pointer]:
              - img [ref=e177]
              - text: Test Plan
            - button "Source" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
              - text: Source
            - button "Reset" [ref=e182] [cursor=pointer]:
              - img [ref=e183]
              - text: Reset
          - table [ref=e188]:
            - rowgroup [ref=e189]:
              - row "# Title / Prompt Tags Analysis Status Last Run Steps Created Actions" [ref=e190]:
                - columnheader [ref=e191]:
                  - checkbox [ref=e192] [cursor=pointer]
                - columnheader "#" [ref=e193]
                - columnheader "Title / Prompt" [ref=e194]
                - columnheader "Tags" [ref=e195]
                - columnheader "Analysis Status" [ref=e196]
                - columnheader "Last Run" [ref=e197]
                - columnheader "Steps" [ref=e198]
                - columnheader "Created" [ref=e199]
                - columnheader "Actions" [ref=e200]
            - rowgroup [ref=e201]:
              - link "1 qa-tc78-20260708113754 Manual Loading tags… Plan Ready No Runs 0 Jul 8, 2026, 11:38 AM by ashid Clone test case Edit test case Delete test case" [ref=e202] [cursor=pointer]:
                - cell [ref=e203]:
                  - checkbox [ref=e204]
                - cell "1" [ref=e205]
                - cell "qa-tc78-20260708113754 Manual" [ref=e206]:
                  - generic [ref=e208]:
                    - generic [ref=e209]: qa-tc78-20260708113754
                    - generic [ref=e210]:
                      - img [ref=e211]
                      - text: Manual
                - cell "Loading tags…" [ref=e214]:
                  - button "Loading tags…" [ref=e215]:
                    - generic [ref=e216]: Loading tags…
                - cell "Plan Ready" [ref=e217]:
                  - generic [ref=e218]: Plan Ready
                - cell "No Runs" [ref=e220]:
                  - generic [ref=e223]: No Runs
                - cell "0" [ref=e224]
                - cell "Jul 8, 2026, 11:38 AM by ashid" [ref=e225]:
                  - generic [ref=e226]:
                    - generic [ref=e227]: Jul 8, 2026, 11:38 AM
                    - generic [ref=e228]: by ashid
                - cell "Clone test case Edit test case Delete test case" [ref=e229]:
                  - generic [ref=e230]:
                    - button "Clone test case" [ref=e231]:
                      - img [ref=e232]
                    - button "Edit test case" [ref=e235]:
                      - img [ref=e236]
                    - button "Delete test case" [ref=e239]:
                      - img [ref=e240]
          - generic [ref=e245]:
            - generic [ref=e246]: 1–1 of 1 test cases
            - generic [ref=e247]:
              - generic [ref=e248]:
                - generic [ref=e249]: Rows per page
                - combobox [ref=e250] [cursor=pointer]:
                  - generic: "20"
                  - img [ref=e251]
              - generic [ref=e253]:
                - generic [ref=e254]: Page 1of1
                - generic [ref=e255]:
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
  72  |     await dialog.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => undefined)
  73  | }
  74  | 
  75  | function chatTextarea(page: Page): Locator {
  76  |     // The ChatInput renders a textarea inside [data-tour="chat-input"].
  77  |     return page.locator('[data-tour="chat-input"] textarea, textarea[data-tour="chat-input"]').first()
  78  | }
  79  | 
  80  | async function setMode(page: Page, mode: 'plan' | 'act'): Promise<void> {
  81  |     const toggle = page.locator('[data-tour="mode-toggle"]')
  82  |     await expect(toggle).toBeVisible({ timeout: 5_000 })
  83  |     const label = mode === 'plan' ? 'Plan' : 'Act'
  84  |     await toggle.locator('button', { hasText: new RegExp(`^${label}$`) }).click()
  85  | }
  86  | 
  87  | async function sendPrompt(page: Page, prompt: string, via: 'click' | 'enter' = 'click'): Promise<void> {
  88  |     const ta = chatTextarea(page)
  89  |     await expect(ta).toBeVisible({ timeout: 5_000 })
  90  |     await ta.click()
  91  |     await ta.fill(prompt)
  92  |     if (via === 'click') {
  93  |         await page.locator('button[data-tour="send-button"]').click()
  94  |     } else {
  95  |         // The component sends on Enter (without Shift). Pressing Enter on
  96  |         // the textarea triggers handleKeyDown's submit path.
  97  |         await ta.press('Enter')
  98  |     }
  99  | }
  100 | 
  101 | async function waitForPlan(page: Page, timeoutMs = PLAN_TIMEOUT_MS): Promise<void> {
  102 |     // The "Approve & Analyze" button is only rendered after plan generation
  103 |     // completes and the plan card mounts. data-tour="approve-execute-btn".
  104 |     await page
  105 |         .locator('button[data-tour="approve-execute-btn"]')
  106 |         .waitFor({ state: 'visible', timeout: timeoutMs })
  107 | }
  108 | 
  109 | async function approvePlan(page: Page): Promise<void> {
  110 |     await page.locator('button[data-tour="approve-execute-btn"]').click()
  111 | }
  112 | 
  113 | async function rejectPlan(page: Page): Promise<void> {
  114 |     await page.locator('button', { hasText: /^Reject$/ }).first().click()
  115 | }
  116 | 
  117 | /**
  118 |  * Wait for the running execution to terminate. The page renders a Stop
  119 |  * button only while `isExecuting || isRunningTillEnd || sessionStatus ===
  120 |  * 'rerunning'`. The Reset button is *always* visible when not executing,
  121 |  * so anchoring on Reset alone is misleading (it's also visible in the
  122 |  * idle state right after session creation). Sequence:
  123 |  *   1. Wait for Stop to appear → execution actually started
  124 |  *   2. Wait for Stop to disappear → execution terminated (any way)
  125 |  */
  126 | async function waitForExecutionEnd(page: Page, timeoutMs = EXEC_TIMEOUT_MS): Promise<void> {
  127 |     const stopBtn = page.locator('button', { hasText: /^Stop( Re-Run)?$/ })
  128 |     await expect(stopBtn).toBeVisible({ timeout: 90_000 })
  129 |     await expect(stopBtn).toBeHidden({ timeout: timeoutMs })
  130 | }
  131 | 
  132 | async function clickResetAndConfirm(page: Page): Promise<void> {
  133 |     await page.locator('button', { hasText: /^Reset$/ }).click()
  134 |     const dialog = page.locator('div[role="alertdialog"]', { hasText: /Reset Session/i })
  135 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  136 |     await dialog.locator('button', { hasText: /^Reset$/ }).click()
  137 |     await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined)
  138 | }
  139 | 
  140 | // ============================================================
  141 | // Tests
  142 | // ============================================================
  143 | 
  144 | test('TC-077 — AI test case end-to-end: create, plan, approve, execute', async ({ page }) => {
  145 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  146 |     const name = `qa-tc77-${ts()}`
  147 |     try {
  148 |         await uiCreateAITestCase(page, name)
  149 |         await sendPrompt(page, SIMPLE_PROMPT)
  150 |         await waitForPlan(page)
  151 |         await approvePlan(page)
  152 |         await waitForExecutionEnd(page)
  153 |         // After completion, the timeline shows step rows and the Reset
  154 |         // button is enabled.
  155 |         await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible()
  156 |     } finally {
  157 |         await deleteSessionViaList(page, name).catch(() => undefined)
  158 |     }
  159 | })
  160 | 
  161 | test('TC-078 — Status transitions: idle → generating plan → completed', async ({ page }) => {
  162 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  163 |     const name = `qa-tc78-${ts()}`
  164 |     try {
  165 |         await uiCreateAITestCase(page, name)
  166 |         // After creation the session is idle. There's no exec-timer pill,
  167 |         // and the chat input is enabled.
  168 |         await expect(chatTextarea(page)).toBeEnabled({ timeout: 5_000 })
  169 | 
  170 |         await sendPrompt(page, SIMPLE_PROMPT)
  171 |         // Generating-plan: the input becomes disabled while the LLM works.
> 172 |         await expect(chatTextarea(page)).toBeDisabled({ timeout: 8_000 })
      |                                          ^ Error: expect(locator).toBeDisabled() failed
  173 | 
  174 |         await waitForPlan(page)
  175 |         // Plan ready, waiting for approval. Stop button absent yet.
  176 |         await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeVisible()
  177 | 
  178 |         await approvePlan(page)
  179 |         // Running: Stop button appears.
  180 |         await expect(page.locator('button', { hasText: /^Stop$/ })).toBeVisible({ timeout: 30_000 })
  181 | 
  182 |         await waitForExecutionEnd(page)
  183 |         // Completed: Stop is hidden, Reset is back.
  184 |         await expect(page.locator('button', { hasText: /^Stop$/ })).toBeHidden()
  185 |         await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible()
  186 |     } finally {
  187 |         await deleteSessionViaList(page, name).catch(() => undefined)
  188 |     }
  189 | })
  190 | 
  191 | test('TC-079 — Plan mode prompt generates a plan with steps', async ({ page }) => {
  192 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  193 |     const name = `qa-tc79-${ts()}`
  194 |     try {
  195 |         await uiCreateAITestCase(page, name)
  196 |         await setMode(page, 'plan')
  197 |         await sendPrompt(page, SIMPLE_PROMPT)
  198 |         await waitForPlan(page)
  199 |         // Plan UI shows Edit Plan / Update Plan / Approve / Reject controls.
  200 |         await expect(page.locator('button', { hasText: /^Edit Plan$/ })).toBeVisible()
  201 |         await expect(page.locator('button', { hasText: /^Update Plan$/ })).toBeVisible()
  202 |         await expect(page.locator('button', { hasText: /^Reject$/ })).toBeVisible()
  203 |     } finally {
  204 |         await deleteSessionViaList(page, name).catch(() => undefined)
  205 |     }
  206 | })
  207 | 
  208 | test('TC-080 — Edit Plan opens the plan editor', async ({ page }) => {
  209 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  210 |     const name = `qa-tc80-${ts()}`
  211 |     try {
  212 |         await uiCreateAITestCase(page, name)
  213 |         await setMode(page, 'plan')
  214 |         await sendPrompt(page, SIMPLE_PROMPT)
  215 |         await waitForPlan(page)
  216 |         await page.locator('button', { hasText: /^Edit Plan$/ }).click()
  217 |         // The plan editor renders as a dialog with "Edit Plan" heading.
  218 |         const editor = page.locator('div[role="dialog"]', { hasText: /Edit Plan/i })
  219 |         await expect(editor).toBeVisible({ timeout: 5_000 })
  220 |         // Close without saving — we've verified the editor opens.
  221 |         await editor.locator('button', { hasText: /^(Cancel|Close)$/ }).first().click()
  222 |             .catch(async () => {
  223 |                 await page.keyboard.press('Escape')
  224 |             })
  225 |     } finally {
  226 |         await deleteSessionViaList(page, name).catch(() => undefined)
  227 |     }
  228 | })
  229 | 
  230 | test('TC-081 — Update Plan reveals a revise-prompt input', async ({ page }) => {
  231 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  232 |     const name = `qa-tc81-${ts()}`
  233 |     try {
  234 |         await uiCreateAITestCase(page, name)
  235 |         await setMode(page, 'plan')
  236 |         await sendPrompt(page, SIMPLE_PROMPT)
  237 |         await waitForPlan(page)
  238 |         await page.locator('button', { hasText: /^Update Plan$/ }).click()
  239 |         // Revise input appears with placeholder "Describe what to change…".
  240 |         await expect(
  241 |             page.locator('textarea[placeholder*="Describe what to change"]'),
  242 |         ).toBeVisible({ timeout: 5_000 })
  243 |     } finally {
  244 |         await deleteSessionViaList(page, name).catch(() => undefined)
  245 |     }
  246 | })
  247 | 
  248 | test('TC-082 — Reject plan dismisses the plan card', async ({ page }) => {
  249 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  250 |     const name = `qa-tc82-${ts()}`
  251 |     try {
  252 |         await uiCreateAITestCase(page, name)
  253 |         await setMode(page, 'plan')
  254 |         await sendPrompt(page, SIMPLE_PROMPT)
  255 |         await waitForPlan(page)
  256 |         await rejectPlan(page)
  257 |         // After reject: the Approve button must be gone and the chat
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
```