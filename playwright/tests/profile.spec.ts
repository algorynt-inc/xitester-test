import { test, expect, type Page } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })

// All profile tests mutate the same user account. Run serially within this
// spec so two tests don't fight over name / photo / password concurrently.
test.describe.configure({ mode: 'serial' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

// 67-byte transparent 1x1 PNG — used as a "valid image" fixture without
// committing a binary file.
const TINY_PNG = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
        '0000000d49444154789c63000100000500010d0a2db40000000049454e44ae426082',
    'hex',
)

async function gotoProfile(page: Page, tab: 'preferences' | 'security' = 'preferences'): Promise<void> {
    await page.goto(`/account/${tab}`)
    await page.waitForLoadState('domcontentloaded')
}

async function getNameInput(page: Page) {
    return page.locator('input[placeholder="Your name"]')
}

async function getFileInput(page: Page) {
    // Single hidden file input on /account/preferences with accept="image/*".
    return page.locator('input[type="file"]').first()
}

// ============================================================
// Profile — photo + name
// ============================================================

test('TC-PF-001 — Upload a valid profile photo', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'preferences')
    const fileInput = await getFileInput(page)

    await fileInput.setInputFiles({
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: TINY_PNG,
    })

    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /profile photo updated/i,
        { timeout: 10_000 },
    )

    // Cleanup: remove the photo so the next run starts clean.
    const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
    if (await removeBtn.isVisible().catch(() => false)) {
        await removeBtn.click()
        await expect(page.locator('[data-sonner-toaster]')).toContainText(
            /profile photo removed/i,
            { timeout: 5_000 },
        )
    }
})

test('TC-PF-002 — Reject non-image file on profile photo upload', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'preferences')
    const fileInput = await getFileInput(page)

    await fileInput.setInputFiles({
        name: 'not-an-image.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hello world — definitely not an image'),
    })

    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /please upload an image/i,
        { timeout: 5_000 },
    )
})

test('TC-PF-003 — Reject profile photo larger than 5 MB', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'preferences')
    const fileInput = await getFileInput(page)

    // 6 MB — comfortably over the 5 MB limit. Content doesn't need to be a
    // real PNG; the SUT only checks (a) MIME starts with "image/" and (b) size.
    await fileInput.setInputFiles({
        name: 'large.png',
        mimeType: 'image/png',
        buffer: Buffer.alloc(6 * 1024 * 1024),
    })

    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /less than 5 ?mb/i,
        { timeout: 5_000 },
    )
})

test('TC-PF-004 — Remove profile photo', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'preferences')

    // Setup: ensure a photo exists. Upload a tiny PNG; if there's already
    // one, this just replaces it.
    const fileInput = await getFileInput(page)
    await fileInput.setInputFiles({
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: TINY_PNG,
    })
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /profile photo updated/i,
        { timeout: 10_000 },
    )

    // Now remove it.
    const removeBtn = page.locator('button', { hasText: /^Remove$/ }).first()
    await expect(removeBtn).toBeVisible({ timeout: 5_000 })
    await removeBtn.click()

    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /profile photo removed/i,
        { timeout: 5_000 },
    )

    // The Remove button should disappear once there's no photo.
    await expect(removeBtn).toBeHidden({ timeout: 5_000 })
})

test('TC-PF-005 — Update display name and revert', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'preferences')
    const nameInput = await getNameInput(page)
    await expect(nameInput).toBeVisible({ timeout: 10_000 })

    const original = (await nameInput.inputValue()).trim() || 'XiTester User'
    const renamed = `qa-name-${ts()}`

    // Forward: rename to renamed.
    await nameInput.fill(renamed)
    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/auth\/me\b/.test(r.url()) && r.request().method() === 'PUT'),
        page.locator('button', { hasText: /^Save$/ }).first().click(),
    ])
    await expect(page.locator('[data-sonner-toaster]')).toContainText(/profile updated/i, { timeout: 5_000 })
    await expect(nameInput).toHaveValue(renamed)

    // Revert.
    await nameInput.fill(original)
    await Promise.all([
        page.waitForResponse(r => /\/api\/v1\/auth\/me\b/.test(r.url()) && r.request().method() === 'PUT'),
        page.locator('button', { hasText: /^Save$/ }).first().click(),
    ])
    await expect(page.locator('[data-sonner-toaster]')).toContainText(/profile updated/i, { timeout: 5_000 })
    await expect(nameInput).toHaveValue(original)
})

// ============================================================
// Profile — Security
// ============================================================

async function fillPasswordFields(
    page: Page,
    current: string,
    next: string,
    confirm: string,
): Promise<void> {
    // The form has three labelled password inputs in this order:
    //   "Current password", "New password", "Confirm new password".
    const inputs = page.locator('input[type="password"]')
    await inputs.nth(0).fill(current)
    await inputs.nth(1).fill(next)
    await inputs.nth(2).fill(confirm)
}

test('TC-PF-006 — Update password and revert (destructive)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // This test changes the user's actual password and tries to revert it.
    // If the revert step fails the credentials in GitHub Secrets become
    // stale until manually rotated. Default-skipped; opt in via env var.
    test.skip(
        !process.env.XT_RUN_DESTRUCTIVE,
        'Destructive: changes the test user password. Set XT_RUN_DESTRUCTIVE=1 to run.',
    )

    await gotoProfile(page, 'security')
    const tempPwd = `Xt-${ts()}!`

    // Forward: original → tempPwd.
    await fillPasswordFields(page, ENV.user.password, tempPwd, tempPwd)
    await Promise.all([
        page.waitForResponse(
            r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
        ),
        page.locator('button', { hasText: /^Update password$/ }).click(),
    ])
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /password updated successfully/i,
        { timeout: 8_000 },
    )

    // Revert: tempPwd → original. Critical — if this fails, the secret in
    // GitHub Environments doesn't match the live password anymore.
    await fillPasswordFields(page, tempPwd, ENV.user.password, ENV.user.password)
    await Promise.all([
        page.waitForResponse(
            r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
        ),
        page.locator('button', { hasText: /^Update password$/ }).click(),
    ])
    await expect(
        page.locator('[data-sonner-toaster]'),
        'CRITICAL: revert step failed — the live password is now ' + tempPwd,
    ).toContainText(/password updated successfully/i, { timeout: 8_000 })
})

test('TC-PF-007 — Wrong current password is rejected', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'security')
    const validNew = `Xt-${ts()}!`

    await fillPasswordFields(page, 'definitely-not-the-current-password', validNew, validNew)
    await Promise.all([
        page.waitForResponse(
            r => /\/api\/v1\/auth\/change-password\b/.test(r.url()) && r.request().method() === 'POST',
        ),
        page.locator('button', { hasText: /^Update password$/ }).click(),
    ])

    // The SUT maps wrong-current to a per-field error or a generic
    // toast. Match either, including the SUT's known fallback strings.
    const fieldErr = page.getByText(/(current password.*incorrect|invalid current|wrong.*password)/i).first()
    const toast = page.locator('[data-sonner-toaster]').getByText(
        /(current password|incorrect|invalid|failed to update)/i,
    ).first()
    await expect(fieldErr.or(toast)).toBeVisible({ timeout: 8_000 })
})

test('TC-PF-008 — Mismatched new + confirm disables Save', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'security')
    await fillPasswordFields(page, ENV.user.password, 'Xitester-A1!', 'Xitester-B2!')

    // The SUT disables Update password when newPassword !== confirmPassword
    // (see AccountPage.tsx: disabled={... || newPassword !== confirmPassword}).
    const updateBtn = page.locator('button', { hasText: /^Update password$/ })
    await expect(updateBtn, 'Save should be disabled when new ≠ confirm').toBeDisabled({ timeout: 3_000 })

    // Optionally — match-up enables it again.
    const inputs = page.locator('input[type="password"]')
    await inputs.nth(2).fill('Xitester-A1!')
    await expect(updateBtn).toBeEnabled({ timeout: 3_000 })
})

test('TC-PF-009 — Weak (short) password disables Save', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await gotoProfile(page, 'security')
    // Client-side rule: newPassword.length >= 8. Anything shorter must
    // keep the Save button disabled.
    await fillPasswordFields(page, ENV.user.password, '12345', '12345')

    const updateBtn = page.locator('button', { hasText: /^Update password$/ })
    await expect(updateBtn, 'Save should be disabled when new password < 8 chars').toBeDisabled({
        timeout: 3_000,
    })

    // The SUT should explicitly hint at the requirement somewhere on the page.
    // Match the actual SUT helper text or the eventual toast/server error.
    await expect(
        page.getByText(/(at least 8|minimum 8|password.*8 character)/i).first(),
    ).toBeVisible({ timeout: 3_000 })
})
