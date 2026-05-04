import { rawResultsUrl } from './config'
import type { IndexFile, ResultAttachment, ResultRun, RunSummary } from '@/types'

/**
 * Resolve an attachment's URL field to a fully-qualified raw.githubusercontent.com URL.
 * Returns null if the attachment has no public URL (e.g., legacy local-only path).
 */
export function attachmentUrl(att: ResultAttachment): string | null {
    if (!att.url) return null
    return rawResultsUrl(`runs/${att.url}`)
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
    return fetchJson<ResultRun>(`runs/${runId}.json`, signal)
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
 * Find the most recent run that matches a suite filter. Falls back to the
 * latest "all" run if no exact match exists, since that contains the suite's
 * tests too.
 */
export function latestRunForSuite(
    runs: RunSummary[],
    suite: string,
    environment?: string,
): RunSummary | undefined {
    const envOk = (r: RunSummary) => !environment || environment === 'all' || r.environment === environment
    const exact = runs
        .filter(r => envOk(r) && r.suite === suite)
        .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))
    if (exact.length > 0) return exact[0]
    const fallback = runs
        .filter(r => envOk(r) && r.suite === 'all')
        .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt))
    return fallback[0]
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
