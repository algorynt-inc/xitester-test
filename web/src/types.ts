export type EnvName = 'dev' | 'stage' | 'qa' | 'prod'
export const ENVS: EnvName[] = ['dev', 'stage', 'qa', 'prod']

export type SuiteName = 'all' | 'login' | 'signup'
export const SUITES: SuiteName[] = ['all', 'login', 'signup']

export type BrowserChoice = 'chromium' | 'mobile-chromium' | 'both'
export const BROWSERS: BrowserChoice[] = ['chromium', 'mobile-chromium', 'both']

export type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'

export interface RunStats {
    total: number
    passed: number
    failed: number
    skipped: number
    flaky: number
}

export interface ResultAttachment {
    name: string
    contentType?: string
    /** Path relative to the run JSON on the results branch, e.g. "<runId>/<file>". */
    url?: string
    /** Legacy: local filesystem path (only set during a local run). */
    path?: string
}

export interface ResultTest {
    id: string
    title: string
    file: string
    project: string
    status: TestStatus
    durationMs: number
    retries: number
    error: { message: string; snippet?: string } | null
    attachments: ResultAttachment[]
}

export interface ResultRun {
    runId: string
    workflowRunUrl: string | null
    commit: string | null
    branch: string | null
    environment: EnvName
    suite: SuiteName
    startedAt: string
    finishedAt: string
    durationMs: number
    stats: RunStats
    tests: ResultTest[]
}

export interface RunSummary {
    runId: string
    workflowRunUrl: string | null
    commit: string | null
    environment: EnvName
    suite: SuiteName
    startedAt: string
    finishedAt: string
    durationMs: number
    stats: RunStats
}

export interface IndexFile {
    runs: RunSummary[]
}
