import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutePrefixes,
    publicRoutes,
} from '@/route'

const { auth } = NextAuth({
    ...authConfig,
})

export default auth((req) => {
    // req.auth
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isPublicRouteByPrefix = publicRoutePrefixes.some((prefix) =>
        nextUrl.pathname.startsWith(prefix)
    )
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) {
        return null
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return null
    }

    const isAccessingProtectedRoute = !isPublicRoute && !isPublicRouteByPrefix

    if (!isLoggedIn && isAccessingProtectedRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }
        nextUrl.searchParams.set('callbackUrl', callbackUrl)
        const encodeCallbackUrl = encodeURIComponent(callbackUrl)
        return Response.redirect(
            new URL(`/login?callbackUrl=${encodeCallbackUrl}`, nextUrl)
        )
    }

    return null
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
