import { useEffect, useState } from 'react'
import { getToken, getUser, subscribe, type AuthUser } from './auth-store'

export interface AuthState {
    token: string | null
    user: AuthUser | null
    isAuthed: boolean
}

export function useAuth(): AuthState {
    const [state, setState] = useState<AuthState>(() => snapshot())
    useEffect(() => {
        const unsub = subscribe(() => setState(snapshot()))
        return () => {
            unsub()
        }
    }, [])
    return state
}

function snapshot(): AuthState {
    const token = getToken()
    const user = getUser()
    return { token, user, isAuthed: Boolean(token && user) }
}
