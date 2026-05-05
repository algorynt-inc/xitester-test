# Projects Test Cases

Manual QA test cases for the XiTester project-management surface (`/org/projects`). Five user-driven flows: list, create, view (Default Project → dashboard), update + revert, delete. **All flows go through the UI** — no direct API calls in tests. Each test case follows the canonical column format in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Projects.tsx` (list, create modal, edit modal, delete confirm)
- `frontend/src/services/api/projectApi.ts` (REST surface — observed only)
- `frontend/src/contexts/ProjectContext.tsx`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Project routes: `/org/projects` (list), `/dashboard` (post-selection)
- **Default Project** — every XiTester org has a seed project named exactly `"Default Project"`. TC-PR-003 uses it as the deterministic target.
- Viewport: `1920x1080`

### Test Data

Mutating tests use `qa-prj-<timestamp>` / `qa-del-<timestamp>` / `qa-renamed-<timestamp>` and clean up via the UI delete flow. The Update test renames *and* reverts, so the project ends with the same name it started with before being deleted.

## Common Selectors

The shadcn `<Input>` components in the project modals have **no `id` attribute**. Tests scope to the open dialog (`div[role="dialog"]` containing the modal title) and locate inputs by placeholder. Project cards are `<div onClick>` — not buttons — so locators traverse to the closest `cursor-pointer` ancestor.

| Element                       | Selector                                                                  |
|-------------------------------|---------------------------------------------------------------------------|
| Project search input          | `input[placeholder="Search for a project"]`                               |
| "New project" button          | `button` containing text `"New project"`                                  |
| Create modal                  | `div[role="dialog"]` containing text `"Create New Project"`               |
| Edit modal                    | `div[role="dialog"]` containing text `"Edit Project"`                     |
| Delete modal                  | `div[role="dialog"]` containing text `"Delete Project"`                   |
| Modal — Name input            | `getByPlaceholder("My Project")` scoped to the dialog                     |
| Modal — Description input     | `getByPlaceholder("Optional description...")` scoped to the dialog        |
| Modal — URL input             | `getByPlaceholder("https://app.example.com")` scoped to the dialog        |
| Create submit                 | `button` containing text `"Create Project"` inside the dialog             |
| Edit submit                   | `button` containing text `"Save changes"` inside the dialog               |
| Delete confirm                | `button` containing text `"Delete Project"` inside the dialog             |
| Project card                  | text-of-name → `xpath=ancestor::div[contains(@class, "cursor-pointer")][1]` |
| Card kebab                    | first `button` inside the card; visible only on `card.hover()`            |
| Kebab menu items              | `getByRole('menuitem', { name: 'Edit' })` / `'Delete'`                    |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-PR-001 — View project list | Projects | P0 | `/org/projects` renders with the project search input and the "New project" button visible. | 1. Sign in.<br>2. Navigate to `/org/projects`.<br>3. Confirm the search input and "New project" button are visible. |
| TC-PR-002 — Create a new project | Projects | P0 | Clicking "New project" opens the Create modal. Filling Name (placeholder `"My Project"`) and submitting "Create Project" hits `POST /api/v1/projects/`. The new card appears on `/org/projects`. Cleanup deletes the new project via the kebab menu. | 1. Open `/org/projects`.<br>2. Click "New project".<br>3. Type `qa-prj-${ts}` into the Name input (the one with placeholder `"My Project"`).<br>4. Click "Create Project".<br>5. Return to `/org/projects` and verify the new card is visible.<br>6. (cleanup) Hover the new card, click the kebab → Delete, confirm. |
| TC-PR-003 — Open Default Project and land on the dashboard | Projects | P0 | Clicking the "Default Project" card switches project context and navigates to `/dashboard`. The dashboard mounts (heading or "dashboard" text visible). | 1. Open `/org/projects`.<br>2. Locate the card whose name is exactly `Default Project`.<br>3. Click the card.<br>4. Verify the URL becomes `/dashboard` and dashboard content renders. |
| TC-PR-004 — Update project name and revert | Projects | P0 | Tests bidirectional update. After creating a temp project, rename it via the kebab → Edit. `PUT /api/v1/projects/{id}` returns 200, Sonner toast `"Project updated"`. Then rename it BACK to the original name and verify the toast again. The card is finally deleted under its original name. | 1. (setup) UI-create `qa-prj-${ts}`.<br>2. Hover the card, click kebab → Edit.<br>3. Replace Name with `qa-renamed-${ts}`. Click "Save changes".<br>4. Verify the success toast and that the renamed card is in the list (and the old name is gone).<br>5. Hover the renamed card, click kebab → Edit.<br>6. Replace Name with the original `qa-prj-${ts}` (revert). Click "Save changes".<br>7. Verify the toast and that the original name is back in the list.<br>8. (cleanup) UI-delete the project. |
| TC-PR-005 — Delete a project we just created | Projects | P0 | After creating a temp project, open the kebab → Delete on its card and confirm. `DELETE /api/v1/projects/{id}` returns 200/204. The card disappears from `/org/projects`. | 1. (setup) UI-create `qa-del-${ts}`.<br>2. Hover the new card, click kebab → Delete.<br>3. In the confirmation dialog, click "Delete Project".<br>4. Verify the card is no longer in the list. |

## Conversion Notes

- Tests run authenticated via the `setup` project (`auth.setup.ts`).
- All setup/cleanup is UI-driven — `uiCreateProject(page, name)`, `uiUpdateProjectName(page, oldName, newName)`, `uiDeleteProject(page, name)`. `openKebabAction(page, name, action)` finds the project card by name (via xpath ancestor lookup), hovers to reveal the kebab, then opens the dropdown menuitem.
- Inputs are scoped to `div[role="dialog"]` and located by placeholder, because the SUT's shadcn `<Input>` components don't carry `id` attributes. Both the create and edit modals reuse the same placeholder text (`"My Project"`); the dialog scope disambiguates them.
- The kebab button (`opacity-0 group-hover:opacity-100`) only renders visibly when its parent card is hovered. The helper hovers the card first and then force-clicks the button.
- The View test (TC-PR-003) targets `Default Project` by exact name rather than a "first card" heuristic, so behavior is deterministic across orgs and accounts.
- The Update test (TC-PR-004) renames *and* reverts in a single test so the SUT's bidirectional update is exercised and the cleanup at the end can rely on the original name.
- No `test.describe()` wrappers — the dashboard renders these five rows as a flat list without category headers.
