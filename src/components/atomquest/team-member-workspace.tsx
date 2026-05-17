'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useAutoDismissToast } from '@/lib/hooks/useAutoDismissToast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertBanner } from '@/components/atomquest/alert-banner'
import { GoalEditor } from '@/components/atomquest/goal-editor'
import { Card, CardTitle, PageShell } from '@/components/atomquest/page-shell'
import { SheetStatusBadge } from '@/components/atomquest/status-badge'
import {
    CHECK_IN_PERIODS,
    type GoalDraft,
    type TeamMemberResponse,
    type ThrustAreaOption,
} from '@/lib/atomquest/types'
import { parseGoalsPayload } from '@/lib/schema/goalSchema'
import { CyclePhase } from '@/lib/dbconfig/atomquest'
import { cn } from '@/lib/utils'

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

export function TeamMemberWorkspace({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [validationErrors, setValidationErrors] = useState<string[]>([])
    const [data, setData] = useState<TeamMemberResponse | null>(null)
    const [thrustAreas, setThrustAreas] = useState<ThrustAreaOption[]>([])
    const [goals, setGoals] = useState<GoalDraft[]>([])
    const [returnReason, setReturnReason] = useState('')
    const [checkInPeriod, setCheckInPeriod] = useState<CyclePhase>(CyclePhase.Q1)
    const [managerComment, setManagerComment] = useState('')

    useAutoDismissToast(toast, () => setToast(null))

    const load = useCallback(async () => {
        setLoading(true)
        setToast(null)
        try {
            const [memberRes, thrustRes] = await Promise.all([
                fetch(`/api/atomquest/team/${userId}`),
                fetch('/api/atomquest/thrust-areas'),
            ])
            const json = await memberRes.json()
            const thrustJson = await thrustRes.json()
            if (!memberRes.ok) throw new Error(json.error ?? 'Failed to load')
            const payload = json as TeamMemberResponse
            setData(payload)
            setThrustAreas(thrustJson.thrustAreas ?? [])
            setGoals(
                payload.goals.length > 0
                    ? payload.goals.map((g) => ({
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
                      })) as GoalDraft[]
                    : []
            )
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Failed to load' })
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        void load()
    }, [load])

    const validateClient = () => {
        const parsed = parseGoalsPayload(toPayload(goals))
        setValidationErrors(parsed.valid ? [] : parsed.errors)
        return parsed.valid
    }

    const postAction = async (
        action: 'approve' | 'return' | 'save',
        extra?: Record<string, unknown>
    ) => {
        if (action === 'save' && !validateClient()) return
        setSaving(true)
        setToast(null)
        try {
            const res = await fetch(`/api/atomquest/team/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    ...extra,
                    ...(action === 'save' ? { goals: toPayload(goals) } : {}),
                }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Action failed')
            setToast({
                type: 'success',
                text:
                    action === 'approve'
                        ? 'Goal sheet approved and locked.'
                        : action === 'return'
                          ? 'Returned to employee for revision.'
                          : 'Review changes saved.',
            })
            await load()
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Action failed' })
        } finally {
            setSaving(false)
        }
    }

    const saveComment = async () => {
        setSaving(true)
        setToast(null)
        try {
            const res = await fetch(`/api/atomquest/team/${userId}/check-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ period: checkInPeriod, comment: managerComment }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Failed to save comment')
            setToast({ type: 'success', text: `${checkInPeriod} manager comment saved.` })
            setManagerComment('')
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Failed to save comment' })
        } finally {
            setSaving(false)
        }
    }

    const employee = data?.employee
    const sheet = data?.sheet
    const canReview = sheet?.status === 'SUBMITTED'

    return (
        <PageShell
            title={employee?.name ?? employee?.email ?? 'Employee Review'}
            description={employee?.email ?? 'Goal sheet review and manager approval workflow'}
            actions={
                <Button asChild variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                    <Link href="/team">← Back to Team</Link>
                </Button>
            }
        >
            {toast ? <AlertBanner variant={toast.type}>{toast.text}</AlertBanner> : null}

            {loading ? (
                <Card>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                        Loading…
                    </div>
                </Card>
            ) : !sheet ? (
                <Card>
                    <p className="text-sm text-slate-500">
                        This employee has not started a goal sheet yet.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    <Card>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <CardTitle className="mb-0">Goal Review</CardTitle>
                            <SheetStatusBadge status={sheet.status} />
                        </div>
                        {sheet.returnReason && sheet.status === 'RETURNED' ? (
                            <AlertBanner variant="info" className="mb-4">
                                Prior return note: {sheet.returnReason}
                            </AlertBanner>
                        ) : null}

                        {canReview ? (
                            <>
                                <GoalEditor
                                    goals={goals}
                                    thrustAreas={thrustAreas}
                                    canEdit={true}
                                    validationErrors={validationErrors}
                                    onUpdate={(i, patch) =>
                                        setGoals((p) =>
                                            p.map((g, idx) => (idx === i ? { ...g, ...patch } : g))
                                        )
                                    }
                                />
                                <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => postAction('save')}
                                        disabled={saving}
                                        className="border-slate-200 text-slate-700 hover:bg-slate-50"
                                    >
                                        Save Review Edits
                                    </Button>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Return Feedback (optional)
                                        </Label>
                                        <textarea
                                            value={returnReason}
                                            onChange={(e) => setReturnReason(e.target.value)}
                                            rows={2}
                                            placeholder="What should the employee revise?"
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            onClick={() => postAction('approve')}
                                            disabled={saving}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            Approve & Lock
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                postAction('return', {
                                                    returnReason:
                                                        returnReason ||
                                                        'Please revise your goals.',
                                                })
                                            }
                                            disabled={saving}
                                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                        >
                                            Return for Revision
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                {goals.map((g) => (
                                    <div
                                        key={g.id}
                                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                                    >
                                        <p className="font-semibold text-slate-900">{g.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Target: {g.targetValue || '—'} · {g.weightage}% weight
                                        </p>
                                    </div>
                                ))}
                                {sheet.status === 'LOCKED' ? (
                                    <p className="text-sm text-emerald-700 font-medium mt-2">
                                        ✓ Approved and locked.
                                    </p>
                                ) : null}
                            </div>
                        )}
                    </Card>

                    <Card>
                        <CardTitle>Manager Check-in Comment</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {CHECK_IN_PERIODS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setCheckInPeriod(p)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
                                        checkInPeriod === p
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={managerComment}
                            onChange={(e) => setManagerComment(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Recognition, coaching notes, or next steps…"
                        />
                        <Button
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={saveComment}
                            disabled={saving || !managerComment.trim()}
                        >
                            {saving ? 'Saving…' : 'Save Comment'}
                        </Button>
                    </Card>
                </div>
            )}
        </PageShell>
    )
}
