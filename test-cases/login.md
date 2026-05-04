# Login Page Test Cases

Manual QA test cases for the XiTester login page (`/login`) and adjacent flows reachable from it (MFA challenge, OAuth start, forgot-password, sign-up link). Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/MfaChallenge.tsx`
- `frontend/src/pages/ForgotPassword.tsx`, `frontend/src/pages/ResetPassword.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/services/authApi.ts`
- `frontend/src/utils/guestRedirect.ts`

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
   - dev: `https://app-dev.ai.xitester.com/`
   - stage: `https://app-stage.ai.xitester.com/`
   - qa: `https://app-qa.ai.xitester.com/`
   - prod: `https://app.ai.xitester.com/`
- Login: `${TEST_USER_EMAIL}` (injected at runtime — see Test Data below)
- Password: `${TEST_USER_PASSWORD}` (injected at runtime — see Test Data below)
- API endpoint: `POST {API_BASE}/api/v1/auth/login`
- MFA endpoint: `POST {API_BASE}/api/v1/auth/mfa/verify-login`
- Viewport: `1920x1080` (desktop), `375x812` (mobile spot checks)

### Test Data

This is a **public repo**. Real test-account credentials never live in source. Each environment has its own GitHub Secret bundle (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, optionally `TEST_TOTP_SECRET`) under repo Settings → Environments. The dashboard environment selector dispatches the workflow to the matching environment, and `playwright/env/<env>.ts` reads the values from `process.env` at runtime. For local runs, copy `.env.local.example` (if present) to `.env.local` and fill in throwaway sandbox credentials.

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Capture evidence on failure: screenshot, console errors, failing network request, repro steps.
3. Record pass/fail, expected vs. actual, severity (Blocker / High / Medium / Low).
4. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).

## Common Selectors

| Element                | Selector                                                      |
|------------------------|---------------------------------------------------------------|
| Email input            | `#email`                                                      |
| Password input         | `#password`                                                   |
| Show/Hide password btn | `button[aria-label="Show password"]` / `"Hide password"`      |
| Remember me checkbox   | `input[type="checkbox"]` inside the form                      |
| Forgot password link   | `a[href="/forgot-password"]`                                  |
| Submit button          | `button[type="submit"]` (text: `"Login"` / `"Signing in…"`)   |
| Continue with Google   | `button` containing text `"Continue with Google"`             |
| Create account link    | `a` containing text `"Create account"`                        |
| TOTP input             | `#totp-code`                                                  |
| Recovery code input    | `#recovery-code`                                              |

---

## A. Form Validation (Client-Side)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-001 — Submit with both fields empty | Login / Validation (Client) | P0 | HTML5 `required` blocks submit. Native browser tooltip on Email field. No `POST /api/v1/auth/login` request fires. URL stays `/login`. | 1. Open `/login`.<br>2. Click "Login" without typing anything. |
| TC-LI-002 — Invalid email format | Login / Validation (Client) | P0 | HTML5 `type="email"` rejects `foo`. Native tooltip ("Please include an '@'..."). No login request fires. | 1. Open `/login`.<br>2. Type `foo` into Email.<br>3. Type `anything` into Password.<br>4. Click "Login". |
| TC-LI-003 — Email only, password empty | Login / Validation (Client) | P0 | HTML5 `required` tooltip on Password field. No login request fires. | 1. Open `/login`.<br>2. Type a valid email.<br>3. Leave Password empty.<br>4. Click "Login". |
| TC-LI-004 — Password only, email empty | Login / Validation (Client) | P0 | HTML5 `required` tooltip on Email field. No login request fires. | 1. Open `/login`.<br>2. Leave Email empty.<br>3. Type a password.<br>4. Click "Login". |
| TC-LI-005 — Whitespace-only credentials | Login / Validation (Client) | P1 | Browser email validator rejects whitespace email; OR backend returns 422 with `"Please enter a valid email address."` toast. URL stays `/login`. | 1. Open `/login`.<br>2. Type `"   "` (three spaces) into Email and Password.<br>3. Click "Login". |

## B. Happy Path & Redirect Logic

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-006 — Valid creds, single-org user | Login / Happy Path | P0 | `POST /api/v1/auth/login` returns 200 with `requires_mfa` absent/false. Submit briefly shows `"Signing in…"` and is disabled. App navigates to `result.redirectTo` if present, else `/settings/ai`. No login-success toast. | 1. Open `/login`.<br>2. Type valid email + password for a single-org user.<br>3. Click "Login". |
| TC-LI-007 — Valid creds, multi-org user | Login / Happy Path | P0 | Response indicates `organization_count > 1`. App navigates to `/organizations` (organization picker). | 1. Open `/login`.<br>2. Log in with multi-org credentials. |
| TC-LI-008 — Login with `?redirect=...` | Login / Happy Path | P1 | After login, app navigates to `/api-tester/collections`. The `?redirect` value is consumed (not present in destination URL). | 1. Open `/login?redirect=/api-tester/collections`.<br>2. Log in successfully. |
| TC-LI-009 — Guest flow with allowed redirect_url + prompt | Login / Guest Flow | P0 | `redirect_url` and `prompt` are stored in sessionStorage on mount. After login, browser navigates to `https://allowed.example.com/page?prompt=hello%20world`. Guest params are consumed afterwards. | 1. Open `/login?redirect_url=https://allowed.example.com/page&prompt=hello%20world`.<br>2. Log in successfully. |
| TC-LI-010 — Guest flow with disallowed redirect_url | Login / Guest Flow | P0 | `validateRedirectUrl()` rejects the URL. Falls through to default landing (`/settings/ai` or org picker), not the malicious URL. No external navigation. | 1. Open `/login?redirect_url=https://malicious.example.com/x`.<br>2. Log in successfully. |
| TC-LI-011 — Authenticated user visits /login | Login / Auth Redirect | P1 | The `isAuthenticated` `useEffect` immediately calls `navigate('/dashboard', { replace: true })` (or guest redirect if `redirect_url`/`prompt` present). No flash of the form. | 1. Sign in so a valid token sits in localStorage.<br>2. Navigate to `/login`. |
| TC-LI-012 — `?reset=success` query toast | Login / Notifications | P2 | Success toast `"Password has been reset. You can now sign in."`. URL is rewritten to `/login` (param cleared via `setSearchParams({}, { replace: true })`). | 1. Open `/login?reset=success`.<br>2. Observe toast and URL. |
| TC-LI-013 — `?verified=success` preserves guest params | Login / Notifications | P2 | Success toast `"Email verified. You can now sign in."`. `verified` is removed from URL but `redirect_url` and `prompt` remain so post-login redirect still works. | 1. Open `/login?verified=success&redirect_url=https://allowed.example.com/x&prompt=foo`.<br>2. Observe toast and URL. |

## C. Authentication Errors

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-014 — Wrong password | Login / Errors | P0 | API returns 401. Sonner error toast with API error message or fallback `"Login failed"`. URL stays `/login`. Submit re-enables. Email/password values preserved. | 1. Open `/login`.<br>2. Type a valid email and an incorrect password.<br>3. Click "Login". |
| TC-LI-015 — Non-existent email | Login / Errors | P0 | API returns 401. Same toast text as wrong-password (do-not-leak — identical message). | 1. Open `/login`.<br>2. Type `does-not-exist+random@example.com` and any password.<br>3. Click "Login". |
| TC-LI-016 — Backend 422 validation error | Login / Errors | P1 | API returns 422 with `{ "detail": [{"msg": "...", "loc": [...]}] }`. Toast shows the first `detail[0].msg` (e.g., `"Please enter a valid email address."`). | 1. Use DevTools to bypass HTML5 (remove `required`).<br>2. Submit Email = `not-an-email`.<br>3. Click "Login". |
| TC-LI-017 — Backend 429 rate limit | Login / Errors | P0 | Global API error toast: `"Request failed (429): <statusText>"`. URL stays `/login`. | 1. Submit incorrect creds repeatedly until 429 is observed (or override endpoint via DevTools). |
| TC-LI-018 — Network failure / offline | Login / Errors | P1 | Toast `"Network request failed: <error>"`. Submit re-enables. No navigation. | 1. DevTools → Network → Offline.<br>2. Submit valid-looking credentials. |
| TC-LI-019 — Backend 5xx | Login / Errors | P1 | Global API error toast (`"Request failed (500): ..."`). URL stays `/login`. | 1. Override the login endpoint via DevTools to return 500.<br>2. Submit credentials. |

## D. UI Affordances & Accessibility

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-020 — Password visibility toggle | Login / Password Visibility | P1 | First click: password `type` → `text`, characters visible, `aria-label` → `"Hide password"`, icon → EyeOff. Second click: reverts. | 1. Open `/login`.<br>2. Type `Xitester123!` into Password.<br>3. Click the eye icon.<br>4. Click it again. |
| TC-LI-021 — Eye toggle skipped in tab order | Login / Password Visibility | P2 | Tab order: email → password → remember-me checkbox → "Forgot password?" link → Login button → (Google button if visible) → "Create account" link. The eye button has `tabIndex={-1}` and is NOT focused during tabbing. | 1. Open `/login`.<br>2. Focus the email field.<br>3. Tab through the form. |
| TC-LI-022 — Remember me checkbox toggle | Login / A11y & UI | P2 | Visual state toggles. Note: the control is currently visual-only — does NOT change the login API request payload nor token persistence. (Document this caveat.) | 1. Open `/login`.<br>2. Click the "Remember me" checkbox.<br>3. Click it again. |
| TC-LI-023 — Loading state during submit | Login / Happy Path | P1 | Button text becomes `"Signing in…"` and is disabled. Email and password inputs are disabled. After response, state restores or navigation occurs. | 1. DevTools → Network → Slow 3G.<br>2. Submit valid credentials. |
| TC-LI-024 — Submit by pressing Enter | Login / Happy Path | P1 | Form submits exactly as if Login were clicked. Same network call, same redirect. | 1. Open `/login`.<br>2. Type valid email and password.<br>3. With focus in Password, press Enter. |
| TC-LI-025 — Forgot password link | Login / Forgot Password | P1 | Navigates to `/forgot-password`. Hard refresh on `/forgot-password` shows the page (no auth required). | 1. Open `/login`.<br>2. Click "Forgot password?".<br>3. Hard refresh the page. |
| TC-LI-026 — Create account link preserves guest params | Login / Sign Up Link | P1 | Navigates to `/signup?redirect_url=https://allowed.example.com/x&prompt=hi` — search params preserved. | 1. Open `/login?redirect_url=https://allowed.example.com/x&prompt=hi`.<br>2. Click "Create account". |
| TC-LI-027 — Create account link with no params | Login / Sign Up Link | P2 | Navigates to `/signup` exactly (no trailing `?`). | 1. Open `/login` (no query string).<br>2. Click "Create account". |
| TC-LI-028 — Screen-reader labels exist | Login / A11y & UI | P2 | Each input has `<label class="sr-only" for="...">` with text `"Email"` / `"Password"`. Inputs have matching `id`, `autoComplete="email"` / `"current-password"`. | 1. Open `/login`.<br>2. Inspect the email and password inputs in DevTools. |
| TC-LI-029 — Guest arrival forces dark theme once | Login / Theme | P2 | Page renders dark regardless of system preference (`forceThemeOnce('dark')`). `hasUserChosenTheme()` is still false after the visit. | 1. Clear `localStorage` so no theme preference exists.<br>2. Open `/login?redirect_url=https://allowed.example.com/x`. |
| TC-LI-030 — Returning user's theme preserved on guest arrival | Login / Theme | P2 | Page renders in the user's previously chosen theme (light), NOT forced dark. | 1. In a prior session, set theme to `light`.<br>2. Open `/login?redirect_url=https://allowed.example.com/x`. |

## E. MFA Challenge (`/login/mfa`)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-031 — Login response with `requires_mfa: true` | Login / MFA | P0 | API responds with `{ "requires_mfa": true, "mfa_token": "...", "methods": ["totp", ...] }`. App navigates to `/login/mfa`. Router state contains `{ mfa_token: "..." }`. | 1. Open `/login`.<br>2. Submit valid credentials for an MFA-enabled user.<br>3. Verify navigation and router state via React DevTools. |
| TC-LI-032 — Direct visit to /login/mfa without state | Login / MFA | P1 | Page handles missing `mfa_token` gracefully — redirect back to `/login` or show inline error. Must NOT crash with a blank page or stack trace. (Document actual behavior.) | 1. Open a fresh browser.<br>2. Navigate directly to `/login/mfa`. |
| TC-LI-033 — TOTP valid code | Login / MFA | P0 | `POST /api/v1/auth/mfa/verify-login` returns 200 with `LoginResponse`. App navigates to the same destination as a normal successful login (default `/settings/ai`, multi-org → `/organizations`). | 1. Reach `/login/mfa` via TC-LI-031.<br>2. Enter a valid current TOTP code.<br>3. Click "Verify". |
| TC-LI-034 — TOTP invalid code | Login / MFA | P0 | API returns 4xx. Inline error appears with the AlertCircle icon and an error message. Stays on `/login/mfa`. (Document if code field is preserved or cleared.) | 1. On `/login/mfa`, enter `000000`.<br>2. Click "Verify". |
| TC-LI-035 — Submit disabled while code empty | Login / MFA | P2 | The Verify button is disabled. Typing a single digit enables it. | 1. Land on `/login/mfa` with TOTP method active.<br>2. Leave `#totp-code` empty.<br>3. Type one digit. |
| TC-LI-036 — Toggle TOTP ↔ Recovery code | Login / MFA | P1 | Previously typed value is cleared when switching modes (no data leak). Visible field changes to `#recovery-code` then back to `#totp-code`. | 1. On `/login/mfa`, type `123` into TOTP.<br>2. Click toggle to Recovery code.<br>3. Switch back to TOTP. |
| TC-LI-037 — Recovery code valid | Login / MFA | P0 | 200 response. Login completes. Navigation as in TC-LI-033. The same recovery code submitted again later returns 4xx (single use). | 1. Switch to recovery code mode.<br>2. Enter a valid one-time recovery code.<br>3. Click "Verify". |
| TC-LI-038 — MFA loading state | Login / MFA | P2 | Verify button shows spinner and is disabled. Input field is disabled while in flight. | 1. DevTools → Network → Slow 3G.<br>2. Submit a code. |

## F. OAuth (Google)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-039 — Google button rendered conditionally | Login / OAuth | P1 | Divider with text `"or continue with"` is visible. "Continue with Google" button is visible above the "Create account" line. | 1. Ensure `GET /api/v1/auth/oauth/providers` returns `{"providers": ["google"]}`.<br>2. Load `/login`. |
| TC-LI-040 — Google button hidden when no providers | Login / OAuth | P1 | Google button is NOT in the DOM. The `"or continue with"` divider is also hidden. | 1. Mock `getAvailableProviders()` to return `{"providers": []}`.<br>2. Load `/login`. |
| TC-LI-041 — Click Google → redirect to authorization_url | Login / OAuth | P0 | `POST /api/v1/auth/oauth/google/login` is called. Response contains `{ "authorization_url": "https://accounts.google.com/..." }`. Browser does full-page navigation (`window.location.href = authorization_url`) to Google. | 1. Load `/login`.<br>2. Click "Continue with Google".<br>3. Inspect the network request. |
| TC-LI-042 — OAuth in guest flow forwards params | Login / OAuth | P1 | OAuth start request includes `signup_source` (defaults to `"guest_test"` if not provided), `redirect_url`, and `prompt`. | 1. Open `/login?redirect_url=https://allowed.example.com/x&prompt=hi`.<br>2. Click "Continue with Google".<br>3. Inspect request body. |
| TC-LI-043 — OAuth with explicit signup_source | Login / OAuth | P1 | OAuth start request includes `signup_source=blog_cta` (explicit value preserved, NOT replaced with `"guest_test"`). | 1. Open `/login?signup_source=blog_cta&redirect_url=https://allowed.example.com/x`.<br>2. Click "Continue with Google". |
| TC-LI-044 — OAuth start failure | Login / OAuth | P0 | Toast `"Failed to start google sign-in"` (or the API error message). Google button spinner stops; button re-enabled. No navigation away from `/login`. | 1. Override the OAuth start endpoint to return 500.<br>2. Click "Continue with Google". |
| TC-LI-045 — Email/password disabled while OAuth in flight | Login / OAuth | P2 | Google button shows spinner. Login button is disabled (`isLoading || oauthLoading !== null`). (Email/password text inputs are NOT explicitly disabled by `oauthLoading` — verify and document actual behavior.) | 1. Throttle Network to Slow 3G.<br>2. Click "Continue with Google".<br>3. Try to interact with email, password, and Login. |
| TC-LI-046 — GitHub button regression guard | Login / OAuth | P2 | ONLY "Continue with Google" is rendered. The GitHub branch is intentionally commented out in `Login.tsx`. Fail this case if a GitHub button appears. | 1. Mock backend to return `{"providers": ["google", "github"]}`.<br>2. Load `/login`. |

## G. Forgot Password (Adjacent Flow)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-047 — Forgot password valid email | Login / Forgot Password | P1 | `POST /api/v1/auth/forgot-password` returns 200/202. UI shows generic success message ("If the email exists, a reset link has been sent" or similar). | 1. From `/login`, click "Forgot password?".<br>2. Enter a valid registered email.<br>3. Submit. |
| TC-LI-048 — Forgot password invalid email format | Login / Forgot Password | P1 | Browser HTML5 validation OR backend 422 → toast `"Please enter a valid email address."`. | 1. On `/forgot-password`, enter `not-an-email`.<br>2. Submit. |
| TC-LI-049 — Forgot password unknown email (do-not-leak) | Login / Forgot Password | P0 | API returns 200/202 (or generic success) — does NOT reveal whether email exists. UI shows the same success message as TC-LI-047. | 1. On `/forgot-password`, submit `unknown+random@example.com`. |
| TC-LI-050 — Reset link opens reset page | Login / Forgot Password | P1 | Reset password form loads with two fields (new password, confirm password). If URL is missing the token, page shows `"Invalid or missing reset link. Please request a new password reset."`. | 1. Open the reset email.<br>2. Click the reset link.<br>3. Try also a URL with no token. |
| TC-LI-051 — Reset password rule enforcement | Login / Forgot Password | P0 | Each violation surfaces an inline validation error (or backend 422 toast). Submit is blocked. Rules: ≥8 chars, uppercase, lowercase, digit, no leading/trailing whitespace, matching confirmation. | 1. With a valid token, enter a new password violating each rule one at a time.<br>2. Attempt submit after each. |
| TC-LI-052 — Reset password success → redirect | Login / Forgot Password | P0 | API returns 200. App navigates to `/login?reset=success`. The reset-success toast surfaces (covered in TC-LI-012). | 1. With a valid token, enter a strong matching password.<br>2. Submit. |
| TC-LI-053 — Reset password expired/invalid token | Login / Forgot Password | P1 | API returns 4xx with an "invalid token" message. Toast surfaces the error. URL stays on the reset page. | 1. Open `/reset-password?reset_password_token=expired-or-bogus`.<br>2. Submit a valid new password. |

## H. Cross-Cutting / Regression

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LI-054 — Browser back after login | Login / Auth Redirect | P1 | The `isAuthenticated` effect on `/login` immediately bounces back to `/dashboard` (or guest redirect / current route). No flash of the login form. No double-render warnings in the console. | 1. Log in successfully (lands on `/settings/ai`).<br>2. Press the browser Back button. |
| TC-LI-055 — Reload /login while authenticated | Login / Auth Redirect | P1 | App immediately redirects (one nav, `replace: true`). No flash of the form. No console errors. | 1. While logged in, manually navigate to `/login` and refresh. |
| TC-LI-056 — Console-clean page load | Login / A11y & UI | P2 | Zero `console.error` entries. Zero CSP / mixed-content warnings. No 404s for `st-logo-name.svg`, `st-logo.png`. | 1. Open DevTools console.<br>2. Hard refresh `/login`. |
| TC-LI-057 — Mobile viewport (375x812) | Login / A11y & UI | P1 | Form fully usable: no horizontal scroll, no overlapping elements. Eye toggle aligned to the right of password. Logo + heading wrap reasonably. "Continue with Google" and "Create account" remain tappable (≥ 44px hit target). | 1. Resize viewport to 375x812 (iPhone X).<br>2. Open `/login`.<br>3. Verify layout and tap targets. |

---

## Conversion Notes

For later Playwright work:

- Stable selectors today: `#email`, `#password`, plus aria-labels on the eye button. Add `data-testid` if specs need finer scoping.
- Sonner toasts auto-dismiss; prefer `await expect(page.getByText(...)).toBeVisible()` over relying on the toast staying around. Scope with `page.locator('[data-sonner-toaster]')` if needed.
- Network mocking: `page.route('**/api/v1/auth/login', ...)` to drive TC-LI-014 to TC-LI-019, TC-LI-032, TC-LI-034, TC-LI-044, TC-LI-046, TC-LI-053 deterministically.
- For redirect tests (`window.location.href = authorization_url`) intercept the OAuth start response in `page.route` and assert the `authorization_url` in the response body rather than waiting for a real Google redirect.
- For MFA cases, seed a TOTP-enabled user in a test fixture and use a TOTP library (e.g., `otplib`) in the spec to compute the current code from the seed.
