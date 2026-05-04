import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, KeyRound, ArrowLeft, Loader2 } from 'lucide-react'
import { Button, TextInput } from '@tremor/react'
import { setToken, setUser } from '@/lib/auth/auth-store'
import { useAuth } from '@/lib/auth/use-auth'
import { verifyTokenAndOrg } from '@/lib/auth/org-check'
import {
    isDeviceFlowAvailable,
    pollForToken,
    requestDeviceCode,
    type DeviceCode,
} from '@/lib/auth/device-flow'
import { REQUIRED_ORG } from '@/lib/config'
import ThemeToggle from '@/components/ThemeToggle'

type Mode = 'choose' | 'device' | 'pat'

export default function Login() {
    const { isAuthed } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState<Mode>('choose')
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (isAuthed) navigate('/', { replace: true })
    }, [isAuthed, navigate])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-tremor-background via-tremor-background to-tremor-background-muted dark:from-dark-tremor-background dark:via-dark-tremor-background dark:to-dark-tremor-background-muted px-4">
            {/* Animated gradient orbs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/15 dark:bg-emerald-500/15 blur-3xl"
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-lime-400/15 dark:bg-lime-500/10 blur-3xl"
                    animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>

            <div className="relative flex-1 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-2xl border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background shadow-xl shadow-black/5 dark:shadow-black/40 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-block h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 shadow-md" />
                            <div>
                                <h1 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                    XiTester · Tests
                                </h1>
                                <p className="text-xs text-tremor-content dark:text-dark-tremor-content">
                                    Sign in with GitHub · org{' '}
                                    <code className="font-mono text-[11px]">{REQUIRED_ORG}</code>
                                </p>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mb-4"
                                >
                                    <div className="rounded-tremor-default bg-rose-500/10 text-rose-500 dark:text-rose-400 px-3 py-2 text-sm">
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {mode === 'choose' && (
                                <motion.div
                                    key="choose"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.18 }}
                                    className="space-y-3"
                                >
                                    {isDeviceFlowAvailable() && (
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() => setMode('device')}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-tremor-default bg-tremor-content-strong dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                                        >
                                            <Github className="h-4 w-4" />
                                            Sign in with GitHub
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => setMode('pat')}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border text-tremor-content-strong dark:text-dark-tremor-content-strong hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted transition-colors"
                                    >
                                        <KeyRound className="h-4 w-4" />
                                        Use Personal Access Token
                                    </button>
                                    <p className="text-xs text-tremor-content dark:text-dark-tremor-content text-center pt-2">
                                        Device Flow may be blocked by browser CORS — use PAT if it fails.
                                    </p>
                                </motion.div>
                            )}

                            {mode === 'device' && (
                                <motion.div
                                    key="device"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <DeviceFlowPanel
                                        onCancel={() => setMode('choose')}
                                        onError={msg => {
                                            setError(msg)
                                            setMode('pat')
                                        }}
                                        onSuccess={async token => {
                                            setBusy(true)
                                            const v = await verifyTokenAndOrg(token)
                                            setBusy(false)
                                            if (!v.ok) {
                                                setError(v.error ?? 'Verification failed')
                                                setMode('choose')
                                                return
                                            }
                                            setToken(token)
                                            setUser(v.user!)
                                            navigate('/', { replace: true })
                                        }}
                                    />
                                </motion.div>
                            )}

                            {mode === 'pat' && (
                                <motion.div
                                    key="pat"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <PatPanel
                                        busy={busy}
                                        onCancel={() => {
                                            setError(null)
                                            setMode('choose')
                                        }}
                                        onSubmit={async pat => {
                                            setError(null)
                                            setBusy(true)
                                            const v = await verifyTokenAndOrg(pat)
                                            setBusy(false)
                                            if (!v.ok) {
                                                setError(v.error ?? 'Verification failed')
                                                return
                                            }
                                            setToken(pat)
                                            setUser(v.user!)
                                            navigate('/', { replace: true })
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="mt-4 text-center text-xs text-tremor-content dark:text-dark-tremor-content">
                        Required scopes: <code className="font-mono">repo</code>,{' '}
                        <code className="font-mono">workflow</code>,{' '}
                        <code className="font-mono">read:org</code>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

function DeviceFlowPanel({
    onCancel,
    onSuccess,
    onError,
}: {
    onCancel: () => void
    onSuccess: (token: string) => void
    onError: (msg: string) => void
}) {
    const [code, setCode] = useState<DeviceCode | null>(null)
    const [phase, setPhase] = useState<'requesting' | 'awaiting' | 'done'>('requesting')

    useEffect(() => {
        let stop = false
        ;(async () => {
            try {
                const c = await requestDeviceCode()
                if (stop) return
                setCode(c)
                setPhase('awaiting')
                let interval = c.interval * 1000 || 5000
                const deadline = Date.now() + c.expires_in * 1000
                while (!stop && Date.now() < deadline) {
                    await new Promise(r => setTimeout(r, interval))
                    if (stop) return
                    const r = await pollForToken(c.device_code)
                    if (r.status === 'success' && r.accessToken) {
                        setPhase('done')
                        onSuccess(r.accessToken)
                        return
                    }
                    if (r.status === 'denied') {
                        onError('Authorization denied on GitHub.')
                        return
                    }
                    if (r.status === 'expired') {
                        onError('Device code expired. Try again.')
                        return
                    }
                    if (r.status === 'slow_down') interval = r.intervalMs ?? interval + 5000
                }
            } catch (err) {
                onError((err as Error).message)
            }
        })()
        return () => {
            stop = true
        }
    }, [onError, onSuccess])

    return (
        <div className="space-y-3">
            {phase === 'requesting' && (
                <div className="flex items-center gap-2 text-sm text-tremor-content dark:text-dark-tremor-content">
                    <Loader2 className="h-4 w-4 animate-spin" /> Requesting device code…
                </div>
            )}
            {phase === 'awaiting' && code && (
                <>
                    <p className="text-sm text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        1. Open the GitHub authorization page
                    </p>
                    <a
                        href={code.verification_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-tremor-brand dark:text-dark-tremor-brand underline text-sm break-all"
                    >
                        {code.verification_uri}
                    </a>
                    <p className="text-sm text-tremor-content-strong dark:text-dark-tremor-content-strong">2. Enter this code:</p>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-3xl font-mono tracking-widest text-tremor-content-strong dark:text-dark-tremor-content-strong text-center py-3 border border-tremor-border dark:border-dark-tremor-border rounded-tremor-default bg-tremor-background-muted dark:bg-dark-tremor-background-muted"
                    >
                        {code.user_code}
                    </motion.div>
                    <p className="text-xs text-tremor-content dark:text-dark-tremor-content">
                        Polling every {code.interval}s. Expires in {Math.floor(code.expires_in / 60)} minutes.
                    </p>
                </>
            )}
            <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 text-sm text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong transition-colors"
            >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
        </div>
    )
}

function PatPanel({
    busy,
    onSubmit,
    onCancel,
}: {
    busy: boolean
    onSubmit: (pat: string) => void
    onCancel: () => void
}) {
    const [value, setValue] = useState('')
    return (
        <form
            className="space-y-3"
            onSubmit={e => {
                e.preventDefault()
                if (value.trim()) onSubmit(value.trim())
            }}
        >
            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                Generate a <strong>classic</strong> PAT with scopes:{' '}
                <code className="font-mono text-xs">repo</code>,{' '}
                <code className="font-mono text-xs">workflow</code>,{' '}
                <code className="font-mono text-xs">read:org</code>.
            </p>
            <a
                href="https://github.com/settings/tokens/new?scopes=repo,workflow,read:org&description=xitester-test%20dashboard"
                target="_blank"
                rel="noreferrer"
                className="block text-tremor-brand dark:text-dark-tremor-brand underline text-sm"
            >
                Generate a token →
            </a>
            <TextInput
                placeholder="ghp_… or github_pat_…"
                type="password"
                value={value}
                onValueChange={setValue}
                disabled={busy}
            />
            <div className="flex gap-2">
                <Button type="submit" loading={busy} disabled={!value.trim()}>Sign in</Button>
                <Button type="button" variant="light" onClick={onCancel} disabled={busy}>
                    Back
                </Button>
            </div>
        </form>
    )
}
