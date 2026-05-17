'use client'

import Link from 'next/link'
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
        'transition-colors',
        active ? 'text-white font-medium' : 'text-neutral-300 hover:text-white'
    )
}

const Navbar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()
    const role = session?.user?.role as UserRole | undefined
    const home = roleHomePath(role ?? UserRole.EMPLOYEE)

    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-black border-b border-neutral-800">
            <div className="flex items-center gap-3 min-w-0">
                <Link href={session ? home : '/'} className="text-white font-semibold shrink-0">
                    AtomQuest
                </Link>
                {session?.user ? (
                    <span className="hidden sm:inline text-xs text-neutral-500 border border-neutral-800 rounded px-2 py-0.5">
                        {roleDisplayLabel(role)}
                    </span>
                ) : null}
            </div>
            <div className="flex items-center space-x-4 text-sm">
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
            <div className="flex items-center space-x-4">
                <UserButton />
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500 transition-colors"
                    onClick={signOutUser}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Navbar
