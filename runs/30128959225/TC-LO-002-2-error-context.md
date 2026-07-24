# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: logout.spec.ts >> TC-LO-002 — Protected routes redirect to /login after logout
- Location: tests/logout.spec.ts:75:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 8000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - img [ref=e6]
        - generic [ref=e9]:
          - generic [ref=e10]: You're on the Free plan (14 Days Left)
          - generic [ref=e11]: — unlock full access
        - button "Upgrade" [ref=e12] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e13]
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]:
            - button "qa-del-1784841164846-pw7a Free" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: qa-del-1784841164846-pw7a
              - generic [ref=e27]: Free
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - generic [ref=e32]: /
          - button "Create project" [ref=e33] [cursor=pointer]:
            - img [ref=e34]
            - generic [ref=e36]: Create project
      - generic [ref=e37]:
        - button "Search... ⌘K" [ref=e38] [cursor=pointer]:
          - img [ref=e39]
          - generic [ref=e42]: Search...
          - generic [ref=e43]: ⌘K
        - generic [ref=e44]:
          - button "Help" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
          - button "Notifications" [ref=e49] [cursor=pointer]:
            - img [ref=e50]
        - generic [ref=e54]:
          - generic [ref=e55]: STAGE
          - generic [ref=e56]: v1.2.5+patch.601
          - button "T" [ref=e57] [cursor=pointer]
    - generic [ref=e58]:
      - complementary:
        - navigation [ref=e59]:
          - button "Dashboard" [ref=e60] [cursor=pointer]:
            - img [ref=e62]
            - generic: Dashboard
          - button "Test Cases" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Test Cases
          - button "Test Plans" [ref=e72] [cursor=pointer]:
            - img [ref=e74]
            - generic: Test Plans
          - button "Discovery" [ref=e78] [cursor=pointer]:
            - img [ref=e80]
            - generic: Discovery
          - button "Test Plan AI" [ref=e87] [cursor=pointer]:
            - img [ref=e89]
            - generic: Test Plan AI
          - button "Test Data" [ref=e101] [cursor=pointer]:
            - img [ref=e103]
            - generic: Test Data
          - button "Quality" [ref=e107] [cursor=pointer]:
            - img [ref=e109]
            - generic: Quality
          - button "Api Tester" [ref=e112] [cursor=pointer]:
            - img [ref=e114]
            - generic: Api Tester
          - button "Figma-to-web" [ref=e118] [cursor=pointer]:
            - img [ref=e120]
            - generic: Figma-to-web
          - button "Reports" [ref=e126] [cursor=pointer]:
            - img [ref=e128]
            - generic: Reports
          - button "Settings" [ref=e132] [cursor=pointer]:
            - img [ref=e134]
            - generic: Settings
        - button "Logout" [ref=e139] [cursor=pointer]:
          - img [ref=e141]
          - generic: Logout
      - main [ref=e145]:
        - generic [ref=e146]:
          - heading "Dashboard" [level=1] [ref=e148]
          - generic [ref=e150]:
            - button "Overview" [ref=e151] [cursor=pointer]:
              - img [ref=e152]
              - text: Overview
            - button "Regression Test Result Charts" [ref=e157] [cursor=pointer]:
              - img [ref=e158]
              - text: Regression Test Result Charts
            - button "Test Coverage" [ref=e161] [cursor=pointer]:
              - img [ref=e162]
              - text: Test Coverage
          - generic [ref=e165]:
            - generic [ref=e166]:
              - generic [ref=e167]:
                - img [ref=e169]
                - heading "Total Test Plan Runs" [level=3] [ref=e172]
                - generic [ref=e173]:
                  - generic [ref=e174]: …
                  - generic [ref=e176]: …
              - generic [ref=e178]:
                - img [ref=e180]
                - heading "Pass Rate" [level=3] [ref=e184]
                - generic [ref=e185]:
                  - generic [ref=e186]: …
                  - generic [ref=e188]: …
              - generic [ref=e190]:
                - img [ref=e192]
                - heading "Active Suites" [level=3] [ref=e198]
                - generic [ref=e199]:
                  - generic [ref=e200]: …
                  - generic [ref=e202]: …
              - generic [ref=e204]:
                - img [ref=e206]
                - heading "Avg. Duration" [level=3] [ref=e210]
                - generic [ref=e211]:
                  - generic [ref=e212]: …
                  - generic [ref=e214]: …
            - generic [ref=e217]:
              - combobox "Select test plan" [ref=e219]:
                - option "No Plans Found" [selected]
              - generic [ref=e220]:
                - generic [ref=e222]:
                  - heading "Test Plan Runs Analysis" [level=3] [ref=e223]
                  - button "Maximize Test Plan Runs Analysis chart" [ref=e224] [cursor=pointer]:
                    - img [ref=e225]
                - application [ref=e233]:
                  - generic [ref=e237]:
                    - generic [ref=e238]: Test Cases
                    - generic [ref=e239]: Duration (min)
            - generic [ref=e242]:
              - generic [ref=e244]:
                - generic [ref=e246]:
                  - heading "Top Active Test Plans" [level=3] [ref=e247]
                  - button "Maximize Top Active Test Plans chart" [ref=e248] [cursor=pointer]:
                    - img [ref=e249]
                - application [ref=e257]
              - generic [ref=e265]:
                - heading "Recent Activity" [level=3] [ref=e266]
                - button "Maximize Recent Activity chart" [ref=e267] [cursor=pointer]:
                  - img [ref=e268]
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test'
  2  | import { ENV } from '../env'
  3  | 
  4  | // Both tests start authenticated; logout is the action under test.
  5  | // test.use({ storageState: '.auth/user.json' })
  6  | 
  7  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  8  | 
  9  | /**
  10 |  * Log in through the UI so this test owns a fresh, independent session.
  11 |  *
  12 |  * We deliberately do NOT share the saved storageState (.auth/user.json)
  13 |  * here: logout invalidates its token server-side, so if both logout tests
  14 |  * reused the one shared token, whichever logged out first would break the
  15 |  * other. A per-test login gives each test its own token.
  16 |  */
  17 | async function loginViaUI(page: Page): Promise<void> {
  18 |     await page.goto('/login')
  19 |     await page.locator('#email').waitFor({ state: 'visible', timeout: 30_000 })
  20 |     await page.fill('#email', ENV.user.email)
  21 |     await page.fill('#password', ENV.user.password)
  22 |     await Promise.all([
  23 |         page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
  24 |         page.locator('button[type="submit"]').click(),
  25 |     ])
  26 | }
  27 | 
  28 | // Each test gets its OWN session, so one test's logout can't invalidate
  29 | // another test's token.
  30 | test.beforeEach(async ({ page }) => {
  31 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  32 |     await loginViaUI(page)
  33 | })
  34 | 
  35 | /**
  36 |  * Open the user-menu dropdown in the top bar.
  37 |  *
  38 |  * The SUT renders <UserMenu /> twice — once for the desktop layout
  39 |  * (`hidden sm:flex`) and once for the mobile layout (`flex sm:hidden`).
  40 |  * Both produce a button with aria-haspopup="menu", but only one is
  41 |  * actually rendered visibly at any given viewport. Filtering with
  42 |  * `:visible` picks the right copy regardless of viewport size.
  43 |  *
  44 |  * The user menu is the LAST visible aria-haspopup button in the header
  45 |  * (the org switcher and other menus appear earlier).
  46 |  */
  47 | async function openUserMenu(page: Page): Promise<void> {
  48 |     const trigger = page.locator('header button[aria-haspopup="menu"]:visible').last()
  49 |     await expect(trigger).toBeVisible({ timeout: 15_000 })
  50 |     await trigger.click()
  51 | }
  52 | 
  53 | // ============================================================
  54 | // Logout — flat list, no categories
  55 | // ============================================================
  56 | 
  57 | test('TC-LO-001 — Logout via user menu redirects to /login', async ({ page }) => {
  58 |     // test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  59 | 
  60 |     // Land on any authed page first so the topbar renders.
  61 |     await page.goto('/dashboard')
  62 |     await page.waitForLoadState('domcontentloaded')
  63 | 
  64 |     await openUserMenu(page)
  65 |     await page.getByRole('menuitem', { name: /^Log out$/i }).click()
  66 | 
  67 |     // Logout fires POST /api/v1/auth/logout best-effort and navigates to /login.
  68 |     await page.waitForURL(/\/login\b/, { timeout: 10_000 })
  69 |     expect(page.url()).toMatch(/\/login\b/)
  70 | 
  71 |     // The login form should be visible again.
  72 |     await expect(page.locator('#email')).toBeVisible({ timeout: 5_000 })
  73 | })
  74 | 
  75 | test('TC-LO-002 — Protected routes redirect to /login after logout', async ({ page }) => {
  76 |     // test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  77 | 
  78 |     await page.goto('/dashboard')
  79 |     await page.waitForLoadState('domcontentloaded')
  80 | 
  81 |     await expect(
  82 |         page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  83 |     ).toBeVisible({ timeout: 8_000 })
  84 |     await openUserMenu(page)
  85 |     await page.getByRole('menuitem', { name: /^Log out$/i }).click()
  86 |     await page.waitForURL(/\/login\b/, { timeout: 10_000 })
  87 | 
  88 |     // Now try to load a protected page directly. The auth guard should
  89 |     // bounce us back to /login because the token / cookie was cleared.
  90 |     await page.goto('/dashboard')
> 91 |     await page.waitForURL(/\/login\b/, { timeout: 8_000 })
     |                ^ TimeoutError: page.waitForURL: Timeout 8000ms exceeded.
  92 |     expect(page.url(), 'protected route should redirect to /login when logged out').toMatch(/\/login\b/)
  93 | })
  94 | 
```