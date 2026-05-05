# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: logout.spec.ts >> TC-LO-002 — Protected routes redirect to /login after logout
- Location: tests/logout.spec.ts:43:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('header button[aria-haspopup="menu"]').last()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('header button[aria-haspopup="menu"]').last()
    9 × locator resolved to <button type="button" id="radix-_r_8_" data-state="closed" aria-haspopup="menu" aria-expanded="false" class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">A</button>
      - unexpected value "hidden"

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
              - button "XiTester Enterprise" [ref=e11] [cursor=pointer]:
                - img [ref=e12]
                - generic [ref=e16]: XiTester
                - generic [ref=e17]: Enterprise
              - button [ref=e18] [cursor=pointer]:
                - img [ref=e19]
            - generic [ref=e22]: /
            - generic [ref=e23]:
              - button "Default Project" [ref=e24] [cursor=pointer]:
                - img [ref=e25]
                - generic [ref=e27]: Default Project
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
              - generic [ref=e48]: 99+
          - generic [ref=e50]:
            - generic [ref=e51]: DEV
            - generic [ref=e52]: v1.1.0
            - button "A" [ref=e53] [cursor=pointer]
      - generic [ref=e54]:
        - complementary:
          - navigation [ref=e55]:
            - button "Dashboard" [ref=e56] [cursor=pointer]:
              - img [ref=e58]
              - generic: Dashboard
            - button "Test Cases" [ref=e63] [cursor=pointer]:
              - img [ref=e65]
              - generic: Test Cases
            - button "Test Plans" [ref=e68] [cursor=pointer]:
              - img [ref=e70]
              - generic: Test Plans
            - button "Discovery" [ref=e74] [cursor=pointer]:
              - img [ref=e76]
              - generic: Discovery
            - button "Test Plan AI" [ref=e83] [cursor=pointer]:
              - img [ref=e85]
              - generic: Test Plan AI
            - button "Test Data" [ref=e97] [cursor=pointer]:
              - img [ref=e99]
              - generic: Test Data
            - button "Api Tester" [ref=e103] [cursor=pointer]:
              - img [ref=e105]
              - generic: Api Tester
            - button "Settings" [ref=e110] [cursor=pointer]:
              - img [ref=e112]
              - generic: Settings
          - button "Logout" [ref=e117] [cursor=pointer]:
            - img [ref=e119]
            - generic: Logout
        - main [ref=e123]:
          - generic [ref=e124]:
            - heading "Dashboard" [level=1] [ref=e126]
            - generic [ref=e128]:
              - button "Overview" [ref=e129] [cursor=pointer]:
                - img [ref=e130]
                - text: Overview
              - button "Regression Test Result Charts" [ref=e135] [cursor=pointer]:
                - img [ref=e136]
                - text: Regression Test Result Charts
              - button "Test Coverage" [ref=e139] [cursor=pointer]:
                - img [ref=e140]
                - text: Test Coverage
            - generic [ref=e143]:
              - generic [ref=e144]:
                - generic [ref=e145]:
                  - img [ref=e147]
                  - heading "Total Test Plan Runs" [level=3] [ref=e150]
                  - generic [ref=e151]:
                    - generic [ref=e152]: "338"
                    - generic [ref=e154]: ↓ -86.9% from the last month
                - generic [ref=e155]:
                  - img [ref=e157]
                  - heading "Pass Rate" [level=3] [ref=e161]
                  - generic [ref=e162]:
                    - generic [ref=e163]: 48%
                    - generic [ref=e165]: ↓ -3.3% from the last week
                - generic [ref=e166]:
                  - img [ref=e168]
                  - heading "Active Suites" [level=3] [ref=e174]
                  - generic [ref=e175]:
                    - generic [ref=e176]: "0"
                    - generic [ref=e178]: Currently active test plan runs
                - generic [ref=e179]:
                  - img [ref=e181]
                  - heading "Avg. Duration" [level=3] [ref=e185]
                  - generic [ref=e186]:
                    - generic [ref=e187]: 8m 29s
                    - generic [ref=e189]: Avg across recent runs
              - generic [ref=e191]:
                - combobox "Select test plan" [ref=e193]:
                  - option "KIMS TVM ALL_Modules Testcase"
                  - option "ZZZ-Iter6-Boundary"
                  - option "Test 1"
                  - option "https://cigclouds.com/demoit/index.php"
                  - option "downlaod" [selected]
                  - option "Shine - First One - Imp*"
                - generic [ref=e194]:
                  - generic [ref=e196]:
                    - heading "Test Plan Runs Analysis" [level=3] [ref=e197]
                    - button "Maximize Test Plan Runs Analysis chart" [ref=e198] [cursor=pointer]:
                      - img [ref=e199]
                  - application [ref=e207]:
                    - generic [ref=e456]:
                      - generic [ref=e457]: Test Cases
                      - generic [ref=e458]: Duration (min)
                      - generic [ref=e459]:
                        - generic [ref=e461]: "0.75"
                        - generic [ref=e463]: "1.5"
                        - generic [ref=e465]: "2.25"
                        - generic [ref=e467]: "3"
                      - generic [ref=e468]:
                        - generic [ref=e470]: "7"
                        - generic [ref=e472]: "14"
                        - generic [ref=e474]: "21"
                        - generic [ref=e476]: "28"
              - generic [ref=e479]:
                - generic [ref=e481]:
                  - generic [ref=e483]:
                    - heading "Top Active Test Plans" [level=3] [ref=e484]
                    - button "Maximize Top Active Test Plans chart" [ref=e485] [cursor=pointer]:
                      - img [ref=e486]
                  - application [ref=e494]:
                    - generic [ref=e512]:
                      - generic [ref=e513]:
                        - generic [ref=e515]: downlaod
                        - generic [ref=e517]: Shine - First One - Imp*
                      - generic [ref=e518]:
                        - generic [ref=e520]: "0"
                        - generic [ref=e522]: "2"
                        - generic [ref=e524]: "4"
                        - generic [ref=e526]: "6"
                        - generic [ref=e528]: "8"
                - generic [ref=e531]:
                  - generic [ref=e533]:
                    - heading "Recent Activity" [level=3] [ref=e534]
                    - button "Maximize Recent Activity chart" [ref=e535] [cursor=pointer]:
                      - img [ref=e536]
                  - generic [ref=e542]:
                    - generic [ref=e543]:
                      - img [ref=e545]
                      - generic [ref=e547]:
                        - paragraph [ref=e548]: Shine - First One - Imp*
                        - paragraph [ref=e549]:
                          - generic [ref=e550]: Shine
                          - generic [ref=e551]: •
                          - generic [ref=e552]: May 4, 11:30 PM
                      - generic [ref=e554]: Failed
                    - generic [ref=e555]:
                      - img [ref=e557]
                      - generic [ref=e559]:
                        - paragraph [ref=e560]: Shine - First One - Imp*
                        - paragraph [ref=e561]:
                          - generic [ref=e562]: Shine
                          - generic [ref=e563]: •
                          - generic [ref=e564]: May 4, 11:00 PM
                      - generic [ref=e566]: Failed
                    - generic [ref=e567]:
                      - img [ref=e569]
                      - generic [ref=e571]:
                        - paragraph [ref=e572]: downlaod
                        - paragraph [ref=e573]:
                          - generic [ref=e574]: Admin User
                          - generic [ref=e575]: •
                          - generic [ref=e576]: May 4, 10:20 PM
                      - generic [ref=e578]: Passed
                    - generic [ref=e579]:
                      - img [ref=e581]
                      - generic [ref=e583]:
                        - paragraph [ref=e584]: downlaod
                        - paragraph [ref=e585]:
                          - generic [ref=e586]: Admin User
                          - generic [ref=e587]: •
                          - generic [ref=e588]: May 4, 10:20 PM
                      - generic [ref=e590]: Passed
                    - generic [ref=e591]:
                      - img [ref=e593]
                      - generic [ref=e595]:
                        - paragraph [ref=e596]: Shine - First One - Imp*
                        - paragraph [ref=e597]:
                          - generic [ref=e598]: Shine
                          - generic [ref=e599]: •
                          - generic [ref=e600]: May 3, 11:30 PM
                      - generic [ref=e602]: Failed
  - generic [ref=e605]: "7"
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test'
  2  | import { ENV } from '../env'
  3  | 
  4  | // Both tests start authenticated; logout is the action under test.
  5  | test.use({ storageState: '.auth/user.json' })
  6  | 
  7  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  8  | 
  9  | /**
  10 |  * Open the user-menu dropdown in the top bar. The trigger is a Radix
  11 |  * shadcn DropdownMenuTrigger that exposes aria-haspopup="menu". The
  12 |  * topbar may have multiple haspopup buttons (org switcher etc.); the
  13 |  * user menu is the last one on the right.
  14 |  */
  15 | async function openUserMenu(page: Page): Promise<void> {
  16 |     const trigger = page.locator('header button[aria-haspopup="menu"]').last()
> 17 |     await expect(trigger).toBeVisible({ timeout: 10_000 })
     |                           ^ Error: expect(locator).toBeVisible() failed
  18 |     await trigger.click()
  19 | }
  20 | 
  21 | // ============================================================
  22 | // Logout — flat list, no categories
  23 | // ============================================================
  24 | 
  25 | test('TC-LO-001 — Logout via user menu redirects to /login', async ({ page }) => {
  26 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  27 | 
  28 |     // Land on any authed page first so the topbar renders.
  29 |     await page.goto('/dashboard')
  30 |     await page.waitForLoadState('domcontentloaded')
  31 | 
  32 |     await openUserMenu(page)
  33 |     await page.getByRole('menuitem', { name: /^Log out$/i }).click()
  34 | 
  35 |     // Logout fires POST /api/v1/auth/logout best-effort and navigates to /login.
  36 |     await page.waitForURL(/\/login\b/, { timeout: 10_000 })
  37 |     expect(page.url()).toMatch(/\/login\b/)
  38 | 
  39 |     // The login form should be visible again.
  40 |     await expect(page.locator('#email')).toBeVisible({ timeout: 5_000 })
  41 | })
  42 | 
  43 | test('TC-LO-002 — Protected routes redirect to /login after logout', async ({ page }) => {
  44 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  45 | 
  46 |     await page.goto('/dashboard')
  47 |     await page.waitForLoadState('domcontentloaded')
  48 | 
  49 |     await openUserMenu(page)
  50 |     await page.getByRole('menuitem', { name: /^Log out$/i }).click()
  51 |     await page.waitForURL(/\/login\b/, { timeout: 10_000 })
  52 | 
  53 |     // Now try to load a protected page directly. The auth guard should
  54 |     // bounce us back to /login because the token / cookie was cleared.
  55 |     await page.goto('/dashboard')
  56 |     await page.waitForURL(/\/login\b/, { timeout: 8_000 })
  57 |     expect(page.url(), 'protected route should redirect to /login when logged out').toMatch(/\/login\b/)
  58 | })
  59 | 
```