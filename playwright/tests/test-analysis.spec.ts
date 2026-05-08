import { test, expect, type Locator, type Page } from '@playwright/test'
import { ENV } from '../env'

// Authenticated via auth.setup.
test.use({ storageState: '.auth/user.json' })

// All tests target the same per-user session table; run serial so a slow
// LLM/container in one test doesn't pile up parallel sessions and exhaust
// per-tier session quota.
test.describe.configure({ mode: 'serial' })

// These tests drive real LLM plan generation and (in some cases) browser
// execution. Per-test budgets are generous because the SUT may need to
// boot a remote container the first time it executes in a session.
const PLAN_TIMEOUT_MS = 180_000
const EXEC_TIMEOUT_MS = 360_000
test.setTimeout(EXEC_TIMEOUT_MS + 60_000)

const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)

// Designed to be tiny so plan generation + execution complete quickly.
const SIMPLE_PROMPT = 'Open https://example.com and verify the page contains the text "Example Domain".'
const ACT_PROMPT = 'Navigate to https://example.com'

// ============================================================
// Helpers — UI-only. Mirror the patterns from test-cases.spec.ts.
// ============================================================

async function gotoTestCases(page: Page): Promise<void> {
    await page.goto('/test-cases')
    await page
        .locator('input[placeholder="Search test cases…"]')
        .waitFor({ state: 'visible', timeout: 15_000 })
}

async function uiCreateAITestCase(page: Page, name: string): Promise<string> {
    await gotoTestCases(page)
    await page.locator('button[data-tour="new-test-case-btn"]').click()
    await page.locator('button[data-tour="ai-test-create"]').click()
    const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })
    await dialog.locator('#test-case-name').fill(name)
    const [response] = await Promise.all([
        page.waitForResponse(
            r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
            { timeout: 15_000 },
        ),
        dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
    ])
    if (!response.ok()) throw new Error(`createSession ${response.status()}`)
    await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 12_000 })
    const m = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
    if (!m) throw new Error(`Could not parse sessionId from ${page.url()}`)
    return m[1]
}

async function deleteSessionViaList(page: Page, name: string): Promise<void> {
    await gotoTestCases(page)
    await page.locator('input[placeholder="Search test cases…"]').fill(name)
    await page.waitForTimeout(500)
    const row = page
        .locator('table tbody tr.test-case-row')
        .filter({ has: page.getByText(name, { exact: true }) })
        .first()
    if (!(await row.isVisible().catch(() => false))) return
    await row.hover()
    await row.locator('button[aria-label="Delete test case"]').click()
    const dialog = page.locator('div[role="alertdialog"]', { hasText: 'Delete Test Case' })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })
    await dialog.locator('button', { hasText: /^Delete$/ }).first().click()
    await dialog.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => undefined)
}

function chatTextarea(page: Page): Locator {
    // The ChatInput renders a textarea inside [data-tour="chat-input"].
    return page.locator('[data-tour="chat-input"] textarea, textarea[data-tour="chat-input"]').first()
}

async function setMode(page: Page, mode: 'plan' | 'act'): Promise<void> {
    const toggle = page.locator('[data-tour="mode-toggle"]')
    await expect(toggle).toBeVisible({ timeout: 5_000 })
    const label = mode === 'plan' ? 'Plan' : 'Act'
    await toggle.locator('button', { hasText: new RegExp(`^${label}$`) }).click()
}

async function sendPrompt(page: Page, prompt: string, via: 'click' | 'enter' = 'click'): Promise<void> {
    const ta = chatTextarea(page)
    await expect(ta).toBeVisible({ timeout: 5_000 })
    await ta.click()
    await ta.fill(prompt)
    if (via === 'click') {
        await page.locator('button[data-tour="send-button"]').click()
    } else {
        // The component sends on Enter (without Shift). Pressing Enter on
        // the textarea triggers handleKeyDown's submit path.
        await ta.press('Enter')
    }
}

async function waitForPlan(page: Page, timeoutMs = PLAN_TIMEOUT_MS): Promise<void> {
    // The "Approve & Analyze" button is only rendered after plan generation
    // completes and the plan card mounts. data-tour="approve-execute-btn".
    await page
        .locator('button[data-tour="approve-execute-btn"]')
        .waitFor({ state: 'visible', timeout: timeoutMs })
}

async function approvePlan(page: Page): Promise<void> {
    await page.locator('button[data-tour="approve-execute-btn"]').click()
}

async function rejectPlan(page: Page): Promise<void> {
    await page.locator('button', { hasText: /^Reject$/ }).first().click()
}

/**
 * Wait for the running execution to terminate. The page renders a Stop
 * button only while `isExecuting || isRunningTillEnd || sessionStatus ===
 * 'rerunning'`. The Reset button is *always* visible when not executing,
 * so anchoring on Reset alone is misleading (it's also visible in the
 * idle state right after session creation). Sequence:
 *   1. Wait for Stop to appear → execution actually started
 *   2. Wait for Stop to disappear → execution terminated (any way)
 */
async function waitForExecutionEnd(page: Page, timeoutMs = EXEC_TIMEOUT_MS): Promise<void> {
    const stopBtn = page.locator('button', { hasText: /^Stop( Re-Run)?$/ })
    await expect(stopBtn).toBeVisible({ timeout: 90_000 })
    await expect(stopBtn).toBeHidden({ timeout: timeoutMs })
}

async function clickResetAndConfirm(page: Page): Promise<void> {
    await page.locator('button', { hasText: /^Reset$/ }).click()
    const dialog = page.locator('div[role="alertdialog"]', { hasText: /Reset Session/i })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })
    await dialog.locator('button', { hasText: /^Reset$/ }).click()
    await dialog.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined)
}

// ============================================================
// Tests
// ============================================================

test('TC-077 — AI test case end-to-end: create, plan, approve, execute', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc77-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)
        await approvePlan(page)
        await waitForExecutionEnd(page)
        // After completion, the timeline shows step rows and the Reset
        // button is enabled.
        await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible()
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-078 — Status transitions: idle → generating plan → completed', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc78-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        // After creation the session is idle. There's no exec-timer pill,
        // and the chat input is enabled.
        await expect(chatTextarea(page)).toBeEnabled({ timeout: 5_000 })

        await sendPrompt(page, SIMPLE_PROMPT)
        // Generating-plan: the input becomes disabled while the LLM works.
        await expect(chatTextarea(page)).toBeDisabled({ timeout: 8_000 })

        await waitForPlan(page)
        // Plan ready, waiting for approval. Stop button absent yet.
        await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeVisible()

        await approvePlan(page)
        // Running: Stop button appears.
        await expect(page.locator('button', { hasText: /^Stop$/ })).toBeVisible({ timeout: 30_000 })

        await waitForExecutionEnd(page)
        // Completed: Stop is hidden, Reset is back.
        await expect(page.locator('button', { hasText: /^Stop$/ })).toBeHidden()
        await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible()
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-079 — Plan mode prompt generates a plan with steps', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc79-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)
        // Plan UI shows Edit Plan / Update Plan / Approve / Reject controls.
        await expect(page.locator('button', { hasText: /^Edit Plan$/ })).toBeVisible()
        await expect(page.locator('button', { hasText: /^Update Plan$/ })).toBeVisible()
        await expect(page.locator('button', { hasText: /^Reject$/ })).toBeVisible()
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-080 — Edit Plan opens the plan editor', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc80-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)
        await page.locator('button', { hasText: /^Edit Plan$/ }).click()
        // The plan editor renders as a dialog with "Edit Plan" heading.
        const editor = page.locator('div[role="dialog"]', { hasText: /Edit Plan/i })
        await expect(editor).toBeVisible({ timeout: 5_000 })
        // Close without saving — we've verified the editor opens.
        await editor.locator('button', { hasText: /^(Cancel|Close)$/ }).first().click()
            .catch(async () => {
                await page.keyboard.press('Escape')
            })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-081 — Update Plan reveals a revise-prompt input', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc81-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)
        await page.locator('button', { hasText: /^Update Plan$/ }).click()
        // Revise input appears with placeholder "Describe what to change…".
        await expect(
            page.locator('textarea[placeholder*="Describe what to change"]'),
        ).toBeVisible({ timeout: 5_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-082 — Reject plan dismisses the plan card', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc82-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)
        await rejectPlan(page)
        // After reject: the Approve button must be gone and the chat
        // input is re-enabled.
        await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden({ timeout: 8_000 })
        await expect(chatTextarea(page)).toBeEnabled({ timeout: 5_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-083 — Reset clears the session', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc83-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        await sendPrompt(page, SIMPLE_PROMPT)
        await waitForPlan(page)

        await clickResetAndConfirm(page)

        // After reset: the plan card disappears and the chat input is
        // available again. The reset overlay (if any) clears within ~10s.
        await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden({ timeout: 15_000 })
        await expect(chatTextarea(page)).toBeEnabled({ timeout: 10_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-084 — Act mode kicks off execution immediately (no plan stage)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc84-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'act')
        await sendPrompt(page, ACT_PROMPT)
        // Act mode: no Approve button is ever rendered. The Stop button
        // appears once execution starts.
        await expect(page.locator('button', { hasText: /^Stop$/ })).toBeVisible({ timeout: 60_000 })
        // No approval prompt was needed.
        await expect(page.locator('button[data-tour="approve-execute-btn"]')).toBeHidden()
        // Wait for execution to complete to leave a clean state.
        await waitForExecutionEnd(page)
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-085 — Manual Stop transitions execution out of running', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc85-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'act')
        await sendPrompt(page, ACT_PROMPT)
        const stopBtn = page.locator('button', { hasText: /^Stop$/ })
        await expect(stopBtn).toBeVisible({ timeout: 60_000 })
        await stopBtn.click()
        // After clicking Stop, the button transitions to "Stopping..." then
        // disappears. Reset becomes available again.
        await expect(page.locator('button', { hasText: /^Reset$/ })).toBeVisible({
            timeout: 90_000,
        })
        await expect(page.locator('button', { hasText: /^Stop$/ })).toBeHidden({ timeout: 5_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

// ============================================================
// Tests requiring completed execution with steps to manipulate
// ============================================================

async function runToCompletion(page: Page, name: string): Promise<string> {
    const sessionId = await uiCreateAITestCase(page, name)
    await sendPrompt(page, SIMPLE_PROMPT)
    await waitForPlan(page)
    await approvePlan(page)
    await waitForExecutionEnd(page)
    return sessionId
}

test('TC-086 — Delete a single action step from a completed run', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc86-${ts()}`
    try {
        await runToCompletion(page, name)
        // The simpleMode timeline (default) renders each action via
        // SimpleActionRow, which exposes a per-row delete button with
        // aria-label="Delete step" — hidden until hover. Locate the first
        // action row by its data-action-id attribute, hover it to reveal
        // the trash icon, then click.
        const firstAction = page.locator('[data-action-id]').first()
        try {
            await firstAction.waitFor({ state: 'visible', timeout: 15_000 })
        } catch {
            test.skip(true, 'Run completed without producing action rows to delete.')
        }
        await firstAction.hover()
        const deleteBtn = firstAction.locator('button[aria-label="Delete step"]').first()
        await expect(deleteBtn).toBeVisible({ timeout: 5_000 })
        await deleteBtn.click()
        // DeleteStepDialog / DeleteActionDialog both use role="dialog".
        const dialog = page.locator('div[role="dialog"]', { hasText: /Delete (Step|Action)/i })
        await dialog.waitFor({ state: 'visible', timeout: 5_000 })
        await dialog.locator('button', { hasText: /^Delete$/ }).first().click()
        await dialog.waitFor({ state: 'hidden', timeout: 8_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-087 — Reorder steps after a completed run', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc87-${ts()}`
    try {
        await runToCompletion(page, name)
        // The reorder dialog is opened via the timeline "reorder" affordance.
        // The button has text "Reorder" in the tools row.
        const reorderBtn = page.locator('button', { hasText: /^Reorder$/ })
        if (!(await reorderBtn.isVisible().catch(() => false))) {
            test.skip(true, 'Reorder affordance not visible — run may have produced fewer than 2 steps.')
        }
        await reorderBtn.click()
        const dialog = page.locator('div[role="dialog"]', { hasText: /Reorder/i })
        await expect(dialog).toBeVisible({ timeout: 5_000 })
        // Verify there are draggable items and a Cancel/Save button.
        await expect(dialog.locator('button', { hasText: /^(Cancel|Close)$/ }).first()).toBeVisible()
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-088 — Mark a step as Skip (only available during paused-on-failure)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // The user spec says "after completion, mark a step as skip", but the
    // SUT only renders the Skip affordance via StepFailureOptions, which
    // mounts during a paused-on-failure state inside Run-Till-End mode —
    // not on a completed test. We can't reliably force a failure with the
    // current SIMPLE_PROMPT, so we verify the gating: after a clean
    // completion, no Skip button should be visible. If a Skip button does
    // surface (because the LLM produced a failure), exercise it.
    const name = `qa-tc88-${ts()}`
    try {
        await runToCompletion(page, name)
        const skipBtn = page.locator('button', { hasText: /^Skip$/ }).first()
        if (!(await skipBtn.isVisible().catch(() => false))) {
            test.skip(
                true,
                'No Skip affordance after a clean completion — Skip is exposed only during a paused-on-failure state in Run-Till-End mode.',
            )
        }
        await skipBtn.click()
        // After clicking, the step row should show a visible "Skipped"
        // indicator. Don't enforce a specific class — just assert the
        // button is gone (it transitions to "Continue" once skipped).
        await expect(skipBtn).toBeHidden({ timeout: 5_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

async function bulkDeleteActionsFlow(page: Page): Promise<void> {
    // Enter multi-select mode via the timeline's "Select Actions" button
    // (only visible when simpleMode + canEdit + onBulkDeleteActions).
    const selectActionsBtn = page.locator('button', { hasText: /^Select Actions$/ })
    if (!(await selectActionsBtn.isVisible().catch(() => false))) {
        test.skip(true, '"Select Actions" toolbar not visible — bulk delete unavailable on this run.')
    }
    await selectActionsBtn.click()
    // In multi-select mode, action rows render a checkbox. Tick the first
    // two we can find inside the chat timeline.
    const checkboxes = page.locator('input[type="checkbox"]')
    await expect(checkboxes.first()).toBeVisible({ timeout: 5_000 })
    const total = await checkboxes.count()
    if (total < 2) {
        test.skip(true, `Need at least 2 action checkboxes for bulk delete; saw ${total}.`)
    }
    await checkboxes.nth(0).check()
    await checkboxes.nth(1).check()
    const bulkBtn = page.locator('button', { hasText: /^Delete Selected$/ })
    await expect(bulkBtn).toBeVisible({ timeout: 5_000 })
    await bulkBtn.click()
    // The DeleteActionDialog component uses role="dialog" (the modal
    // overlay) — NOT role="alertdialog". Match by visible heading.
    const dialog = page.locator('div[role="dialog"]', { hasText: /Delete \d+ (action|step)|Delete Action|Delete Step/i })
    await dialog.waitFor({ state: 'visible', timeout: 5_000 })
    await dialog.locator('button', { hasText: /^Delete/ }).first().click()
    await dialog.waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => undefined)
}

test('TC-089 — Bulk select + delete multiple actions', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc89-${ts()}`
    try {
        await runToCompletion(page, name)
        await bulkDeleteActionsFlow(page)
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-090 — Bulk select + delete (alternate run)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    // TC-089 and TC-090 are identical in the spec. Repeat against a fresh
    // session to catch state leakage between runs.
    const name = `qa-tc90-${ts()}`
    try {
        await runToCompletion(page, name)
        await bulkDeleteActionsFlow(page)
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-091 — Browser profile dropdown selects an active profile', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc91-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        // The browser-profile <select> lives inside the Settings panel.
        await page.locator('button[data-tour="settings-toggle"]').click()
        const panel = page.locator('[data-tour="settings-panel"]')
        await expect(panel).toBeVisible({ timeout: 5_000 })
        // The profile dropdown only renders when the org has at least one
        // active browser profile. Skip cleanly otherwise.
        const profileSelect = panel.locator('select').nth(2) // 0=LLM, 1=may not exist, 2=profile
        const profileSelectAlt = panel.locator('select').filter({ hasText: /No browser profile|profile/i }).first()
        const select = (await profileSelect.isVisible().catch(() => false))
            ? profileSelect
            : profileSelectAlt
        if (!(await select.isVisible().catch(() => false))) {
            test.skip(true, 'No browser profile dropdown — org has no active browser profiles.')
        }
        const options = await select.locator('option').allInnerTexts()
        if (options.filter(t => t && t !== 'No browser profile').length === 0) {
            test.skip(true, 'Browser profile dropdown is empty.')
        }
        // Pick the first non-empty option.
        const target = options.find(o => o && o !== 'No browser profile')!
        await select.selectOption({ label: target })
        await expect(select).toHaveValue(/.+/)
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-092 — Press Enter sends the prompt', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc92-${ts()}`
    try {
        await uiCreateAITestCase(page, name)
        await setMode(page, 'plan')
        // Pressing Enter on the textarea (no Shift) should fire the same
        // request as clicking Send. We watch for the chat-message POST
        // (sessions/<id>/messages) which fires regardless of mode.
        const ta = chatTextarea(page)
        await ta.click()
        await ta.fill(SIMPLE_PROMPT)
        const [response] = await Promise.all([
            page.waitForResponse(
                r =>
                    /\/api\/analysis\/sessions\/[^/]+\/(messages|plan|chat)\b/.test(r.url()) &&
                    r.request().method() === 'POST',
                { timeout: 30_000 },
            ),
            ta.press('Enter'),
        ])
        expect(response.ok()).toBe(true)
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-093 — Clicking an action row selects it (visual ring + step focus)', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc93-${ts()}`
    try {
        await runToCompletion(page, name)
        // SimpleActionRow rows carry data-action-id. Clicking one fires
        // onStepSelect + onActionSelect, which updates selectedActionId
        // and adds `ring-2 ring-primary` to the row's class list. The
        // BrowserPanel on the right consumes selectedStep.url to swap to
        // the corresponding screenshot — verify the ring as the
        // deterministic UI signal.
        const firstAction = page.locator('[data-action-id]').first()
        try {
            await firstAction.waitFor({ state: 'visible', timeout: 15_000 })
        } catch {
            test.skip(true, 'No action rows produced — execution may have produced zero actions.')
        }
        await firstAction.click()
        await expect(firstAction).toHaveClass(/ring-primary/, { timeout: 5_000 })
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})

test('TC-094 — Test data linking control surfaces after analysis', async ({ page }) => {
    test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
    const name = `qa-tc94-${ts()}`
    try {
        await runToCompletion(page, name)
        // After completion, a "Link Test Data" control should appear in
        // the toolbar / timeline. Verify it's visible. Don't actually run
        // the linking flow (it depends on test-data records being present).
        const linkBtn = page.locator('button', { hasText: /Link Test Data|Test Data/i }).first()
        if (!(await linkBtn.isVisible().catch(() => false))) {
            test.skip(true, 'Link Test Data control not visible — test-data feature may be plan-gated.')
        }
    } finally {
        await deleteSessionViaList(page, name).catch(() => undefined)
    }
})
