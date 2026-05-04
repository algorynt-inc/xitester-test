import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuth } from '@/lib/auth/auth-store'
import { useAuth } from '@/lib/auth/use-auth'
import { REPO_FULL } from '@/lib/config'
import EnvSelector from './EnvSelector'
import { EnvProvider } from './EnvContext'
import clsx from 'clsx'

function Tab({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                clsx(
                    'px-3 py-1.5 rounded-tremor-default text-sm font-medium transition-colors',
                    isActive
                        ? 'bg-tremor-background-muted dark:bg-dark-tremor-background-muted text-tremor-content-strong dark:text-dark-tremor-content-strong'
                        : 'text-tremor-content dark:text-dark-tremor-content hover:text-tremor-content-strong dark:hover:text-dark-tremor-content-strong',
                )
            }
        >
            {label}
        </NavLink>
    )
}

export default function Layout() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const onLogout = () => {
        clearAuth()
        navigate('/login', { replace: true })
    }

    return (
        <EnvProvider>
            <div className="min-h-full">
                <header className="border-b border-tremor-border dark:border-dark-tremor-border bg-tremor-background dark:bg-dark-tremor-background sticky top-0 z-10">
                    <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-6">
                        <Link to="/" className="font-semibold tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            XiTester · Tests
                        </Link>
                        <nav className="flex items-center gap-1">
                            <Tab to="/" label="Overview" />
                            <Tab to="/runs" label="Runs" />
                            <Tab to="/trigger" label="Trigger" />
                        </nav>
                        <div className="flex-1" />
                        <EnvSelector />
                        <a
                            href={`https://github.com/${REPO_FULL}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-tremor-content dark:text-dark-tremor-content hover:underline"
                        >
                            {REPO_FULL}
                        </a>
                        {user && (
                            <div className="flex items-center gap-2">
                                <img src={user.avatar_url} alt={user.login} className="h-7 w-7 rounded-full" />
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="text-xs text-tremor-content dark:text-dark-tremor-content hover:underline"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="max-w-screen-2xl mx-auto px-6 py-6">
                    <Outlet />
                </main>
            </div>
        </EnvProvider>
    )
}
