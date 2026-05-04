import type { EnvConfig } from './index'

const stage: EnvConfig = {
    name: 'stage',
    baseURL: 'https://app-stage.ai.xitester.com',
    apiBase: 'https://api-stage.ai.xitester.com',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default stage
