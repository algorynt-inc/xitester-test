import { test, expect } from '@playwright/test'
import { ENV } from '../env'

test.use({ storageState: '.auth/user.json' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

test('TC-040 — Verify cancel invitation', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    await page.goto('/org/team')
    await page.waitForLoadState('domcontentloaded')

    // Locate any pending-invitation row. The SUT marks pending rows with the
    // text "Pending invitation" (OrganizationSettings.tsx:782).
    const pendingRow = page
        .locator('tr', { hasText: /Pending invitation/i })
        .first()
    if (!(await pendingRow.isVisible().catch(() => false))) {
        test.skip(
            true,
            'No pending invitations to cancel on this env — seed an invite first or test manually.',
        )
        return
    }

    // The Cancel link inside the row.
    await pendingRow.locator('button', { hasText: /^Cancel$/ }).first().click()

    // Confirmation dialog → "Cancel invitation".
    const dialog = page.locator('div[role="dialog"]', { hasText: /Cancel invitation/i })
    await expect(dialog).toBeVisible({ timeout: 5_000 })
    await dialog.locator('button', { hasText: /^Cancel invitation$/ }).first().click()

    await expect(dialog).toBeHidden({ timeout: 5_000 })
    // The originally-targeted row should disappear (or its status flips).
    await expect(pendingRow).toBeHidden({ timeout: 8_000 })
})
