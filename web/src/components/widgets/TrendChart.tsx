import { Card, Title, AreaChart } from '@tremor/react'
import type { RunSummary } from '@/types'
import { passRate } from '@/lib/results-loader'

export default function TrendChart({ runs }: { runs: RunSummary[] }) {
    const byDay = new Map<string, { total: number; passed: number }>()
    for (const r of runs) {
        const day = r.finishedAt.slice(0, 10)
        const entry = byDay.get(day) ?? { total: 0, passed: 0 }
        entry.total += r.stats.total
        entry.passed += r.stats.passed
        byDay.set(day, entry)
    }
    const data = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([day, s]) => ({ date: day, 'Pass rate %': passRate(s) }))

    return (
        <Card>
            <Title>Pass rate · last 30 days</Title>
            <AreaChart
                className="mt-4 h-64"
                data={data}
                index="date"
                categories={['Pass rate %']}
                colors={['emerald']}
                valueFormatter={(v: number) => `${v}%`}
                yAxisWidth={40}
                showLegend={false}
                showGridLines
            />
        </Card>
    )
}
