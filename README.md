# xitester-test

Public test suite + dashboard for XiTester.

This repo houses three things:

- **`test-cases/`** — manual QA test cases in markdown, formatted per `test-cases/PATTERN.md`. The build pipeline (`build-pdf.sh`) renders them to PDFs.
- **`playwright/`** — Playwright e2e suite that automates those test cases. Multi-environment (`local` / `dev` / `stage` / `qa` / `prod`) selected via `XT_ENV`.
- **`web/`** — Static SPA dashboard hosted on **GitHub Pages** at `https://algorynt-inc.github.io/xitester-test/`. Triggers Playwright runs via `workflow_dispatch`, reads JSON results from the `results` branch, lets the team browse history.

## Architecture

```
┌────────────────────────────────────────────────────┐
│  GitHub Pages (web/)                               │
│  React SPA — Tremor + Tailwind                     │
│                                                    │
│  • GitHub OAuth (Device Flow) or PAT login         │
│  • Env selector drives both filtering & dispatch   │
│  • Trigger workflow_dispatch via GitHub API        │
│  • Read results from raw.githubusercontent.com     │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│  GitHub repo — algorynt-inc/xitester-test              │
│                                                    │
│  main branch:        web/  playwright/  test-cases/│
│  results branch:     runs/<runId>.json + index.json│
│                                                    │
│  Workflows:                                        │
│    .github/workflows/e2e.yml    — Playwright       │
│    .github/workflows/pages.yml  — Pages deploy     │
└────────────────────────────────────────────────────┘
```

No backend. No database. Git history = permanent results store.

## Local development

### Run the Playwright suite

```bash
cd playwright
pnpm install
pnpm exec playwright install chromium

# Choose an environment (sets baseURL + reads creds from env vars)
export XT_USER_EMAIL=your-test-account
export XT_USER_PASSWORD=your-test-password
pnpm test:dev          # or test:stage / test:qa / test:prod / test:local

pnpm report            # open the HTML report
```

### Run the dashboard

```bash
cd web
cp .env.example .env.local       # then fill values
pnpm install
pnpm dev                         # http://localhost:5174/xitester-test/
```

To get a real run on screen, dispatch the workflow first via the GitHub UI (Actions → E2E → Run workflow) or the dashboard's `/trigger` page.

## Manual GitHub setup (one-time)

These steps cannot be done from code — perform them once after the repo is created.

### 1. Pages
- **Settings → Pages → Source:** GitHub Actions.
- After the first push to `main`, the `pages.yml` workflow will publish `https://algorynt-inc.github.io/xitester-test/`.

### 2. Workflow permissions
- **Settings → Actions → General → Workflow permissions:** Read and write (so `e2e.yml` can push to the `results` branch).

### 3. GitHub Environments + Secrets
For each environment you want to test (`dev`, `stage`, `qa`, `prod`):
- **Settings → Environments → New environment** → name it (e.g. `dev`).
- Add **Environment secrets**:
  - `TEST_USER_EMAIL`
  - `TEST_USER_PASSWORD`
  - `TEST_TOTP_SECRET` (optional, for MFA tests)
- Optionally protect `prod` with a required reviewer so dashboard-triggered prod runs need approval.

The dashboard's environment selector picks which environment the workflow dispatches to, and GitHub auto-scopes the matching secret bundle.

### 4. GitHub OAuth App (for Device-Flow login)
Optional — without it the dashboard only offers PAT-paste login.

- **algorynt-inc org → Settings → Developer settings → OAuth Apps → New OAuth App**
  - Application name: `xitester-test-dashboard`
  - Homepage URL: `https://algorynt-inc.github.io/xitester-test/`
  - Authorization callback URL: `https://algorynt-inc.github.io/xitester-test/` (unused by device flow but required)
  - Enable Device Flow.
- Copy the **Client ID** into the Pages build environment as `VITE_GITHUB_CLIENT_ID` (set this as a repo secret and reference in `pages.yml`, or hardcode in `web/.env.production`).

> ⚠️ GitHub Device Flow endpoints have historically lacked CORS for browsers. If the SPA's "Sign in with GitHub" button errors out, fall back to the **PAT** option — same UX from there. Required PAT scopes: `actions:write`, `contents:read`, `metadata:read` on this repo, plus `read:org` to verify org membership.

### 5. results branch
The `e2e.yml` workflow creates the `results` branch on its first run if it doesn't exist. No manual setup needed.

## Test-case workflow

1. Add or edit a markdown spec under `test-cases/<module>.md` following `test-cases/PATTERN.md`.
2. Mirror it as a Playwright spec in `playwright/tests/<module>.spec.ts` — use the same `TC-XX-NNN` IDs as test titles so the dashboard can correlate them.
3. Push to `main`. Trigger a run from the dashboard (`/trigger`) or via the GitHub Actions UI.
4. Open the dashboard, pick an environment, click into the latest run, drill down into failures.

## Public-repo hygiene

This repo is public. **Never commit credentials.** All test users live in per-environment GitHub Secrets, injected at runtime. Markdown specs reference `${TEST_USER_EMAIL}` / `${TEST_USER_PASSWORD}` placeholders only.

Captured screenshots, videos, and traces from failing tests are uploaded as workflow artifacts (90-day retention by default) — anyone can read them. Never type secrets into the SUT in a way that ends up on screen.

## Repo layout

```
xitester-test/
├── .github/workflows/
│   ├── e2e.yml                # workflow_dispatch — Playwright runs
│   └── pages.yml              # GH Pages deploy
├── playwright/
│   ├── env/                   # local | dev | stage | qa | prod (selected via XT_ENV)
│   ├── reporter/              # custom JSON reporter
│   ├── tests/
│   ├── playwright.config.ts
│   └── package.json
├── test-cases/                # markdown specs + PATTERN.md + build-pdf.sh
├── web/                       # Vite + React + Tremor dashboard
│   ├── src/
│   │   ├── pages/             # Login, Overview, Runs, RunDetail, Trigger, InFlight, TestHistory
│   │   ├── components/        # Layout, EnvSelector, RequireAuth, widgets/
│   │   ├── lib/               # github-client, results-loader, auth/
│   │   └── App.tsx
│   ├── vite.config.ts         # base: '/xitester-test/'
│   └── package.json
└── README.md
```

## Phased delivery

| Phase | What works |
|---|---|
| **v0** ✅ | Repo bootstrapped, content migrated, `e2e.yml` runs Playwright on dispatch, JSON lands on `results` branch, Pages workflow ready |
| **v1** ✅ | Dashboard SPA: login (Device Flow + PAT), Overview, Runs list, Run detail, Test history |
| **v1.1** ✅ | `/trigger` form + `/in-flight/:runId` polling, env-aware credential routing |
| **v1.2** | _Pending_ — `react-grid-layout` widget rearrangement, save layouts to localStorage, share-via-URL presets |
