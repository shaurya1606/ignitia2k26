'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UOM_OPTIONS, type GoalDraft } from '@/lib/atomquest/types'
import type { ThrustAreaOption } from '@/lib/atomquest/types'
import { GOAL_RULES } from '@/services/atomquest/validation'
import { cn } from '@/lib/utils'

type GoalEditorProps = {
    goals: GoalDraft[]
    thrustAreas: ThrustAreaOption[]
    canEdit: boolean
    onUpdate: (index: number, patch: Partial<GoalDraft>) => void
    onRemove?: (index: number) => void
    onAdd?: () => void
    validationErrors?: string[]
}

export function GoalEditor({
    goals,
    thrustAreas,
    canEdit,
    onUpdate,
    onRemove,
    onAdd,
    validationErrors,
}: GoalEditorProps) {
    const totalWeight = goals.reduce((sum, g) => sum + (Number(g.weightage) || 0), 0)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p
                    className={cn(
                        'text-sm font-medium',
                        totalWeight === GOAL_RULES.totalWeightage
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                    )}
                >
                    Weightage: {totalWeight}% / {GOAL_RULES.totalWeightage}%
                </p>
                {canEdit && onAdd && goals.length < GOAL_RULES.maxGoals ? (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="text-sm text-neutral-300 hover:text-white underline-offset-2 hover:underline"
                    >
                        + Add goal
                    </button>
                ) : null}
            </div>

            {validationErrors && validationErrors.length > 0 ? (
                <ul className="text-sm text-red-300 list-disc pl-5 space-y-1">
                    {validationErrors.map((e) => (
                        <li key={e}>{e}</li>
                    ))}
                </ul>
            ) : null}

            <div className="space-y-4">
                {goals.map((goal, index) => {
                    const locked = goal.isSharedRecipient
                    const titleLocked = locked || !canEdit
                    return (
                        <div
                            key={goal.id ?? index}
                            className="rounded-lg border border-neutral-800 p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-neutral-300">
                                    Goal {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    {locked ? (
                                        <Badge variant="outline" className="text-xs border-blue-700 text-blue-300">
                                            Shared KPI
                                        </Badge>
                                    ) : null}
                                    {locked ? (
                                        <span className="text-xs text-neutral-500">
                                            Admin-assigned · title/target read-only
                                        </span>
                                    ) : null}
                                    {canEdit && onRemove && goals.length > 1 && !locked ? (
                                        <button
                                            type="button"
                                            onClick={() => onRemove(index)}
                                            className="text-xs text-neutral-500 hover:text-red-400"
                                        >
                                            Remove
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Field label="Title">
                                    <Input
                                        value={goal.title}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, { title: e.target.value })
                                        }
                                        className="bg-neutral-900 border-neutral-700"
                                    />
                                </Field>
                                <Field label="Thrust area">
                                    <select
                                        value={goal.thrustAreaId}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, { thrustAreaId: e.target.value })
                                        }
                                        className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white disabled:opacity-60"
                                    >
                                        <option value="">Select…</option>
                                        {thrustAreas.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Unit of measure" className="sm:col-span-2">
                                    <select
                                        value={goal.uomType}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, {
                                                uomType: e.target
                                                    .value as GoalDraft['uomType'],
                                            })
                                        }
                                        className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white disabled:opacity-60"
                                    >
                                        {UOM_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    label={
                                        locked
                                            ? 'Target value (read-only)'
                                            : 'Target value'
                                    }
                                >
                                    <Input
                                        value={goal.targetValue}
                                        disabled={titleLocked}
                                        onChange={(e) =>
                                            onUpdate(index, { targetValue: e.target.value })
                                        }
                                        className="bg-neutral-900 border-neutral-700"
                                    />
                                </Field>
                                <Field
                                    label={
                                        locked ? 'Weightage (%) — you may adjust' : 'Weightage (%)'
                                    }
                                >
                                    <Input
                                        type="number"
                                        min={10}
                                        max={100}
                                        value={goal.weightage}
                                        disabled={!canEdit}
                                        onChange={(e) =>
                                            onUpdate(index, {
                                                weightage: Number(e.target.value),
                                            })
                                        }
                                        className="bg-neutral-900 border-neutral-700"
                                    />
                                </Field>
                                {goal.uomType === 'TIMELINE' ? (
                                    <Field label="Target deadline">
                                        <Input
                                            type="date"
                                            value={goal.targetDeadline}
                                            disabled={titleLocked}
                                            onChange={(e) =>
                                                onUpdate(index, {
                                                    targetDeadline: e.target.value,
                                                })
                                            }
                                            className="bg-neutral-900 border-neutral-700"
                                        />
                                    </Field>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Field({
    label,
    children,
    className,
}: {
    label: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <Label className="text-neutral-400">{label}</Label>
            {children}
        </div>
    )
}
