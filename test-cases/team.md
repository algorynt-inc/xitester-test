# Team / Invitations Test Cases

Manual QA test cases for the organisation Team / pending-invitations surface (`/org/team`). Single test for now — extend as the team-management feature grows. Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/pages/OrganizationSettings.tsx` (Members tab, lines 780-797 for the pending-invite row, 1056-1080 for the cancel-invitation confirmation dialog)

## Environment

- Route: `/org/team`
- Auth: storageState (`auth.setup`)
- Pre-condition for TC-040: at least one **pending** invitation must exist on the test user's currently-selected org. The test skips cleanly when none is found.

## Common Selectors

| Element                        | Selector                                                  |
|--------------------------------|-----------------------------------------------------------|
| Pending invitation row         | `tr` containing text `"Pending invitation"`               |
| Cancel link in row             | `button` with text `"Cancel"` inside the pending row      |
| Confirmation dialog            | `div[role="dialog"]` containing `"Cancel invitation"`     |
| Confirm-cancel button          | `button` with text `"Cancel invitation"` inside the dialog|

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-040 — Verify cancel invitation | Organization – Team | Medium | An admin can cancel a pending invitation. After clicking the row's "Cancel" link, the confirmation dialog asks for a final confirm; clicking "Cancel invitation" fires the API call and removes the row from the table. **Skips** when no pending invite exists on the env. | 1. Open `/org/team`.<br>2. Locate any pending-invite row.<br>3. Click the row's "Cancel" link.<br>4. In the confirmation dialog, click "Cancel invitation".<br>5. Verify the dialog closes and the row is removed from the table. |
