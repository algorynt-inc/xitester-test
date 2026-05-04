import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { Card, Title, Metric, Text } from '@tremor/react'
import { motion } from 'framer-motion'
import { ExternalLink, GitMerge } from 'lucide-react'
import StatusPill from '@/components/widgets/StatusPill'
import { getToken } from '@/lib/auth/auth-store'
import { getWorkflowRun, type WorkflowRunSummary } from '@/lib/github-client'
import { formatRelativeTime } from '@/lib/format'

export default function InFlight() {
    const { runId } = useParams<{ runId: string }>()
    const [params] = useSearchParams()
    const parentRunId = params.get('parent') ?? ''
    const navigate = useNavigate()
    const [run, setRun] = useState<WorkflowRunSummary | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pollSeconds, setPollSeconds] = useState(0)

    // Where to land after completion. For re-runs, the parent JSON is the
    // canonical record (it gets merged), so route there. Otherwise the new
    // workflow run's own ID is the dashboard runId.
    const destinationRunId = parentRunId || runId

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
                    // Give the workflow ~8s to push the merged JSON to results.
                    setTimeout(() => navigate(`/runs/${destinationRunId}`, { replace: true }), 8000)
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
    }, [runId, destinationRunId, navigate])

    return (
        <motion.div
            className="space-y-6 max-w-2xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {parentRunId ? 'Re-run in flight' : 'Run in flight'} · {runId}
            </h1>
            {error && <p className="text-rose-500 dark:text-rose-400 text-sm">{error}</p>}

            {parentRunId && (
                <Card className="border-tremor-brand/40 bg-tremor-brand/5">
                    <div className="flex items-start gap-3">
                        <GitMerge className="h-5 w-5 text-tremor-brand mt-0.5" />
                        <div className="flex-1">
                            <Text className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Will merge into{' '}
                                <Link to={`/runs/${parentRunId}`} className="font-mono text-tremor-brand hover:underline">
                                    {parentRunId}
                                </Link>
                            </Text>
                            <Text className="text-xs mt-1">
                                When complete, you'll land on the parent run with refreshed test results.
                            </Text>
                        </div>
                    </div>
                </Card>
            )}

            <Card>
                <div className="flex items-baseline gap-3">
                    <Title>Status</Title>
                    <StatusPill
                        status={
                            run?.status === 'completed'
                                ? run.conclusion === 'success'
                                    ? 'passed'
                                    : 'failed'
                                : 'running'
                        }
                    />
                </div>
                <Metric className="mt-2 capitalize">{run?.status ?? 'queued'}</Metric>
                {run && (
                    <Text className="mt-1">
                        Started {formatRelativeTime(run.created_at)} · {pollSeconds}s polling
                    </Text>
                )}
                {run?.html_url && (
                    <a
                        href={run.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-tremor-brand text-sm hover:underline"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open on GitHub Actions
                    </a>
                )}
            </Card>

            {run?.status === 'completed' && (
                <Card>
                    <Text>Run finished. Loading results…</Text>
                </Card>
            )}
        </motion.div>
    )
}
