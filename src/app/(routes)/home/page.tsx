import { ReactLenis } from 'lenis/react'
import Link from 'next/link'

const HomePage = () => {
  return (
    <>
     <ReactLenis root />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-chart-1/5 to-chart-2/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">Welcome to</span>
                <span className="block bg-linear-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                  AuthDemo
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
                A modern authentication and authorization system built with Next.js, featuring secure login, role-based access control, and email verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-lg">
                  Get Started
                </Link>
                <Link href="/contact" className="px-8 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-semibold text-lg">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
                <p className="text-muted-foreground">Industry-standard security with bcrypt hashing and JWT tokens.</p>
              </div>
              <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-chart-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                <p className="text-muted-foreground">Fine-grained permission control with user roles and protected routes.</p>
              </div>
              <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-chart-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Verification</h3>
                <p className="text-muted-foreground">Automated email verification with secure token-based confirmation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust our authentication system.
            </p>
            <Link href="/signup" className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold text-lg">
              Create an Account
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default HomePage