import { Card, Title } from '@tremor/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { ResultRun, RunSummary } from '@/types'
import { loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatRelativeTime } from '@/lib/format'

export default function FailureFeed({ runs }: { runs: RunSummary[] }) {
    const [details, setDetails] = useState<Record<string, ResultRun>>({})

    useEffect(() => {
        const failedRuns = runs.filter(r => r.stats.failed > 0).slice(0, 5)
        const ctrl = new AbortController()
        Promise.all(
            failedRuns.map(r =>
                loadRun(r.runId, ctrl.signal)
                    .then(detail => [r.runId, detail] as const)
                    .catch(() => null),
            ),
        ).then(results => {
            const map: Record<string, ResultRun> = {}
            for (const r of results) if (r) map[r[0]] = r[1]
            setDetails(map)
        })
        return () => ctrl.abort()
    }, [runs])

    type FailedItem = {
        runId: string
        environment: ResultRun['environment']
        finishedAt: string
        testId: string
        title: string
        message: string
    }

    const failedItems: FailedItem[] = []
    for (const run of Object.values(details)) {
        for (const t of run.tests) {
            if (t.status === 'failed' || t.status === 'timedOut') {
                failedItems.push({
                    runId: run.runId,
                    environment: run.environment,
                    finishedAt: run.finishedAt,
                    testId: t.id,
                    title: t.title,
                    message: t.error?.message ?? '',
                })
                if (failedItems.length >= 10) break
            }
        }
        if (failedItems.length >= 10) break
    }

    return (
        <Card>
            <Title>Recent failures</Title>
            {failedItems.length === 0 && (
                <p className="mt-4 text-tremor-content dark:text-dark-tremor-content text-sm">
                    {Object.keys(details).length === 0 ? 'Loading…' : 'No failures in recent runs 🎉'}
                </p>
            )}
            <ul className="mt-3 space-y-3">
                {failedItems.map((f, i) => (
                    <li key={`${f.runId}-${f.testId}-${i}`} className="text-sm">
                        <div className="flex items-baseline gap-2">
                            <code className="font-mono text-xs text-rose-400">{f.testId}</code>
                            <span className="text-tremor-content-strong dark:text-dark-tremor-content-strong truncate">{f.title}</span>
                            <span className="text-tremor-content dark:text-dark-tremor-content text-xs ml-auto">{ENV_LABELS[f.environment]} · {formatRelativeTime(f.finishedAt)}</span>
                        </div>
                        <pre className="mt-1 text-xs text-tremor-content dark:text-dark-tremor-content whitespace-pre-wrap line-clamp-2">{f.message}</pre>
                        <Link to={`/runs/${f.runId}`} className="text-xs text-tremor-brand hover:underline">Open run →</Link>
                    </li>
                ))}
            </ul>
        </Card>
    )
}
