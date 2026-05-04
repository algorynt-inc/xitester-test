import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Title, Metric, Text, Bold } from '@tremor/react'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'
import StatusPill from '@/components/widgets/StatusPill'
import AttachmentGallery from '@/components/widgets/AttachmentGallery'
import { buildGrepFromTestIds, getWorkflowRun, listRunArtifacts, type WorkflowRunSummary } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun } from '@/types'

export default function RunDetail() {
    const { runId } = useParams<{ runId: string }>()
    const navigate = useNavigate()
    const [run, setRun] = useState<ResultRun | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [workflowRun, setWorkflowRun] = useState<WorkflowRunSummary | null>(null)
    const [artifacts, setArtifacts] = useState<Array<{ id: number; name: string; archive_download_url: string }>>([])

    const fetchAll = (signal?: AbortSignal) => {
        if (!runId) return
        setLoadError(null)
        loadRun(runId, signal).then(setRun).catch(err => setLoadError((err as Error).message))
        const token = getToken()
        if (token) {
            listRunArtifacts(token, Number(runId)).then(setArtifacts).catch(() => undefined)
            getWorkflowRun(token, Number(runId)).then(setWorkflowRun).catch(() => undefined)
        }
    }

    useEffect(() => {
        const ctrl = new AbortController()
        fetchAll(ctrl.signal)
        return () => ctrl.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runId])

    if (loadError && !run) return <RunUnavailable runId={runId!} workflowRun={workflowRun} loadError={loadError} onRetry={() => fetchAll()} />
    if (!run) return <div className="text-tremor-content dark:text-dark-tremor-content">Loading…</div>

    const failedTests = run.tests.filter(t => t.status === 'failed' || t.status === 'timedOut')
    const byFile = new Map<string, typeof run.tests>()
    for (const t of run.tests) {
        const list = byFile.get(t.file) ?? []
        list.push(t)
        byFile.set(t.file, list)
    }

    const reRun = (grep: string, suite: string = run.suite) => {
        const params = new URLSearchParams({
            env: run.environment,
            suite,
            grep,
        })
        navigate(`/trigger?${params.toString()}`)
    }

    const reRunAllFailed = () => {
        const grep = buildGrepFromTestIds(failedTests.map(t => t.id))
        reRun(grep)
    }

    const summaryCards = [
        { label: 'Environment', value: ENV_LABELS[run.environment] },
        { label: 'Suite', value: <span className="capitalize">{run.suite}</span> },
        {
            label: 'Result',
            value: `${run.stats.passed}/${run.stats.total}`,
            sub: `${run.stats.failed} failed · ${run.stats.skipped} skipped · ${run.stats.flaky} flaky`,
        },
        {
            label: 'Duration',
            value: formatDuration(run.durationMs),
            sub: formatRelativeTime(run.finishedAt),
        },
        { label: 'Commit', value: <span className="font-mono">{shortSha(run.commit)}</span> },
    ]

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-baseline gap-3">
                <Link to="/runs" className="text-tremor-brand hover:underline text-sm">← All runs</Link>
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
                    Run {run.runId}
                </h1>
                {run.workflowRunUrl && (
                    <a
                        href={run.workflowRunUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto inline-flex items-center gap-1 text-xs text-tremor-content dark:text-dark-tremor-content hover:underline"
                    >
                        <ExternalLink className="h-3 w-3" />
                        Open in Actions
                    </a>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {summaryCards.map((c, i) => (
                    <motion.div
                        key={c.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        className="lift"
                    >
                        <Card>
                            <Text>{c.label}</Text>
                            <Metric className="text-2xl">{c.value}</Metric>
                            {c.sub && <Text className="mt-1 text-xs">{c.sub}</Text>}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {failedTests.length > 0 && (
                <Card>
                    <div className="flex items-center justify-between">
                        <Title>Failures ({failedTests.length})</Title>
                        <Button size="xs" variant="primary" icon={RefreshCw} onClick={reRunAllFailed}>
                            Re-run all failed
                        </Button>
                    </div>
                    <ul className="mt-4 space-y-6">
                        {failedTests.map((t, idx) => (
                            <motion.li
                                key={`${t.id}-${t.project}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="group rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border p-4 bg-tremor-background dark:bg-dark-tremor-background"
                            >
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <code className="font-mono text-xs text-rose-500 dark:text-rose-400">{t.id}</code>
                                    <Bold>{t.title}</Bold>
                                    <span className="text-tremor-content dark:text-dark-tremor-content text-xs">{t.project}</span>
                                    <span className="text-tremor-content dark:text-dark-tremor-content text-xs ml-auto">
                                        {formatDuration(t.durationMs)} · {t.retries} retries
                                    </span>
                                    <Button size="xs" variant="light" icon={RefreshCw} onClick={() => reRun(t.id)}>
                                        Re-run
                                    </Button>
                                </div>
                                {t.error?.message && (
                                    <pre className="mt-3 text-xs whitespace-pre-wrap text-tremor-content dark:text-dark-tremor-content bg-tremor-background-muted dark:bg-dark-tremor-background-muted p-3 rounded-tremor-default overflow-x-auto">
                                        {t.error.message}
                                        {t.error.snippet ? `\n\n${t.error.snippet}` : ''}
                                    </pre>
                                )}
                                {t.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <AttachmentGallery attachments={t.attachments} />
                                    </div>
                                )}
                            </motion.li>
                        ))}
                    </ul>
                </Card>
            )}

            <Card>
                <Title>All tests</Title>
                <div className="mt-4 space-y-4">
                    {Array.from(byFile.entries()).map(([file, tests]) => (
                        <div key={file}>
                            <h3 className="text-sm font-mono text-tremor-content dark:text-dark-tremor-content">{file}</h3>
                            <table className="mt-1 w-full text-sm">
                                <tbody>
                                    {tests.map(t => (
                                        <tr
                                            key={`${t.id}-${t.project}`}
                                            className="border-t border-tremor-border dark:border-dark-tremor-border group hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                                        >
                                            <td className="py-1.5 pr-4 w-24"><StatusPill status={t.status} /></td>
                                            <td className="py-1.5 pr-4 w-36 font-mono text-xs">
                                                <Link to={`/tests/${t.id}`} className="hover:underline">{t.id}</Link>
                                            </td>
                                            <td className="py-1.5 pr-4">{t.title}</td>
                                            <td className="py-1.5 pr-4 w-24 text-tremor-content dark:text-dark-tremor-content text-xs">{t.project}</td>
                                            <td className="py-1.5 pr-4 w-20 text-right text-xs">{formatDuration(t.durationMs)}</td>
                                            <td className="py-1.5 pr-2 w-24 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => reRun(t.id)}
                                                    className="inline-flex items-center gap-1 text-xs text-tremor-brand hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title={`Re-run ${t.id}`}
                                                >
                                                    <RefreshCw className="h-3 w-3" />
                                                    Re-run
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </Card>

            {artifacts.length > 0 && (
                <Card>
                    <Title>Raw workflow artifacts</Title>
                    <Text className="mt-1 text-xs">
                        Authenticated downloads from GitHub Actions (90-day retention). Uses your PAT.
                    </Text>
                    <ul className="mt-3 text-sm space-y-1">
                        {artifacts.map(a => (
                            <li key={a.id}>
                                <a href={a.archive_download_url} className="text-tremor-brand hover:underline">{a.name}</a>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </motion.div>
    )
}

function RunUnavailable({
    runId,
    workflowRun,
    loadError,
    onRetry,
}: {
    runId: string
    workflowRun: WorkflowRunSummary | null
    loadError: string
    onRetry: () => void
}) {
    const isInProgress = workflowRun?.status !== 'completed'
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center py-12"
        >
            <Card className="max-w-lg text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/10 text-amber-500 mb-3">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Run results not available yet
                </h2>
                <Text className="mt-2">
                    {isInProgress
                        ? `The workflow is still ${workflowRun?.status ?? 'running'}. Results land here within ~5s of completion.`
                        : `The workflow completed but didn't push results to the dashboard. The job likely failed before the "Sync results branch" step. Check the Actions log.`}
                </Text>
                <p className="mt-3 text-xs text-tremor-content dark:text-dark-tremor-content">
                    <code className="font-mono">{loadError}</code>
                </p>
                <div className="mt-6 flex gap-2 justify-center">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border text-sm hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </button>
                    {workflowRun?.html_url && (
                        <a
                            href={workflowRun.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-tremor-default bg-tremor-brand text-white text-sm hover:opacity-90 transition-opacity"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open Actions log
                        </a>
                    )}
                </div>
                <Link to="/runs" className="mt-4 inline-block text-xs text-tremor-content dark:text-dark-tremor-content hover:underline">
                    ← Back to all runs (run id {runId})
                </Link>
            </Card>
        </motion.div>
    )
}
