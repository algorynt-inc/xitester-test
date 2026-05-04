import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, TextInput, Title, Text } from '@tremor/react'
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
        <div className="min-h-screen flex items-center justify-center bg-tremor-background dark:bg-dark-tremor-background px-4">
            <Card className="max-w-md w-full">
                <Title>XiTester · Test Dashboard</Title>
                <Text className="mt-1">Sign in with a GitHub account in the <code className="font-mono">{REQUIRED_ORG}</code> org.</Text>

                {error && (
                    <div className="mt-4 rounded-tremor-default bg-rose-500/10 text-rose-400 px-3 py-2 text-sm">{error}</div>
                )}

                {mode === 'choose' && (
                    <div className="mt-6 space-y-3">
                        {isDeviceFlowAvailable() && (
                            <Button
                                className="w-full"
                                disabled={busy}
                                onClick={() => setMode('device')}
                            >
                                Sign in with GitHub (Device Flow)
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            className="w-full"
                            disabled={busy}
                            onClick={() => setMode('pat')}
                        >
                            Use Personal Access Token
                        </Button>
                        <Text className="text-xs">
                            Device Flow may be blocked by browser CORS — fall back to PAT if it fails.
                        </Text>
                    </div>
                )}

                {mode === 'device' && (
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
                                return
                            }
                            setToken(token)
                            setUser(v.user!)
                            navigate('/', { replace: true })
                        }}
                    />
                )}

                {mode === 'pat' && (
                    <PatPanel
                        busy={busy}
                        onCancel={() => setMode('choose')}
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
                )}
            </Card>
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
        <div className="mt-6 space-y-3">
            {phase === 'requesting' && <Text>Requesting device code…</Text>}
            {phase === 'awaiting' && code && (
                <>
                    <Text>1. Open the GitHub authorization page</Text>
                    <a
                        href={code.verification_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-tremor-brand underline text-sm"
                    >
                        {code.verification_uri}
                    </a>
                    <Text>2. Enter this code:</Text>
                    <div className="text-3xl font-mono tracking-widest text-tremor-content-strong dark:text-dark-tremor-content-strong text-center py-3 border border-tremor-border dark:border-dark-tremor-border rounded-tremor-default">
                        {code.user_code}
                    </div>
                    <Text className="text-xs">Polling every {code.interval}s. Expires in {Math.floor(code.expires_in / 60)} minutes.</Text>
                </>
            )}
            <Button variant="light" onClick={onCancel}>Cancel</Button>
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
            className="mt-6 space-y-3"
            onSubmit={e => {
                e.preventDefault()
                if (value.trim()) onSubmit(value.trim())
            }}
        >
            <Text>
                Generate a fine-grained PAT with <strong>Actions: read &amp; write</strong>, <strong>Contents: read</strong>, and{' '}
                <strong>Metadata: read</strong> on this repo, plus the classic <strong>read:org</strong> scope (org-wide).
            </Text>
            <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
                className="block text-tremor-brand underline text-sm"
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
                <Button type="button" variant="light" onClick={onCancel}>Back</Button>
            </div>
        </form>
    )
}
