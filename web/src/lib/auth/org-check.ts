import { Octokit } from '@octokit/rest'
import { REQUIRED_ORG } from '../config'

export interface VerifyResult {
    ok: boolean
    error?: string
    user?: { login: string; name: string | null; avatar_url: string }
}

export async function verifyTokenAndOrg(token: string): Promise<VerifyResult> {
    const octokit = new Octokit({ auth: token })
    let me: { login: string; name: string | null; avatar_url: string }
    try {
        const { data } = await octokit.users.getAuthenticated()
        me = { login: data.login, name: data.name, avatar_url: data.avatar_url }
    } catch (err) {
        return { ok: false, error: 'Token rejected by GitHub. Check scopes (workflow, repo, read:org).' }
    }

    try {
        const { data } = await octokit.orgs.listForAuthenticatedUser({ per_page: 100 })
        const inOrg = data.some(o => o.login.toLowerCase() === REQUIRED_ORG.toLowerCase())
        if (!inOrg) {
            return {
                ok: false,
                error: `Account is not a public member of "${REQUIRED_ORG}". Make your membership public on GitHub or request access.`,
            }
        }
    } catch {
        return {
            ok: false,
            error: 'Token is missing the read:org scope.',
        }
    }

    return { ok: true, user: me }
}
