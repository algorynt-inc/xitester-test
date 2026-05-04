import { Card, Text, Flex, BadgeDelta } from '@tremor/react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, MinusCircle, Zap } from 'lucide-react'
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

    // Aggregate today's pass/fail/skip/flaky counts from individual run stats.
    const sumStat = (key: 'passed' | 'failed' | 'skipped' | 'flaky') =>
        since24h.reduce((s, r) => s + r.stats[key], 0)
    const passedToday = sumStat('passed')
    const failedToday = sumStat('failed')
    const skippedToday = sumStat('skipped')
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
        <div className="space-y-4">
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

            {since24h.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                >
                    <Card>
                        <Text>Tests in last 24h</Text>
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <CountChip
                                Icon={CheckCircle2}
                                label="Passed"
                                value={passedToday}
                                tone="emerald"
                            />
                            <CountChip
                                Icon={XCircle}
                                label="Failed"
                                value={failedToday}
                                tone="rose"
                            />
                            <CountChip
                                Icon={MinusCircle}
                                label="Skipped"
                                value={skippedToday}
                                tone="slate"
                            />
                            <CountChip
                                Icon={Zap}
                                label="Flaky (7d)"
                                value={flaky}
                                tone="amber"
                            />
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}

function CountChip({
    Icon,
    label,
    value,
    tone,
}: {
    Icon: typeof CheckCircle2
    label: string
    value: number
    tone: 'emerald' | 'rose' | 'slate' | 'amber'
}) {
    const colors: Record<typeof tone, string> = {
        emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
        rose: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
        slate: 'text-slate-600 dark:text-slate-400 bg-slate-500/10',
        amber: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    }
    return (
        <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${colors[tone]}`}>
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <div className="text-xs text-tremor-content dark:text-dark-tremor-content">{label}</div>
                <div className="text-xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    <AnimatedNumber value={value} />
                </div>
            </div>
        </div>
    )
}
