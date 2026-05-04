import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeCtx {
    mode: ThemeMode
    resolved: 'light' | 'dark'
    setMode: (m: ThemeMode) => void
    toggle: () => void
}

const STORAGE_KEY = 'xt_theme'
const Ctx = createContext<ThemeCtx | null>(null)

function readSystem(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStored(): ThemeMode {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function applyTheme(resolved: 'light' | 'dark'): void {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(readStored)
    const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
        readStored() === 'system' ? readSystem() : (readStored() as 'light' | 'dark'),
    )

    useEffect(() => {
        const target = mode === 'system' ? readSystem() : mode
        setResolved(target)
        applyTheme(target)
        if (mode === 'system') localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, mode)
    }, [mode])

    useEffect(() => {
        if (mode !== 'system') return
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = () => {
            const next = readSystem()
            setResolved(next)
            applyTheme(next)
        }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [mode])

    const setMode = (m: ThemeMode) => setModeState(m)
    const toggle = () => setModeState(resolved === 'dark' ? 'light' : 'dark')

    return <Ctx.Provider value={{ mode, resolved, setMode, toggle }}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeCtx {
    const v = useContext(Ctx)
    if (!v) throw new Error('useTheme must be inside <ThemeProvider>')
    return v
}
