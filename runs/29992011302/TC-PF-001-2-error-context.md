# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> TC-PF-001 — Upload a valid profile photo
- Location: tests/profile.spec.ts:41:1

# Error details

```
TimeoutError: locator.setInputFiles: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - status "Loading" [ref=e3]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | test.use({ storageState: '.auth/user.json' })
  5   | 
  6   | // All profile tests mutate the same user account, so they must not run
  7   | // concurrently over name / photo / password. Sequencing is already enforced by
  8   | // the config (`workers: 1`, `fullyParallel: false`); `default` mode (not `serial`)
  9   | // keeps each test independent so one failure won't skip the rest.
  10  | test.describe.configure({ mode: 'default' })
  11  | 
  12  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  13  | const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  14  | 
  15  | // 67-byte transparent 1x1 PNG — used as a "valid image" fixture without
  16  | // committing a binary file.
  17  | const TINY_PNG = Buffer.from(
  18  |     '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
  19  |     '0000000d49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  20  |     'hex',
  21  | )
  22  | 
  23  | async function gotoProfile(page: Page, tab: 'preferences' | 'security' = 'preferences'): Promise<void> {
  24  |     await page.goto(`/account/${tab}`)
  25  |     await page.waitForLoadState('domcontentloaded')
  26  | }
  27  | 
  28  | async function getNameInput(page: Page) {
  29  |     return page.locator('input[placeholder="Your name"]')
  30  | }
  31  | 
  32  | async function getFileInput(page: Page) {
  33  |     // Single hidden file input on /account/preferences with accept="image/*".
  34  |     return page.locator('input[type="file"]').first()
  35  | }
  36  | 
  37  | // ============================================================
  38  | // Profile — photo + name
  39  | // ============================================================
  40  | 
  41  | test('TC-PF-001 — Upload a valid profile photo', async ({ page }) => {
  42  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  43  | 
  44  |     await gotoProfile(page, 'preferences')
  45  |     const fileInput = await getFileInput(page)
  46  | 
> 47  |     await fileInput.setInputFiles({
      |     ^ TimeoutError: locator.setInputFiles: Timeout 10000ms exceeded.
  48  |         name: 'avatar.png',
  49  |         mimeType: 'image/png',
  50  |         buffer: TINY_PNG,
  51  |     })
  52  | 
  53  |     await page.getByRole('button', { name: 'Save photo' }).click();
  54  | 
  55  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  56  |         /profile photo updated/i,
  57  |         { timeout: 10_000 },
  58  |     )
  59  | 
  60  |     // Cleanup: remove the photo so the next run starts clean.
  61  |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  62  |     if (await removeBtn.isVisible().catch(() => false)) {
  63  |         await removeBtn.click()
  64  |         await expect(page.locator('[data-sonner-toaster]')).toContainText(
  65  |             /profile photo removed/i,
  66  |             { timeout: 5_000 },
  67  |         )
  68  |     }
  69  | })
  70  | 
  71  | test('TC-PF-002 — Reject non-image file on profile photo upload', async ({ page }) => {
  72  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  73  | 
  74  |     await gotoProfile(page, 'preferences')
  75  |     const fileInput = await getFileInput(page)
  76  | 
  77  |     await fileInput.setInputFiles({
  78  |         name: 'not-an-image.txt',
  79  |         mimeType: 'text/plain',
  80  |         buffer: Buffer.from('hello world — definitely not an image'),
  81  |     })
  82  | 
  83  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  84  |         /please upload an image/i,
  85  |         { timeout: 5_000 },
  86  |     )
  87  | })
  88  | 
  89  | test('TC-PF-003 — Reject profile photo larger than 5 MB', async ({ page }) => {
  90  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  91  | 
  92  |     await gotoProfile(page, 'preferences')
  93  |     const fileInput = await getFileInput(page)
  94  | 
  95  |     // 6 MB — comfortably over the 5 MB limit. Content doesn't need to be a
  96  |     // real PNG; the SUT only checks (a) MIME starts with "image/" and (b) size.
  97  |     await fileInput.setInputFiles({
  98  |         name: 'large.png',
  99  |         mimeType: 'image/png',
  100 |         buffer: Buffer.alloc(6 * 1024 * 1024),
  101 |     })
  102 | 
  103 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  104 |         /less than 5 ?mb/i,
  105 |         { timeout: 5_000 },
  106 |     )
  107 | })
  108 | 
  109 | test('TC-PF-004 — Remove profile photo', async ({ page }) => {
  110 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  111 | 
  112 |     await gotoProfile(page, 'preferences')
  113 | 
  114 |     // Setup: ensure a photo exists. Upload a tiny PNG; if there's already
  115 |     // one, this just replaces it.
  116 |     const fileInput = await getFileInput(page)
  117 |     await fileInput.setInputFiles({
  118 |         name: 'avatar.png',
  119 |         mimeType: 'image/png',
  120 |         buffer: TINY_PNG,
  121 |     })
  122 |     await page.getByRole('button', { name: 'Save photo' }).click();
  123 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  124 |         /profile photo updated/i,
  125 |         { timeout: 10_000 },
  126 |     )
  127 | 
  128 |     // Now remove it.
  129 |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  130 |     await expect(removeBtn).toBeVisible({ timeout: 5_000 })
  131 |     await removeBtn.click()
  132 | 
  133 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  134 |         /profile photo removed/i,
  135 |         { timeout: 5_000 },
  136 |     )
  137 | 
  138 |     // The Remove button should disappear once there's no photo.
  139 |     await expect(removeBtn).toBeHidden({ timeout: 5_000 })
  140 | })
  141 | 
  142 | test('TC-PF-005 — Update display name and revert', async ({ page }) => {
  143 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  144 | 
  145 |     await gotoProfile(page, 'preferences')
  146 |     const nameInput = await getNameInput(page)
  147 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
```