# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-003 — View organization settings
- Location: tests/orgs.spec.ts:178:1

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
            - button "API-Tester Enterprise" [ref=e11] [cursor=pointer]:
              - img [ref=e12]
              - generic [ref=e16]: API-Tester
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
            - generic [ref=e40]: "20"
        - generic [ref=e42]:
          - generic [ref=e43]: STAGE
          - generic [ref=e44]: v1.2.5+patch.601
          - button "T" [ref=e45] [cursor=pointer]
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
                  - textbox "Slug" [ref=e128]: api-tester
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
  94  |     await expect(nameInput).toBeHidden({ timeout: 5_000 })
  95  | }
  96  | 
  97  | /** Click an org card on /organizations to switch context to it. */
  98  | async function uiSwitchToOrg(page: Page, name: string): Promise<void> {
  99  |     await page.goto('/organizations')
  100 |     await orgListScope(page)
  101 |         .locator('button', { hasText: name })
  102 |         .first()
  103 |         .click()
  104 |     await page.waitForLoadState('domcontentloaded')
  105 | }
  106 | 
  107 | /** Drive the danger-zone delete dialog. Assumes the named org is the current context. */
  108 | async function uiDeleteOrg(page: Page, name: string): Promise<void> {
  109 |     await page.goto('/org/settings/danger-zone')
  110 |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  111 | 
  112 |     const confirmInput = page.locator(`input[placeholder='${name}']`).first()
  113 |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
  114 |     await confirmInput.fill(name)
  115 | 
  116 |     await Promise.all([
  117 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  118 |         page.locator(`//div[@class='flex gap-2']//button[text()='Delete Organization']`).first().click(),
  119 |     ])
  120 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
  121 |     await expect(page).toHaveURL(/\/organizations(\?|$)/)
  122 | }
  123 | 
  124 | // ============================================================
  125 | // Tests — flat list, no categories
  126 | // ============================================================
  127 | 
  128 | test('TC-ORG-001 — View organization list', async ({ page }) => {
  129 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  130 | 
  131 |     await page.goto('/organizations')
  132 |     await expect(
  133 |         page.locator('input[placeholder="Search for an organization"]'),
  134 |     ).toBeVisible({ timeout: 10_000 })
  135 | 
  136 |     const orgButtons = orgCards(page)
  137 |     await expect(orgButtons.first()).toBeVisible({ timeout: 10_000 })
  138 | })
  139 | 
  140 | test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
  141 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  142 | 
  143 |     await page.goto('/organizations')
  144 |     const search = page.locator('input[placeholder="Search for an organization"]')
  145 |     await expect(search).toBeVisible({ timeout: 10_000 })
  146 | 
  147 |     const orgButtons = orgCards(page)
  148 |     await expect
  149 |         .poll(() => orgButtons.count(), {
  150 |             message: 'expected at least one org card on /organizations',
  151 |             timeout: 8_000,
  152 |         })
  153 |         .toBeGreaterThan(0)
  154 | 
  155 |     // Positive: searching for "XiTester" keeps the XiTester card visible.
  156 |     await search.fill('XiTester')
  157 |     await expect(
  158 |         orgListScope(page).locator('button').filter({ hasText: /XiTester/i }).first(),
  159 |         '"XiTester" card should remain visible when filtering by "XiTester"',
  160 |     ).toBeVisible({ timeout: 4_000 })
  161 | 
  162 |     // Positive: searching for "API" keeps the API-Tester card visible.
  163 |     await search.fill('API')
  164 |     await expect(
  165 |         orgListScope(page).locator('button').filter({ hasText: /API-?Tester/i }).first(),
  166 |         '"API-Tester" card should remain visible when filtering by "API"',
  167 |     ).toBeVisible({ timeout: 4_000 })
  168 | 
  169 |     // Negative: a string that matches no org hides every card.
  170 |     await search.fill(`xt-nomatch-${ts()}`)
  171 |     await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
  172 | 
  173 |     // Clearing restores the full list.
  174 |     await search.fill('')
  175 |     await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
  176 | })
  177 | 
  178 | test('TC-ORG-003 — View organization settings', async ({ page }) => {
  179 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  180 | 
  181 |     await page.goto('/organizations')
  182 |     await orgCards(page).first().click()
  183 | 
  184 |     await page.goto('/org/settings/general')
  185 | 
  186 |     const orgName = page.locator('#orgName')
  187 |     const orgSlug = page.locator('#orgSlug')
  188 |     const orgDescription = page.locator('#orgDescription')
  189 | 
  190 |     await expect(orgName).toBeVisible({ timeout: 10_000 })
  191 |     await expect(orgSlug).toBeVisible()
  192 |     await expect(orgDescription).toBeVisible()
  193 | 
> 194 |     await expect(orgName).not.toHaveValue('')
      |                               ^ Error: expect(locator).not.toHaveValue(expected) failed
  195 |     await expect(orgSlug).not.toHaveValue('')
  196 |     await expect(orgSlug).toHaveAttribute('readonly', '')
  197 | })
  198 | 
  199 | test('TC-ORG-004 — Create a new organization', async ({ page }) => {
  200 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  201 |     const tempName = `qa-tmp-${ts()}`
  202 | 
  203 |     try {
  204 |         await uiCreateOrg(page, tempName, 'Created by Playwright TC-ORG-004')
  205 |     } catch (err) {
  206 |         if ((err as Error).message.startsWith(PLAN_BLOCKED)) {
  207 |             test.skip(
  208 |                 true,
  209 |                 `Org creation blocked (${(err as Error).message}). The dev env may have hit ` +
  210 |                 'the 10-org cap — manually delete leftover qa-tmp-* / qa-del-* / qa-dup-* orgs in the SUT, then retry.',
  211 |             )
  212 |             return
  213 |         }
  214 |         throw err
  215 |     }
  216 | 
  217 |     // The new org should be visible somewhere on the page (org list or top bar).
  218 |     await page.goto('/organizations')
  219 |     await expect(
  220 |         orgListScope(page).locator('button', { hasText: tempName }).first(),
  221 |     ).toBeVisible({ timeout: 8_000 })
  222 | 
  223 |     // Cleanup via UI — switch to the org and delete it.
  224 |     await uiSwitchToOrg(page, tempName)
  225 |     await uiDeleteOrg(page, tempName)
  226 | })
  227 | 
  228 | test('TC-ORG-005 — Update organization name', async ({ page }) => {
  229 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  230 |     const tempName = `qa-tmp-${ts()}`
  231 | 
  232 |     try {
  233 |         await uiCreateOrg(page, tempName)
  234 |     } catch (err) {
  235 |         if ((err as Error).message === PLAN_BLOCKED) {
  236 |             test.skip(true, 'Org creation disabled — plan tier.')
  237 |             return
  238 |         }
  239 |         throw err
  240 |     }
  241 |     await uiSwitchToOrg(page, tempName)
  242 | 
  243 |     await page.goto('/org/settings/general')
  244 |     const nameInput = page.locator('#orgName')
  245 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
  246 | 
  247 |     const newName = `qa-renamed-${ts()}`
  248 |     await nameInput.fill(newName)
  249 | 
  250 |     const save = page.locator('button', { hasText: 'Save Changes' }).first()
  251 |     const [response] = await Promise.all([
  252 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'PUT'),
  253 |         save.click(),
  254 |     ])
  255 |     expect(response.status()).toBe(200)
  256 | 
  257 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/updated successfully/i, { timeout: 5_000 })
  258 |     await expect(save).toBeDisabled({ timeout: 3_000 })
  259 | 
  260 |     // Cleanup
  261 |     await uiDeleteOrg(page, newName)
  262 | })
  263 | 
  264 | test('TC-ORG-006 — Delete an organization via danger zone', async ({ page }) => {
  265 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  266 |     const tempName = `qa-del-${ts()}`
  267 | 
  268 |     try {
  269 |         await uiCreateOrg(page, tempName)
  270 |     } catch (err) {
  271 |         if ((err as Error).message === PLAN_BLOCKED) {
  272 |             test.skip(true, 'Org creation disabled — plan tier.')
  273 |             return
  274 |         }
  275 |         throw err
  276 |     }
  277 |     await uiSwitchToOrg(page, tempName)
  278 | 
  279 |     // The delete IS the test — no separate cleanup needed.
  280 |     await page.goto('/org/settings/danger-zone')
  281 |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  282 | 
  283 |     const confirmInput = page.locator(`input[placeholder='${tempName}']`).first()
  284 |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
  285 |     await confirmInput.fill(tempName)
  286 | 
  287 |     const [response] = await Promise.all([
  288 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  289 |         page.locator(`//div[@class='flex gap-2']//button[text()='Delete Organization']`, { hasText: /^Delete Organization/ }).first().click(),
  290 |     ])
  291 |     expect([200, 204]).toContain(response.status())
  292 | 
  293 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(/deleted successfully/i, { timeout: 5_000 })
  294 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
```