# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-003 — View organization settings
- Location: tests/orgs.spec.ts:175:1

# Error details

```
Error: expect(locator).not.toHaveValue(expected) failed

Locator:  locator('#orgName')
Expected: not ""
Received: ""
Timeout:  5000ms

Call log:
  - Expect "not toHaveValue" with timeout 5000ms
  - waiting for locator('#orgName')
    9 × locator resolved to <input value="" id="orgName" placeholder="My Organization" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
      - unexpected value ""

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
            - button "XiTester Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: XiTester
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
          - generic [ref=e44]: v1.2.7+patch.616
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
              - button "Time Zone" [ref=e102] [cursor=pointer]:
                - img [ref=e103]
                - generic [ref=e106]: Time Zone
              - button "Audit Trail" [ref=e107] [cursor=pointer]:
                - img [ref=e108]
                - generic [ref=e111]: Audit Trail
              - button "Danger Zone" [ref=e112] [cursor=pointer]:
                - img [ref=e113]
                - generic [ref=e115]: Danger Zone
          - main [ref=e116]:
            - generic [ref=e118]:
              - heading "General" [level=1] [ref=e119]
              - paragraph [ref=e120]: Manage your organization’s name and description.
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]:
                  - text: Organization Name
                  - textbox "Organization Name" [ref=e126]:
                    - /placeholder: My Organization
                - generic [ref=e127]:
                  - text: Slug
                  - textbox "Slug" [ref=e128]: xitester
                  - paragraph [ref=e129]: Slug is auto-generated and cannot be changed
              - generic [ref=e130]:
                - text: Description
                - textbox "Description" [ref=e131]:
                  - /placeholder: Describe your organization…
              - button "Save Changes" [ref=e132] [cursor=pointer]:
                - img [ref=e133]
                - text: Save Changes
```

# Test source

```ts
  91  |     await expect(nameInput).toBeHidden({ timeout: 5_000 })
  92  | }
  93  | 
  94  | /** Click an org card on /organizations to switch context to it. */
  95  | async function uiSwitchToOrg(page: Page, name: string): Promise<void> {
  96  |     await page.goto('/organizations')
  97  |     await orgListScope(page)
  98  |         .locator('button', { hasText: name })
  99  |         .first()
  100 |         .click()
  101 |     await page.waitForLoadState('domcontentloaded')
  102 | }
  103 | 
  104 | /** Drive the danger-zone delete dialog. Assumes the named org is the current context. */
  105 | async function uiDeleteOrg(page: Page, name: string): Promise<void> {
  106 |     await page.goto('/org/settings/danger-zone')
  107 |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  108 | 
  109 |     const confirmInput = page.locator(`input[placeholder='${name}']`).first()
  110 |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
  111 |     await confirmInput.fill(name)
  112 | 
  113 |     await Promise.all([
  114 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  115 |         page.locator(`//div[@class='flex gap-2']//button[text()='Delete Organization']`).first().click(),
  116 |     ])
  117 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
  118 |     await expect(page).toHaveURL(/\/organizations(\?|$)/)
  119 | }
  120 | 
  121 | // ============================================================
  122 | // Tests — flat list, no categories
  123 | // ============================================================
  124 | 
  125 | test('TC-ORG-001 — View organization list', async ({ page }) => {
  126 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  127 | 
  128 |     await page.goto('/organizations')
  129 |     await expect(
  130 |         page.locator('input[placeholder="Search for an organization"]'),
  131 |     ).toBeVisible({ timeout: 10_000 })
  132 | 
  133 |     const orgButtons = orgCards(page)
  134 |     await expect(orgButtons.first()).toBeVisible({ timeout: 10_000 })
  135 | })
  136 | 
  137 | test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
  138 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  139 | 
  140 |     await page.goto('/organizations')
  141 |     const search = page.locator('input[placeholder="Search for an organization"]')
  142 |     await expect(search).toBeVisible({ timeout: 10_000 })
  143 | 
  144 |     const orgButtons = orgCards(page)
  145 |     await expect
  146 |         .poll(() => orgButtons.count(), {
  147 |             message: 'expected at least one org card on /organizations',
  148 |             timeout: 8_000,
  149 |         })
  150 |         .toBeGreaterThan(0)
  151 | 
  152 |     // Positive: searching for "XiTester" keeps the XiTester card visible.
  153 |     await search.fill('XiTester')
  154 |     await expect(
  155 |         orgListScope(page).locator('button').filter({ hasText: /XiTester/i }).first(),
  156 |         '"XiTester" card should remain visible when filtering by "XiTester"',
  157 |     ).toBeVisible({ timeout: 4_000 })
  158 | 
  159 |     // Positive: searching for "API" keeps the API-Tester card visible.
  160 |     await search.fill('API')
  161 |     await expect(
  162 |         orgListScope(page).locator('button').filter({ hasText: /API-?Tester/i }).first(),
  163 |         '"API-Tester" card should remain visible when filtering by "API"',
  164 |     ).toBeVisible({ timeout: 4_000 })
  165 | 
  166 |     // Negative: a string that matches no org hides every card.
  167 |     await search.fill(`xt-nomatch-${ts()}`)
  168 |     await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
  169 | 
  170 |     // Clearing restores the full list.
  171 |     await search.fill('')
  172 |     await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
  173 | })
  174 | 
  175 | test('TC-ORG-003 — View organization settings', async ({ page }) => {
  176 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  177 | 
  178 |     await page.goto('/organizations')
  179 |     await orgCards(page).first().click()
  180 | 
  181 |     await page.goto('/org/settings/general')
  182 | 
  183 |     const orgName = page.locator('#orgName')
  184 |     const orgSlug = page.locator('#orgSlug')
  185 |     const orgDescription = page.locator('#orgDescription')
  186 | 
  187 |     await expect(orgName).toBeVisible({ timeout: 10_000 })
  188 |     await expect(orgSlug).toBeVisible()
  189 |     await expect(orgDescription).toBeVisible()
  190 | 
> 191 |     await expect(orgName).not.toHaveValue('')
      |                               ^ Error: expect(locator).not.toHaveValue(expected) failed
  192 |     await expect(orgSlug).not.toHaveValue('')
  193 |     await expect(orgSlug).toHaveAttribute('readonly', '')
  194 | })
  195 | 
  196 | test('TC-ORG-004 — Create a new organization', async ({ page }) => {
  197 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  198 |     const tempName = `qa-tmp-${ts()}`
  199 | 
  200 |     try {
  201 |         await uiCreateOrg(page, tempName, 'Created by Playwright TC-ORG-004')
  202 |     } catch (err) {
  203 |         if ((err as Error).message.startsWith(PLAN_BLOCKED)) {
  204 |             test.skip(
  205 |                 true,
  206 |                 `Org creation blocked (${(err as Error).message}). The dev env may have hit ` +
  207 |                 'the 10-org cap — manually delete leftover qa-tmp-* / qa-del-* / qa-dup-* orgs in the SUT, then retry.',
  208 |             )
  209 |             return
  210 |         }
  211 |         throw err
  212 |     }
  213 | 
  214 |     // The new org should be visible somewhere on the page (org list or top bar).
  215 |     await page.goto('/organizations')
  216 |     await expect(
  217 |         orgListScope(page).locator('button', { hasText: tempName }).first(),
  218 |     ).toBeVisible({ timeout: 8_000 })
  219 | 
  220 |     // Cleanup via UI — switch to the org and delete it.
  221 |     await uiSwitchToOrg(page, tempName)
  222 |     await uiDeleteOrg(page, tempName)
  223 | })
  224 | 
  225 | test('TC-ORG-005 — Update organization name', async ({ page }) => {
  226 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  227 |     const tempName = `qa-tmp-${ts()}`
  228 | 
  229 |     try {
  230 |         await uiCreateOrg(page, tempName)
  231 |     } catch (err) {
  232 |         if ((err as Error).message === PLAN_BLOCKED) {
  233 |             test.skip(true, 'Org creation disabled — plan tier.')
  234 |             return
  235 |         }
  236 |         throw err
  237 |     }
  238 |     await uiSwitchToOrg(page, tempName)
  239 | 
  240 |     await page.goto('/org/settings/general')
  241 |     const nameInput = page.locator('#orgName')
  242 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
  243 | 
  244 |     const newName = `qa-renamed-${ts()}`
  245 |     await nameInput.fill(newName)
  246 | 
  247 |     const save = page.locator('button', { hasText: 'Save Changes' }).first()
  248 |     const [response] = await Promise.all([
  249 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'PUT'),
  250 |         save.click(),
  251 |     ])
  252 |     expect(response.status()).toBe(200)
  253 | 
  254 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/updated successfully/i, { timeout: 5_000 })
  255 |     await expect(save).toBeDisabled({ timeout: 3_000 })
  256 | 
  257 |     // Cleanup
  258 |     await uiDeleteOrg(page, newName)
  259 | })
  260 | 
  261 | test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
  262 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  263 |     const tempName = `qa-del-${ts()}`
  264 | 
  265 |     try {
  266 |         await uiCreateOrg(page, tempName)
  267 |     } catch (err) {
  268 |         if ((err as Error).message === PLAN_BLOCKED) {
  269 |             test.skip(true, 'Org creation disabled — plan tier.')
  270 |             return
  271 |         }
  272 |         throw err
  273 |     }
  274 |     await uiSwitchToOrg(page, tempName)
  275 | 
  276 |     // The delete IS the test — no separate cleanup needed.
  277 |     await page.goto('/org/settings/danger-zone')
  278 |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  279 | 
  280 |     const confirmInput = page.locator(`input[placeholder='${tempName}']`).first()
  281 |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
  282 |     await confirmInput.fill(tempName)
  283 | 
  284 |     const [response] = await Promise.all([
  285 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  286 |         page.locator(`//div[@class='flex gap-2']//button[text()='Delete Organization']`, { hasText: /^Delete Organization/ }).first().click(),
  287 |     ])
  288 |     expect([200, 204]).toContain(response.status())
  289 | 
  290 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
  291 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
```