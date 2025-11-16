'use client'

import { signOutUser } from '@/lib/helpers/signOut'
import { UserButton } from '../../lib/helpers/log-out-button'

const Navbar = () => {
    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-black border-b border-neutral-800">
            <div className="text-white">Logo</div>
            <div className="flex items-center space-x-4">
                <a href="/client" className="text-white">
                    Client
                </a>
                <a href="/server" className="text-white">
                    Server
                </a>
                <a href="/settings" className="text-white">
                    Settings
                </a>
                <a href="/admin" className="text-white">
                    Admin
                </a>
            </div>
            <div className="flex items-center space-x-4">
                <UserButton />
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={signOutUser}
                >
                    Sign Out
                </button>
            </div>
        </nav>
    )
}

export default Navbar
