# XiTester Playwright Suite

End-to-end tests that mirror the manual specs in `test-cases/`. Each test name carries its canonical `TC-XX-NNN` ID so failures map back to the manual spec row.

## First-time setup

```bash
cd test-cases/playwright
npm install
npm run install-browsers
```

That installs `@playwright/test` and the Chromium browser (~170 MB).

## Run against local

The local stack must be up first (frontend on `http://localhost:5173`, backend on `http://localhost:8000`):

```bash
# In a separate terminal, from the repo root:
./scripts/dev.sh

# Then, from test-cases/playwright:
npm run test:local            # headless
npm run test:headed           # see the browser
npm run test:ui               # Playwright UI mode (timeline, watch)
npm run test:login            # only the login spec
```

Local credentials are wired in `env/local.ts`:
- `admin@xitester.com` / `SmartTest123!`

## Run against another environment

```bash
npm run test:dev      # https://app-dev.ai.xitester.com
npm run test:stage    # https://app-stage.ai.xitester.com
npm run test:prod     # https://app.ai.xitester.com
```

Or set the env var directly:

```bash
XT_ENV=dev npx playwright test
XT_ENV=local XT_USER_EMAIL=other@example.com XT_USER_PASSWORD=Foo1! npx playwright test
```

For `stage` and `prod`, credentials come from `XT_USER_EMAIL` / `XT_USER_PASSWORD` env vars (no defaults shipped in the repo).

## Environment switch

`env/index.ts` reads `XT_ENV` (default `local`) and loads the matching config from `env/<name>.ts`. Each config exports:

| Field                | Used for                                                                  |
|----------------------|---------------------------------------------------------------------------|
| `baseURL`            | Playwright `use.baseURL` — resolves all `page.goto('/login')`-style calls. |
| `apiBase`            | Documentation only; route mocks use globs against `/api/v1/...`.          |
| `user`               | Default sign-in account (TC-LI-006 happy path, etc.).                     |
| `multiOrgUser`       | TC-LI-007. Skip when `null`.                                              |
| `mfaUser`            | TC-LI-033, TC-LI-037. Skip when `null`.                                   |
| `existingEmail`      | Account-enumeration cases. Skip when `null`.                              |
| `allowedRedirectUrl` | TC-LI-009 guest-flow allowed redirect. Skip when `null`.                  |

## Rate-limit awareness

The local backend caps login to **10 attempts per 5 minutes per IP** (`LOGIN_RATE_LIMIT_MAX_ATTEMPTS=10`, `LOGIN_RATE_LIMIT_WINDOW_SECONDS=300`). The suite is designed to fit comfortably under that:

- TC-LI-006 / 008 / 010 are the only real UI logins (3 attempts), wrapped in `test.describe.configure({ mode: 'serial' })` so they don't burst.
- TC-LI-011 / 054 / 055 share **one** API login per worker (cached token, replayed via `addInitScript`).
- TC-LI-014 / 015 / 016 / 017 / 019 mock the login endpoint — zero real attempts.

If you do hit a 429 (e.g., from running the suite back-to-back without waiting):

```bash
# Poll until the window clears, then re-run:
until [ "$(curl -s -o /dev/null -w "%{http_code}" -X POST $XT_API/api/v1/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"admin@xitester.com","password":"…"}')" = "200" ]; do
  echo "$(date +%T) still 429"; sleep 30
done
```

Run with `--workers=1` to halve attempts (one worker, no per-worker probes).

## Tests that auto-skip without infrastructure

Some manual scenarios depend on test data that the repo can't ship:

- TC-LI-007 — multi-org user
- TC-LI-009 — allowed `redirect_url` (depends on backend allowlist)
- TC-LI-033, TC-LI-037 — real MFA user with TOTP secret

These call `test.skip(condition, reason)` so they show as `skipped` in the report until you populate the matching field in your env config. They do **not** count as failures.

## Mocked tests

Cases that need specific HTTP responses (`422`, `429`, `500`, MFA flow without a real account) intercept calls via `page.route()` and fulfill mocked responses. They run against any environment without backend changes:

- TC-LI-016, TC-LI-017, TC-LI-019 — login error responses.
- TC-LI-031, TC-LI-032, TC-LI-034, TC-LI-035, TC-LI-036, TC-LI-038 — MFA flow.
- TC-LI-039 to TC-LI-046 — OAuth providers + Google start.
- TC-LI-051, TC-LI-052, TC-LI-053 — reset-password endpoint.

## Reports

```bash
npm run report         # opens last HTML report
```

Failing runs save trace, screenshot, and video under `test-results/` (gitignored). Pass `--trace=on` for an always-on trace.

## File map

```
test-cases/playwright/
├── package.json
├── playwright.config.ts        # baseURL from ENV, two projects: chromium + mobile-chromium
├── tsconfig.json
├── env/
│   ├── index.ts                # XT_ENV selector
│   ├── local.ts                # http://localhost:5173 + admin@xitester.com / SmartTest123!
│   ├── dev.ts
│   ├── stage.ts                # creds from XT_USER_EMAIL / XT_USER_PASSWORD
│   └── prod.ts                 # creds from XT_USER_EMAIL / XT_USER_PASSWORD
└── tests/
    └── login.spec.ts           # TC-LI-001 … TC-LI-057
```

## Adding a new module

1. Author the manual spec at `test-cases/<module>.md` following `test-cases/PATTERN.md`.
2. Add `tests/<module>.spec.ts` with one `test()` per row, named `TC-<MOD>-<NNN> — <title>`.
3. If the module needs new env fields (e.g. a billing-plan account), add them to `EnvConfig` in `env/index.ts` and to each `env/<name>.ts`.
