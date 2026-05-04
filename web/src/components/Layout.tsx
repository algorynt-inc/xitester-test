import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Github } from 'lucide-react'
import { clearAuth } from '@/lib/auth/auth-store'
import { useAuth } from '@/lib/auth/use-auth'
import { REPO_FULL } from '@/lib/config'
import EnvSelector from './EnvSelector'
import ThemeToggle from './ThemeToggle'
import { EnvProvider } from './EnvContext'
import clsx from 'clsx'

const TABS = [
    { to: '/', label: 'Overview' },
    { to: '/runs', label: 'Runs' },
    { to: '/trigger', label: 'Trigger' },
] as const

function Tab({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                clsx(
                    'relative px-3 py-1.5 rounded-tremor-default text-sm font-medium transition-colors',
                    isActive
                        ? 'text-tremor-content-strong dark:text-dark-tremor-content-strong'
                        : 'text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong',
                )
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.span
                            layoutId="active-tab"
                            className="absolute inset-0 rounded-tremor-default bg-tremor-background-muted dark:bg-dark-tremor-background-muted"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                    )}
                    <span className="relative">{label}</span>
                </>
            )}
        </NavLink>
    )
}

export default function Layout() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const onLogout = () => {
        clearAuth()
        navigate('/login', { replace: true })
    }

    return (
        <EnvProvider>
            <div className="min-h-full">
                <header className="border-b border-tremor-border dark:border-dark-tremor-border bg-tremor-background/80 dark:bg-dark-tremor-background/80 backdrop-blur sticky top-0 z-10">
                    <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-semibold tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-emerald-400 to-lime-500 shadow-sm" />
                            XiTester · Tests
                        </Link>
                        <nav className="flex items-center gap-1">
                            {TABS.map(t => (
                                <Tab key={t.to} {...t} />
                            ))}
                        </nav>
                        <div className="flex-1" />
                        <EnvSelector />
                        <ThemeToggle />
                        <a
                            href={`https://github.com/${REPO_FULL}`}
                            target="_blank"
                            rel="noreferrer"
                            title={REPO_FULL}
                            className="text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong transition-colors"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        {user && (
                            <div className="flex items-center gap-2 pl-3 border-l border-tremor-border dark:border-dark-tremor-border">
                                <img src={user.avatar_url} alt={user.login} className="h-7 w-7 rounded-full ring-1 ring-tremor-border dark:ring-dark-tremor-border" />
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    title="Sign out"
                                    className="text-tremor-content dark:text-dark-tremor-content hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="max-w-screen-2xl mx-auto px-6 py-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </EnvProvider>
    )
}
