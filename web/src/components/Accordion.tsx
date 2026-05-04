import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface Props {
    /** Header content rendered before the chevron. The whole header is the toggle. */
    header: ReactNode
    /** Optional content rendered AFTER the header on the same row but NOT a toggle (e.g. action buttons). */
    actions?: ReactNode
    /** Body content shown when expanded. */
    children: ReactNode
    /** Defaults closed; pass true to start open. */
    defaultOpen?: boolean
    /** Optional className on the outer wrapper. */
    className?: string
}

export default function Accordion({ header, actions, children, defaultOpen = false, className }: Props) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className={clsx('rounded-tremor-default border border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background', className)}>
            <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="flex-1 flex items-center gap-2 text-left group focus:outline-none"
                    aria-expanded={open}
                >
                    <motion.span
                        animate={{ rotate: open ? 0 : -90 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="text-tremor-content dark:text-dark-tremor-content group-hover:text-tremor-content-strong dark:group-hover:text-dark-tremor-content-strong"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.span>
                    <div className="flex-1 min-w-0">{header}</div>
                </button>
                {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 border-t border-tremor-border dark:border-dark-tremor-border">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
