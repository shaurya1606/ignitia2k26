'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOutUser } from '@/lib/helpers/signOut'
import { UserButton } from '../../lib/helpers/log-out-button'
import { UserRole } from '@/lib/dbconfig/schema'
import {
    isAdminRole,
    isEmployeeRole,
    isManagerRole,
    roleDisplayLabel,
    roleHomePath,
} from '@/lib/atomquest/roles'
import { cn } from '@/lib/utils'

function navLinkClass(active: boolean) {
    return cn(
        'text-sm transition-colors px-3 py-2 rounded-md font-medium',
        active
            ? 'text-indigo-700 bg-indigo-50'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    )
}

const Navbar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const role = session?.user?.role as UserRole | undefined
    const home = roleHomePath(role ?? UserRole.EMPLOYEE)

    return (
        <nav className="w-full sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">

                    {/* Logo */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href={session ? home : '/'}
                            className="flex items-center gap-2 shrink-0"
                        >
                            <Image
                                src="/logo.jpg"
                                alt="PerformIQ"
                                width={28}
                                height={28}
                                className="rounded-md object-contain"
                                priority
                            />
                            <span className="text-sm font-semibold text-slate-900 tracking-tight">
                                PerformIQ
                            </span>
                        </Link>
                        {session?.user ? (
                            <span className="hidden sm:inline text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-0.5">
                                {roleDisplayLabel(role)}
                            </span>
                        ) : null}
                    </div>

                    {/* Nav links */}
                    <div className="flex items-center gap-1">
                        {(isEmployeeRole(role ?? UserRole.EMPLOYEE) ||
                            isManagerRole(role ?? UserRole.MANAGER) ||
                            isAdminRole(role ?? UserRole.ADMIN)) && (
                            <Link href="/goals" className={navLinkClass(pathname === '/goals')}>
                                Goals
                            </Link>
                        )}
                        {role && (isManagerRole(role) || isAdminRole(role)) && (
                            <Link
                                href="/team"
                                className={navLinkClass(
                                    pathname === '/team' || pathname.startsWith('/team/')
                                )}
                            >
                                Team
                            </Link>
                        )}
                        {role && isAdminRole(role) && (
                            <Link
                                href="/admin/atomquest"
                                className={navLinkClass(pathname.startsWith('/admin/atomquest'))}
                            >
                                Admin
                            </Link>
                        )}
                        <Link
                            href="/settings"
                            className={navLinkClass(pathname === '/settings')}
                        >
                            Settings
                        </Link>
                    </div>

                    {/* User actions */}
                    <div className="flex items-center gap-2">
                        <UserButton />
                        <button
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors bg-white hover:bg-slate-50"
                            onClick={signOutUser}
                        >
                            Sign out
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
