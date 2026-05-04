# Test-Case Pattern Guide

This file defines the canonical structure for QA test-case Markdown files in `test-cases/`. **Read this once and write every new module's spec the same way.** AI assistants generating new files MUST follow this guide verbatim — the build pipeline (`build-pdf.sh` + `styles/test-case.css`) assumes this exact shape.

Reference exemplar: **`test-cases/signup.md`**.

---

## Naming

- File path: `test-cases/<module>.md` — lowercase-kebab (e.g., `forgot-password.md`, `api-tester-collections.md`).
- One file per UI surface or self-contained feature. Adjacent flows are referenced as smoke-only smoke rows (don't bloat one file with another module's full coverage).
- Matching PDF generated to `test-cases/build/<module>.pdf` by `bash test-cases/build-pdf.sh`.

## Required Sections (in order)

Every test-case file MUST contain these sections, in this order:

1. **`# <Module> Test Cases`** — single H1, one line.
2. **Intro paragraph** — 1–3 sentences: what's covered + the standard column format reference.
3. **`## Source of Truth`** — bulleted list of every code path the spec is derived from. Use backtick-quoted file paths.
4. **`## Environment`** — base URL, test credentials, API endpoints invoked, viewport sizes (desktop + mobile spot-check).
5. **`## Global Rules`** — numbered list. Always include: fresh session per case, storage clear, evidence capture on failure, severity ladder, toast container selector.
6. **`## Common Selectors`** — two-column Markdown table (`Element | Selector`).
7. **Lettered groups**: `## A. <Group>`, `## B. <Group>`, … alphabetically. Suggested groups: Validation (Client), Validation (Server), Happy Path, Error States, OAuth, Guest Flow, Auth Redirect, A11y & UI.
8. **One test-case table per lettered group** — see Test Case Format below. This is the **primary content** of the file.
9. **`## Conversion Notes`** — closing section listing Playwright selectors, network-mock targets, and fixture suggestions for later automation.

## Test Case Format

Inside each lettered group, render every test case as **one row** of a Markdown table with **exactly these five columns**:

```
| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-XX-NNN — <short title> | <Module> / <Sub-area> | P0 / P1 / P2 | <what is being verified, including expected outcome> | 1. <action><br>2. <action><br>3. <action> |
```

### Column meanings

| Column | What goes here |
|--------|----------------|
| **Test case name** | `TC-<MOD>-<NNN> — <short title>`. `<MOD>` is a 2–4 letter module abbreviation (e.g., `SU` for Signup, `LI` for Login, `FP` for Forgot Password). `<NNN>` is a zero-padded sequence number unique within the file, running sequentially across all groups (don't restart at each group). Title ≤ 70 chars, action-oriented. |
| **Plugin** | The functional area / sub-module being exercised. Use the form `<Module> / <Sub-area>` (e.g., `Signup / Validation (Client)`, `Signup / OAuth`, `API Tester / Chain Executor`). The Plugin column lets cases be filtered/grouped in test-management tools. |
| **Priority** | One of `P0`, `P1`, `P2`. **P0** = critical path, security defense, data-loss risk, ship-blocker. **P1** = major user flow, normal error handling, common a11y. **P2** = edge case, cosmetic, minor a11y, regression guard. |
| **Description** | One or two sentences describing **what is verified** AND the **expected outcome**. Quote toast and button text exactly as it appears in source code. Cite source-file line numbers for non-obvious behavior (e.g., `Signup.tsx:121-124`) so the spec stays falsifiable. **Expected outcome lives here** — not in a separate column. |
| **Steps** | Numbered user actions, joined by `<br>`. Format: `1. <action><br>2. <action><br>3. <action>`. Steps are pure user actions — do NOT include "verify X" inside steps; assertions belong in Description. Keep each step a single sentence. |

### Worked example (verbatim from `signup.md`)

```
| TC-SU-006 — Mismatched passwords | Signup / Validation (Client) | P0 | Sonner error toast `"Passwords do not match"` (Signup.tsx:121-124). No API call. URL stays `/signup`. Submit button re-enables. Field values preserved. | 1. Open `/signup`.<br>2. Fill Name and a unique valid Email.<br>3. Type `Xitester123!` into Password.<br>4. Type `Xitester456!` into Confirm Password.<br>5. Click "Create account". |
```

## Style Rules

- **One test case = one observable behavior.** Don't bundle "valid email + valid password + redirects".
- **Description must be observable** from the UI, browser DevTools, or Network panel. No internal state assertions unless DevTools-inspectable.
- **Quote UI text exactly** as it appears in the component source. If you change the source, update the spec.
- **Cite source-file line numbers** for non-obvious behavior. Spec must be falsifiable.
- **Don't invent assertions.** If you can't see it, don't claim it. If unclear, write `Description: <document the actual observed behavior>`.
- **Test case IDs** are sequential and never reused. Deleting a test case retires the ID; new cases get the next free number.
- **Steps are pure actions.** No "verify" or "expect" inside Steps — those go in Description.
- **Keep Steps in one cell** using `<br>` separators. Markdown tables don't render multi-line cells, but `<br>` works for both HTML preview and PDF.

## Severity Ladder (failure recording)

When recording the result of a failed test case, use exactly these labels:

| Label    | Definition                                                                            |
|----------|---------------------------------------------------------------------------------------|
| Blocker  | Feature is unusable. No workaround. Ship-stopper.                                     |
| High     | Major behavior broken or incorrect. Awkward workaround exists.                        |
| Medium   | Visible defect or minor data issue. App is usable.                                    |
| Low      | Cosmetic, accessibility nit, copy edit, or developer ergonomics.                      |

(Severity is for *bug reports*. The Priority column on each test case is for *test execution order*; the two are independent.)

## Coverage Checklist (minimum bar per module)

Every test-case file should cover at least:

- [ ] Render — all interactive elements present and labeled.
- [ ] Field validation (client) — empty, malformed, boundary (min/max length).
- [ ] Field validation (server) — every backend rule the user can trigger.
- [ ] Happy path — success toast/redirect, side effects (email, DB row, session cookie).
- [ ] Error toasts — 4xx, 429, 5xx, network offline.
- [ ] Loading states — disabled fields/buttons, spinner.
- [ ] Auth/permission edge cases — already-authenticated, unauthorized, expired.
- [ ] OAuth/SSO if applicable — provider list, success redirect, failure toast, regression guards.
- [ ] Accessibility — labels, keyboard tab order, aria-labels, screen-reader announce.
- [ ] Console-clean load — zero `console.error`, no asset 404s, no CSP warnings.
- [ ] Mobile viewport (375x812) — usable, no overflow, hit targets ≥ 44px.

## Skeleton Template

Copy this into a new `test-cases/<module>.md` and fill in:

```markdown
# <Module> Test Cases

Manual QA test cases for the XiTester <module> page (`<route>`). Each test case follows the canonical column format defined in `test-cases/PATTERN.md`: **Test case name | Plugin | Priority | Description | Steps**.

## Source of Truth

- `<frontend file path>`
- `<backend file path>`
- `<auth/util file path>`

## Environment

- URL: `https://app-dev.ai.xitester.com<route>`
- Login: `<test account>`
- Password: `<test password>`
- API endpoint: `<METHOD>` `{API_BASE}<path>`
- Viewport: `1920x1080` (desktop), `375x812` (mobile spot checks)

## Global Rules

1. Each test case uses a fresh, unique browser session.
2. Clear `localStorage` and `sessionStorage` before each unless preconditions explicitly state otherwise.
3. Capture evidence on failure: screenshot, console errors, failing network request, repro steps.
4. Record pass/fail, expected vs. actual, severity (Blocker / High / Medium / Low).
5. Toast assertions target `body > [data-sonner-toaster]`.

## Common Selectors

| Element       | Selector |
|---------------|----------|
| <field>       | `#id`    |
| <button>      | `button[type="submit"]` |

---

## A. <Group name>

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-XX-001 — <title> | <Module> / <sub-area> | P0 | <what is verified + expected outcome> | 1. <action><br>2. <action><br>3. <action> |
| TC-XX-002 — <title> | <Module> / <sub-area> | P1 | <what is verified + expected outcome> | 1. <action><br>2. <action> |

## B. <Group name>

| Test case name | Plugin | Priority | Description | Steps |
|----------------|--------|----------|-------------|-------|
| TC-XX-003 — <title> | <Module> / <sub-area> | P0 | <what is verified + expected outcome> | 1. <action><br>2. <action> |

---

## Conversion Notes

- Stable selectors: ...
- Network mocking: `page.route('**/api/v1/<endpoint>', ...)` for cases ...
- Fixtures: ...
```

## AI Generation Prompt (copy-paste)

When asking an AI to generate test cases for a new module, paste this prompt verbatim and fill in the bracketed values:

```
You are writing manual QA test cases for the XiTester project.

Component / surface under test: [path/to/Component.tsx]
Module abbreviation for test-case IDs: [SU | LI | FP | …]
Source of truth files (read-only):
- [frontend path]
- [backend router/service path]
- [related util path]

Follow `test-cases/PATTERN.md` strictly:
- Required section order: Source of Truth, Environment, Global Rules, Common Selectors, lettered groups A/B/..., Conversion Notes.
- Each lettered group contains ONE Markdown table with EXACTLY five columns: Test case name | Plugin | Priority | Description | Steps.
- Test case IDs are `TC-<MOD>-<NNN>`, sequential across the whole file.
- Plugin format: `<Module> / <Sub-area>` (e.g., `Signup / Validation (Client)`).
- Priority is P0 / P1 / P2.
- Description holds the expected outcome AND the verification cues. Quote toast and button text exactly. Cite source-file line numbers for non-obvious behavior.
- Steps are pure user actions joined by `<br>` — NO "verify"/"expect" inside Steps.
- Cover the minimum checklist in PATTERN.md (render, field validation client + server, happy path, error toasts, loading states, auth edge cases, OAuth if applicable, a11y, console-clean, mobile).
- Do not invent behavior. If unclear, write `Description: <document the actual observed behavior>` and continue.

Output: a single Markdown file at `test-cases/[module].md`, ready to drop in. No prose around it.
```
