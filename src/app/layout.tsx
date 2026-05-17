import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
    title: 'PerformIQ — Performance Lifecycle Management',
    description:
        'PerformIQ is an enterprise performance lifecycle management platform — structured goal-setting, quarterly check-ins, manager review workflows, and KPI governance at scale.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} font-[family-name:var(--font-poppins)] antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
