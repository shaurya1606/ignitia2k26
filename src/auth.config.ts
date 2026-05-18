import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import LinkedIn from 'next-auth/providers/linkedin'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { LoginFormSchema } from './lib/schema/authSchema'
import { findUserByEmail } from './lib/queries/users/select'
import { UserRole } from './lib/dbconfig/schema'
import bcrypt from 'bcryptjs'

export default {
    providers: [
        GitHub,
        Google,
        LinkedIn,
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = LoginFormSchema.safeParse(credentials)
                if (!parsedCredentials.success) {
                    return null
                }

                const { email, password } = parsedCredentials.data
                const normalizedEmail = email.trim().toLowerCase()

                const user = await findUserByEmail(normalizedEmail)
                if (!user || !user.password) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                )
                if (!passwordMatch) {
                    return null
                }

                const name = user.name

                return {
                    id: user.id,
                    email: user.email,
                    name: name?.length ? name : user.email,
                    role: (user.role ?? UserRole.EMPLOYEE) as UserRole,
                }
            },
        }),
    ],
} satisfies NextAuthConfig
