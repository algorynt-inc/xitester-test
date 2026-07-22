import { Card, Title, BarChart } from '@tremor/react'
import type { RunSummary } from '@/types'

export default function TrendChart({ runs }: { runs: RunSummary[] }) {
    const byDay = new Map<string, { total: number; passed: number; failed: number }>()
    for (const r of runs) {
        const day = r.finishedAt.slice(0, 10)
        const entry = byDay.get(day) ?? { total: 0, passed: 0, failed: 0 }
        entry.total += r.stats.total
        entry.passed += r.stats.passed
        entry.failed += r.stats.failed
        byDay.set(day, entry)
    }
    const data = Array.from(byDay.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([day, s]) => ({ date: day, Passed: s.passed, Failed: s.failed }))

    return (
        <Card>
            <Title>Passed vs failed · last 30 days</Title>
            <BarChart
                className="mt-4 h-64"
                data={data}
                index="date"
                categories={['Passed', 'Failed']}
                colors={['emerald', 'rose']}
                stack
                yAxisWidth={40}
                showLegend
                showGridLines
            />
        </Card>
    )
}
