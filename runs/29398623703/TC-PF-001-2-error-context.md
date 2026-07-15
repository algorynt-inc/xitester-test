# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> TC-PF-001 — Upload a valid profile photo
- Location: tests/profile.spec.ts:39:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-sonner-toaster]')
Expected pattern: /profile photo updated/i
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('[data-sonner-toaster]')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - region "Notifications alt+T"
    - generic:
      - banner:
        - generic:
          - generic:
            - img
          - generic:
            - generic: /
            - generic: Account
        - generic:
          - button:
            - img
            - generic: Search...
            - generic: ⌘K
          - generic:
            - button:
              - img
            - button:
              - img
              - generic: 99+
          - generic:
            - generic: DEV
            - generic: v1.2.3
            - button: A
      - generic:
        - complementary:
          - button:
            - img
            - text: Back to dashboard
          - generic:
            - paragraph: ACCOUNT SETTINGS
            - navigation:
              - button: Preferences
              - button: Security
              - button: Connected Accounts
        - main:
          - generic:
            - heading [level=1]: Preferences
            - paragraph: Manage your account profile, connections, and dashboard experience.
            - heading [level=2]: Profile photo
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic: A
                  - button:
                    - img
                - generic:
                  - generic:
                    - button: Change photo
                  - paragraph: JPG, GIF or PNG. Max size of 5MB.
            - heading [level=2]: Profile information
            - generic:
              - generic:
                - generic: Name
                - textbox:
                  - /placeholder: Your name
                  - text: ashid
              - generic:
                - generic:
                  - paragraph: Primary email
                  - paragraph: Used for account notifications
                - generic: ashid@xitester.com
              - generic:
                - generic:
                  - paragraph: Organization
                  - paragraph: Current active organization
                - generic: XiTester
              - generic:
                - generic:
                  - paragraph: Role
                  - paragraph: Your role in the organization
                - generic: owner
              - generic:
                - button [disabled]: Save
            - heading [level=2]: Account details
            - paragraph: Information about your account.
            - generic:
              - generic:
                - paragraph: Account ID
                - code: 27218d16-cca1-4b74-8844-0466beace2d7
              - generic:
                - paragraph: Member since
                - generic: February 3, 2026
  - dialog "Adjust profile photo" [ref=e2]:
    - generic [ref=e3]:
      - heading "Adjust profile photo" [level=2] [ref=e4]
      - paragraph [ref=e5]: Drag to reposition and use the slider to zoom.
    - generic [ref=e9]:
      - img [ref=e10]
      - slider "Zoom" [active] [ref=e13]: "1"
      - img [ref=e14]
    - generic [ref=e17]:
      - button "Cancel" [ref=e18] [cursor=pointer]
      - button "Save photo" [ref=e19] [cursor=pointer]
    - button "Close" [ref=e20] [cursor=pointer]:
      - img [ref=e21]
      - generic [ref=e24]: Close
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | test.use({ storageState: '.auth/user.json' })
  5   | 
  6   | // All profile tests mutate the same user account. Run serially within this
  7   | // spec so two tests don't fight over name / photo / password concurrently.
  8   | test.describe.configure({ mode: 'serial' })
  9   | 
  10  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  11  | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  12  | 
  13  | // 67-byte transparent 1x1 PNG — used as a "valid image" fixture without
  14  | // committing a binary file.
  15  | const TINY_PNG = Buffer.from(
  16  |     '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
  17  |     '0000000d49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  18  |     'hex',
  19  | )
  20  | 
  21  | async function gotoProfile(page: Page, tab: 'preferences' | 'security' = 'preferences'): Promise<void> {
  22  |     await page.goto(`/account/${tab}`)
  23  |     await page.waitForLoadState('domcontentloaded')
  24  | }
  25  | 
  26  | async function getNameInput(page: Page) {
  27  |     return page.locator('input[placeholder="Your name"]')
  28  | }
  29  | 
  30  | async function getFileInput(page: Page) {
  31  |     // Single hidden file input on /account/preferences with accept="image/*".
  32  |     return page.locator('input[type="file"]').first()
  33  | }
  34  | 
  35  | // ============================================================
  36  | // Profile — photo + name
  37  | // ============================================================
  38  | 
  39  | test('TC-PF-001 — Upload a valid profile photo', async ({ page }) => {
  40  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  41  | 
  42  |     await gotoProfile(page, 'preferences')
  43  |     const fileInput = await getFileInput(page)
  44  | 
  45  |     await fileInput.setInputFiles({
  46  |         name: 'avatar.png',
  47  |         mimeType: 'image/png',
  48  |         buffer: TINY_PNG,
  49  |     })
  50  | 
> 51  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
      |                                                         ^ Error: expect(locator).toContainText(expected) failed
  52  |         /profile photo updated/i,
  53  |         { timeout: 10_000 },
  54  |     )
  55  | 
  56  |     // Cleanup: remove the photo so the next run starts clean.
  57  |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  58  |     if (await removeBtn.isVisible().catch(() => false)) {
  59  |         await removeBtn.click()
  60  |         await expect(page.locator('[data-sonner-toaster]')).toContainText(
  61  |             /profile photo removed/i,
  62  |             { timeout: 5_000 },
  63  |         )
  64  |     }
  65  | })
  66  | 
  67  | test('TC-PF-002 — Reject non-image file on profile photo upload', async ({ page }) => {
  68  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  69  | 
  70  |     await gotoProfile(page, 'preferences')
  71  |     const fileInput = await getFileInput(page)
  72  | 
  73  |     await fileInput.setInputFiles({
  74  |         name: 'not-an-image.txt',
  75  |         mimeType: 'text/plain',
  76  |         buffer: Buffer.from('hello world — definitely not an image'),
  77  |     })
  78  | 
  79  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  80  |         /please upload an image/i,
  81  |         { timeout: 5_000 },
  82  |     )
  83  | })
  84  | 
  85  | test('TC-PF-003 — Reject profile photo larger than 5 MB', async ({ page }) => {
  86  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  87  | 
  88  |     await gotoProfile(page, 'preferences')
  89  |     const fileInput = await getFileInput(page)
  90  | 
  91  |     // 6 MB — comfortably over the 5 MB limit. Content doesn't need to be a
  92  |     // real PNG; the SUT only checks (a) MIME starts with "image/" and (b) size.
  93  |     await fileInput.setInputFiles({
  94  |         name: 'large.png',
  95  |         mimeType: 'image/png',
  96  |         buffer: Buffer.alloc(6 * 1024 * 1024),
  97  |     })
  98  | 
  99  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  100 |         /less than 5 ?mb/i,
  101 |         { timeout: 5_000 },
  102 |     )
  103 | })
  104 | 
  105 | test('TC-PF-004 — Remove profile photo', async ({ page }) => {
  106 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  107 | 
  108 |     await gotoProfile(page, 'preferences')
  109 | 
  110 |     // Setup: ensure a photo exists. Upload a tiny PNG; if there's already
  111 |     // one, this just replaces it.
  112 |     const fileInput = await getFileInput(page)
  113 |     await fileInput.setInputFiles({
  114 |         name: 'avatar.png',
  115 |         mimeType: 'image/png',
  116 |         buffer: TINY_PNG,
  117 |     })
  118 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  119 |         /profile photo updated/i,
  120 |         { timeout: 10_000 },
  121 |     )
  122 | 
  123 |     // Now remove it.
  124 |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  125 |     await expect(removeBtn).toBeVisible({ timeout: 5_000 })
  126 |     await removeBtn.click()
  127 | 
  128 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  129 |         /profile photo removed/i,
  130 |         { timeout: 5_000 },
  131 |     )
  132 | 
  133 |     // The Remove button should disappear once there's no photo.
  134 |     await expect(removeBtn).toBeHidden({ timeout: 5_000 })
  135 | })
  136 | 
  137 | test('TC-PF-005 — Update display name and revert', async ({ page }) => {
  138 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  139 | 
  140 |     await gotoProfile(page, 'preferences')
  141 |     const nameInput = await getNameInput(page)
  142 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
  143 | 
  144 |     const original = (await nameInput.inputValue()).trim() || 'XiTester User'
  145 |     const renamed = `qa-name-${ts()}`
  146 | 
  147 |     // Forward: rename to renamed.
  148 |     await nameInput.fill(renamed)
  149 |     await Promise.all([
  150 |         page.waitForResponse(r => /\/api\/v1\/auth\/me\b/.test(r.url()) && r.request().method() === 'PUT'),
  151 |         page.locator('button', { hasText: /^Save$/ }).first().click(),
```