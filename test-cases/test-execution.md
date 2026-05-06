# Test Execution Test Cases

Manual QA test cases for the **Test Execution** surface — the Test Plans page (`/test-plans` / `/test-plans/:planId`), the per-run dashboard (`/test-plan-runs/:runId`), and the per-test-case run detail (`/test-plan-run-case/:runId`). Thirteen user flows covering plan creation, suite composition, run dispatch, run control (stop / cancel), run detail filtering / sort / search, and re-run from prior results.

> **Note on numbering.** Picks up at **TC-101** to keep the global sequence contiguous. Previous blocks: TC-065..075 (master sheet), TC-076..087 (`test-case-mgmt.md`), TC-088..100 (`test-analysis.md`).

Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/pages/TestPlans.tsx` (list + plan-detail right pane, run dispatch, schedule, suite/case CRUD)
- `frontend/src/pages/TestPlanRunDetail.tsx` (per-run results dashboard with filters / sort / search)
- `frontend/src/pages/TestPlanRunCaseDetail.tsx` (per-test-case detail inside a run)
- `frontend/src/components/testplans/TestPlanModals.tsx` (CreateSuiteModal, DeleteSuiteDialog)
- `frontend/src/components/testplans/RunTestPlanModal.tsx`
- `frontend/src/components/testplans/ScheduleModal.tsx`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Pre-condition: the test user's currently-selected project must contain at least one **AI** or **recorded** test case to add to a plan. Tests that need fresh state create a temp plan + suite + run via the UI; cleanup deletes the plan after.
- Use safe SUT prompts in any contained test cases:
  - `Go to https://xitester-sut-shopper.pages.dev/ and verify the home page loads.`
  - `Go to https://xitester.com and verify the page title.`
- Viewport: `1920x1080`

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Mutating tests clean up after themselves so the project ends in its original state.
3. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).
4. Run-bound assertions (status transitions) need generous timeouts — runs may queue for 5–30 s before they begin.

## Common Selectors

| Element                                | Selector                                                                  |
|----------------------------------------|---------------------------------------------------------------------------|
| Test Plans page                        | URL `/test-plans`                                                         |
| "New test plan" trigger                | `button` with text matching `/^New (test )?plan$/i` in the toolbar        |
| Plan create modal                      | `div[role="dialog"]` containing `"Create test plan"` (or similar)         |
| Plan name input                        | scoped to the create-plan dialog, `input` near the "Name" label           |
| "Run plan" / "Run now" button          | `button` with text matching `/^Run( now)?$/i` on the plan-detail pane     |
| Run-plan modal                         | `div[role="dialog"]` containing `"Run test plan"`                         |
| Schedule trigger                       | `button` with text matching `/^Schedule$/i` on the plan-detail pane       |
| Schedule modal                         | `div[role="dialog"]` containing `"Schedule"`                              |
| Schedule cron / interval picker        | the cron-input or interval-select control inside the schedule modal       |
| Add suite                              | `button` with text matching `/Add (suite|test case)/i`                    |
| Stop running run button                | `button` with text matching `/^Stop( run)?$/i` (StopCircle icon)          |
| Stop / Cancel confirmation dialog      | `div[role="dialog"]` containing `"Stop"` or `"Cancel"`                    |
| Recent runs list                       | the run table on the plan-detail right pane                               |
| Open run detail                        | clicking a recent-run row navigates to `/test-plan-runs/<runId>`          |
| Run-detail status filter chips         | filter chips at the top of the run-detail page (Passed / Failed / etc.)  |
| Attempt filter dropdown                | dropdown filtering by run attempt index (1, 2, …)                         |
| Search input on run detail             | `input` with a "Search" placeholder on the run-detail page                |
| Sort-by-duration toggle                | toggle button in the run-detail toolbar                                   |
| Per-test-case row                      | row in the run-detail results table                                       |
| Per-test-case detail page              | URL `/test-plan-run-case/<runId>` (one record per row click)              |
| "Re-run failed" / "Re-run" button      | toolbar action that creates a new run from a previous run's failures      |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-101 — Open Test Plans page | Test Execution | High | Navigating to `/test-plans` shows the list of existing plans with the "New test plan" affordance, the plan-detail right pane (when a plan is selected), and a "Recent runs" section. | 1. Sign in.<br>2. Navigate to `/test-plans`.<br>3. Verify the page renders without console errors.<br>4. Verify the "New test plan" button and the existing plans list are visible. |
| TC-102 — Create a new test plan | Test Execution | High | Clicking "New test plan", filling the name, and submitting creates the plan, navigates to `/test-plans/<planId>`, and the new plan appears in the list. Cleanup deletes the plan via the UI. | 1. Open `/test-plans`.<br>2. Click "New test plan".<br>3. Type `qa-plan-${ts}` into the Name input.<br>4. Click Create.<br>5. Verify the URL becomes `/test-plans/<planId>` and the plan-detail pane shows the new name.<br>6. (cleanup) Delete the plan via its menu / Danger zone. |
| TC-103 — Add a suite + test cases to a plan | Test Execution | High | On the plan-detail pane, "Add suite" lets the user create a logical grouping. Within the suite, the user can attach existing test cases from the project. The plan's case-count updates. | 1. (setup) Create a temp plan as in TC-102.<br>2. Click "Add suite" on the plan-detail pane.<br>3. Type `qa-suite-${ts}` into the suite-name input; submit.<br>4. Add at least one existing test case to the suite via the "Add test case" affordance.<br>5. Verify the suite shows the test case row.<br>6. Verify the plan's total-cases counter increments.<br>7. (cleanup) Delete the plan. |
| TC-104 — Run a test plan now | Test Execution | High | Clicking "Run" / "Run now" opens the Run modal. Submitting starts a run; the plan-detail pane shows a "running" indicator (RunningTimer) and a new entry appears in Recent runs with status `running`. | 1. (pre-condition) A plan with at least one suite + test case. Use TC-103's setup if needed.<br>2. Open the plan.<br>3. Click "Run" / "Run now"; configure any options in the modal.<br>4. Submit.<br>5. Verify the running indicator appears and a new run row is added to Recent runs with status `running`.<br>6. (cleanup) Wait for completion or stop the run; delete the plan if it was a temp. |
| TC-105 — Stop a running run | Test Execution | High | While a run is in progress, the Stop button + confirmation dialog cancels the run. The run's status flips to `stopped` (or `cancelled`); the running indicator disappears. | 1. (setup) Trigger a run via TC-104 against a long-running test case (or a plan with multiple steps).<br>2. While status reads `running`, click the Stop button on the plan-detail pane.<br>3. In the confirmation dialog, confirm.<br>4. Verify the run's status transitions to `stopped` / `cancelled`.<br>5. Verify the RunningTimer disappears. |
| TC-106 — Schedule a test plan | Test Execution | Medium | The Schedule button opens a modal where the user picks a cron / interval and saves. The plan-detail pane shows the new schedule entry; toggling it off disables future executions. | 1. (setup) Open any test plan (or a temp plan from TC-102).<br>2. Click "Schedule".<br>3. Pick an interval / cron expression in the modal.<br>4. Click Save.<br>5. Verify the schedule entry appears on the plan-detail pane.<br>6. Toggle the schedule off; verify the disabled state.<br>7. (cleanup) Delete the schedule (and the temp plan if used). |
| TC-107 — View run detail | Test Execution | High | Clicking a recent-run row navigates to `/test-plan-runs/<runId>`. The detail page shows the overall summary (status, counts, duration), per-suite results, and a list of test-case rows with their individual statuses. | 1. Open any plan with at least one completed run.<br>2. Click the most recent run row in Recent runs.<br>3. Verify the URL becomes `/test-plan-runs/<runId>`.<br>4. Verify the summary card shows status + total / passed / failed counts + duration.<br>5. Verify per-test-case rows are visible. |
| TC-108 — Filter run results by status | Test Execution | High | Clicking a status chip (Passed / Failed / Running / Queued) on the run-detail page narrows the results list. URL params (`?statusFilters=...`) update accordingly so the filter persists across page reload. | 1. Open `/test-plan-runs/<runId>` for a run with mixed-status results.<br>2. Click the "Failed" filter chip.<br>3. Verify only failed test-case rows remain.<br>4. Verify the URL contains `statusFilters=failed`.<br>5. Reload the page; verify the same filter is still applied. |
| TC-109 — Filter results by attempt | Test Execution | Medium | The attempt filter narrows results to a specific run-attempt index (e.g. 1st / 2nd retry). Useful when a test was retried multiple times by `retries: 2`. | 1. Open `/test-plan-runs/<runId>` for a run with retries.<br>2. Open the attempt filter dropdown.<br>3. Pick "Attempt 2".<br>4. Verify only test-case rows from the second attempt remain.<br>5. Switch back to "All attempts".<br>6. Verify rows return to the full set. |
| TC-110 — Search test cases inside run detail | Test Execution | Medium | The run-detail search input filters the results list by test-case title (case-insensitive substring). Empty search restores the full list. | 1. Open `/test-plan-runs/<runId>`.<br>2. Note the title of any visible test-case row.<br>3. Type a substring of that title into the search input.<br>4. Verify only matching rows remain.<br>5. Clear the search; verify rows return. |
| TC-111 — Sort by duration | Test Execution | Medium | The sort-by-duration toggle reorders the results list by execution time descending; toggling again flips to ascending; toggling off reverts to default order. | 1. Open `/test-plan-runs/<runId>`.<br>2. Click the sort-by-duration toggle.<br>3. Verify the row order matches longest → shortest duration.<br>4. Click the toggle again.<br>5. Verify the order matches shortest → longest.<br>6. Click again to clear; verify default order is restored. |
| TC-112 — Open per-test-case detail | Test Execution | Medium | Clicking a test-case row navigates to `/test-plan-run-case/<runId>` (with the test-case ID in the URL state). The detail page shows the action timeline, attachments, and step-by-step status. | 1. Open `/test-plan-runs/<runId>`.<br>2. Click any test-case row.<br>3. Verify the URL becomes `/test-plan-run-case/<runId>` (per-case detail).<br>4. Verify the per-case timeline + status badges are visible.<br>5. Verify any captured attachments (screenshots / video / trace) are listed.<br>6. Click "Back" to return to the run detail. |
| TC-113 — Re-run failed test cases from a prior run | Test Execution | Medium | Run-detail page exposes a "Re-run failed" action that creates a new run scoped to the previously-failed test cases. The new run appears in Recent runs with the appropriate filtered set. | 1. Open `/test-plan-runs/<runId>` for a run that has at least one failed case.<br>2. Click "Re-run failed".<br>3. Confirm in any modal.<br>4. Verify a new run row appears in the parent plan's Recent runs.<br>5. Click into the new run; verify it contains only the previously-failed cases. |

## Conversion Notes (for when these become Playwright specs)

- TestPlans.tsx polls plan detail every few seconds while a run is active (see `activeRunId` / `isPolling`). Long waits should anchor on **status transitions** (status badge text flips from `running` to `completed`/`stopped`) rather than fixed timeouts. Reasonable upper bound: 60 s for short plans, much longer for full regression.
- TC-105 (Stop) is non-destructive but it _does_ leave a stopped run record in the project's history. Acceptable noise.
- TC-104 / TC-105 / TC-113 each cost real runner-container time on the SUT. In CI, gate the destructive subset behind an env var (e.g. `XT_RUN_TESTPLANS=1`) the same way profile.spec.ts gates TC-PF-006 — otherwise every CI run incurs runner cost.
- Run-detail URL parameters are the source of truth for filter state (TC-108 confirms this). Tests can either (a) set filters via the UI and verify the URL, or (b) navigate with the URL pre-populated and verify the UI reflects it. Both flows should be covered eventually.
- TC-112 navigates to `/test-plan-run-case/<runId>`. Note that the runId in the URL is the parent run; the specific test case identity comes from React-Router state (or a query param). When porting to Playwright, capture the location.state to assert the right case opened.
- Avoid prompts that perform destructive actions on real third-party sites in any contained AI test cases.
