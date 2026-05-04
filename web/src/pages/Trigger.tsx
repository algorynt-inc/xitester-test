import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Select, SelectItem, Text, TextInput, Title } from '@tremor/react'
import { useEnv } from '@/components/EnvContext'
import { dispatchE2E, listRecentWorkflowRuns } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { BROWSERS, ENVS, SUITES } from '@/types'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export default function Trigger() {
    const { env, setEnv } = useEnv()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [suite, setSuite] = useState<SuiteName>(() => (params.get('suite') as SuiteName) || 'login')
    const [browser, setBrowser] = useState<BrowserChoice>('chromium')
    const [grep, setGrep] = useState<string>(params.get('grep') ?? '')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirmProd, setConfirmProd] = useState(false)

    const isProd = env === 'prod'

    useEffect(() => {
        const envParam = params.get('env') as EnvName | null
        if (envParam && (ENVS as string[]).includes(envParam)) setEnv(envParam)
    }, [params, setEnv])

    const onTrigger = async () => {
        const token = getToken()
        if (!token) return
        setError(null)
        setBusy(true)
        try {
            const before = await listRecentWorkflowRuns(token, 5)
            const beforeIds = new Set(before.map(r => r.id))
            await dispatchE2E(token, { environment: env, suite, browser, grep: grep.trim() })

            for (let i = 0; i < 12; i++) {
                await new Promise(r => setTimeout(r, 2000))
                const recent = await listRecentWorkflowRuns(token, 5)
                const fresh = recent.find(r => !beforeIds.has(r.id))
                if (fresh) {
                    navigate(`/in-flight/${fresh.id}`)
                    return
                }
            }
            setError('Workflow dispatched, but the run did not appear within 24s. Check GitHub Actions.')
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Trigger a run
            </h1>

            <Card>
                <Title>Configuration</Title>
                <div className="mt-4 space-y-4">
                    <div>
                        <Text>Environment</Text>
                        <Select value={env} onValueChange={v => setEnv(v as EnvName)} className="mt-1">
                            {ENVS.map(e => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Text>Suite</Text>
                        <Select value={suite} onValueChange={v => setSuite(v as SuiteName)} className="mt-1">
                            {SUITES.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Text>Browser</Text>
                        <Select value={browser} onValueChange={v => setBrowser(v as BrowserChoice)} className="mt-1">
                            {BROWSERS.map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Text>Test filter (optional)</Text>
                        <TextInput
                            value={grep}
                            onValueChange={setGrep}
                            placeholder="e.g. TC-LI-001  or  (TC-LI-001|TC-LI-014)"
                            className="mt-1"
                        />
                        <Text className="mt-1 text-xs">
                            Passed to Playwright as <code className="font-mono">--grep</code>. Matches test titles. Leave blank to run everything in the suite.
                        </Text>
                    </div>

                    {isProd && (
                        <div className="rounded-tremor-default bg-rose-500/10 text-rose-400 px-3 py-2 text-sm">
                            <strong>Prod target.</strong> Confirm credentials are scoped to a sandbox account and the suite is read-only.
                            <label className="mt-2 flex items-center gap-2 text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                <input type="checkbox" checked={confirmProd} onChange={e => setConfirmProd(e.target.checked)} />
                                I confirm this is safe to run on prod.
                            </label>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-tremor-default bg-rose-500/10 text-rose-400 px-3 py-2 text-sm">{error}</div>
                    )}

                    <Button onClick={onTrigger} loading={busy} disabled={busy || (isProd && !confirmProd)}>
                        Dispatch workflow
                    </Button>
                </div>
            </Card>
        </div>
    )
}
