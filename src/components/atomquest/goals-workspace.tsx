'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAutoDismissToast } from '@/lib/hooks/useAutoDismissToast'
import { Button } from '@/components/ui/button'
import { AlertBanner } from '@/components/atomquest/alert-banner'
import { GoalEditor } from '@/components/atomquest/goal-editor'
import { Card, CardTitle, PageShell } from '@/components/atomquest/page-shell'
import { SheetStatusBadge } from '@/components/atomquest/status-badge'
import { QuarterLockBadge } from '@/components/atomquest/quarter-lock-badge'
import type { QuarterLockState } from '@/lib/atomquest/cycle-utils'
import {
    CHECK_IN_PERIODS,
    emptyGoal,
    type CheckInQuartersResponse,
    type GoalDraft,
    type GoalSheetResponse,
    type ThrustAreaOption,
} from '@/lib/atomquest/types'
import { parseGoalsPayload } from '@/lib/schema/goalSchema'
import { CyclePhase } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'
import {
    CheckInFields,
    type CheckInRow,
} from '@/components/atomquest/check-in-fields'
import { UomType } from '@/lib/dbconfig/atomquest'

type Tab = 'sheet' | 'check-in'

function toPayload(goals: GoalDraft[]) {
    return goals.map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description || null,
        thrustAreaId: g.thrustAreaId,
        uomType: g.uomType,
        targetValue: g.targetValue || null,
        targetDeadline: g.targetDeadline ? new Date(g.targetDeadline) : null,
        weightage: Number(g.weightage),
        isSharedRecipient: g.isSharedRecipient,
    }))
}

export function GoalsWorkspace() {
    const [tab, setTab] = useState<Tab>('sheet')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [data, setData] = useState<GoalSheetResponse | null>(null)
    const [thrustAreas, setThrustAreas] = useState<ThrustAreaOption[]>([])
    const [goals, setGoals] = useState<GoalDraft[]>([emptyGoal()])
    const [checkInPeriod, setCheckInPeriod] = useState<CyclePhase>(CyclePhase.Q1)
    const [checkInRows, setCheckInRows] = useState<Record<string, CheckInRow>>({})
    const [checkInScores, setCheckInScores] = useState<Record<string, string>>({})
    const [checkInLoading, setCheckInLoading] = useState(false)
    const [quartersMeta, setQuartersMeta] = useState<CheckInQuartersResponse | null>(
        null
    )

    useAutoDismissToast(toast, () => setToast(null))

    const loadQuarters = useCallback(async () => {
        try {
            const res = await fetch('/api/atomquest/cycles')
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Failed to load cycles')
            const meta = json as CheckInQuartersResponse
            setQuartersMeta(meta)
            setCheckInPeriod(meta.activeQuarter)
        } catch {
            /* non-blocking for goal sheet */
        }
    }, [])

    const loadSheet = useCallback(async () => {
        setLoading(true)
        setToast(null)
        try {
            const [sheetRes, thrustRes] = await Promise.all([
                fetch('/api/atomquest/goal-sheet?phase=GOAL_SETTING'),
                fetch('/api/atomquest/thrust-areas'),
            ])
            const sheetJson = await sheetRes.json()
            const thrustJson = await thrustRes.json()
            if (!sheetRes.ok) throw new Error(sheetJson.error ?? 'Failed to load')
            if (!thrustRes.ok) throw new Error(thrustJson.error ?? 'Failed to load')
            const payload = sheetJson as GoalSheetResponse
            setData(payload)
            setThrustAreas(thrustJson.thrustAreas ?? [])
            if (payload.goals.length > 0) {
                setGoals(
                    payload.goals.map((g) => ({
                        id: g.id,
                        title: g.title,
                        description: g.description ?? '',
                        thrustAreaId: g.thrustAreaId,
                        uomType: g.uomType,
                        targetValue: g.targetValue ?? '',
                        targetDeadline: g.targetDeadline
                            ? String(g.targetDeadline).slice(0, 10)
                            : '',
                        weightage: g.weightage,
                        isSharedRecipient: g.isSharedRecipient ?? false,
                        isPrimaryOwner: g.isPrimaryOwner ?? true,
                        sharedGoalId: g.sharedGoalId ?? null,
                    })) as GoalDraft[]
                )
            } else if (payload.canEdit) {
                setGoals([emptyGoal()])
            }
            const rows: typeof checkInRows = {}
            for (const g of payload.goals) {
                rows[g.id] = {
                    actualValue: '',
                    actualCompletionDate: '',
                    achievementStatus: 'NOT_STARTED',
                    notes: '',
                }
            }
            setCheckInRows(rows)
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Failed to load goals' })
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadSheet()
        void loadQuarters()
    }, [loadSheet, loadQuarters])

    const loadCheckIn = useCallback(
        async (period: CyclePhase) => {
            if (!data || data.sheet.status !== 'LOCKED') return
            setCheckInLoading(true)
            try {
                const res = await fetch(
                    `/api/atomquest/check-in?period=${encodeURIComponent(period)}`
                )
                const json = await res.json()
                if (!res.ok) throw new Error(json.error ?? 'Failed to load check-in')

                const updates = (json.updates ?? []) as Array<{
                    goalId: string
                    actualValue: string | null
                    actualCompletionDate: string | Date | null
                    achievementStatus: string
                    progressScore: string | null
                    notes: string | null
                }>

                setCheckInRows((prev) => {
                    const next = { ...prev }
                    for (const g of data.goals) {
                        const u = updates.find((x) => x.goalId === g.id)
                        next[g.id] = {
                            actualValue: u?.actualValue ?? '',
                            actualCompletionDate: u?.actualCompletionDate
                                ? String(u.actualCompletionDate).slice(0, 10)
                                : '',
                            achievementStatus:
                                u?.achievementStatus ?? 'NOT_STARTED',
                            notes: u?.notes ?? '',
                        }
                    }
                    return next
                })

                const scores: Record<string, string> = {}
                for (const u of updates) {
                    if (u.progressScore) scores[u.goalId] = u.progressScore
                }
                setCheckInScores(scores)
            } catch (e) {
                setToast({
                    type: 'error',
                    text: e instanceof Error ? e.message : 'Failed to load check-in',
                })
            } finally {
                setCheckInLoading(false)
            }
        },
        [data]
    )

    useEffect(() => {
        if (tab === 'check-in' && data?.sheet.status === 'LOCKED') {
            void loadCheckIn(checkInPeriod)
        }
    }, [tab, checkInPeriod, data?.sheet.status, loadCheckIn])

    const validateClient = () => {
        const parsed = parseGoalsPayload(toPayload(goals))
        setValidationErrors(parsed.valid ? [] : parsed.errors)
        return parsed.valid
    }

    const saveDraft = async () => {
        if (!validateClient()) return
        setSaving(true)
        setToast(null)
        try {
            const res = await fetch('/api/atomquest/goal-sheet', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goals: toPayload(goals) }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Save failed')
            setToast({ type: 'success', text: 'Draft saved successfully.' })
            await loadSheet()
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Save failed' })
        } finally {
            setSaving(false)
        }
    }

    const submitSheet = async () => {
        if (!validateClient()) return
        setSaving(true)
        setToast(null)
        try {
            const putRes = await fetch('/api/atomquest/goal-sheet', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goals: toPayload(goals) }),
            })
            const putJson = await putRes.json()
            if (!putRes.ok) throw new Error(putJson.error ?? 'Save failed')

            const res = await fetch('/api/atomquest/goal-sheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submit' }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Submit failed')
            setToast({ type: 'success', text: 'Submitted for manager approval.' })
            await loadSheet()
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Submit failed' })
        } finally {
            setSaving(false)
        }
    }

    const submitCheckIn = async () => {
        if (!data) return
        setSaving(true)
        setToast(null)
        try {
            const updates = data.goals.map((g) => ({
                goalId: g.id,
                actualValue: checkInRows[g.id]?.actualValue || null,
                actualCompletionDate: checkInRows[g.id]?.actualCompletionDate || null,
                achievementStatus: checkInRows[g.id]?.achievementStatus ?? 'NOT_STARTED',
                notes: checkInRows[g.id]?.notes || null,
            }))
            const res = await fetch('/api/atomquest/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ period: checkInPeriod, updates }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Check-in failed')
            setToast({
                type: 'success',
                text: `${checkInPeriod} check-in saved${data.goals.some((g) => g.isPrimaryOwner && g.sharedGoalId) ? ' (shared KPI synced)' : ''}.`,
            })
            await loadCheckIn(checkInPeriod)
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Check-in failed' })
        } finally {
            setSaving(false)
        }
    }

    const canEdit = data?.canEdit ?? false
    const canCheckIn = data?.sheet.status === 'LOCKED'

    useEffect(() => {
        if (canEdit && tab === 'sheet') {
            const parsed = parseGoalsPayload(toPayload(goals))
            setValidationErrors(parsed.valid ? [] : parsed.errors)
        }
    }, [goals, canEdit, tab])
    const statusLabel =
        data?.sheet.status === 'RETURNED'
            ? 'Returned — revise and resubmit'
            : data?.sheet.status === 'LOCKED'
              ? 'Approved & locked'
              : undefined

    return (
        <PageShell
            title="My goals"
            description="Annual goal sheet and quarterly progress for the current cycle."
            actions={data ? <SheetStatusBadge status={data.sheet.status} /> : undefined}
        >
            {statusLabel ? (
                <AlertBanner variant="info">{statusLabel}</AlertBanner>
            ) : null}
            {toast ? <AlertBanner variant={toast.type}>{toast.text}</AlertBanner> : null}

            <div className="flex gap-2 border-b border-neutral-800 pb-2">
                {(
                    [
                        ['sheet', 'Goal sheet'],
                        ['check-in', 'Quarterly check-in'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={cn(
                            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                            tab === id
                                ? 'bg-white text-black'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <Card>
                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
                        Loading goal sheet…
                    </div>
                </Card>
            ) : tab === 'sheet' ? (
                <Card>
                    {data?.sheet.returnReason && data.sheet.status === 'RETURNED' ? (
                        <AlertBanner variant="info" className="mb-4">
                            <span className="font-medium">Manager feedback:</span>{' '}
                            {data.sheet.returnReason}
                        </AlertBanner>
                    ) : null}
                    <CardTitle>Goals</CardTitle>
                    <GoalEditor
                        goals={goals}
                        thrustAreas={thrustAreas}
                        canEdit={canEdit}
                        validationErrors={validationErrors}
                        onUpdate={(i, patch) =>
                            setGoals((p) => p.map((g, idx) => (idx === i ? { ...g, ...patch } : g)))
                        }
                        onAdd={() => setGoals((p) => [...p, emptyGoal()])}
                        onRemove={(i) => setGoals((p) => p.filter((_, idx) => idx !== i))}
                    />
                    {canEdit ? (
                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-neutral-800">
                            <Button
                                variant="secondary"
                                onClick={saveDraft}
                                disabled={saving || validationErrors.length > 0}
                            >
                                {saving ? 'Saving…' : 'Save draft'}
                            </Button>
                            <Button
                                onClick={submitSheet}
                                disabled={saving || validationErrors.length > 0}
                            >
                                Submit for approval
                            </Button>
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 mt-4">
                            This sheet is read-only in its current status.
                        </p>
                    )}
                </Card>
            ) : (
                <CheckInPanel
                    canCheckIn={canCheckIn}
                    goals={data?.goals ?? []}
                    period={checkInPeriod}
                    quartersMeta={quartersMeta}
                    rows={checkInRows}
                    scores={checkInScores}
                    loading={checkInLoading}
                    saving={saving}
                    onPeriodChange={setCheckInPeriod}
                    onRowChange={(id, patch) =>
                        setCheckInRows((p) => ({
                            ...p,
                            [id]: { ...(p[id] ?? emptyCheckInRow()), ...patch },
                        }))
                    }
                    onSubmit={submitCheckIn}
                />
            )}
        </PageShell>
    )
}

function emptyCheckInRow(): CheckInRow {
    return {
        actualValue: '',
        actualCompletionDate: '',
        achievementStatus: 'NOT_STARTED',
        notes: '',
    }
}

function CheckInPanel({
    canCheckIn,
    goals,
    period,
    quartersMeta,
    rows,
    scores,
    loading,
    saving,
    onPeriodChange,
    onRowChange,
    onSubmit,
}: {
    canCheckIn: boolean
    goals: GoalSheetResponse['goals']
    period: CyclePhase
    quartersMeta: CheckInQuartersResponse | null
    rows: Record<string, CheckInRow>
    scores: Record<string, string>
    loading: boolean
    saving: boolean
    onPeriodChange: (p: CyclePhase) => void
    onRowChange: (id: string, patch: Partial<CheckInRow>) => void
    onSubmit: () => void
}) {
    const quarterInfo = quartersMeta?.quarters.find((q) => q.phase === period)
    const lockState = (quarterInfo?.lockState ?? 'closed') as QuarterLockState
    const editable = quarterInfo?.editable ?? false
    if (!canCheckIn) {
        return (
            <Card>
                <p className="text-sm text-neutral-400">
                    Quarterly check-ins unlock after your manager approves and locks your goal sheet.
                </p>
            </Card>
        )
    }

    return (
        <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <CardTitle className="mb-0">Quarterly check-in</CardTitle>
                {quarterInfo ? (
                    <QuarterLockBadge
                        state={lockState}
                        label={quarterInfo.lockLabel}
                    />
                ) : null}
            </div>
            {quartersMeta ? (
                <p className="text-xs text-neutral-500 mb-4">
                    Active quarter:{' '}
                    <strong className="text-neutral-300">{quartersMeta.activeQuarter}</strong>
                    — only this quarter accepts edits.
                </p>
            ) : null}
            <div className="flex flex-wrap gap-2 mb-6">
                {CHECK_IN_PERIODS.map((p) => {
                    const q = quartersMeta?.quarters.find((x) => x.phase === p)
                    return (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onPeriodChange(p)}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium border',
                                period === p
                                    ? 'bg-white text-black border-white'
                                    : 'border-neutral-700 text-neutral-400',
                                q?.isActive && period !== p && 'border-emerald-800/60'
                            )}
                        >
                            {p}
                            {q?.isActive ? ' •' : ''}
                        </button>
                    )
                })}
            </div>
            {!editable ? (
                <AlertBanner variant="info" className="mb-4">
                    This quarter is view-only. Switch to{' '}
                    <strong>{quartersMeta?.activeQuarter ?? 'the active quarter'}</strong>{' '}
                    to record or update check-in data.
                </AlertBanner>
            ) : null}
            {loading ? (
                <p className="text-sm text-neutral-400 mb-4">Loading {period} entries…</p>
            ) : null}
            <div className="space-y-4">
                {goals.map((g) => (
                    <div key={g.id} className="rounded-lg border border-neutral-800 p-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">{g.title}</p>
                            {g.isSharedRecipient ? (
                                <span className="text-xs text-blue-400">Shared KPI</span>
                            ) : null}
                            {g.isPrimaryOwner && g.sharedGoalId ? (
                                <span className="text-xs text-blue-400">Primary owner — syncs to team</span>
                            ) : null}
                        </div>
                        <CheckInFields
                            uomType={g.uomType as UomType}
                            row={rows[g.id] ?? emptyCheckInRow()}
                            progressScore={scores[g.id]}
                            disabled={!editable}
                            onChange={(patch) => onRowChange(g.id, patch)}
                        />
                        {g.isPrimaryOwner && g.sharedGoalId ? (
                            <p className="text-xs text-neutral-500">
                                Saving updates progress for all recipients of this shared KPI.
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>
            <Button
                className="mt-6"
                onClick={onSubmit}
                disabled={saving || goals.length === 0 || !editable}
                title={
                    !editable
                        ? `Only ${quartersMeta?.activeQuarter ?? 'the active quarter'} can be saved`
                        : undefined
                }
            >
                {saving ? 'Saving…' : `Save ${period} check-in`}
            </Button>
            {!editable && goals.length > 0 ? (
                <p className="mt-2 text-xs text-neutral-500">
                    Save is disabled because this quarter is not the active check-in window.
                </p>
            ) : null}
        </Card>
    )
}
