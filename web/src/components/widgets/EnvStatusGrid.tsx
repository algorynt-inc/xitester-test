import { useEffect, useState } from 'react'
import { Card, Title } from '@tremor/react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { EnvName, ResultRun, RunStats, RunSummary } from '@/types'
import { ENVS } from '@/types'
import { ENV_LABELS } from '@/lib/config'
import { passRate, isHiddenSuite, loadRun, suiteStats } from '@/lib/results-loader'
import { loadCatalog } from '@/lib/catalog-loader'

function rateColor(rate: number | null): string {
    if (rate === null) return 'border-tremor-border dark:border-dark-tremor-border bg-tremor-background-muted dark:bg-dark-tremor-background-muted'
    if (rate >= 95) return 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
    if (rate >= 80) return 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
    return 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
}

function rateText(rate: number | null): string {
    if (rate === null) return 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle'
    if (rate >= 95) return 'text-emerald-600 dark:text-emerald-400'
    if (rate >= 80) return 'text-amber-600 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
}

/** A cell's resolved content: the run it reflects + suite-scoped stats. */
interface CellData {
    run: RunSummary
    stats: RunStats
}

export default function EnvStatusGrid({ runs }: { runs: RunSummary[] }) {
    const [catalogSuites, setCatalogSuites] = useState<string[]>([])
    const [allDetails, setAllDetails] = useState<Record<string, ResultRun>>({})

    useEffect(() => {
        loadCatalog().then(c => setCatalogSuites(c.suites)).catch(() => undefined)
    }, [])

    // Pick the latest run per (env, suite) combo.
    const grid = new Map<string, RunSummary>()
    for (const r of runs) {
        const key = `${r.environment}|${r.suite}`
        const prev = grid.get(key)
        if (!prev || new Date(r.finishedAt) > new Date(prev.finishedAt)) grid.set(key, r)
    }

    // Latest "all" run per environment. Its JSON is fetched (cached) so each
    // cell can show suite-scoped stats when the "all" run is the freshest data.
    const latestAllByEnv = new Map<EnvName, RunSummary>()
    for (const r of runs) {
        if (r.suite !== 'all') continue
        const prev = latestAllByEnv.get(r.environment)
        if (!prev || r.finishedAt.localeCompare(prev.finishedAt) > 0) latestAllByEnv.set(r.environment, r)
    }

    useEffect(() => {
        let stop = false
        const latest = new Map<EnvName, RunSummary>()
        for (const r of runs) {
            if (r.suite !== 'all') continue
            const prev = latest.get(r.environment)
            if (!prev || r.finishedAt.localeCompare(prev.finishedAt) > 0) latest.set(r.environment, r)
        }
        for (const r of latest.values()) {
            loadRun(r.runId)
                .then(full => {
                    if (!stop) setAllDetails(d => ({ ...d, [full.runId]: full }))
                })
                .catch(() => undefined)
        }
        return () => {
            stop = true
        }
    }, [runs])

    // A dedicated suite run wins unless a newer "all" run exercised the suite.
    const cellFor = (env: EnvName, suite: string): CellData | undefined => {
        const exact = grid.get(`${env}|${suite}`)
        const all = latestAllByEnv.get(env)
        if (all && (!exact || all.finishedAt.localeCompare(exact.finishedAt) > 0)) {
            const full = allDetails[all.runId]
            if (full) {
                const stats = suiteStats(full, suite)
                if (stats.total > 0) return { run: all, stats }
            }
        }
        return exact ? { run: exact, stats: exact.stats } : undefined
    }

    // Suites = catalog ∪ run-history, minus the meta "all" pseudo-suite and
    // hidden suites (test-analysis, setup) whose cells never refresh from full runs.
    const suiteSet = new Set<string>(catalogSuites.filter(s => !isHiddenSuite(s)))
    for (const r of runs) if (r.suite !== 'all' && !isHiddenSuite(r.suite)) suiteSet.add(r.suite)
    const visibleSuites = Array.from(suiteSet).sort()

    return (
        <Card className="h-full">
            <Title>Latest Run - Suite vs Environment</Title>
            <p className="mt-1 text-xs text-tremor-content dark:text-dark-tremor-content">
                Pass rate · passed / total · breakdown of the latest run for each cell.
            </p>
            <div className="mt-4 max-h-64 overflow-auto">
                <table className="w-full text-sm border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="sticky top-0 z-10 bg-tremor-background dark:bg-dark-tremor-background text-left text-xs font-medium text-tremor-content dark:text-dark-tremor-content pb-1">
                                Suite
                            </th>
                            {ENVS.map(e => (
                                <th
                                    key={e}
                                    className="sticky top-0 z-10 bg-tremor-background dark:bg-dark-tremor-background text-left text-xs font-medium text-tremor-content dark:text-dark-tremor-content pb-1"
                                >
                                    {ENV_LABELS[e]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleSuites.length === 0 && (
                            <tr>
                                <td colSpan={ENVS.length + 1} className="py-3 text-tremor-content dark:text-dark-tremor-content text-xs">
                                    No suites in catalog yet. The next Pages deploy will populate this list.
                                </td>
                            </tr>
                        )}
                        {visibleSuites.map((suite: string) => (
                            <tr key={suite}>
                                <td className="pr-2 align-middle font-medium capitalize text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {suite}
                                </td>
                                {ENVS.map((env: EnvName) => (
                                    <Cell key={env} data={cellFor(env, suite)} />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

function Cell({ data }: { data: CellData | undefined }) {
    if (!data) {
        return (
            <td>
                <div
                    className={clsx(
                        'rounded-tremor-default border px-3 py-2.5 text-xs text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
                        rateColor(null),
                    )}
                >
                    no runs yet
                </div>
            </td>
        )
    }
    const rate = passRate(data.stats)
    const { passed, failed, skipped, total } = data.stats
    return (
        <td>
            <Link
                to={`/runs/${data.run.runId}`}
                className={clsx(
                    'block rounded-tremor-default border px-3 py-2 transition-colors',
                    rateColor(rate),
                )}
            >
                <div className="flex items-baseline gap-2">
                    <span className={clsx('text-sm font-semibold tabular-nums', rateText(rate))}>
                        {rate}%
                    </span>
                    <span className="text-xs text-tremor-content dark:text-dark-tremor-content tabular-nums">
                        {passed}/{total}
                    </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] tabular-nums">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {passed}
                    </span>
                    <span
                        className={clsx(
                            'inline-flex items-center gap-1',
                            failed > 0
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
                        )}
                    >
                        <span className={clsx('inline-block h-1.5 w-1.5 rounded-full', failed > 0 ? 'bg-rose-500' : 'bg-slate-400/60')} />
                        {failed}
                    </span>
                    <span
                        className={clsx(
                            'inline-flex items-center gap-1',
                            skipped > 0
                                ? 'text-slate-600 dark:text-slate-400'
                                : 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
                        )}
                    >
                        <span className={clsx('inline-block h-1.5 w-1.5 rounded-full', skipped > 0 ? 'bg-slate-500' : 'bg-slate-400/60')} />
                        {skipped}
                    </span>
                </div>
            </Link>
        </td>
    )
}
