# Logout Test Cases

Manual QA test cases for the XiTester logout flow. Two user-driven scenarios: the explicit click-through-the-menu logout, and the implicit auth-guard redirect for any protected route after logout. Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `frontend/src/components/layout/TopBar.tsx` (UserMenu DropdownMenu)
- `frontend/src/contexts/AuthContext.tsx` (`logout()` callback)
- `frontend/src/services/authApi.ts` (`POST /api/v1/auth/logout`)

## Environment

- URL: per-environment (see `playwright/env/<env>.ts`)
- Login: `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` (per-env GitHub Secrets)
- Tests start authenticated via `auth.setup` storageState.
- Viewport: `1920x1080`

## Common Selectors

| Element                 | Selector                                                 |
|-------------------------|----------------------------------------------------------|
| User menu trigger       | `header button[aria-haspopup="menu"]` (last on the right)|
| Log out menu item       | `getByRole('menuitem', { name: /^Log out$/i })`          |
| Login email input       | `#email` (target page after logout)                      |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-LO-001 — Logout via user menu redirects to /login | Logout | High | After clicking the avatar dropdown → "Log out", the SPA fires `POST /api/v1/auth/logout` (best-effort), clears the auth cookie/localStorage, and navigates to `/login`. The login form (`#email`) becomes visible again. | 1. Land on any authed page (`/dashboard`).<br>2. Click the user menu trigger in the top bar.<br>3. Click "Log out".<br>4. Verify the URL becomes `/login`.<br>5. Verify the login form is visible. |
| TC-LO-002 — Protected routes redirect to /login after logout | Logout | High | After logout, navigating directly to a protected URL (e.g. `/dashboard`) is bounced back to `/login` by the SPA's auth guard. Confirms the session is fully terminated, not just the URL. | 1. Logout via the user menu (as in TC-LO-001).<br>2. Type `/dashboard` directly into the address bar (or `page.goto('/dashboard')`).<br>3. Verify the SPA redirects back to `/login`. |

## Conversion Notes

- The user menu trigger is a Radix shadcn DropdownMenu with `aria-haspopup="menu"`. The topbar can carry several such triggers (org switcher etc.); the user menu is the rightmost one — locator picks `.last()`.
- The dropdown items render in a portal with `role="menuitem"`. Locating by accessible name (case-insensitive `^Log out$`) is the most stable approach.
- No toast is shown on logout; the URL change is the success signal.
