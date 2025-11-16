'use client'
import { LoginForm } from '@/components/auth/LoginForm'

const LogInPage = ({}) => {
    return (
        <div className="min-h-screen flex items-center justify-center  from-neutral-900 to-black p-4">
            <LoginForm
                title="Welcome Back"
                subtitle="Please enter your credentials"
                buttonLabel="Log In"
                buttonHref="/dashboard"
            />
        </div>
    )
}

export default LogInPage
