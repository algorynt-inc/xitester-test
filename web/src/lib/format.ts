export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
    const m = Math.floor(ms / 60_000)
    const s = Math.floor((ms % 60_000) / 1000)
    return `${m}m ${s}s`
}

export function formatRelativeTime(iso: string): string {
    const then = new Date(iso).getTime()
    const diff = Date.now() - then
    if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
    return `${Math.floor(diff / 86_400_000)}d ago`
}

export function shortSha(sha: string | null | undefined): string {
    return sha ? sha.slice(0, 7) : '—'
}

export function formatDateTimeIST(iso: string): string {
    // e.g. "22 Jul 2026, 10:30 AM" — pinned to India Standard Time
    const s = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    }).format(new Date(iso))
    // en-GB emits lowercase am/pm — uppercase it to match "10:30 AM"
    return s.replace(/\b(am|pm)\b/i, m => m.toUpperCase())
}
