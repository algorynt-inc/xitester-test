# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> TC-PF-007 — Wrong current password is rejected
- Location: tests/profile.spec.ts:225:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/(current password.*incorrect|invalid current|wrong.*password)/i).first().or(locator('[data-sonner-toaster]').getByText(/(current password|incorrect|invalid|failed to update)/i).first())
Expected: visible
Error: strict mode violation: getByText(/(current password.*incorrect|invalid current|wrong.*password)/i).first().or(locator('[data-sonner-toaster]').getByText(/(current password|incorrect|invalid|failed to update)/i).first()) resolved to 2 elements:
    1) <div class="" data-title="">Incorrect current password</div> aka getByLabel('Notifications alt+T').getByText('Incorrect current password')
    2) <div>…</div> aka getByText('Current passwordIncorrect')

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for getByText(/(current password.*incorrect|invalid current|wrong.*password)/i).first().or(locator('[data-sonner-toaster]').getByText(/(current password|incorrect|invalid|failed to update)/i).first())

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e3]:
        - button "Close toast" [ref=e4] [cursor=pointer]:
          - img [ref=e5]
        - img [ref=e9]
        - generic [ref=e12]: Incorrect current password
  - generic [ref=e13]:
    - banner [ref=e14]:
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]: Account
      - generic [ref=e21]:
        - button "Search... ⌘K" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
          - generic [ref=e26]: Search...
          - generic [ref=e27]: ⌘K
        - generic [ref=e28]:
          - button "Help" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
          - button "Notifications" [ref=e33] [cursor=pointer]:
            - img [ref=e34]
            - generic [ref=e37]: 99+
        - generic [ref=e39]:
          - generic [ref=e40]: DEV
          - generic [ref=e41]: v1.1.0
          - button "A" [ref=e42] [cursor=pointer]
    - generic [ref=e43]:
      - complementary [ref=e44]:
        - button "Back to dashboard" [ref=e45] [cursor=pointer]:
          - img [ref=e46]
          - text: Back to dashboard
        - generic [ref=e48]:
          - paragraph [ref=e49]: ACCOUNT SETTINGS
          - navigation [ref=e50]:
            - button "Preferences" [ref=e51] [cursor=pointer]
            - button "Security" [ref=e52] [cursor=pointer]
            - button "Connected Accounts" [ref=e53] [cursor=pointer]
      - main [ref=e54]:
        - generic [ref=e55]:
          - heading "Security" [level=1] [ref=e56]
          - paragraph [ref=e57]: Manage your password and two-factor authentication.
          - heading "Authentication methods" [level=2] [ref=e58]
          - generic [ref=e59]:
            - generic [ref=e60]:
              - generic [ref=e61]:
                - paragraph [ref=e62]: Password
                - paragraph [ref=e63]: A password is set for your account
              - generic [ref=e64]: Set
            - generic [ref=e65]:
              - paragraph [ref=e66]: Change password
              - generic [ref=e67]:
                - generic [ref=e68]:
                  - generic [ref=e69]: Current password
                  - textbox [ref=e70]: definitely-not-the-current-password
                  - paragraph [ref=e71]: Incorrect current password
                - generic [ref=e72]:
                  - generic [ref=e73]: New password
                  - textbox [ref=e74]: Xt-20260507164404!
                - generic [ref=e75]:
                  - generic [ref=e76]: Confirm new password
                  - textbox [ref=e77]: Xt-20260507164404!
                - button "Update password" [ref=e78] [cursor=pointer]
          - heading "Active sessions" [level=2] [ref=e79]:
            - img [ref=e80]
            - text: Active sessions
          - generic [ref=e82]:
            - generic [ref=e83]:
              - paragraph [ref=e84]: Devices where your account is currently signed in.
              - generic [ref=e85]:
                - button "Sign out all others" [ref=e86] [cursor=pointer]
                - button "Refresh" [ref=e87] [cursor=pointer]:
                  - img [ref=e88]
            - generic [ref=e93]:
              - generic [ref=e94]:
                - img [ref=e96]
                - generic [ref=e98]:
                  - generic [ref=e99]:
                    - paragraph [ref=e100]: Chrome on Linux
                    - generic [ref=e101]: This device
                  - generic [ref=e102]:
                    - generic [ref=e103]:
                      - img [ref=e104]
                      - text: 52.159.247.57
                    - generic [ref=e107]: May 7, 4:42 PM
              - generic [ref=e108]:
                - img [ref=e110]
                - generic [ref=e112]:
                  - paragraph [ref=e114]: Chrome on Windows
                  - generic [ref=e115]:
                    - generic [ref=e116]:
                      - img [ref=e117]
                      - text: 103.148.20.70
                    - generic [ref=e120]: May 6, 9:28 AM
                - button "Revoke" [ref=e121] [cursor=pointer]:
                  - img [ref=e122]
                  - text: Revoke
              - generic [ref=e125]:
                - img [ref=e127]
                - generic [ref=e129]:
                  - paragraph [ref=e131]: Chrome on Windows
                  - generic [ref=e132]:
                    - generic [ref=e133]:
                      - img [ref=e134]
                      - text: 103.184.239.25
                    - generic [ref=e137]: May 5, 2:33 PM
                - button "Revoke" [ref=e138] [cursor=pointer]:
                  - img [ref=e139]
                  - text: Revoke
              - generic [ref=e142]:
                - img [ref=e144]
                - generic [ref=e146]:
                  - paragraph [ref=e148]: Chrome on macOS
                  - generic [ref=e149]:
                    - generic [ref=e150]:
                      - img [ref=e151]
                      - text: 103.161.144.216
                    - generic [ref=e154]: May 5, 9:55 AM
                - button "Revoke" [ref=e155] [cursor=pointer]:
                  - img [ref=e156]
                  - text: Revoke
```

# Test source

```ts
  145 |     const renamed = `qa-name-${ts()}`
  146 | 
  147 |     // Forward: rename to renamed.
  148 |     await nameInput.fill(renamed)
  149 |     await Promise.all([
  150 |         page.waitForResponse(r => /\/api\/v1\/auth\/me\b/.test(r.url()) && r.request().method() === 'PUT'),
  151 |         page.locator('button', { hasText: /^Save$/ }).first().click(),
  152 |     ])
  153 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/profile updated/i, { timeout: 5_000 })
  154 |     await expect(nameInput).toHaveValue(renamed)
  155 | 
  156 |     // Revert.
  157 |     await nameInput.fill(original)
  158 |     await Promise.all([
  159 |         page.waitForResponse(r => /\/api\/v1\/auth\/me\b/.test(r.url()) && r.request().method() === 'PUT'),
  160 |         page.locator('button', { hasText: /^Save$/ }).first().click(),
  161 |     ])
  162 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/profile updated/i, { timeout: 5_000 })
  163 |     await expect(nameInput).toHaveValue(original)
  164 | })
  165 | 
  166 | // ============================================================
  167 | // Profile — Security
  168 | // ============================================================
  169 | 
  170 | async function fillPasswordFields(
  171 |     page: Page,
  172 |     current: string,
  173 |     next: string,
  174 |     confirm: string,
  175 | ): Promise<void> {
  176 |     // The form has three labelled password inputs in this order:
  177 |     //   "Current password", "New password", "Confirm new password".
  178 |     const inputs = page.locator('input[type="password"]')
  179 |     await inputs.nth(0).fill(current)
  180 |     await inputs.nth(1).fill(next)
  181 |     await inputs.nth(2).fill(confirm)
  182 | }
  183 | 
  184 | test('TC-PF-006 — Update password and revert (destructive)', async ({ page }) => {
  185 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  186 |     // This test changes the user's actual password and tries to revert it.
  187 |     // If the revert step fails the credentials in GitHub Secrets become
  188 |     // stale until manually rotated. Default-skipped; opt in via env var.
  189 |     test.skip(
  190 |         !process.env.XT_RUN_DESTRUCTIVE,
  191 |         'Destructive: changes the test user password. Set XT_RUN_DESTRUCTIVE=1 to run.',
  192 |     )
  193 | 
  194 |     await gotoProfile(page, 'security')
  195 |     const tempPwd = `Xt-${ts()}!`
  196 | 
  197 |     // Forward: original → tempPwd.
  198 |     await fillPasswordFields(page, ENV.user.password, tempPwd, tempPwd)
  199 |     await Promise.all([
  200 |         page.waitForResponse(
  201 |             r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
  202 |         ),
  203 |         page.locator('button', { hasText: /^Update password$/ }).click(),
  204 |     ])
  205 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  206 |         /password updated successfully/i,
  207 |         { timeout: 8_000 },
  208 |     )
  209 | 
  210 |     // Revert: tempPwd → original. Critical — if this fails, the secret in
  211 |     // GitHub Environments doesn't match the live password anymore.
  212 |     await fillPasswordFields(page, tempPwd, ENV.user.password, ENV.user.password)
  213 |     await Promise.all([
  214 |         page.waitForResponse(
  215 |             r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
  216 |         ),
  217 |         page.locator('button', { hasText: /^Update password$/ }).click(),
  218 |     ])
  219 |     await expect(
  220 |         page.locator('[data-sonner-toaster]'),
  221 |         'CRITICAL: revert step failed — the live password is now ' + tempPwd,
  222 |     ).toContainText(/password updated successfully/i, { timeout: 8_000 })
  223 | })
  224 | 
  225 | test('TC-PF-007 — Wrong current password is rejected', async ({ page }) => {
  226 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  227 | 
  228 |     await gotoProfile(page, 'security')
  229 |     const validNew = `Xt-${ts()}!`
  230 | 
  231 |     await fillPasswordFields(page, 'definitely-not-the-current-password', validNew, validNew)
  232 |     await Promise.all([
  233 |         page.waitForResponse(
  234 |             r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
  235 |         ),
  236 |         page.locator('button', { hasText: /^Update password$/ }).click(),
  237 |     ])
  238 | 
  239 |     // The SUT maps wrong-current to a per-field error or a generic
  240 |     // toast. Match either, including the SUT's known fallback strings.
  241 |     const fieldErr = page.getByText(/(current password.*incorrect|invalid current|wrong.*password)/i).first()
  242 |     const toast = page.locator('[data-sonner-toaster]').getByText(
  243 |         /(current password|incorrect|invalid|failed to update)/i,
  244 |     ).first()
> 245 |     await expect(fieldErr.or(toast)).toBeVisible({ timeout: 8_000 })
      |                                      ^ Error: expect(locator).toBeVisible() failed
  246 | })
  247 | 
  248 | test('TC-PF-008 — Mismatched new + confirm disables Save', async ({ page }) => {
  249 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  250 | 
  251 |     await gotoProfile(page, 'security')
  252 |     await fillPasswordFields(page, ENV.user.password, 'Xitester-A1!', 'Xitester-B2!')
  253 | 
  254 |     // The SUT disables Update password when newPassword !== confirmPassword
  255 |     // (see AccountPage.tsx: disabled={... || newPassword !== confirmPassword}).
  256 |     const updateBtn = page.locator('button', { hasText: /^Update password$/ })
  257 |     await expect(updateBtn, 'Save should be disabled when new ≠ confirm').toBeDisabled({ timeout: 3_000 })
  258 | 
  259 |     // Optionally — match-up enables it again.
  260 |     const inputs = page.locator('input[type="password"]')
  261 |     await inputs.nth(2).fill('Xitester-A1!')
  262 |     await expect(updateBtn).toBeEnabled({ timeout: 3_000 })
  263 | })
  264 | 
  265 | test('TC-PF-009 — Weak (short) password disables Save', async ({ page }) => {
  266 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  267 | 
  268 |     await gotoProfile(page, 'security')
  269 |     // Client-side rule: newPassword.length >= 8. Anything shorter must
  270 |     // keep the Save button disabled.
  271 |     await fillPasswordFields(page, ENV.user.password, '12345', '12345')
  272 | 
  273 |     const updateBtn = page.locator('button', { hasText: /^Update password$/ })
  274 |     await expect(updateBtn, 'Save should be disabled when new password < 8 chars').toBeDisabled({
  275 |         timeout: 3_000,
  276 |     })
  277 | 
  278 |     // The SUT should explicitly hint at the requirement somewhere on the page.
  279 |     // Match the actual SUT helper text or the eventual toast/server error.
  280 |     await expect(
  281 |         page.getByText(/(at least 8|minimum 8|password.*8 character)/i).first(),
  282 |     ).toBeVisible({ timeout: 3_000 })
  283 | })
  284 | 
```