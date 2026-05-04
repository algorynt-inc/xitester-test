# Organizations Test Cases

Manual QA test cases for the XiTester organization-management surface. Covers list/search, view, create, update, and delete on `/organizations` and `/org/settings`. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/SelectOrganization.tsx` (list, search, sort)
- `frontend/src/pages/OrganizationSettings.tsx` (general, danger zone)
- `frontend/src/components/CreateOrganizationDialog.tsx`
- `frontend/src/services/authApi.ts` (`organizationApi` namespace)

## Out of Scope

- **Clone organization** — no such feature exists in the SUT (no API endpoint, no UI control for copying an org's settings/data). Tests intentionally omitted. Add a `TC-ORG-NNN` row here when/if a clone-org feature lands. (Note: TC-ORG-007 below covers a *different* meaning of "duplicate" — same-name collision on create.)
- Members, invitations, plan-tier upgrade UI, audit-trail tab, billing — separate suites.

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` (per-env GitHub Secret)
- Password: `${TEST_USER_PASSWORD}` (per-env GitHub Secret)
- Org list endpoint: `GET {API_BASE}/api/v1/auth/organizations`
- Org CRUD endpoint: `POST | GET | PUT | DELETE {API_BASE}/api/v1/organizations`
- Viewport: `1920x1080`

### Test Data

Create / Delete tests mutate org state. They use a unique throwaway name per run (e.g. `qa-tmp-<timestamp>`) and clean up after themselves. The Create button is disabled for free-tier accounts; tests in those envs skip with a clear message.

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Tests start authenticated via a programmatic POST to `/api/v1/auth/login` that seeds `localStorage.auth_token_v1` (no UI login per test).
3. Mutating tests (create / update / delete) clean up via API in `afterEach` so a failure doesn't leave orphan orgs.
4. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).

## Common Selectors

| Element                            | Selector                                                  |
|------------------------------------|-----------------------------------------------------------|
| Org list search input              | `input[placeholder="Search for an organization"]`         |
| Org card / list-row button         | `button` containing the org name                          |
| "New organization" button          | `button` containing text `"New organization"`             |
| Create modal — Name input          | `#orgName`                                                |
| Create modal — Description input   | `#orgDesc`                                                |
| Create modal — submit              | `button[type="submit"]` containing `"Create"`             |
| Settings — Name input              | `#orgName`                                                |
| Settings — Description input       | `#orgDescription`                                         |
| Settings — Save Changes button     | `button` containing text `"Save Changes"`                 |
| Danger Zone — Delete button        | `button` containing text `"Delete this organization"`     |
| Confirmation modal — name input    | `input` (the typed-confirmation field inside the dialog)  |
| Confirmation modal — confirm btn   | `button` containing text `"Delete Organization"`          |

---

## A. Browse & Search

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-001 — View organization list | Orgs / Browse | P0 | After login, `/organizations` renders with the search field, sort filter, and at least one org button visible. No console errors on load. | 1. Sign in as the test user.<br>2. Navigate to `/organizations`.<br>3. Confirm the search input and at least one org card are visible. |
| TC-ORG-002 — Search filters the org list | Orgs / Browse | P1 | Filter is case-insensitive substring match against org name. Searching for `XiTester` keeps the `XiTester` card visible. Searching for `API` keeps the `API-Tester` card visible. Searching for a no-match string hides every card. Clearing the field restores all of them. | 1. Open `/organizations`.<br>2. Type `XiTester` into the search field; verify the `XiTester` org card is still visible.<br>3. Type `API` into the search field; verify the `API-Tester` org card is still visible.<br>4. Type a string that matches nothing (e.g. `qa-no-match-${ts}`); verify all org cards disappear.<br>5. Clear the field; verify the cards return. |

## B. View

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-003 — View organization settings | Orgs / View | P0 | Clicking an org card switches to that org. Navigating to `/org/settings/general` shows pre-filled `#orgName`, `#orgSlug` (read-only), and `#orgDescription` reflecting the org's stored values. | 1. Open `/organizations`.<br>2. Click any org card.<br>3. Navigate to `/org/settings/general` (or follow the in-app sidebar link).<br>4. Verify Name, Slug (read-only), and Description fields are visible and populated. |

## C. Create

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-004 — Create a new organization | Orgs / Create | P0 | `POST /api/v1/organizations` returns 200/201. Modal closes, a new org card appears in `/organizations`, and the new org is selectable. **Skips** when the "New organization" button is disabled (free-tier accounts). The test cleans up by deleting the created org via API in `afterEach`. | 1. Open `/organizations`.<br>2. Click "New organization".<br>3. Type `qa-tmp-${ts}` into Name.<br>4. Optional: type a short description into Description.<br>5. Click "Create".<br>6. Wait for the modal to close and verify the new org name appears in the list. |
| TC-ORG-007 — Create rejects duplicate name | Orgs / Create | P0 | An org with name `X` exists (created via API). Submitting the Create modal with the same name returns an error from `POST /api/v1/organizations` (4xx — typically 409 Conflict or 422). The modal stays open, an error message is surfaced (modal-inline or Sonner toast), and no second org with that name is added to the list. The pre-existing org is cleaned up via API. | 1. (setup) Create org `qa-dup-${ts}` via API.<br>2. Open `/organizations`.<br>3. Click "New organization".<br>4. Type the *same* name `qa-dup-${ts}` into Name.<br>5. Click "Create".<br>6. Verify the API returned 4xx, the error is visible (modal or toast), and the modal did not close. |

## D. Update

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-005 — Update organization name | Orgs / Update | P0 | After creating a temp org via API, navigate to `/org/settings/general`, change `#orgName`, click "Save Changes". `PUT /api/v1/organizations` returns 200. Sonner success toast: `"Organization updated successfully"`. The button disables after save (no pending changes). Cleanup deletes the temp org via API. | 1. (setup) Create a temp org via API and switch context to it.<br>2. Navigate to `/org/settings/general`.<br>3. Replace the value in `#orgName` with `qa-renamed-${ts}`.<br>4. Click "Save Changes".<br>5. Verify the success toast and that the button is no longer dirty. |

## E. Delete

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-006 — Delete an organization via danger zone | Orgs / Delete | P0 | After creating a temp org via API and switching to it, navigate to `/org/settings/danger-zone`. Click "Delete this organization". The confirmation dialog requires typing the org name exactly. After confirming, `DELETE /api/v1/organizations` returns 204. Sonner success toast: `"Organization deleted successfully"`. The app routes back to `/organizations` (or signs out if it was the user's only org). | 1. (setup) Create a temp org via API and switch context to it.<br>2. Navigate to `/org/settings/danger-zone`.<br>3. Click "Delete this organization".<br>4. In the confirmation dialog, type the org name exactly into the typed-confirmation input.<br>5. Click "Delete Organization".<br>6. Verify success toast and that the URL is no longer under `/org/settings`. |

---

## Conversion Notes

- The Playwright suite at `playwright/tests/orgs.spec.ts` mirrors these six rows. Auth is handled programmatically — POST `/api/v1/auth/login`, capture `access_token`, inject as `localStorage.auth_token_v1` via `addInitScript`. No UI login per test.
- Create / Update / Delete tests share a small helper module-scoped to this spec: `createTempOrg(context)` / `deleteOrg(context, orgId)`. The helpers use `context.request` so cleanup runs even on test failure (`afterEach`).
- For the typed-confirmation dialog (TC-ORG-006), the spec reads the org name from the on-screen heading, types it into the confirmation field, then clicks the destructive button.
- If a future build adds a duplicate-org control, write the row here first (`TC-ORG-007 — Duplicate organization`) and add the corresponding `test()` to the spec.
