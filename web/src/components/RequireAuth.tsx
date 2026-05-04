import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/use-auth'

export default function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthed } = useAuth()
    if (!isAuthed) return <Navigate to="/login" replace />
    return <>{children}</>
}
