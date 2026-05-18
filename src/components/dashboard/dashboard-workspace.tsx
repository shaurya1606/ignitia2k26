'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { UserRole } from '@/lib/dbconfig/schema'
import { isAdminRole, isManagerRole, roleDisplayLabel } from '@/lib/atomquest/roles'
import { Card, PageShell } from '@/components/atomquest/page-shell'
import { SheetStatusBadge } from '@/components/atomquest/status-badge'
import type { AdminStatsResponse, GoalSheetResponse, TeamListResponse } from '@/lib/atomquest/types'
import { GoalSheetStatus } from '@/lib/dbconfig/atomquest'

export function DashboardWorkspace() {
    const { data: session } = useSession()
    const role = (session?.user?.role as UserRole | undefined) ?? UserRole.EMPLOYEE
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<AdminStatsResponse | null>(null)
    const [team, setTeam] = useState<TeamListResponse | null>(null)
    const [sheet, setSheet] = useState<GoalSheetResponse | null>(null)

    useEffect(() => {
        let cancelled = false
        async function load() {
            setLoading(true)
            try {
                if (isAdminRole(role)) {
                    const res = await fetch('/api/atomquest/admin/stats')
                    const json = await res.json()
                    if (res.ok && !cancelled) setStats(json as AdminStatsResponse)
                } else if (isManagerRole(role)) {
                    const res = await fetch('/api/atomquest/team')
                    const json = await res.json()
                    if (res.ok && !cancelled) setTeam(json as TeamListResponse)
                } else {
                    const res = await fetch('/api/atomquest/goal-sheet')
                    const json = await res.json()
                    if (res.ok && !cancelled) setSheet(json as GoalSheetResponse)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        void load()
        return () => {
            cancelled = true
        }
    }, [role])

    const shortcuts = isAdminRole(role)
        ? [
              { href: '/admin/atomquest', label: 'Admin governance' },
              { href: '/admin/users', label: 'User management' },
              { href: '/team', label: 'Org team view' },
              { href: '/notifications', label: 'Notifications' },
          ]
        : isManagerRole(role)
          ? [
                { href: '/team', label: 'Team reviews' },
                { href: '/goals', label: 'My goals' },
                { href: '/notifications', label: 'Notifications' },
            ]
          : [
                { href: '/goals', label: 'Goal sheet' },
                { href: '/notifications', label: 'Notifications' },
            ]

    return (
        <PageShell
            title="Dashboard"
            description={`${roleDisplayLabel(role)} overview — quick stats and shortcuts.`}
        >
            {loading ? (
                <p className="text-sm text-slate-500">Loading dashboard…</p>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {isAdminRole(role) && stats ? (
                            <>
                                <StatCard label="Employees" value={stats.totalEmployees} />
                                <StatCard label="Submitted" value={stats.submitted} />
                                <StatCard label="Approved" value={stats.approved} />
                                <StatCard
                                    label={`${stats.activeQuarter ?? 'Q'} check-in`}
                                    value={`${stats.quarterCheckInPct ?? 0}%`}
                                />
                            </>
                        ) : null}
                        {isManagerRole(role) && team ? (
                            <>
                                <StatCard label="Direct reports" value={team.team.length} />
                                <StatCard
                                    label="Pending review"
                                    value={
                                        team.team.filter(
                                            (t) => t.sheet?.status === GoalSheetStatus.SUBMITTED
                                        ).length
                                    }
                                />
                                <StatCard
                                    label="Approved"
                                    value={
                                        team.team.filter(
                                            (t) => t.sheet?.status === GoalSheetStatus.LOCKED
                                        ).length
                                    }
                                />
                                <StatCard label="FY" value={team.cycle.year} />
                            </>
                        ) : null}
                        {!isAdminRole(role) && !isManagerRole(role) && sheet ? (
                            <>
                                <StatCard label="Goals" value={sheet.goals.length} />
                                <StatCard
                                    label="Weightage"
                                    value={`${sheet.goals.reduce((s, g) => s + g.weightage, 0)}%`}
                                />
                                <StatCard label="Status" value={sheet.sheet.status} />
                                <StatCard label="Cycle" value={sheet.cycle.year} />
                            </>
                        ) : null}
                    </div>

                    {!isAdminRole(role) && !isManagerRole(role) && sheet ? (
                        <Card>
                            <h2 className="text-sm font-semibold text-slate-900 mb-2">
                                Goal sheet
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <SheetStatusBadge status={sheet.sheet.status} />
                            </div>
                            <Link
                                href="/goals"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                Open goal workspace →
                            </Link>
                        </Card>
                    ) : null}

                    <Card>
                        <h2 className="text-sm font-semibold text-slate-900 mb-3">Shortcuts</h2>
                        <div className="flex flex-wrap gap-2">
                            {shortcuts.map((s) => (
                                <Link
                                    key={s.href}
                                    href={s.href}
                                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                                >
                                    {s.label}
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </PageShell>
    )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
        </div>
    )
}
