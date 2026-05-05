# Organizations Test Cases

Manual QA test cases for the XiTester organization-management surface. Covers list/search, view, create, update, and delete on `/organizations` and `/org/settings`. **All flows are user-driven through the UI** — no direct API calls in tests; the SPA's own client makes whatever network calls it needs. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/SelectOrganization.tsx` (list, search)
- `frontend/src/pages/OrganizationSettings.tsx` (general, danger zone)
- `frontend/src/components/CreateOrganizationDialog.tsx`

## Out of Scope

- **Clone organization** — no such feature exists in the SUT. `TC-ORG-007` covers a different meaning of "duplicate" (same-name collision on create).
- Members, invitations, plan-tier upgrade UI, audit-trail tab, billing — separate suites.

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` (per-env GitHub Secret)
- Password: `${TEST_USER_PASSWORD}` (per-env GitHub Secret)
- Viewport: `1920x1080`

### Test Data

Mutating tests use a unique throwaway name per run (e.g. `qa-tmp-<timestamp>`) and clean up after themselves through the UI delete flow. The "New organization" button is disabled on free-tier accounts; tests in those envs skip with a clear message.

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
| Settings — Save Changes button     | `button` containing text `"Save Changes"`                 |
| Danger Zone — Delete button        | `button` containing text `"Delete this organization"`     |
| Confirmation modal — name input    | `input` (the typed-confirmation field inside the dialog)  |
| Confirmation modal — confirm btn   | `button` containing text `"Delete Organization"`          |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-ORG-001 — View organization list | Orgs | P0 | After login, `/organizations` renders with the search field and at least one org card visible. | 1. Sign in.<br>2. Navigate to `/organizations`.<br>3. Confirm the search input and at least one org card are visible. |
| TC-ORG-002 — Search filters the org list | Orgs | P1 | Filter is case-insensitive substring match against org name. Searching `XiTester` keeps the `XiTester` card visible. Searching `API` keeps the `API-Tester` card visible. Searching for a no-match string hides every card. Clearing the field restores them. | 1. Open `/organizations`.<br>2. Type `XiTester`; verify the `XiTester` card is still visible.<br>3. Type `API`; verify the `API-Tester` card is still visible.<br>4. Type a no-match string; verify all cards disappear.<br>5. Clear the field; verify the cards return. |
| TC-ORG-003 — View organization settings | Orgs | P0 | Clicking an org card switches to that org. `/org/settings/general` shows pre-filled `#orgName`, `#orgSlug` (read-only), and `#orgDescription`. | 1. Open `/organizations`.<br>2. Click any org card.<br>3. Navigate to `/org/settings/general`.<br>4. Verify Name, Slug (read-only), and Description fields are visible and populated. |
| TC-ORG-004 — Create a new organization | Orgs | P0 | Clicking "New organization", filling the modal, and submitting closes the modal and adds a card to `/organizations`. **Skips** when the button is disabled (free-tier). Cleanup deletes the new org via the UI danger zone. | 1. Open `/organizations`.<br>2. Click "New organization".<br>3. Type `qa-tmp-${ts}` into Name (optional Description).<br>4. Click "Create".<br>5. Verify modal closes and the new card is in the list.<br>6. (cleanup) Switch to the new org and delete it via Danger Zone. |
| TC-ORG-005 — Update organization name | Orgs | P0 | After creating a temp org via UI and switching to it, navigate to `/org/settings/general`, change `#orgName`, click "Save Changes". Toast: `"Organization updated successfully"`. Save button disables (no pending changes). Cleanup deletes via UI. | 1. (setup) UI-create `qa-tmp-${ts}` and switch to it.<br>2. Open `/org/settings/general`.<br>3. Replace the value in `#orgName` with `qa-renamed-${ts}`.<br>4. Click "Save Changes".<br>5. Verify success toast and that the button is no longer dirty.<br>6. (cleanup) UI-delete the renamed org. |
| TC-ORG-006 — Delete an organization via danger zone | Orgs | P0 | After creating and switching to a temp org, navigate to `/org/settings/danger-zone`, click "Delete this organization", type the org name into the typed-confirmation input, click "Delete Organization". Toast: `"Organization deleted successfully"`. App routes back to `/organizations`. | 1. (setup) UI-create `qa-del-${ts}` and switch to it.<br>2. Open `/org/settings/danger-zone`.<br>3. Click "Delete this organization".<br>4. Type the org name into the confirmation input.<br>5. Click "Delete Organization".<br>6. Verify success toast and that the URL leaves `/org/settings`. |
| TC-ORG-007 — Create rejects duplicate name | Orgs | P0 | After UI-creating an org with name `X`, opening the Create modal again with the same `X` returns a 4xx and surfaces an "already / duplicate / taken / in use" error inline or via toast. The modal stays open. The seed org is cleaned up via UI. | 1. (setup) UI-create `qa-dup-${ts}`.<br>2. Open `/organizations` again and click "New organization".<br>3. Type the same name `qa-dup-${ts}` into Name.<br>4. Click "Create".<br>5. Verify a 4xx response, the error is surfaced, and the modal stays open.<br>6. (cleanup) Cancel modal, switch to the seed org, UI-delete. |

## Conversion Notes

- Tests run authenticated via the `setup` project (auth.setup.ts → `playwright/.auth/user.json`). No per-test login.
- All setup/cleanup is UI-driven — `uiCreateOrg(page, name)`, `uiSwitchToOrg(page, name)`, `uiDeleteOrg(page, name)` — so we exercise the same code paths a real user does. No hand-rolled API helpers.
- The dashboard's "Run" / "Re-run" buttons grep tests by exact title. With no `test.describe()` wrappers, the title path is just the test name itself, so per-test re-run continues to work.
