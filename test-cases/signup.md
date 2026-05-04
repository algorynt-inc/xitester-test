# Signup Page Test Cases

Manual QA test cases for the XiTester signup page (`/signup`) and the OAuth start flow reachable from it. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/pages/Signup.tsx`
- `frontend/src/services/authApi.ts` (`signup`, `startOAuthLogin`, `getAvailableProviders`)
- `frontend/src/utils/guestRedirect.ts` (`storeGuestParams`, `validateRedirectUrl`, `consumeGuestRedirect`, `hasGuestParams`)
- `frontend/src/utils/themeStorage.ts` (`hasUserChosenTheme`)
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/contexts/ThemeContext.tsx` (`forceThemeOnce`)
- `backend/app/routers/auth.py` (`/signup` endpoint, password complexity, account-enumeration defense, rate limit)
- `backend/app/schemas/auth.py` (`SignupRequest`, `SignupResponse`)

## Environment

- URL: `https://app-dev.ai.xitester.com/signup`
- Strong test password: `Xitester123!`
- Disposable email pattern: `qa+signup-<unique>@xitester.com`
- API endpoints:
  - `POST {API_BASE}/api/v1/auth/signup`
  - `GET  {API_BASE}/api/v1/auth/oauth/providers`
  - `POST {API_BASE}/api/v1/auth/oauth/google/login`
- Viewport: `1920x1080` (desktop), `375x812` (mobile spot checks)

## Global Rules

1. Each test case uses a fresh, unique browser session. Clear `localStorage` and `sessionStorage` before each.
2. Use a unique email per signup attempt (timestamp suffix) so account-enumeration cases stay deterministic.
3. Capture evidence on failure: screenshot, console errors, failing network request, repro steps.
4. Record pass/fail, expected vs. actual, severity (Blocker / High / Medium / Low).
5. Toast assertions target `body > [data-sonner-toaster]` (Sonner container).
6. The post-success redirect fires after ~3000 ms — allow up to 4 s before asserting URL change.

## Common Selectors

| Element                     | Selector                                                                  |
|-----------------------------|---------------------------------------------------------------------------|
| Name input                  | `#name`                                                                   |
| Email input                 | `#email`                                                                  |
| Password input              | `#password`                                                               |
| Confirm Password input      | `#confirmPassword`                                                        |
| Show/Hide password btn      | `button[aria-label="Show password"]` / `"Hide password"`                  |
| Show/Hide confirm pwd btn   | `button[aria-label="Show confirm password"]` / `"Hide confirm password"`  |
| Submit button               | `button[type="submit"]` (text: `"Create account"` / `"Creating account…"`)|
| Sign up with Google         | `button` containing text `"Sign up with Google"`                          |
| Sign in link                | `a` containing text `"Sign in"`                                           |

---

## A. Form Validation (Client-Side)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-001 — Submit with all fields empty | Signup / Validation (Client) | P0 | HTML5 `required` on Name blocks submit. Native browser tooltip ("Please fill out this field") appears. No `POST /api/v1/auth/signup` request fires. URL stays `/signup`. | 1. Open `/signup` in a fresh session.<br>2. Do not type anything.<br>3. Click "Create account". |
| TC-SU-002 — Empty Email | Signup / Validation (Client) | P0 | HTML5 `required` on Email blocks submit. Native tooltip on Email field. No API call. | 1. Open `/signup`.<br>2. Type `Test User` into Name.<br>3. Leave Email, Password, Confirm Password empty.<br>4. Click "Create account". |
| TC-SU-003 — Invalid email format | Signup / Validation (Client) | P0 | HTML5 `type="email"` rejects `foo`, `foo@`, `foo@bar`. Native browser email-validation tooltip appears. No API call. | 1. Open `/signup`.<br>2. Type `Test User` into Name.<br>3. Type `foo` into Email (repeat with `foo@`, `foo@bar`).<br>4. Type `Xitester123!` into Password and Confirm Password.<br>5. Click "Create account". |
| TC-SU-004 — Empty Password | Signup / Validation (Client) | P0 | HTML5 `required` on Password blocks submit. Native tooltip. No API call. | 1. Open `/signup`.<br>2. Fill Name and a valid Email.<br>3. Leave Password empty; type anything into Confirm Password.<br>4. Click "Create account". |
| TC-SU-005 — Empty Confirm Password | Signup / Validation (Client) | P0 | HTML5 `required` on Confirm Password blocks submit. No API call. | 1. Open `/signup`.<br>2. Fill Name, Email, and Password (`Xitester123!`).<br>3. Leave Confirm Password empty.<br>4. Click "Create account". |
| TC-SU-006 — Mismatched passwords | Signup / Validation (Client) | P0 | Sonner error toast `"Passwords do not match"` (Signup.tsx:121-124). No API call. URL stays `/signup`. Submit button re-enables. Field values preserved. | 1. Open `/signup`.<br>2. Fill Name and a unique valid Email.<br>3. Type `Xitester123!` into Password.<br>4. Type `Xitester456!` into Confirm Password.<br>5. Click "Create account". |
| TC-SU-007 — Password shorter than 8 chars | Signup / Validation (Client) | P0 | Sonner error toast `"Password must be at least 8 characters"` (Signup.tsx:126-129). No API call. URL stays `/signup`. | 1. Open `/signup`.<br>2. Fill Name and a valid Email.<br>3. Type `Abc1!` into both password fields.<br>4. Click "Create account". |
| TC-SU-008 — Whitespace-only Name | Signup / Validation (Client) | P1 | Either HTML5 blocks (typed spaces still satisfy `required`), or backend returns 422 for the name validator after submit. Toast surfaces `detail[0].msg`. URL stays `/signup`. | 1. Open `/signup`.<br>2. Set Name to `"   "` (three spaces — paste or set via DevTools).<br>3. Type a valid Email and a strong matching password pair.<br>4. Click "Create account". |

## B. Server-Side Validation (Password & Field Rules)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-009 — Password missing uppercase | Signup / Validation (Server) | P0 | Frontend checks pass (length + match). Backend returns 422 for `_validate_password_complexity`. Toast surfaces backend message (e.g., "must contain at least one uppercase letter"). URL stays `/signup`; submit re-enables. | 1. Open `/signup`.<br>2. Fill Name and unique Email.<br>3. Type `abcdefg1` into both password fields.<br>4. Click "Create account". |
| TC-SU-010 — Password missing lowercase | Signup / Validation (Server) | P0 | Backend 422 (lowercase required). Toast surfaces backend message. | 1. Open `/signup`.<br>2. Fill Name and Email.<br>3. Type `ABCDEFG1` into both password fields.<br>4. Click "Create account". |
| TC-SU-011 — Password missing digit | Signup / Validation (Server) | P0 | Backend 422 (digit required). Toast surfaces backend message. | 1. Open `/signup`.<br>2. Fill Name and Email.<br>3. Type `Abcdefgh` into both password fields.<br>4. Click "Create account". |
| TC-SU-012 — Password with surrounding whitespace | Signup / Validation (Server) | P0 | Backend 422 (whitespace rule). Toast surfaces backend message. | 1. Open `/signup`.<br>2. Fill Name and Email.<br>3. Type `" Xitester123!"` (leading space) into both password fields.<br>4. Click "Create account". |
| TC-SU-013 — Password longer than 128 chars | Signup / Validation (Server) | P1 | Backend 422 (`max_length=128`). Toast surfaces backend message. | 1. Open `/signup`.<br>2. Fill Name and Email.<br>3. Paste a 129-character mixed-case+digit password into both password fields.<br>4. Click "Create account". |
| TC-SU-014 — Name longer than 256 chars | Signup / Validation (Server) | P1 | Backend 422 (`max_length=256`). Toast surfaces backend message. Bypass any frontend `maxLength` if present. | 1. Open `/signup`.<br>2. Set Name to a 300-character string (paste).<br>3. Fill Email and matching strong passwords.<br>4. Click "Create account". |
| TC-SU-015 — Email with single-char TLD | Signup / Validation (Server) | P1 | Backend regex requires `{2,}`-letter TLD. Returns 422 for `a@b.c`. Toast surfaces `detail[0].msg`. | 1. Open `/signup`.<br>2. Fill Name and matching strong passwords.<br>3. Type `a@b.c` into Email.<br>4. Bypass HTML5 if it accepts the value (DevTools).<br>5. Click "Create account". |

## C. Happy Path & Success States

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-016 — Valid signup happy path | Signup / Happy Path | P0 | `POST /api/v1/auth/signup` returns 201 with generic `SignupResponse` (`user: null`, `message: <generic>`). Sonner success toast displays the message. All four inputs disable. Submit button text becomes `"Creating account…"`. After ~3 s, app navigates to `/` (or `?redirect=` value) via `replace: true`. | 1. Open `/signup`.<br>2. Type `Test User` into Name.<br>3. Type a unique email (e.g., `qa+signup-1234@xitester.com`).<br>4. Type `Xitester123!` into both password fields.<br>5. Click "Create account".<br>6. Wait up to 4 s and observe redirect. |
| TC-SU-017 — Loading state during submit (Slow 3G) | Signup / Happy Path | P1 | While the request is in flight: submit button disabled with text `"Creating account…"`; all four inputs disabled; eye toggles still clickable (not disabled by `isLoading`). | 1. DevTools → Network → throttle to Slow 3G.<br>2. Open `/signup`.<br>3. Fill all fields with valid data.<br>4. Click "Create account".<br>5. Observe button text and disabled state during the in-flight request. |
| TC-SU-018 — Inputs stay disabled after success | Signup / Happy Path | P1 | After 201 response, `success = true`. All four inputs and the submit button remain disabled (`disabled={isLoading || success}`). Eye toggles remain clickable. The 3-s redirect still occurs. | 1. Complete TC-SU-016 happy path.<br>2. Before the 3 s redirect fires, attempt to click any input or the submit button.<br>3. Observe disabled state. |
| TC-SU-019 — Verification email delivered | Signup / Happy Path | P0 | One email arrives at the submitted address with subject from the verification template, body containing a verification link of the form `{APP_BASE}/verify-email?token=<20-char>`. Link is not yet expired. Requires a working SMTP/inbox sink. | 1. Complete TC-SU-016 with a fresh unique email.<br>2. Within ~1 minute, open the inbox for that email.<br>3. Verify subject and body. |
| TC-SU-020 — Submit by pressing Enter | Signup / Happy Path | P1 | Form submits identically to clicking "Create account" — same network call, same success behavior. | 1. Open `/signup`.<br>2. Fill Name, Email, Password.<br>3. Type `Xitester123!` into Confirm Password.<br>4. With focus still in Confirm Password, press Enter.<br>5. Observe submit and redirect. |

## D. Account-Enumeration Defense

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-021 — Signup with existing email | Signup / Account Enumeration | P0 | Backend returns the **same generic 201 response** as a brand-new signup (no 409 Conflict). Frontend shows the same success toast. **No new verification email** is sent for the existing account. Defense is documented in `backend/app/routers/auth.py:140-152`. | 1. Ensure an existing verified account uses email `existing@xitester.com`.<br>2. Open `/signup` in a fresh session.<br>3. Fill Name and a strong matching password pair.<br>4. Type `existing@xitester.com` into Email.<br>5. Click "Create account".<br>6. Verify response, toast, and inbox (no new email for the existing account). |

## E. Password Visibility Toggles

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-022 — Eye toggle on Password | Signup / Password Visibility | P1 | Clicking Password's eye icon toggles `type` between `password` and `text`. Icon swaps between Eye and EyeOff. `aria-label` swaps between `"Show password"` and `"Hide password"`. Confirm Password is NOT affected. | 1. Open `/signup`.<br>2. Type `Xitester123!` into Password.<br>3. Click the eye icon next to Password.<br>4. Click it again.<br>5. Observe input `type`, icon, and `aria-label` after each click. |
| TC-SU-023 — Eye toggle on Confirm Password (independent) | Signup / Password Visibility | P1 | Confirm Password toggles independently of Password. `aria-label` swaps between `"Show confirm password"` / `"Hide confirm password"`. Each field has its own `useState` hook. | 1. Open `/signup`.<br>2. Type `Xitester123!` into Password and Confirm Password.<br>3. Click the eye icon next to Confirm Password.<br>4. Verify Password remains masked and unchanged. |
| TC-SU-024 — Eye toggles skipped in tab order | Signup / Password Visibility | P2 | Both eye buttons have `tabIndex={-1}` (Signup.tsx:222, 245) — they are skipped during keyboard tabbing. | 1. Open `/signup`.<br>2. Focus the Name field.<br>3. Press Tab repeatedly through the form.<br>4. Verify the focus ring never lands on an eye toggle. |

## F. OAuth Signup (Google)

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-025 — Google button rendered when provider available | Signup / OAuth | P1 | When `getAvailableProviders` returns `["google"]`: divider with text `"or sign up with"` is visible; "Sign up with Google" button is visible above the "Already have an account?" line. | 1. Mock `GET /api/v1/auth/oauth/providers` to return `{"providers": ["google"]}` (or use real backend).<br>2. Open `/signup` and wait for the providers fetch to complete.<br>3. Verify divider + Google button. |
| TC-SU-026 — Google button hidden when no providers | Signup / OAuth | P1 | When `getAvailableProviders` returns `{"providers": []}`: divider and Google button are NOT in the DOM (the `providers.length > 0` block in Signup.tsx:261 is hidden). | 1. Use DevTools network override to make the providers endpoint return `{"providers": []}`.<br>2. Open `/signup`.<br>3. Verify divider + Google button are absent. |
| TC-SU-027 — Click Google → full-page navigate | Signup / OAuth | P0 | `authApi.startOAuthLogin('google', ...)` is called; response contains `{ "authorization_url": "https://accounts.google.com/..." }`. Browser does a full-page navigation (`window.location.href = authorization_url`). | 1. Open `/signup` (with Google provider available).<br>2. Click "Sign up with Google".<br>3. Observe network request to OAuth start endpoint.<br>4. Verify browser navigates to the Google authorization URL. |
| TC-SU-028 — OAuth in flight: spinner + disabled buttons | Signup / OAuth | P1 | While OAuth start is in flight: spinner replaces Google logo; Google button is disabled (`oauthLoading === "google"`); submit button is disabled (note: only `isLoading || success` directly disables submit per Signup.tsx:256 — verify and document). Other OAuth buttons (if present) disabled by `oauthLoading !== null`. | 1. Throttle Network to Slow 3G.<br>2. Open `/signup`.<br>3. Click "Sign up with Google".<br>4. While the request is pending, observe button states. |
| TC-SU-029 — OAuth start failure | Signup / OAuth | P0 | Sonner error toast `"Failed to start google sign-up"` (or API error message). Spinner clears; Google button re-enables. URL stays `/signup`. | 1. Override `POST /api/v1/auth/oauth/google/login` to return 500 (DevTools).<br>2. Open `/signup`.<br>3. Click "Sign up with Google".<br>4. Observe toast and button state. |
| TC-SU-030 — GitHub regression guard | Signup / OAuth | P2 | Even when backend returns `["google", "github"]`, ONLY the Google button renders. The GitHub branch is intentionally commented out in Signup.tsx:294-310. Fail this case if a GitHub button appears. | 1. Mock `getAvailableProviders` to return `{"providers": ["google", "github"]}`.<br>2. Open `/signup`.<br>3. Verify only "Sign up with Google" is rendered. |

## G. Guest-Flow URL Params

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-031 — Guest params stored on mount | Signup / Guest Flow | P1 | `storeGuestParams(redirect_url, prompt)` writes both to sessionStorage on mount (Signup.tsx:57-66). `isGuestFlow.current` is true. The form remains interactable. | 1. Open `/signup?redirect_url=https://allowed.example.com/foo&prompt=hi` in a fresh session.<br>2. DevTools → Application → Session Storage → verify both keys.<br>3. Confirm form is interactable. |
| TC-SU-032 — Guest signup forwards source/redirect/prompt | Signup / Guest Flow | P0 | `POST /api/v1/auth/signup` body includes `signup_source: "guest_test"` (default), `redirect_url: "https://allowed.example.com/foo"`, `prompt: "hi"`. 201 response. Success toast appears. | 1. Open `/signup?redirect_url=https://allowed.example.com/foo&prompt=hi`.<br>2. Fill Name, unique Email, matching strong passwords.<br>3. Click "Create account".<br>4. Inspect the request body in the Network panel. |
| TC-SU-033 — Explicit signup_source preserved | Signup / Guest Flow | P1 | Request body includes `signup_source: "guest_api_chain"` (explicit, NOT the default `"guest_test"`). `redirect_url` and `prompt` also forwarded. | 1. Open `/signup?signup_source=guest_api_chain&redirect_url=https://allowed.example.com/foo&prompt=hi`.<br>2. Fill all fields with valid data.<br>3. Click "Create account".<br>4. Inspect request body. |
| TC-SU-034 — OAuth in guest flow forwards same params | Signup / Guest Flow | P1 | OAuth start request includes `signup_source=blog_cta`, `redirect_url=https://allowed.example.com/foo`, `prompt=hi` (Signup.tsx:94-110). Browser navigates to Google authorization URL. | 1. Open `/signup?signup_source=blog_cta&redirect_url=https://allowed.example.com/foo&prompt=hi`.<br>2. Click "Sign up with Google".<br>3. Inspect the OAuth start request body / query params. |
| TC-SU-035 — Disallowed redirect_url falls through | Signup / Guest Flow | P0 | `validateRedirectUrl()` rejects malicious URLs. After auth, app falls back to stored guest redirect (`consumeGuestRedirect()`) or `/dashboard`. No external navigation to the malicious host. | 1. Open `/signup?redirect_url=https://malicious.example.com/x&prompt=hi`.<br>2. Complete a successful signup, OR be already authenticated and revisit `/signup`.<br>3. Verify final URL is not `malicious.example.com`. |

## H. Theme Forcing

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-036 — Guest arrival forces dark theme once | Signup / Theme | P2 | When `hasUserChosenTheme()` is false and guest params are present, page renders dark via `forceThemeOnce('dark')` (Signup.tsx:25-33). `hasUserChosenTheme()` remains false (one-shot, not persisted as a user choice). | 1. Clear `localStorage` so no theme preference exists.<br>2. Open `/signup?redirect_url=https://allowed.example.com/foo`.<br>3. Verify page renders dark regardless of system preference.<br>4. Verify `hasUserChosenTheme()` is still false. |
| TC-SU-037 — Returning user's chosen theme preserved | Signup / Theme | P2 | When `hasUserChosenTheme()` is true, the guard `if (isGuestArrival && !hasUserChosenTheme())` fails. `forceThemeOnce` is NOT invoked. Page renders in the user's chosen theme. | 1. In a prior session, set theme to `light`.<br>2. Open `/signup?redirect_url=https://allowed.example.com/foo`.<br>3. Verify page renders in `light` theme. |

## I. Already-Authenticated Redirect

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-038 — Authenticated user visits /signup | Signup / Auth Redirect | P1 | The `useEffect` watching `isAuthenticated` (Signup.tsx:36-52) immediately calls `navigate('/dashboard', { replace: true })`. The signup form is not interactable. No flash of the form (or only a single frame). | 1. Sign in successfully so a valid token sits in localStorage.<br>2. Navigate to `/signup`.<br>3. Verify immediate redirect to `/dashboard`. |
| TC-SU-039 — Authenticated user with allowed redirect_url | Signup / Auth Redirect | P1 | App navigates to `https://allowed.example.com/foo?prompt=hi`. Prompt is appended via `encodeURIComponent`. Replace navigation — back button does NOT return to `/signup`. | 1. Sign in.<br>2. Navigate to `/signup?redirect_url=https://allowed.example.com/foo&prompt=hi`.<br>3. Verify URL after redirect.<br>4. Press browser Back; verify it does not land on `/signup`. |
| TC-SU-040 — Authenticated user with disallowed redirect_url | Signup / Auth Redirect | P1 | `validateRedirectUrl()` rejects. App falls back to `consumeGuestRedirect()` (if a stored value exists) or `/dashboard`. No navigation to the malicious host. | 1. Sign in.<br>2. Navigate to `/signup?redirect_url=https://malicious.example.com/x`.<br>3. Verify final URL is `/dashboard` (or stored guest redirect). |

## J. Authentication Errors at Submit

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-041 — Backend 429 rate limit | Signup / Errors | P0 | Sonner error toast surfaces the rate-limit message (e.g., `"Too many signup attempts. Please try again later."`). URL stays `/signup`. Submit button re-enables. Inputs re-enable via `finally { setIsLoading(false) }` (Signup.tsx:156-158). | 1. Open `/signup` in a fresh session.<br>2. Submit signups in quick succession (or override the endpoint to return 429).<br>3. Observe toast and button state. |
| TC-SU-042 — Network failure / offline | Signup / Errors | P1 | Sonner error toast: `"Network request failed: ..."` (global API error handler). Submit re-enables. No navigation. | 1. DevTools → Network → Offline.<br>2. Open `/signup`.<br>3. Fill all fields with valid data.<br>4. Click "Create account". |
| TC-SU-043 — Backend 5xx | Signup / Errors | P1 | Sonner error toast surfaces global API error (`"Request failed (500): ..."` or fallback `"Signup failed"`). URL stays `/signup`. Submit re-enables. | 1. Override `POST /api/v1/auth/signup` to return 500.<br>2. Submit a valid signup.<br>3. Observe toast and button state. |

## K. UI Affordances & Accessibility

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-SU-044 — Tab order | Signup / A11y & UI | P1 | Tab order: Name → Email → Password → Confirm Password → "Create account" → (Google button if visible) → "Sign in" link. Eye toggles skipped (`tabIndex={-1}`). | 1. Open `/signup`.<br>2. Focus Name.<br>3. Press Tab repeatedly through the form.<br>4. Record each focused element. |
| TC-SU-045 — Screen-reader labels | Signup / A11y & UI | P2 | Each of `#name`, `#email`, `#password`, `#confirmPassword` has a corresponding `<label class="sr-only" for="...">` with text `"Name"` / `"Email"` / `"Password"` / `"Confirm Password"`. `autoComplete` values: `name`, `email`, `new-password`, `new-password`. | 1. Open `/signup`.<br>2. Inspect each input element in DevTools.<br>3. Verify the `<label>` and `autoComplete` attribute. |
| TC-SU-046 — Eye toggle aria-label reflects state | Signup / A11y & UI | P2 | When password is hidden (default): `aria-label="Show password"`. When visible: `aria-label="Hide password"`. Same pattern on Confirm Password (`"Show confirm password"` / `"Hide confirm password"`). | 1. Open `/signup`.<br>2. Click the Password eye toggle.<br>3. Inspect the button's `aria-label`.<br>4. Click it again; inspect again. |
| TC-SU-047 — "Sign in" link preserves query string | Signup / A11y & UI | P1 | At `/signup?redirect_url=...&prompt=...`, "Sign in" navigates to `/login?redirect_url=...&prompt=...` (params preserved verbatim, Signup.tsx:317). At `/signup` with no params, navigates to `/login` exactly (no trailing `?`). | 1. Open `/signup?redirect_url=https://allowed.example.com/foo&prompt=hi`.<br>2. Click "Sign in"; verify destination URL.<br>3. Open `/signup` (no params); click "Sign in"; verify destination is `/login` exactly. |
| TC-SU-048 — Console-clean page load | Signup / A11y & UI | P2 | Zero `console.error` entries. Zero CSP / mixed-content warnings on dev/staging. No 404s for `st-logo.png` or `st-logo-name.svg` (Signup.tsx:13-14). | 1. Open DevTools Console.<br>2. Hard refresh `/signup`.<br>3. Inspect Console and Network tabs. |
| TC-SU-049 — Mobile viewport (375x812) | Signup / A11y & UI | P1 | Form fully usable: no horizontal scroll, no overlapping elements. Eye toggles aligned to right of their inputs and tappable. Logo + heading wrap reasonably. "Sign up with Google" and "Sign in" are ≥ 44px hit targets. | 1. Resize viewport to 375x812 (iPhone X).<br>2. Open `/signup`.<br>3. Verify layout, tap targets, and absence of overflow. |
| TC-SU-050 — Cleanup of 3-second redirect on unmount | Signup / A11y & UI | P2 | The cleanup `useEffect` (Signup.tsx:86-92) calls `clearTimeout(redirectTimeoutRef.current)`. No `"Can't perform a React state update on an unmounted component"` warning. No surprise navigation to `/` or stale redirect 3 s later. | 1. Complete TC-SU-016 happy path.<br>2. Within ~1 s of seeing the success toast, click "Sign in" or press browser Back.<br>3. Watch the Console for warnings.<br>4. Verify no surprise navigation 3 s later. |

---

## Conversion Notes

For later Playwright work:

- Stable selectors today: `#name`, `#email`, `#password`, `#confirmPassword`, plus aria-labels on eye buttons. Add `data-testid` if specs need finer scoping.
- Sonner toasts auto-dismiss; prefer `await expect(page.getByText('Passwords do not match')).toBeVisible()` and avoid relying on the toast staying around.
- For deterministic backend behavior, mock `POST **/api/v1/auth/signup` per test case:
  - TC-SU-009 to TC-SU-015: respond with 422 + scenario-specific `detail` array.
  - TC-SU-021: respond with 201 + generic message.
  - TC-SU-041 to TC-SU-043: respond with 429 / network drop / 500.
- For OAuth test cases, mock `POST **/api/v1/auth/oauth/google/login` to return `{ "authorization_url": "<sentinel-url>" }` and assert `page.url()` after the navigation, rather than waiting for a real Google round-trip.
- For guest-flow tests, seed sessionStorage in `beforeEach` to mirror real arrivals and assert payload shape via `page.waitForRequest`.
- For email-delivery (TC-SU-019), use a sandbox SMTP (e.g., MailHog) in the dev stack and assert via its HTTP API.
