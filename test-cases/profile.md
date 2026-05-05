# Profile Test Cases

Manual QA test cases for `/account/preferences` (display name, profile photo) and `/account/security` (password change). Nine user-driven scenarios. **All flows are UI-driven** — file uploads use Playwright's `setInputFiles` with in-memory buffers, no API calls in the spec. Each test case follows the canonical column format in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/AccountPage.tsx` (preferences + security tabs)
- `frontend/src/services/authApi.ts` (`PUT /api/v1/auth/me`, profile-photo endpoints, `POST /api/v1/auth/change-password`)

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Tests start authenticated via `auth.setup` storageState.
- All tests run **serially** (`test.describe.configure({ mode: 'serial' })`) because they all mutate the same user account.
- Viewport: `1920x1080`

### Test Data

- Photo uploads use a 67-byte 1x1 transparent PNG (`TINY_PNG`) and a 6 MB zero-filled buffer for the size-limit test — no binary fixtures committed to the repo.
- Name update is bidirectional (rename + revert) so the user account is unchanged at the end.
- **Password update (TC-PF-006) is destructive** — it changes the live user password and tries to revert. Default-skipped in CI; set `XT_RUN_DESTRUCTIVE=1` locally to run.

## Common Selectors

| Element                       | Selector                                                |
|-------------------------------|---------------------------------------------------------|
| Display name input            | `input[placeholder="Your name"]`                        |
| File input (photo)            | `input[type="file"]`                                    |
| Save (preferences)            | `button` with text `"Save"`                             |
| Remove photo                  | `button` with text `"Remove"`                           |
| Password inputs (security)    | `input[type="password"]` (3 inputs in order: current, new, confirm) |
| Update password               | `button` with text `"Update password"`                  |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-PF-001 — Upload a valid profile photo | Profile | High | A small valid PNG uploaded via the file input fires `POST /api/v1/auth/me/profile-photo`. Sonner toast: `"Profile photo updated"`. Cleanup removes the photo so the next run starts clean. | 1. Open `/account/preferences`.<br>2. Set the file input to a small valid PNG.<br>3. Verify the success toast.<br>4. (cleanup) Click "Remove"; verify "Profile photo removed". |
| TC-PF-002 — Reject non-image file | Profile | Medium | A `.txt` file (MIME `text/plain`) is rejected by the SPA's `file.type.startsWith("image/")` check. Toast: `"Please upload an image file"`. No request fires. | 1. Open `/account/preferences`.<br>2. Set the file input to `not-an-image.txt` (`text/plain` MIME).<br>3. Verify the rejection toast. |
| TC-PF-003 — Reject photo over 5 MB | Profile | Medium | A 6 MB image-mimed file fails the SUT's `file.size > 5 * 1024 * 1024` check. Toast: `"Image size must be less than 5MB"` (or similar). | 1. Open `/account/preferences`.<br>2. Set the file input to a 6 MB buffer with `image/png` MIME.<br>3. Verify the size-limit toast. |
| TC-PF-004 — Remove profile photo | Profile | Medium | Setup uploads a tiny PNG (so a photo exists). Clicking "Remove" fires `DELETE /api/v1/auth/me/profile-photo`. Toast: `"Profile photo removed"`. The Remove button hides itself when there's no photo. | 1. Open `/account/preferences`.<br>2. (setup) Upload a tiny PNG; verify success toast.<br>3. Click "Remove".<br>4. Verify removal toast and that the Remove button is no longer visible. |
| TC-PF-005 — Update display name and revert | Profile | Medium | Tests `PUT /api/v1/auth/me` round-trip. Captures the original name, renames to a temp value, asserts `"Profile updated"` toast, then renames back to the original — leaves the account unchanged. | 1. Open `/account/preferences`.<br>2. Capture the current value of the Name input.<br>3. Replace with `qa-name-${ts}`. Click Save. Verify the toast.<br>4. Replace back with the original value. Click Save. Verify the toast and that the input shows the original. |
| TC-PF-006 — Update password and revert (destructive) | Profile - Security | High | Changes the live user password, then changes it back. Default-skipped — opt in with `XT_RUN_DESTRUCTIVE=1` because if the revert step fails, the GitHub Secret stops matching the live password until rotated manually. | 1. Open `/account/security`.<br>2. Type current = `${TEST_USER_PASSWORD}`, new = `Xt-${ts}!`, confirm = same. Click "Update password". Verify success toast.<br>3. Type current = the temp password, new = `${TEST_USER_PASSWORD}`, confirm = same. Click "Update password". Verify success. |
| TC-PF-007 — Wrong current password is rejected | Profile - Security | High | Submitting with an incorrect Current password returns 401 from `POST /api/v1/auth/change-password` and surfaces an inline field error or toast mentioning "current password / incorrect / invalid". The password is unchanged. | 1. Open `/account/security`.<br>2. Type a clearly-wrong current password, plus a valid new + confirm.<br>3. Click "Update password".<br>4. Verify an "incorrect / invalid current password" error is visible. |
| TC-PF-008 — Mismatched new + confirm disables Save | Profile - Security | High | The SUT disables the Save button when `newPassword !== confirmPassword` (AccountPage.tsx). No API call. Once the inputs match, Save re-enables. | 1. Open `/account/security`.<br>2. Type valid current password.<br>3. Type new = `Xitester-A1!`, confirm = `Xitester-B2!`.<br>4. Verify "Update password" button is disabled.<br>5. Change confirm to match new — verify the button re-enables. |
| TC-PF-009 — Weak (short) password disables Save | Profile - Security | Medium | The SUT requires `newPassword.length >= 8`. Typing a 5-char password keeps Save disabled. The form should also surface the requirement (helper text mentioning "at least 8" / "minimum 8"). | 1. Open `/account/security`.<br>2. Type valid current password.<br>3. Type new = `12345`, confirm = `12345`.<br>4. Verify "Update password" is disabled.<br>5. Verify the form surfaces an "at least 8 characters" hint. |

## Conversion Notes

- `test.describe.configure({ mode: 'serial' })` at the top of `profile.spec.ts` forces all 9 tests to run sequentially within this file, preventing two tests from racing against the same user account.
- Photo uploads use `setInputFiles({ name, mimeType, buffer })` — no committed fixtures. `TINY_PNG` is a 67-byte hex-decoded transparent 1x1 PNG; `Buffer.alloc(6 * 1024 * 1024)` is a 6 MB blank for the size-limit test.
- Password fields are located by `input[type="password"]` ordinal index (0 = current, 1 = new, 2 = confirm) because the SUT's shadcn `<Input>` doesn't carry id attributes.
- TC-PF-006 (`Update password and revert`) is destructive and gated behind `XT_RUN_DESTRUCTIVE`. Run locally:
  ```bash
  XT_ENV=dev XT_USER_EMAIL='…' XT_USER_PASSWORD='…' XT_RUN_DESTRUCTIVE=1 \
    pnpm exec playwright test tests/profile.spec.ts --grep TC-PF-006
  ```
  If the revert step fails the test reports `CRITICAL: revert step failed — the live password is now Xt-<ts>!` so you can recover the credential manually.
