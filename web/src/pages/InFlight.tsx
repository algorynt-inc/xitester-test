import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Title, Metric, Text } from '@tremor/react'
import StatusPill from '@/components/widgets/StatusPill'
import { getToken } from '@/lib/auth/auth-store'
import { getWorkflowRun, type WorkflowRunSummary } from '@/lib/github-client'
import { formatRelativeTime } from '@/lib/format'

export default function InFlight() {
    const { runId } = useParams<{ runId: string }>()
    const navigate = useNavigate()
    const [run, setRun] = useState<WorkflowRunSummary | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pollSeconds, setPollSeconds] = useState(0)

    useEffect(() => {
        if (!runId) return
        const token = getToken()
        if (!token) return
        let stop = false
        const poll = async () => {
            try {
                const r = await getWorkflowRun(token, Number(runId))
                if (stop) return
                setRun(r)
                if (r.status === 'completed') {
                    // Wait a beat for the results-branch commit to land, then route.
                    setTimeout(() => navigate(`/runs/${runId}`, { replace: true }), 8000)
                    return
                }
            } catch (err) {
                setError((err as Error).message)
            }
            if (!stop) setTimeout(poll, 5000)
        }
        poll()
        const tick = setInterval(() => setPollSeconds(s => s + 1), 1000)
        return () => {
            stop = true
            clearInterval(tick)
        }
    }, [runId, navigate])

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Run in flight · {runId}
            </h1>
            {error && <p className="text-rose-400 text-sm">{error}</p>}

            <Card>
                <div className="flex items-baseline gap-3">
                    <Title>Status</Title>
                    <StatusPill status={run?.status === 'completed'
                        ? (run.conclusion === 'success' ? 'passed' : 'failed')
                        : 'running'} />
                </div>
                <Metric className="mt-2 capitalize">{run?.status ?? 'queued'}</Metric>
                {run && (
                    <Text className="mt-1">
                        Started {formatRelativeTime(run.created_at)} · {pollSeconds}s polling
                    </Text>
                )}
                {run?.html_url && (
                    <a href={run.html_url} target="_blank" rel="noreferrer" className="mt-3 block text-tremor-brand text-sm hover:underline">
                        Open on GitHub Actions →
                    </a>
                )}
            </Card>

            {run?.status === 'completed' && (
                <Card>
                    <Text>Run finished. Loading results…</Text>
                </Card>
            )}
        </div>
    )
}
