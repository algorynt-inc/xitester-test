import { Card, Title } from '@tremor/react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { EnvName, RunSummary, SuiteName } from '@/types'
import { ENVS, SUITES } from '@/types'
import { ENV_LABELS } from '@/lib/config'
import { passRate } from '@/lib/results-loader'

function colorFor(rate: number | null): string {
    if (rate === null) return 'bg-tremor-background-muted dark:bg-dark-tremor-background-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle'
    if (rate >= 95) return 'bg-emerald-500/15 text-emerald-400'
    if (rate >= 80) return 'bg-amber-500/15 text-amber-400'
    return 'bg-rose-500/15 text-rose-400'
}

export default function EnvStatusGrid({ runs }: { runs: RunSummary[] }) {
    const grid = new Map<string, RunSummary>()
    for (const r of runs) {
        const key = `${r.environment}|${r.suite}`
        const prev = grid.get(key)
        if (!prev || new Date(r.finishedAt) > new Date(prev.finishedAt)) grid.set(key, r)
    }

    const visibleSuites = SUITES.filter(s => s !== 'all')

    return (
        <Card>
            <Title>Latest run by env × suite</Title>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-tremor-content dark:text-dark-tremor-content">
                            <th className="py-2 pr-4 font-medium">Suite</th>
                            {ENVS.map(e => (
                                <th key={e} className="py-2 pr-4 font-medium">{ENV_LABELS[e]}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleSuites.map((suite: SuiteName) => (
                            <tr key={suite} className="border-t border-tremor-border dark:border-dark-tremor-border">
                                <td className="py-2 pr-4 capitalize text-tremor-content-strong dark:text-dark-tremor-content-strong">{suite}</td>
                                {ENVS.map((env: EnvName) => {
                                    const r = grid.get(`${env}|${suite}`)
                                    const rate = r ? passRate(r.stats) : null
                                    return (
                                        <td key={env} className="py-2 pr-4">
                                            {r ? (
                                                <Link
                                                    to={`/runs/${r.runId}`}
                                                    className={clsx('inline-block px-2 py-1 rounded-tremor-small font-medium', colorFor(rate))}
                                                >
                                                    {rate}% · {r.stats.passed}/{r.stats.total}
                                                </Link>
                                            ) : (
                                                <span className={clsx('inline-block px-2 py-1 rounded-tremor-small', colorFor(null))}>—</span>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
