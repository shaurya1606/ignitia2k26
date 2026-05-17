import { Badge } from '@/components/ui/badge'
import type { GoalSheetStatus } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'

const statusStyles: Record<GoalSheetStatus, string> = {
    DRAFT: 'bg-neutral-800 text-neutral-200 border-neutral-700',
    SUBMITTED: 'bg-amber-950 text-amber-200 border-amber-800',
    RETURNED: 'bg-orange-950 text-orange-200 border-orange-800',
    LOCKED: 'bg-emerald-950 text-emerald-200 border-emerald-800',
}

const statusLabels: Record<GoalSheetStatus, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    RETURNED: 'Returned for revision',
    LOCKED: 'Approved',
}

export function SheetStatusBadge({
    status,
    className,
}: {
    status: GoalSheetStatus
    className?: string
}) {
    return (
        <Badge
            variant="outline"
            className={cn('font-medium', statusStyles[status], className)}
        >
            {statusLabels[status]}
        </Badge>
    )
}
