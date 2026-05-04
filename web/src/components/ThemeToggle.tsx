import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme, type ThemeMode } from '@/lib/theme'
import clsx from 'clsx'

const OPTIONS: Array<{ value: ThemeMode; label: string; Icon: typeof Sun }> = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'system', label: 'System', Icon: Monitor },
    { value: 'dark', label: 'Dark', Icon: Moon },
]

export default function ThemeToggle() {
    const { mode, setMode } = useTheme()
    return (
        <div className="inline-flex rounded-tremor-full border border-tremor-border dark:border-dark-tremor-border bg-tremor-background-muted dark:bg-dark-tremor-background-muted p-0.5 relative">
            {OPTIONS.map(({ value, label, Icon }) => {
                const active = mode === value
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value)}
                        title={label}
                        aria-label={`Set theme to ${label}`}
                        className={clsx(
                            'relative px-2 py-1 rounded-tremor-full transition-colors',
                            active
                                ? 'text-tremor-brand-emphasis dark:text-dark-tremor-brand-emphasis'
                                : 'text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong',
                        )}
                    >
                        <AnimatePresence>
                            {active && (
                                <motion.span
                                    layoutId="theme-pill"
                                    className="absolute inset-0 rounded-tremor-full bg-white dark:bg-dark-tremor-background shadow-tremor-card"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </AnimatePresence>
                        <Icon className="relative h-3.5 w-3.5" />
                    </button>
                )
            })}
        </div>
    )
}
