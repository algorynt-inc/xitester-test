import { motion, AnimatePresence } from 'framer-motion'
import { ENVS } from '@/types'
import { ENV_LABELS } from '@/lib/config'
import { useEnv } from './EnvContext'
import clsx from 'clsx'

export default function EnvSelector() {
    const { env, setEnv } = useEnv()
    return (
        <div className="inline-flex rounded-tremor-full border border-tremor-border dark:border-dark-tremor-border bg-tremor-background-muted dark:bg-dark-tremor-background-muted p-0.5">
            {ENVS.map(e => {
                // Treat any non-disabled production-like env as the destructive accent.
                // Currently no env triggers this — keep the styling slot for when prod returns.
                const isProd = false
                const active = env === e
                return (
                    <button
                        key={e}
                        type="button"
                        onClick={() => setEnv(e)}
                        className={clsx(
                            'relative px-3 py-1 text-xs font-medium rounded-tremor-full transition-colors',
                            active
                                ? isProd
                                    ? 'text-white'
                                    : 'text-white dark:text-tremor-brand-inverted'
                                : 'text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong',
                        )}
                    >
                        <AnimatePresence>
                            {active && (
                                <motion.span
                                    layoutId="env-pill"
                                    className={clsx(
                                        'absolute inset-0 rounded-tremor-full shadow-sm',
                                        isProd ? 'bg-rose-500' : 'bg-tremor-brand dark:bg-dark-tremor-brand',
                                    )}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </AnimatePresence>
                        <span className="relative">{ENV_LABELS[e]}</span>
                    </button>
                )
            })}
        </div>
    )
}
