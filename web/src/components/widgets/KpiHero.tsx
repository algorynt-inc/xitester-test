import { Card, Text, Flex, BadgeDelta } from '@tremor/react'
import { motion } from 'framer-motion'
import { passRate } from '@/lib/results-loader'
import { formatDuration } from '@/lib/format'
import type { RunSummary } from '@/types'
import AnimatedNumber from './AnimatedNumber'

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

    const cards: Array<{ label: string; value: React.ReactNode; sub: string; badge?: React.ReactNode }> = [
        {
            label: 'Pass rate · today',
            value: since24h.length > 0 ? <AnimatedNumber value={todayPct} decimals={1} suffix="%" /> : '—',
            sub: `${since24h.length} run${since24h.length === 1 ? '' : 's'} in last 24h`,
            badge:
                since24h.length > 0 && since7d.length > 0 ? (
                    <BadgeDelta deltaType={delta >= 0 ? 'increase' : 'decrease'}>
                        {delta >= 0 ? '+' : ''}
                        {delta.toFixed(1)}%
                    </BadgeDelta>
                ) : null,
        },
        {
            label: '7-day pass rate',
            value: since7d.length > 0 ? <AnimatedNumber value={weekPct} decimals={1} suffix="%" /> : '—',
            sub: `${since7d.length} run${since7d.length === 1 ? '' : 's'}`,
        },
        {
            label: 'Mean duration · today',
            value: since24h.length === 0 ? '—' : formatDuration(meanDuration),
            sub: 'across all runs',
        },
        {
            label: 'Flaky · 7d',
            value: <AnimatedNumber value={flaky} />,
            sub: 'retries that flipped',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map((c, i) => (
                <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="lift"
                >
                    <Card>
                        <Flex alignItems="start">
                            <div>
                                <Text>{c.label}</Text>
                                <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    {c.value}
                                </p>
                            </div>
                            {c.badge}
                        </Flex>
                        <Text className="mt-2">{c.sub}</Text>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
