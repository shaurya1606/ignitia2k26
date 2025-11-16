import Link from "next/link";

const Navbar = () => {
  return (
    <>
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="shrink-0">
                        <Link href="/" className="text-2xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                            AuthDemo
                        </Link>
                    </div>
                    <div className="">
                        <ul className="flex gap-8 items-center">
                            <li>
                                <Link href="/home" className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group">
                                    Home
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group">
                                    Contact
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </>
  )
}

export default Navbar