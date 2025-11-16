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

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black relative">
            {mode !== 'modal' && (
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
                type="button"
            >
                <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </button>)}

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    {title}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
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
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        placeholder="projectmayhem@fc.com"
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
                                    <Label htmlFor="password">Password</Label>
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
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                        >
                                            {showPassword ? (
                                                <IconEyeOff className="h-5 w-5" />
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
                    className="group/btn relative block h-10 w-full rounded-md from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={isPending}
                >
                    {submitLabel}
                    <BottomGradient />
                </Button>

                <div className="my-8 w-full  from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex gap-4 space-y-4 justify-center">
                    <Button
                        className="group/btn shadow-input relative flex h-10 items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
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
                        className="group/btn shadow-input relative flex h-10 items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
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
                        className="group/btn shadow-input relative flex h-10 items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
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

            <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
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
            <span className="absolute inset-x-0 -bottom-px block h-px w-ful from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 -transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
