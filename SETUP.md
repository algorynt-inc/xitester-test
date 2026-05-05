# Setup Guide

After cloning `algorynt-inc/xitester-test`, run through this once. ~5 minutes for the install steps; everything after that is `pnpm test` / `pnpm dev` style.

---

## TL;DR — just want to run tests against dev/stage/qa/prod via Playwright UI

You **don't need** to run the SUT locally, and you **don't need** the dashboard. The tests hit the deployed environments directly. From a fresh clone:

```bash
cd xitester-test/playwright

pnpm install
pnpm exec playwright install chromium      # one-time, ~150 MB

# Set credentials. Pick ONE of the two options below.
# Option A — .env.local file (set once, never type creds again):
cp .env.local.example .env.local
# Edit .env.local and fill in XT_USER_EMAIL + XT_USER_PASSWORD.

# Option B — shell exports (lasts only for the current terminal):
export XT_USER_EMAIL='your-sandbox-account@xitester.com'
export XT_USER_PASSWORD='your-password'

# Run Playwright UI against dev:
XT_ENV=dev pnpm exec playwright test --ui
```

**Where to run those `export` commands?** In the same terminal window where you'll run `pnpm exec playwright test`. They only last until you close that terminal — every new terminal needs them set again. That's why Option A (`.env.local`) is usually nicer: set once, every future run picks them up automatically. The file is gitignored, so it never reaches the repo.

Playwright's UI mode opens a window. From there you can:
- Click ▶ on any test or whole suite
- See the live browser, action timeline, network requests, console
- Use the **time-travel slider** to scrub back through any step
- Filter by test ID, file, or status

To switch envs: close the UI, change `XT_ENV`, re-run the command:

```bash
XT_ENV=stage pnpm exec playwright test --ui
XT_ENV=qa    pnpm exec playwright test --ui
XT_ENV=prod  pnpm exec playwright test --ui
```

**You don't need** a GitHub PAT, the dashboard, or any of the GitHub Actions plumbing — that's only for the team-shared CI runs. UI mode runs everything on your laptop.

> ⚠️ `XT_ENV=local` requires the xitester-ai-app SUT to be running on localhost. Skip it if you don't have the SUT cloned.

---

## 0. Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org or `brew install node@20` |
| pnpm | 9+ | `npm install -g pnpm` (or `brew install pnpm`) |
| git | any | already on macOS / Linux |

Optional but recommended: **GitHub CLI** (`brew install gh`) for triggering CI runs from the terminal.

## 1. Clone (you've already done this)

```bash
git clone git@github.com:algorynt-inc/xitester-test.git
# or:
git clone https://github.com/algorynt-inc/xitester-test.git

cd xitester-test
```

The repo has **three independent pnpm projects**: `playwright/`, `web/`, and `test-cases/`. Install per project — they don't share `node_modules`.

## 2. Install dependencies

### Playwright suite
```bash
cd playwright
pnpm install
pnpm exec playwright install chromium    # one-time; ~150 MB
cd ..
```

### Dashboard (web)
```bash
cd web
pnpm install
cp .env.example .env.local       # then edit if you want to override defaults
cd ..
```

The defaults in `.env.example` (`VITE_REPO_OWNER=algorynt-inc`, `VITE_REPO_NAME=xitester-test`, `VITE_REQUIRED_ORG=algorynt-inc`) work out of the box for development.

`test-cases/` has no install step — it's pure markdown.

## 3. Set test credentials (for tests that hit the SUT)

Tests that need to log in read `XT_USER_EMAIL` / `XT_USER_PASSWORD` from your shell.

**Local development** — use whichever feels less annoying:

| Approach | When |
|---|---|
| `.env.local` file (recommended) | Set creds once, every shell picks them up |
| Shell `export` | One-off run, throwaway shell |

For `.env.local`:
```bash
cd playwright
cp .env.local.example .env.local
# Edit .env.local: fill in XT_USER_EMAIL, XT_USER_PASSWORD, optionally XT_ENV.
```
Variables defined in shell `export` always win over `.env.local` (override: false), so CI's GitHub-Environment secrets are never trampled.

For shell exports (run in the same terminal as the test command):
```bash
export XT_USER_EMAIL='your-sandbox-account@xitester.com'
export XT_USER_PASSWORD='your-password'
export XT_ENV=dev    # one of: local / dev / stage / qa / prod
```

If you skip both, tests that need auth **skip cleanly** (they don't fail). Only the 4 unauthed login tests run.

**Don't commit credentials.** The repo's `.gitignore` already excludes `.env*` and `playwright/.auth/`.

**CI runs** use **GitHub Environments** (NOT these env vars):
- Repo → Settings → Environments → `dev` / `stage` / `qa` / `prod`
- Each env has its own `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` secrets
- The `e2e.yml` workflow auto-scopes secrets when you pick an environment from the dashboard's Trigger page

## 4. Run tests locally

From `playwright/`:

```bash
# Whole suite
pnpm exec playwright test

# Specific spec file
pnpm exec playwright test tests/login.spec.ts

# A single test by ID (works for any TC-XX-NNN)
pnpm exec playwright test --grep TC-LI-001

# Interactive UI mode (best for debugging)
pnpm exec playwright test --ui

# Headed (see the actual browser)
pnpm exec playwright test --headed

# Show the most recent HTML report
pnpm exec playwright show-report
```

`XT_ENV` controls which environment the test runs against — it picks up `playwright/env/<env>.ts`.

### Per-suite shortcuts (defined in playwright/package.json)
```bash
pnpm test:dev          # XT_ENV=dev playwright test
pnpm test:stage        # XT_ENV=stage playwright test
pnpm test:qa           # XT_ENV=qa playwright test
pnpm test:prod         # XT_ENV=prod playwright test
pnpm test:login        # only login.spec.ts
```

## 5. Run the dashboard locally

From `web/`:

```bash
pnpm dev
```

Opens at **http://localhost:5174/xitester-test/**.

To log in, you need a **GitHub Personal Access Token (PAT)**:
1. Go to https://github.com/settings/tokens → **Generate new token (classic)**
2. Scopes: `repo`, `workflow`, `read:org` (all three required)
3. **If `algorynt-inc` enforces SAML SSO**, click **"Configure SSO"** on the new token and authorize for the org. Without this the org-membership check will fail.
4. Copy the token (you only see it once)
5. In the dashboard, click **"Use Personal Access Token"** and paste

The token is stored in `localStorage` for the duration of the browser tab. Sign out clears it.

## 6. Add a new test (in 3 steps)

### Step 1 — Write the markdown spec
Create `test-cases/<module>.md` following the format in `test-cases/PATTERN.md`. ID format is `TC-<MOD>-NNN` where `<MOD>` is a 2–4 letter module code:

| Module | Code |
|---|---|
| Login | `LI` |
| Organisations | `ORG` |
| Projects | `PR` |
| Logout | `LO` |
| Profile | `PF` |

### Step 2 — Implement in Playwright
Create `playwright/tests/<module>.spec.ts`. Conventions used across this repo:

- Tests that need an authenticated session start with:
  ```ts
  test.use({ storageState: '.auth/user.json' })
  ```
- Tests that mutate the same user account run serially:
  ```ts
  test.describe.configure({ mode: 'serial' })
  ```
- Skip cleanly when credentials aren't set:
  ```ts
  test.skip(!ENV.user.email || !ENV.user.password, SKIP_NO_CREDS)
  ```
- Mutating tests should also clean up (delete what they created, revert what they renamed).

### Step 3 — Push to main
The Pages workflow auto-runs `playwright test --list` on every push and regenerates `web/public/test-catalog.json`. Within ~60 s of the deploy:
- The new suite shows up in the dashboard's **Suites** page (with a "never run" pill until first run)
- The Trigger page's suite dropdown lists it
- The Suite × Env grid on Overview gets a new row

## 7. Trigger a CI run

Three ways, all driven by the **same** `e2e.yml` workflow:

### A) Dashboard (most user-friendly)
1. Open https://algorynt-inc.github.io/xitester-test/
2. Sign in with your PAT
3. **Trigger** → pick env / suite / browser → **Dispatch**
4. The InFlight page polls the run; lands on RunDetail when complete

### B) GitHub UI
- https://github.com/algorynt-inc/xitester-test/actions/workflows/e2e.yml → **Run workflow**

### C) GitHub CLI
```bash
gh workflow run e2e.yml -f environment=dev -f suite=all -f browser=chromium
gh run watch
```

## 8. View results

| Where | What you see |
|---|---|
| **Dashboard Overview** | KPI cards, env × suite grid, latest runs, failure feed |
| **Dashboard Runs** | All runs with env / suite / date filters |
| **Dashboard Run detail** | Failures + per-test traces / videos, "Open suite trace · N .zip" |
| **Trace Viewer** | Click ▶ Trace on any test row → opens https://trace.playwright.dev with that test's trace.zip |
| **Raw JSON** | `https://github.com/algorynt-inc/xitester-test/tree/results/runs` — raw JSONs + attachments |

## 9. Common operations

### Update dependencies after pulling main
```bash
git pull
cd playwright && pnpm install
cd ../web && pnpm install
```

### Generate the test catalog locally
```bash
cd playwright
pnpm exec playwright test --list --reporter=json > ../web/public/test-catalog.json
```
The Pages workflow does this on every deploy automatically; only run it locally if you're testing dashboard changes against an updated catalog.

### Run only what changed (faster local feedback)
```bash
cd playwright
pnpm exec playwright test --only-changed
```

### Re-run a failed test from CI on your laptop
1. Find the test ID on the dashboard's RunDetail (e.g. `TC-ORG-005`)
2. ```bash
   XT_ENV=dev pnpm exec playwright test --grep TC-ORG-005 --headed
   ```

## 10. Troubleshooting

### `Workflow dispatched but did not appear within 90s`
GitHub queueing lag. Check **Actions** tab — the run usually arrives. Re-dispatch if it doesn't after ~3 minutes.

### `Account is not a public member of "algorynt-inc"` on dashboard login
Your PAT is missing `read:org`, or `algorynt-inc` enforces SAML SSO and the token isn't authorised for the org. Regenerate the PAT with `read:org` and click "Configure SSO" → Authorize.

### Tests skip with `SKIP_NO_CREDS`
You haven't exported `XT_USER_EMAIL` / `XT_USER_PASSWORD`. Set them and re-run.

### Org create / update / delete tests skip with `Plan-tier restriction`
Your test account is free tier and the SUT disables the New organization button. Either upgrade the test account or accept that those tests skip on this env.

### `TC-PF-006 (Update password) doesn't run`
By design — it's destructive. Run with `XT_RUN_DESTRUCTIVE=1`:
```bash
XT_ENV=dev XT_RUN_DESTRUCTIVE=1 pnpm exec playwright test --grep TC-PF-006
```
If the revert step fails the test prints the temp password so you can rotate the secret manually.

### `Locator hidden` errors on logout / topbar tests
Some SUT components render twice for desktop / mobile breakpoints. If your locator picks up the hidden copy, add `:visible`:
```ts
page.locator('header button[aria-haspopup="menu"]:visible').last()
```

### Local tests pass but CI fails
- Viewport difference: CI uses 1920×1080. Local default may be smaller. Check `playwright.config.ts` `projects` for the size used.
- Network: the SUT may be flaky from your local network but stable from GitHub runners (or vice versa).
- Auth: local uses `XT_USER_EMAIL` from your shell; CI uses GitHub Environment secrets. They may differ.

### `playwright/.auth/user.json` got committed
It's now in `.gitignore`. If yours was committed before that fix, run:
```bash
git rm -r --cached playwright/.auth playwright/playwright/.auth 2>/dev/null
git commit -m "untrack auth artifact"
git push
```

## 11. Repo layout

```
xitester-test/
├── .github/workflows/
│   ├── e2e.yml                  # workflow_dispatch — runs Playwright, commits results
│   └── pages.yml                # builds web/, deploys to GH Pages
├── playwright/
│   ├── env/                     # local.ts / dev.ts / stage.ts / qa.ts / prod.ts
│   ├── tests/                   # *.spec.ts — auto-discovered by Playwright
│   ├── reporter/                # custom JSON reporter (results branch format)
│   ├── playwright.config.ts
│   └── package.json
├── test-cases/                  # human-readable markdown specs (PATTERN.md is the format guide)
├── web/                         # Vite + React + Tremor dashboard
│   ├── src/pages/               # Login, Overview, Suites, SuiteDetail, Runs, RunDetail, Trigger, InFlight, TestHistory
│   ├── src/components/widgets/  # KpiHero, EnvStatusGrid, TrendChart, RunsList, FailureFeed, AttachmentGallery, etc.
│   ├── src/lib/                 # github-client, results-loader, catalog-loader, auth/
│   ├── public/test-catalog.json # regenerated each Pages deploy by `playwright test --list`
│   └── package.json
├── README.md                    # product / architecture overview
└── SETUP.md                     # this file
```

## 12. Where to get help

- **Bugs / feature requests** — open an issue at https://github.com/algorynt-inc/xitester-test/issues
- **Playwright docs** — https://playwright.dev/docs/intro
- **Tremor (dashboard UI)** — https://tremor.so/docs
- **shadcn/ui (dashboard primitives)** — https://ui.shadcn.com/docs

Welcome to the project. ✓
