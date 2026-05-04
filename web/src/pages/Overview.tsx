import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, Text } from '@tremor/react'
import { Sparkles, Play } from 'lucide-react'
import KpiHero from '@/components/widgets/KpiHero'
import EnvStatusGrid from '@/components/widgets/EnvStatusGrid'
import TrendChart from '@/components/widgets/TrendChart'
import RunsList from '@/components/widgets/RunsList'
import FailureFeed from '@/components/widgets/FailureFeed'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import { useEnv } from '@/components/EnvContext'
import { filterRuns, loadIndex } from '@/lib/results-loader'
import { ENV_LABELS } from '@/lib/config'
import type { RunSummary } from '@/types'

const stagger = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
}

export default function Overview() {
    const { env } = useEnv()
    const [allRuns, setAllRuns] = useState<RunSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const ctrl = new AbortController()
        setLoading(true)
        loadIndex(ctrl.signal)
            .then(idx => setAllRuns(idx.runs))
            .catch(err => {
                if (err.name !== 'AbortError') setError((err as Error).message)
            })
            .finally(() => setLoading(false))
        return () => ctrl.abort()
    }, [])

    const envRuns = filterRuns(allRuns, { environment: env })

    if (!loading && allRuns.length === 0 && !error) {
        return (
            <div className="space-y-6">
                <LiveRunsBar />
                <EmptyState envLabel={ENV_LABELS[env]} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline justify-between"
            >
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong tracking-tight">
                    Overview
                </h1>
                <Text>
                    Filtered to <strong className="text-tremor-content-strong dark:text-dark-tremor-content-strong">{ENV_LABELS[env]}</strong>
                </Text>
            </motion.div>

            {error && <p className="text-rose-500 dark:text-rose-400 text-sm">Failed to load results: {error}</p>}
            {loading && <Text>Loading results…</Text>}

            <LiveRunsBar />

            <KpiHero runs={envRuns} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.05 }} className="lift">
                    <TrendChart runs={envRuns} />
                </motion.div>
                <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.1 }} className="lift">
                    <EnvStatusGrid runs={allRuns} />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.15 }} className="lift">
                    <RunsList runs={envRuns.slice(0, 10)} />
                </motion.div>
                <motion.div {...stagger} transition={{ duration: 0.3, delay: 0.2 }} className="lift">
                    <FailureFeed runs={envRuns} />
                </motion.div>
            </div>
        </div>
    )
}

function EmptyState({ envLabel }: { envLabel: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center py-16"
        >
            <Card className="max-w-lg text-center">
                <motion.div
                    animate={{ rotate: [0, 12, -12, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5 }}
                    className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-3"
                >
                    <Sparkles className="h-6 w-6" />
                </motion.div>
                <h2 className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    No runs yet
                </h2>
                <Text className="mt-2">
                    Trigger your first run on <strong>{envLabel}</strong> to populate this dashboard. Results land within ~5s of completion.
                </Text>
                <Link
                    to="/trigger"
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-tremor-default bg-tremor-brand text-white hover:opacity-90 transition-opacity"
                >
                    <Play className="h-4 w-4" />
                    Trigger a run
                </Link>
            </Card>
        </motion.div>
    )
}
