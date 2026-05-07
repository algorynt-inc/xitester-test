// Production env temporarily disabled. Tests should not run against production
// without an explicit decision and a sandboxed test account. Restore by
// uncommenting the export below + the corresponding import in env/index.ts
// + the 'prod' entry in EnvConfig.name + the workflow's environment choice list.
//
// import type { EnvConfig } from './index'
//
// const prod: EnvConfig = {
//     name: 'prod',
//     baseURL: 'https://app.ai.xitester.com',
//     apiBase: 'https://api.ai.xitester.com',
//     user: {
//         email: process.env.XT_USER_EMAIL ?? '',
//         password: process.env.XT_USER_PASSWORD ?? '',
//     },
//     multiOrgUser: null,
//     mfaUser: null,
//     existingEmail: null,
//     allowedRedirectUrl: null,
// }
//
// export default prod

export {}
