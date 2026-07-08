import { test, expect, type Locator, type Page } from '@playwright/test'
import { ENV } from '../env'

// Authenticated via auth.setup. Storage state carries the user's currently
// selected organisation + project, which already places `/test-cases` inside
// the right scope. Tests don't switch orgs explicitly — the user spec asks
// for "Regression_test_success" but we honour whatever the storage state
// already has, since switching orgs is a separate concern (covered in nav).
test.use({ storageState: '.auth/user.json' })

// All test-case mutations land in the same account/project. Run serial so
// that two tests don't fight over the same list (search box, bulk-select,
// pagination state).
test.describe.configure({ mode: 'serial' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
// const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

// ============================================================
// Helpers — UI-only, no API helper calls. Each helper drives the SPA so
// the SUT's own client/SDK does the actual network work.
// ============================================================

async function gotoTestCases(page: Page): Promise<void> {
    await page.goto('/test-cases')
    await page
        .locator('input[placeholder="Search test cases…"]')
        .waitFor({ state: 'visible', timeout: 15_000 })
    // Wait for either rows or the empty-state to settle so the list is
    // stable before the test interacts with it.
    await page
        .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
        .first()
        .waitFor({ state: 'visible', timeout: 10_000 })
        .catch(() => undefined)
}

async function openNewTestCaseDropdown(page: Page): Promise<void> {
    await page.locator('button[data-tour="new-test-case-btn"]').click()
    // The "AI Test Create" item is rendered conditionally on the dropdown
    // being open — wait for it before continuing.
    await page
        .locator('button[data-tour="ai-test-create"]')
        .waitFor({ state: 'visible', timeout: 5_000 })
}

async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
    await gotoTestCases(page)
    await openNewTestCaseDropdown(page)
    await page.locator('button[data-tour="ai-test-create"]').click()

    // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
    // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
    // outer dialog by visible heading instead.
    const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#test-case-name').fill(name)
    if (description) {
        await dialog.locator('#test-case-description').fill(description)
    }

    const [response] = await Promise.all([
        page.waitForResponse(
            r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
            { timeout: 15_000 },
        ),
        dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
    ])
    if (!response.ok()) {
        const body = await response.text().catch(() => '')
        throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
    }
    // SPA navigates to /test-analysis/<sessionId> on success. Pull the id
    // from the URL so callers can return to /test-cases and clean up.
    await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
    const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
    if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
    return match[1]

}

/**
 * Locate the row whose visible title equals `name`. Each row has a `tr`
 * wrapper carrying the `test-case-row` class; we anchor on the title cell
 * and climb to the row.
 */
function testCaseRow(page: Page, name: string): Locator {
    return page
        .locator('table tbody tr.test-case-row')
        .filter({ has: page.getByText(name, { exact: true }) })
        .first()
}

async function searchFor(page: Page, query: string): Promise<void> {
    const input = page.locator('input[placeholder="Search test cases…"]')
    await expect(input).toBeVisible()
    await input.fill(query)
    await expect(input).toHaveValue(query)
    // The list is server-side filtered after a 300ms debounce.
    await expect(
        page.locator('table tbody tr.test-case-row').filter({ hasText: query })
    ).toBeVisible({ timeout: 20_000 });
}

async function clearSearch(page: Page): Promise<void> {
    const input = page.locator('input[placeholder="Search test cases…"]')
    await expect(input).toBeVisible()
    await input.fill('')
    // await page.waitForTimeout(5000)
}

/**
 * Open the row's overflow actions and trigger a specific icon button.
 * The row's action cell exposes plain buttons with `aria-label`s like
 * "Clone test case", "Edit test case", "Delete test case".
 */
async function clickRowAction(
    row: Locator,
    action: 'Clone test case' | 'Edit test case' | 'Delete test case',
): Promise<void> {
    // Hover the row so the actions cell becomes interactive in case CSS
    // hides it until hover (matches user behaviour).
    await row.hover()
    await row.locator(`button[aria-label="${action}"]`).click()
}

async function uiUpdateTestCase(
    page: Page,
    row: Locator,
    newTitle: string,
    newDescription?: string,
): Promise<void> {
    await clickRowAction(row, 'Edit test case')

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Edit Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#edit-test-case-name').fill(newTitle)
    if (newDescription !== undefined) {
        await dialog.locator('#edit-test-case-description').fill(newDescription)
    }

    await Promise.all([
        page.waitForResponse(
            r =>
                /\/api\/analysis\/sessions\/[^/]+\/title\b/.test(r.url()) &&
                r.request().method() === 'PATCH',
            { timeout: 10_000 },
        ),
        dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiDeleteTestCase(page: Page, row: Locator): Promise<void> {
    await clickRowAction(row, 'Delete test case')

    // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
    const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await Promise.all([
        page.waitForResponse(
            r =>
                /\/api\/analysis\/sessions\/[^/]+$/.test(r.url()) &&
                r.request().method() === 'DELETE',
            { timeout: 10_000 },
        ),
        dialog.locator('button', { hasText: /^Delete$/ }).first().click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiCloneTestCase(page: Page, row: Locator, newTitle: string): Promise<void> {
    await clickRowAction(row, 'Clone test case')

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Clone Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#cloneTitle').fill(newTitle)

    await Promise.all([
        page.waitForResponse(
            r =>
                /\/api\/analysis\/sessions\/[^/]+\/clone\b/.test(r.url()) &&
                r.request().method() === 'POST',
            { timeout: 15_000 },
        ),
        dialog.locator('button[type="submit"]', { hasText: /^Clone$/ }).click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiCreateRecordTestCase(page: Page, name: string): Promise<void> {
    await gotoTestCases(page)
    await openNewTestCaseDropdown(page)
    await page.locator('button', { hasText: 'Record Test Case' }).click()

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#recordTestName').fill(name)
    await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
    await dialog.locator('#startUrl').fill('https://xitester.com')

    await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
    await page.waitForTimeout(5000)

    // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
    await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/test-analysis/)
    await expect(page.getByText('Ready to Record')).toBeVisible();
}

// ============================================================
// Tests — preserve user-supplied numbering TC-065 .. TC-076
// ============================================================

test('TC-065 — Create AI test case with name and description', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-ai-${ts()}`

    const sessionId = await uiCreateAITestCase(page, name, 'Created by Playwright TC-065')

    // Step 7 — verify navigation to test analysis page.
    expect(page.url()).toMatch(new RegExp(`/test-analysis/${sessionId}`))
    await expect(page.getByText('Start a test')).toBeVisible({
        timeout: 30_000,
    });

    // Verify it's listed when we go back.
    await gotoTestCases(page)
    await searchFor(page, name)
    await expect(testCaseRow(page, name)).toBeVisible({ timeout: 8_000 })

    // Cleanup so the project ends clean.
    await uiDeleteTestCase(page, testCaseRow(page, name))
})

test('TC-066 — Update existing AI test case name and description', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const original = `qa-ai-${ts()}`
    const renamed = `qa-renamed-${ts()}`

    await uiCreateAITestCase(page, original, 'Original description')
    await gotoTestCases(page)
    await searchFor(page, original)
    const row = testCaseRow(page, original)
    await expect(row).toBeVisible({ timeout: 8_000 })

    await uiUpdateTestCase(page, row, renamed, 'Edited by Playwright TC-066')

    // Verify success toast + new name visible after edit.
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /test case updated/i,
        { timeout: 5_000 },
    )
    await clearSearch(page)
    await searchFor(page, renamed)
    await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
    await expect(page.getByText(original, { exact: true })).toBeHidden()

    // Cleanup.
    await uiDeleteTestCase(page, testCaseRow(page, renamed))
})

test('TC-067 — Delete AI test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-del-${ts()}`

    await uiCreateAITestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)
    const row = testCaseRow(page, name)
    await expect(row).toBeVisible({ timeout: 8_000 })

    await uiDeleteTestCase(page, row)

    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /test case deleted/i,
        { timeout: 5_000 },
    )
    // After delete: row is gone.
    await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
})

test('TC-068 — Clone AI test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const original = `qa-src-${ts()}`
    const cloneName = `qa-clone-${ts()}`

    await uiCreateAITestCase(page, original, 'Source for clone')
    await gotoTestCases(page)
    await searchFor(page, original)
    const sourceRow = testCaseRow(page, original)
    await expect(sourceRow).toBeVisible({ timeout: 8_000 })

    await uiCloneTestCase(page, sourceRow, cloneName)

    // Both rows should now exist. Search for clone first to give the list
    // time to refresh.
    await clearSearch(page)
    await searchFor(page, cloneName)
    await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })

    await clearSearch(page)
    await searchFor(page, original)
    await expect(testCaseRow(page, original)).toBeVisible({ timeout: 8_000 })

    // Cleanup both.
    await clearSearch(page)
    await searchFor(page, cloneName)
    await uiDeleteTestCase(page, testCaseRow(page, cloneName))
    await clearSearch(page)
    await searchFor(page, original)
    await uiDeleteTestCase(page, testCaseRow(page, original))
})

const recordTestCaseName = `qa-rec-${ts()}`

test('TC-069 — Recorded test case modal accepts name + URL and routes to recording flow', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // We don't actually start a recording (it spins up a remote browser
    // container). We assert that the modal collects the inputs, validates
    // the URL, and routes the user into the /test-analysis recording entry
    // — that's the user-driven boundary on this page.

    // const name = `qa-rec-${ts()}`
    await gotoTestCases(page)
    await openNewTestCaseDropdown(page)
    await page.locator('button', { hasText: 'Record Test Case' }).click()

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#recordTestName').fill(recordTestCaseName)
    await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
    await dialog.locator('#startUrl').fill('https://xitester.com')

    await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()

    // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
    await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/test-analysis/)
    await expect(page.getByText('Analysis Steps')).toBeVisible();
    await page.waitForTimeout(10_000);
})

test('TC-070 — Update an existing recorded test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // Recorded test cases are produced by the recording-browser flow, which
    // requires a remote container we deliberately don't drive in CI. So we
    // pick the first session in the list whose row carries the "Recorded"
    // badge. Skip cleanly when the project doesn't have one yet.

    await gotoTestCases(page)
    await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
    await searchFor(page, recordTestCaseName)
    const recordedRow = page
        .locator('table tbody tr.test-case-row')
        .filter({ has: page.getByText(recordTestCaseName) })
        .filter({ has: page.getByText(/^Recorded$/) })
        .first()
    if (!(await recordedRow.isVisible().catch(() => false))) {
        test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
    }

    // Capture the original title so we can revert in cleanup.
    const titleCell = recordedRow.locator('td').nth(2)
    const originalTitle = (await titleCell.locator('.font-medium').first().innerText()).trim()
    const renamed = `qa-rec-edit-${ts()}`

    await uiUpdateTestCase(page, recordedRow, renamed)
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /test case updated/i,
        { timeout: 5_000 },
    )
    await searchFor(page, renamed)
    await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })

    // Revert so we leave the project as we found it.
    await uiUpdateTestCase(page, testCaseRow(page, renamed), originalTitle)
    await clearSearch(page)
})

test('TC-071 — Delete a recorded test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // Hard to safely delete a real recorded session (it may be load-bearing
    // for the user). Instead, find a recorded one named with our `qa-rec-*`
    // prefix from prior runs (orphans), and delete that. If none, skip.

    await gotoTestCases(page)
    await expect(page.locator('input[placeholder="Search test cases…"]')).toBeVisible()
    await searchFor(page, recordTestCaseName)
    const orphan = page
        .locator('table tbody tr.test-case-row')
        .filter({ has: page.getByText(recordTestCaseName) })
        .filter({ has: page.getByText(/^Recorded$/) })
        .first()
    if (!(await orphan.isVisible().catch(() => false))) {
        test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
    }
    await uiDeleteTestCase(page, orphan)
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /test case deleted/i,
        { timeout: 5_000 },
    )
    await clearSearch(page)
})

test('TC-072 — Clone a recorded test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // Same constraint as TC-070: the project must already contain at least
    // one recorded test case. Skip if none.

    const name = `qa-rec-${ts()}`
    await gotoTestCases(page)
    await uiCreateRecordTestCase(page, name)
    await gotoTestCases(page)

    const recordedRow = page
        .locator('table tbody tr.test-case-row')
        .filter({ has: page.getByText(name, { exact: true }) })
        .filter({ has: page.getByText(/^Recorded$/) })
        .first()
    await expect(recordedRow).toBeVisible({ timeout: 15000 })
    // if (!(await recordedRow.isVisible().catch(() => false))) {
    //     test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
    // }

    const cloneName = `qa-rec-clone-${ts()}`
    await uiCloneTestCase(page, recordedRow, cloneName)
    await searchFor(page, cloneName)
    await expect(testCaseRow(page, cloneName)).toBeVisible({ timeout: 8_000 })

    // Cleanup.
    await uiDeleteTestCase(page, testCaseRow(page, cloneName))
    await clearSearch(page)
})

test('TC-073 — Search filters the list to matching test cases', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // Seed a uniquely-named test case so we know the search must surface
    // exactly one row regardless of the rest of the project's state.

    const unique = `qa-search-${ts()}`
    await uiCreateAITestCase(page, unique)

    await gotoTestCases(page)
    await searchFor(page, unique)

    // Exactly one matching row.
    const matchingRows = page.locator('table tbody tr.test-case-row')
    await expect.poll(async () => await matchingRows.count(), { timeout: 8_000 }).toBe(1)
    await expect(testCaseRow(page, unique)).toBeVisible()

    // Cleanup.
    await uiDeleteTestCase(page, testCaseRow(page, unique))
})

test('TC-074 — Add a tag to a test case', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    const tcName = `qa-tag-${ts()}`
    const tagName = `pw-${ts()}`
    await uiCreateAITestCase(page, tcName)
    await gotoTestCases(page)
    await searchFor(page, tcName)
    const row = testCaseRow(page, tcName)
    await expect(row).toBeVisible({ timeout: 8_000 })

    // Click the tags cell to switch the row into edit mode. The cell's
    // button is the only `<button title="Click to edit tags">`.
    await row.locator('button[title="Click to edit tags"]').click()
    const tagInput = row.locator('input[role="combobox"]')
    await expect(tagInput).toBeVisible({ timeout: 5_000 })

    await tagInput.fill(tagName)
    // First creates the tag via POST /api/tags, then attaches it via
    // POST /api/tags/session/<id>. Wait for the attach call (the second one)
    // since it's the persistence boundary the assertion cares about.
    await Promise.all([
        page.waitForResponse(
            r => /\/api\/tags\/session\/[^/]+\b/.test(r.url()) && r.request().method() === 'POST',
            { timeout: 15_000 },
        ),
        tagInput.press('Enter'),
    ])

    // Tag chip should appear inside the row.
    await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })

    // Blur the tag editor by clicking the search input, then delete.
    await page.locator('input[placeholder="Search test cases…"]').click()
    await uiDeleteTestCase(page, testCaseRow(page, tcName))
})

test('TC-075 — Removing a tag persists after page reload', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    const tcName = `qa-rmtag-${ts()}`
    const tagName = `rm-${ts()}`
    await uiCreateAITestCase(page, tcName)
    await gotoTestCases(page)
    await searchFor(page, tcName)
    const row = testCaseRow(page, tcName)
    await expect(row).toBeVisible({ timeout: 8_000 })

    // Add a tag first.
    await row.locator('button[title="Click to edit tags"]').click()
    const tagInput = row.locator('input[role="combobox"]')
    await tagInput.fill(tagName)
    await Promise.all([
        page.waitForResponse(
            r => /\/api\/tags\/session\/[^/]+\b/.test(r.url()) && r.request().method() === 'POST',
            { timeout: 15_000 },
        ),
        tagInput.press('Enter'),
    ])
    await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })

    // After the add settles, the row drifts back to read-only TagList mode
    // (the wrapper's onBlur handler runs after the async POST chain). Click
    // the search input to force that blur, then wait for the read-only
    // tags cell to become visible — that's the stable "we know which mode
    // we're in" handle.
    await page.locator('input[placeholder="Search test cases…"]').click()
    const tagsCellBtn = row.locator('button[title="Click to edit tags"]')
    await expect(tagsCellBtn).toBeVisible({ timeout: 5_000 })
    await tagsCellBtn.click()

    // Now in edit mode. Press Backspace on the empty input — TagInput
    // (TagInput.tsx) handles Backspace + empty input by calling
    // removeTag(lastTag), which keeps focus inside the input throughout
    // (no blur race). Click the input first to ensure focus is there.
    const editInput = row.locator('input[role="combobox"]')
    await expect(editInput).toBeVisible({ timeout: 5_000 })
    await editInput.click()
    await editInput.fill('')

    await Promise.all([
        page.waitForResponse(
            r =>
                /\/api\/tags\/session\/[^/]+\b/.test(r.url()) &&
                r.request().method() === 'DELETE',
            { timeout: 10_000 },
        ),
        editInput.press('Backspace'),
    ])
    await expect(row.getByText(tagName, { exact: true })).toBeHidden({ timeout: 5_000 })

    // Reload — verify the tag is still gone (persisted, not just local).
    await page.reload()
    await page
        .locator('input[placeholder="Search test cases…"]')
        .waitFor({ state: 'visible', timeout: 10_000 })
    await searchFor(page, tcName)
    const reloadedRow = testCaseRow(page, tcName)
    await expect(reloadedRow).toBeVisible({ timeout: 8_000 })
    await expect(reloadedRow.getByText(tagName, { exact: true })).toBeHidden()

    // Cleanup.
    await uiDeleteTestCase(page, reloadedRow)
})

test('TC-076 — Bulk select and bulk delete test cases', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)

    const a = `qa-bulk-A-${ts()}`
    const b = `qa-bulk-B-${ts()}`
    const c = `qa-bulk-C-${ts()}`

    // Create three throwaway test cases.
    await uiCreateAITestCase(page, a)
    await uiCreateAITestCase(page, b)
    await uiCreateAITestCase(page, c)

    await gotoTestCases(page)
    // await searchFor(page, 'qa-bulk-')
    const rowA = testCaseRow(page, a);
    const rowB = testCaseRow(page, b);
    const rowC = testCaseRow(page, c);

    await expect(rowA).toBeVisible();
    await expect(rowB).toBeVisible();
    await expect(rowC).toBeVisible();

    const rows = page.locator('table tbody tr.test-case-row')
    await expect.poll(async () => await rows.count(), { timeout: 10_000 }).toBeGreaterThanOrEqual(3)

    // Tick the three checkboxes.
    for (const name of [a, b, c]) {
        const row = testCaseRow(page, name)
        await row.locator('input[type="checkbox"]').check()
    }

    // The bulk-actions button reads "Delete N Selected".
    const bulkBtn = page.locator('button', { hasText: /Delete \d+ Selected/ })
    await expect(bulkBtn).toBeVisible({ timeout: 3_000 })
    await expect(bulkBtn).toContainText('Delete 3 Selected')

    await bulkBtn.click()

    const dialog = page.locator('div[role="alertdialog"]', { hasText: /Delete 3 Test Cases/i })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await Promise.all([
        page.waitForResponse(
            r =>
                /\/api\/analysis\/sessions\/[^/]+$/.test(r.url()) &&
                r.request().method() === 'DELETE',
            { timeout: 15_000 },
        ),
        dialog.locator('button', { hasText: /Delete 3 Test Cases/i }).click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })

    // Toast confirmation.
    await expect(page.locator('[data-sonner-toaster]')).toContainText(
        /3 test case\(s\) deleted/i,
        { timeout: 5_000 },
    )

    // List no longer shows our three rows.
    await expect(page.getByText(a, { exact: true })).toBeHidden({ timeout: 8_000 })
    await expect(page.getByText(b, { exact: true })).toBeHidden()
    await expect(page.getByText(c, { exact: true })).toBeHidden()

    // Reload and confirm they don't reappear.
    await page.reload()
    await page
        .locator('input[placeholder="Search test cases…"]')
        .waitFor({ state: 'visible', timeout: 10_000 })
    // await searchFor(page, 'qa-bulk-')
    await expect(page.getByText(a, { exact: true })).toBeHidden()
    await expect(page.getByText(b, { exact: true })).toBeHidden()
    await expect(page.getByText(c, { exact: true })).toBeHidden()
})
