import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageShellProps = {
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
    className?: string
}

export function PageShell({
    title,
    description,
    actions,
    children,
    className,
}: PageShellProps) {
    return (
        <div
            className={cn(
                'w-full max-w-6xl mx-auto px-4 pb-16 space-y-6',
                className
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        {title}
                    </h1>
                    {description ? (
                        <p className="mt-1 text-sm text-neutral-400 max-w-2xl">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex flex-wrap gap-2">{actions}</div>
                ) : null}
            </div>
            {children}
        </div>
    )
}

export function Card({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <section
            className={cn(
                'rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 sm:p-6 shadow-lg',
                className
            )}
        >
            {children}
        </section>
    )
}

export function CardTitle({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <h2 className={cn('text-lg font-medium text-white mb-4', className)}>
            {children}
        </h2>
    )
}
