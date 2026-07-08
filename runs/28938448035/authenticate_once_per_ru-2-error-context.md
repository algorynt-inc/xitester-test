# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> authenticate once per run
- Location: tests/auth.setup.ts:32:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - img "Xitester Dashboard Preview" [ref=e6]
    - generic [ref=e7]:
      - button "Switch to dark mode" [ref=e9] [cursor=pointer]:
        - img [ref=e10]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - img [ref=e15]
          - img "Xitester" [ref=e16]
        - generic [ref=e17]:
          - heading "Welcome to Xitester" [level=1] [ref=e18]
          - paragraph [ref=e19]: Enter your credentials to continue
        - generic [ref=e20]:
          - generic [ref=e21]:
            - generic [ref=e22]:
              - generic [ref=e23]: Email
              - textbox "Email" [ref=e24]: ashid@xitester.com
            - generic [ref=e25]:
              - generic [ref=e26]: Password
              - textbox "Password" [ref=e27]: "12345678"
              - button "Show password" [ref=e28] [cursor=pointer]:
                - img [ref=e29]
          - generic [ref=e32]:
            - generic [ref=e33] [cursor=pointer]:
              - generic [ref=e34]:
                - checkbox "Remember me" [ref=e35]
                - generic:
                  - img
              - generic [ref=e36]: Remember me
            - link "Forgot password?" [ref=e37] [cursor=pointer]:
              - /url: /forgot-password
          - button "Login" [ref=e38] [cursor=pointer]
          - generic [ref=e43]: or continue with
          - button "Continue with Google" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
            - text: Continue with Google
          - paragraph [ref=e51]:
            - text: Don't have an account?
            - link "Create account" [ref=e52] [cursor=pointer]:
              - /url: /signup
    - generic [ref=e53]:
      - img [ref=e54]
      - generic [ref=e57]: DEV
      - generic [ref=e58]: v1.1.4
```

# Test source

```ts
  1  | import { test as setup, expect } from '@playwright/test'
  2  | import { mkdir, writeFile } from 'node:fs/promises'
  3  | import { dirname } from 'node:path'
  4  | import { ENV } from '../env'
  5  | 
  6  | /**
  7  |  * One-time UI login per workflow run. Drives the actual login form (so the
  8  |  * SPA hits the right backend regardless of apiBase config), waits for the
  9  |  * post-login redirect, and saves the resulting browser state to
  10 |  * playwright/.auth/user.json.
  11 |  *
  12 |  * NOTE: the SUT now uses HTTP-only cookies for auth (xitester_access_token)
  13 |  * and returns access_token: null in the login response body, so the SPA
  14 |  * does NOT populate localStorage.auth_token_v1. We therefore don't assert
  15 |  * any specific localStorage key — storageState captures cookies + whatever
  16 |  * IS in localStorage, and that's all subsequent tests need. They send the
  17 |  * cookie automatically when they use `page.request` (or any
  18 |  * page-context-bound request).
  19 |  *
  20 |  * Specs that need an authenticated session opt in via:
  21 |  *   test.use({ storageState: 'playwright/.auth/user.json' })
  22 |  *
  23 |  * Specs that test login itself (login.spec.ts) intentionally do NOT opt
  24 |  * in so they start from a fresh, unauthenticated state.
  25 |  */
  26 | 
  27 | // Path is relative to the Playwright project's cwd (the `playwright/` dir),
  28 | // so the file lands at `playwright/.auth/user.json` from the repo root.
  29 | export const AUTH_FILE = '.auth/user.json'
  30 | const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] }, null, 2)
  31 | 
  32 | setup('authenticate once per run', async ({ page }) => {
  33 |     await mkdir(dirname(AUTH_FILE), { recursive: true })
  34 | 
  35 |     if (!ENV.user.email || !ENV.user.password) {
  36 |         await writeFile(AUTH_FILE, EMPTY_STATE, 'utf8')
  37 |         // eslint-disable-next-line no-console
  38 |         console.warn(`[auth.setup] No TEST_USER_EMAIL/PASSWORD for ${ENV.name}; wrote empty storageState.`)
  39 |         return
  40 |     }
  41 | 
  42 |     await page.goto('/login')
  43 |     await page.locator('#email').waitFor({ state: 'visible', timeout: 30_000 })
  44 |     await page.fill('#email', ENV.user.email)
  45 |     await page.fill('#password', ENV.user.password)
  46 |     await Promise.all([
> 47 |         page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
     |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  48 |         page.locator('button[type="submit"]').click(),
  49 |     ])
  50 | 
  51 |     // Sanity-check: the page should now be inside the app, not bouncing back
  52 |     // to /login. If we're still on /login, login silently failed and saving
  53 |     // an unauthed storageState is worse than failing now.
  54 |     expect(page.url(), 'login should have navigated away from /login').not.toMatch(/\/login(\?|$|#)/)
  55 |     await expect(page).toHaveURL(/organizations/);
  56 | 
  57 |     // Diagnostics: log which auth carriers we captured. Either is fine.
  58 |     const cookies = await page.context().cookies()
  59 |     const authCookie = cookies.find(c => /xitester|access|session|token/i.test(c.name))
  60 |     const lsToken = await page.evaluate(() => {
  61 |         try {
  62 |             return window.localStorage.getItem('auth_token_v1')
  63 |         } catch {
  64 |             return null
  65 |         }
  66 |     })
  67 | 
  68 |     if (!authCookie && !lsToken) {
  69 |         throw new Error(
  70 |             'Login completed but no auth cookie or auth_token_v1 found. ' +
  71 |                 `Cookies seen: ${cookies.map(c => c.name).join(', ') || '(none)'}. ` +
  72 |                 'Storage state would be unauthenticated — failing fast so dependent tests skip cleanly.',
  73 |         )
  74 |     }
  75 | 
  76 |     await page.context().storageState({ path: AUTH_FILE })
  77 | 
  78 |     // eslint-disable-next-line no-console
  79 |     console.log(
  80 |         `[auth.setup] Saved storageState for ${ENV.name}. ` +
  81 |             `cookie=${authCookie?.name ?? 'none'} (${authCookie?.value ? authCookie.value.length + ' chars' : '-'}), ` +
  82 |             `localStorage.auth_token_v1=${lsToken ? lsToken.length + ' chars' : 'absent'}.`,
  83 |     )
  84 | })
  85 | 
```