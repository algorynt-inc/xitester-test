const TOKEN_KEY = 'xt_gh_token'
const USER_KEY = 'xt_gh_user'

export interface AuthUser {
    login: string
    name: string | null
    avatar_url: string
}

const listeners = new Set<() => void>()

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
    notify()
}

export function getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
}

export function setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    notify()
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    notify()
}

export function subscribe(fn: () => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
}

function notify(): void {
    for (const fn of listeners) fn()
}
