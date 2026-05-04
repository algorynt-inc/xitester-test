# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> B. Happy Path & Redirect Logic >> TC-LI-011 — Authenticated user visits /login
- Location: tests/login.spec.ts:227:5

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "/login"
Received string:        "https://app-dev.ai.xitester.com/login"
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
              - textbox "Email" [ref=e24]
            - generic [ref=e25]:
              - generic [ref=e26]: Password
              - textbox "Password" [ref=e27]
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
  134 | 
  135 |     test('TC-LI-004 — Password only, email empty', async ({ page }) => {
  136 |         const watcher = await captureLoginRequest(page)
  137 |         await gotoLogin(page)
  138 |         await page.fill('#password', 'anything')
  139 |         await page.click('button[type="submit"]')
  140 |         await page.waitForTimeout(400)
  141 |         expect(await isInvalid(page, '#email')).toBe(true)
  142 |         expect(watcher.fired()).toBe(false)
  143 |     })
  144 | 
  145 |     test('TC-LI-005 — Whitespace-only credentials', async ({ page }) => {
  146 |         await gotoLogin(page)
  147 |         await page.fill('#email', '   ')
  148 |         await page.fill('#password', '   ')
  149 |         await page.click('button[type="submit"]')
  150 |         // Either HTML5 rejects, OR backend 422; in both cases URL must not change.
  151 |         await page.waitForTimeout(800)
  152 |         expect(page.url()).toContain('/login')
  153 |     })
  154 | })
  155 | 
  156 | // =====================================================================
  157 | // B. Happy Path & Redirect Logic
  158 | // =====================================================================
  159 | 
  160 | test.describe('B. Happy Path & Redirect Logic', () => {
  161 |     // The three real-UI-login cases below run sequentially so we don't burst the backend's
  162 |     // LOGIN_RATE_LIMIT_MAX_ATTEMPTS=10/300s budget when the suite parallelizes.
  163 |     test.describe.configure({ mode: 'serial' })
  164 | 
  165 |     test('TC-LI-006 — Valid creds, single-org user → default landing', async ({ page }) => {
  166 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  167 |         await gotoLogin(page)
  168 |         await page.fill('#email', ENV.user.email)
  169 |         await page.fill('#password', ENV.user.password)
  170 |         await page.click('button[type="submit"]')
  171 |         await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 })
  172 |         // Should land somewhere sensible (org picker, /settings/ai, or a redirectTo).
  173 |         expect(page.url()).not.toContain('/login')
  174 |     })
  175 | 
  176 |     test('TC-LI-007 — Valid creds, multi-org user → org picker', async ({ page }) => {
  177 |         test.skip(!ENV.multiOrgUser, 'multiOrgUser not configured for this environment')
  178 |         await gotoLogin(page)
  179 |         await page.fill('#email', ENV.multiOrgUser!.email)
  180 |         await page.fill('#password', ENV.multiOrgUser!.password)
  181 |         await page.click('button[type="submit"]')
  182 |         await page.waitForURL('**/organizations', { timeout: 15_000 })
  183 |         expect(page.url()).toContain('/organizations')
  184 |     })
  185 | 
  186 |     test('TC-LI-008 — Login with `?redirect=/some/path`', async ({ page }) => {
  187 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  188 |         await gotoLogin(page, 'redirect=/api-tester/collections')
  189 |         await page.fill('#email', ENV.user.email)
  190 |         await page.fill('#password', ENV.user.password)
  191 |         await page.click('button[type="submit"]')
  192 |         // Match by pathname — glob like '**/api-tester/collections' would also match the
  193 |         // pre-login URL because its query string contains that path.
  194 |         await page.waitForURL((url) => url.pathname === '/api-tester/collections', {
  195 |             timeout: 15_000,
  196 |         })
  197 |         expect(page.url()).toContain('/api-tester/collections')
  198 |         expect(page.url()).not.toContain('redirect=')
  199 |     })
  200 | 
  201 |     test('TC-LI-009 — Guest flow with allowed redirect_url + prompt', async ({ page }) => {
  202 |         test.skip(!ENV.allowedRedirectUrl, 'allowedRedirectUrl not configured for this environment')
  203 |         const target = ENV.allowedRedirectUrl!
  204 |         const q = `redirect_url=${encodeURIComponent(target)}&prompt=hello%20world`
  205 |         await gotoLogin(page, q)
  206 |         await page.fill('#email', ENV.user.email)
  207 |         await page.fill('#password', ENV.user.password)
  208 |         await Promise.all([
  209 |             page.waitForURL((url) => url.toString().startsWith(target), { timeout: 15_000 }),
  210 |             page.click('button[type="submit"]'),
  211 |         ])
  212 |         const finalUrl = page.url()
  213 |         expect(finalUrl.startsWith(target)).toBe(true)
  214 |         expect(finalUrl).toContain('prompt=hello%20world')
  215 |     })
  216 | 
  217 |     test('TC-LI-010 — Guest flow with disallowed redirect_url', async ({ page }) => {
  218 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  219 |         await gotoLogin(page, 'redirect_url=https://malicious.example.com/x')
  220 |         await page.fill('#email', ENV.user.email)
  221 |         await page.fill('#password', ENV.user.password)
  222 |         await page.click('button[type="submit"]')
  223 |         await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 15_000 })
  224 |         expect(page.url()).not.toContain('malicious.example.com')
  225 |     })
  226 | 
  227 |     test('TC-LI-011 — Authenticated user visits /login', async ({ page, context }) => {
  228 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  229 |         // Seed authenticated context via API (no UI form) so this test doesn't compete with
  230 |         // TC-LI-006/008/010 for the rate-limit budget.
  231 |         await seedAuthedContext(context)
  232 |         await page.goto('/login')
  233 |         await page.waitForLoadState('networkidle')
> 234 |         expect(page.url()).not.toContain('/login')
      |                                ^ Error: expect(received).not.toContain(expected) // indexOf
  235 |     })
  236 | 
  237 |     test('TC-LI-012 — `?reset=success` query toast', async ({ page }) => {
  238 |         await gotoLogin(page, 'reset=success')
  239 |         // Sonner renders a visible toast + an off-screen aria-live duplicate, so use .first().
  240 |         await expect(
  241 |             page.getByText('Password has been reset. You can now sign in.').first(),
  242 |         ).toBeVisible({ timeout: 6_000 })
  243 |         await page.waitForTimeout(500)
  244 |         expect(page.url()).not.toContain('reset=success')
  245 |     })
  246 | 
  247 |     test('TC-LI-013 — `?verified=success` preserves guest params', async ({ page }) => {
  248 |         await gotoLogin(
  249 |             page,
  250 |             'verified=success&redirect_url=https://allowed.example.com/x&prompt=foo',
  251 |         )
  252 |         await expect(
  253 |             page.getByText('Email verified. You can now sign in.').first(),
  254 |         ).toBeVisible({ timeout: 6_000 })
  255 |         await page.waitForTimeout(500)
  256 |         const url = page.url()
  257 |         expect(url).not.toContain('verified=success')
  258 |         expect(url).toContain('redirect_url=')
  259 |         expect(url).toContain('prompt=foo')
  260 |     })
  261 | })
  262 | 
  263 | // =====================================================================
  264 | // C. Authentication Errors
  265 | // =====================================================================
  266 | 
  267 | test.describe('C. Authentication Errors', () => {
  268 |     test('TC-LI-014 — Wrong password', async ({ page }) => {
  269 |         // Mock the 401 instead of hitting the backend so we don't burn the
  270 |         // LOGIN_RATE_LIMIT_MAX_ATTEMPTS=10/300s budget across the suite.
  271 |         await page.route(LOGIN_API, async (route: Route) => {
  272 |             await route.fulfill({
  273 |                 status: 401,
  274 |                 contentType: 'application/json',
  275 |                 body: JSON.stringify({ detail: 'Incorrect email or password' }),
  276 |             })
  277 |         })
  278 |         await gotoLogin(page)
  279 |         await page.fill('#email', ENV.user.email)
  280 |         await page.fill('#password', 'definitely-wrong-pw-99!')
  281 |         await page.click('button[type="submit"]')
  282 |         await expect(page.getByText(/login failed|invalid|incorrect|password/i).first()).toBeVisible({
  283 |             timeout: 8_000,
  284 |         })
  285 |         expect(page.url()).toContain('/login')
  286 |         await expect(page.locator('button[type="submit"]')).toBeEnabled()
  287 |         await expect(page.locator('#email')).toHaveValue(ENV.user.email)
  288 |     })
  289 | 
  290 |     test('TC-LI-015 — Non-existent email (do-not-leak)', async ({ page }) => {
  291 |         // Mocked for the same rate-limit reason as TC-LI-014.
  292 |         await page.route(LOGIN_API, async (route: Route) => {
  293 |             await route.fulfill({
  294 |                 status: 401,
  295 |                 contentType: 'application/json',
  296 |                 body: JSON.stringify({ detail: 'Incorrect email or password' }),
  297 |             })
  298 |         })
  299 |         await gotoLogin(page)
  300 |         await page.fill('#email', `does-not-exist-${Date.now()}@example.com`)
  301 |         await page.fill('#password', 'AnyPassword1!')
  302 |         await page.click('button[type="submit"]')
  303 |         await expect(page.getByText(/login failed|invalid|incorrect|password/i).first()).toBeVisible({
  304 |             timeout: 8_000,
  305 |         })
  306 |         expect(page.url()).toContain('/login')
  307 |     })
  308 | 
  309 |     test('TC-LI-016 — Backend 422 validation error', async ({ page }) => {
  310 |         await page.route(LOGIN_API, async (route: Route) => {
  311 |             await route.fulfill({
  312 |                 status: 422,
  313 |                 contentType: 'application/json',
  314 |                 body: JSON.stringify({
  315 |                     detail: [{ msg: 'Please enter a valid email address.', loc: ['body', 'email'] }],
  316 |                 }),
  317 |             })
  318 |         })
  319 |         await gotoLogin(page)
  320 |         await page.fill('#email', 'not-an-email')
  321 |         await page.fill('#password', 'anything')
  322 |         // Bypass HTML5 native validation by flipping noValidate on the form just before submit.
  323 |         // (Input-level removeAttribute is reverted by React's next render; form.noValidate sticks
  324 |         // because nothing in the JSX touches it.)
  325 |         await page.evaluate(() => {
  326 |             const form = document.querySelector<HTMLFormElement>('form')
  327 |             if (form) form.noValidate = true
  328 |         })
  329 |         await page.click('button[type="submit"]')
  330 |         await expect(page.getByText('Please enter a valid email address.').first()).toBeVisible({
  331 |             timeout: 6_000,
  332 |         })
  333 |     })
  334 | 
```