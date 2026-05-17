'use client'
import { SignupForm } from '@/components/auth/SignupForm'

const SignUpPage = () => {
    return (
        <SignupForm
            title="Create your account"
            subtitle="Join PerformIQ to start managing your performance goals"
            buttonLabel="Create account"
            buttonHref="/dashboard"
        />
    )
}

export default SignUpPage

