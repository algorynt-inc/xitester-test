import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Title, Text } from '@tremor/react'
import StatusPill from '@/components/widgets/StatusPill'
import { loadIndex, loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { EnvName, ResultRun, RunSummary, TestStatus } from '@/types'

interface Appearance {
    runId: string
    environment: EnvName
    finishedAt: string
    status: TestStatus
    durationMs: number
    commit: string | null
}

export default function TestHistory() {
    const { tcId } = useParams<{ tcId: string }>()
    const [runs, setRuns] = useState<RunSummary[]>([])
    const [appearances, setAppearances] = useState<Appearance[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ctrl = new AbortController()
        loadIndex(ctrl.signal).then(idx => setRuns(idx.runs)).finally(() => undefined)
        return () => ctrl.abort()
    }, [])

    useEffect(() => {
        if (!tcId || runs.length === 0) return
        const ctrl = new AbortController()
        const recent = runs.slice(0, 50)
        Promise.all(
            recent.map(r =>
                loadRun(r.runId, ctrl.signal)
                    .then((d: ResultRun) => {
                        const t = d.tests.find(x => x.id === tcId)
                        if (!t) return null
                        return {
                            runId: d.runId,
                            environment: d.environment,
                            finishedAt: d.finishedAt,
                            status: t.status,
                            durationMs: t.durationMs,
                            commit: d.commit,
                        } as Appearance
                    })
                    .catch(() => null),
            ),
        ).then(rs => {
            setAppearances(rs.filter((x): x is Appearance => x !== null))
            setLoading(false)
        })
        return () => ctrl.abort()
    }, [tcId, runs])

    return (
        <div className="space-y-6">
            <div className="flex items-baseline gap-3">
                <Link to="/runs" className="text-tremor-brand hover:underline text-sm">← All runs</Link>
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Test history · <code className="font-mono text-base">{tcId}</code>
                </h1>
            </div>

            {loading && <Text>Loading…</Text>}

            <Card>
                <Title>Last {appearances.length} appearance{appearances.length === 1 ? '' : 's'}</Title>
                <table className="mt-4 w-full text-sm">
                    <thead>
                        <tr className="text-left text-tremor-content dark:text-dark-tremor-content">
                            <th className="py-2 pr-4">When</th>
                            <th className="py-2 pr-4">Env</th>
                            <th className="py-2 pr-4">Status</th>
                            <th className="py-2 pr-4">Duration</th>
                            <th className="py-2 pr-4">Commit</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {appearances.map(a => (
                            <tr key={a.runId} className="border-t border-tremor-border dark:border-dark-tremor-border">
                                <td className="py-2 pr-4">{formatRelativeTime(a.finishedAt)}</td>
                                <td className="py-2 pr-4">{ENV_LABELS[a.environment]}</td>
                                <td className="py-2 pr-4"><StatusPill status={a.status} /></td>
                                <td className="py-2 pr-4">{formatDuration(a.durationMs)}</td>
                                <td className="py-2 pr-4 font-mono text-xs">{shortSha(a.commit)}</td>
                                <td className="py-2 pr-4 text-right">
                                    <Link to={`/runs/${a.runId}`} className="text-tremor-brand hover:underline">View run</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
