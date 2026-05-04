import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Title, Metric, Text, Bold } from '@tremor/react'
import { motion } from 'framer-motion'
import { AlertTriangle, Download, ExternalLink, Loader2, Play, RefreshCw } from 'lucide-react'
import StatusPill from '@/components/widgets/StatusPill'
import AttachmentGallery from '@/components/widgets/AttachmentGallery'
import Accordion from '@/components/Accordion'
import {
    buildGrepFromTestIds,
    downloadArtifactZip,
    getWorkflowRun,
    listRunArtifacts,
    type WorkflowRunSummary,
} from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { attachmentUrl, buildTraceViewerUrl, loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun, ResultTest } from '@/types'

export default function RunDetail() {
    const { runId } = useParams<{ runId: string }>()
    const navigate = useNavigate()
    const [run, setRun] = useState<ResultRun | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [workflowRun, setWorkflowRun] = useState<WorkflowRunSummary | null>(null)
    const [artifacts, setArtifacts] = useState<Array<{ id: number; name: string; size_in_bytes: number; archive_download_url: string }>>([])

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
            parent: run.runId,
        })
        navigate(`/trigger?${params.toString()}`)
    }

    const reRunAllFailed = () => {
        const grep = buildGrepFromTestIds(failedTests.map(t => t.id))
        reRun(grep)
    }

    const reRunCategory = (category: string) => {
        // Playwright matches --grep against the full title path "<describe> > <test>",
        // so the describe-block title is sufficient. Anchor and escape regex specials.
        const escaped = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        reRun(escaped)
    }

    // Group ALL tests by category (preserves describe ordering via Map insertion order).
    const allByCategory = new Map<string, ResultTest[]>()
    for (const t of run.tests) {
        const key = t.category ?? 'Uncategorised'
        const list = allByCategory.get(key) ?? []
        list.push(t)
        allByCategory.set(key, list)
    }

    // Group only failed tests for the Failures section.
    const failedByCategory = new Map<string, ResultTest[]>()
    for (const t of failedTests) {
        const key = t.category ?? 'Uncategorised'
        const list = failedByCategory.get(key) ?? []
        list.push(t)
        failedByCategory.set(key, list)
    }

    // Build "Open suite trace" URL: every trace.zip attachment across all tests.
    const allTraceUrls = run.tests
        .flatMap(t => t.attachments)
        .filter(a => (a.contentType ?? '').includes('zip') || a.name.toLowerCase().includes('trace'))
        .map(a => attachmentUrl(a))
        .filter((u): u is string => u !== null)
    const suiteTraceUrl = buildTraceViewerUrl(allTraceUrls)

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
                <div className="ml-auto flex items-center gap-2">
                    {suiteTraceUrl && (
                        <a
                            href={suiteTraceUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={`Opens trace.playwright.dev with ${allTraceUrls.length} Playwright .zip trace${allTraceUrls.length === 1 ? '' : 's'} from this run`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-tremor-default text-xs font-medium bg-tremor-brand text-white hover:opacity-90 transition-opacity"
                        >
                            <Play className="h-3 w-3" />
                            Open suite trace · {allTraceUrls.length} .zip
                        </a>
                    )}
                    {run.workflowRunUrl && (
                        <a
                            href={run.workflowRunUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-tremor-content dark:text-dark-tremor-content hover:underline"
                        >
                            <ExternalLink className="h-3 w-3" />
                            Open in Actions
                        </a>
                    )}
                </div>
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
                    <div className="mt-4 space-y-2">
                        {Array.from(failedByCategory.entries()).map(([category, tests]) => (
                            <Accordion
                                key={category}
                                defaultOpen
                                header={
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            {category}
                                        </span>
                                        <span className="text-xs text-rose-500 dark:text-rose-400">
                                            {tests.length} failed
                                        </span>
                                    </div>
                                }
                                actions={
                                    <Button size="xs" variant="light" icon={RefreshCw} onClick={() => reRunCategory(category)}>
                                        Re-run
                                    </Button>
                                }
                            >
                                <ul className="mt-3 space-y-6">
                                    {tests.map((t, idx) => (
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
                            </Accordion>
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <div className="flex items-center justify-between">
                    <Title>All tests by category</Title>
                    <Text className="text-xs">click a category to expand</Text>
                </div>
                <div className="mt-4 space-y-2">
                    {Array.from(allByCategory.entries()).map(([category, tests]) => {
                        const passed = tests.filter(t => t.status === 'passed').length
                        const failed = tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length
                        const skipped = tests.filter(t => t.status === 'skipped').length
                        return (
                            <Accordion
                                key={category}
                                defaultOpen={failed > 0}
                                header={
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                            {category}
                                        </span>
                                        <span className="text-xs text-tremor-content dark:text-dark-tremor-content">
                                            ({tests.length})
                                        </span>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-emerald-600 dark:text-emerald-400">{passed} passed</span>
                                            {failed > 0 && <span className="text-rose-500 dark:text-rose-400">{failed} failed</span>}
                                            {skipped > 0 && <span className="text-tremor-content dark:text-dark-tremor-content">{skipped} skipped</span>}
                                        </div>
                                    </div>
                                }
                                actions={
                                    <Button size="xs" variant="light" icon={RefreshCw} onClick={() => reRunCategory(category)}>
                                        Run
                                    </Button>
                                }
                            >
                                <div className="scroll-card-body mt-2">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {tests.map(t => (
                                                <tr
                                                    key={`${t.id}-${t.project}`}
                                                    className="border-t border-tremor-border dark:border-dark-tremor-border first:border-t-0 group hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
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
                            </Accordion>
                        )
                    })}
                </div>
            </Card>

            {artifacts.length > 0 && <ArtifactsCard artifacts={artifacts} />}
        </motion.div>
    )
}

function ArtifactsCard({
    artifacts,
}: {
    artifacts: Array<{ id: number; name: string; size_in_bytes: number; archive_download_url: string }>
}) {
    const [downloading, setDownloading] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDownload = async (id: number, name: string) => {
        const token = getToken()
        if (!token) {
            setError('Not signed in')
            return
        }
        setError(null)
        setDownloading(id)
        try {
            await downloadArtifactZip(token, id, name)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setDownloading(null)
        }
    }

    return (
        <Card>
            <Title>Raw workflow artifacts</Title>
            <Text className="mt-1 text-xs">
                Authenticated download via your PAT. 90-day retention.
            </Text>
            {error && (
                <div className="mt-3 rounded-tremor-default bg-rose-500/10 text-rose-500 dark:text-rose-400 px-3 py-2 text-sm">
                    {error}
                </div>
            )}
            <ul className="mt-3 text-sm space-y-2">
                {artifacts.map(a => (
                    <li key={a.id} className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onDownload(a.id, a.name)}
                            disabled={downloading === a.id}
                            className="inline-flex items-center gap-1.5 text-tremor-brand hover:underline disabled:opacity-50"
                        >
                            {downloading === a.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Download className="h-3.5 w-3.5" />
                            )}
                            {a.name}
                        </button>
                        <span className="text-tremor-content dark:text-dark-tremor-content text-xs">
                            {formatBytes(a.size_in_bytes)}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    )
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
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
