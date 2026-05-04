import { promises as fs } from 'node:fs'
import { dirname, basename, extname } from 'node:path'
import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
} from '@playwright/test/reporter'

interface ResultAttachment {
    name: string
    contentType: string
    /**
     * URL of the attachment, relative to the run JSON's location on the
     * `results` branch. e.g. "<runId>/TC-LI-001-0-screenshot.png".
     * The dashboard joins this with rawResultsUrl().
     */
    url: string
}

interface ResultTest {
    id: string
    title: string
    file: string
    project: string
    status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'
    durationMs: number
    retries: number
    error: { message: string; snippet?: string } | null
    attachments: ResultAttachment[]
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

const SAFE_NAME_RE = /[^A-Za-z0-9_-]/g

export default class JsonResultReporter implements Reporter {
    private outputFile: string
    private attachmentsRoot: string
    private startedAt = ''
    private rootSuite?: Suite
    private flakyCount = 0

    constructor(options: { outputFile?: string; attachmentsRoot?: string } = {}) {
        this.outputFile = options.outputFile ?? 'playwright/.results/run.json'
        this.attachmentsRoot = options.attachmentsRoot ?? 'playwright/.results/attachments'
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
        const env = process.env
        // XT_RESULT_RUN_ID is set by the workflow when this is a re-run that
        // should merge into an existing parent run. Falls back to the actual
        // GitHub Actions run id for fresh runs.
        const runId = env.XT_RESULT_RUN_ID || env.GITHUB_RUN_ID || `local-${Date.now()}`
        const actionsRunId = env.GITHUB_RUN_ID || runId

        // Always start fresh — clean any leftover attachments dir from prior runs.
        await fs.rm(this.attachmentsRoot, { recursive: true, force: true })
        await fs.mkdir(`${this.attachmentsRoot}/${runId}`, { recursive: true })

        const tests: ResultTest[] = []
        const visit = async (suite: Suite): Promise<void> => {
            for (const child of suite.suites) await visit(child)
            for (const t of suite.tests) {
                const last = t.results[t.results.length - 1]
                if (!last) continue
                const idMatch = t.title.match(TC_ID_RE)
                const id = idMatch?.[1] ?? t.title.slice(0, 24)
                if (last.status === 'passed' && t.results.length > 1) this.flakyCount++

                // Copy attachments. We keep all for failed/timedOut tests; for passed
                // tests we keep videos (often retained) but skip raw screenshots.
                const isFailure = last.status === 'failed' || last.status === 'timedOut'
                const safeId = id.replace(SAFE_NAME_RE, '_')
                const copied: ResultAttachment[] = []
                for (let i = 0; i < last.attachments.length; i++) {
                    const att = last.attachments[i]
                    if (!att.path) continue
                    const exists = await fs.access(att.path).then(() => true).catch(() => false)
                    if (!exists) continue
                    const isVideo = (att.contentType ?? '').startsWith('video/')
                    if (!isFailure && !isVideo) continue

                    const ext = extname(att.path) || ''
                    const destName = `${safeId}-${i}-${basename(att.name).replace(SAFE_NAME_RE, '_')}${ext}`
                    const dest = `${this.attachmentsRoot}/${runId}/${destName}`
                    try {
                        await fs.copyFile(att.path, dest)
                        copied.push({
                            name: att.name,
                            contentType: att.contentType ?? guessContentType(ext),
                            url: `${runId}/${destName}`,
                        })
                    } catch {
                        // Skip unreadable attachments rather than failing the whole report.
                    }
                }

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
                    attachments: copied,
                })
            }
        }
        if (this.rootSuite) await visit(this.rootSuite)

        const stats = {
            total: tests.length,
            passed: tests.filter(t => t.status === 'passed').length,
            failed: tests.filter(t => t.status === 'failed' || t.status === 'timedOut').length,
            skipped: tests.filter(t => t.status === 'skipped').length,
            flaky: this.flakyCount,
        }

        const run: ResultRun & { actionsRunId?: string } = {
            runId,
            actionsRunId,
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

        const totalAttachments = tests.reduce((s, t) => s + t.attachments.length, 0)
        // eslint-disable-next-line no-console
        console.log(
            `[json-reporter] wrote ${this.outputFile} — ${stats.passed}/${stats.total} passed, ${totalAttachments} attachments, status=${result.status}`,
        )
    }
}

function stripAnsi(s: string): string {
    // eslint-disable-next-line no-control-regex
    return s.replace(/\[[0-9;]*m/g, '')
}

function guessContentType(ext: string): string {
    switch (ext.toLowerCase()) {
        case '.png': return 'image/png'
        case '.jpg':
        case '.jpeg': return 'image/jpeg'
        case '.webm': return 'video/webm'
        case '.mp4': return 'video/mp4'
        case '.zip': return 'application/zip'
        case '.txt': return 'text/plain'
        default: return 'application/octet-stream'
    }
}
