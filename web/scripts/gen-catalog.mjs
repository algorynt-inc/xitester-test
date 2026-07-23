/**
 * Generate web/public/test-catalog.json for local dev.
 *
 * Mirrors the "Generate static test catalog" step in
 * .github/workflows/pages.yml: `playwright test --list --reporter=json`
 * enumerates every test without launching a browser. In CI this runs before
 * the Pages build; locally it runs as the `predev` hook so `npm run dev`
 * shows the same suite surface as the deployed dashboard.
 *
 * Never fails dev startup — on any error it writes an empty catalog, which
 * the app treats as "catalog unavailable" (suites then come from run history).
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const webDir = dirname(dirname(fileURLToPath(import.meta.url)))
const playwrightDir = join(webDir, '..', 'playwright')
const outFile = join(webDir, 'public', 'test-catalog.json')

// Prefer the locally installed binary; fall back to pnpm/npx (CI parity).
const localBin = join(playwrightDir, 'node_modules', '.bin', process.platform === 'win32' ? 'playwright.cmd' : 'playwright')
const candidates = [
    [localBin, []],
    ['pnpm', ['exec', 'playwright']],
    ['npx', ['playwright']],
]

let catalog = null
let lastErr = ''
for (const [cmd, prefix] of candidates) {
    const res = spawnSync(cmd, [...prefix, 'test', '--list', '--reporter=json'], {
        cwd: playwrightDir,
        env: { ...process.env, XT_ENV: 'local' },
        encoding: 'utf8',
        shell: true, // resolves .cmd shims on Windows
        maxBuffer: 64 * 1024 * 1024,
    })
    if (res.status === 0 && res.stdout) {
        try {
            catalog = JSON.parse(res.stdout)
            break
        } catch {
            /* try next candidate */
        }
    }
    lastErr = res.stderr || String(res.error ?? '')
}

mkdirSync(dirname(outFile), { recursive: true })
if (catalog) {
    writeFileSync(outFile, JSON.stringify(catalog))
    const suites = Array.isArray(catalog.suites) ? catalog.suites.length : 0
    console.log(`[gen-catalog] wrote ${outFile} (${suites} top-level suites)`)
} else {
    writeFileSync(outFile, '{"suites":[]}')
    console.warn('[gen-catalog] playwright --list failed; wrote empty catalog')
    if (lastErr) console.warn(lastErr.slice(0, 2000))
}
