# Login Page Test Cases

Manual QA test cases for the XiTester login page (`/login`). Covers the everyday user flow only — no MFA, OAuth, redirect-URL edge cases, or server-error scenarios. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Login.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/services/authApi.ts`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
   - dev: `https://app-dev.ai.xitester.com/`
   - stage: `https://app-stage.ai.xitester.com/`
   - qa: `https://app-qa.ai.xitester.com/`
   - prod: `https://app.ai.xitester.com/`
- Login: `${TEST_USER_EMAIL}` (injected at runtime — see Test Data below)
- Password: `${TEST_USER_PASSWORD}` (injected at runtime — see Test Data below)
- API endpoint: `POST {API_BASE}/api/v1/auth/login`
- Viewport: `1920x1080`

### Test Data

This is a **public repo**. Real test-account credentials never live in source. Each environment has its own GitHub Secret bundle (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`) under repo Settings → Environments. The dashboard environment selector dispatches the workflow to the matching environment, and `playwright/env/<env>.ts` reads the values from `process.env` at runtime.

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Capture evidence on failure: screenshot, console errors, repro steps.
3. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).

## Common Selectors

| Element                | Selector                                                      |
|------------------------|---------------------------------------------------------------|
| Email input            | `#email`                                                      |
| Password input         | `#password`                                                   |
| Show/Hide password btn | `button[aria-label="Show password"]` / `"Hide password"`      |
| Submit button          | `button[type="submit"]` (text: `"Login"` / `"Signing in…"`)   |
| Forgot password link   | `a[href="/forgot-password"]`                                  |
| Create account link    | `a` containing text `"Create account"`                        |

---

## A. Happy Path

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-001 — Successful login with valid credentials | Login / Happy Path | P0 | `POST /api/v1/auth/login` returns 200. Submit briefly shows `"Signing in…"` and is disabled. App navigates away from `/login` to the user's landing page. | 1. Open `/login`.<br>2. Type the test user's email into Email.<br>3. Type the test user's password into Password.<br>4. Click "Login".<br>5. Wait for navigation. |

## B. Error Handling

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-002 — Wrong password shows error | Login / Errors | P0 | API returns 401. Sonner error toast appears. URL stays `/login`. Submit button re-enables. Email and password values are preserved. | 1. Open `/login`.<br>2. Type a valid email.<br>3. Type an incorrect password.<br>4. Click "Login".<br>5. Observe the error toast. |
| TC-LI-003 — Empty fields blocked by browser validation | Login / Validation | P0 | HTML5 `required` blocks submit. Native browser tooltip appears on the Email field. No `POST /api/v1/auth/login` request fires. URL stays `/login`. | 1. Open `/login`.<br>2. Click "Login" without typing anything. |

## C. UI Affordances

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-004 — Password visibility toggle | Login / UI | P1 | First click: password input `type` becomes `text`, characters visible, button `aria-label` flips to `"Hide password"`. Second click: reverts to masked. | 1. Open `/login`.<br>2. Type any string into Password.<br>3. Click the eye icon next to the password field.<br>4. Click it again. |

## D. Adjacent Links

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-005 — Forgot password link navigates correctly | Login / Navigation | P1 | Clicking the "Forgot password?" link navigates to `/forgot-password`. The destination page renders without errors. | 1. Open `/login`.<br>2. Click "Forgot password?". |
| TC-LI-006 — Create account link navigates correctly | Login / Navigation | P1 | Clicking the "Create account" link navigates to `/signup`. The destination page renders without errors. | 1. Open `/login`.<br>2. Click "Create account". |

---

## Conversion Notes

Selectors used by the Playwright suite live in `playwright/tests/login.spec.ts`. Each test asserts only the user-visible behaviour described above — no per-network-request mocks, no edge-case coverage. Add scenarios here only when a real user incident demands the regression guard.
