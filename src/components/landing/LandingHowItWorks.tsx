const steps = [
    {
        step: '01',
        title: 'Set goals',
        description:
            'Employees draft goal sheets during the May window — thrust areas, UoM, targets, and weightage.',
    },
    {
        step: '02',
        title: 'Get approval',
        description:
            'Managers review submissions, request changes, or approve and lock the sheet.',
    },
    {
        step: '03',
        title: 'Check in quarterly',
        description:
            'Jul, Oct, Jan, and Mar–Apr windows for actuals, status, and structured manager feedback.',
    },
]

export function LandingHowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-t border-white/10 bg-neutral-900/50 py-20 sm:py-28"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    How it works
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-center text-neutral-400">
                    A clear rhythm for employees, managers, and HR across the
                    performance year.
                </p>

                <ol className="mt-14 grid gap-8 md:grid-cols-3">
                    {steps.map((item, index) => (
                        <li key={item.step} className="relative">
                            {index < steps.length - 1 && (
                                <span
                                    className="absolute top-8 hidden h-px w-full bg-gradient-to-r from-amber-500/50 to-transparent md:block md:w-[calc(100%+2rem)] md:translate-x-4"
                                    aria-hidden
                                />
                            )}
                            <span className="text-4xl font-bold text-amber-500/40">
                                {item.step}
                            </span>
                            <h3 className="mt-2 text-xl font-semibold text-white">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
