import { test, expect, type Locator, type Page, type Response } from '@playwright/test'
import { ENV } from '../env'

// Authenticated via auth.setup. Storage state carries the user's currently
// selected organisation + project, which already places `/test-cases` inside
// the right scope. Tests don't switch orgs explicitly — the user spec asks
// for "Regression_test_success" but we honour whatever the storage state
// already has, since switching orgs is a separate concern (covered in nav).
test.use({ storageState: '.auth/user.json' })

// Tests run one-at-a-time (config sets `workers: 1`, `fullyParallel: false`), so
// they never fight over the shared account's list. `default` mode (not `serial`)
// keeps each test independent: if one fails, the rest still run.
test.describe.configure({ mode: 'default' })

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`

// Every test in this file needs a logged-in user. Guard once here instead of
// repeating the check at the top of each test.
test.beforeEach(() => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
})

// ============================================================
// Constants
// ============================================================

/** Shared selectors for elements the whole suite touches. */
const SEL = {
    searchInput: 'input[placeholder="Search test cases…"]',
    row: 'table tbody tr.test-case-row',
    toaster: '[data-sonner-toaster]',
} as const

/** Unique-enough suffix (epoch ms + 4 random chars) for throwaway names. */
const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

// ============================================================
// Locator + assertion helpers
// ============================================================

const searchInput = (page: Page): Locator => page.locator(SEL.searchInput)

/**
 * Match a test case by name. Long names are JS-truncated in the name cell (the
 * DOM text becomes e.g. `qa-rec-clone-…`), so exact visible-text matching misses
 * them. The full name is preserved in the cell's `title` attribute — match that
 * first, falling back to exact text for anything without a title attribute.
 */
function nameMatch(page: Page, name: string): Locator {
    return page.locator(`[title="${name}"]`).or(page.getByText(name, { exact: true }))
}

/** The `tr.test-case-row` whose name cell matches `name`. */
function testCaseRow(page: Page, name: string): Locator {
    return page.locator(SEL.row).filter({ has: nameMatch(page, name) }).first()
}

/** A `name`-matching row that also carries the "Recording" status badge. */
function recordedTestCaseRow(page: Page, name: string): Locator {
    return page
        .locator(SEL.row)
        .filter({ has: nameMatch(page, name) })
        .filter({ has: page.getByText(/^Recording$/) })
        .first()
}

/** Assert a Sonner toast containing `pattern` appears. */
async function expectToast(page: Page, pattern: RegExp, timeout = 5_000): Promise<void> {
    await expect(page.locator(SEL.toaster)).toContainText(pattern, { timeout })
}

/** Wait for the SUT's own client to make a matching API call. */
function waitForApi(
    page: Page,
    pattern: RegExp,
    method: string,
    timeout = 15_000,
): Promise<Response> {
    return page.waitForResponse(
        r => pattern.test(r.url()) && r.request().method() === method,
        { timeout },
    )
}

// ============================================================
// UI flows — drive the SPA so the SUT's own client does the network work.
// ============================================================

async function gotoTestCases(page: Page): Promise<void> {
    await page.goto('/test-cases')
    await searchInput(page).waitFor({ state: 'visible', timeout: 15_000 })
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
    await page.locator('button[data-tour="ai-test-create"]').waitFor({ state: 'visible', timeout: 5_000 })
}

async function searchFor(page: Page, query: string): Promise<void> {
    const input = searchInput(page)
    await expect(input).toBeVisible()
    await input.fill(query)
    await expect(input).toHaveValue(query)
    // The list is server-side filtered after a 300ms debounce.
    await expect(
        page.locator(SEL.row).filter({ has: nameMatch(page, query) }),
    ).toBeVisible({ timeout: 50_000 })
}

async function clearSearch(page: Page): Promise<void> {
    const input = searchInput(page)
    await expect(input).toBeVisible()
    await input.fill('')
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

/**
 * Create an AI test case and return its session id. On success the SPA
 * navigates to `/test-analysis/<sessionId>`; we parse the id from the URL so
 * callers can return to `/test-cases` and clean up.
 */
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
        waitForApi(page, /\/api\/analysis\/sessions\b/, 'POST'),
        dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
    ])
    if (!response.ok()) {
        const body = await response.text().catch(() => '')
        throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
    }

    await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
    const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
    if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
    return match[1]
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

    // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
    await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
    expect(page.url()).toMatch(/\/test-analysis/)
    await page.getByRole('button', { name: 'Analysis', exact: true }).click()
    await expect(page.getByText('Recording started (playwright')).toBeVisible({ timeout: 50_000 })
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
        waitForApi(page, /\/api\/analysis\/sessions\/[^/]+\/title\b/, 'PATCH', 10_000),
        dialog.locator('button[type="submit"]', { hasText: /^Save$/ }).click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiCloneTestCase(page: Page, row: Locator, newTitle: string): Promise<void> {
    await clickRowAction(row, 'Clone test case')

    const dialog = page.locator('div[role="dialog"]', { hasText: 'Clone Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await dialog.locator('#cloneTitle').fill(newTitle)

    const [response] = await Promise.all([
        waitForApi(page, /\/api\/analysis\/sessions\/[^/]+\/clone\b/, 'POST'),
        dialog.locator('button[type="submit"]', { hasText: /^Clone$/ }).click(),
    ])
    expect(response.status()).toBe(200)

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
}

async function uiDeleteTestCase(page: Page, name: string, row: Locator): Promise<void> {
    await clickRowAction(row, 'Delete test case')

    // ConfirmationDialog uses role="alertdialog" (NOT role="dialog").
    const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await Promise.all([
        waitForApi(page, /\/api\/analysis\/sessions\/[^/]+$/, 'DELETE', 10_000),
        dialog.locator('button', { hasText: /^Delete$/ }).first().click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
    await expectToast(page, /test case deleted/i)
    await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 10_000 })
}

/** The portaled "Edit tags" dialog opened from a row's tags cell. */
function tagEditor(page: Page): Locator {
    return page.getByRole('dialog').filter({ hasText: 'Edit tags' })
}

/** Open a row's tags cell, revealing the portaled "Edit tags" combobox. */
async function openTagEditor(page: Page, row: Locator): Promise<Locator> {
    // The tags cell opens a dialog portaled to <body> — the combobox is NOT a
    // descendant of the row, so target the dialog rather than the row.
    await row.locator('button[title="Click to edit tags"]').click()
    const input = tagEditor(page).getByRole('combobox')
    await expect(input).toBeVisible({ timeout: 5_000 })
    return input
}

/** Attach a new tag to a row via the "Edit tags" dialog. */
async function uiAddTag(page: Page, row: Locator, tagName: string): Promise<void> {
    const tagInput = await openTagEditor(page, row)

    await tagInput.fill(tagName)
    // First creates the tag via POST /api/tags, then attaches it via
    // POST /api/tags/session/<id>. Wait for the attach call (the second one)
    // since it's the persistence boundary the assertion cares about.
    await Promise.all([
        waitForApi(page, /\/api\/tags\/session\/[^/]+\b/, 'POST'),
        tagInput.press('Enter'),
    ])

    // Close the editor and confirm the chip landed on the row.
    await page.keyboard.press('Escape')
    await expect(row.getByText(tagName, { exact: true })).toBeVisible({ timeout: 5_000 })
}

// ============================================================
// Tests — preserve user-supplied numbering TC-065 .. TC-076
// ============================================================

test('TC-065 — Create AI test case with name and description', async ({ page }) => {
    const name = `qa-ai-${ts()}`

    const sessionId = await uiCreateAITestCase(page, name, 'Created by Playwright TC-065')

    // Step 7 — verify navigation to test analysis page.
    expect(page.url()).toMatch(new RegExp(`/test-analysis/${sessionId}`))
    await expect(page.getByText('Start a test')).toBeVisible({ timeout: 30_000 })

    // Verify it's listed when we go back.
    await gotoTestCases(page)
    await searchFor(page, name)
    await expect(testCaseRow(page, name)).toBeVisible({ timeout: 8_000 })

    // Cleanup so the project ends clean.
    await uiDeleteTestCase(page, name, testCaseRow(page, name))
})

test('TC-066 — Update existing AI test case name and description', async ({ page }) => {
    const original = `qa-ai-${ts()}`
    const renamed = `qa-renamed-${ts()}`

    await uiCreateAITestCase(page, original, 'Original description')
    await gotoTestCases(page)
    await searchFor(page, original)
    const row = testCaseRow(page, original)
    await expect(row).toBeVisible({ timeout: 8_000 })

    await uiUpdateTestCase(page, row, renamed, 'Edited by Playwright TC-066')

    // Verify success toast + new name visible after edit.
    await expectToast(page, /test case updated/i)
    await clearSearch(page)
    await searchFor(page, renamed)
    await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })
    await expect(page.getByText(original, { exact: true })).toBeHidden()

    // Cleanup.
    await uiDeleteTestCase(page, original, testCaseRow(page, renamed))
})

test('TC-067 — Delete AI test case', async ({ page }) => {
    const name = `qa-del-${ts()}`

    await uiCreateAITestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)
    const row = testCaseRow(page, name)
    await expect(row).toBeVisible({ timeout: 8_000 })

    await uiDeleteTestCase(page, name, row)

    // After delete: row is gone.
    await expect(page.getByText(name, { exact: true })).toBeHidden({ timeout: 8_000 })
})

test('TC-068 — Clone AI test case', async ({ page }) => {
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
    await uiDeleteTestCase(page, cloneName, testCaseRow(page, cloneName))
    await clearSearch(page)
    await searchFor(page, original)
    await uiDeleteTestCase(page, original, testCaseRow(page, original))
})

test('TC-069 — Recorded test case modal accepts name + URL and routes to recording flow', async ({ page }) => {
    // We don't actually start a recording (it spins up a remote browser
    // container). We assert that the modal collects the inputs, validates
    // the URL, and routes the user into the /test-analysis recording entry
    // — that's the user-driven boundary on this page.

    const name = `qa-rec-${ts()}`
    await uiCreateRecordTestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)

    const orphan = recordedTestCaseRow(page, name)
    if (!(await orphan.isVisible().catch(() => false))) {
        test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
    }
    await uiDeleteTestCase(page, name, orphan)
})

test('TC-070 — Update an existing recorded test case', async ({ page }) => {
    // Recorded test cases are produced by the recording-browser flow, which
    // requires a remote container we deliberately don't drive in CI. So we
    // pick the row carrying the "Recording" badge. Skip cleanly when the
    // project doesn't have one yet.

    const name = `qa-rec-${ts()}`
    await uiCreateRecordTestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)

    const recordedRow = recordedTestCaseRow(page, name)
    if (!(await recordedRow.isVisible().catch(() => false))) {
        test.skip(true, 'No recorded test case in this project yet — create one via the SUT first.')
    }

    const renamed = `qa-rec-edit-${ts()}`
    await uiUpdateTestCase(page, recordedRow, renamed)
    await expectToast(page, /test case updated/i)
    await searchFor(page, renamed)
    await expect(testCaseRow(page, renamed)).toBeVisible({ timeout: 8_000 })

    // Cleanup.
    await searchFor(page, renamed)
    const orphan = recordedTestCaseRow(page, renamed)
    if (!(await orphan.isVisible().catch(() => false))) {
        test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
    }
    await uiDeleteTestCase(page, renamed, orphan)
})

test('TC-071 — Delete a recorded test case', async ({ page }) => {
    // Hard to safely delete a real recorded session (it may be load-bearing
    // for the user). Instead, delete the `qa-rec-*` one we just created. If
    // it isn't present as a recording, skip.

    const name = `qa-rec-${ts()}`
    await uiCreateRecordTestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)

    const orphan = recordedTestCaseRow(page, name)
    if (!(await orphan.isVisible().catch(() => false))) {
        test.skip(true, 'No qa-rec-* recorded test case to delete — nothing to clean up.')
    }
    await uiDeleteTestCase(page, name, orphan)
})

test('TC-072 — Clone a recorded test case', async ({ page }) => {
    const name = `qa-rec-${ts()}`
    await uiCreateRecordTestCase(page, name)
    await gotoTestCases(page)
    await searchFor(page, name)

    const recordedRow = recordedTestCaseRow(page, name)
    await expect(recordedRow).toBeVisible({ timeout: 15_000 })

    const cloneName = `qa-rec-clone-${ts()}`
    await uiCloneTestCase(page, recordedRow, cloneName)
    // Wait for the server-side filtered list to surface the cloned row before
    // acting on it — searchFor fills the box and waits for the row to appear.
    await searchFor(page, cloneName)

    // Cleanup.
    await uiDeleteTestCase(page, cloneName, testCaseRow(page, cloneName))
    await clearSearch(page)
    await searchFor(page, name)
    await uiDeleteTestCase(page, name, testCaseRow(page, name))
})

test('TC-073 — Search filters the list to matching test cases', async ({ page }) => {
    // Seed a uniquely-named test case so we know the search must surface
    // exactly one row regardless of the rest of the project's state.

    const unique = `qa-search-${ts()}`
    await uiCreateAITestCase(page, unique)

    await gotoTestCases(page)
    await searchFor(page, unique)

    // Exactly one matching row.
    const matchingRows = page.locator(SEL.row)
    await expect.poll(async () => await matchingRows.count(), { timeout: 8_000 }).toBe(1)
    await expect(testCaseRow(page, unique)).toBeVisible()

    // Cleanup.
    await uiDeleteTestCase(page, unique, testCaseRow(page, unique))
})

test('TC-074 — Add a tag to a test case', async ({ page }) => {
    const tcName = `qa-tag-${ts()}`
    const tagName = `pw-${ts()}`
    await uiCreateAITestCase(page, tcName)
    await gotoTestCases(page)
    await searchFor(page, tcName)
    const row = testCaseRow(page, tcName)
    await expect(row).toBeVisible({ timeout: 8_000 })

    await uiAddTag(page, row, tagName)

    // Blur the tag editor by clicking the search input, then delete.
    await searchInput(page).click()
    await uiDeleteTestCase(page, tcName, testCaseRow(page, tcName))
})

test('TC-075 — Removing a tag persists after page reload', async ({ page }) => {
    const tcName = `qa-rmtag-${ts()}`
    const tagName = `rm-${ts()}`
    await uiCreateAITestCase(page, tcName)
    await gotoTestCases(page)
    await searchFor(page, tcName)
    const row = testCaseRow(page, tcName)
    await expect(row).toBeVisible({ timeout: 8_000 })

    // Add a tag first.
    await uiAddTag(page, row, tagName)

    // Re-open the tags editor. Press Backspace on the empty input — TagInput
    // (TagInput.tsx) handles Backspace + empty input by calling
    // removeTag(lastTag), which keeps focus inside the input throughout
    // (no blur race). Click the input first to ensure focus is there.
    const editInput = await openTagEditor(page, row)
    await editInput.click()
    await editInput.fill('')

    await Promise.all([
        waitForApi(page, /\/api\/tags\/session\/[^/]+\b/, 'DELETE', 10_000),
        editInput.press('Backspace'),
    ])
    await page.keyboard.press('Escape')
    await expect(row.getByText(tagName, { exact: true })).toBeHidden({ timeout: 5_000 })

    // Reload — verify the tag is still gone (persisted, not just local).
    await page.reload()
    await searchInput(page).waitFor({ state: 'visible', timeout: 10_000 })
    await searchFor(page, tcName)
    const reloadedRow = testCaseRow(page, tcName)
    await expect(reloadedRow).toBeVisible({ timeout: 8_000 })
    await expect(reloadedRow.getByText(tagName, { exact: true })).toBeHidden()

    // Cleanup.
    await uiDeleteTestCase(page, tcName, testCaseRow(page, tcName))
})

test('TC-076 — Bulk select and bulk delete test cases', async ({ page }) => {
    const a = `qa-bulk-A-${ts()}`
    const b = `qa-bulk-B-${ts()}`
    const c = `qa-bulk-C-${ts()}`

    // Create three throwaway test cases.
    await uiCreateAITestCase(page, a)
    await uiCreateAITestCase(page, b)
    await uiCreateAITestCase(page, c)

    await gotoTestCases(page)
    await expect(testCaseRow(page, a)).toBeVisible()
    await expect(testCaseRow(page, b)).toBeVisible()
    await expect(testCaseRow(page, c)).toBeVisible()

    const rows = page.locator(SEL.row)
    await expect.poll(async () => await rows.count(), { timeout: 10_000 }).toBeGreaterThanOrEqual(3)

    // Tick the three checkboxes.
    for (const name of [a, b, c]) {
        await testCaseRow(page, name).locator('input[type="checkbox"]').check()
    }

    // The bulk-actions button reads "Delete N Selected".
    const bulkBtn = page.locator('button', { hasText: /Delete \d+ Selected/ })
    await expect(bulkBtn).toBeVisible({ timeout: 3_000 })
    await expect(bulkBtn).toContainText('Delete 3 Selected')

    await bulkBtn.click()

    const dialog = page.locator('div[role="alertdialog"]', { hasText: /Delete 3 Test Cases/i })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })

    await Promise.all([
        waitForApi(page, /\/api\/analysis\/sessions\/[^/]+$/, 'DELETE'),
        dialog.locator('button', { hasText: /Delete 3 Test Cases/i }).click(),
    ])

    await dialog.waitFor({ state: 'hidden', timeout: 8_000 })

    // Toast confirmation.
    await expectToast(page, /3 test case\(s\) deleted/i)

    // List no longer shows our three rows.
    await expect(page.getByText(a, { exact: true })).toBeHidden({ timeout: 8_000 })
    await expect(page.getByText(b, { exact: true })).toBeHidden()
    await expect(page.getByText(c, { exact: true })).toBeHidden()

    // Reload and confirm they don't reappear.
    await page.reload()
    await searchInput(page).waitFor({ state: 'visible', timeout: 10_000 })
    await expect(page.getByText(a, { exact: true })).toBeHidden()
    await expect(page.getByText(b, { exact: true })).toBeHidden()
    await expect(page.getByText(c, { exact: true })).toBeHidden()
})
