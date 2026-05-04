import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { EnvName } from '@/types'
import { ENVS } from '@/types'

interface EnvCtx {
    env: EnvName
    setEnv: (e: EnvName) => void
}

const Ctx = createContext<EnvCtx | null>(null)

const STORAGE_KEY = 'xt_env'

function readInitial(): EnvName {
    const v = localStorage.getItem(STORAGE_KEY)
    return v && (ENVS as string[]).includes(v) ? (v as EnvName) : 'dev'
}

export function EnvProvider({ children }: { children: ReactNode }) {
    const [env, setEnvState] = useState<EnvName>(readInitial)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, env)
    }, [env])

    return <Ctx.Provider value={{ env, setEnv: setEnvState }}>{children}</Ctx.Provider>
}

export function useEnv(): EnvCtx {
    const v = useContext(Ctx)
    if (!v) throw new Error('useEnv must be inside <EnvProvider>')
    return v
}
