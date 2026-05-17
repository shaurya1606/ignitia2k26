'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/dbconfig/schema'
import { roleHomePath } from '@/lib/atomquest/roles'

/** Post-login entry: sends users to the correct AtomQuest workspace by role. */
export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status !== 'authenticated' || !session?.user) return
        const role = (session.user.role as UserRole | undefined) ?? UserRole.EMPLOYEE
        router.replace(roleHomePath(role))
    }, [session, status, router])

    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-neutral-400">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
            <p className="text-sm">Opening your AtomQuest workspace…</p>
        </div>
    )
}
