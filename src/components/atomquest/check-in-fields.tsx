'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ACHIEVEMENT_OPTIONS } from '@/lib/atomquest/types'
import { UomType } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'

export type CheckInRow = {
    actualValue: string
    actualCompletionDate: string
    achievementStatus: string
    notes: string
}

type CheckInFieldsProps = {
    uomType: UomType
    row: CheckInRow
    progressScore?: string | null
    disabled?: boolean
    onChange: (patch: Partial<CheckInRow>) => void
}

export function CheckInFields({
    uomType,
    row,
    progressScore,
    disabled = false,
    onChange,
}: CheckInFieldsProps) {
    const scoreNum = progressScore ? Number(progressScore) : null
    const showBar =
        scoreNum !== null && Number.isFinite(scoreNum) && scoreNum > 0

    return (
        <div className="space-y-3">
            {uomType === UomType.TIMELINE ? (
                <div className="space-y-1.5">
                    <Label className="text-neutral-400">Actual completion date</Label>
                    <Input
                        type="date"
                        value={row.actualCompletionDate}
                        onChange={(e) =>
                            onChange({ actualCompletionDate: e.target.value })
                        }
                        className="bg-neutral-900 border-neutral-700"
                        disabled={disabled}
                    />
                </div>
            ) : uomType === UomType.ZERO_BASED ? (
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={row.actualValue === '0'}
                        disabled={disabled}
                        onChange={(e) =>
                            onChange({ actualValue: e.target.checked ? '0' : '1' })
                        }
                        className="h-4 w-4 rounded border-neutral-600 disabled:opacity-50"
                    />
                    <Label className="text-neutral-300">
                        Zero-defect target met (no defects recorded)
                    </Label>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <Label className="text-neutral-400">
                        Actual value
                        {uomType === UomType.PERCENT_MIN ||
                        uomType === UomType.PERCENT_MAX
                            ? ' (%)'
                            : ''}
                    </Label>
                    <Input
                        type="number"
                        inputMode="decimal"
                        step="any"
                        value={row.actualValue}
                        onChange={(e) => onChange({ actualValue: e.target.value })}
                        className="bg-neutral-900 border-neutral-700"
                        placeholder="Enter achieved value"
                        disabled={disabled}
                    />
                </div>
            )}

            <div className="space-y-1.5">
                <Label className="text-neutral-400">Achievement status</Label>
                <select
                    value={row.achievementStatus}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange({ achievementStatus: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white disabled:opacity-50"
                >
                    {ACHIEVEMENT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>

            {showBar ? (
                <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(scoreNum!)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div
                            className={cn(
                                'h-full transition-all',
                                scoreNum! >= 100
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                            )}
                            style={{ width: `${Math.min(100, scoreNum!)}%` }}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}