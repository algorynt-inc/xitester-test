import type { EnvConfig } from './index'

const prod: EnvConfig = {
    name: 'prod',
    baseURL: 'https://app.ai.xitester.com',
    apiBase: 'https://app.ai.xitester.com',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default prod
