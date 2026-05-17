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
            a.download = 'performiq-achievement-report.csv'
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
            title="Admin Dashboard"
            description={`FY${performanceYear} — performance cycles, compliance overview, audit trail, and shared KPIs.`}
            actions={
                <Button
                    onClick={downloadExport}
                    disabled={exporting}
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                    {exporting ? 'Exporting…' : '↓ Export CSV'}
                </Button>
            }
        >
            {toast ? <AlertBanner variant={toast.type}>{toast.text}</AlertBanner> : null}

            {/* Enterprise tab bar — underline style */}
            <div className="flex gap-0 border-b border-slate-200">
                {(
                    [
                        ['overview', 'Overview'],
                        ['audit', 'Audit Trail'],
                        ['shared', 'Shared KPIs'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={cn(
                            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                            tab === id
                                ? 'border-indigo-600 text-indigo-700'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <>
                    {/* KPI stat cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        <StatCard
                            label="Total Employees"
                            value={loading ? '—' : String(stats?.totalEmployees ?? 0)}
                        />
                        <StatCard
                            label="Submitted"
                            value={loading ? '—' : String(stats?.submitted ?? 0)}
                            sub={`${submitPct}% of workforce`}
                            accent="amber"
                        />
                        <StatCard
                            label="Approved"
                            value={loading ? '—' : String(stats?.approved ?? 0)}
                            sub={`${completionPct}% locked`}
                            accent="emerald"
                        />
                        <StatCard
                            label="Pending Review"
                            value={loading ? '—' : String(stats?.pendingReviews ?? stats?.pendingApproval ?? 0)}
                            accent="red"
                        />
                        <StatCard
                            label={`${stats?.activeQuarter ?? 'Q?'} Check-in`}
                            value={loading ? '—' : `${stats?.quarterCheckInPct ?? 0}%`}
                            {...(!loading && stats
                                ? {
                                      sub: `${stats.quarterCheckInCompleted ?? 0} with entries`,
                                  }
                                : {})}
                            accent="indigo"
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
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                                Loading charts…
                            </div>
                        </Card>
                    ) : null}

                    {/* Submission progress */}
                    <Card>
                        <CardTitle>Submission Progress</CardTitle>
                        <div className="space-y-4">
                            <ProgressBar label="Submitted" value={submitPct} color="amber" />
                            <ProgressBar label="Approved (locked)" value={completionPct} color="emerald" />
                        </div>
                    </Card>

                    {/* Manager completion table */}
                    {stats?.managers && stats.managers.length > 0 ? (
                        <Card>
                            <CardTitle>Manager Completion</CardTitle>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Manager</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reports</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Approved</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.managers.map((m) => (
                                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-3 font-medium text-slate-900">
                                                    {m.name ?? m.email}
                                                </td>
                                                <td className="py-3 px-3 text-slate-600">
                                                    {m.directReports}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="text-emerald-700 font-semibold">{m.approved}</span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className="text-amber-700 font-semibold">{m.pending}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    ) : null}

                    {/* Employee completion table */}
                    {stats?.employees && stats.employees.length > 0 ? (
                        <Card>
                            <CardTitle>Employee Goal Status</CardTitle>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-slate-50">
                                        <tr className="border-b border-slate-200 text-left">
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Department</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {stats.employees.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="py-3 px-3 font-medium text-slate-900">
                                                    {row.name ?? row.email}
                                                </td>
                                                <td className="py-3 px-3 hidden sm:table-cell text-slate-500">
                                                    {row.department ?? '—'}
                                                </td>
                                                <td className="py-3 px-3">
                                                    {row.status === 'NONE' ? (
                                                        <span className="text-xs text-slate-400 font-medium">No sheet</span>
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

                    {/* Performance cycles */}
                    <Card>
                        <CardTitle>Performance Cycles</CardTitle>
                        {cycles.length === 0 ? (
                            <p className="text-sm text-slate-500">No cycles configured for FY{performanceYear}.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phase</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Window</th>
                                            <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {cycles.map((cycle) => (
                                            <tr key={cycle.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-3 font-medium text-slate-900">{cycle.name}</td>
                                                <td className="py-3 px-3 text-slate-500 text-xs">
                                                    {formatCycleDate(cycle.opensAt)} –{' '}
                                                    {formatCycleDate(cycle.closesAt)}
                                                </td>
                                                <td className="py-3 px-3">
                                                    {isCycleWindowOpen(cycle) ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Open
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">Closed</span>
                                                    )}
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
                    <CardTitle>Audit Trail</CardTitle>
                    {auditLoading ? (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                            Loading audit entries…
                        </div>
                    ) : auditLogs.length === 0 ? (
                        <p className="text-sm text-slate-500">No audit entries recorded yet.</p>
                    ) : (
                        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-slate-50">
                                    <tr className="border-b border-slate-200 text-left">
                                        <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">When</th>
                                        <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Who</th>
                                        <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                                        <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Changes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="align-top hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-xs">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 font-medium text-slate-900">
                                                {log.changedByName ?? log.changedByEmail ?? '—'}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="text-indigo-700 font-semibold text-xs">{log.action}</span>
                                                <span className="block text-xs text-slate-400 mt-0.5">{log.entityType}</span>
                                            </td>
                                            <td className="py-3 px-3 text-xs text-slate-500 font-mono max-w-md whitespace-pre-wrap">
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
                    <CardTitle>Assign Shared KPI</CardTitle>
                    <p className="text-sm text-slate-500 mb-5">
                        Assign one KPI to multiple employees. Recipients see a{' '}
                        <strong className="text-indigo-700">Shared KPI</strong> badge — title and target are read-only; they may adjust weightage only. The{' '}
                        <strong className="text-indigo-700">primary owner</strong> check-in syncs achievement to all copies.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Title</Label>
                            <Input
                                value={sharedForm.title}
                                onChange={(e) => setSharedForm((f) => ({ ...f, title: e.target.value }))}
                                className="border-slate-200 bg-white text-slate-900 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Thrust Area</Label>
                            <select
                                value={sharedForm.thrustAreaId}
                                onChange={(e) => setSharedForm((f) => ({ ...f, thrustAreaId: e.target.value }))}
                                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {thrustAreas.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">UOM</Label>
                            <select
                                value={sharedForm.uomType}
                                onChange={(e) => setSharedForm((f) => ({ ...f, uomType: e.target.value as UomType }))}
                                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {UOM_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Target</Label>
                            <Input
                                value={sharedForm.targetValue}
                                onChange={(e) => setSharedForm((f) => ({ ...f, targetValue: e.target.value }))}
                                className="border-slate-200 bg-white text-slate-900 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Weightage %</Label>
                            <Input
                                type="number"
                                value={sharedForm.weightage}
                                onChange={(e) => setSharedForm((f) => ({ ...f, weightage: Number(e.target.value) }))}
                                className="border-slate-200 bg-white text-slate-900 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Primary Owner (syncs achievement)</Label>
                            <select
                                value={sharedForm.primaryOwnerUserId}
                                onChange={(e) => setSharedForm((f) => ({ ...f, primaryOwnerUserId: e.target.value }))}
                                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>{e.name ?? e.email}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Assign to Employees</Label>
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
                                                'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                                                selected
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                                            )}
                                        >
                                            {e.name ?? e.email}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <Button
                            onClick={assignShared}
                            disabled={assigning}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {assigning ? 'Assigning…' : 'Assign Shared KPI'}
                        </Button>
                    </div>
                </Card>
            )}
        </PageShell>
    )
}

type AccentColor = 'indigo' | 'emerald' | 'amber' | 'red'

function StatCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string
    value: string
    sub?: string
    accent?: AccentColor
}) {
    const accentMap: Record<AccentColor, string> = {
        indigo: 'text-indigo-700',
        emerald: 'text-emerald-700',
        amber: 'text-amber-700',
        red: 'text-red-600',
    }
    const accentClass = accent ? accentMap[accent] : 'text-slate-900'

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
            {sub ? <p className="text-xs text-slate-400 mt-1">{sub}</p> : null}
        </div>
    )
}

function ProgressBar({
    label,
    value,
    color = 'indigo',
    className,
}: {
    label: string
    value: number
    color?: 'indigo' | 'emerald' | 'amber'
    className?: string
}) {
    const fillMap = {
        indigo: 'bg-indigo-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
    }
    return (
        <div className={className}>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 font-medium">{label}</span>
                <span className="text-slate-900 font-semibold">{value}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className={`h-full ${fillMap[color]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, value)}%` }}
                />
            </div>
        </div>
    )
}
