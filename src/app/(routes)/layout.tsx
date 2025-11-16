import Navigationbar from './_components/Navbar'

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
    
                <header>
                    <nav>
                        <Navigationbar />
                    </nav>
                </header>
                <main>{children}</main>

        </>
    )
}

export default RoutesLayout