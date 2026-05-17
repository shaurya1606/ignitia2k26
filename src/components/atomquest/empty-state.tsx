import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
    title,
    description,
    action,
    className,
}: {
    title: string
    description?: string
    action?: ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                'rounded-lg border border-dashed border-neutral-700 bg-neutral-950/40 px-6 py-10 text-center',
                className
            )}
        >
            <p className="text-sm font-medium text-white">{title}</p>
            {description ? (
                <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
                    {description}
                </p>
            ) : null}
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    )
}
