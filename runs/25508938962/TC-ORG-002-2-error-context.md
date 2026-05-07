# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-002 — Search filters the org list
- Location: tests/orgs.spec.ts:122:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1').filter({ hasText: 'Your Organizations' }).locator('xpath=ancestor::div[1]').locator('button').filter({ hasNotText: /^(New organization|Search|Active|Inactive|Name|Date created)$/i })
Expected: 0
Received: 3
Timeout:  4000ms

Call log:
  - Expect "toHaveCount" with timeout 4000ms
  - waiting for locator('h1').filter({ hasText: 'Your Organizations' }).locator('xpath=ancestor::div[1]').locator('button').filter({ hasNotText: /^(New organization|Search|Active|Inactive|Name|Date created)$/i })
    8 × locator resolved to 3 elements
      - unexpected value "3"

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
          - generic [ref=e10]: Organizations
      - generic [ref=e11]:
        - button "Search... ⌘K" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - generic [ref=e16]: Search...
          - generic [ref=e17]: ⌘K
        - generic [ref=e18]:
          - button "Help" [ref=e19] [cursor=pointer]:
            - img [ref=e20]
          - button "Notifications" [ref=e23] [cursor=pointer]:
            - img [ref=e24]
            - generic [ref=e27]: 99+
        - generic [ref=e29]:
          - generic [ref=e30]: DEV
          - generic [ref=e31]: v1.1.0
          - button "A" [ref=e32] [cursor=pointer]
    - generic [ref=e34]:
      - heading "Your Organizations" [level=1] [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - img [ref=e38]
          - textbox "Search for an organization" [active] [ref=e41]: xt-nomatch-20260507163535
        - separator [ref=e42]
        - button "Sort Name" [ref=e43] [cursor=pointer]:
          - img [ref=e44]
          - text: Sort
          - separator [ref=e46]
          - generic [ref=e48]: Name
        - generic [ref=e49]:
          - generic [ref=e50]:
            - button [ref=e51] [cursor=pointer]:
              - img [ref=e52]
            - button [ref=e57] [cursor=pointer]:
              - img [ref=e58]
          - button "New organization" [ref=e59] [cursor=pointer]:
            - img [ref=e60]
            - text: New organization
      - paragraph [ref=e62]: No organizations found
```

# Test source

```ts
  53  |     const nameInput = page.locator('#orgName')
  54  |     await expect(nameInput).toBeVisible({ timeout: 5_000 })
  55  |     await nameInput.fill(name)
  56  |     if (description) {
  57  |         await page.locator('#orgDesc').fill(description)
  58  |     }
  59  | 
  60  |     const [response] = await Promise.all([
  61  |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'POST'),
  62  |         page.locator('button[type="submit"]', { hasText: /^Create/ }).first().click(),
  63  |     ])
  64  | 
  65  |     // The SUT enforces an "at most 10 organizations" cap (HTTP 409). Surface
  66  |     // that as PLAN_BLOCKED so calling tests skip cleanly with a clear hint
  67  |     // about cleanup.
  68  |     if (response.status() === 409 || response.status() === 402 || response.status() === 403) {
  69  |         const body = await response.text().catch(() => '')
  70  |         throw new Error(`${PLAN_BLOCKED}:${response.status()}:${body.slice(0, 200)}`)
  71  |     }
  72  |     if (!response.ok()) {
  73  |         throw new Error(`uiCreateOrg ${response.status()}: ${await response.text().catch(() => '')}`)
  74  |     }
  75  | 
  76  |     // Modal closes on success.
  77  |     await expect(nameInput).toBeHidden({ timeout: 5_000 })
  78  | }
  79  | 
  80  | /** Click an org card on /organizations to switch context to it. */
  81  | async function uiSwitchToOrg(page: Page, name: string): Promise<void> {
  82  |     await page.goto('/organizations')
  83  |     await orgListScope(page)
  84  |         .locator('button', { hasText: name })
  85  |         .first()
  86  |         .click()
  87  |     await page.waitForLoadState('domcontentloaded')
  88  | }
  89  | 
  90  | /** Drive the danger-zone delete dialog. Assumes the named org is the current context. */
  91  | async function uiDeleteOrg(page: Page, name: string): Promise<void> {
  92  |     await page.goto('/org/settings/danger-zone')
  93  |     await page.locator('button', { hasText: 'Delete this organization' }).first().click()
  94  | 
  95  |     const confirmInput = page.locator('div[role="dialog"] input').first()
  96  |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
  97  |     await confirmInput.fill(name)
  98  | 
  99  |     await Promise.all([
  100 |         page.waitForResponse(r => /\/api\/v1\/organizations\b/.test(r.url()) && r.request().method() === 'DELETE'),
  101 |         page.locator('div[role="dialog"] button', { hasText: /^Delete Organization/ }).first().click(),
  102 |     ])
  103 |     await page.waitForURL(url => !url.pathname.startsWith('/org/settings'), { timeout: 10_000 })
  104 | }
  105 | 
  106 | // ============================================================
  107 | // Tests — flat list, no categories
  108 | // ============================================================
  109 | 
  110 | test('TC-ORG-001 — View organization list', async ({ page }) => {
  111 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  112 | 
  113 |     await page.goto('/organizations')
  114 |     await expect(
  115 |         page.locator('input[placeholder="Search for an organization"]'),
  116 |     ).toBeVisible({ timeout: 10_000 })
  117 | 
  118 |     const orgButtons = orgCards(page)
  119 |     await expect(orgButtons.first()).toBeVisible({ timeout: 10_000 })
  120 | })
  121 | 
  122 | test('TC-ORG-002 — Search filters the org list', async ({ page }) => {
  123 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  124 | 
  125 |     await page.goto('/organizations')
  126 |     const search = page.locator('input[placeholder="Search for an organization"]')
  127 |     await expect(search).toBeVisible({ timeout: 10_000 })
  128 | 
  129 |     const orgButtons = orgCards(page)
  130 |     await expect
  131 |         .poll(() => orgButtons.count(), {
  132 |             message: 'expected at least one org card on /organizations',
  133 |             timeout: 8_000,
  134 |         })
  135 |         .toBeGreaterThan(0)
  136 | 
  137 |     // Positive: searching for "XiTester" keeps the XiTester card visible.
  138 |     await search.fill('XiTester')
  139 |     await expect(
  140 |         orgListScope(page).locator('button').filter({ hasText: /XiTester/i }).first(),
  141 |         '"XiTester" card should remain visible when filtering by "XiTester"',
  142 |     ).toBeVisible({ timeout: 4_000 })
  143 | 
  144 |     // Positive: searching for "API" keeps the API-Tester card visible.
  145 |     await search.fill('API')
  146 |     await expect(
  147 |         orgListScope(page).locator('button').filter({ hasText: /API-?Tester/i }).first(),
  148 |         '"API-Tester" card should remain visible when filtering by "API"',
  149 |     ).toBeVisible({ timeout: 4_000 })
  150 | 
  151 |     // Negative: a string that matches no org hides every card.
  152 |     await search.fill(`xt-nomatch-${ts()}`)
> 153 |     await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
      |                              ^ Error: expect(locator).toHaveCount(expected) failed
  154 | 
  155 |     // Clearing restores the full list.
  156 |     await search.fill('')
  157 |     await expect(orgButtons.first()).toBeVisible({ timeout: 4_000 })
  158 | })
  159 | 
  160 | test('TC-ORG-003 — View organization settings', async ({ page }) => {
  161 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  162 | 
  163 |     await page.goto('/organizations')
  164 |     await orgCards(page).first().click()
  165 | 
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
```