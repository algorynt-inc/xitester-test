import type { EnvConfig } from './index'

const qa: EnvConfig = {
    name: 'qa',
    baseURL: 'https://app-qa.ai.xitester.com',
    apiBase: 'https://api-qa.ai.xitester.com',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default qa
