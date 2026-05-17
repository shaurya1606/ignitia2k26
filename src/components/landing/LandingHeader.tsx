import Link from 'next/link'
import { Button } from '@/components/ui/button'

type LandingHeaderProps = {
    isAuthenticated: boolean
}

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-neutral-950">
                        A
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-white">
                        AtomQuest
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm text-neutral-400 md:flex">
                    <a href="#features" className="transition hover:text-white">
                        Features
                    </a>
                    <a href="#how-it-works" className="transition hover:text-white">
                        How it works
                    </a>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    {isAuthenticated ? (
                        <Button
                            asChild
                            className="bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 hover:from-amber-400 hover:to-orange-500"
                        >
                            <Link href="/dashboard">Enter portal</Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-neutral-300 hover:bg-white/10 hover:text-white"
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 hover:from-amber-400 hover:to-orange-500"
                            >
                                <Link href="/signup">Get started</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
