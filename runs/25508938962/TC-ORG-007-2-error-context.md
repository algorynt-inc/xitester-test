# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orgs.spec.ts >> TC-ORG-007 — Create rejects duplicate name
- Location: tests/orgs.spec.ts:279:1

# Error details

```
Error: PLAN_BLOCKED:UI:409:{"detail":"You can belong to at most 10 organizations."}
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
          - textbox "Search for an organization" [ref=e41]
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
      - generic [ref=e62]:
        - button "API-Tester Enterprise Plan · 1 project" [ref=e63] [cursor=pointer]:
          - generic [ref=e64]:
            - img [ref=e65]
            - generic [ref=e69]:
              - generic [ref=e70]: API-Tester
              - generic [ref=e71]: Enterprise Plan · 1 project
        - button "ByteForge Enterprise Plan · 4 projects" [ref=e72] [cursor=pointer]:
          - generic [ref=e73]:
            - img [ref=e74]
            - generic [ref=e78]:
              - generic [ref=e79]: ByteForge
              - generic [ref=e80]: Enterprise Plan · 4 projects
        - button "qa-del-20260507163612 Free Plan · 0 projects" [ref=e81] [cursor=pointer]:
          - generic [ref=e82]:
            - img [ref=e83]
            - generic [ref=e87]:
              - generic [ref=e88]: qa-del-20260507163612
              - generic [ref=e89]: Free Plan · 0 projects
        - button "qa-del-20260507163629 Free Plan · 0 projects" [ref=e90] [cursor=pointer]:
          - generic [ref=e91]:
            - img [ref=e92]
            - generic [ref=e96]:
              - generic [ref=e97]: qa-del-20260507163629
              - generic [ref=e98]: Free Plan · 0 projects
        - button "qa-dup-20260507163623 Free Plan · 0 projects" [ref=e99] [cursor=pointer]:
          - generic [ref=e100]:
            - img [ref=e101]
            - generic [ref=e105]:
              - generic [ref=e106]: qa-dup-20260507163623
              - generic [ref=e107]: Free Plan · 0 projects
        - button "qa-renamed-20260507163551 Free Plan · 0 projects" [ref=e108] [cursor=pointer]:
          - generic [ref=e109]:
            - img [ref=e110]
            - generic [ref=e114]:
              - generic [ref=e115]: qa-renamed-20260507163551
              - generic [ref=e116]: Free Plan · 0 projects
        - button "qa-renamed-20260507163612 Free Plan · 0 projects" [ref=e117] [cursor=pointer]:
          - generic [ref=e118]:
            - img [ref=e119]
            - generic [ref=e123]:
              - generic [ref=e124]: qa-renamed-20260507163612
              - generic [ref=e125]: Free Plan · 0 projects
        - button "qa-tmp-20260507163531 Free Plan · 0 projects" [ref=e126] [cursor=pointer]:
          - generic [ref=e127]:
            - img [ref=e128]
            - generic [ref=e132]:
              - generic [ref=e133]: qa-tmp-20260507163531
              - generic [ref=e134]: Free Plan · 0 projects
        - button "qa-tmp-20260507163551 Free Plan · 0 projects" [ref=e135] [cursor=pointer]:
          - generic [ref=e136]:
            - img [ref=e137]
            - generic [ref=e141]:
              - generic [ref=e142]: qa-tmp-20260507163551
              - generic [ref=e143]: Free Plan · 0 projects
        - button "XiTester Enterprise Plan · 2 projects" [ref=e144] [cursor=pointer]:
          - generic [ref=e145]:
            - img [ref=e146]
            - generic [ref=e150]:
              - generic [ref=e151]: XiTester
              - generic [ref=e152]: Enterprise Plan · 2 projects
    - dialog [ref=e153]:
      - generic [ref=e154]:
        - generic [ref=e155]:
          - img [ref=e156]
          - heading "Create New Organization" [level=3] [ref=e160]
          - button "Close" [ref=e161] [cursor=pointer]:
            - img [ref=e162]
        - generic [ref=e165]:
          - generic [ref=e166]:
            - generic [ref=e167]: You can belong to at most 10 organizations.
            - generic [ref=e168]:
              - text: Organization Name *
              - textbox "Organization Name *" [ref=e169]:
                - /placeholder: My Organization
                - text: qa-dup-20260507163643
            - generic [ref=e170]:
              - text: Description (optional)
              - textbox "Description (optional)" [ref=e171]:
                - /placeholder: Brief description…
          - generic [ref=e172]:
            - button "Cancel" [ref=e173] [cursor=pointer]
            - button "Create" [ref=e174] [cursor=pointer]:
              - img [ref=e175]
              - text: Create
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
> 70  |         throw new Error(`${PLAN_BLOCKED}:${response.status()}:${body.slice(0, 200)}`)
      |               ^ Error: PLAN_BLOCKED:UI:409:{"detail":"You can belong to at most 10 organizations."}
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
```