import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/dbconfig/db'
import { findUserById } from '@/lib/queries/users/select'
import { UserRole, accountsTable, usersTable } from '@/lib/dbconfig/schema'
import { updateUserEmailVerified } from '@/lib/queries/users/update'
import { findTwoFactorTokenConfirmationByUserId } from '@/lib/queries/token/select'
import { deleteTwoFactorConfirmationById } from '@/lib/queries/token/delete'
import { findTwoAccountsByUserId } from './lib/queries/accounts/select'



export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/login',
        error: '/error', // Error code passed in query string as ?error=
    },
    events: {
        async linkAccount({ user, account }) {
            console.log('=== LINK ACCOUNT EVENT TRIGGERED ===')
            console.log('User:', JSON.stringify(user, null, 2))
            console.log('Account:', JSON.stringify(account, null, 2))
            console.log('Provider:', account.provider)
            console.log('Provider Account ID:', account.providerAccountId)
            console.log('User ID:', user.id)

            try {
                await updateUserEmailVerified(user?.id as string, new Date())
                console.log('Email verified successfully for user:', user.id)
            } catch (error) {
                console.error('Error updating email verification:', error)
            }
        },
    },
    callbacks: {
        // stop unverified user
        async signIn({ user, account }) {
            // Allow OAuth without email verification
            // if more provider are added update it here by adding more logic if needed

            // For OAuth providers (google, github, linkedin), allow sign-in
            // The adapter will create the user if they don't exist
            if (account?.provider !== 'credentials') {
                console.log('=== SIGN IN CALLBACK - OAUTH ===')
                console.log('Provider:', account?.provider)
                console.log('User ID:', user?.id)
                console.log('User Email:', user?.email)
                console.log('Account Type:', account?.type)
                console.log('Provider Account ID:', account?.providerAccountId)
                return true
            }

            // For credentials provider, check user exists and is verified
            const existingUser = await findUserById(user?.id as string)

            if (!existingUser) {
                console.log('Credentials sign-in failed: User not found')
                return false
            }

            if (!existingUser.emailVerified) {
                // Deny sign in if email is not verified
                console.log('Credentials sign-in failed: Email not verified')
                return false
            }

            // 2FA check for credentials login
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation =
                    await findTwoFactorTokenConfirmationByUserId(
                        existingUser.id
                    )

                if (!twoFactorConfirmation) {
                    console.log('2FA failed: No confirmation found')
                    return false
                }

                const hasExpired = twoFactorConfirmation.expires
                    ? new Date(twoFactorConfirmation.expires) < new Date()
                    : false

                if (hasExpired) {
                    console.log('2FA failed: Token expired')
                    if (twoFactorConfirmation.id) {
                        await deleteTwoFactorConfirmationById(
                            twoFactorConfirmation.id
                        )
                    }
                    return false
                }

                console.log('Two Factor Confirmation found:', {
                    twoFactorConfirmation,
                })

                // Delete two factor confirmation after successful sign in
                if (twoFactorConfirmation.id) {
                    await deleteTwoFactorConfirmationById(
                        twoFactorConfirmation.id
                    )
                }
            }

            return true
        },
        async session({ token, session }) {
            console.log('Session:', { sessionToken: token, session })
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
                // session.user.customField = "some value" // Example of adding a custom field
            }

            if (session.user) {
                session.user.twoFactorEnabled =
                    token.isTwoFactorEnabled as boolean
            }

            if (session.user) {
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.user.isOAuth = token.isOAuth as boolean
            }

            return session
        },
        async jwt({ token }) {
            console.log('JWT Token:', { token })
            if (!token.sub) return token

            const existingUser = await findUserById(token.sub)

            if (!existingUser) return token

            const existingAccount = await findTwoAccountsByUserId(
                existingUser.id
            )

            // required to update the information in real time
            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image
            token.role = existingUser.role
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

            return token
        },
    },
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: usersTable,
        accountsTable: accountsTable,
    }),
    session: { strategy: 'jwt' },
})
