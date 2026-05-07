# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-004 — Create a new organization
- Location: tests/orgs.spec.ts:181:1

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
            - button "qa-tmp-20260507163551 Free" [ref=e21] [cursor=pointer]:
              - img [ref=e22]
              - generic [ref=e26]: qa-tmp-20260507163551
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
                    - strong [ref=e163]: "\"qa-tmp-20260507163551\""
                    - text: and all of its data. This action cannot be undone.
                  - generic [ref=e164]:
                    - generic [ref=e165]: "Type qa-tmp-20260507163551 to confirm:"
                    - textbox "qa-tmp-20260507163551" [active] [ref=e166]
                  - generic [ref=e167]:
                    - button "Cancel" [ref=e168] [cursor=pointer]
                    - button "Delete Organization" [disabled] [ref=e169]
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Every test in this file starts already authenticated, courtesy of the
  5   | // `setup` project (auth.setup.ts). Zero login attempts in this spec.
  6   | test.use({ storageState: '.auth/user.json' })
  7   | 
  8   | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  9   | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  10  | 
  11  | // ============================================================
  12  | // Helpers — UI-only, no API calls. Each helper drives the actual SPA
  13  | // just like a real user would, so the SUT's own client/SDK does the
  14  | // network work.
  15  | // ============================================================
  16  | 
  17  | const PLAN_BLOCKED = 'PLAN_BLOCKED:UI'
  18  | 
  19  | /**
  20  |  * Click "New organization", fill the modal, submit. Throws PLAN_BLOCKED
  21  |  * when the button is disabled (free-tier accounts). The newly created
  22  |  * org becomes the user's current context (the SPA switches automatically
  23  |  * after a successful create).
  24  |  */
  25  | /**
  26  |  * Scope to the SelectOrganization page's content wrapper. The page has no
  27  |  * <main> element; the heading "Your Organizations" + the search input live
  28  |  * inside `<div class="mx-auto max-w-6xl p-8">`. Anchoring on the heading
  29  |  * is the most stable handle.
  30  |  */
  31  | function orgListScope(page: Page): Locator {
  32  |     return page.locator('h1', { hasText: 'Your Organizations' }).locator('xpath=ancestor::div[1]')
  33  | }
  34  | 
  35  | /** All org-card buttons on the org-picker page (excludes toolbar buttons). */
  36  | function orgCards(page: Page): Locator {
  37  |     return orgListScope(page)
  38  |         .locator('button')
  39  |         .filter({
  40  |             hasNotText: /^(New organization|Search|Active|Inactive|Name|Date created)$/i,
  41  |         })
  42  | }
  43  | 
  44  | async function uiCreateOrg(page: Page, name: string, description?: string): Promise<void> {
  45  |     await page.goto('/organizations')
  46  |     const newBtn = page.locator('button', { hasText: 'New organization' }).first()
  47  |     await expect(newBtn).toBeVisible({ timeout: 10_000 })
  48  |     if (!(await newBtn.isEnabled())) {
  49  |         throw new Error(PLAN_BLOCKED)
  50  |     }
  51  |     await newBtn.click()
  52  | 
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
> 96  |     await expect(confirmInput).toBeVisible({ timeout: 5_000 })
      |                                ^ Error: expect(locator).toBeVisible() failed
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
  153 |     await expect(orgButtons).toHaveCount(0, { timeout: 4_000 })
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
```