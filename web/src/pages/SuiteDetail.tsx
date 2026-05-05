import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Title, Text, Button } from '@tremor/react'
import { Play, RefreshCw } from 'lucide-react'
import { useEnv } from '@/components/EnvContext'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import StatusPill from '@/components/widgets/StatusPill'
import { latestRunForSuite, loadIndex, loadRun, passRate, suiteFromFile } from '@/lib/results-loader'
import { loadCatalog, type Catalog, type CatalogTest } from '@/lib/catalog-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatDuration, formatRelativeTime, shortSha } from '@/lib/format'
import type { ResultRun, ResultTest, RunSummary, TestStatus } from '@/types'

interface ResolvedTest {
    id: string
    title: string
    project: string
    category: string
    /** Status from the latest run, or null when the test hasn't run yet. */
    status: TestStatus | null
    durationMs: number | null
    /** When known, link to /tests/<id> for history. */
    runResult?: ResultTest
}

export default function SuiteDetail() {
    const { suite } = useParams<{ suite: string }>()
    const navigate = useNavigate()
    const { env } = useEnv()
    const [runs, setRuns] = useState<RunSummary[]>([])
    const [run, setRun] = useState<ResultRun | null>(null)
    const [catalog, setCatalog] = useState<Catalog | null>(null)
    const [loadingIndex, setLoadingIndex] = useState(true)
    const [loadingRun, setLoadingRun] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const ctrl = new AbortController()
        Promise.all([
            loadIndex(ctrl.signal).then(idx => idx.runs).catch(err => {
                setError((err as Error).message)
                return [] as RunSummary[]
            }),
            loadCatalog().catch(() => null),
        ]).then(([rs, cat]) => {
            setRuns(rs)
            setCatalog(cat)
            setLoadingIndex(false)
        })
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

    // The full test surface from the catalog, restricted to this suite.
    const catalogTests: CatalogTest[] = useMemo(() => {
        if (!catalog || !suite) return []
        return catalog.tests.filter(t => t.suite === suite)
    }, [catalog, suite])

    // The latest run's tests for this suite (filtered if the run is "all").
    const runTests: ResultTest[] = useMemo(() => {
        if (!run || !suite) return []
        if (run.suite === 'all') return run.tests.filter(t => suiteFromFile(t.file) === suite)
        return run.tests
    }, [run, suite])

    // Merge: catalog gives the full set; we attach run status when available.
    // If catalog is unavailable, fall back to run-only listing.
    const resolved: ResolvedTest[] = useMemo(() => {
        const runIndex = new Map<string, ResultTest>()
        for (const t of runTests) runIndex.set(`${t.id}::${t.project}`, t)

        if (catalogTests.length > 0) {
            const out: ResolvedTest[] = []
            for (const ct of catalogTests) {
                const projects = ct.projects.length > 0 ? ct.projects : ['']
                for (const project of projects) {
                    const r = runIndex.get(`${ct.id}::${project}`)
                    out.push({
                        id: ct.id,
                        title: ct.title,
                        project,
                        category: ct.category ?? 'Uncategorised',
                        status: r?.status ?? null,
                        durationMs: r?.durationMs ?? null,
                        runResult: r,
                    })
                }
            }
            return out
        }
        return runTests.map<ResolvedTest>(r => ({
            id: r.id,
            title: r.title,
            project: r.project,
            category: r.category ?? 'Uncategorised',
            status: r.status,
            durationMs: r.durationMs,
            runResult: r,
        }))
    }, [catalogTests, runTests])

    const totals = useMemo(() => {
        const passed = resolved.filter(t => t.status === 'passed').length
        const failed = resolved.filter(t => t.status === 'failed' || t.status === 'timedOut').length
        const skipped = resolved.filter(t => t.status === 'skipped').length
        const notRun = resolved.filter(t => t.status === null).length
        return { passed, failed, skipped, notRun, total: resolved.length }
    }, [resolved])

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
                {latest && <StatusPill status={totals.failed > 0 ? 'failed' : totals.notRun === totals.total ? 'skipped' : 'passed'} />}
                <div className="ml-auto flex gap-2">
                    <Button size="xs" icon={Play} onClick={() => triggerSuite()}>
                        Run suite
                    </Button>
                </div>
            </div>

            <LiveRunsBar />

            {loadingIndex && <Text>Loading…</Text>}
            {error && <p className="text-rose-500 dark:text-rose-400 text-sm">Failed to load: {error}</p>}

            <Card>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                        <Text>Tests</Text>
                        <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {resolved.length}
                        </p>
                        <Text className="mt-1 text-xs">
                            {resolved.length === 1 ? '1 test' : `${resolved.length} tests`}
                        </Text>
                    </div>
                    <div>
                        <Text>Latest result</Text>
                        <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {latest ? `${totals.passed}/${totals.passed + totals.failed + totals.skipped}` : '—'}
                        </p>
                        <Text className="mt-1 text-xs">
                            {totals.failed > 0 && <span className="text-rose-500 dark:text-rose-400">{totals.failed} failed </span>}
                            {totals.skipped > 0 && <span>· {totals.skipped} skipped </span>}
                            {totals.notRun > 0 && <span>· {totals.notRun} not run yet</span>}
                        </Text>
                    </div>
                    <div>
                        <Text>Pass rate</Text>
                        <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {latest ? `${passRate({ total: totals.passed + totals.failed + totals.skipped, passed: totals.passed })}%` : '—'}
                        </p>
                    </div>
                    <div>
                        <Text>Last run</Text>
                        <p className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {latest ? formatRelativeTime(latest.finishedAt) : 'never'}
                        </p>
                        {latest && <Text className="mt-1 text-xs">{formatDuration(latest.durationMs)} · {ENV_LABELS[latest.environment]}</Text>}
                    </div>
                    <div>
                        <Text>Run</Text>
                        {latest ? (
                            <Link
                                to={`/runs/${latest.runId}`}
                                className="text-xl font-mono font-semibold text-tremor-brand hover:underline"
                            >
                                {shortSha(latest.runId)}
                            </Link>
                        ) : (
                            <p className="text-xl text-tremor-content-subtle dark:text-dark-tremor-content-subtle">—</p>
                        )}
                    </div>
                </div>
            </Card>

            {loadingRun && <Text>Loading test catalog…</Text>}

            <Card>
                <Title>Test cases ({resolved.length})</Title>
                <div className="scroll-card-body mt-4">
                    <table className="w-full text-sm">
                        <tbody>
                            {resolved.map(t => (
                                                <tr
                                                    key={`${t.id}-${t.project}`}
                                                    className="border-t border-tremor-border dark:border-dark-tremor-border first:border-t-0 group hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                                                >
                                                    <td className="py-1.5 pr-4 w-24">
                                                        {t.status ? (
                                                            <StatusPill status={t.status} />
                                                        ) : (
                                                            <span className="status-pill status-pill-skipped">not run</span>
                                                        )}
                                                    </td>
                                                    <td className="py-1.5 pr-4 w-36 font-mono text-xs">
                                                        <Link to={`/tests/${t.id}`} className="hover:underline">
                                                            {t.id}
                                                        </Link>
                                                    </td>
                                                    <td className="py-1.5 pr-4">
                                                        <Link to={`/tests/${t.id}`} className="hover:underline">
                                                            {t.title}
                                                        </Link>
                                                    </td>
                                                    {t.project && (
                                                        <td className="py-1.5 pr-4 w-24 text-tremor-content dark:text-dark-tremor-content text-xs">
                                                            {t.project}
                                                        </td>
                                                    )}
                                                    <td className="py-1.5 pr-4 w-20 text-right text-xs">
                                                        {t.durationMs !== null ? formatDuration(t.durationMs) : '—'}
                                                    </td>
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
            </Card>
        </motion.div>
    )
}
