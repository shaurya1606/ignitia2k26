'use client'
import { SignupForm } from '@/components/auth/SignupForm'

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center from-neutral-900 to-black p-4">
            <SignupForm
                title="Create an Account"
                subtitle="Join us and start your journey"
                buttonLabel="Create Account"
                buttonHref="/dashboard"
            />
        </div>
    )
}

export default SignUpPage
