# Login Page Test Cases

Manual QA test cases for the XiTester login page (`/login`). Lean version — 5 user-facing flows, no categories. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Login.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/services/authApi.ts`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` (per-env GitHub Secret)
- Password: `${TEST_USER_PASSWORD}` (per-env GitHub Secret)
- Viewport: `1920x1080`

## Common Selectors

| Element                | Selector                                                      |
|------------------------|---------------------------------------------------------------|
| Email input            | `#email`                                                      |
| Password input         | `#password`                                                   |
| Show/Hide password btn | `button[aria-label="Show password"]` / `"Hide password"`      |
| Submit button          | `button[type="submit"]` (text: `"Login"` / `"Signing in…"`)   |
| Forgot password link   | `a[href="/forgot-password"]`                                  |
| Create account link    | `a` containing text `"Create account"`                        |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-001 — Successful login with valid credentials | Login | P0 | `POST /api/v1/auth/login` returns 200. Submit briefly shows `"Signing in…"`. App navigates away from `/login` to the user's landing page. | 1. Open `/login`.<br>2. Type the test user's email + password.<br>3. Click "Login".<br>4. Wait for navigation. |
| TC-LI-002 — Wrong password shows error | Login | P0 | API returns 401. Sonner error toast. URL stays `/login`. Submit re-enables. Field values preserved. | 1. Open `/login`.<br>2. Type a valid email and an incorrect password.<br>3. Click "Login".<br>4. Observe the error toast. |
| TC-LI-003 — Password visibility toggle | Login | P1 | Eye icon toggles password input `type` between `password` and `text`. `aria-label` flips `"Show password"` ↔ `"Hide password"`. | 1. Open `/login`.<br>2. Type any string into Password.<br>3. Click the eye icon.<br>4. Click it again. |
| TC-LI-004 — Forgot password link navigates correctly | Login | P1 | Clicking "Forgot password?" navigates to `/forgot-password`. The destination renders without JS errors. | 1. Open `/login`.<br>2. Click "Forgot password?". |
| TC-LI-005 — Create account link navigates correctly | Login | P1 | Clicking "Create account" navigates to `/signup`. The destination renders without JS errors. | 1. Open `/login`.<br>2. Click "Create account". |

## Conversion Notes

The Playwright suite at `playwright/tests/login.spec.ts` mirrors these five rows. Tests run flat (no `test.describe()` wrappers) so the dashboard lists them in the order above with no category headers.
