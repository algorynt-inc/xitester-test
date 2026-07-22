import { octokit } from './github-client'
import { REPO_NAME, REPO_OWNER } from './config'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export const SCHEDULE_CONFIG_PATH = 'schedule-config.json'

export interface EnvSchedule {
    enabled: boolean
    /**
     * Daily fire time as UTC "HH:MM", snapped to :00 / :30 — the dispatcher
     * workflow (scheduled-e2e.yml) polls in 30-minute slots.
     */
    utcTime: string
    suite: SuiteName
    browser: BrowserChoice
}

export interface ScheduleConfig {
    $comment?: string
    schedules: Record<EnvName, EnvSchedule>
}

export interface LoadedScheduleConfig {
    config: ScheduleConfig
    /** Blob SHA required to commit an update without clobbering concurrent edits. */
    sha: string
}

export async function loadScheduleConfig(token: string): Promise<LoadedScheduleConfig> {
    const { data } = await octokit(token).repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: SCHEDULE_CONFIG_PATH,
        ref: 'main',
        // Defeat the API's ETag cache so a just-saved config reads back fresh.
        headers: { 'If-None-Match': '' },
    })
    if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
        throw new Error(`${SCHEDULE_CONFIG_PATH} is not a file on main`)
    }
    const config = JSON.parse(atob(data.content.replace(/\n/g, ''))) as ScheduleConfig
    return { config, sha: data.sha }
}

export async function saveScheduleConfig(
    token: string,
    config: ScheduleConfig,
    sha: string,
): Promise<void> {
    const body = JSON.stringify(config, null, 4) + '\n'
    await octokit(token).repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: SCHEDULE_CONFIG_PATH,
        branch: 'main',
        message: 'chore: update E2E schedule config from dashboard',
        content: btoa(body),
        sha,
    })
}

/** "HH:MM" UTC → "HH:MM" in the browser's local timezone (daily schedule, so day rollover is irrelevant). */
export function utcToLocalHHMM(utc: string): string {
    const [h, m] = utc.split(':').map(Number)
    const d = new Date()
    d.setUTCHours(h, m, 0, 0)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** "HH:MM" local → "HH:MM" UTC. */
export function localToUtcHHMM(local: string): string {
    const [h, m] = local.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

/** Snap "HH:MM" to the nearest :00 / :30 slot the dispatcher can hit. */
export function snapToHalfHour(hhmm: string): string {
    const [h, m] = hhmm.split(':').map(Number)
    if (m < 15) return `${String(h).padStart(2, '0')}:00`
    if (m < 45) return `${String(h).padStart(2, '0')}:30`
    return `${String((h + 1) % 24).padStart(2, '0')}:00`
}
