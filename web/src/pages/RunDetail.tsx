import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Title, Metric, Text, Bold } from '@tremor/react'
import { motion } from 'framer-motion'
import StatusPill from '@/components/widgets/StatusPill'
import { buildGrepFromTestIds, listRunArtifacts } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun } from '@/types'

export default function RunDetail() {
    const { runId } = useParams<{ runId: string }>()
    const navigate = useNavigate()
    const [run, setRun] = useState<ResultRun | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [artifacts, setArtifacts] = useState<Array<{ id: number; name: string; archive_download_url: string }>>([])

    useEffect(() => {
        if (!runId) return
        const ctrl = new AbortController()
        loadRun(runId, ctrl.signal).then(setRun).catch(err => setError((err as Error).message))
        const token = getToken()
        if (token) {
            listRunArtifacts(token, Number(runId)).then(setArtifacts).catch(() => undefined)
        }
        return () => ctrl.abort()
    }, [runId])

    if (error) return <div className="text-rose-500 dark:text-rose-400">Failed to load run: {error}</div>
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
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Run {run.runId}
                </h1>
                {run.workflowRunUrl && (
                    <a
                        href={run.workflowRunUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-xs text-tremor-content dark:text-dark-tremor-content hover:underline"
                    >
                        Open in Actions →
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
                        <Button size="xs" variant="primary" onClick={reRunAllFailed}>
                            ↻ Re-run all failed
                        </Button>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {failedTests.map(t => (
                            <li key={`${t.id}-${t.project}`} className="group">
                                <div className="flex items-baseline gap-2">
                                    <code className="font-mono text-xs text-rose-500 dark:text-rose-400">{t.id}</code>
                                    <Bold>{t.title}</Bold>
                                    <span className="text-tremor-content dark:text-dark-tremor-content text-xs ml-auto">{t.project}</span>
                                    <Button
                                        size="xs"
                                        variant="light"
                                        onClick={() => reRun(t.id)}
                                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                                    >
                                        ↻ Re-run
                                    </Button>
                                </div>
                                {t.error?.message && (
                                    <pre className="mt-2 text-xs whitespace-pre-wrap text-tremor-content dark:text-dark-tremor-content bg-tremor-background-muted dark:bg-dark-tremor-background-muted p-3 rounded-tremor-default">
                                        {t.error.message}
                                        {t.error.snippet ? `\n\n${t.error.snippet}` : ''}
                                    </pre>
                                )}
                            </li>
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
                                                    className="text-xs text-tremor-brand hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title={`Re-run ${t.id}`}
                                                >
                                                    ↻ Re-run
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
                    <Title>Artifacts</Title>
                    <ul className="mt-3 text-sm space-y-1">
                        {artifacts.map(a => (
                            <li key={a.id}>
                                <a href={a.archive_download_url} className="text-tremor-brand hover:underline">{a.name}</a>
                            </li>
                        ))}
                    </ul>
                    <Text className="mt-3 text-xs">
                        For traces, download the artifact and unzip, then drag the <code className="font-mono">trace.zip</code> into{' '}
                        <a href="https://trace.playwright.dev" target="_blank" rel="noreferrer" className="text-tremor-brand hover:underline">trace.playwright.dev</a>.
                    </Text>
                </Card>
            )}
        </motion.div>
    )
}
