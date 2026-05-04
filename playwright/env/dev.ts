import type { EnvConfig } from './index'

const dev: EnvConfig = {
    name: 'dev',
    baseURL: 'https://app-dev.ai.xitester.com',
    apiBase: 'https://app-dev.ai.xitester.com',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default dev
