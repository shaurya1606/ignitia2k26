import {
    IconClipboardCheck,
    IconLock,
    IconReportAnalytics,
    IconShare,
} from '@tabler/icons-react'

const features = [
    {
        icon: IconClipboardCheck,
        title: 'Structured goal sheets',
        description:
            'Employees define thrust areas, targets, and weightage with built-in validation — 100% total, max 8 goals, min 10% each.',
    },
    {
        icon: IconLock,
        title: 'Manager approval workflow',
        description:
            'L1 managers review, edit inline, approve, or return for rework. Approved goals lock until admin unlock.',
    },
    {
        icon: IconReportAnalytics,
        title: 'Quarterly check-ins',
        description:
            'Track planned vs actual each quarter with status updates, progress scores, and manager comments.',
    },
    {
        icon: IconShare,
        title: 'Shared departmental KPIs',
        description:
            'Push common goals across teams. Recipients adjust weightage while title and targets stay aligned.',
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="border-t border-white/10 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Built for the full goal lifecycle
                    </h2>
                    <p className="mt-4 text-neutral-400">
                        Everything you need for AtomQuest Hackathon Phase 1 & 2 —
                        from May goal setting through Q4 achievement capture.
                    </p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 transition hover:border-amber-500/30 hover:bg-white/[0.08]"
                        >
                            <feature.icon className="mb-4 h-8 w-8 text-amber-400 transition group-hover:scale-110" />
                            <h3 className="text-lg font-semibold text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
