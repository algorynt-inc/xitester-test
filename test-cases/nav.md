# Navigation Switcher Test Cases

Manual QA test cases for the topbar's **organisation switcher** and **project switcher** dropdowns — open, search, switch, and the "All" / "New" links inside each. Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/components/layout/TopBar.tsx` (OrgBreadcrumb component, lines 97-270)
- `frontend/src/components/ProjectSwitcher.tsx` (lines 18-126)

## Environment

- Auth: storageState (`auth.setup`)
- The org switcher search uses placeholder `"Find organization..."`.
- The project switcher search uses placeholder `"Find project..."`.
- Search filter is case-insensitive substring match against the org / project name.
- Both switchers are Radix DropdownMenu — items render with `role="menuitem"`.

## Common Selectors

| Element                                | Selector                                                      |
|----------------------------------------|---------------------------------------------------------------|
| Switcher trigger                       | `header button[aria-haspopup="menu"]:visible` (multiple — pick the one that opens the menu containing the right placeholder) |
| Org search input                       | `input[placeholder="Find organization..."]`                   |
| Project search input                   | `input[placeholder="Find project..."]`                        |
| Menu item                              | `getByRole('menuitem', { name: '<text>' })`                   |
| "All Organizations"                    | `getByRole('menuitem', { name: /All Organizations/i })`       |
| "All Projects"                         | `getByRole('menuitem', { name: /All Projects/i })`            |
| "New project"                          | `getByRole('menuitem', { name: /New project/i })`             |

## Test Cases

### Organisation switcher

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-056 — Verify Organization Switch dropdown shows orgs | Dashboard – Organization | High | Clicking the org switcher trigger reveals the search input AND at least one org row in the dropdown. | 1. Open `/dashboard`.<br>2. Click the org switcher trigger in the topbar.<br>3. Verify the "Find organization..." input is visible.<br>4. Verify at least one menu item is visible. |
| TC-057 — Verify Organization search inside dropdown | Dashboard – Organization | High | Typing `"XiTester"` keeps the XiTester item visible. Typing nonsense filters the list to empty. | 1. Open the org switcher.<br>2. Type `"XiTester"` into the search input.<br>3. Verify the XiTester menu item is still visible.<br>4. Replace with a no-match string.<br>5. Verify no menu items are visible. |
| TC-058 — Verify "All Organizations" navigation | Dashboard – Organization | High | The "All Organizations" menu item navigates to `/organizations`. | 1. Open the org switcher.<br>2. Click "All Organizations".<br>3. Verify the URL becomes `/organizations`. |

### Project switcher

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-059 — Verify "All Projects" + "New project" navigate from project dropdown | Dashboard – Project Navigation | High | "All Projects" routes to `/org/projects`. "New project" likewise routes to `/org/projects` (the SUT opens its create dialog from that page). | 1. Open `/dashboard`.<br>2. Open the project switcher → click "All Projects". Verify URL is `/org/projects`.<br>3. Navigate back to `/dashboard`.<br>4. Open the project switcher → click "New project". Verify URL is `/org/projects`. |
| TC-060 — Verify Project switch dropdown lists projects | Dashboard – Project Switch | High | The project switcher reveals the "Find project..." input plus at least one project menu item (excluding the "All Projects" / "New project" footer items). | 1. Open `/dashboard`.<br>2. Click the project switcher trigger.<br>3. Verify the "Find project..." input is visible.<br>4. Verify at least one project menu item is listed. |
| TC-061 — Verify Project search inside dropdown | Dashboard – Project Search | High | Typing `"Default"` keeps the "Default Project" menu item visible. Typing nonsense filters the list to empty (excluding footer items). | 1. Open the project switcher.<br>2. Type `"Default"` into the search input.<br>3. Verify the "Default Project" menu item is still visible.<br>4. Replace with a no-match string.<br>5. Verify no project menu items remain (footer items "All Projects" / "New project" are excluded from the assertion). |
| TC-062 — Verify Project search inside dropdown (clear restores list) | Dashboard – Project Search | High | Per the source data this is the same scenario as TC-061. Re-asserts from a clearing-the-search angle so we get distinct coverage rather than a literal duplicate: search → match → clear → full list returns. | 1. Open the project switcher.<br>2. Note the initial number of project menu items.<br>3. Type `"Default"`. Verify "Default Project" stays visible.<br>4. Clear the search input.<br>5. Verify the project list returns to (at least) the initial size. |

## Conversion Notes

- The topbar carries multiple `aria-haspopup="menu"` triggers (org breadcrumb, project switcher, user menu, etc.). Both helpers `openOrgSwitcher` / `openProjectSwitcher` iterate visible triggers, click each, and check whether the expected search-input placeholder appears — that disambiguates which menu we just opened. Closes via `Escape` and tries the next one if not.
- TC-061 and TC-062 are identical in the source spec sheet. To produce two distinct assertions instead of one duplicate row, TC-062 re-frames the scenario as "search-then-clear-restores-list" so both runs cover slightly different aspects of the filter.
- Project menu items include the "All Projects" / "New project" footer items. Locator filters skip those by `hasNotText` so search-result counts only count actual project rows.
