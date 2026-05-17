import type { QuarterLockState } from '@/lib/atomquest/cycle-utils'
import { cn } from '@/lib/utils'

const styles: Record<QuarterLockState, string> = {
    active: 'border-emerald-800 bg-emerald-950/50 text-emerald-200',
    past: 'border-neutral-700 bg-neutral-900/80 text-neutral-400',
    future: 'border-amber-900/80 bg-amber-950/40 text-amber-200',
    closed: 'border-red-900/80 bg-red-950/40 text-red-200',
}

export function QuarterLockBadge({
    state,
    label,
    className,
}: {
    state: QuarterLockState
    label: string
    className?: string
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                styles[state],
                className
            )}
        >
            {label}
        </span>
    )
}
