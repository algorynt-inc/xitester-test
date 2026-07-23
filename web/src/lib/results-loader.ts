import { rawResultsUrl } from './config'
import type { IndexFile, ResultAttachment, ResultRun, ResultTest, RunStats, RunSummary } from '@/types'

/**
 * Resolve an attachment's URL field to a fully-qualified raw.githubusercontent.com URL.
 * Returns null if the attachment has no public URL (e.g., legacy local-only path).
 */
export function attachmentUrl(att: ResultAttachment): string | null {
    if (!att.url) return null
    return rawResultsUrl(`runs/${att.url}`)
}

/**
 * Specs hidden from the dashboard UI. They still run in CI and are recorded in
 * run.json / the catalog for traceability — we just don't render them. Matches
 * infrastructure setup specs and test-analysis (long-running LLM plan/exec).
 */
const HIDDEN_SPEC_RE = /(\.setup|test-analysis\.spec)\.[tj]sx?$/
export function isHiddenSpec(file: string): boolean {
    return HIDDEN_SPEC_RE.test(file)
}

/**
 * Suite-name counterpart to isHiddenSpec. Suites derived from hidden specs
 * (the long-running test-analysis suite and any setup pseudo-suites) are kept
 * out of dashboard grids — they either never run in full "all" runs or are
 * infrastructure-only, so their cells would otherwise show frozen, stale data.
 */
const HIDDEN_SUITE_RE = /(^|\.)setup(\.|$)|test-analysis/
export function isHiddenSuite(suite: string): boolean {
    return HIDDEN_SUITE_RE.test(suite)
}

const cache = new Map<string, unknown>()

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const url = rawResultsUrl(path) + `?t=${Math.floor(Date.now() / 30_000)}` // 30s cache buster
    if (cache.has(url)) return cache.get(url) as T
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
    const data = (await res.json()) as T
    cache.set(url, data)
    return data
}

export async function loadIndex(signal?: AbortSignal): Promise<IndexFile> {
    try {
        return await fetchJson<IndexFile>('index.json', signal)
    } catch (err) {
        if ((err as Error).message.includes('404')) return { runs: [] }
        throw err
    }
}

export async function loadRun(runId: string, signal?: AbortSignal): Promise<ResultRun> {
    const raw = await fetchJson<ResultRun>(`runs/${runId}.json`, signal)
    // Hide infrastructure tests (auth.setup) from the dashboard. The reporter
    // still records them in the JSON for traceability — we just don't show
    // them. Stats are recomputed so the dashboard counts only user-facing
    // tests, not the setup task.
    const tests = raw.tests.filter(t => {
        if (t.project === 'setup') return false
        if (isHiddenSpec(t.file)) return false
        return true
    })
    return { ...raw, tests, stats: computeStats(tests) }
}

function computeStats(tests: ResultTest[]): RunStats {
    return {
        total: tests.length,
        passed: tests.filter(t => t.status === 'passed').length,
        failed: tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length,
        skipped: tests.filter(t => t.status === 'skipped').length,
        flaky: tests.filter(t => t.retries > 0 && t.status === 'passed').length,
    }
}

/**
 * Re-scope a full run's stats to a single suite. Used when a suite's latest
 * data comes from an "all" run, whose summary stats span every suite — the
 * dashboard must show only the suite's own tests (e.g. Team = 1/1, not 64/64).
 */
export function suiteStats(run: ResultRun, suite: string): RunStats {
    return computeStats(run.tests.filter(t => suiteFromFile(t.file) === suite))
}

export function filterRuns(
    runs: RunSummary[],
    opts: { environment?: string; suite?: string; from?: Date; to?: Date },
): RunSummary[] {
    return runs.filter(r => {
        if (opts.environment && opts.environment !== 'all' && r.environment !== opts.environment) return false
        if (opts.suite && opts.suite !== 'all' && r.suite !== opts.suite) return false
        if (opts.from && new Date(r.finishedAt) < opts.from) return false
        if (opts.to && new Date(r.finishedAt) > opts.to) return false
        return true
    })
}

export function passRate(stats: { total: number; passed: number }): number {
    if (stats.total === 0) return 0
    return Math.round((stats.passed / stats.total) * 1000) / 10
}

/**
 * Find the most recent run of a specific suite. Only exact suite matches
 * count — "all" runs are deliberately not used as a fallback, because
 * RunSummary stats are whole-run aggregates and would misrepresent the
 * suite. Returns undefined when the suite has never been run on its own.
 */
export function latestRunForSuite(
    runs: RunSummary[],
    suite: string,
    environment?: string,
): RunSummary | undefined {
    const envOk = (r: RunSummary) => !environment || environment === 'all' || r.environment === environment
    return runs
        .filter(r => envOk(r) && r.suite === suite)
        .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))[0]
}

/**
 * The run representing a suite's latest state: the most recent run that is
 * either the suite's own dedicated run or a full "all" run (which executes
 * the suite's tests too). NOTE: when this returns an "all" run, its summary
 * stats span the entire run — callers must re-scope them via
 * `suiteStats(await loadRun(runId), suite)`.
 */
export function latestRelevantRunForSuite(
    runs: RunSummary[],
    suite: string,
    environment?: string,
): RunSummary | undefined {
    const envOk = (r: RunSummary) => !environment || environment === 'all' || r.environment === environment
    return runs
        .filter(r => envOk(r) && (r.suite === suite || r.suite === 'all'))
        .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))[0]
}

/**
 * Derive a suite name from a test's source file path. Falls back to the path.
 */
export function suiteFromFile(file: string): string {
    const m = file.match(/([^/\\]+)\.spec\.[tj]sx?$/)
    return m?.[1] ?? file
}

/**
 * Build a multi-trace URL for trace.playwright.dev. The trace viewer accepts
 * multiple `?trace=URL` parameters and renders them as a single navigable
 * timeline. Empty list returns null.
 */
export function buildTraceViewerUrl(traceUrls: string[]): string | null {
    const unique = Array.from(new Set(traceUrls.filter(Boolean)))
    if (unique.length === 0) return null
    const params = unique.map(u => `trace=${encodeURIComponent(u)}`).join('&')
    return `https://trace.playwright.dev/?${params}`
}
