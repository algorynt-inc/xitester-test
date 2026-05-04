# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> H. Cross-Cutting / Regression >> TC-LI-055 — Reload /login while authenticated
- Location: tests/login.spec.ts:1099:5

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
  1009 |             const pw = body.new_password ?? body.password ?? ''
  1010 |             const errs: { msg: string }[] = []
  1011 |             if (pw.length < 8) errs.push({ msg: 'Password must be at least 8 characters.' })
  1012 |             if (!/[A-Z]/.test(pw)) errs.push({ msg: 'Password must contain an uppercase letter.' })
  1013 |             if (!/[a-z]/.test(pw)) errs.push({ msg: 'Password must contain a lowercase letter.' })
  1014 |             if (!/\d/.test(pw)) errs.push({ msg: 'Password must contain a digit.' })
  1015 |             if (pw !== pw.trim()) errs.push({ msg: 'Password must not have leading/trailing whitespace.' })
  1016 |             if (errs.length) {
  1017 |                 await route.fulfill({
  1018 |                     status: 422,
  1019 |                     contentType: 'application/json',
  1020 |                     body: JSON.stringify({ detail: errs }),
  1021 |                 })
  1022 |             } else {
  1023 |                 await route.fulfill({
  1024 |                     status: 200,
  1025 |                     contentType: 'application/json',
  1026 |                     body: JSON.stringify({ ok: true }),
  1027 |                 })
  1028 |             }
  1029 |         })
  1030 |         await page.goto('/reset-password?reset_password_token=mock-token')
  1031 |         // ResetPassword.tsx ids: #new-password, #confirm-password.
  1032 |         const violations = ['short1A', 'alllower1!', 'ALLUPPER1!', 'NoDigit!a', ' Trailing1!  ']
  1033 |         for (const pw of violations) {
  1034 |             await page.fill('#new-password', pw)
  1035 |             await page.fill('#confirm-password', pw)
  1036 |             await page.click('button[type="submit"]')
  1037 |             await page.waitForTimeout(300)
  1038 |             // Submit must NOT have completed successfully — URL stays on /reset-password.
  1039 |             expect(page.url()).toContain('/reset-password')
  1040 |         }
  1041 |     })
  1042 | 
  1043 |     test('TC-LI-052 — Reset password success → redirect', async ({ page }) => {
  1044 |         await page.route(RESET_PASSWORD_API, async (route: Route) => {
  1045 |             await route.fulfill({
  1046 |                 status: 200,
  1047 |                 contentType: 'application/json',
  1048 |                 body: JSON.stringify({ ok: true }),
  1049 |             })
  1050 |         })
  1051 |         await page.goto('/reset-password?reset_password_token=mock-token')
  1052 |         const newPw = 'StrongPass123!'
  1053 |         await page.fill('#new-password', newPw)
  1054 |         await page.fill('#confirm-password', newPw)
  1055 |         await page.click('button[type="submit"]')
  1056 |         // ResetPassword.tsx navigates to "/?reset=success" after a 2-second delay.
  1057 |         await page.waitForURL((url) => url.searchParams.get('reset') === 'success', { timeout: 8_000 })
  1058 |         expect(page.url()).toContain('reset=success')
  1059 |     })
  1060 | 
  1061 |     test('TC-LI-053 — Reset password expired/invalid token', async ({ page }) => {
  1062 |         await page.route(RESET_PASSWORD_API, async (route: Route) => {
  1063 |             await route.fulfill({
  1064 |                 status: 400,
  1065 |                 contentType: 'application/json',
  1066 |                 body: JSON.stringify({ detail: 'Invalid or expired token' }),
  1067 |             })
  1068 |         })
  1069 |         await page.goto('/reset-password?reset_password_token=expired-or-bogus')
  1070 |         await page.fill('#new-password', 'StrongPass123!')
  1071 |         await page.fill('#confirm-password', 'StrongPass123!')
  1072 |         await page.click('button[type="submit"]')
  1073 |         await expect(page.getByText(/invalid|expired|token|failed to reset/i).first()).toBeVisible({
  1074 |             timeout: 6_000,
  1075 |         })
  1076 |         expect(page.url()).toContain('/reset-password')
  1077 |     })
  1078 | })
  1079 | 
  1080 | // =====================================================================
  1081 | // H. Cross-Cutting / Regression
  1082 | // =====================================================================
  1083 | 
  1084 | test.describe('H. Cross-Cutting / Regression', () => {
  1085 |     test('TC-LI-054 — Browser back after login', async ({ page, context }) => {
  1086 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  1087 |         // Authed via API to avoid burning the backend's login rate-limit budget. The flow
  1088 |         // we verify here is "after authed nav, Back must not land on /login".
  1089 |         await seedAuthedContext(context)
  1090 |         await page.goto('/dashboard')
  1091 |         await page.waitForLoadState('networkidle')
  1092 |         await page.goto('/login')
  1093 |         await page.waitForLoadState('networkidle')
  1094 |         await page.goBack()
  1095 |         await page.waitForLoadState('networkidle')
  1096 |         expect(page.url()).not.toContain('/login')
  1097 |     })
  1098 | 
  1099 |     test('TC-LI-055 — Reload /login while authenticated', async ({ page, context }) => {
  1100 |         test.skip(!(await canLogIn()), SKIP_NO_CREDS)
  1101 |         await seedAuthedContext(context)
  1102 |         // Warm up the auth context with a non-login page first so isAuthenticated is true
  1103 |         // before we visit /login. (Going straight to /login can race the auth bootstrap.)
  1104 |         await page.goto('/dashboard')
  1105 |         await page.waitForLoadState('networkidle')
  1106 |         await page.goto('/login')
  1107 |         await page.reload()
  1108 |         await page.waitForLoadState('networkidle')
> 1109 |         expect(page.url()).not.toContain('/login')
       |                                ^ Error: expect(received).not.toContain(expected) // indexOf
  1110 |     })
  1111 | 
  1112 |     test('TC-LI-056 — Console-clean page load', async ({ page }) => {
  1113 |         // Logged-out /login legitimately gets 401s on bootstrap calls (e.g. /me) and may surface
  1114 |         // PostHog config warnings on local dev — those are environment noise, not page bugs.
  1115 |         const expectedNoise = [
  1116 |             /\bPostHog\b/i,
  1117 |             /401\b/,
  1118 |             /Failed to load resource:.*401/i,
  1119 |             /Unauthorized/i,
  1120 |         ]
  1121 |         const isNoise = (line: string) => expectedNoise.some((re) => re.test(line))
  1122 | 
  1123 |         const errors: string[] = []
  1124 |         const failedAssets: string[] = []
  1125 |         page.on('console', (msg) => {
  1126 |             if (msg.type() === 'error') {
  1127 |                 const text = msg.text()
  1128 |                 if (!isNoise(text)) errors.push(text)
  1129 |             }
  1130 |         })
  1131 |         page.on('response', (resp) => {
  1132 |             const u = resp.url()
  1133 |             if (resp.status() === 404 && /\.(svg|png|css|js|woff2?|ico)(\?|$)/.test(u)) {
  1134 |                 failedAssets.push(`${resp.status()} ${u}`)
  1135 |             }
  1136 |         })
  1137 |         await gotoLogin(page)
  1138 |         await page.waitForLoadState('networkidle')
  1139 |         expect(errors, `Unexpected console errors:\n${errors.join('\n')}`).toEqual([])
  1140 |         expect(failedAssets, `Asset 404s:\n${failedAssets.join('\n')}`).toEqual([])
  1141 |     })
  1142 | 
  1143 |     test('TC-LI-057 — Mobile viewport (375x812) @mobile', async ({ page }) => {
  1144 |         await page.setViewportSize({ width: 375, height: 812 })
  1145 |         await gotoLogin(page)
  1146 |         await expect(page.locator('#email')).toBeVisible()
  1147 |         await expect(page.locator('#password')).toBeVisible()
  1148 |         await expect(page.locator('button[type="submit"]')).toBeVisible()
  1149 |         const submitBox = await page.locator('button[type="submit"]').boundingBox()
  1150 |         expect(submitBox?.height ?? 0).toBeGreaterThanOrEqual(40)
  1151 |         const hasHorizontalScroll = await page.evaluate(
  1152 |             () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  1153 |         )
  1154 |         expect(hasHorizontalScroll).toBe(false)
  1155 |     })
  1156 | })
  1157 | 
```