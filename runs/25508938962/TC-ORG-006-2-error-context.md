# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-006 — Delete an organization via danger zone
- Location: tests/orgs.spec.ts:246:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div[role="dialog"] input').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div[role="dialog"] input').first()

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
          - generic [ref=e10]: You're on the Free plan (15 Days Left)
          - generic [ref=e11]: — unlock full access
        - button "Upgrade" [ref=e12] [cursor=pointer]:
          - text: Upgrade
          - img [ref=e13]
      - generic [ref=e15]:
        - img "Xitester" [ref=e17]
        - generic [ref=e18]:
          - generic [ref=e19]: /
          - generic [ref=e20]:
            - button "qa-del-20260507163629 Free" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: qa-del-20260507163629
              - generic [ref=e27]: Free
            - button [ref=e28] [cursor=pointer]:
              - img [ref=e29]
          - generic [ref=e32]: /
          - generic [ref=e33]: Organization
      - generic [ref=e34]:
        - button "Search... ⌘K" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
          - generic [ref=e39]: Search...
          - generic [ref=e40]: ⌘K
        - generic [ref=e41]:
          - button "Help" [ref=e42] [cursor=pointer]:
            - img [ref=e43]
          - button "Notifications" [ref=e46] [cursor=pointer]:
            - img [ref=e47]
        - generic [ref=e51]:
          - generic [ref=e52]: DEV
          - generic [ref=e53]: v1.1.0
          - button "A" [ref=e54] [cursor=pointer]
    - generic [ref=e55]:
      - complementary:
        - navigation [ref=e56]:
          - button "Projects" [ref=e57] [cursor=pointer]:
            - img [ref=e59]
            - generic: Projects
          - button "Team" [ref=e61] [cursor=pointer]:
            - img [ref=e63]
            - generic: Team
          - button "Integrations" [ref=e68] [cursor=pointer]:
            - img [ref=e70]
            - generic: Integrations
          - button "Usage" [ref=e72] [cursor=pointer]:
            - img [ref=e74]
            - generic: Usage
          - button "Billing" [ref=e76] [cursor=pointer]:
            - img [ref=e78]
            - generic: Billing
          - button "Organization Settings" [ref=e80] [cursor=pointer]:
            - img [ref=e82]
            - generic: Organization Settings
        - button "Logout" [ref=e87] [cursor=pointer]:
          - img [ref=e89]
          - generic: Logout
      - main [ref=e93]:
        - generic [ref=e94]:
          - complementary [ref=e95]:
            - heading "Settings" [level=2] [ref=e97]
            - navigation [ref=e99]:
              - button "General" [ref=e100] [cursor=pointer]:
                - img [ref=e101]
                - generic [ref=e105]: General
              - button "Test Execution" [ref=e106] [cursor=pointer]:
                - img [ref=e107]
                - generic [ref=e110]: Test Execution
              - button "Email Notification" [ref=e111] [cursor=pointer]:
                - img [ref=e112]
                - generic [ref=e115]: Email Notification
              - button "Audit Trail" [ref=e116] [cursor=pointer]:
                - img [ref=e117]
                - generic [ref=e120]: Audit Trail
              - button "Danger Zone" [ref=e121] [cursor=pointer]:
                - img [ref=e122]
                - generic [ref=e124]: Danger Zone
          - main [ref=e125]:
            - generic [ref=e127]:
              - heading "Danger Zone" [level=1] [ref=e128]
              - paragraph [ref=e129]: Irreversible actions for your organization. Proceed with caution.
            - generic [ref=e130]:
              - generic [ref=e133]:
                - generic [ref=e134]:
                  - heading "Delete this organization" [level=3] [ref=e135]
                  - paragraph [ref=e136]: "Once you delete an organization, there is no going back. This will permanently delete:"
                  - list [ref=e137]:
                    - listitem [ref=e138]: All test cases and their analysis history
                    - listitem [ref=e139]: All test plans, schedules, and run results
                    - listitem [ref=e140]: All test scripts and execution recordings
                    - listitem [ref=e141]: All environments and variables
                    - listitem [ref=e142]: All discovery sessions and benchmark data
                    - listitem [ref=e143]: All uploaded files and screenshots
                  - paragraph [ref=e144]:
                    - text: Team member accounts will
                    - strong [ref=e145]: NOT
                    - text: be deleted — they will be removed from this organization only.
                - button "Delete this organization" [ref=e147] [cursor=pointer]
              - alertdialog "Delete Organization" [ref=e150]:
                - button "Close" [ref=e151] [cursor=pointer]:
                  - img [ref=e152]
                - generic [ref=e155]:
                  - img [ref=e157]
                  - heading "Delete Organization" [level=2] [ref=e161]
                  - generic [ref=e162]:
                    - text: This will permanently delete
                    - strong [ref=e163]: "\"qa-del-20260507163629\""
                    - text: and all of its data. This action cannot be undone.
                  - generic [ref=e164]:
                    - generic [ref=e165]: "Type qa-del-20260507163629 to confirm:"
                    - textbox "qa-del-20260507163629" [active] [ref=e166]
                  - generic [ref=e167]:
                    - button "Cancel" [ref=e168] [cursor=pointer]
                    - button "Delete Organization" [disabled] [ref=e169]
```

# Test source

```ts
  166 |     await page.goto('/org/settings/general')
  167 | 
  168 |     const orgName = page.locator('#orgName')
  169 |     const orgSlug = page.locator('#orgSlug')
  170 |     const orgDescription = page.locator('#orgDescription')
  171 | 
  172 |     await expect(orgName).toBeVisible({ timeout: 10_000 })
  173 |     await expect(orgSlug).toBeVisible()
  174 |     await expect(orgDescription).toBeVisible()
  175 | 
  176 |     await expect(orgName).not.toHaveValue('')
  177 |     await expect(orgSlug).not.toHaveValue('')
  178 |     await expect(orgSlug).toHaveAttribute('readonly', '')
  179 | })
  180 | 
  181 | test('TC-ORG-004 — Create a new organization', async ({ page }) => {
  182 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  183 |     const tempName = `qa-tmp-${ts()}`
  184 | 
  185 |     try {
  186 |         await uiCreateOrg(page, tempName, 'Created by Playwright TC-ORG-004')
  187 |     } catch (err) {
  188 |         if ((err as Error).message.startsWith(PLAN_BLOCKED)) {
  189 |             test.skip(
  190 |                 true,
  191 |                 `Org creation blocked (${(err as Error).message}). The dev env may have hit ` +
  192 |                     'the 10-org cap — manually delete leftover qa-tmp-* / qa-del-* / qa-dup-* orgs in the SUT, then retry.',
  193 |             )
  194 |             return
  195 |         }
  196 |         throw err
  197 |     }
  198 | 
  199 |     // The new org should be visible somewhere on the page (org list or top bar).
  200 |     await page.goto('/organizations')
  201 |     await expect(
  202 |         orgListScope(page).locator('button', { hasText: tempName }).first(),
  203 |     ).toBeVisible({ timeout: 8_000 })
  204 | 
  205 |     // Cleanup via UI — switch to the org and delete it.
  206 |     await uiSwitchToOrg(page, tempName)
  207 |     await uiDeleteOrg(page, tempName)
  208 | })
  209 | 
  210 | test('TC-ORG-005 — Update organization name', async ({ page }) => {
  211 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  212 |     const tempName = `qa-tmp-${ts()}`
  213 | 
  214 |     try {
  215 |         await uiCreateOrg(page, tempName)
  216 |     } catch (err) {
  217 |         if ((err as Error).message === PLAN_BLOCKED) {
  218 |             test.skip(true, 'Org creation disabled — plan tier.')
  219 |             return
  220 |         }
  221 |         throw err
  222 |     }
  223 |     await uiSwitchToOrg(page, tempName)
  224 | 
  225 |     await page.goto('/org/settings/general')
  226 |     const nameInput = page.locator('#orgName')
  227 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
  228 | 
  229 |     const newName = `qa-renamed-${ts()}`
  230 |     await nameInput.fill(newName)
  231 | 
  232 |     const save = page.locator('button', { hasText: 'Save Changes' }).first()
  233 |     const [response] = await Promise.all([
  234 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'PUT'),
  235 |         save.click(),
  236 |     ])
  237 |     expect(response.status()).toBe(200)
  238 | 
  239 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/updated successfully/i, { timeout: 5_000 })
  240 |     await expect(save).toBeDisabled({ timeout: 3_000 })
  241 | 
  242 |     // Cleanup
  243 |     await uiDeleteOrg(page, newName)
  244 | })
  245 | 
  246 | test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
  247 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  248 |     const tempName = `qa-del-${ts()}`
  249 | 
  250 |     try {
  251 |         await uiCreateOrg(page, tempName)
  252 |     } catch (err) {
  253 |         if ((err as Error).message === PLAN_BLOCKED) {
  254 |             test.skip(true, 'Org creation disabled — plan tier.')
  255 |             return
  256 |         }
  257 |         throw err
  258 |     }
  259 |     await uiSwitchToOrg(page, tempName)
  260 | 
  261 |     // The delete IS the test — no separate cleanup needed.
  262 |     await page.goto('/org/settings/danger-zone')
  263 |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  264 | 
  265 |     const confirmInput = page.locator('div[role="dialog"] input').first()
> 266 |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
      |                                ^ Error: expect(locator).toBeVisible() failed
  267 |     await confirmInput.fill(tempName)
  268 | 
  269 |     const [response] = await Promise.all([
  270 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  271 |         page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first().click(),
  272 |     ])
  273 |     expect([200, 204]).toContain(response.status())
  274 | 
  275 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
  276 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
  277 | })
  278 | 
  279 | test('TC-ORG-007 — Create rejects duplicate name', async ({ page }) => {
  280 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  281 |     const sharedName = `qa-dup-${ts()}`
  282 | 
  283 |     // Seed the first org via the same UI flow.
  284 |     try {
  285 |         await uiCreateOrg(page, sharedName)
  286 |     } catch (err) {
  287 |         if ((err as Error).message === PLAN_BLOCKED) {
  288 |             test.skip(true, 'Org creation disabled — plan tier.')
  289 |             return
  290 |         }
  291 |         throw err
  292 |     }
  293 | 
  294 |     // Now try to create another with the SAME name.
  295 |     await page.goto('/organizations')
  296 |     const newBtn = page.locator('button', { hasText: 'New organization' }).first()
  297 |     await newBtn.click()
  298 | 
  299 |     const nameInput = page.locator('#orgName')
  300 |     await expect(nameInput).toBeVisible({ timeout: 5_000 })
  301 |     await nameInput.fill(sharedName)
  302 | 
  303 |     const submit = page.locator('button[type="submit"]', { hasText: /^Create/ }).first()
  304 |     const [response] = await Promise.all([
  305 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
  306 |         submit.click(),
  307 |     ])
  308 |     expect(response.status(), 'duplicate-name create should fail with 4xx').toBeGreaterThanOrEqual(400)
  309 |     expect(response.status()).toBeLessThan(500)
  310 | 
  311 |     // Modal stays open + an error message surfaces somewhere.
  312 |     await expect(nameInput).toBeVisible()
  313 |     const ERR_RE = /(already|exists|duplicate|taken|in use)/i
  314 |     const inlineErr = page.locator('div[role="dialog"]').getByText(ERR_RE).first()
  315 |     const toastErr = page.locator('[data-sonner-toaster]').getByText(ERR_RE).first()
  316 |     await expect(inlineErr.or(toastErr)).toBeVisible({ timeout: 5_000 })
  317 | 
  318 |     // Close the modal so cleanup doesn't fight it.
  319 |     await page.locator('div[role="dialog"] button', { hasText: /^Cancel/i }).first().click().catch(() => undefined)
  320 | 
  321 |     // Cleanup the seeded org.
  322 |     await uiSwitchToOrg(page, sharedName)
  323 |     await uiDeleteOrg(page, sharedName)
  324 | })
  325 | 
```