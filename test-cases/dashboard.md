# Dashboard Test Cases

Manual QA test cases for the `/dashboard` page across its three tabs: **Overview**, **Regression Test Result Charts**, **Test Coverage**. 12 user-driven smoke tests that verify each metric / section renders. Format follows `test-cases/PATTERN.md`.

> **Note on "verify accuracy" tests.** The brief for several rows (TC-044/045/046/047/049/053/etc.) calls for cross-checking the displayed numeric value against backend data. That is impossible from the UI alone without a parallel API call to the SUT. The Playwright tests below verify the metric **renders** with a sensible-looking value (visible, non-empty, regex-matches a number/percentage where appropriate). Full accuracy requires manual cross-check against the SUT's own database / API or a follow-up integration test. The markdown rows preserve the user's accuracy language; the spec rows note the smoke-only scope.

## Source of Truth

- `frontend/src/pages/Dashboard.tsx`
  - Overview metric cards: lines 279-316
  - Test Plan Runs Analysis: 322-367
  - Top Active Test Plans: 373-383
  - Regression tab sections: 441-489
  - Test Coverage tab sections: 492-577

## Environment

- Route: `/dashboard`
- Auth: storageState (`auth.setup`)
- Tab switches click `<button>` with text `Regression Test Result Charts` / `Test Coverage`.

## Common Selectors

| Element                                       | Selector                                                                            |
|-----------------------------------------------|-------------------------------------------------------------------------------------|
| Tab — Regression                              | `button` with text `"Regression Test Result Charts"`                                |
| Tab — Test Coverage                           | `button` with text `"Test Coverage"`                                                |
| Metric card title                             | `getByText("Total Test Plan Runs"\|"Pass Rate"\|"Active Suites"\|"Avg. Duration")`  |
| "Test Plan Runs Analysis"                     | `getByText("Test Plan Runs Analysis")`                                              |
| Test plan picker inside Analysis              | `[aria-label="Select test plan"]`                                                   |
| "Top Active Test Plans"                       | `getByText("Top Active Test Plans")`                                                |
| Regression chart titles                       | `"Regression Pass Rate Trend"` / `"Regression Defects Found"` / `"Suite Breakdown"` |
| Coverage section titles                       | `"Overall System Health"` / `"Module Quality Analysis"` / `"System Hotspots"`       |

## Test Cases

### Overview tab

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-044 — Verify Total Test Plan Runs display | Dashboard – Overview | High | The "Total Test Plan Runs" metric card renders. Spec verifies visibility; manual cross-check verifies the count matches actual runs. | 1. Open `/dashboard`.<br>2. Locate the "Total Test Plan Runs" card.<br>3. Confirm a numeric value is displayed.<br>4. (manual) Cross-check against the test-plan runs list. |
| TC-045 — Verify Pass Rate calculation display | Dashboard – Overview | High | The "Pass Rate" card renders with a value matching `/\d+(\.\d+)?\s*%?/`. | 1. Open `/dashboard` overview tab.<br>2. Locate "Pass Rate".<br>3. Verify a numeric / percent value is shown.<br>4. (manual) Recompute (passed / executed) and compare. |
| TC-046 — Verify Active Suites count is visible | Dashboard – Overview | High | The "Active Suites" card renders. Full dynamic verification (count goes 0 → 1 → 0 around a run) requires also dispatching a real test-plan run, so the spec is smoke-only. | 1. Open `/dashboard` overview tab.<br>2. Locate "Active Suites".<br>3. Verify a numeric value is shown.<br>4. (manual) Trigger a plan run, observe the count tick up then back down. |
| TC-047 — Verify Average Duration display | Dashboard – Overview | High | The "Avg. Duration" card renders. | 1. Open `/dashboard` overview tab.<br>2. Locate "Avg. Duration".<br>3. Confirm a duration value is shown.<br>4. (manual) Cross-check against per-run durations. |
| TC-048 — Verify Test Plan Run Analysis display | Dashboard – Overview | High | Section "Test Plan Runs Analysis" renders along with its plan-picker dropdown. | 1. Open `/dashboard` overview tab.<br>2. Scroll to "Test Plan Runs Analysis".<br>3. Verify the section title and the "Select test plan" dropdown are visible. |
| TC-049 — Verify Top Active Test Plans (bar chart) display | Dashboard – Overview | High | Section "Top Active Test Plans" renders. | 1. Open `/dashboard` overview tab.<br>2. Locate "Top Active Test Plans".<br>3. Verify the section title is visible. |

### Regression tab

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-050 — Verify Regression Pass Rate Trend chart | Dashboard – Regression | High | After switching to the Regression tab, "Regression Pass Rate Trend" renders. | 1. Open `/dashboard`.<br>2. Click the "Regression Test Result Charts" tab.<br>3. Verify "Regression Pass Rate Trend" is visible. |
| TC-051 — Verify Regression Defects Found chart | Dashboard – Regression | High | "Regression Defects Found" chart renders. | 1. Open `/dashboard` → Regression tab.<br>2. Verify "Regression Defects Found" title is visible. |
| TC-052 — Verify Suite Breakdown chart | Dashboard – Regression | High | "Suite Breakdown" chart renders. | 1. Open `/dashboard` → Regression tab.<br>2. Verify a "Suite Breakdown" element is visible. |

### Test Coverage tab

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-053 — Verify Overall System Health display | Dashboard – Test Coverage | High | "Overall System Health" renders on the coverage tab. | 1. Open `/dashboard`.<br>2. Click "Test Coverage" tab.<br>3. Verify "Overall System Health" is visible. |
| TC-054 — Verify Module Quality Analysis display | Dashboard – Test Coverage | High | "Module Quality Analysis" renders. | 1. Open `/dashboard` → Test Coverage tab.<br>2. Verify "Module Quality Analysis" is visible. |
| TC-055 — Verify System Hotspots display | Dashboard – Test Coverage | High | "System Hotspots" renders. | 1. Open `/dashboard` → Test Coverage tab.<br>2. Verify "System Hotspots" is visible. |
