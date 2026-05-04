import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Select, SelectItem, Text, TextInput, Title } from '@tremor/react'
import { GitMerge } from 'lucide-react'
import { useEnv } from '@/components/EnvContext'
import { dispatchE2E, listRecentWorkflowRuns } from '@/lib/github-client'
import { getToken } from '@/lib/auth/auth-store'
import { loadCatalog } from '@/lib/catalog-loader'
import { BROWSERS, ENVS } from '@/types'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export default function Trigger() {
    const { env, setEnv } = useEnv()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [suite, setSuite] = useState<SuiteName>(() => (params.get('suite') as SuiteName) || 'all')
    const [browser, setBrowser] = useState<BrowserChoice>('chromium')
    const [grep, setGrep] = useState<string>(params.get('grep') ?? '')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [confirmProd, setConfirmProd] = useState(false)
    const [availableSuites, setAvailableSuites] = useState<SuiteName[]>(['all'])

    const parentRunId = params.get('parent') ?? ''
    const isProd = env === 'prod'

    // Derive the Suite dropdown from the static test catalog produced by
    // `playwright test --list`. Any new spec file appears here automatically
    // on the next Pages deploy — no manual SUITES enum to update.
    useEffect(() => {
        let stop = false
        loadCatalog().then(cat => {
            if (stop) return
            const list: SuiteName[] = ['all', ...(cat.suites as SuiteName[])]
            setAvailableSuites(list)
            // If the URL-prefilled suite isn't in the catalog yet (e.g. just
            // pushed but Pages hasn't redeployed), keep what the URL said —
            // the workflow accepts arbitrary strings.
        }).catch(() => undefined)
        return () => {
            stop = true
        }
    }, [])

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
            await dispatchE2E(token, {
                environment: env,
                suite,
                browser,
                grep: grep.trim(),
                parentRunId,
            })

            for (let i = 0; i < 12; i++) {
                await new Promise(r => setTimeout(r, 2000))
                const recent = await listRecentWorkflowRuns(token, 5)
                const fresh = recent.find(r => !beforeIds.has(r.id))
                if (fresh) {
                    const qs = parentRunId ? `?parent=${encodeURIComponent(parentRunId)}` : ''
                    navigate(`/in-flight/${fresh.id}${qs}`)
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
                {parentRunId ? 'Re-run into existing run' : 'Trigger a run'}
            </h1>

            {parentRunId && (
                <Card className="border-tremor-brand/40 bg-tremor-brand/5">
                    <div className="flex items-start gap-3">
                        <GitMerge className="h-5 w-5 text-tremor-brand mt-0.5" />
                        <div className="flex-1">
                            <Text className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Merging into run{' '}
                                <Link to={`/runs/${parentRunId}`} className="font-mono text-tremor-brand hover:underline">
                                    {parentRunId}
                                </Link>
                            </Text>
                            <Text className="text-xs mt-1">
                                The new run won't appear as a separate dashboard entry — its results will replace the matching tests inside the parent run, and the parent's stats / finishedAt will refresh.
                            </Text>
                        </div>
                    </div>
                </Card>
            )}

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
                            {availableSuites.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </Select>
                        <Text className="mt-1 text-xs">
                            Sourced from <code className="font-mono">test-catalog.json</code> (regenerated each Pages deploy from <code className="font-mono">playwright test --list</code>).
                        </Text>
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
