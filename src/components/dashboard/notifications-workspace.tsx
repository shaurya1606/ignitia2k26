'use client'

import { useEffect, useState } from 'react'
import { Card, PageShell } from '@/components/atomquest/page-shell'

type NotificationItem = {
    id: string
    title: string
    body: string
    createdAt: string
    actor: string
}

export function NotificationsWorkspace() {
    const [items, setItems] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        void (async () => {
            try {
                const res = await fetch('/api/atomquest/notifications')
                const json = await res.json()
                if (res.ok) setItems(json.items ?? [])
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <PageShell
            title="Notifications"
            description="Recent workflow activity from the audit trail."
        >
            {loading ? (
                <p className="text-sm text-slate-500">Loading notifications…</p>
            ) : items.length === 0 ? (
                <Card>
                    <p className="text-sm text-slate-500">No notifications yet.</p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {items.map((n) => (
                        <Card key={n.id} className="!p-4">
                            <div className="flex justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {n.title}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                                    <p className="text-xs text-slate-400 mt-1">{n.actor}</p>
                                </div>
                                <time className="text-xs text-slate-400 shrink-0">
                                    {new Date(n.createdAt).toLocaleString()}
                                </time>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageShell>
    )
}

