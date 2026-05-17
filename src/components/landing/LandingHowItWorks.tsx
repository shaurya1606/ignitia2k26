const steps = [
    {
        step: '01',
        title: 'Set annual goals',
        description:
            'Employees draft goal sheets during the May window — thrust areas, unit of measure, targets, and weightage. Built-in validation enforces 100% total.',
    },
    {
        step: '02',
        title: 'Manager review & approval',
        description:
            'Managers review submissions inline, request changes, or approve and lock the sheet. Locked sheets become the single source of truth.',
    },
    {
        step: '03',
        title: 'Quarterly check-ins',
        description:
            'Jul, Oct, Jan, and Mar–Apr windows for actuals, achievement status, and structured manager feedback. Progress is tracked cumulatively.',
    },
    {
        step: '04',
        title: 'Annual review & reporting',
        description:
            'HR admins export achievement data, view org-wide compliance rates, and audit every action taken across the performance year.',
    },
]

export function LandingHowItWorks() {
    return (
        <section
            id="how-it-works"
            className="border-t border-slate-100 bg-white py-20 sm:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Process
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-slate-500 leading-relaxed">
                        A clear, governed rhythm for employees, managers, and HR across the
                        full performance year.
                    </p>
                </div>

                <ol className="mt-14 grid gap-8 md:grid-cols-4">
                    {steps.map((item, index) => (
                        <li key={item.step} className="relative">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <span
                                    className="absolute top-5 hidden h-px w-full bg-gradient-to-r from-slate-200 to-transparent md:block md:w-[calc(100%+2rem)] md:translate-x-4"
                                    aria-hidden
                                />
                            )}
                            {/* Step badge */}
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-50 text-sm font-bold text-indigo-700">
                                {item.step}
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ol>

                {/* Enterprise CTA */}
                <div className="mt-20 rounded-2xl border border-indigo-100 bg-indigo-50 px-8 py-12 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                        Ready to get started?
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        Bring structure to your performance process
                    </h3>
                    <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                        PerformIQ provides the governance layer your HR team needs — from KPI definition
                        to achievement reporting, all in one auditable platform.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="/signup"
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            Request access
                        </a>
                        <a
                            href="/login"
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
