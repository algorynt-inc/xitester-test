import { config as loadEnv } from 'dotenv'
// Load .env.local from the playwright/ project root if it exists. Existing
// process.env values (e.g. CI's GitHub-Environment secrets, or shell exports)
// take precedence — `override: false` ensures we never replace them.
loadEnv({ path: '.env.local', override: false })

import local from './local'
import dev from './dev'
import stage from './stage'
import qa from './qa'
import prod from './prod'

export interface EnvUser {
    email: string
    password: string
}

export interface EnvConfig {
    name: 'local' | 'dev' | 'stage' | 'qa' | 'prod'
    baseURL: string
    apiBase: string
    user: EnvUser
    /** Optional test accounts. When `null`, dependent test cases are skipped. */
    multiOrgUser: EnvUser | null
    mfaUser: (EnvUser & { totpSecret?: string }) | null
    existingEmail: string | null
    /** A redirect_url that passes `validateRedirectUrl()` for guest-flow tests. */
    allowedRedirectUrl: string | null
}

const ENVS: Record<string, EnvConfig> = { local, dev, stage, qa, prod }

const requested = (process.env.XT_ENV ?? 'local').toLowerCase()
const config = ENVS[requested]

if (!config) {
    const known = Object.keys(ENVS).join(', ')
    throw new Error(`Unknown XT_ENV="${requested}". Choose one of: ${known}.`)
}

export const ENV: EnvConfig = config
