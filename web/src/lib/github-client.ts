import { Octokit } from '@octokit/rest'
import { REPO_NAME, REPO_OWNER, E2E_WORKFLOW_FILE } from './config'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export function octokit(token: string): Octokit {
    return new Octokit({ auth: token })
}

export interface DispatchInputs {
    environment: EnvName
    suite: SuiteName
    browser: BrowserChoice
    grep?: string
    /** Existing dashboard runId to merge into. Empty string for a fresh run. */
    parentRunId?: string
}

export async function dispatchE2E(token: string, inputs: DispatchInputs): Promise<void> {
    await octokit(token).actions.createWorkflowDispatch({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        workflow_id: E2E_WORKFLOW_FILE,
        ref: 'main',
        inputs: {
            environment: inputs.environment,
            suite: inputs.suite,
            browser: inputs.browser,
            grep: inputs.grep ?? '',
            parent_run_id: inputs.parentRunId ?? '',
        },
    })
}

/**
 * Builds a Playwright --grep regex that matches any of the given test IDs
 * (TC-LI-001 etc.). Test IDs appear at the start of test titles, so matching
 * the literal IDs joined with `|` is safe.
 */
export function buildGrepFromTestIds(ids: string[]): string {
    if (ids.length === 0) return ''
    const escaped = ids.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    return `(${escaped.join('|')})`
}

export interface WorkflowRunSummary {
    id: number
    status: 'queued' | 'in_progress' | 'completed' | string
    conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null | string
    html_url: string
    created_at: string
    updated_at: string
    name: string | null
    event: string
}

export async function listRecentWorkflowRuns(
    token: string,
    limit = 20,
): Promise<WorkflowRunSummary[]> {
    const { data } = await octokit(token).actions.listWorkflowRuns({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        workflow_id: E2E_WORKFLOW_FILE,
        per_page: limit,
    })
    return data.workflow_runs.map(r => ({
        id: r.id,
        status: r.status ?? 'unknown',
        conclusion: r.conclusion,
        html_url: r.html_url,
        created_at: r.created_at,
        updated_at: r.updated_at,
        name: r.name ?? null,
        event: r.event,
    }))
}

/**
 * Returns workflow runs that are queued, waiting, or in_progress — i.e. live
 * runs that haven't pushed a JSON to the results branch yet.
 */
export async function listLiveWorkflowRuns(token: string): Promise<WorkflowRunSummary[]> {
    const all = await listRecentWorkflowRuns(token, 20)
    return all.filter(r => r.status !== 'completed')
}

export async function getWorkflowRun(token: string, runId: number): Promise<WorkflowRunSummary> {
    const { data } = await octokit(token).actions.getWorkflowRun({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        run_id: runId,
    })
    return {
        id: data.id,
        status: data.status ?? 'unknown',
        conclusion: data.conclusion,
        html_url: data.html_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        name: data.name ?? null,
        event: data.event,
    }
}

export async function listRunArtifacts(
    token: string,
    runId: number,
): Promise<Array<{ id: number; name: string; size_in_bytes: number; archive_download_url: string }>> {
    const { data } = await octokit(token).actions.listWorkflowRunArtifacts({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        run_id: runId,
    })
    return data.artifacts.map(a => ({
        id: a.id,
        name: a.name,
        size_in_bytes: a.size_in_bytes,
        archive_download_url: a.archive_download_url,
    }))
}
