// import { auth, signOut } from '@/auth'
'use client'
import { signOut } from 'next-auth/react'
import useCurrentUser from '@/lib/hooks/useCurrentUser'

const DashboardPage = () => {
    // const session = await auth() ===== server side
    // const { data: session } = useSession() ===== client side
    const user = useCurrentUser()

    const onClick = () => {
        signOut()
    }
    // console.log('Session:', session)
    return (
        <div>
            {/* get the session data  */}
            {/* {JSON.stringify(session)} */}
            {/* <form
                action={async () => {
                    'use server'
                    // await signOut()
                }}
            >
                <button type="submit">Sign out</button>
            </form> */}
            {user?.email}

            <button onClick={onClick} className="bg-amber-200">
                Sign out
            </button>
        </div>
    )
}

export default DashboardPage
