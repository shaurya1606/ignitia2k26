import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Navbar from '@/components/dashboard/Navbar'

const AuthProvider = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col w-full gap-y-10 items-center justify-start bg-gradient-to-br from-neutral-900 to-black p-4">
                <Navbar />
                {children}
            </div>
        </SessionProvider>
    )
}

export default AuthProvider
