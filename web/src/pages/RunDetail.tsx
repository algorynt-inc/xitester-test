import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Title, Metric, Text, Bold } from '@tremor/react'
import StatusPill from '@/components/widgets/StatusPill'
import { listRunArtifacts } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { loadRun } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun } from '@/types'

export default function RunDetail() {
    const { runId } = useParams<{ runId: string }>()
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

    if (error) return <div className="text-rose-400">Failed to load run: {error}</div>
    if (!run) return <div>Loading…</div>

    const failedTests = run.tests.filter(t => t.status === 'failed' || t.status === 'timedOut')
    const byFile = new Map<string, typeof run.tests>()
    for (const t of run.tests) {
        const list = byFile.get(t.file) ?? []
        list.push(t)
        byFile.set(t.file, list)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-baseline gap-3">
                <Link to="/runs" className="text-tremor-brand hover:underline text-sm">← All runs</Link>
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Run {run.runId}
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <Text>Environment</Text>
                    <Metric className="text-2xl">{ENV_LABELS[run.environment]}</Metric>
                </Card>
                <Card>
                    <Text>Suite</Text>
                    <Metric className="text-2xl capitalize">{run.suite}</Metric>
                </Card>
                <Card>
                    <Text>Result</Text>
                    <Metric className="text-2xl">{run.stats.passed}/{run.stats.total}</Metric>
                    <Text className="mt-1">
                        {run.stats.failed} failed · {run.stats.skipped} skipped · {run.stats.flaky} flaky
                    </Text>
                </Card>
                <Card>
                    <Text>Duration</Text>
                    <Metric className="text-2xl">{formatDuration(run.durationMs)}</Metric>
                    <Text className="mt-1">{formatRelativeTime(run.finishedAt)}</Text>
                </Card>
                <Card>
                    <Text>Commit</Text>
                    <Metric className="text-2xl font-mono">{shortSha(run.commit)}</Metric>
                    {run.workflowRunUrl && (
                        <a href={run.workflowRunUrl} target="_blank" rel="noreferrer" className="text-tremor-brand text-xs hover:underline">
                            View on GitHub →
                        </a>
                    )}
                </Card>
            </div>

            {failedTests.length > 0 && (
                <Card>
                    <Title>Failures ({failedTests.length})</Title>
                    <ul className="mt-4 space-y-4">
                        {failedTests.map(t => (
                            <li key={t.id}>
                                <div className="flex items-baseline gap-2">
                                    <code className="font-mono text-xs text-rose-400">{t.id}</code>
                                    <Bold>{t.title}</Bold>
                                    <span className="text-tremor-content dark:text-dark-tremor-content text-xs ml-auto">{t.project}</span>
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
                                        <tr key={`${t.id}-${t.project}`} className="border-t border-tremor-border dark:border-dark-tremor-border">
                                            <td className="py-1.5 pr-4 w-24"><StatusPill status={t.status} /></td>
                                            <td className="py-1.5 pr-4 w-36 font-mono text-xs">
                                                <Link to={`/tests/${t.id}`} className="hover:underline">{t.id}</Link>
                                            </td>
                                            <td className="py-1.5 pr-4">{t.title}</td>
                                            <td className="py-1.5 pr-4 w-24 text-tremor-content dark:text-dark-tremor-content text-xs">{t.project}</td>
                                            <td className="py-1.5 pr-4 w-20 text-right text-xs">{formatDuration(t.durationMs)}</td>
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
        </div>
    )
}
