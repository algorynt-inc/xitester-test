import { Octokit } from '@octokit/rest'
import { REQUIRED_ORG } from '../config'

export interface VerifyResult {
    ok: boolean
    error?: string
    user?: { login: string; name: string | null; avatar_url: string }
}

interface OctokitErr {
    status?: number
    response?: { headers?: Record<string, string> }
}

export async function verifyTokenAndOrg(token: string): Promise<VerifyResult> {
    const octokit = new Octokit({ auth: token })

    let me: { login: string; name: string | null; avatar_url: string }
    let scopes: string[] = []
    try {
        const res = await octokit.users.getAuthenticated()
        me = { login: res.data.login, name: res.data.name, avatar_url: res.data.avatar_url }
        const headerScopes = (res.headers['x-oauth-scopes'] as string | undefined) ?? ''
        scopes = headerScopes.split(',').map(s => s.trim()).filter(Boolean)
    } catch {
        return {
            ok: false,
            error: 'Token rejected by GitHub. The token is invalid, revoked, or lacks the basic scopes.',
        }
    }

    // Use the membership endpoint — works for private members, distinguishes 404/302/200.
    try {
        await octokit.request('GET /user/memberships/orgs/{org}', { org: REQUIRED_ORG })
        return { ok: true, user: me }
    } catch (err) {
        const e = err as OctokitErr
        if (e.status === 404) {
            return {
                ok: false,
                error: `Your account (${me.login}) is not a member of "${REQUIRED_ORG}". Ask an admin to invite you.`,
            }
        }
        if (e.status === 403) {
            // SAML/SSO enforcement — header tells us which org needs auth.
            const ssoHeader = e.response?.headers?.['x-github-sso']
            if (ssoHeader && /required/.test(ssoHeader)) {
                const m = ssoHeader.match(/url=([^;,\s]+)/)
                const url = m?.[1] ?? `https://github.com/orgs/${REQUIRED_ORG}/sso`
                return {
                    ok: false,
                    error: `Token must be SSO-authorized for "${REQUIRED_ORG}". Open ${url} and click "Authorize".`,
                }
            }
            const hasReadOrg = scopes.some(s => s === 'read:org' || s === 'admin:org' || s === 'write:org')
            if (!hasReadOrg) {
                return {
                    ok: false,
                    error: `Token is missing the "read:org" scope (current scopes: ${scopes.join(', ') || 'none'}). Regenerate the PAT and check the read:org box.`,
                }
            }
            return {
                ok: false,
                error: `GitHub denied org access (403). If "${REQUIRED_ORG}" uses SAML SSO, authorize the token at https://github.com/orgs/${REQUIRED_ORG}/sso first.`,
            }
        }
        return {
            ok: false,
            error: `Org membership check failed (${e.status ?? 'unknown'}). Verify your PAT has read:org and is SSO-authorized for "${REQUIRED_ORG}".`,
        }
    }
}
