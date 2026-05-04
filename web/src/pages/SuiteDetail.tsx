import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Title, Text, Button } from '@tremor/react'
import { FolderTree, Play, RefreshCw } from 'lucide-react'
import { useEnv } from '@/components/EnvContext'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import StatusPill from '@/components/widgets/StatusPill'
import { latestRunForSuite, loadIndex, loadRun, passRate, suiteFromFile } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun, ResultTest, RunSummary } from '@/types'

export default function SuiteDetail() {
    const { suite } = useParams<{ suite: string }>()
    const navigate = useNavigate()
    const { env } = useEnv()
    const [runs, setRuns] = useState<RunSummary[]>([])
    const [run, setRun] = useState<ResultRun | null>(null)
    const [loadingIndex, setLoadingIndex] = useState(true)
    const [loadingRun, setLoadingRun] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const ctrl = new AbortController()
        loadIndex(ctrl.signal)
            .then(idx => setRuns(idx.runs))
            .catch(err => setError((err as Error).message))
            .finally(() => setLoadingIndex(false))
        return () => ctrl.abort()
    }, [])

    const latest = useMemo(() => (suite ? latestRunForSuite(runs, suite, env) : undefined), [runs, suite, env])

    useEffect(() => {
        if (!latest) {
            setRun(null)
            return
        }
        const ctrl = new AbortController()
        setLoadingRun(true)
        loadRun(latest.runId, ctrl.signal)
            .then(setRun)
            .catch(err => setError((err as Error).message))
            .finally(() => setLoadingRun(false))
        return () => ctrl.abort()
    }, [latest])

    // If we used the "all" fallback, restrict displayed tests to this suite by file.
    const tests: ResultTest[] = useMemo(() => {
        if (!run || !suite) return []
        const fromAll = run.suite === 'all'
        return fromAll ? run.tests.filter(t => suiteFromFile(t.file) === suite) : run.tests
    }, [run, suite])

    const byCategory = useMemo(() => {
        const m = new Map<string, ResultTest[]>()
        for (const t of tests) {
            const key = t.category ?? 'Uncategorised'
            const list = m.get(key) ?? []
            list.push(t)
            m.set(key, list)
        }
        return m
    }, [tests])

    const totals = useMemo(() => {
        const passed = tests.filter(t => t.status === 'passed').length
        const failed = tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length
        const skipped = tests.filter(t => t.status === 'skipped').length
        return { passed, failed, skipped, total: tests.length }
    }, [tests])

    const triggerSuite = (grep?: string) => {
        const params = new URLSearchParams({
            env,
            suite: suite ?? 'all',
        })
        if (grep) params.set('grep', grep)
        navigate(`/trigger?${params.toString()}`)
    }

    if (!suite) return null

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-baseline gap-3 flex-wrap">
                <Link to="/suites" className="text-tremor-brand hover:underline text-sm">← All suites</Link>
                <h1 className="text-2xl font-semibold capitalize text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
                    {suite}
                </h1>
                {latest && <StatusPill status={totals.failed > 0 ? 'failed' : totals.total === 0 ? 'skipped' : 'passed'} />}
                <div className="ml-auto flex gap-2">
                    <Button size="xs" icon={Play} onClick={() => triggerSuite()}>
                        Run suite
                    </Button>
                </div>
            </div>

            <LiveRunsBar />

            {loadingIndex && <Text>Loading…</Text>}
            {error && <p className="text-rose-500 dark:text-rose-400 text-sm">Failed to load: {error}</p>}

            {!loadingIndex && !latest && (
                <Card>
                    <Text>
                        No <strong className="capitalize">{suite}</strong> runs on{' '}
                        <strong>{ENV_LABELS[env]}</strong> yet. Trigger one to populate this view.
                    </Text>
                    <button
                        type="button"
                        onClick={() => triggerSuite()}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-tremor-default bg-tremor-brand text-white text-sm hover:opacity-90 transition-opacity"
                    >
                        <Play className="h-4 w-4" />
                        Run {suite}
                    </button>
                </Card>
            )}

            {latest && run && (
                <>
                    <Card>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <Text>Pass rate</Text>
                                <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {passRate({ total: totals.total, passed: totals.passed })}%
                                </p>
                            </div>
                            <div>
                                <Text>Result</Text>
                                <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {totals.passed}/{totals.total}
                                </p>
                                <Text className="mt-1 text-xs">
                                    {totals.failed} failed · {totals.skipped} skipped
                                </Text>
                            </div>
                            <div>
                                <Text>Last run</Text>
                                <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {formatRelativeTime(latest.finishedAt)}
                                </p>
                                <Text className="mt-1 text-xs">{formatDuration(latest.durationMs)}</Text>
                            </div>
                            <div>
                                <Text>Environment</Text>
                                <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {ENV_LABELS[latest.environment]}
                                </p>
                            </div>
                            <div>
                                <Text>Run</Text>
                                <Link
                                    to={`/runs/${latest.runId}`}
                                    className="text-xl font-mono font-semibold text-tremor-brand hover:underline"
                                >
                                    {shortSha(latest.runId)}
                                </Link>
                                <Text className="mt-1 text-xs">click to drill in</Text>
                            </div>
                        </div>
                    </Card>

                    {loadingRun && <Text>Loading test catalog…</Text>}

                    <Card>
                        <Title>Test cases by category ({tests.length})</Title>
                        <Text className="mt-1 text-xs">
                            Status reflects the latest run in {ENV_LABELS[latest.environment]}. Click any test for its run-by-run history.
                        </Text>
                        <div className="mt-5 space-y-6">
                            {Array.from(byCategory.entries()).map(([category, list]) => {
                                const passed = list.filter(t => t.status === 'passed').length
                                const failed = list.filter(t => t.status === 'failed' || t.status === 'timedOut').length
                                const skipped = list.filter(t => t.status === 'skipped').length
                                const escaped = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                                return (
                                    <div key={category}>
                                        <div className="flex items-center gap-2 pb-2 border-b border-tremor-border dark:border-dark-tremor-border">
                                            <FolderTree className="h-3.5 w-3.5 text-tremor-content dark:text-dark-tremor-content" />
                                            <h3 className="text-sm font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                                {category}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-emerald-600 dark:text-emerald-400">{passed} passed</span>
                                                {failed > 0 && <span className="text-rose-500 dark:text-rose-400">· {failed} failed</span>}
                                                {skipped > 0 && <span className="text-tremor-content dark:text-dark-tremor-content">· {skipped} skipped</span>}
                                            </div>
                                            <Button
                                                size="xs"
                                                variant="light"
                                                icon={RefreshCw}
                                                onClick={() => triggerSuite(escaped)}
                                                className="ml-auto"
                                            >
                                                Run category
                                            </Button>
                                        </div>
                                        <table className="mt-2 w-full text-sm">
                                            <tbody>
                                                {list.map(t => (
                                                    <tr
                                                        key={`${t.id}-${t.project}`}
                                                        className="border-t border-tremor-border dark:border-dark-tremor-border group hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                                                    >
                                                        <td className="py-1.5 pr-4 w-24"><StatusPill status={t.status} /></td>
                                                        <td className="py-1.5 pr-4 w-36 font-mono text-xs">
                                                            <Link to={`/tests/${t.id}`} className="hover:underline">{t.id}</Link>
                                                        </td>
                                                        <td className="py-1.5 pr-4">
                                                            <Link to={`/tests/${t.id}`} className="hover:underline">{t.title}</Link>
                                                        </td>
                                                        <td className="py-1.5 pr-4 w-24 text-tremor-content dark:text-dark-tremor-content text-xs">{t.project}</td>
                                                        <td className="py-1.5 pr-4 w-20 text-right text-xs">{formatDuration(t.durationMs)}</td>
                                                        <td className="py-1.5 pr-2 w-24 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => triggerSuite(t.id)}
                                                                className="inline-flex items-center gap-1 text-xs text-tremor-brand hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title={`Run ${t.id}`}
                                                            >
                                                                <RefreshCw className="h-3 w-3" />
                                                                Run
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                </>
            )}
        </motion.div>
    )
}
