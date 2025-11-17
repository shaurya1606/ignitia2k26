'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandLinkedin,
    IconEye,
    IconEyeOff,
    IconX,
} from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SignupFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'

interface SignupFormProps {
    title?: string
    subtitle?: string
    buttonLabel?: string
    buttonHref?: string
    mode?: 'modal' | 'redirect'
}

export function SignupForm({
    title,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
    mode,
}: SignupFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)

    type SignupValues = z.infer<typeof SignupFormSchema>

    const form = useForm<SignupValues>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: SignupValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/signup',
                    {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ?? 'Account created successfully.'
                const isEmailSent = response.data?.emailSent ?? false

                setSuccess(message)
                setEmailSent(isEmailSent)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message ??
                        'Unable to process the request.'
                    setError(message)
                } else {
                    setError('An unexpected error occurred. Please try again.')
                }
            }
        })
    }

    const handleClose = () => {
        router.back()
    }

    const onClickSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
    }

    const submitLabel = buttonLabel ?? 'Sign Up'

    const isModal = mode === 'modal'

    return (
        <div
            className={cn(
                'relative mx-auto w-full max-w-md',
                isModal
                    ? [
                          'px-6 py-6 sm:px-8 sm:py-8',
                          'border-2 border-yellow-400 bg-black/80 backdrop-blur-xl',
                          'shadow-[0_2px_8px_rgba(255,215,0,0.12)]',
                      ]
                    : 'shadow-input bg-white p-4 md:p-8 dark:bg-black border-2 border-yellow-400 shadow-[0_2px_8px_rgba(255,215,0,0.12)]'
            )}
        >
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-yellow-400/40"
                aria-label="Close"
                type="button"
            >
                <IconX className="h-5 w-5 text-yellow-400 dark:hover:text-white" />
            </button>

            <div className="mb-6 text-center">
                <p className="mb-1 text-[11px] font-semibold tracking-[0.35em] uppercase text-amber-300/80">
                    Ignitia 2K26
                </p>
                <h2 className="text-2xl font-black tracking-tight text-neutral-800 dark:text-amber-50">
                    {title}
                </h2>
                <p className="mt-2 max-w-sm text-xs sm:text-sm text-neutral-600 dark:text-neutral-300/90">
                    {subtitle}
                </p>
            </div>

            <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <Controller
                        name="firstName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer
                                data-invalid={fieldState.invalid}
                                className="md:flex-1"
                            >
                                <Label
                                    htmlFor="firstName"
                                    className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200/80"
                                >
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="Tyler"
                                    type="text"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="given-name"
                                    disabled={isPending}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer
                                data-invalid={fieldState.invalid}
                                className="md:flex-1"
                            >
                                <Label
                                    htmlFor="lastName"
                                    className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200/80"
                                >
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Durden"
                                    type="text"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="family-name"
                                    disabled={isPending}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                </div>

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label
                                htmlFor="email"
                                className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200/80"
                            >
                                Email Cipher
                            </Label>
                                <Input
                                    id="email"
                                    placeholder="ninja.ignitia@domain.com"
                                type="email"
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="email"
                                disabled={isPending}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label
                                htmlFor="password"
                                className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200/80"
                            >
                                Secret Key
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                >
                                    {showPassword ? (
                                        <IconEyeOff className="h-5 w-5 text-yellow-400" />
                                    ) : (
                                        <IconEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <LabelInputContainer
                            data-invalid={fieldState.invalid}
                            className="mb-4"
                        >
                            <Label
                                htmlFor="confirmPassword"
                                className="text-xs font-medium uppercase tracking-[0.22em] text-amber-200/80"
                            >
                                Confirm Secret
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="new-password"
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                >
                                    {showConfirmPassword ? (
                                        <IconEyeOff className="h-5 w-5 text-yellow-400" />
                                    ) : (
                                        <IconEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

                <div className="my-4">
                    <FormError message={error} />
                    <FormSuccess message={success} />
                </div>

                <Button
                    className={cn(
                        'group/btn relative block h-11 w-full overflow-hidden font-semibold uppercase tracking-[0.18em]',
                        'bg-linear-to-r from-amber-500 via-yellow-300 to-amber-400 text-zinc-950',
                        'shadow-[0_2px_8px_rgba(255,215,0,0.10)] transition-all duration-250',
                        'border-2 border-yellow-400',
                        'hover:shadow-[0_0_16px_rgba(255,215,0,0.25)] hover:brightness-105',
                        'disabled:from-zinc-600 disabled:via-zinc-500 disabled:to-zinc-600 disabled:text-zinc-200'
                    )}
                    type="submit"
                    disabled={isPending}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>{submitLabel}</span>
                    </span>
                    <BottomGradient />
                </Button>

                <div className="my-8 w-full border-t border-dashed border-amber-400/30" />

                <div className="flex justify-center gap-3 sm:gap-4">
                    <Button
                        className="group/btn ninja-social relative flex h-10 items-center justify-start space-x-2 border-2 border-yellow-400/40 bg-zinc-900/70 px-4 font-medium text-amber-50 shadow-[0_2px_8px_rgba(255,215,0,0.10)] backdrop-blur-sm hover:border-yellow-400 hover:bg-zinc-900/90 hover:shadow-[0_0_16px_rgba(255,215,0,0.25)]"
                        type="button"
                        onClick={() => onClickSocialLogin('github')}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            GitHub
                        </span>
                        <BottomGradient />
                    </Button>
                    <Button
                        className="group/btn ninja-social relative flex h-10 items-center justify-start space-x-2 border-2 border-yellow-400/40 bg-zinc-900/70 px-4 font-medium text-amber-50 shadow-[0_2px_8px_rgba(255,215,0,0.10)] backdrop-blur-sm hover:border-yellow-400 hover:bg-zinc-900/90 hover:shadow-[0_0_16px_rgba(255,215,0,0.25)]"
                        type="button"
                        onClick={() => onClickSocialLogin('google')}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Google
                        </span>
                        <BottomGradient />
                    </Button>
                    <Button
                        className="group/btn ninja-social relative flex h-10 items-center justify-start space-x-2 border-2 border-yellow-400/40 bg-zinc-900/70 px-4 font-medium text-amber-50 shadow-[0_2px_8px_rgba(255,215,0,0.10)] backdrop-blur-sm hover:border-yellow-400 hover:bg-zinc-900/90 hover:shadow-[0_0_16px_rgba(255,215,0,0.25)]"
                        type="button"
                        onClick={() => onClickSocialLogin('linkedin')}
                    >
                        <IconBrandLinkedin className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            LinkedIn
                        </span>
                        <BottomGradient />
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
                <p>
                    By continuing, you agree to our{' '}
                    <a
                        href="/terms"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                        Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a
                        href="/privacy"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>

            <div className="mt-6 text-center text-sm">
                <p className="text-neutral-600 dark:text-neutral-400">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={() => {
                            router.replace('/login')
                        }}
                        className="font-semibold text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    )
}

const BottomGradient = () => {
    return (
        <>
            <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    )
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex w-full flex-col space-y-2', className)}>
            {children}
        </div>
    )
}

export default SignupForm
