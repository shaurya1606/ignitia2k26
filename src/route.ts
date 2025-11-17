/**
 * Define application routes
 * Public routes are accessible without authentication
 * Auth routes are for login/signup
 * Protected routes require authentication
 * API auth prefix for authentication-related API endpoints
 *
 */

export const publicRoutes = ['/', '/verify-email', '/home', '/gallery', '/sponsors', '/contact', '/leaderboard', '/about', '/events', '/teams']

export const publicRoutePrefixes: string[] = []

export const authRoutes = [
    '/login',
    '/signup',
    '/error',
    '/reset-password',
    '/new-password',
]

export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/dashboard'
