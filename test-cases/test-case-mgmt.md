# Test Case Management Test Cases

Manual QA test cases for the **Test Cases module** at `/test-cases` — the page where users browse, filter, tag, run, and bulk-act on test sessions across the AI / Record / Play sections.

> **Note on numbering.** TC-065..075 (create / update / delete / clone for AI and recorded test cases, search across all sections, end-to-end run, status updates) live in the master spec sheet outside this file. The 12 cases below cover scenarios **not already in TC-065..075** — list views, filters, sort, tagging, bulk actions, pagination, and run history. Numbering picks up at TC-076 to keep the global sequence contiguous.

Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/pages/TestCases.tsx` (list page, search/filter/sort, tag chips, bulk actions, pagination)
- `frontend/src/pages/TestPlanRunCaseDetail.tsx` (single-session detail, run history, screenshots/videos)
- `frontend/src/components/EditTestCaseModal.tsx`
- `frontend/src/components/ui/ConfirmationDialog.tsx`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Pre-condition: the test user's currently-selected project must contain at least one test session. Mutating tests create their subjects via the UI when the source spec says so.
- Viewport: `1920x1080`

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Mutating tests clean up after themselves so the project ends in its original state.
3. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).
4. Dialog scope: `div[role="dialog"]` containing the dialog title.

## Common Selectors

| Element                              | Selector                                                              |
|--------------------------------------|-----------------------------------------------------------------------|
| Test cases search input              | `input[placeholder="Search test cases…"]`                             |
| AI / Record / Play tabs              | the tab buttons in the toolbar (text: `"AI"`, `"Record"`, `"Play"`)   |
| Status faceted filter                | toolbar chips for run status (e.g. `"Passed"`, `"Failed"`, `"Idle"`)  |
| Sort dropdown                        | toolbar dropdown with options (`"Newest"`, `"Oldest"`, `"Name A-Z"`)  |
| Test session row                     | the row whose visible title matches the test name                     |
| Row checkbox (bulk-select)           | `input[type="checkbox"]` on the row                                   |
| Tags input on a row                  | `input[placeholder="Add tags…"]`                                      |
| Tag chip                             | the rendered tag pill on the row, with a `×` remove icon              |
| Tag faceted filter                   | toolbar chip group filtering by tag                                   |
| Bulk-actions bar                     | bar above the list when ≥ 1 row is selected                           |
| Bulk Delete button                   | `button` with text matching `"Delete"` in the bulk-actions bar        |
| Delete confirmation dialog           | `div[role="dialog"]` containing `"Delete"`                            |
| Pagination controls                  | "Next page" / "Previous page" buttons in the list footer              |
| Detail-page run history section      | the "Run history" / "Past runs" panel on `/test-cases/<sessionId>`    |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-076 — View test cases list | Test Cases | High | After signing in and navigating to `/test-cases`, the page renders the search input, the AI / Record / Play tab bar, at least one test session row, and the per-row affordances. The bulk-actions bar is hidden until a row is selected. | 1. Sign in.<br>2. Navigate to `/test-cases`.<br>3. Verify the search input, tab bar, and at least one session row are visible.<br>4. Verify the bulk-actions bar is not yet shown. |
| TC-077 — Switch between AI / Record / Play tabs | Test Cases | High | Clicking each tab in the toolbar updates the list to show only sessions of that type. The active tab is visually distinct (selected state). The URL or list updates without a full reload. | 1. Open `/test-cases`.<br>2. Note the currently-active tab.<br>3. Click the "Record" tab; verify the list refreshes to recorded sessions only.<br>4. Click "Play"; verify the list refreshes to play sessions only.<br>5. Click "AI"; verify AI sessions are shown.<br>6. Verify the active-tab indicator follows each click. |
| TC-078 — Filter by run status | Test Cases | High | Clicking a status chip (e.g. "Passed") narrows the list to sessions with that latest run status. The chip flips to its active state. Clicking the chip again clears the filter. | 1. Open `/test-cases`.<br>2. Click the "Passed" status chip in the toolbar.<br>3. Verify every visible row's status badge reads "Passed".<br>4. Click the "Passed" chip again to remove the filter.<br>5. Verify rows return to the unfiltered set. |
| TC-079 — Sort by Newest / Oldest / Name | Test Cases | Medium | The sort dropdown changes the ordering of the list. "Newest" puts the most recently created session at the top; "Oldest" reverses it; "Name A-Z" sorts alphabetically. The page-1 first row updates with each change. | 1. Open `/test-cases`.<br>2. Open the sort dropdown.<br>3. Pick "Newest" — note the first row's title.<br>4. Pick "Oldest" — verify the first row changes to a different (older) session.<br>5. Pick "Name A-Z" — verify the first row's title is alphabetically the smallest visible. |
| TC-080 — Open test case detail page | Test Cases | High | Clicking a session row navigates to `/test-cases/<sessionId>` and renders the detail view (title, current status, action timeline / steps, attachments). | 1. Open `/test-cases`.<br>2. Click the title of any session row.<br>3. Verify the URL becomes `/test-cases/<sessionId>`.<br>4. Verify the detail page renders without console errors. |
| TC-081 — Add tag to a test case | Test Cases | Medium | Typing a new tag in a row's tags input and pressing Enter adds the tag chip to the row and persists via the API. Cleanup removes the tag. | 1. Open `/test-cases`.<br>2. Locate any row with a tags input.<br>3. Type `qa-tag-${ts}` and press Enter.<br>4. Verify the tag chip appears on the row.<br>5. (cleanup) Click the chip's `×` to remove. |
| TC-082 — Remove tag persists after reload | Test Cases | Medium | After removing a tag from a row, reloading the page should still show the tag absent — confirms the change persisted server-side, not just locally. | 1. (setup) Add a tag `qa-rm-${ts}` to any row.<br>2. Click the chip's `×` to remove it.<br>3. Verify the chip is gone.<br>4. Reload the page.<br>5. Verify the tag is still absent. |
| TC-083 — Filter by tag | Test Cases | Medium | Clicking a tag chip in the toolbar's tag-facet group narrows the list to sessions carrying that tag. Clicking again clears it. Combining a status chip + tag chip filters by both AND-style. | 1. (setup) Tag a known session with `qa-flt-${ts}`.<br>2. Open `/test-cases`.<br>3. Click the `qa-flt-${ts}` tag chip in the toolbar.<br>4. Verify only the seeded session is listed.<br>5. (cleanup) Click the tag chip again to remove the filter, then remove the tag from the session. |
| TC-084 — Bulk select + bulk delete | Test Cases | High | Selecting multiple row checkboxes shows the bulk-actions bar with a "Delete N" affordance. Clicking it opens a bulk-delete confirmation. Confirming removes all selected rows; toast `"N test case(s) deleted"` surfaces with an Undo affordance. | 1. (setup) Create three throwaway test cases via the UI: `qa-bulk-A-${ts}`, `qa-bulk-B-${ts}`, `qa-bulk-C-${ts}`.<br>2. Tick each row's checkbox.<br>3. Verify the bulk-actions bar reads "3 selected".<br>4. Click bulk Delete; confirm in the dialog.<br>5. Verify success toast `"3 test case(s) deleted"`.<br>6. Verify all three rows are removed from the list. |
| TC-085 — Undo bulk delete restores rows | Test Cases | Medium | The "N test case(s) deleted" toast surfaces an "Undo" link for ~5 seconds. Clicking it restores the deleted rows. After the timeout, undo is no longer available. | 1. (setup) Create + bulk-delete three temp rows as in TC-084.<br>2. Within 5 seconds, click the toast's "Undo" link.<br>3. Verify a restore signal (toast change or rows reappearing).<br>4. Verify all three rows are visible again.<br>5. (cleanup) Delete the restored rows individually. |
| TC-086 — Pagination — next / previous page | Test Cases | Medium | When the project has more than the page-size number of test cases, pagination controls render. Clicking "Next" advances to page 2; "Previous" returns to page 1. Skips cleanly when the project has too few sessions. | 1. Pre-condition: at least page-size + 1 test cases. **Skip** the test cleanly otherwise.<br>2. Open `/test-cases`.<br>3. Note the page-1 first-row title.<br>4. Click "Next page".<br>5. Verify the list refreshes (the page-1 first row is no longer visible).<br>6. Click "Previous page".<br>7. Verify the page-1 first row is visible again. |
| TC-087 — View run history on test case detail | Test Cases | Medium | The detail page (`/test-cases/<sessionId>`) shows a panel of past runs for that test case (timestamp, status, duration). Clicking a past-run entry expands or navigates to the run details. Skips when no past runs exist for the chosen session. | 1. Open `/test-cases`.<br>2. Click any session that has run at least once.<br>3. On the detail page, locate the "Run history" / "Past runs" panel.<br>4. Verify each entry shows a timestamp + status badge.<br>5. Click the most recent past-run entry.<br>6. Verify the run's details (or a screenshot/video link) become visible. |

## Conversion Notes (for when these become Playwright specs)

- The `/test-cases` page uses shadcn `<Input>` and `<Button>` primitives without `id` attributes. Identify inputs by **placeholder** scoped to the relevant container. Identify buttons by visible text or by the icon they wrap when icon-only.
- Tests that need throwaway sessions (TC-084 / TC-085) currently depend on a "create test case" UI flow that lives under TC-065 / TC-069 in the master spec sheet. When porting these rows to Playwright, share a single `uiCreateTestCase(page, name, type)` helper similar to `uiCreateOrg` / `uiCreateProject`.
- TC-085's "Undo" toast lives ~5 seconds. The Playwright assertion needs a tight `timeout: 4_000` to land before the toast auto-dismisses.
- TC-086's "skip when too few sessions" guard should call `test.skip(rowCount < pageSize + 1, '...')` rather than failing — projects vary.
- The sub-route `/test-cases/:sessionId` (TestPlanRunCaseDetail.tsx) carries a richer surface than what TC-080 / TC-087 cover (action timeline, attachment viewer, re-run controls). Extend with a separate spec file once the list-level cases are stable.
