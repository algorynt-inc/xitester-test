# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-cases.spec.ts >> TC-071 — Delete a recorded test case
- Location: tests/test-cases.spec.ts:428:1

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Search test cases…"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]: 404 page not found
```

# Test source

```ts
  1   | import { test, expect, type Locator, type Page, type Response } from '@playwright/test'
  2   | import { ENV } from '../env'
  3   | 
  4   | // Authenticated via auth.setup. Storage state carries the user's currently
  5   | // selected organisation + project, which already places `/test-cases` inside
  6   | // the right scope. Tests don't switch orgs explicitly — the user spec asks
  7   | // for "Regression_test_success" but we honour whatever the storage state
  8   | // already has, since switching orgs is a separate concern (covered in nav).
  9   | test.use({ storageState: '.auth/user.json' })
  10  | 
  11  | // Tests run one-at-a-time (config sets `workers: 1`, `fullyParallel: false`), so
  12  | // they never fight over the shared account's list. `default` mode (not `serial`)
  13  | // keeps each test independent: if one fails, the rest still run.
  14  | test.describe.configure({ mode: 'default' })
  15  | 
  16  | const SKIP_NO_CREDS = `${ENV.name} env has no TEST_USER_EMAIL/TEST_USER_PASSWORD secret bundle.`
  17  | 
  18  | // Every test in this file needs a logged-in user. Guard once here instead of
  19  | // repeating the check at the top of each test.
  20  | test.beforeEach(() => {
  21  |     test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  22  | })
  23  | 
  24  | // ============================================================
  25  | // Constants
  26  | // ============================================================
  27  | 
  28  | /** Shared selectors for elements the whole suite touches. */
  29  | const SEL = {
  30  |     searchInput: 'input[placeholder="Search test cases…"]',
  31  |     row: 'table tbody tr.test-case-row',
  32  |     toaster: '[data-sonner-toaster]',
  33  | } as const
  34  | 
  35  | /** Unique-enough suffix (epoch ms + 4 random chars) for throwaway names. */
  36  | const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  37  | 
  38  | // ============================================================
  39  | // Locator + assertion helpers
  40  | // ============================================================
  41  | 
  42  | const searchInput = (page: Page): Locator => page.locator(SEL.searchInput)
  43  | 
  44  | /**
  45  |  * Match a test case by name. Long names are JS-truncated in the name cell (the
  46  |  * DOM text becomes e.g. `qa-rec-clone-…`), so exact visible-text matching misses
  47  |  * them. The full name is preserved in the cell's `title` attribute — match that
  48  |  * first, falling back to exact text for anything without a title attribute.
  49  |  */
  50  | function nameMatch(page: Page, name: string): Locator {
  51  |     return page.locator(`[title="${name}"]`).or(page.getByText(name, { exact: true }))
  52  | }
  53  | 
  54  | /** The `tr.test-case-row` whose name cell matches `name`. */
  55  | function testCaseRow(page: Page, name: string): Locator {
  56  |     return page.locator(SEL.row).filter({ has: nameMatch(page, name) }).first()
  57  | }
  58  | 
  59  | /** A `name`-matching row that also carries the "Recording" status badge. */
  60  | function recordedTestCaseRow(page: Page, name: string): Locator {
  61  |     return page
  62  |         .locator(SEL.row)
  63  |         .filter({ has: nameMatch(page, name) })
  64  |         .filter({ has: page.getByText(/^Recording$/) })
  65  |         .first()
  66  | }
  67  | 
  68  | /** Assert a Sonner toast containing `pattern` appears. */
  69  | async function expectToast(page: Page, pattern: RegExp, timeout = 5_000): Promise<void> {
  70  |     await expect(page.locator(SEL.toaster)).toContainText(pattern, { timeout })
  71  | }
  72  | 
  73  | /** Wait for the SUT's own client to make a matching API call. */
  74  | function waitForApi(
  75  |     page: Page,
  76  |     pattern: RegExp,
  77  |     method: string,
  78  |     timeout = 15_000,
  79  | ): Promise<Response> {
  80  |     return page.waitForResponse(
  81  |         r => pattern.test(r.url()) && r.request().method() === method,
  82  |         { timeout },
  83  |     )
  84  | }
  85  | 
  86  | // ============================================================
  87  | // UI flows — drive the SPA so the SUT's own client does the network work.
  88  | // ============================================================
  89  | 
  90  | async function gotoTestCases(page: Page): Promise<void> {
  91  |     await page.goto('/test-cases')
> 92  |     await searchInput(page).waitFor({ state: 'visible', timeout: 15_000 })
      |                             ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  93  |     // Wait for either rows or the empty-state to settle so the list is
  94  |     // stable before the test interacts with it.
  95  |     await page
  96  |         .locator('table tbody tr, text=No test cases found, text=Loading sessions…')
  97  |         .first()
  98  |         .waitFor({ state: 'visible', timeout: 10_000 })
  99  |         .catch(() => undefined)
  100 | }
  101 | 
  102 | async function openNewTestCaseDropdown(page: Page): Promise<void> {
  103 |     await page.locator('button[data-tour="new-test-case-btn"]').click()
  104 |     // The "AI Test Create" item is rendered conditionally on the dropdown
  105 |     // being open — wait for it before continuing.
  106 |     await page.locator('button[data-tour="ai-test-create"]').waitFor({ state: 'visible', timeout: 5_000 })
  107 | }
  108 | 
  109 | async function searchFor(page: Page, query: string): Promise<void> {
  110 |     const input = searchInput(page)
  111 |     await expect(input).toBeVisible()
  112 |     await input.fill(query)
  113 |     await expect(input).toHaveValue(query)
  114 |     // The list is server-side filtered after a 300ms debounce.
  115 |     await expect(
  116 |         page.locator(SEL.row).filter({ has: nameMatch(page, query) }),
  117 |     ).toBeVisible({ timeout: 50_000 })
  118 | }
  119 | 
  120 | async function clearSearch(page: Page): Promise<void> {
  121 |     const input = searchInput(page)
  122 |     await expect(input).toBeVisible()
  123 |     await input.fill('')
  124 | }
  125 | 
  126 | /**
  127 |  * Open the row's overflow actions and trigger a specific icon button.
  128 |  * The row's action cell exposes plain buttons with `aria-label`s like
  129 |  * "Clone test case", "Edit test case", "Delete test case".
  130 |  */
  131 | async function clickRowAction(
  132 |     row: Locator,
  133 |     action: 'Clone test case' | 'Edit test case' | 'Delete test case',
  134 | ): Promise<void> {
  135 |     // Hover the row so the actions cell becomes interactive in case CSS
  136 |     // hides it until hover (matches user behaviour).
  137 |     await row.hover()
  138 |     await row.locator(`button[aria-label="${action}"]`).click()
  139 | }
  140 | 
  141 | /**
  142 |  * Create an AI test case and return its session id. On success the SPA
  143 |  * navigates to `/test-analysis/<sessionId>`; we parse the id from the URL so
  144 |  * callers can return to `/test-cases` and clean up.
  145 |  */
  146 | async function uiCreateAITestCase(page: Page, name: string, description?: string): Promise<string> {
  147 |     await gotoTestCases(page)
  148 |     await openNewTestCaseDropdown(page)
  149 |     await page.locator('button[data-tour="ai-test-create"]').click()
  150 | 
  151 |     // The modal renders <div role="dialog">…<div data-tour="create-tc-modal">…</div>…</div>
  152 |     // — `data-tour` is on a CHILD, not on the role=dialog element. Match the
  153 |     // outer dialog by visible heading instead.
  154 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Create Test Case' })
  155 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  156 | 
  157 |     await dialog.locator('#test-case-name').fill(name)
  158 |     if (description) {
  159 |         await dialog.locator('#test-case-description').fill(description)
  160 |     }
  161 | 
  162 |     const [response] = await Promise.all([
  163 |         waitForApi(page, /\/api\/analysis\/sessions\b/, 'POST'),
  164 |         dialog.locator('button[type="submit"]', { hasText: /^Create$/ }).click(),
  165 |     ])
  166 |     if (!response.ok()) {
  167 |         const body = await response.text().catch(() => '')
  168 |         throw new Error(`createSession ${response.status()}: ${body.slice(0, 200)}`)
  169 |     }
  170 | 
  171 |     await page.waitForURL(/\/test-analysis\/[0-9a-f-]{8,}/i, { timeout: 10_000 })
  172 |     const match = page.url().match(/\/test-analysis\/([0-9a-f-]{8,})/i)
  173 |     if (!match) throw new Error(`Could not parse sessionId from ${page.url()}`)
  174 |     return match[1]
  175 | }
  176 | 
  177 | async function uiCreateRecordTestCase(page: Page, name: string): Promise<void> {
  178 |     await gotoTestCases(page)
  179 |     await openNewTestCaseDropdown(page)
  180 |     await page.locator('button', { hasText: 'Record Test Case' }).click()
  181 | 
  182 |     const dialog = page.locator('div[role="dialog"]', { hasText: 'Record Test Case' })
  183 |     await dialog.waitFor({ state: 'visible', timeout: 5_000 })
  184 | 
  185 |     await dialog.locator('#recordTestName').fill(name)
  186 |     await dialog.locator('#recordTestDescription').fill('Created by Playwright TC-069')
  187 |     await dialog.locator('#startUrl').fill('https://xitester.com')
  188 | 
  189 |     await dialog.locator('button[type="submit"]', { hasText: /Start Recording/ }).click()
  190 | 
  191 |     // SPA navigates to /test-analysis with state {mode:'record', startUrl, initialTitle}.
  192 |     await page.waitForURL(/\/test-analysis(\?|$|#|\/)/, { timeout: 10_000 })
```