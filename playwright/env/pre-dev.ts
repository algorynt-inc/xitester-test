import type { EnvConfig } from './index'

const preDev: EnvConfig = {
    name: 'pre-dev',
    // SUT host pattern follows the SPA's config.ts mapping (app-X → api-X).
    // Adjust the URLs below if the actual pre-dev deployment uses a
    // different subdomain (e.g. app-predev / app-pre.ai.xitester.com).
    baseURL: 'https://app-pre-dev.ai.xitester.com',
    apiBase: 'https://api-pre-dev.ai.xitester.com',
    user: {
        email: process.env.XT_USER_EMAIL ?? '',
        password: process.env.XT_USER_PASSWORD ?? '',
    },
    multiOrgUser: null,
    mfaUser: null,
    existingEmail: null,
    allowedRedirectUrl: null,
}

export default preDev
