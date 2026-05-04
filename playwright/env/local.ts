import type { EnvConfig } from './index'

const local: EnvConfig = {
    name: 'local',
    baseURL: process.env.XT_BASE_URL ?? 'http://localhost:5173',
    apiBase: process.env.XT_API_BASE ?? 'http://localhost:8000',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    // Optional accounts — fill in as test data is seeded locally.
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default local
