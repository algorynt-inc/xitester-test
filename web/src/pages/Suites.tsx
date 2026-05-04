import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Title, Text } from '@tremor/react'
import { ChevronRight, FolderTree } from 'lucide-react'
import { useEnv } from '@/components/EnvContext'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import StatusPill from '@/components/widgets/StatusPill'
import { latestRunForSuite, loadIndex, passRate } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import { formatRelativeTime } from '@/lib/format'
import type { RunSummary } from '@/types'

export default function Suites() {
    const { env } = useEnv()
    const [allRuns, setAllRuns] = useState<RunSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ctrl = new AbortController()
        loadIndex(ctrl.signal)
            .then(idx => setAllRuns(idx.runs))
            .finally(() => setLoading(false))
        return () => ctrl.abort()
    }, [])

    // Suites the dashboard knows about — anything that has shown up in a run.
    const suites = useMemo(() => {
        const set = new Set<string>()
        for (const r of allRuns) if (r.suite !== 'all') set.add(r.suite)
        return Array.from(set).sort()
    }, [allRuns])

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
                    Filtered to <strong className="text-tremor-content-strong dark:text-dark-tremor-content-strong">{ENV_LABELS[env]}</strong>
                </Text>
            </div>

            <LiveRunsBar />

            {loading && <Text>Loading suites…</Text>}

            {!loading && suites.length === 0 && (
                <Card>
                    <Text>No suites have run yet on any environment. Trigger a run to populate this list.</Text>
                    <Link
                        to="/trigger"
                        className="mt-3 inline-block text-sm text-tremor-brand hover:underline"
                    >
                        Trigger a run →
                    </Link>
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
                            <SuiteCard suite={suite} runs={allRuns} env={env} />
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
}: {
    suite: string
    runs: RunSummary[]
    env: string
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

    return (
        <Link
            to={`/suites/${suite}`}
            className="block rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background p-5 transition-all hover:border-tremor-content/40 hover:shadow-tremor-card group"
        >
            <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-tremor-default flex items-center justify-center bg-tremor-background-muted dark:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content">
                    <FolderTree className="h-4 w-4" />
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                        <Title className="capitalize">{suite}</Title>
                        {latest && <StatusPill status={status} />}
                    </div>
                    {latest ? (
                        <Text className="mt-1">
                            {latest.stats.passed}/{latest.stats.total} passed{rate !== null ? ` · ${rate}%` : ''} · last run {formatRelativeTime(latest.finishedAt)} on {ENV_LABELS[latest.environment]}
                        </Text>
                    ) : (
                        <Text className="mt-1">No runs in selected environment yet.</Text>
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
