'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { IconTarget, IconChartBar, IconUsers } from '@tabler/icons-react'

type LandingHeroProps = {
    isAuthenticated: boolean
}

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
    return (
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            >
                <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-500/20 blur-[120px]" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Goal Setting Portal
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Align goals. Track progress.{' '}
                        <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
                            Deliver results.
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-neutral-400 sm:text-xl">
                        AtomQuest helps your organization set annual goals, run
                        quarterly check-ins, and keep managers and employees in
                        sync — from draft to approval to achievement.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {isAuthenticated ? (
                            <Button
                                asChild
                                size="lg"
                                className="h-12 min-w-[180px] bg-gradient-to-r from-amber-500 to-orange-600 text-base text-neutral-950 hover:from-amber-400 hover:to-orange-500"
                            >
                                <Link href="/dashboard">Enter portal</Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 min-w-[180px] bg-gradient-to-r from-amber-500 to-orange-600 text-base text-neutral-950 hover:from-amber-400 hover:to-orange-500"
                                >
                                    <Link href="/signup">Create account</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-12 min-w-[180px] border-white/20 bg-white/5 text-base text-white hover:bg-white/10"
                                >
                                    <Link href="/login">Sign in</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3"
                >
                    {[
                        {
                            icon: IconTarget,
                            label: 'Goal sheets',
                            value: '100% weightage',
                        },
                        {
                            icon: IconChartBar,
                            label: 'Quarterly check-ins',
                            value: 'Q1–Q4 tracking',
                        },
                        {
                            icon: IconUsers,
                            label: 'Manager workflow',
                            value: 'Approve & review',
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                        >
                            <stat.icon className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                            <p className="text-sm text-neutral-400">
                                {stat.label}
                            </p>
                            <p className="mt-1 font-semibold text-white">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
