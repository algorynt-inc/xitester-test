# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-065 — Create AI test case with name and description
- Location: tests/test-cases.spec.ts:225:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Search test cases…"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - status "Loading" [ref=e3]
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Authenticated via auth.setup. Storage state carries the user's currently
  5   | // selected organisation + project, which already places `/test-cases` inside
  6   | // the right scope. Tests don't switch orgs explicitly — the user spec asks
  7   | // for "Regression_test_success" but we honour whatever the storage state
  8   | // already has, since switching orgs is a separate concern (covered in nav).
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | // All test-case mutations land in the same account/project. Run serial so
  12  | // that two tests don't fight over the same list (search box, bulk-select,
  13  | // pagination state).
  14  | test.describe.configure({ mode: 'serial' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | // const ts = () => new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  18  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  19  | 
  20  | // ============================================================
  21  | // Helpers — UI-only, no API helper calls. Each helper drives the SPA so
  22  | // the SUT's own client/SDK does the actual network work.
  23  | // ============================================================
  24  | 
  25  | async function gotoTestCases(page: Page): Promise<void> {
  26  |     await page.goto('/test-cases')
  27  |     await page
  28  |         .locator('input[placeholder="Search test cases…"]')
> 29  |         .waitFor({ state: 'visible', timeout: 15_000 })
      |          ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  30  |     // Wait for either rows or the empty-state to settle so the list is
  31  |     // stable before the test interacts with it.
  32  |     await page
  33  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  34  |         .first()
  35  |         .waitFor({ state: 'visible', timeout: 10_000 })
  36  |         .catch(() => undefined)
  37  | }
  38  | 
  39  | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  40  |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  41  |     // The "AI Test Create" item is rendered conditionally on the dropdown
  42  |     // being open — wait for it before continuing.
  43  |     await page
  44  |         .locator('button[data-tour="ai-test-create"]')
  45  |         .waitFor({ state: 'visible', timeout: 5_000 })
  46  | }
  47  | 
  48  | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  49  |     await gotoTestCases(page)
  50  |     await openNewTestCaseDropdown(page)
  51  |     await page.locator('button[data-tour="ai-test-create"]').click()
  52  | 
  53  |     // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
  54  |     // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
  55  |     // outer dialog by visible heading instead.
  56  |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
  57  |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  58  | 
  59  |     await dialog.locator('#test-case-name').fill(name)
  60  |     if (description) {
  61  |         await dialog.locator('#test-case-description').fill(description)
  62  |     }
  63  | 
  64  |     const [response] = await Promise.all([
  65  |         page.waitForResponse(
  66  |             r => /\/api\/analysis\/sessions\b/.test(r.url()) && r.request().method() === 'POST',
  67  |             { timeout: 15_000 },
  68  |         ),
  69  |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  70  |     ])
  71  |     if (!response.ok()) {
  72  |         const body = await response.text().catch(() => '')
  73  |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  74  |     }
  75  |     // SPA navigates to /test-analysis/<sessionId> on success. Pull the id
  76  |     // from the URL so callers can return to /test-cases and clean up.
  77  |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
  78  |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  79  |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  80  |     return match[1]
  81  | 
  82  | }
  83  | 
  84  | /**
  85  |  * Locate the row whose visible title equals `name`. Each row has a `tr`
  86  |  * wrapper carrying the `test-case-row` class; we anchor on the title cell
  87  |  * and climb to the row.
  88  |  */
  89  | function testCaseRow(page: Page, name: string): Locator {
  90  |     return page
  91  |         .locator('table tbody tr.test-case-row')
  92  |         .filter({ has: page.getByText(name, { exact: true }) })
  93  |         .first()
  94  | }
  95  | 
  96  | async function searchFor(page: Page, query: string): Promise<void> {
  97  |     const input = page.locator('input[placeholder="Search test cases…"]')
  98  |     await expect(input).toBeVisible()
  99  |     await input.fill(query)
  100 |     await expect(input).toHaveValue(query)
  101 |     // The list is server-side filtered after a 300ms debounce.
  102 |     await expect(
  103 |         page.locator('table tbody tr.test-case-row').filter({ hasText: query })
  104 |     ).toBeVisible({ timeout: 20_000 });
  105 | }
  106 | 
  107 | async function clearSearch(page: Page): Promise<void> {
  108 |     const input = page.locator('input[placeholder="Search test cases…"]')
  109 |     await expect(input).toBeVisible()
  110 |     await input.fill('')
  111 |     // await page.waitForTimeout(5000)
  112 | }
  113 | 
  114 | /**
  115 |  * Open the row's overflow actions and trigger a specific icon button.
  116 |  * The row's action cell exposes plain buttons with `aria-label`s like
  117 |  * "Clone test case", "Edit test case", "Delete test case".
  118 |  */
  119 | async function clickRowAction(
  120 |     row: Locator,
  121 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  122 | ): Promise<void> {
  123 |     // Hover the row so the actions cell becomes interactive in case CSS
  124 |     // hides it until hover (matches user behaviour).
  125 |     await row.hover()
  126 |     await row.locator(`button[aria-label="${action}"]`).click()
  127 | }
  128 | 
  129 | async function uiUpdateTestCase(
```