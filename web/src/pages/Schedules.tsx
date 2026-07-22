import { useEffect, useState } from 'react'
import { Button, Card, Select, SelectItem, Switch, Text, Title } from '@tremor/react'
import { CalendarClock } from 'lucide-react'
import { getToken } from '@/lib/auth/auth-store'
import { loadCatalog } from '@/lib/catalog-loader'
import { ENV_LABELS } from '@/lib/config'
import {
    loadScheduleConfig,
    localToUtcHHMM,
    saveScheduleConfig,
    snapToTenMinutes,
    utcToLocalHHMM,
} from '@/lib/schedule-config'
import type { EnvSchedule, ScheduleConfig } from '@/lib/schedule-config'
import { BROWSERS, ENVS } from '@/types'
import type { BrowserChoice, EnvName, SuiteName } from '@/types'

export default function Schedules() {
    const [config, setConfig] = useState<ScheduleConfig | null>(null)
    const [sha, setSha] = useState<string>('')
    const [dirty, setDirty] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [saved, setSaved] = useState(false)
    const [availableSuites, setAvailableSuites] = useState<SuiteName[]>(['all'])

    const reload = async () => {
        const token = getToken()
        if (!token) return
        setError(null)
        try {
            const { config: cfg, sha: s } = await loadScheduleConfig(token)
            setConfig(cfg)
            setSha(s)
            setDirty(false)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    useEffect(() => {
        void reload()
        loadCatalog()
            .then(cat => setAvailableSuites(['all', ...(cat.suites as SuiteName[])]))
            .catch(() => undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const patch = (env: EnvName, changes: Partial<EnvSchedule>) => {
        setConfig(prev =>
            prev
                ? { ...prev, schedules: { ...prev.schedules, [env]: { ...prev.schedules[env], ...changes } } }
                : prev,
        )
        setDirty(true)
        setSaved(false)
    }

    const onSave = async () => {
        const token = getToken()
        if (!token || !config) return
        setError(null)
        setBusy(true)
        try {
            await saveScheduleConfig(token, config, sha)
            setSaved(true)
            await reload()
        } catch (err) {
            if ((err as { status?: number }).status === 409) {
                // Someone else saved since we loaded — our sha is stale.
                // Reload the latest so the next save can succeed.
                await reload()
                setError(
                    'The config was changed elsewhere while you were editing — reloaded the latest version. Please re-apply your edits and save again.',
                )
            } else {
                setError((err as Error).message)
            }
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Schedules
            </h1>

            <Card className="border-tremor-brand/40 bg-tremor-brand/5">
                <div className="flex items-start gap-3">
                    <CalendarClock className="h-5 w-5 text-tremor-brand mt-0.5" />
                    <div className="flex-1">
                        <Text className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            Daily automated runs per environment
                        </Text>
                        <Text className="text-xs mt-1">
                            A dispatcher workflow checks <code className="font-mono">schedule-config.json</code> on a
                            ~10-minute cron and triggers the E2E workflow for each enabled environment at its set
                            time. GitHub may delay ticks — a late tick fires the run late rather than skipping it.
                            Times snap to 10-minute marks. Saving commits the config to{' '}
                            <code className="font-mono">main</code>.
                        </Text>
                    </div>
                </div>
            </Card>

            {!config && !error && (
                <Card>
                    <Text>Loading schedule config…</Text>
                </Card>
            )}

            {config &&
                ENVS.map(env => {
                    const s = config.schedules[env]
                    if (!s) return null
                    return (
                        <Card key={env}>
                            <div className="flex items-center justify-between">
                                <Title>{ENV_LABELS[env]}</Title>
                                <div className="flex items-center gap-2">
                                    <Text className="text-xs">{s.enabled ? 'Enabled' : 'Disabled'}</Text>
                                    <Switch checked={s.enabled} onChange={v => patch(env, { enabled: v })} />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Text>Time (your local time)</Text>
                                    <input
                                        type="time"
                                        step={600}
                                        value={utcToLocalHHMM(s.utcTime)}
                                        onChange={e => {
                                            // No snapping mid-typing — rewriting the controlled value
                                            // while the user edits mangles keyboard entry.
                                            if (!e.target.value) return
                                            patch(env, { utcTime: localToUtcHHMM(e.target.value) })
                                        }}
                                        onBlur={e => {
                                            // Snap in LOCAL time (matches the picker's 10-min steps
                                            // even in :30/:45-offset timezones), then store as UTC.
                                            if (!e.target.value) return
                                            patch(env, { utcTime: localToUtcHHMM(snapToTenMinutes(e.target.value)) })
                                        }}
                                        disabled={!s.enabled}
                                        className="mt-1 w-full rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background px-3 py-2 text-sm text-tremor-content-strong dark:text-dark-tremor-content-strong disabled:opacity-50"
                                    />
                                    <Text className="mt-1 text-xs">{s.utcTime} UTC · daily</Text>
                                </div>
                                <div>
                                    <Text>Suite</Text>
                                    <Select
                                        value={s.suite}
                                        onValueChange={v => patch(env, { suite: v as SuiteName })}
                                        disabled={!s.enabled}
                                        className="mt-1"
                                    >
                                        {availableSuites.map(suite => (
                                            <SelectItem key={suite} value={suite}>
                                                {suite}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Text>Browser</Text>
                                    <Select
                                        value={s.browser}
                                        onValueChange={v => patch(env, { browser: v as BrowserChoice })}
                                        disabled={!s.enabled}
                                        className="mt-1"
                                    >
                                        {BROWSERS.map(b => (
                                            <SelectItem key={b} value={b}>
                                                {b}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </Card>
                    )
                })}

            {error && (
                <div className="rounded-tremor-default bg-rose-500/10 text-rose-400 px-3 py-2 text-sm">{error}</div>
            )}
            {saved && !dirty && (
                <div className="rounded-tremor-default bg-emerald-500/10 text-emerald-400 px-3 py-2 text-sm">
                    Saved — the dispatcher picks this up on its next tick.
                </div>
            )}

            {config && (
                <Button onClick={onSave} loading={busy} disabled={busy || !dirty}>
                    Save schedules
                </Button>
            )}
        </div>
    )
}
