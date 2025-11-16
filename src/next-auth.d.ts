import { UserRole } from '@/lib/dbconfig/schema'
import type { DefaultSession } from 'next-auth'
export type ExtendedUser = DefaultSession['user'] & {
    role: UserRole
    twoFactorEnabled: boolean
    isOAuth: boolean
}

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser
    }
}
