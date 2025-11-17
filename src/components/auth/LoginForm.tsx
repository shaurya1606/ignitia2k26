'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'
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
import { LoginFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { useSearchParams } from 'next/navigation'

interface LoginFormProps {
    title?: string
    subtitle?: string
    mode?: 'modal' | 'redirect'
    buttonLabel?: string
    buttonHref?: string
}

export function LoginForm({
    title,
    mode,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
}: LoginFormProps) {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const searchParams = useSearchParams()
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked'
            ? 'Your email is already in use. Please use another email'
            : ''
    const callbackUrl = searchParams.get('callbackUrl') || undefined

    type LoginValues = z.infer<typeof LoginFormSchema>

    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
            twoFactorCode: '',
        },
    })

    const onSubmit = async (values: LoginValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/login',
                    {
                        email: values.email.trim(),
                        password: values.password,
                        twoFactorCode:
                            values.twoFactorCode?.trim() || undefined,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ?? 'Logged in successfully.'
                const isEmailSent = response.data?.emailSent ?? false

                if (response.data.twoFactorRequired) {
                    setShowTwoFactor(true)
                    setSuccess(message)
                    setError('')
                    setEmailSent(isEmailSent)
                    form.setValue('twoFactorCode', '')
                    form.setFocus('twoFactorCode')
                    return
                }
                setSuccess(message)
                setEmailSent(isEmailSent)
                setError('')
                setShowTwoFactor(false)
                form.reset({
                    email: '',
                    password: '',
                    twoFactorCode: '',
                })

                // Only redirect if login was successful (not email verification)
                if (
                    response.status === 200 &&
                    !isEmailSent &&
                    response.data?.redirectTo
                ) {
                    router.push(callbackUrl || response.data.redirectTo)
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data?.message ??
                        'Unable to process the request.'
                    const isEmailSent = err.response?.data?.emailSent ?? false
                    if (showTwoFactor || err.response?.data?.twoFactorBlocked) {
                        setShowTwoFactor(true)
                        form.setValue('twoFactorCode', '')
                        form.setFocus('twoFactorCode')
                    }
                    setError(message)
                    setEmailSent(isEmailSent)
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
        signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT })
    }

    const submitLabel = buttonLabel ?? 'Log In'

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
                    : 'shadow-input bg-white p-4 md:p-8 dark:bg-black border-2 border-yellow-400 shadow-0_2px_8px_rgba(255,215,0,0.12)'
            )}
        >
            {!isModal && (
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 rounded-full p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-yellow-400/40
                    "
                    aria-label="Close"
                    type="button"
                >
                    <IconX className="h-5 w-5 text-yellow-400 dark:hover:text-white" />
                </button>
            )}

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
                {showTwoFactor && (
                    <Controller
                        name="twoFactorCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <LabelInputContainer
                                data-invalid={fieldState.invalid}
                                className="mb-4"
                            >
                                <Label htmlFor="twoFactorCode">
                                    Two-Factor Code
                                </Label>
                                <Input
                                    id="twoFactorCode"
                                    placeholder="123456"
                                    type="text"
                                    {...field}
                                    // value={field.value ?? ''}
                                    aria-invalid={fieldState.invalid}
                                    autoComplete="one-time-code"
                                    disabled={isPending}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </LabelInputContainer>
                        )}
                    />
                )}
                {!showTwoFactor && (
                    <>
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
                                        Email Address
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="current-password"
                                            disabled={isPending}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                        >
                                            {showPassword ? (
                                                <IconEyeOff className="h-5 w-5 text-yellow-400" />
                                            ) : (
                                                <IconEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </LabelInputContainer>
                            )}
                        />
                    </>
                )}
                <div className="flex justify-end">
                    <Link
                        href="/reset-password"
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <div className="my-4">
                    <FormError message={error || urlError} />
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
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        onClick={() => {
                            router.replace('/signup')
                        }}
                        className="font-semibold text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    )
}

const BottomGradient = () => {
    return (
        <>
            <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-amber-300 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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

export default LoginForm
