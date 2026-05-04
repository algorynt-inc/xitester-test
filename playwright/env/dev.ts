import type { EnvConfig } from './index'

const dev: EnvConfig = {
    name: 'dev',
    baseURL: 'https://app-dev.ai.xitester.com',
    // SPA's config.ts (xitester-ai-app/frontend/src/config.ts:105-107) maps
    // app-X → api-X. The actual REST API lives on the `api-` subdomain, NOT
    // the SPA host (which serves index.html for any unknown path).
    apiBase: 'https://api-dev.ai.xitester.com',
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
