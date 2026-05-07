import type { EnvName } from '@/types'

export const REPO_OWNER = (import.meta.env.VITE_REPO_OWNER as string) || 'algorynt-inc'
export const REPO_NAME = (import.meta.env.VITE_REPO_NAME as string) || 'xitester-test'
export const REPO_FULL = `${REPO_OWNER}/${REPO_NAME}`
export const RESULTS_BRANCH = 'results'
export const E2E_WORKFLOW_FILE = 'e2e.yml'
export const REQUIRED_ORG = (import.meta.env.VITE_REQUIRED_ORG as string) || 'algorynt-inc'
export const GITHUB_OAUTH_CLIENT_ID = (import.meta.env.VITE_GITHUB_CLIENT_ID as string) || ''

export const ENV_LABELS: Record<EnvName, string> = {
    'pre-dev': 'Pre-dev',
    dev: 'Dev',
    stage: 'Stage',
    qa: 'QA',
    // prod: 'Prod',  // disabled — restore alongside EnvName / ENVS in types.ts
}

export const ENV_URLS: Record<EnvName, string> = {
    'pre-dev': 'https://app-pre-dev.ai.xitester.com',
    dev: 'https://app-dev.ai.xitester.com',
    stage: 'https://app-stage.ai.xitester.com',
    qa: 'https://app-qa.ai.xitester.com',
    // prod: 'https://app.ai.xitester.com',  // disabled
}

export function rawResultsUrl(path: string): string {
    return `https://raw.githubusercontent.com/${REPO_FULL}/${RESULTS_BRANCH}/${path}`
}
