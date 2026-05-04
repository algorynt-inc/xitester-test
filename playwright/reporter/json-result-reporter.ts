import { promises as fs } from 'node:fs'
import { dirname } from 'node:path'
import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
} from '@playwright/test/reporter'

interface ResultTest {
    id: string
    title: string
    file: string
    project: string
    status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'
    durationMs: number
    retries: number
    error: { message: string; snippet?: string } | null
    attachments: Array<{ name: string; path?: string; contentType?: string }>
}

interface ResultRun {
    runId: string
    workflowRunUrl: string | null
    commit: string | null
    branch: string | null
    environment: string
    suite: string
    startedAt: string
    finishedAt: string
    durationMs: number
    stats: { total: number; passed: number; failed: number; skipped: number; flaky: number }
    tests: ResultTest[]
}

const TC_ID_RE = /^(TC-[A-Z]{2,4}-\d{3})\b/
const STATUS_MAP: Record<string, ResultTest['status']> = {
    passed: 'passed',
    failed: 'failed',
    skipped: 'skipped',
    timedOut: 'timedOut',
    interrupted: 'interrupted',
}

export default class JsonResultReporter implements Reporter {
    private outputFile: string
    private startedAt = ''
    private rootSuite?: Suite
    private flakyCount = 0

    constructor(options: { outputFile?: string } = {}) {
        this.outputFile = options.outputFile ?? 'playwright/.results/run.json'
    }

    onBegin(_config: FullConfig, suite: Suite): void {
        this.startedAt = new Date().toISOString()
        this.rootSuite = suite
    }

    onTestEnd(_test: TestCase, _result: TestResult): void {
        // No-op; aggregate in onEnd. Could stream live updates later.
    }

    async onEnd(result: FullResult): Promise<void> {
        const finishedAt = new Date().toISOString()
        const durationMs = Math.max(0, Date.parse(finishedAt) - Date.parse(this.startedAt))

        const tests: ResultTest[] = []
        const visit = (suite: Suite): void => {
            for (const child of suite.suites) visit(child)
            for (const t of suite.tests) {
                const last = t.results[t.results.length - 1]
                if (!last) continue
                const idMatch = t.title.match(TC_ID_RE)
                const id = idMatch?.[1] ?? t.title.slice(0, 24)
                if (last.status === 'passed' && t.results.length > 1) this.flakyCount++

                tests.push({
                    id,
                    title: t.title,
                    file: t.location?.file?.replace(/^.*\/playwright\//, 'playwright/') ?? '',
                    project: (t.parent as Suite | undefined)?.project()?.name ?? '',
                    status: STATUS_MAP[last.status] ?? 'failed',
                    durationMs: last.duration,
                    retries: t.results.length - 1,
                    error: last.error
                        ? {
                                message: stripAnsi(last.error.message ?? ''),
                                snippet: last.error.snippet ? stripAnsi(last.error.snippet) : undefined,
                            }
                        : null,
                    attachments: last.attachments.map(a => ({
                        name: a.name,
                        path: a.path,
                        contentType: a.contentType,
                    })),
                })
            }
        }
        if (this.rootSuite) visit(this.rootSuite)

        const stats = {
            total: tests.length,
            passed: tests.filter(t => t.status === 'passed').length,
            failed: tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length,
            skipped: tests.filter(t => t.status === 'skipped').length,
            flaky: this.flakyCount,
        }

        const env = process.env

        const run: ResultRun = {
            runId: env.GITHUB_RUN_ID ?? `local-${Date.now()}`,
            workflowRunUrl:
                env.GITHUB_RUN_ID && env.GITHUB_REPOSITORY
                    ? `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
                    : null,
            commit: env.GITHUB_SHA ?? null,
            branch: env.GITHUB_REF_NAME ?? null,
            environment: env.XT_ENV ?? 'local',
            suite: env.XT_SUITE ?? 'all',
            startedAt: this.startedAt,
            finishedAt,
            durationMs,
            stats,
            tests,
        }

        await fs.mkdir(dirname(this.outputFile), { recursive: true })
        await fs.writeFile(this.outputFile, JSON.stringify(run, null, 2), 'utf8')

        const verdict = result.status
        // eslint-disable-next-line no-console
        console.log(`[json-reporter] wrote ${this.outputFile} — ${stats.passed}/${stats.total} passed (${verdict})`)
    }
}

function stripAnsi(s: string): string {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\[[0-9;]*m/g, '')
}
