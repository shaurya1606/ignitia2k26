'use client'
import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { IconX } from '@tabler/icons-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { ResetPasswordFormSchema } from '@/lib/schema/authSchema'
import { FieldError } from '@/components/auth/ui/field'
import FormError from '@/components/auth/ui/form-error'
import FormSuccess from '@/components/auth/ui/form-success'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'

interface ResetPasswordFormProps {
    title?: string
    subtitle?: string
    buttonLabel?: string
    buttonHref?: string
}

export function ResetPasswordForm({
    title,
    subtitle,
    buttonLabel,
    buttonHref: _buttonHref,
}: ResetPasswordFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [_emailSent, setEmailSent] = useState(false)
    const searchParams = useSearchParams()
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked'
            ? 'Your email is already in use. Please use another email'
            : ''

    type ResetPasswordValues = z.infer<typeof ResetPasswordFormSchema>

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: ResetPasswordValues) => {
        setSuccess('')
        setError('')
        setEmailSent(false)

        startTransition(async () => {
            try {
                const response = await axios.post(
                    '/api/auth/reset-password',
                    values,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const message =
                    response.data?.message ??
                    'Password reset link has been sent.'
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

    const submitLabel = buttonLabel ?? 'Send Reset Link'

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black relative">
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
                type="button"
            >
                <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </button>

            <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    {title}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                    {subtitle}
                </p>
            </div>

            <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
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
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </LabelInputContainer>
                    )}
                />

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

                <div className="my-8  w-full  from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
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
            <span className="absolute inset-x-0 -bottom-px block h-px w-full from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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

export default ResetPasswordForm
