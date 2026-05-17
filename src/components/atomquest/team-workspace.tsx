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
            title={isAdminView ? 'Organization goals' : 'My team'}
            description={
                isAdminView
                    ? 'Org-wide employee goal status. Use Admin for exports and shared KPIs.'
                    : 'Review goal submissions, approve sheets, and record quarterly check-in comments.'
            }
        >
            {error ? (
                <div className="rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            ) : null}

            {isAdminView ? (
                <div className="rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-300">
                    Viewing as <strong>Admin</strong> — all employees. Open a row to review; full controls are on{' '}
                    <Link href="/admin/atomquest" className="text-white underline">
                        Admin dashboard
                    </Link>
                    .
                </div>
            ) : null}

            <Card>
                <CardTitle>
                    {isAdminView ? 'All employees' : 'Direct reports'}
                    {data?.cycle ? (
                        <span className="ml-2 text-sm font-normal text-neutral-500">
                            {data.cycle.name} · FY{data.cycle.year}
                        </span>
                    ) : null}
                </CardTitle>

                {loading ? (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
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
                                <tr className="border-b border-neutral-800 text-left text-neutral-500">
                                    <th className="py-3 pr-4 font-medium">Employee</th>
                                    <th className="py-3 pr-4 font-medium hidden sm:table-cell">
                                        Department
                                    </th>
                                    <th className="py-3 pr-4 font-medium">Status</th>
                                    <th className="py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.team.map(({ user, sheet }) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-neutral-800/60 last:border-0"
                                    >
                                        <td className="py-3 pr-4">
                                            <p className="font-medium text-white">
                                                {user.name ?? user.email}
                                            </p>
                                            <p className="text-xs text-neutral-500 sm:hidden">
                                                {user.department ?? '—'}
                                            </p>
                                        </td>
                                        <td className="py-3 pr-4 hidden sm:table-cell text-neutral-400">
                                            {user.department ?? '—'}
                                        </td>
                                        <td className="py-3 pr-4">
                                            {sheet ? (
                                                <SheetStatusBadge status={sheet.status} />
                                            ) : (
                                                <span className="text-neutral-500">No sheet</span>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/team/${user.id}`}>
                                                    Review
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
