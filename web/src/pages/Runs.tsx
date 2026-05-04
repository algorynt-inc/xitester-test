import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, Select, SelectItem, Text } from '@tremor/react'
import RunsList from '@/components/widgets/RunsList'
import LiveRunsBar from '@/components/widgets/LiveRunsBar'
import { useEnv } from '@/components/EnvContext'
import { filterRuns, loadIndex } from '@/lib/results-loader'
import { ENVS, SUITES } from '@/types'
import type { RunSummary } from '@/types'

export default function Runs() {
    const { env } = useEnv()
    const [allRuns, setAllRuns] = useState<RunSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [params, setParams] = useSearchParams()

    const suite = params.get('suite') ?? 'all'
    const envFilter = params.get('env') ?? env

    useEffect(() => {
        const ctrl = new AbortController()
        setLoading(true)
        loadIndex(ctrl.signal)
            .then(idx => setAllRuns(idx.runs))
            .finally(() => setLoading(false))
        return () => ctrl.abort()
    }, [])

    const filtered = useMemo(
        () => filterRuns(allRuns, { environment: envFilter, suite }),
        [allRuns, envFilter, suite],
    )

    const update = (key: string, value: string) => {
        const next = new URLSearchParams(params)
        if (!value || value === 'all') next.delete(key)
        else next.set(key, value)
        setParams(next, { replace: true })
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">All runs</h1>

            <LiveRunsBar />

            <Card>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <Text>Environment</Text>
                        <Select value={envFilter} onValueChange={v => update('env', v)} className="mt-1 w-40">
                            <SelectItem value="all">All</SelectItem>
                            {ENVS.map(e => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Text>Suite</Text>
                        <Select value={suite} onValueChange={v => update('suite', v)} className="mt-1 w-40">
                            {SUITES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="ml-auto">
                        <Text>{filtered.length} run{filtered.length === 1 ? '' : 's'}</Text>
                    </div>
                </div>
            </Card>

            {loading && <Text>Loading…</Text>}
            <RunsList runs={filtered} title="" />
        </div>
    )
}
