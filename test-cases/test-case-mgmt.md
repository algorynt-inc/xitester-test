# Test Case Management Test Cases

Manual QA test cases for the **Test Cases module** at `/test-cases` — the page where users browse, search, filter, edit, tag, run, and delete test sessions. Twelve user-driven scenarios covering the everyday workflows. Markdown only — no Playwright spec yet. Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/pages/TestCases.tsx` (list page, search/filter, bulk actions)
- `frontend/src/pages/TestPlanRunCaseDetail.tsx` (single-case run detail)
- `frontend/src/components/EditTestCaseModal.tsx` (edit dialog)
- `frontend/src/components/ui/ConfirmationDialog.tsx` (delete confirm)

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Pre-condition: the test user's currently-selected project must contain at least one test session. Tests that mutate (edit/delete/tag) create their own subject session via the UI when the source spec says so; otherwise they assume seeded data.
- Viewport: `1920x1080`

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Mutating tests clean up after themselves (edit + revert, create + delete) so the project ends in its original state.
3. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).
4. Dialog scope: `div[role="dialog"]` containing the dialog title.

## Common Selectors

| Element                              | Selector                                                              |
|--------------------------------------|-----------------------------------------------------------------------|
| Test cases search input              | `input[placeholder="Search test cases…"]`                             |
| Test session row                     | the row in the list whose visible title text matches the test name    |
| Row checkbox (bulk-select)           | `input[type="checkbox"]` on the row                                   |
| Row kebab / actions menu             | the row's actions trigger (icon button, `aria-haspopup`)              |
| Edit modal                           | `div[role="dialog"]` containing `"Edit"` test-case title              |
| Edit modal — Title input             | scoped to dialog, `input` near the "Title" label                      |
| Edit modal — Save button             | `button` with text `"Save"` inside the edit dialog                    |
| Tags input on a row                  | `input[placeholder="Add tags…"]`                                      |
| Delete confirmation dialog           | `div[role="dialog"]` containing `"Delete"`                            |
| Delete confirm button                | `button` with destructive text inside the delete dialog               |
| Bulk-actions bar                     | the bar that appears when one or more rows are selected               |
| Pagination controls                  | "Next page" / "Previous page" buttons or numeric page links           |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-076 — View test cases list | Test Cases | High | After signing in and navigating to `/test-cases`, the page renders the search input, at least one test session row, and the per-row action affordances. The bulk-actions bar is hidden until a row is selected. | 1. Sign in.<br>2. Navigate to `/test-cases`.<br>3. Verify the search input and at least one test session row are visible.<br>4. Verify the bulk-actions bar is not yet shown. |
| TC-077 — Search test cases by exact name | Test Cases | High | Typing the exact title of a known test case into the search input filters the list down to a single matching row. The search debounces (~300ms). | 1. Open `/test-cases`.<br>2. Note the title of any seeded test case.<br>3. Type that title into the search input.<br>4. Verify the list renders only that one row after debounce. |
| TC-078 — Search test cases — no match | Test Cases | Medium | Typing a string that doesn't match any test case name shows the empty-state ("No test cases found" or similar) and zero rows. Clearing the search restores the full list. | 1. Open `/test-cases`.<br>2. Type a clearly non-matching string into the search input.<br>3. Verify the empty state is visible and zero rows are listed.<br>4. Clear the search.<br>5. Verify the original rows return. |
| TC-079 — Filter by run status | Test Cases | High | Clicking a status faceted filter (e.g. "Passed") narrows the list to only test sessions with that latest run status. Removing the filter restores the list. | 1. Open `/test-cases`.<br>2. Click the "Passed" filter chip in the toolbar.<br>3. Verify every visible row's status badge reads "Passed".<br>4. Click the chip again (or its clear icon) to remove the filter.<br>5. Verify rows return to the unfiltered set. |
| TC-080 — Open test case detail page | Test Cases | High | Clicking a test session row navigates to `/test-cases/<sessionId>` and renders the session detail view (title, status, timeline, attachments). | 1. Open `/test-cases`.<br>2. Click the title of any test session row.<br>3. Verify the URL becomes `/test-cases/<sessionId>`.<br>4. Verify the detail page renders without console errors. |
| TC-081 — Edit test case title and revert | Test Cases | High | The kebab → Edit action opens the Edit modal. Changing the title and clicking "Save" fires the update API; the toast `"Test case updated"` appears and the row in the list shows the new title. The test then reverts to the original title so the data is unchanged at the end. | 1. Open `/test-cases`.<br>2. Note the current title of any row (call it `original`).<br>3. Open the row's kebab menu and click "Edit".<br>4. Replace the Title input with `qa-renamed-${ts}`.<br>5. Click "Save" and verify the success toast.<br>6. Verify the list now shows the new title.<br>7. Repeat the edit; restore the title back to `original`.<br>8. Verify the toast and the original title is in the list again. |
| TC-082 — Add tag to a test case | Test Cases | Medium | A new tag can be added to a test session by typing into the row's tags input and pressing Enter. The new tag appears as a chip on the row. Cleanup removes the tag. | 1. Open `/test-cases`.<br>2. Locate any row with a tags input.<br>3. Type `qa-tag-${ts}` into the input and press Enter.<br>4. Verify the tag chip appears on the row.<br>5. (cleanup) Click the chip's `×` to remove it; verify the chip disappears. |
| TC-083 — Remove tag from a test case | Test Cases | Medium | Removing an existing tag from a row hides its chip and persists the change after page reload. | 1. (setup) Add a tag `qa-rm-${ts}` to any row (TC-082 flow).<br>2. Click the chip's remove (`×`) icon.<br>3. Verify the chip is gone.<br>4. Reload the page.<br>5. Verify the tag is still absent. |
| TC-084 — Delete a single test case | Test Cases | High | The kebab → Delete action opens the confirmation dialog. Confirming fires the API call; the toast `"Test case deleted"` appears and the row is removed from the list. The test creates a throwaway session first so deletion doesn't destroy real data. | 1. (setup) Create or import a temp test case named `qa-del-${ts}` via the UI.<br>2. Open its kebab menu → click "Delete".<br>3. Confirm in the dialog.<br>4. Verify the success toast and that the row is no longer in the list. |
| TC-085 — Bulk select + bulk delete | Test Cases | High | Selecting multiple rows via their checkboxes shows the bulk-actions bar with a "Delete N" button. Clicking it opens a bulk-delete confirmation. Confirming removes all selected rows; the toast `"N test case(s) deleted"` appears with an Undo affordance. | 1. (setup) Create three throwaway test cases via the UI: `qa-bulk-A-${ts}`, `qa-bulk-B-${ts}`, `qa-bulk-C-${ts}`.<br>2. Tick the row checkbox on each of the three.<br>3. Verify the bulk-actions bar is visible and reads "3 selected" (or similar).<br>4. Click the bulk Delete button.<br>5. Confirm in the dialog.<br>6. Verify the success toast `"3 test case(s) deleted"`.<br>7. Verify all three rows are removed from the list. |
| TC-086 — Undo bulk delete restores rows | Test Cases | Medium | The "N test case(s) deleted" toast surfaces an "Undo" action for ~5 seconds. Clicking it restores the deleted rows. After the timeout, undo is no longer available. | 1. (setup) Create + bulk-delete three temp rows as in TC-085.<br>2. Within 5 seconds, click the toast's "Undo" link.<br>3. Verify the toast announces a restore (or the rows reappear in the list within a few seconds).<br>4. Verify all three rows are visible again.<br>5. (cleanup) Delete the restored rows individually. |
| TC-087 — Pagination — next / previous page | Test Cases | Medium | When the project has more than the page-size number of test cases, the pagination controls render. Clicking "Next" advances to page 2; "Previous" returns to page 1. The URL or list updates with the new range. | 1. Pre-condition: at least page-size + 1 test cases in the project. **Skip** the test cleanly if fewer.<br>2. Open `/test-cases`.<br>3. Note the first row's title on page 1.<br>4. Click "Next page".<br>5. Verify the list refreshes with new rows (the page-1 first row is no longer visible).<br>6. Click "Previous page".<br>7. Verify the page-1 first row is visible again. |

## Conversion Notes (for when these become Playwright specs)

- The current `/test-cases` page uses shadcn `<Input>` and `<Button>` primitives. Inputs to identify by **placeholder** scoped to the relevant container (modal, row, toolbar). Buttons to identify by visible text or by the icon they wrap when icon-only.
- Tests that need throwaway sessions (TC-084 / TC-085 / TC-086) currently depend on a "create test case" UI flow that's outside this module's scope. When porting, add a small `uiCreateTestCase(page, name)` helper similar to `uiCreateOrg` / `uiCreateProject` from the existing specs.
- The undo-toast in TC-086 only persists ~5 seconds. The Playwright assertion needs a tight `timeout: 4_000` to land before the toast auto-dismisses.
- The sub-route `/test-cases/:sessionId` (TestPlanRunCaseDetail.tsx) is its own surface — extend with a separate spec file once these list-level cases are stable.
