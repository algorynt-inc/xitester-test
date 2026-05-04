import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Title } from '@tremor/react'
import { ExternalLink } from 'lucide-react'
import { listLiveWorkflowRuns, type WorkflowRunSummary } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { formatRelativeTime } from '@/lib/format'

const POLL_MS = 10_000

export default function LiveRunsBar() {
    const [runs, setRuns] = useState<WorkflowRunSummary[] | null>(null)

    useEffect(() => {
        const token = getToken()
        if (!token) return
        let stop = false
        const tick = async () => {
            try {
                const live = await listLiveWorkflowRuns(token)
                if (!stop) setRuns(live)
            } catch {
                // silent — token might be expired; the rest of the app will surface it
            }
            if (!stop) setTimeout(tick, POLL_MS)
        }
        tick()
        return () => {
            stop = true
        }
    }, [])

    if (!runs || runs.length === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="border-blue-500/30 bg-blue-500/5">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="live-dot" />
                        <Title>Live · {runs.length} run{runs.length === 1 ? '' : 's'} in progress</Title>
                    </div>
                    <ul className="space-y-2">
                        {runs.map(r => (
                            <li key={r.id} className="flex items-center gap-3 text-sm">
                                <span className="status-pill status-pill-running">{r.status}</span>
                                <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong truncate">
                                    {r.name ?? `Run #${r.id}`}
                                </span>
                                <span className="text-tremor-content dark:text-dark-tremor-content text-xs">
                                    started {formatRelativeTime(r.created_at)}
                                </span>
                                <div className="flex-1" />
                                <Link
                                    to={`/in-flight/${r.id}`}
                                    className="text-tremor-brand text-xs hover:underline"
                                >
                                    Live view →
                                </Link>
                                <a
                                    href={r.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-tremor-content dark:text-dark-tremor-content text-xs hover:underline inline-flex items-center gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Actions
                                </a>
                            </li>
                        ))}
                    </ul>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}
