'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, PageShell } from '@/components/atomquest/page-shell'
import { EmptyState } from '@/components/atomquest/empty-state'
import { SheetStatusBadge } from '@/components/atomquest/status-badge'
import { isAdminRole } from '@/lib/atomquest/roles'
import { UserRole } from '@/lib/dbconfig/schema'
import type { TeamListResponse } from '@/lib/atomquest/types'

export function TeamWorkspace() {
    const { data: session } = useSession()
    const sessionRole = session?.user?.role as UserRole | undefined

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<TeamListResponse | null>(null)

    const isAdminView =
        data?.viewMode === 'admin' ||
        isAdminRole(sessionRole ?? UserRole.EMPLOYEE)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/atomquest/team')
            const json = await res.json()
            if (!res.ok) throw new Error(json.error ?? 'Failed to load team')
            setData(json as TeamListResponse)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    return (
        <PageShell
            title={isAdminView ? 'Organisation Goals' : 'My Team'}
            description={
                isAdminView
                    ? 'Org-wide employee goal status. Use Admin for exports and shared KPIs.'
                    : 'Review goal submissions, approve sheets, and record quarterly check-in comments.'
            }
        >
            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-medium">
                    {error}
                </div>
            ) : null}

            {isAdminView ? (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                    <span className="font-semibold">Admin view</span> — showing all employees.{' '}
                    <Link href="/admin/atomquest" className="underline font-medium hover:text-indigo-900">
                        Go to Admin Dashboard
                    </Link>{' '}
                    for exports and shared KPI assignment.
                </div>
            ) : null}

            <Card>
                <CardTitle>
                    {isAdminView ? 'All Employees' : 'Direct Reports'}
                    {data?.cycle ? (
                        <span className="ml-2 text-xs font-normal text-slate-400 normal-case tracking-normal">
                            {data.cycle.name} · FY{data.cycle.year}
                        </span>
                    ) : null}
                </CardTitle>

                {loading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                        Loading team…
                    </div>
                ) : !data?.team.length ? (
                    <EmptyState
                        title={isAdminView ? 'No employees yet' : 'No direct reports'}
                        description={
                            isAdminView
                                ? 'Seed demo data or add employees to see org-wide status here.'
                                : 'Assign employees to this manager in the directory to enable reviews.'
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee</th>
                                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                                        Department
                                    </th>
                                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.team.map(({ user, sheet }) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="py-3 px-3">
                                            <p className="font-medium text-slate-900">
                                                {user.name ?? user.email}
                                            </p>
                                            <p className="text-xs text-slate-400 sm:hidden mt-0.5">
                                                {user.department ?? '—'}
                                            </p>
                                        </td>
                                        <td className="py-3 px-3 hidden sm:table-cell text-slate-500">
                                            {user.department ?? '—'}
                                        </td>
                                        <td className="py-3 px-3">
                                            {sheet ? (
                                                <SheetStatusBadge status={sheet.status} />
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium">No sheet</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 text-xs"
                                            >
                                                <Link href={`/team/${user.id}`}>
                                                    Review →
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </PageShell>
    )
}
