import clsx from 'clsx'
import type { TestStatus } from '@/types'

const LABEL: Record<TestStatus, string> = {
    passed: 'Passed',
    failed: 'Failed',
    skipped: 'Skipped',
    timedOut: 'Timed out',
    interrupted: 'Interrupted',
}

const KIND: Record<TestStatus, string> = {
    passed: 'status-pill-passed',
    failed: 'status-pill-failed',
    skipped: 'status-pill-skipped',
    timedOut: 'status-pill-failed',
    interrupted: 'status-pill-failed',
}

export default function StatusPill({ status }: { status: TestStatus | 'running' }) {
    if (status === 'running') {
        return <span className="status-pill status-pill-running">Running</span>
    }
    return <span className={clsx('status-pill', KIND[status])}>{LABEL[status]}</span>
}
