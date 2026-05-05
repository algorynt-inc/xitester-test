# Projects Test Cases

Manual QA test cases for the XiTester project-management surface (`/org/projects`). Five user-driven flows: list, create, view, update, delete. **All flows go through the UI** — no direct API calls in tests. Each test case follows the canonical column format in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Projects.tsx` (list, create modal, edit modal, delete confirm)
- `frontend/src/services/api/projectApi.ts` (REST surface — observed only, never called directly by tests)
- `frontend/src/contexts/ProjectContext.tsx`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` (per-env GitHub Secret)
- Password: `${TEST_USER_PASSWORD}` (per-env GitHub Secret)
- Project routes: `/org/projects` (list), `/dashboard` (post-selection)
- Viewport: `1920x1080`

### Test Data

Mutating tests use `qa-prj-<timestamp>` / `qa-del-<timestamp>` / `qa-renamed-<timestamp>` and clean up via the UI delete flow afterwards.

## Common Selectors

| Element                       | Selector                                                |
|-------------------------------|---------------------------------------------------------|
| Project search input          | `input[placeholder="Search for a project"]`             |
| "New project" button          | `button` containing text `"New project"`                |
| Create modal — Name           | `#createName`                                           |
| Create modal — Description    | `#createDescription`                                    |
| Create modal — URL            | `#createUrl`                                            |
| Create modal — submit         | `button` containing text `"Create Project"`             |
| Card kebab menu               | `button[aria-haspopup]` inside the project row          |
| Edit modal — Name             | `#editName`                                             |
| Edit modal — Description      | `#editDescription`                                      |
| Edit modal — URL              | `#editUrl`                                              |
| Edit modal — Save             | `button` containing text `"Save changes"`               |
| Delete confirm — destructive  | `button` containing text `"Delete Project"`             |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-PR-001 — View project list | Projects | P0 | `/org/projects` renders with the project search input and the "New project" button visible. | 1. Sign in.<br>2. Navigate to `/org/projects`.<br>3. Confirm the search input and "New project" button are visible. |
| TC-PR-002 — Create a new project | Projects | P0 | Clicking "New project", filling `#createName`, and submitting hits `POST /api/v1/projects/`. The new project appears as a card on `/org/projects`. Cleanup deletes the project through the kebab menu. | 1. Open `/org/projects`.<br>2. Click "New project".<br>3. Type `qa-prj-${ts}` into Name.<br>4. Click "Create Project".<br>5. Return to `/org/projects` and verify the new card is visible.<br>6. (cleanup) Open the kebab on the new card, click Delete, confirm. |
| TC-PR-003 — View an existing project | Projects | P0 | Clicking a project card switches the project context and navigates to a project-scoped page (`/dashboard`, `/api-tester`, `/test-cases`, etc.). | 1. Open `/org/projects`.<br>2. Click any project card.<br>3. Verify the URL is no longer `/org/projects` and lands on a project-scoped route. |
| TC-PR-004 — Update project name | Projects | P0 | Open the kebab → Edit on a project, change `#editName`, click "Save changes". `PUT /api/v1/projects/{id}` returns 200. Sonner success toast: `"Project updated"`. The list shows the new name; the old name is gone. Cleanup deletes the renamed project. | 1. (setup) UI-create `qa-prj-${ts}`.<br>2. Open the kebab on its card → click Edit.<br>3. Replace `#editName` with `qa-renamed-${ts}`.<br>4. Click "Save changes".<br>5. Verify the success toast and the rename in the list.<br>6. (cleanup) UI-delete the renamed project. |
| TC-PR-005 — Delete a project | Projects | P0 | After creating a temp project, open the kebab → Delete, confirm in the dialog. `DELETE /api/v1/projects/{id}` returns 200/204. Card disappears from `/org/projects`. | 1. (setup) UI-create `qa-del-${ts}`.<br>2. Open the kebab on its card → click Delete.<br>3. In the confirmation dialog, click "Delete Project".<br>4. Verify the card is no longer in the list. |

## Conversion Notes

- Tests run authenticated via the `setup` project (auth.setup.ts).
- All setup/cleanup is UI-driven — `uiCreateProject(page, name)`, `uiUpdateProject(page, oldName, newName)`, `uiDeleteProject(page, name)`. `openKebabAction(page, name, action)` finds the project card by name and opens its kebab menu.
- The SPA navigates to `/dashboard` immediately after a successful create (selecting the new project as current context). Tests `goto('/org/projects')` after each mutation to re-list cards before asserting visibility.
- No `test.describe()` wrappers — the dashboard renders these five rows as a flat list without category headers.
