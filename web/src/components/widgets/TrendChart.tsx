import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Card, Title, BarChart } from '@tremor/react'
import type { CustomTooltipProps } from '@tremor/react'
import { formatDateTimeIST } from '@/lib/format'
import type { RunSummary } from '@/types'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const VISIBLE_BARS = 15

// Round up to the nearest 1 / 2 / 2.5 / 5 × 10ⁿ so the axis ends on a clean number.
function niceCeil(v: number): number {
    if (v <= 0) return 10
    const base = Math.pow(10, Math.floor(Math.log10(v)))
    for (const m of [1, 2, 2.5, 5, 10]) {
        if (v <= m * base) return m * base
    }
    return 10 * base
}

export default function TrendChart({ runs }: { runs: RunSummary[] }) {
    const cutoff = Date.now() - THIRTY_DAYS_MS
    const data = [...runs]
        .filter(r => new Date(r.finishedAt).getTime() >= cutoff) // last 30 days
        .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt)) // oldest → newest, left → right
        .map(r => ({
            runId: r.runId, // unique index — not shown, x-axis is hidden
            iso: r.finishedAt, // full timestamp, read by the custom tooltip
            Passed: r.stats.passed,
            Failed: r.stats.failed,
        }))

    // Forced value-domain shared by both charts so the fixed axis lines up with the scrolling gridlines.
    const yMax = niceCeil(Math.max(0, ...data.map(d => d.Passed + d.Failed)))

    // Measure the scroll viewport so exactly VISIBLE_BARS fit; wider datasets overflow and scroll.
    const scrollRef = useRef<HTMLDivElement>(null)
    const [viewportW, setViewportW] = useState(0)
    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const ro = new ResizeObserver(entries => {
            const w = entries[0]?.contentRect.width ?? 0
            if (w > 0) setViewportW(w)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const perBar = viewportW / VISIBLE_BARS
    const contentWidth = Math.max(viewportW, perBar * data.length)

    // Pin the initial view to the right (newest) once sizes are known.
    useLayoutEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [contentWidth, data.length])

    return (
        <Card>
            <div className="flex items-center justify-between">
                <Title>Passed vs failed · last 30 days</Title>
                <div className="flex items-center gap-4 text-sm text-tremor-content dark:text-dark-tremor-content">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Passed
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Failed
                    </span>
                </div>
            </div>

            <div className="mt-4 flex">
                {/* Fixed Y-axis — a bar-less chart sharing the same forced domain */}
                <BarChart
                    className="h-64 w-[48px] shrink-0"
                    data={data}
                    index="runId"
                    categories={[]}
                    minValue={0}
                    maxValue={yMax}
                    autoMinValue={false}
                    showYAxis
                    showXAxis={false}
                    showLegend={false}
                    showGridLines={false}
                    showTooltip={false}
                    yAxisWidth={40}
                />

                {/* Scrollable bars */}
                <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-auto">
                    <div style={{ width: contentWidth || '100%' }}>
                        <BarChart
                            className="h-64"
                            data={data}
                            index="runId"
                            categories={['Passed', 'Failed']}
                            colors={['emerald', 'rose']}
                            stack
                            minValue={0}
                            maxValue={yMax}
                            autoMinValue={false}
                            showYAxis={false}
                            showXAxis={false}
                            showLegend={false}
                            showGridLines
                            yAxisWidth={0}
                            barCategoryGap="20%"
                            customTooltip={TrendTooltip}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

function TrendTooltip({ active, payload }: CustomTooltipProps) {
    if (!active || !payload?.length) return null
    const iso = payload[0].payload.iso as string
    return (
        <div className="rounded-tremor-default border border-tremor-border bg-tremor-background text-sm shadow-tremor-dropdown dark:border-dark-tremor-border dark:bg-dark-tremor-background">
            <div className="border-b border-tremor-border px-3 py-2 dark:border-dark-tremor-border">
                <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {formatDateTimeIST(iso)}
                </p>
            </div>
            <div className="space-y-1 px-3 py-2">
                {payload.map(item => (
                    <div key={item.dataKey} className="flex items-center justify-between gap-6">
                        <span className="flex items-center gap-1.5 text-tremor-content dark:text-dark-tremor-content">
                            <span className={`h-2 w-2 rounded-full ${item.dataKey === 'Passed' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {item.name}
                        </span>
                        <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
