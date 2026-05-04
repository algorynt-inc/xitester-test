import { GITHUB_OAUTH_CLIENT_ID } from '../config'

const DEVICE_CODE_URL = 'https://github.com/login/device/code'
const TOKEN_URL = 'https://github.com/login/oauth/access_token'

export interface DeviceCode {
    device_code: string
    user_code: string
    verification_uri: string
    expires_in: number
    interval: number
}

export class DeviceFlowError extends Error {
    constructor(message: string, readonly cause?: unknown) {
        super(message)
    }
}

export function isDeviceFlowAvailable(): boolean {
    return Boolean(GITHUB_OAUTH_CLIENT_ID)
}

/**
 * Request a device code. NOTE: GitHub's device-flow endpoints have historically
 * lacked CORS support for browsers. If this throws a TypeError ("Failed to fetch"),
 * the SPA must fall back to the PAT-paste flow.
 */
export async function requestDeviceCode(): Promise<DeviceCode> {
    if (!GITHUB_OAUTH_CLIENT_ID) {
        throw new DeviceFlowError('VITE_GITHUB_CLIENT_ID is not configured')
    }
    const res = await fetch(DEVICE_CODE_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: GITHUB_OAUTH_CLIENT_ID,
            scope: 'repo workflow read:org',
        }),
    }).catch(err => {
        throw new DeviceFlowError(
            'Browser blocked the device-code request (likely CORS). Use the PAT method instead.',
            err,
        )
    })
    if (!res.ok) {
        throw new DeviceFlowError(`Device code request failed: ${res.status}`)
    }
    return (await res.json()) as DeviceCode
}

export interface PollResult {
    status: 'pending' | 'slow_down' | 'success' | 'expired' | 'denied' | 'error'
    accessToken?: string
    intervalMs?: number
    error?: string
}

export async function pollForToken(deviceCode: string): Promise<PollResult> {
    let res: Response
    try {
        res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: GITHUB_OAUTH_CLIENT_ID,
                device_code: deviceCode,
                grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            }),
        })
    } catch (err) {
        return { status: 'error', error: (err as Error).message }
    }
    if (!res.ok) return { status: 'error', error: `HTTP ${res.status}` }
    const data = (await res.json()) as Record<string, string>
    if (data.access_token) return { status: 'success', accessToken: data.access_token }
    if (data.error === 'authorization_pending') return { status: 'pending' }
    if (data.error === 'slow_down') return { status: 'slow_down', intervalMs: 10_000 }
    if (data.error === 'expired_token') return { status: 'expired' }
    if (data.error === 'access_denied') return { status: 'denied' }
    return { status: 'error', error: data.error_description || data.error || 'unknown' }
}
