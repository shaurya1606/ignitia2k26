'use client'

import React, { useEffect, useState } from 'react'
import MinimalPreloader from '@/components/landing/MinimalPreloader'

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        if (document.readyState === 'complete') {
            setLoaded(true)
            return
        }

        const onLoad = () => setLoaded(true)
        window.addEventListener('load', onLoad)

        // Fallback in case load event doesn't fire quickly
        const fallback = setTimeout(() => setLoaded(true), 3000)

        return () => {
            window.removeEventListener('load', onLoad)
            clearTimeout(fallback)
        }
    }, [])

    return (
        <>
            <MinimalPreloader loaded={loaded} />
            {children}
        </>
    )
}
