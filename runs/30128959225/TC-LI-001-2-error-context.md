# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> TC-LI-001 — Successful login with valid credentials
- Location: tests/login.spec.ts:16:1

# Error details

```
TimeoutError: page.waitForResponse: Timeout 10000ms exceeded while waiting for event "response"
=========================== logs ===========================
waiting for response /\/api\/v1\/auth\/login\b/
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
              - textbox "Email" [disabled] [ref=e24]: tester@xitester.com
            - generic [ref=e25]:
              - generic [ref=e26]: Password
              - textbox "Password" [disabled] [ref=e27]: Xitester@123
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
          - button "Signing in…" [disabled]
          - paragraph [ref=e38]:
            - text: Don't have an account?
            - link "Create account" [ref=e39] [cursor=pointer]:
              - /url: /signup
    - generic [ref=e40]:
      - img [ref=e41]
      - generic [ref=e44]: STAGE
      - generic [ref=e45]: v1.2.5+patch.601
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test'
  2  | import { ENV } from '../env'
  3  | 
  4  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  5  | 
  6  | async function gotoLogin(page: Page): Promise<void> {
  7  |     await page.goto('/login')
  8  |     await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
  9  |     await page.locator('button[type="submit"]').waitFor({ state: 'visible', timeout: 15_000 })
  10 | }
  11 | 
  12 | // ============================================================
  13 | // Login Suite (Lean Version) — 5 tests, flat (no describe blocks)
  14 | // ============================================================
  15 | 
  16 | test('TC-LI-001 — Successful login with valid credentials', async ({ page }) => {
  17 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  18 | 
  19 |     await gotoLogin(page)
  20 |     await page.fill('#email', ENV.user.email)
  21 |     await page.fill('#password', ENV.user.password)
  22 | 
  23 |     const submit = page.locator('button[type="submit"]')
  24 |     const [response] = await Promise.all([
> 25 |         page.waitForResponse(/\/api\/v1\/auth\/login\b/),
     |              ^ TimeoutError: page.waitForResponse: Timeout 10000ms exceeded while waiting for event "response"
  26 |         submit.click(),
  27 |     ])
  28 |     expect(response.status(), 'login API should return 200').toBe(200)
  29 | 
  30 |     await page.waitForURL((url) => !url.pathname.startsWith('/login') && !url.pathname.startsWith('/signup'), { timeout: 15_000 })
  31 |     expect(page.url()).not.toMatch(/\/(login | signup)(\?|$|#)/)
  32 | })
  33 | 
  34 | test('TC-LI-002 — Wrong password shows error', async ({ page }) => {
  35 |     test.skip(!ENV.user.email, SKIP_NO_CREDS)
  36 | 
  37 |     await gotoLogin(page)
  38 |     await page.fill('#email', ENV.user.email)
  39 |     await page.fill('#password', 'definitely-not-the-real-password')
  40 | 
  41 |     const [response] = await Promise.all([
  42 |         page.waitForResponse(/\/api\/v1\/auth\/login\b/),
  43 |         page.locator('button[type="submit"]').click(),
  44 |     ])
  45 |     expect(response.status(), 'wrong password should return 401').toBe(401)
  46 | 
  47 |     const toaster = page.locator('[data-sonner-toaster]')
  48 |     await expect(toaster).toContainText(/login failed|invalid|incorrect/i, { timeout: 5_000 })
  49 | 
  50 |     expect(page.url()).toMatch(/\/login(\?|$|#)/)
  51 |     await expect(page.locator('button[type="submit"]')).toBeEnabled()
  52 | 
  53 |     await expect(page.locator('#email')).toHaveValue(ENV.user.email)
  54 |     await expect(page.locator('#password')).toHaveValue('definitely-not-the-real-password')
  55 | })
  56 | 
  57 | test('TC-LI-003 — Password visibility toggle', async ({ page }) => {
  58 |     await gotoLogin(page)
  59 |     await page.fill('#password', 'secret-value-123')
  60 | 
  61 |     const password = page.locator('#password')
  62 |     const eye = page.locator('button[aria-label="Show password"], button[aria-label="Hide password"]')
  63 | 
  64 |     await expect(password).toHaveAttribute('type', 'password')
  65 |     await expect(eye).toHaveAttribute('aria-label', 'Show password')
  66 | 
  67 |     await eye.click()
  68 |     await expect(password).toHaveAttribute('type', 'text')
  69 |     await expect(eye).toHaveAttribute('aria-label', 'Hide password')
  70 | 
  71 |     await eye.click()
  72 |     await expect(password).toHaveAttribute('type', 'password')
  73 |     await expect(eye).toHaveAttribute('aria-label', 'Show password')
  74 | })
  75 | 
  76 | test('TC-LI-004 — Forgot password link navigates correctly', async ({ page }) => {
  77 |     await gotoLogin(page)
  78 |     await page.locator('a[href="/forgot-password"]').click()
  79 |     await page.waitForURL(/\/forgot-password\b/, { timeout: 5_000 })
  80 |     expect(page.url()).toMatch(/\/forgot-password\b/)
  81 | 
  82 |     const errors: string[] = []
  83 |     page.on('pageerror', (e) => errors.push(e.message))
  84 |     await page.waitForLoadState('domcontentloaded')
  85 |     expect(errors, 'forgot-password page should render without JS errors').toEqual([])
  86 | })
  87 | 
  88 | test('TC-LI-005 — Create account link navigates correctly', async ({ page }) => {
  89 |     await gotoLogin(page)
  90 |     await page.locator('a', { hasText: 'Create account' }).first().click()
  91 |     await page.waitForURL(/\/signup\b/, { timeout: 5_000 })
  92 |     expect(page.url()).toMatch(/\/signup\b/)
  93 | 
  94 |     const errors: string[] = []
  95 |     page.on('pageerror', (e) => errors.push(e.message))
  96 |     await page.waitForLoadState('domcontentloaded')
  97 |     expect(errors, 'signup page should render without JS errors').toEqual([])
  98 | })
  99 | 
```