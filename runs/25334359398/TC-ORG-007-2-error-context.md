# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> C. Create >> TC-ORG-007 — Create rejects duplicate name
- Location: tests/orgs.spec.ts:218:5

# Error details

```
SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
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
  13  | async function loginViaApi(request: APIRequestContext): Promise<string> {
  14  |     const res = await request.post(LOGIN_API, {
  15  |         data: { email: ENV.user.email, password: ENV.user.password },
  16  |         failOnStatusCode: false,
  17  |     })
  18  |     if (!res.ok()) {
  19  |         throw new Error(`POST /auth/login returned ${res.status()}`)
  20  |     }
> 21  |     const body = (await res.json()) as { access_token?: string; token?: string }
      |                   ^ SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
  22  |     const token = body.access_token ?? body.token
  23  |     if (!token) throw new Error('login response had no token')
  24  |     return token
  25  | }
  26  | 
  27  | async function ensureToken(request: APIRequestContext): Promise<string> {
  28  |     if (!cachedToken) cachedToken = loginViaApi(request)
  29  |     return cachedToken
  30  | }
  31  | 
  32  | async function seedAuth(context: BrowserContext, token: string): Promise<void> {
  33  |     await context.addInitScript(t => {
  34  |         try {
  35  |             window.localStorage.setItem('auth_token_v1', t as string)
  36  |         } catch {
  37  |             /* ignore */
  38  |         }
  39  |     }, token)
  40  | }
  41  | 
  42  | interface CreatedOrg {
  43  |     id: string
  44  |     name: string
  45  |     slug?: string
  46  | }
  47  | 
  48  | async function createTempOrg(request: APIRequestContext, token: string, name: string): Promise<CreatedOrg> {
  49  |     const res = await request.post(ORG_API, {
  50  |         headers: { Authorization: `Bearer ${token}` },
  51  |         data: { name, description: 'Created by Playwright orgs.spec.ts' },
  52  |         failOnStatusCode: false,
  53  |     })
  54  |     if (res.status() === 403 || res.status() === 402) {
  55  |         // Plan-tier restriction — surface clearly so the calling test can skip.
  56  |         throw new Error(`PLAN_BLOCKED:${res.status()}`)
  57  |     }
  58  |     if (!res.ok()) {
  59  |         const txt = await res.text().catch(() => '')
  60  |         throw new Error(`createTempOrg ${res.status()}: ${txt}`)
  61  |     }
  62  |     const data = (await res.json()) as { id: string; name: string; slug?: string }
  63  |     return { id: data.id, name: data.name, slug: data.slug }
  64  | }
  65  | 
  66  | async function deleteCurrentOrg(request: APIRequestContext, token: string): Promise<void> {
  67  |     await request.delete(ORG_API, {
  68  |         headers: { Authorization: `Bearer ${token}` },
  69  |         failOnStatusCode: false,
  70  |     })
  71  | }
  72  | 
  73  | async function gotoOrgSettings(page: Page, tab: 'general' | 'danger-zone' = 'general'): Promise<void> {
  74  |     await page.goto(`/org/settings/${tab}`)
  75  |     await page.waitForLoadState('domcontentloaded')
  76  | }
  77  | 
  78  | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  79  | 
  80  | // ============================================================
  81  | // A. Browse & Search
  82  | // ============================================================
  83  | 
  84  | test.describe('A. Browse & Search', () => {
  85  |     test('TC-ORG-001 — View organization list', async ({ page, context, request }) => {
  86  |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  87  |         const token = await ensureToken(request)
  88  |         await seedAuth(context, token)
  89  | 
  90  |         await page.goto('/organizations')
  91  |         await expect(
  92  |             page.locator('input[placeholder="Search for an organization"]'),
  93  |             'org search input should be visible',
  94  |         ).toBeVisible({ timeout: 10_000 })
  95  | 
  96  |         // Heuristic: at least one org card should render. Cards are buttons that
  97  |         // contain the org name; we filter to "real" buttons (not the new-org CTA).
  98  |         const orgButtons = page
  99  |             .locator('main button')
  100 |             .filter({ hasNotText: 'New organization' })
  101 |         await expect(
  102 |             orgButtons.first(),
  103 |             'at least one org card should be visible',
  104 |         ).toBeVisible({ timeout: 10_000 })
  105 |     })
  106 | 
  107 |     test('TC-ORG-002 — Search filters the org list', async ({ page, context, request }) => {
  108 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  109 |         const token = await ensureToken(request)
  110 |         await seedAuth(context, token)
  111 | 
  112 |         await page.goto('/organizations')
  113 |         const search = page.locator('input[placeholder="Search for an organization"]')
  114 |         await expect(search).toBeVisible({ timeout: 10_000 })
  115 | 
  116 |         const orgButtons = page.locator('main button').filter({ hasNotText: 'New organization' })
  117 |         const initialCount = await orgButtons.count()
  118 |         expect(initialCount, 'expected at least one org for search test').toBeGreaterThan(0)
  119 | 
  120 |         const noMatch = `xt-nomatch-${ts()}`
  121 |         await search.fill(noMatch)
```