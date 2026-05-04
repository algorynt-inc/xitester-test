import { Card, Title } from '@tremor/react'
import { Link } from 'react-router-dom'
import type { RunSummary } from '@/types'
import { passRate } from '@/lib/results-loader'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import { ENV_LABELS } from '@/lib/config'
import StatusPill from './StatusPill'

export default function RunsList({ runs, title = 'Latest runs' }: { runs: RunSummary[]; title?: string }) {
    return (
        <Card>
            <Title>{title}</Title>
            <table className="mt-4 w-full text-sm">
                <thead>
                    <tr className="text-left text-tremor-content dark:text-dark-tremor-content">
                        <th className="py-2 pr-4 font-medium">When</th>
                        <th className="py-2 pr-4 font-medium">Env</th>
                        <th className="py-2 pr-4 font-medium">Suite</th>
                        <th className="py-2 pr-4 font-medium">Result</th>
                        <th className="py-2 pr-4 font-medium">Duration</th>
                        <th className="py-2 pr-4 font-medium">Commit</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {runs.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-6 text-center text-tremor-content dark:text-dark-tremor-content">
                                No runs yet.
                            </td>
                        </tr>
                    )}
                    {runs.map(r => {
                        const rate = passRate(r.stats)
                        const overall = r.stats.failed > 0 ? 'failed' : r.stats.total === 0 ? 'skipped' : 'passed'
                        return (
                            <tr key={r.runId} className="border-t border-tremor-border dark:border-dark-tremor-border">
                                <td className="py-2 pr-4">{formatRelativeTime(r.finishedAt)}</td>
                                <td className="py-2 pr-4">{ENV_LABELS[r.environment]}</td>
                                <td className="py-2 pr-4 capitalize">{r.suite}</td>
                                <td className="py-2 pr-4 flex items-center gap-2">
                                    <StatusPill status={overall} />
                                    <span className="text-tremor-content dark:text-dark-tremor-content">{rate}% ({r.stats.passed}/{r.stats.total})</span>
                                </td>
                                <td className="py-2 pr-4">{formatDuration(r.durationMs)}</td>
                                <td className="py-2 pr-4 font-mono text-xs">{shortSha(r.commit)}</td>
                                <td className="py-2 pr-4 text-right">
                                    <Link to={`/runs/${r.runId}`} className="text-tremor-brand hover:underline">View</Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    )
}
