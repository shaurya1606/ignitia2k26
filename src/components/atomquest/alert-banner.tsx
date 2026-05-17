'use client'

import { cn } from '@/lib/utils'

type AlertBannerProps = {
    variant: 'success' | 'error' | 'info'
    children: React.ReactNode
    className?: string
}

export function AlertBanner({ variant, children, className }: AlertBannerProps) {
    return (
        <div
            role="alert"
            className={cn(
                'rounded-lg border px-4 py-3 text-sm',
                variant === 'success' &&
                    'border-emerald-800 bg-emerald-950/50 text-emerald-200',
                variant === 'error' &&
                    'border-red-800 bg-red-950/50 text-red-200',
                variant === 'info' &&
                    'border-blue-800 bg-blue-950/50 text-blue-200',
                className
            )}
        >
            {children}
        </div>
    )
}
