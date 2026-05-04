# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> E. Delete >> TC-ORG-006 — Delete an organization via danger zone
- Location: tests/orgs.spec.ts:296:5

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
        - img "Xitester" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: /
          - generic [ref=e10]:
            - button "qa-renamed-20260504185309 Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: qa-renamed-20260504185309
              - generic [ref=e17]: Enterprise
            - button [ref=e18] [cursor=pointer]:
              - img [ref=e19]
          - generic [ref=e22]: /
          - generic [ref=e23]: Organization
      - generic [ref=e24]:
        - button "Search... ⌘K" [ref=e25] [cursor=pointer]:
          - img [ref=e26]
          - generic [ref=e29]: Search...
          - generic [ref=e30]: ⌘K
        - generic [ref=e31]:
          - button "Help" [ref=e32] [cursor=pointer]:
            - img [ref=e33]
          - button "Notifications" [ref=e36] [cursor=pointer]:
            - img [ref=e37]
            - generic [ref=e40]: 99+
        - generic [ref=e42]:
          - generic [ref=e43]: DEV
          - generic [ref=e44]: v1.1.0
          - button "A" [ref=e45] [cursor=pointer]
    - generic [ref=e46]:
      - complementary:
        - navigation [ref=e47]:
          - button "Projects" [ref=e48] [cursor=pointer]:
            - img [ref=e50]
            - generic: Projects
          - button "Team" [ref=e52] [cursor=pointer]:
            - img [ref=e54]
            - generic: Team
          - button "Integrations" [ref=e59] [cursor=pointer]:
            - img [ref=e61]
            - generic: Integrations
          - button "Usage" [ref=e63] [cursor=pointer]:
            - img [ref=e65]
            - generic: Usage
          - button "Billing" [ref=e67] [cursor=pointer]:
            - img [ref=e69]
            - generic: Billing
          - button "Organization Settings" [ref=e71] [cursor=pointer]:
            - img [ref=e73]
            - generic: Organization Settings
        - button "Logout" [ref=e78] [cursor=pointer]:
          - img [ref=e80]
          - generic: Logout
      - main [ref=e84]:
        - generic [ref=e85]:
          - complementary [ref=e86]:
            - heading "Settings" [level=2] [ref=e88]
            - navigation [ref=e90]:
              - button "General" [ref=e91] [cursor=pointer]:
                - img [ref=e92]
                - generic [ref=e96]: General
              - button "Test Execution" [ref=e97] [cursor=pointer]:
                - img [ref=e98]
                - generic [ref=e101]: Test Execution
              - button "Email Notification" [ref=e102] [cursor=pointer]:
                - img [ref=e103]
                - generic [ref=e106]: Email Notification
              - button "Audit Trail" [ref=e107] [cursor=pointer]:
                - img [ref=e108]
                - generic [ref=e111]: Audit Trail
              - button "Danger Zone" [ref=e112] [cursor=pointer]:
                - img [ref=e113]
                - generic [ref=e115]: Danger Zone
          - main [ref=e116]:
            - generic [ref=e118]:
              - heading "Danger Zone" [level=1] [ref=e119]
              - paragraph [ref=e120]: Irreversible actions for your organization. Proceed with caution.
            - generic [ref=e121]:
              - generic [ref=e124]:
                - generic [ref=e125]:
                  - heading "Delete this organization" [level=3] [ref=e126]
                  - paragraph [ref=e127]: "Once you delete an organization, there is no going back. This will permanently delete:"
                  - list [ref=e128]:
                    - listitem [ref=e129]: All test cases and their analysis history
                    - listitem [ref=e130]: All test plans, schedules, and run results
                    - listitem [ref=e131]: All test scripts and execution recordings
                    - listitem [ref=e132]: All environments and variables
                    - listitem [ref=e133]: All discovery sessions and benchmark data
                    - listitem [ref=e134]: All uploaded files and screenshots
                  - paragraph [ref=e135]:
                    - text: Team member accounts will
                    - strong [ref=e136]: NOT
                    - text: be deleted — they will be removed from this organization only.
                - button "Delete this organization" [ref=e138] [cursor=pointer]
              - alertdialog "Delete Organization" [ref=e141]:
                - button "Close" [ref=e142] [cursor=pointer]:
                  - img [ref=e143]
                - generic [ref=e146]:
                  - img [ref=e148]
                  - heading "Delete Organization" [level=2] [ref=e152]
                  - generic [ref=e153]:
                    - text: This will permanently delete
                    - strong [ref=e154]: "\"qa-renamed-20260504185309\""
                    - text: and all of its data. This action cannot be undone.
                  - generic [ref=e155]:
                    - generic [ref=e156]: "Type qa-renamed-20260504185309 to confirm:"
                    - textbox "qa-renamed-20260504185309" [active] [ref=e157]
                  - generic [ref=e158]:
                    - button "Cancel" [ref=e159] [cursor=pointer]
                    - button "Delete Organization" [disabled] [ref=e160]
```

# Test source

```ts
  218 | 
  219 |         expect(response.status(), 'duplicate-name create should fail with 4xx').toBeGreaterThanOrEqual(400)
  220 |         expect(response.status()).toBeLessThan(500)
  221 | 
  222 |         await expect(nameInput, 'modal should remain open after duplicate error').toBeVisible()
  223 | 
  224 |         const ERR_RE = /(already|exists|duplicate|taken|in use)/i
  225 |         const inlineErr = page.locator('div[role="dialog"]').getByText(ERR_RE).first()
  226 |         const toastErr = page.locator('[data-sonner-toaster]').getByText(ERR_RE).first()
  227 |         await expect(
  228 |             inlineErr.or(toastErr),
  229 |             'an "already exists / duplicate / taken / in use" error should be visible',
  230 |         ).toBeVisible({ timeout: 5_000 })
  231 |     })
  232 | })
  233 | 
  234 | // ============================================================
  235 | // D. Update
  236 | // ============================================================
  237 | 
  238 | test.describe('D. Update', () => {
  239 |     let tempOrgId: string | null = null
  240 |     let pageRef: Page | null = null
  241 | 
  242 |     test.afterEach(async () => {
  243 |         if (tempOrgId && pageRef) {
  244 |             try {
  245 |                 await deleteCurrentOrg(pageRef.request)
  246 |             } catch {
  247 |                 /* swallow */
  248 |             }
  249 |             tempOrgId = null
  250 |             pageRef = null
  251 |         }
  252 |     })
  253 | 
  254 |     test('TC-ORG-005 — Update organization name', async ({ page }) => {
  255 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  256 |         pageRef = page
  257 | 
  258 |         const tempName = `qa-tmp-${ts()}`
  259 |         let temp: CreatedOrg
  260 |         try {
  261 |             temp = await createTempOrg(page.request, tempName)
  262 |         } catch (err) {
  263 |             if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
  264 |                 test.skip(true, 'Org creation blocked by plan tier — cannot test update without writable temp org.')
  265 |                 return
  266 |             }
  267 |             throw err
  268 |         }
  269 |         tempOrgId = temp.id
  270 | 
  271 |         await gotoOrgSettings(page, 'general')
  272 | 
  273 |         const nameInput = page.locator('#orgName')
  274 |         await expect(nameInput).toBeVisible({ timeout: 10_000 })
  275 | 
  276 |         const newName = `qa-renamed-${ts()}`
  277 |         await nameInput.fill(newName)
  278 | 
  279 |         const save = page.locator('button', { hasText: 'Save Changes' }).first()
  280 |         const [response] = await Promise.all([
  281 |             page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'PUT'),
  282 |             save.click(),
  283 |         ])
  284 |         expect(response.status()).toBe(200)
  285 | 
  286 |         await expect(page.locator('[data-sonner-toaster]')).toContainText(/updated successfully/i, { timeout: 5_000 })
  287 |         await expect(save).toBeDisabled({ timeout: 3_000 })
  288 |     })
  289 | })
  290 | 
  291 | // ============================================================
  292 | // E. Delete
  293 | // ============================================================
  294 | 
  295 | test.describe('E. Delete', () => {
  296 |     test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
  297 |         test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  298 | 
  299 |         const tempName = `qa-del-${ts()}`
  300 |         let temp: CreatedOrg
  301 |         try {
  302 |             temp = await createTempOrg(page.request, tempName)
  303 |         } catch (err) {
  304 |             if ((err as Error).message.startsWith('PLAN_BLOCKED:')) {
  305 |                 test.skip(true, 'Org creation blocked by plan tier — cannot test delete without writable temp org.')
  306 |                 return
  307 |             }
  308 |             throw err
  309 |         }
  310 | 
  311 |         await gotoOrgSettings(page, 'danger-zone')
  312 | 
  313 |         const deleteBtn = page.locator('button', { hasText: 'Delete this organization' }).first()
  314 |         await expect(deleteBtn).toBeVisible({ timeout: 10_000 })
  315 |         await deleteBtn.click()
  316 | 
  317 |         const confirmInput = page.locator('div[role="dialog"] input').first()
> 318 |         await expect(confirmInput).toBeVisible({ timeout: 5_000 })
      |                                    ^ Error: expect(locator).toBeVisible() failed
  319 |         await confirmInput.fill(temp.name)
  320 | 
  321 |         const confirmBtn = page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first()
  322 |         const [response] = await Promise.all([
  323 |             page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  324 |             confirmBtn.click(),
  325 |         ])
  326 |         expect([200, 204]).toContain(response.status())
  327 | 
  328 |         await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
  329 |         await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 8_000 })
  330 |     })
  331 | })
  332 | 
```