import { useEffect, useState } from 'react'
import { Text } from '@tremor/react'
import KpiHero from '@/components/widgets/KpiHero'
import EnvStatusGrid from '@/components/widgets/EnvStatusGrid'
import TrendChart from '@/components/widgets/TrendChart'
import RunsList from '@/components/widgets/RunsList'
import FailureFeed from '@/components/widgets/FailureFeed'
import { useEnv } from '@/components/EnvContext'
import { filterRuns, loadIndex } from '@/lib/results-loader'
import type { RunSummary } from '@/types'

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

    return (
        <div className="space-y-6">
            <div className="flex items-baseline justify-between">
                <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Overview
                </h1>
                <Text>Filtered to <strong>{env}</strong>.</Text>
            </div>

            {error && <p className="text-rose-400 text-sm">Failed to load results: {error}</p>}
            {loading && <Text>Loading results…</Text>}

            <KpiHero runs={envRuns} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart runs={envRuns} />
                <EnvStatusGrid runs={allRuns} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RunsList runs={envRuns.slice(0, 10)} />
                <FailureFeed runs={envRuns} />
            </div>
        </div>
    )
}
