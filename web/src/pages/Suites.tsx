import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Title, Text } from '@tremor/react'
import { ChevronRight, FolderTree } from 'lucide-react'
import { useEnv } from '@/components/EnvContext'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import StatusPill from '@/components/widgets/StatusPill'
import { latestRunForSuite, loadIndex, passRate } from '@/lib/results-loader'
import { loadCatalog, type Catalog } from '@/lib/catalog-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatRelativeTime } from '@/lib/format'
import type { EnvName, RunSummary } from '@/types'

export default function Suites() {
    const { env } = useEnv()
    const [allRuns, setAllRuns] = useState<RunSummary[]>([])
    const [catalog, setCatalog] = useState<Catalog | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ctrl = new AbortController()
        Promise.all([
            loadIndex(ctrl.signal).then(idx => idx.runs).catch(() => [] as RunSummary[]),
            loadCatalog().catch(() => null),
        ]).then(([runs, cat]) => {
            setAllRuns(runs)
            setCatalog(cat)
            setLoading(false)
        })
        return () => ctrl.abort()
    }, [])

    // Suites are the union of (a) what playwright --list discovered and
    // (b) anything that's appeared in a run. Catalog is the source of truth
    // for "what tests exist"; runs add status/timing.
    const suites = useMemo(() => {
        const set = new Set<string>()
        if (catalog) for (const s of catalog.suites) set.add(s)
        for (const r of allRuns) if (r.suite !== 'all') set.add(r.suite)
        return Array.from(set).sort()
    }, [catalog, allRuns])

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <div className="flex items-baseline justify-between">
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
                    Suites
                </h1>
                <Text>
                    Status reflects latest run on{' '}
                    <strong className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {ENV_LABELS[env]}
                    </strong>
                </Text>
            </div>

            <LiveRunsBar />

            {loading && <Text>Loading suites…</Text>}

            {!loading && suites.length === 0 && (
                <Card>
                    <Text>
                        No suites discovered yet. Either the test catalog hasn't been built or
                        no spec files match Playwright's discovery. Trigger a Pages workflow run
                        to refresh, or trigger a test run from the Trigger page.
                    </Text>
                </Card>
            )}

            {suites.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suites.map((suite, i) => (
                        <motion.div
                            key={suite}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.05 }}
                        >
                            <SuiteCard
                                suite={suite}
                                runs={allRuns}
                                env={env}
                                catalog={catalog}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

function SuiteCard({
    suite,
    runs,
    env,
    catalog,
}: {
    suite: string
    runs: RunSummary[]
    env: EnvName
    catalog: Catalog | null
}) {
    const latest = latestRunForSuite(runs, suite, env)
    const rate = latest ? passRate(latest.stats) : null
    const status =
        !latest
            ? 'skipped'
            : latest.stats.failed > 0
            ? 'failed'
            : latest.stats.total === 0
            ? 'skipped'
            : 'passed'

    const catalogTotal = catalog ? catalog.tests.filter(t => t.suite === suite).length : null
    const catalogCategories = catalog?.categoriesBySuite[suite]?.length ?? null

    return (
        <Link
            to={`/suites/${suite}`}
            className="block rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background p-5 transition-all hover:border-tremor-content/40 hover:shadow-tremor-card group"
        >
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-tremor-default flex items-center justify-center bg-tremor-background-muted dark:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content">
                    <FolderTree className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <Title className="capitalize">{suite}</Title>
                        {latest ? (
                            <StatusPill status={status} />
                        ) : (
                            <span className="status-pill status-pill-skipped">never run</span>
                        )}
                    </div>
                    {catalogTotal !== null && (
                        <Text className="mt-1 text-xs">
                            {catalogTotal} test{catalogTotal === 1 ? '' : 's'}
                            {catalogCategories !== null && ` · ${catalogCategories} categor${catalogCategories === 1 ? 'y' : 'ies'}`}
                        </Text>
                    )}
                    {latest ? (
                        <Text className="mt-2">
                            {latest.stats.passed}/{latest.stats.total} passed
                            {rate !== null ? ` · ${rate}%` : ''} · last run {formatRelativeTime(latest.finishedAt)} on {ENV_LABELS[latest.environment]}
                        </Text>
                    ) : (
                        <Text className="mt-2 text-tremor-content dark:text-dark-tremor-content">
                            No runs in {ENV_LABELS[env]} yet. Click to view the catalog and trigger one.
                        </Text>
                    )}
                    {latest && (latest.stats.failed > 0 || latest.stats.skipped > 0) && (
                        <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className="text-emerald-600 dark:text-emerald-400">{latest.stats.passed} passed</span>
                            {latest.stats.failed > 0 && (
                                <span className="text-rose-500 dark:text-rose-400">{latest.stats.failed} failed</span>
                            )}
                            {latest.stats.skipped > 0 && (
                                <span className="text-tremor-content dark:text-dark-tremor-content">{latest.stats.skipped} skipped</span>
                            )}
                        </div>
                    )}
                </div>
                <ChevronRight className="h-4 w-4 text-tremor-content dark:text-dark-tremor-content opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    )
}
