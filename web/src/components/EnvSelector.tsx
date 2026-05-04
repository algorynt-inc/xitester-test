import { ENVS } from '@/types'
import { ENV_LABELS } from '@/lib/config'
import { useEnv } from './EnvContext'
import clsx from 'clsx'

export default function EnvSelector() {
    const { env, setEnv } = useEnv()
    return (
        <div className="inline-flex rounded-tremor-full border border-tremor-border dark:border-dark-tremor-border bg-tremor-background-muted dark:bg-dark-tremor-background-muted p-0.5">
            {ENVS.map(e => {
                const isProd = e === 'prod'
                const active = env === e
                return (
                    <button
                        key={e}
                        type="button"
                        onClick={() => setEnv(e)}
                        className={clsx(
                            'px-3 py-1 text-xs font-medium rounded-tremor-full transition-colors',
                            active
                                ? isProd
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-tremor-brand text-tremor-brand-inverted'
                                : 'text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong',
                        )}
                    >
                        {ENV_LABELS[e]}
                    </button>
                )
            })}
        </div>
    )
}
