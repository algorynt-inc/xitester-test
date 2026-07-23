# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.setup.ts >> authenticate once per run
- Location: tests/auth.setup.ts:32:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /organizations/
Received string:  "https://app-qa.ai.xitester.com/dashboard"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "https://app-qa.ai.xitester.com/dashboard"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications alt+T"
    - generic [ref=e3]:
      - banner [ref=e4]:
        - generic [ref=e5]:
          - img "Xitester" [ref=e7]
          - generic [ref=e8]:
            - generic [ref=e9]: /
            - generic [ref=e10]:
              - button "XiTester Demo Org Enterprise" [ref=e11] [cursor=pointer]:
                - img [ref=e12]
                - generic [ref=e16]: XiTester Demo Org
                - generic [ref=e17]: Enterprise
              - button [ref=e18] [cursor=pointer]:
                - img [ref=e19]
            - generic [ref=e22]: /
            - 'button "Switch project. Current project: SUT" [ref=e24] [cursor=pointer]':
              - img [ref=e25]
              - generic [ref=e27]: SUT
              - img [ref=e28]
        - generic [ref=e31]:
          - button "Search... ⌘K" [ref=e32] [cursor=pointer]:
            - img [ref=e33]
            - generic [ref=e36]: Search...
            - generic [ref=e37]: ⌘K
          - generic [ref=e38]:
            - button "Help" [ref=e39] [cursor=pointer]:
              - img [ref=e40]
            - button "Notifications" [ref=e43] [cursor=pointer]:
              - img [ref=e44]
              - generic [ref=e47]: "6"
          - generic [ref=e49]:
            - generic [ref=e50]: QA
            - generic [ref=e51]: v1.2.6+patch.607
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
            - button "Quality" [ref=e102] [cursor=pointer]:
              - img [ref=e104]
              - generic: Quality
            - button "Api Tester" [ref=e107] [cursor=pointer]:
              - img [ref=e109]
              - generic: Api Tester
            - button "Reports" [ref=e113] [cursor=pointer]:
              - img [ref=e115]
              - generic: Reports
            - button "Settings" [ref=e119] [cursor=pointer]:
              - img [ref=e121]
              - generic: Settings
          - button "Logout" [ref=e126] [cursor=pointer]:
            - img [ref=e128]
            - generic: Logout
        - main [ref=e132]:
          - generic [ref=e133]:
            - heading "Dashboard" [level=1] [ref=e135]
            - generic [ref=e137]:
              - button "Overview" [ref=e138] [cursor=pointer]:
                - img [ref=e139]
                - text: Overview
              - button "Regression Test Result Charts" [ref=e144] [cursor=pointer]:
                - img [ref=e145]
                - text: Regression Test Result Charts
              - button "Test Coverage" [ref=e148] [cursor=pointer]:
                - img [ref=e149]
                - text: Test Coverage
            - generic [ref=e152]:
              - generic [ref=e153]:
                - generic [ref=e154]:
                  - img [ref=e156]
                  - heading "Total Test Plan Runs" [level=3] [ref=e159]
                  - generic [ref=e160]:
                    - generic [ref=e161]: "1"
                    - generic [ref=e163]: No data
                - generic [ref=e165]:
                  - img [ref=e167]
                  - heading "Pass Rate" [level=3] [ref=e171]
                  - generic [ref=e172]:
                    - generic [ref=e173]: 0%
                    - generic [ref=e175]: ↑ +0.0% from the last week
                - generic [ref=e177]:
                  - img [ref=e179]
                  - heading "Active Suites" [level=3] [ref=e185]
                  - generic [ref=e186]:
                    - generic [ref=e187]: "0"
                    - generic [ref=e189]: Currently active test plan runs
                - generic [ref=e191]:
                  - img [ref=e193]
                  - heading "Avg. Duration" [level=3] [ref=e197]
                  - generic [ref=e198]:
                    - generic [ref=e199]: N/A
                    - generic [ref=e201]: Avg across recent runs
              - generic [ref=e204]:
                - combobox "Select test plan" [ref=e206]:
                  - option "SUT Plan" [selected]
                - generic [ref=e207]:
                  - generic [ref=e209]:
                    - heading "Test Plan Runs Analysis" [level=3] [ref=e210]
                    - button "Maximize Test Plan Runs Analysis chart" [ref=e211] [cursor=pointer]:
                      - img [ref=e212]
                  - generic [ref=e219]:
                    - generic:
                      - generic:
                        - paragraph: Apr 15, 11:24 AM
                        - paragraph: "Ran by: Admin User"
                        - paragraph: "Execution Mode: Parallel"
                        - generic:
                          - generic:
                            - generic: "Passed:"
                            - generic: 3 tests
                          - generic:
                            - generic: "Failed:"
                            - generic: 2 tests
                          - generic:
                            - generic: "Duration:"
                            - generic: 2m 48s
                    - application [ref=e220]:
                      - generic [ref=e247]:
                        - generic [ref=e248]: Test Cases
                        - generic [ref=e249]: Duration (min)
                        - generic [ref=e250]:
                          - generic [ref=e252]: "2"
                          - generic [ref=e254]: "4"
                          - generic [ref=e256]: "6"
                          - generic [ref=e258]: "8"
                        - generic [ref=e259]:
                          - generic [ref=e261]: "0.75"
                          - generic [ref=e263]: "1.5"
                          - generic [ref=e265]: "2.25"
                          - generic [ref=e267]: "3"
              - generic [ref=e270]:
                - generic [ref=e272]:
                  - generic [ref=e274]:
                    - heading "Top Active Test Plans" [level=3] [ref=e275]
                    - button "Maximize Top Active Test Plans chart" [ref=e276] [cursor=pointer]:
                      - img [ref=e277]
                  - application [ref=e285]
                - generic [ref=e291]:
                  - generic [ref=e293]:
                    - heading "Recent Activity" [level=3] [ref=e294]
                    - button "Maximize Recent Activity chart" [ref=e295] [cursor=pointer]:
                      - img [ref=e296]
                  - generic [ref=e303]:
                    - img [ref=e305]
                    - generic [ref=e307]:
                      - paragraph [ref=e308]: SUT Plan
                      - paragraph [ref=e309]:
                        - generic [ref=e310]: Admin User
                        - generic [ref=e311]: •
                        - generic [ref=e312]: Apr 15, 11:24 AM
                    - generic [ref=e314]: Failed
  - generic [ref=e317]: "0.75"
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
  47 |         page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
  48 |         page.locator('button[type="submit"]').click(),
  49 |     ])
  50 | 
  51 |     // Sanity-check: the page should now be inside the app, not bouncing back
  52 |     // to /login. If we're still on /login, login silently failed and saving
  53 |     // an unauthed storageState is worse than failing now.
  54 |     expect(page.url(), 'login should have navigated away from /login').not.toMatch(/\/login(\?|$|#)/)
> 55 |     await expect(page).toHaveURL(/organizations/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
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