# Test Analysis Test Cases

Manual QA test cases for the **Test Analysis** screen at `/test-analysis/:sessionId?` — the AI-driven test-authoring view with Plan / Act modes, a live browser panel, and an editable action timeline. Thirteen user flows covering open / chat / plan approval / execution / action editing / browser controls. Numbering picks up at **TC-088** to keep the global sequence contiguous (after TC-087 in `test-case-mgmt.md`).

Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/pages/TestAnalysisChatPage.tsx` (the screen)
- `frontend/src/components/analysis/BrowserPanel.tsx`
- `frontend/src/components/analysis/ReorderActionsDialog.tsx`
- `frontend/src/components/analysis/DeleteStepDialog.tsx`
- `frontend/src/components/plan/PlanEditModal.tsx`
- `frontend/src/components/analysis/AssertDialog.tsx`
- `frontend/src/services/api/browserProfilesApi.ts` (browser profile API)
- Reference scenarios: `xitester-ai-app/docs/qa/test-case-analysis-dev-dogfood.md` (30-scenario dogfood plan)

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Pre-condition: the test user's currently-selected project must contain at least one **AI** (analysis) test case. Tests that need a fresh session can create one in setup, otherwise they assume seeded data and skip cleanly when none is found.
- Safe SUT prompts (avoid destructive actions):
  - `Go to https://xitester-sut-shopper.pages.dev/ and verify the home page loads.`
  - `Go to https://xitester.com and verify the page title.`
- Viewport: `1920x1080`

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Mutating tests (delete step / reorder / edit plan) operate on a throwaway session created during the test or restore state after running.
3. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).
4. Never seed prompts that perform destructive actions on third-party sites.

## Common Selectors

| Element                        | Selector                                                                  |
|--------------------------------|---------------------------------------------------------------------------|
| Chat prompt input              | the textarea / input at the bottom of the chat panel                      |
| Send-message button            | the submit button next to the prompt input                                |
| Mode toggle (Plan / Act)       | the Plan / Act segmented control above the chat                           |
| Plan card                      | a chat message rendered as a structured plan with action list             |
| Approve plan                   | `button` with text `"Approve"` inside the plan card                       |
| Reject plan                    | `button` with text `"Reject"` (or `"Revise"`) inside the plan card        |
| Browser panel                  | the right-side / split panel that hosts the live browser viewer           |
| Browser viewer iframe          | `iframe` inside the BrowserPanel                                          |
| End session button             | `button` with text matching `/end (browser )?session/i`                   |
| Action timeline / step list    | the ordered list of executed actions with status icons                    |
| Step kebab / actions menu      | the per-step icon button that opens delete / skip / etc.                  |
| Delete-step dialog             | `div[role="dialog"]` containing `"Delete step"` (or similar)              |
| Reorder dialog                 | `div[role="dialog"]` containing `"Reorder"`                               |
| Plan edit modal                | `div[role="dialog"]` containing `"Edit plan"`                             |
| Headless toggle                | the Headless / Live browser-mode toggle in the panel header               |
| Browser-profile dropdown       | the profile selector in the panel header                                  |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-088 — Open test-analysis screen for an existing session | Test Analysis | High | Clicking an AI test case from `/test-cases` (or visiting `/test-analysis/<id>` directly) loads the screen with the chat panel, the browser panel, and the action timeline visible. The URL contains the sessionId. | 1. Sign in.<br>2. Navigate to `/test-cases` and click any AI test case.<br>3. Verify the URL becomes `/test-analysis/<sessionId>`.<br>4. Verify the chat panel, browser panel, and timeline panel all render without console errors. |
| TC-089 — Send a prompt in Plan mode generates a plan | Test Analysis | High | With Plan mode active, sending a safe prompt produces a structured plan card in the chat. The plan card has Approve and Reject (or Revise) buttons. No execution starts until the plan is approved. | 1. Open a fresh AI test case (or the screen with an empty chat).<br>2. Ensure the mode toggle reads "Plan".<br>3. Type a safe prompt (`Go to https://xitester.com and verify the title.`) into the chat input.<br>4. Submit.<br>5. Wait for the plan card to appear.<br>6. Verify the card lists 1+ action steps and shows Approve / Reject buttons.<br>7. Verify the browser panel has NOT yet started executing. |
| TC-090 — Approve a plan triggers execution | Test Analysis | High | Clicking "Approve" on the generated plan starts execution: the live browser navigates to the target URL and the action timeline updates as steps complete. The Approve button transitions to a busy state (or disappears). | 1. (setup) From TC-089, generate a plan.<br>2. Click Approve.<br>3. Verify the browser panel shows the SUT page loading.<br>4. Verify timeline entries flip from pending → running → completed (or failed) as the plan runs.<br>5. Verify a final summary message appears in the chat after the last step. |
| TC-091 — Reject a plan returns to chat for revision | Test Analysis | Medium | Clicking "Reject" (or "Revise") on a plan removes / dims the plan card and returns focus to the chat input so the user can refine the prompt. No execution occurs. | 1. (setup) Generate a plan as in TC-089.<br>2. Click Reject (or "Revise").<br>3. Verify the browser panel does NOT begin execution.<br>4. Verify the chat input is focused and accepts a follow-up prompt.<br>5. Send a follow-up — verify a new plan card is produced. |
| TC-092 — Send Act-mode prompt executes immediately | Test Analysis | High | Switching the mode toggle to "Act" and sending a prompt skips the plan-generation step: the SUT executes the prompt directly. The browser panel updates and the timeline records actions in real time. | 1. Open a fresh AI test case.<br>2. Switch the mode toggle to "Act".<br>3. Send a safe prompt (`Go to https://xitester.com.`).<br>4. Verify NO plan card is generated.<br>5. Verify the browser panel begins execution and the timeline records actions live. |
| TC-093 — Live browser viewer renders during execution | Test Analysis | High | While a plan or act run is in progress, the BrowserPanel hosts a live viewer (iframe) showing the SUT's actual rendered DOM. The viewer URL stays in sync with the navigation actions. Switching to Headless hides the viewer. | 1. Trigger an execution (TC-090 or TC-092).<br>2. Verify the BrowserPanel contains an `iframe` whose `src` is set.<br>3. Verify the iframe shows the target URL's rendered content.<br>4. Toggle "Headless" → "Live" if available; verify the viewer hides / shows accordingly. |
| TC-094 — End session manually | Test Analysis | High | The "End session" button stops the live browser, releases the runner container, and updates the panel header to a "no active browser" state. Subsequent prompts will start a fresh session. | 1. Trigger an execution (TC-090 or TC-092).<br>2. Click "End session" in the BrowserPanel header.<br>3. Verify the iframe disappears (or transitions to an idle placeholder).<br>4. Verify the timeline retains its history.<br>5. Send another prompt — verify a new browser session starts. |
| TC-095 — Delete an action step | Test Analysis | Medium | The per-step kebab → Delete opens a confirmation dialog; confirming removes the step from the timeline. The remaining steps re-number / re-order without gaps. | 1. (setup) Run a multi-step prompt to populate the timeline.<br>2. Open the kebab on any non-final step → Delete.<br>3. In the confirmation dialog, click Delete.<br>4. Verify the dialog closes and the step is gone.<br>5. Verify the remaining steps still render in the original relative order. |
| TC-096 — Reorder action steps | Test Analysis | Medium | The Reorder dialog allows drag-or-arrow re-arrangement of timeline steps. Saving applies the new order; the timeline rerenders accordingly. The order persists after page reload. | 1. (setup) Run a multi-step prompt.<br>2. Open the Reorder dialog (toolbar / kebab → Reorder steps).<br>3. Move at least one step up or down.<br>4. Click Save.<br>5. Verify the timeline shows the new order.<br>6. Reload the page; verify the order is preserved. |
| TC-097 — Skip an action | Test Analysis | Medium | Marking an action as skipped via its kebab → Skip flips its status icon and excludes it from the next replay. Other steps remain. | 1. (setup) Run a multi-step prompt.<br>2. Open the kebab on any step → Skip.<br>3. Verify the step's status icon turns to a "skipped" indicator (e.g. dimmed / strikethrough).<br>4. Replay the test (run the same prompt again).<br>5. Verify the skipped step is not re-executed in the next run's timeline. |
| TC-098 — Toggle Headless ↔ Live browser mode | Test Analysis | Medium | Toggling Headless on starts subsequent runs without a visible viewer (faster). Toggling Live on shows the viewer again. The setting persists for the session. | 1. Open a test case.<br>2. Set the browser mode toggle to "Headless".<br>3. Send a safe prompt and run.<br>4. Verify no live iframe is shown — runs proceed without a visible viewer.<br>5. Toggle to "Live"; send another prompt.<br>6. Verify the iframe reappears. |
| TC-099 — Edit a plan via PlanEditModal | Test Analysis | Medium | Before approving, opening the Plan Edit Modal (e.g. via "Edit plan" on the plan card) shows the structured plan in an editable form. Changing a step's text and saving updates the plan card; the changes survive into the executed plan. | 1. (setup) Generate a plan (TC-089).<br>2. Click "Edit plan" on the card to open PlanEditModal.<br>3. Modify any step's text or order.<br>4. Click Save.<br>5. Verify the plan card reflects the edits.<br>6. Approve the plan.<br>7. Verify the executed timeline matches the edited plan. |
| TC-100 — Switch browser profile | Test Analysis | Low | The browser-profile dropdown in the BrowserPanel header lists the user's saved profiles. Selecting a profile applies it to the current session — subsequent runs use that profile's cookies / storage state. | 1. (pre-condition) At least one saved browser profile exists for the user. **Skip** the test cleanly if none.<br>2. Open a test case.<br>3. Open the browser-profile dropdown in the panel header.<br>4. Select a non-default profile.<br>5. Send a safe prompt that references profile-bound state (e.g. an authenticated landing page).<br>6. Verify the live browser opens with the chosen profile applied (correct user / cookie indicators visible). |

## Conversion Notes (for when these become Playwright specs)

- `TestAnalysisChatPage.tsx` is one of the heaviest screens in the SUT — it hosts WebSocket streaming for live browser events, a chat panel, an action editor, and several lazy-loaded modals. Pace tests accordingly: longer timeouts (15–30 s) on plan generation and run completion.
- The dogfood plan at `xitester-ai-app/docs/qa/test-case-analysis-dev-dogfood.md` already documents 30 scenarios with concrete reproduction steps. When porting these rows to Playwright, lean on those for the **selectors** and the **expected sequence of UI states** (e.g. "Plan generated → live browser appears → first action turns green").
- TC-095 / TC-096 / TC-097 / TC-099 all need a multi-step plan in the timeline before they can act. Add a shared `seedRunHistory(page, prompt)` helper that submits a known prompt and waits for the run to complete before the test starts editing steps.
- TC-100 (browser profile) should `test.skip(profileCount === 0, ...)` rather than failing on a fresh account.
- Avoid prompts that perform destructive actions on real third-party sites (signups, purchases, comments). Stick to the safe-prompt list in the Environment section.
