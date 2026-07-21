# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> TC-PF-001 — Upload a valid profile photo
- Location: tests/profile.spec.ts:39:1

# Error details

```
TimeoutError: locator.setInputFiles: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[type="file"]').first()

```

# Page snapshot

```yaml
- generic [ref=e2]: 404 page not found
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
> 45  |     await fileInput.setInputFiles({
      |     ^ TimeoutError: locator.setInputFiles: Timeout 10000ms exceeded.
  46  |         name: 'avatar.png',
  47  |         mimeType: 'image/png',
  48  |         buffer: TINY_PNG,
  49  |     })
  50  | 
  51  |     await page.getByRole('button', { name: 'Save photo' }).click();
  52  | 
  53  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  54  |         /profile photo updated/i,
  55  |         { timeout: 10_000 },
  56  |     )
  57  | 
  58  |     // Cleanup: remove the photo so the next run starts clean.
  59  |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  60  |     if (await removeBtn.isVisible().catch(() => false)) {
  61  |         await removeBtn.click()
  62  |         await expect(page.locator('[data-sonner-toaster]')).toContainText(
  63  |             /profile photo removed/i,
  64  |             { timeout: 5_000 },
  65  |         )
  66  |     }
  67  | })
  68  | 
  69  | test('TC-PF-002 — Reject non-image file on profile photo upload', async ({ page }) => {
  70  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  71  | 
  72  |     await gotoProfile(page, 'preferences')
  73  |     const fileInput = await getFileInput(page)
  74  | 
  75  |     await fileInput.setInputFiles({
  76  |         name: 'not-an-image.txt',
  77  |         mimeType: 'text/plain',
  78  |         buffer: Buffer.from('hello world — definitely not an image'),
  79  |     })
  80  | 
  81  |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  82  |         /please upload an image/i,
  83  |         { timeout: 5_000 },
  84  |     )
  85  | })
  86  | 
  87  | test('TC-PF-003 — Reject profile photo larger than 5 MB', async ({ page }) => {
  88  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  89  | 
  90  |     await gotoProfile(page, 'preferences')
  91  |     const fileInput = await getFileInput(page)
  92  | 
  93  |     // 6 MB — comfortably over the 5 MB limit. Content doesn't need to be a
  94  |     // real PNG; the SUT only checks (a) MIME starts with "image/" and (b) size.
  95  |     await fileInput.setInputFiles({
  96  |         name: 'large.png',
  97  |         mimeType: 'image/png',
  98  |         buffer: Buffer.alloc(6 * 1024 * 1024),
  99  |     })
  100 | 
  101 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  102 |         /less than 5 ?mb/i,
  103 |         { timeout: 5_000 },
  104 |     )
  105 | })
  106 | 
  107 | test('TC-PF-004 — Remove profile photo', async ({ page }) => {
  108 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  109 | 
  110 |     await gotoProfile(page, 'preferences')
  111 | 
  112 |     // Setup: ensure a photo exists. Upload a tiny PNG; if there's already
  113 |     // one, this just replaces it.
  114 |     const fileInput = await getFileInput(page)
  115 |     await fileInput.setInputFiles({
  116 |         name: 'avatar.png',
  117 |         mimeType: 'image/png',
  118 |         buffer: TINY_PNG,
  119 |     })
  120 |     await page.getByRole('button', { name: 'Save photo' }).click();
  121 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  122 |         /profile photo updated/i,
  123 |         { timeout: 10_000 },
  124 |     )
  125 | 
  126 |     // Now remove it.
  127 |     const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
  128 |     await expect(removeBtn).toBeVisible({ timeout: 5_000 })
  129 |     await removeBtn.click()
  130 | 
  131 |     await expect(page.locator('[data-sonner-toaster]')).toContainText(
  132 |         /profile photo removed/i,
  133 |         { timeout: 5_000 },
  134 |     )
  135 | 
  136 |     // The Remove button should disappear once there's no photo.
  137 |     await expect(removeBtn).toBeHidden({ timeout: 5_000 })
  138 | })
  139 | 
  140 | test('TC-PF-005 — Update display name and revert', async ({ page }) => {
  141 |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  142 | 
  143 |     await gotoProfile(page, 'preferences')
  144 |     const nameInput = await getNameInput(page)
  145 |     await expect(nameInput).toBeVisible({ timeout: 10_000 })
```