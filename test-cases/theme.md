# Theme Test Cases

Manual QA test cases for the SUT's theme toggle (light ↔ dark). The toggle lives inside the user-menu dropdown in the top bar. Persistence is via `localStorage.theme-preference_v1` and the `dark` class on `<html>`. Format follows `test-cases/PATTERN.md`.

## Source of Truth

- `frontend/src/contexts/ThemeContext.tsx`
- `frontend/src/components/layout/TopBar.tsx` (UserMenu lines 307-366; theme toggle DropdownMenuItem 350-353)
- `frontend/src/utils/themeStorage.ts`

## Environment

- Auth: storageState (`auth.setup`)
- Tests run **serially** (`test.describe.configure({ mode: 'serial' })`) so a flip in TC-042 doesn't race a flip in TC-043.

## Common Selectors

| Element                         | Selector                                                           |
|---------------------------------|--------------------------------------------------------------------|
| User-menu trigger               | `header button[aria-haspopup="menu"]:visible` (last)               |
| Theme menu item — to dark       | `getByRole('menuitem', { name: 'Dark Mode' })` (label flips)       |
| Theme menu item — to light      | `getByRole('menuitem', { name: 'Light Mode' })`                    |
| Theme detection                 | `document.documentElement.classList.contains('dark')`              |

## Test Cases

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-042 — Verify theme switch from light to dark | Theme | Medium | After ensuring the page is in light mode, opening the user menu and clicking "Dark Mode" flips `<html>` to have the `dark` class. Refreshing the page keeps the dark class — persistence works. Cleanup reverts to light so TC-043 starts clean. | 1. Open `/dashboard` (any authed page).<br>2. Ensure the page is in light mode.<br>3. Click the user-menu trigger; click "Dark Mode".<br>4. Verify `<html>` has the `dark` class.<br>5. Reload the page.<br>6. Verify `dark` class is still present. |
| TC-043 — Verify theme switch from dark to light | Theme | Medium | Mirror of TC-042 in the other direction. Ensures the toggle is bidirectional and persistence holds for light mode too. | 1. Open `/dashboard`.<br>2. Ensure the page is in dark mode.<br>3. Click the user-menu trigger; click "Light Mode".<br>4. Verify `<html>` does NOT have the `dark` class.<br>5. Reload the page.<br>6. Verify the page is still in light mode. |

## Conversion Notes

- The user-menu trigger is rendered twice (desktop + mobile branches in the topbar) — `:visible` filter picks whichever one the current viewport renders.
- The toggle's *label* flips between "Light Mode" and "Dark Mode" depending on current state. The `clickThemeMenuItem` helper takes the **expected label** (i.e. the label the toggle has WHEN you want to flip), so callers don't have to read the current state.
- Detection uses `document.documentElement.classList.contains('dark')` rather than a CSS-derived check, since the SUT applies the class globally on `<html>`.
