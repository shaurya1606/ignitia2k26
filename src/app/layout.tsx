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
    title: 'AtomQuest Goal Portal',
    description:
        'Set goals, track quarterly achievement, and align your team with AtomQuest — the Ignitia 2026 performance portal.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {


    return (
        <html lang="en" className="dark">
            <body
                className={`${poppins.variable} font-[family-name:var(--font-poppins)] antialiased`}
            >
               {children}
            </body>
        </html>
    )
}
