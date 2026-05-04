# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> A. Browse & Search >> TC-ORG-002 — Search filters the org list
- Location: tests/orgs.spec.ts:149:5

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
      - generic [ref=e58]: v1.1.0
```

# Test source

```ts
  1   | import { test, expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | const LOGIN_API = `${ENV.apiBase}/api/v1/auth/login`
  5   | const ORG_API = `${ENV.apiBase}/api/v1/organizations`
  6   | const TOKEN_KEY = 'auth_token_v1'
  7   | 
  8   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  9   | 
  10  | /** One token per worker — avoids hammering /auth/login. */
  11  | let cachedToken: Promise<string> | null = null
  12  | 
  13  | /**
  14  |  * Log in via the JSON API. Surfaces a clear diagnostic when the response
  15  |  * is HTML (typically means apiBase points at the SPA host, not the API).
  16  |  */
  17  | async function loginViaApi(request: APIRequestContext): Promise<string> {
  18  |     const res = await request.post(LOGIN_API, {
  19  |         data: { email: ENV.user.email, password: ENV.user.password },
  20  |         failOnStatusCode: false,
  21  |     })
  22  |     const text = await res.text()
  23  |     const ctype = res.headers()['content-type'] ?? ''
  24  |     if (!res.ok()) {
  25  |         throw new Error(`POST ${LOGIN_API} returned ${res.status()}: ${text.slice(0, 200)}`)
  26  |     }
  27  |     if (!ctype.includes('json')) {
  28  |         throw new Error(
  29  |             `POST ${LOGIN_API} returned non-JSON (content-type=${ctype || '?'}). ` +
  30  |                 `apiBase is likely wrong — should target the API host (api-${ENV.name}…), ` +
  31  |                 `not the SPA host (app-${ENV.name}…). Body starts with: ${text.slice(0, 80)}`,
  32  |         )
  33  |     }
  34  |     const body = JSON.parse(text) as { access_token?: string; token?: string }
  35  |     const token = body.access_token ?? body.token
  36  |     if (!token) throw new Error('login response had no token')
  37  |     return token
  38  | }
  39  | 
  40  | /**
  41  |  * Fallback: log in via the actual UI form, then read the token the SPA
  42  |  * stored in localStorage. Slower (full page load + form submit), but
  43  |  * works even when apiBase is misconfigured because the SPA itself knows
  44  |  * the right API URL.
  45  |  */
  46  | async function loginViaUi(page: Page): Promise<string> {
  47  |     await page.goto('/login')
  48  |     await page.locator('#email').waitFor({ state: 'visible', timeout: 15_000 })
  49  |     await page.fill('#email', ENV.user.email)
  50  |     await page.fill('#password', ENV.user.password)
  51  |     await Promise.all([
> 52  |         page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 20_000 }),
      |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  53  |         page.locator('button[type="submit"]').click(),
  54  |     ])
  55  |     const token = await page.evaluate(() => window.localStorage.getItem('auth_token_v1'))
  56  |     if (!token) throw new Error('UI login completed but no auth_token_v1 in localStorage')
  57  |     return token
  58  | }
  59  | 
  60  | async function ensureToken(page: Page, request: APIRequestContext): Promise<string> {
  61  |     if (cachedToken) return cachedToken
  62  |     cachedToken = (async () => {
  63  |         try {
  64  |             return await loginViaApi(request)
  65  |         } catch (err) {
  66  |             // eslint-disable-next-line no-console
  67  |             console.warn(`[orgs.spec] API login failed, falling back to UI login: ${(err as Error).message}`)
  68  |             return await loginViaUi(page)
  69  |         }
  70  |     })()
  71  |     return cachedToken
  72  | }
  73  | 
  74  | async function seedAuth(context: BrowserContext, token: string): Promise<void> {
  75  |     await context.addInitScript(t => {
  76  |         try {
  77  |             window.localStorage.setItem('auth_token_v1', t as string)
  78  |         } catch {
  79  |             /* ignore */
  80  |         }
  81  |     }, token)
  82  | }
  83  | 
  84  | interface CreatedOrg {
  85  |     id: string
  86  |     name: string
  87  |     slug?: string
  88  | }
  89  | 
  90  | async function createTempOrg(request: APIRequestContext, token: string, name: string): Promise<CreatedOrg> {
  91  |     const res = await request.post(ORG_API, {
  92  |         headers: { Authorization: `Bearer ${token}` },
  93  |         data: { name, description: 'Created by Playwright orgs.spec.ts' },
  94  |         failOnStatusCode: false,
  95  |     })
  96  |     if (res.status() === 403 || res.status() === 402) {
  97  |         // Plan-tier restriction — surface clearly so the calling test can skip.
  98  |         throw new Error(`PLAN_BLOCKED:${res.status()}`)
  99  |     }
  100 |     if (!res.ok()) {
  101 |         const txt = await res.text().catch(() => '')
  102 |         throw new Error(`createTempOrg ${res.status()}: ${txt}`)
  103 |     }
  104 |     const data = (await res.json()) as { id: string; name: string; slug?: string }
  105 |     return { id: data.id, name: data.name, slug: data.slug }
  106 | }
  107 | 
  108 | async function deleteCurrentOrg(request: APIRequestContext, token: string): Promise<void> {
  109 |     await request.delete(ORG_API, {
  110 |         headers: { Authorization: `Bearer ${token}` },
  111 |         failOnStatusCode: false,
  112 |     })
  113 | }
  114 | 
  115 | async function gotoOrgSettings(page: Page, tab: 'general' | 'danger-zone' = 'general'): Promise<void> {
  116 |     await page.goto(`/org/settings/${tab}`)
  117 |     await page.waitForLoadState('domcontentloaded')
  118 | }
  119 | 
  120 | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  121 | 
  122 | // ============================================================
  123 | // A. Browse & Search
  124 | // ============================================================
  125 | 
  126 | test.describe('A. Browse & Search', () => {
  127 |     test('TC-ORG-001 — View organization list', async ({ page, context, request }) => {
  128 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  129 |         const token = await ensureToken(page, request)
  130 |         await seedAuth(context, token)
  131 | 
  132 |         await page.goto('/organizations')
  133 |         await expect(
  134 |             page.locator('input[placeholder="Search for an organization"]'),
  135 |             'org search input should be visible',
  136 |         ).toBeVisible({ timeout: 10_000 })
  137 | 
  138 |         // Heuristic: at least one org card should render. Cards are buttons that
  139 |         // contain the org name; we filter to "real" buttons (not the new-org CTA).
  140 |         const orgButtons = page
  141 |             .locator('main button')
  142 |             .filter({ hasNotText: 'New organization' })
  143 |         await expect(
  144 |             orgButtons.first(),
  145 |             'at least one org card should be visible',
  146 |         ).toBeVisible({ timeout: 10_000 })
  147 |     })
  148 | 
  149 |     test('TC-ORG-002 — Search filters the org list', async ({ page, context, request }) => {
  150 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  151 |         const token = await ensureToken(page, request)
  152 |         await seedAuth(context, token)
```