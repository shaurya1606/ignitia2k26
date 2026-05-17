'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAutoDismissToast } from '@/lib/hooks/useAutoDismissToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertBanner } from '@/components/atomquest/alert-banner'
import { Card, CardTitle, PageShell } from '@/components/atomquest/page-shell'
import type { AdminStatsResponse, AuditLogRow, ThrustAreaOption } from '@/lib/atomquest/types'
import { UOM_OPTIONS } from '@/lib/atomquest/types'
import type { SelectPerformanceCycle } from '@/lib/dbconfig/atomquest'
import { UomType } from '@/lib/dbconfig/atomquest'
import { formatAuditChanges } from '@/lib/atomquest/audit-format'
import { formatCycleDate, isCycleWindowOpen } from '@/lib/atomquest/cycle-utils'
import { AdminCharts } from '@/components/atomquest/admin-charts'
import { SheetStatusBadge } from '@/components/atomquest/status-badge'
import { cn } from '@/lib/utils'

type AdminTab = 'overview' | 'audit' | 'shared'

type EmployeeOption = { id: string; name: string | null; email: string }

type AdminWorkspaceProps = {
    cycles: SelectPerformanceCycle[]
    performanceYear: number
    employees: EmployeeOption[]
    thrustAreas: ThrustAreaOption[]
}

export function AdminWorkspace({
    cycles,
    performanceYear,
    employees,
    thrustAreas,
}: AdminWorkspaceProps) {
    const [tab, setTab] = useState<AdminTab>('overview')
    const [stats, setStats] = useState<AdminStatsResponse | null>(null)
    const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([])
    const [loading, setLoading] = useState(true)
    const [auditLoading, setAuditLoading] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [exporting, setExporting] = useState(false)
    const [assigning, setAssigning] = useState(false)

    useAutoDismissToast(toast, () => setToast(null))

    const [sharedForm, setSharedForm] = useState({
        title: 'Company-wide cost reduction',
        description: 'Reduce operating cost vs plan',
        thrustAreaId: thrustAreas[0]?.id ?? '',
        uomType: UomType.PERCENT_MIN as UomType,
        targetValue: '10',
        weightage: 15,
        primaryOwnerUserId: employees[0]?.id ?? '',
        employeeIds: employees.slice(0, 2).map((e) => e.id),
    })

    const loadStats = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/atomquest/admin/stats')
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Failed to load stats')
            setStats(json as AdminStatsResponse)
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Failed to load' })
        } finally {
            setLoading(false)
        }
    }, [])

    const loadAudit = useCallback(async () => {
        setAuditLoading(true)
        try {
            const res = await fetch('/api/atomquest/admin/audit')
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Failed to load audit')
            setAuditLogs(json.logs ?? [])
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Audit load failed' })
        } finally {
            setAuditLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadStats()
    }, [loadStats])

    useEffect(() => {
        if (tab === 'audit') void loadAudit()
    }, [tab, loadAudit])

    const downloadExport = async () => {
        setExporting(true)
        try {
            const res = await fetch('/api/atomquest/admin/export')
            if (!res.ok) throw new Error('Export failed')
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'atomquest-achievement-report.csv'
            a.click()
            URL.revokeObjectURL(url)
            setToast({ type: 'success', text: 'Export downloaded.' })
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Export failed' })
        } finally {
            setExporting(false)
        }
    }

    const assignShared = async () => {
        setAssigning(true)
        setToast(null)
        try {
            const res = await fetch('/api/atomquest/admin/shared-goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...sharedForm,
                    employeeIds: sharedForm.employeeIds,
                }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Assign failed')
            setToast({
                type: 'success',
                text: `Shared KPI assigned to ${json.assignedCount} employee(s).`,
            })
        } catch (e) {
            setToast({ type: 'error', text: e instanceof Error ? e.message : 'Assign failed' })
        } finally {
            setAssigning(false)
        }
    }

    const completionPct = stats?.totalEmployees
        ? Math.round((stats.approved / stats.totalEmployees) * 100)
        : 0
    const submitPct = stats?.totalEmployees
        ? Math.round((stats.submitted / stats.totalEmployees) * 100)
        : 0

    return (
        <PageShell
            title="AtomQuest admin"
            description={`FY${performanceYear} — cycles, compliance, audit trail, and shared KPIs.`}
            actions={
                <Button onClick={downloadExport} disabled={exporting} variant="outline">
                    {exporting ? 'Exporting…' : 'Export CSV'}
                </Button>
            }
        >
            {toast ? <AlertBanner variant={toast.type}>{toast.text}</AlertBanner> : null}

            <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-2">
                {(
                    [
                        ['overview', 'Overview'],
                        ['audit', 'Audit trail'],
                        ['shared', 'Shared goals'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={cn(
                            'px-4 py-2 text-sm font-medium rounded-md',
                            tab === id
                                ? 'bg-white text-black'
                                : 'text-neutral-400 hover:bg-neutral-800'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Employees" value={loading ? '—' : String(stats?.totalEmployees ?? 0)} />
                        <StatCard label="Submitted" value={loading ? '—' : String(stats?.submitted ?? 0)} sub={`${submitPct}% of team`} />
                        <StatCard label="Approved" value={loading ? '—' : String(stats?.approved ?? 0)} sub={`${completionPct}% locked`} />
                        <StatCard label="Pending review" value={loading ? '—' : String(stats?.pendingReviews ?? stats?.pendingApproval ?? 0)} />
                        <StatCard
                            label={`${stats?.activeQuarter ?? 'Q'} check-in`}
                            value={loading ? '—' : `${stats?.quarterCheckInPct ?? 0}%`}
                            {...(!loading && stats
                                ? {
                                      sub: `${stats.quarterCheckInCompleted ?? 0} with entries`,
                                  }
                                : {})}
                        />
                    </div>

                    {!loading && stats ? (
                        <AdminCharts
                            submitPct={submitPct}
                            approvalPct={completionPct}
                            achievementData={stats.achievementDistribution ?? []}
                            managerData={(stats.managers ?? []).map((m) => ({
                                name: (m.name ?? m.email).split(' ')[0] ?? m.email,
                                approved: m.approved,
                                pending: m.pending,
                            }))}
                        />
                    ) : loading ? (
                        <Card>
                            <p className="text-sm text-neutral-400">Loading charts…</p>
                        </Card>
                    ) : null}

                    <Card>
                        <CardTitle>Submission progress</CardTitle>
                        <ProgressBar label="Submitted" value={submitPct} />
                        <ProgressBar label="Approved (locked)" value={completionPct} className="mt-3" />
                    </Card>

                    {stats?.managers && stats.managers.length > 0 ? (
                        <Card>
                            <CardTitle>Manager completion</CardTitle>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                            <th className="py-2 pr-4">Manager</th>
                                            <th className="py-2 pr-4">Reports</th>
                                            <th className="py-2 pr-4">Approved</th>
                                            <th className="py-2">Pending</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.managers.map((m) => (
                                            <tr key={m.id} className="border-b border-neutral-800/50">
                                                <td className="py-2 pr-4 text-white">
                                                    {m.name ?? m.email}
                                                </td>
                                                <td className="py-2 pr-4 text-neutral-400">
                                                    {m.directReports}
                                                </td>
                                                <td className="py-2 pr-4 text-emerald-400">
                                                    {m.approved}
                                                </td>
                                                <td className="py-2 text-amber-400">{m.pending}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    ) : null}

                    {stats?.employees && stats.employees.length > 0 ? (
                        <Card>
                            <CardTitle>Employee completion</CardTitle>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-neutral-950">
                                        <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                            <th className="py-2 pr-4">Employee</th>
                                            <th className="py-2 pr-4 hidden sm:table-cell">Department</th>
                                            <th className="py-2">Sheet status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.employees.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-neutral-800/50"
                                            >
                                                <td className="py-2 pr-4 text-white">
                                                    {row.name ?? row.email}
                                                </td>
                                                <td className="py-2 pr-4 hidden sm:table-cell text-neutral-400">
                                                    {row.department ?? '—'}
                                                </td>
                                                <td className="py-2">
                                                    {row.status === 'NONE' ? (
                                                        <span className="text-neutral-500">No sheet</span>
                                                    ) : (
                                                        <SheetStatusBadge status={row.status} />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    ) : null}

                    <Card>
                        <CardTitle>Performance cycles</CardTitle>
                        {cycles.length === 0 ? (
                            <p className="text-sm text-neutral-400">No cycles for FY{performanceYear}.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                            <th className="py-3 pr-4">Phase</th>
                                            <th className="py-3 pr-4">Window</th>
                                            <th className="py-3 pr-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cycles.map((cycle) => (
                                            <tr key={cycle.id} className="border-b border-neutral-800/60">
                                                <td className="py-3 pr-4 text-white">{cycle.name}</td>
                                                <td className="py-3 pr-4 text-neutral-400 text-xs">
                                                    {formatCycleDate(cycle.opensAt)} –{' '}
                                                    {formatCycleDate(cycle.closesAt)}
                                                </td>
                                                <td className={isCycleWindowOpen(cycle) ? 'text-emerald-400' : 'text-neutral-500'}>
                                                    {isCycleWindowOpen(cycle) ? 'Open' : 'Closed'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </>
            )}

            {tab === 'audit' && (
                <Card>
                    <CardTitle>Audit trail</CardTitle>
                    {auditLoading ? (
                        <p className="text-sm text-neutral-400">Loading audit entries…</p>
                    ) : auditLogs.length === 0 ? (
                        <p className="text-sm text-neutral-400">No audit entries yet.</p>
                    ) : (
                        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-neutral-950">
                                    <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                        <th className="py-2 pr-3">When</th>
                                        <th className="py-2 pr-3">Who</th>
                                        <th className="py-2 pr-3">Action</th>
                                        <th className="py-2">Changes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="border-b border-neutral-800/50 align-top">
                                            <td className="py-3 pr-3 text-neutral-400 whitespace-nowrap text-xs">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="py-3 pr-3 text-white">
                                                {log.changedByName ?? log.changedByEmail ?? '—'}
                                            </td>
                                            <td className="py-3 pr-3">
                                                <span className="text-amber-200 font-medium">{log.action}</span>
                                                <span className="block text-xs text-neutral-500">{log.entityType}</span>
                                            </td>
                                            <td className="py-3 text-xs text-neutral-400 font-mono max-w-md whitespace-pre-wrap">
                                                {formatAuditChanges(log.changes)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {tab === 'shared' && (
                <Card>
                    <CardTitle>Assign shared KPI (demo)</CardTitle>
                    <p className="text-sm text-neutral-400 mb-4">
                        Assign one KPI to multiple employees. Recipients see a{' '}
                        <strong className="text-blue-300">Shared KPI</strong> badge — title and target are read-only; they may adjust weightage only. The{' '}
                        <strong className="text-blue-300">primary owner</strong> check-in syncs achievement to all copies.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Title</Label>
                            <Input
                                value={sharedForm.title}
                                onChange={(e) => setSharedForm((f) => ({ ...f, title: e.target.value }))}
                                className="bg-neutral-900 border-neutral-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Thrust area</Label>
                            <select
                                value={sharedForm.thrustAreaId}
                                onChange={(e) => setSharedForm((f) => ({ ...f, thrustAreaId: e.target.value }))}
                                className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white"
                            >
                                {thrustAreas.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>UOM</Label>
                            <select
                                value={sharedForm.uomType}
                                onChange={(e) => setSharedForm((f) => ({ ...f, uomType: e.target.value as UomType }))}
                                className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white"
                            >
                                {UOM_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Target</Label>
                            <Input
                                value={sharedForm.targetValue}
                                onChange={(e) => setSharedForm((f) => ({ ...f, targetValue: e.target.value }))}
                                className="bg-neutral-900 border-neutral-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Weightage %</Label>
                            <Input
                                type="number"
                                value={sharedForm.weightage}
                                onChange={(e) => setSharedForm((f) => ({ ...f, weightage: Number(e.target.value) }))}
                                className="bg-neutral-900 border-neutral-700"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Primary owner (syncs achievement)</Label>
                            <select
                                value={sharedForm.primaryOwnerUserId}
                                onChange={(e) => setSharedForm((f) => ({ ...f, primaryOwnerUserId: e.target.value }))}
                                className="flex h-9 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-white"
                            >
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>{e.name ?? e.email}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Assign to employees</Label>
                            <div className="flex flex-wrap gap-2">
                                {employees.map((e) => {
                                    const selected = sharedForm.employeeIds.includes(e.id)
                                    return (
                                        <button
                                            key={e.id}
                                            type="button"
                                            onClick={() =>
                                                setSharedForm((f) => ({
                                                    ...f,
                                                    employeeIds: selected
                                                        ? f.employeeIds.filter((id) => id !== e.id)
                                                        : [...f.employeeIds, e.id],
                                                }))
                                            }
                                            className={cn(
                                                'px-3 py-1 rounded-full text-xs border',
                                                selected
                                                    ? 'bg-white text-black border-white'
                                                    : 'border-neutral-700 text-neutral-400'
                                            )}
                                        >
                                            {e.name ?? e.email}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <Button className="mt-4" onClick={assignShared} disabled={assigning}>
                        {assigning ? 'Assigning…' : 'Assign shared KPI'}
                    </Button>
                </Card>
            )}
        </PageShell>
    )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            {sub ? <p className="text-xs text-neutral-500 mt-1">{sub}</p> : null}
        </div>
    )
}

function ProgressBar({ label, value, className }: { label: string; value: number; className?: string }) {
    return (
        <div className={className}>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-400">{label}</span>
                <span className="text-white font-medium">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, value)}%` }}
                />
            </div>
        </div>
    )
}

