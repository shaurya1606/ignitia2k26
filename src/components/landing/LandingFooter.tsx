import Link from 'next/link'

export function LandingFooter() {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-white/10 py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                <p className="text-sm text-neutral-500">
                    © {year} Ignitia · AtomQuest Goal Portal
                </p>
                <div className="flex gap-6 text-sm text-neutral-400">
                    <Link href="/login" className="hover:text-white">
                        Log in
                    </Link>
                    <Link href="/signup" className="hover:text-white">
                        Sign up
                    </Link>
                </div>
            </div>
        </footer>
    )
}
