import { octokit } from './github-client'
import { REPO_NAME, REPO_OWNER } from './config'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export const SCHEDULE_CONFIG_PATH = 'schedule-config.json'

export interface EnvSchedule {
    enabled: boolean
    /**
     * Daily fire time as UTC "HH:MM" (any minute — the picker snaps to
     * 10-minute marks in the user's LOCAL time, so the stored UTC value may
     * be off-grid in :30/:45-offset timezones). The dispatcher
     * (scheduled-e2e.yml) ticks on a best-effort 10-minute cron and catches
     * up on anything due since its previous successful tick, so a delayed
     * tick fires the run late rather than skipping it.
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
    const config = JSON.parse(b64DecodeUtf8(data.content.replace(/\n/g, ''))) as ScheduleConfig
    return { config, sha: data.sha }
}

/** atob/btoa are Latin-1 only; route through TextEncoder/Decoder so non-ASCII content round-trips. */
function b64EncodeUtf8(s: string): string {
    let bin = ''
    for (const byte of new TextEncoder().encode(s)) bin += String.fromCharCode(byte)
    return btoa(bin)
}

function b64DecodeUtf8(b64: string): string {
    return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)))
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
        content: b64EncodeUtf8(body),
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

/** Snap "HH:MM" to the nearest 10-minute mark (the picker granularity). */
export function snapToTenMinutes(hhmm: string): string {
    const [h, m] = hhmm.split(':').map(Number)
    const total = (h * 60 + Math.round(m / 10) * 10) % 1440
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
