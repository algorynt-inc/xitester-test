# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> authenticate once per run
- Location: tests/auth.setup.ts:22:1

# Error details

```
Error: auth_token_v1 should be in localStorage after login

expect(received).toBeTruthy()

Received: null
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img "Xitester" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: /
          - generic [ref=e10]:
            - button "XiTester Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: XiTester
              - generic [ref=e17]: Enterprise
            - button [ref=e18] [cursor=pointer]:
              - img [ref=e19]
          - generic [ref=e22]: /
          - generic [ref=e23]:
            - button "Select Project" [ref=e24] [cursor=pointer]:
              - img [ref=e25]
              - generic [ref=e27]: Select Project
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
      - generic [ref=e32]:
        - button "Search... ⌘K" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
          - generic [ref=e37]: Search...
          - generic [ref=e38]: ⌘K
        - generic [ref=e39]:
          - button "Help" [ref=e40] [cursor=pointer]:
            - img [ref=e41]
          - button "Notifications" [ref=e44] [cursor=pointer]:
            - img [ref=e45]
        - generic [ref=e49]:
          - generic [ref=e50]: DEV
          - generic [ref=e51]: v1.1.0
          - button "A" [ref=e52] [cursor=pointer]
    - generic [ref=e53]:
      - complementary:
        - navigation [ref=e54]:
          - button "Dashboard" [ref=e55] [cursor=pointer]:
            - img [ref=e57]
            - generic: Dashboard
          - button "Test Cases" [ref=e62] [cursor=pointer]:
            - img [ref=e64]
            - generic: Test Cases
          - button "Test Plans" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Test Plans
          - button "Discovery" [ref=e73] [cursor=pointer]:
            - img [ref=e75]
            - generic: Discovery
          - button "Test Plan AI" [ref=e82] [cursor=pointer]:
            - img [ref=e84]
            - generic: Test Plan AI
          - button "Test Data" [ref=e96] [cursor=pointer]:
            - img [ref=e98]
            - generic: Test Data
          - button "Api Tester" [ref=e102] [cursor=pointer]:
            - img [ref=e104]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e108] [cursor=pointer]:
            - img [ref=e110]
            - generic: Figma-to-web
          - button "Settings" [ref=e117] [cursor=pointer]:
            - img [ref=e119]
            - generic: Settings
        - button "Logout" [ref=e124] [cursor=pointer]:
          - img [ref=e126]
          - generic: Logout
      - main [ref=e130]:
        - generic [ref=e131]:
          - heading "Dashboard" [level=1] [ref=e133]
          - generic [ref=e135]:
            - button "Overview" [ref=e136] [cursor=pointer]:
              - img [ref=e137]
              - text: Overview
            - button "Regression Test Result Charts" [ref=e142] [cursor=pointer]:
              - img [ref=e143]
              - text: Regression Test Result Charts
            - button "Test Coverage" [ref=e146] [cursor=pointer]:
              - img [ref=e147]
              - text: Test Coverage
          - generic [ref=e150]: Loading charts...
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
  9  |  * post-login redirect, and saves the resulting browser state — including
  10 |  * localStorage.auth_token_v1 — to playwright/.auth/user.json.
  11 |  *
  12 |  * Specs that need an authenticated session opt in via:
  13 |  *   test.use({ storageState: 'playwright/.auth/user.json' })
  14 |  *
  15 |  * Specs that test login itself (login.spec.ts) intentionally do NOT opt in
  16 |  * so they start from a fresh, unauthenticated state.
  17 |  */
  18 | 
  19 | export const AUTH_FILE = 'playwright/.auth/user.json'
  20 | const EMPTY_STATE = JSON.stringify({ cookies: [], origins: [] }, null, 2)
  21 | 
  22 | setup('authenticate once per run', async ({ page }) => {
  23 |     await mkdir(dirname(AUTH_FILE), { recursive: true })
  24 | 
  25 |     if (!ENV.user.email || !ENV.user.password) {
  26 |         // No creds in the env — write an empty state so dependent specs can
  27 |         // still load it (their own test.skip guards prevent execution).
  28 |         await writeFile(AUTH_FILE, EMPTY_STATE, 'utf8')
  29 |         // eslint-disable-next-line no-console
  30 |         console.warn(`[auth.setup] No TEST_USER_EMAIL/PASSWORD for ${ENV.name}; wrote empty storageState.`)
  31 |         return
  32 |     }
  33 | 
  34 |     await page.goto('/login')
  35 |     await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
  36 |     await page.fill('#email', ENV.user.email)
  37 |     await page.fill('#password', ENV.user.password)
  38 |     await Promise.all([
  39 |         page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
  40 |         page.locator('button[type="submit"]').click(),
  41 |     ])
  42 | 
  43 |     const token = await page.evaluate(() => window.localStorage.getItem('auth_token_v1'))
> 44 |     expect(token, 'auth_token_v1 should be in localStorage after login').toBeTruthy()
     |                                                                          ^ Error: auth_token_v1 should be in localStorage after login
  45 | 
  46 |     await page.context().storageState({ path: AUTH_FILE })
  47 |     // eslint-disable-next-line no-console
  48 |     console.log(`[auth.setup] Saved storageState for ${ENV.name} (token length=${token?.length ?? 0}).`)
  49 | })
  50 | 
```