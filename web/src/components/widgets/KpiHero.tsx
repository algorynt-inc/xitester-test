import { Card, Metric, Text, Flex, BadgeDelta } from '@tremor/react'
import { passRate } from '@/lib/results-loader'
import { formatDuration } from '@/lib/format'
import type { RunSummary } from '@/types'

export default function KpiHero({ runs }: { runs: RunSummary[] }) {
    const since24h = runs.filter(r => Date.now() - new Date(r.finishedAt).getTime() < 86_400_000)
    const since7d = runs.filter(r => Date.now() - new Date(r.finishedAt).getTime() < 7 * 86_400_000)

    const aggregate = (rs: RunSummary[]) => {
        const total = rs.reduce((s, r) => s + r.stats.total, 0)
        const passed = rs.reduce((s, r) => s + r.stats.passed, 0)
        return passRate({ total, passed })
    }
    const todayPct = aggregate(since24h)
    const weekPct = aggregate(since7d)
    const delta = todayPct - weekPct
    const meanDuration =
        since24h.length === 0
            ? 0
            : since24h.reduce((s, r) => s + r.durationMs, 0) / since24h.length
    const flaky = since7d.reduce((s, r) => s + r.stats.flaky, 0)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <Flex alignItems="start">
                    <div>
                        <Text>Pass rate · today</Text>
                        <Metric>{Number.isFinite(todayPct) ? `${todayPct}%` : '—'}</Metric>
                    </div>
                    {since24h.length > 0 && since7d.length > 0 && (
                        <BadgeDelta deltaType={delta >= 0 ? 'increase' : 'decrease'}>
                            {delta >= 0 ? '+' : ''}
                            {delta.toFixed(1)}%
                        </BadgeDelta>
                    )}
                </Flex>
                <Text className="mt-2">{since24h.length} run{since24h.length === 1 ? '' : 's'} in last 24h</Text>
            </Card>
            <Card>
                <Text>7-day pass rate</Text>
                <Metric>{Number.isFinite(weekPct) ? `${weekPct}%` : '—'}</Metric>
                <Text className="mt-2">{since7d.length} run{since7d.length === 1 ? '' : 's'}</Text>
            </Card>
            <Card>
                <Text>Mean duration · today</Text>
                <Metric>{since24h.length === 0 ? '—' : formatDuration(meanDuration)}</Metric>
                <Text className="mt-2">across all runs</Text>
            </Card>
            <Card>
                <Text>Flaky tests · 7d</Text>
                <Metric>{flaky}</Metric>
                <Text className="mt-2">retries that flipped</Text>
            </Card>
        </div>
    )
}
