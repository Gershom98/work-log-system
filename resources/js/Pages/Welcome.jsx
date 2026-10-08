import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome - Daily Work Log System" />
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">

                {/* Header Navigation */}
                <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
                            WL
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            Work<span className="text-indigo-600">Log</span>
                        </span>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link
                                href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition shadow-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={typeof route === 'function' ? route('login') : '/login'}
                                    className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={typeof route === 'function' ? route('register') : '/register'}
                                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition shadow-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="w-full max-w-5xl mx-auto px-6 py-12 my-auto text-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase border border-indigo-200/60 mb-6">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                        Daily Work & Task Tracking System
                    </span>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Track & Manage <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Your Daily Work Logs Effortlessly
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Streamline daily activity recording, monitor task approvals, and export automated PDF reports seamlessly from one central dashboard.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Go to Dashboard
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={typeof route === 'function' ? route('register') : '/register'}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href={typeof route === 'function' ? route('login') : '/login'}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100/80 text-gray-700 border border-gray-300 font-semibold shadow-sm transition"
                                >
                                    Log In to Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Log Daily Tasks</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Record daily activities, track requesters, and maintain structured records of technical operations.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Approval Workflow</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Track status progressions seamlessly with clear indicators for Pending, Approved, or Submitted logs.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Export PDF Reports</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Generate formatted PDF performance summaries instantly for reporting and administrative review.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-500 border-t border-gray-200/60">
                    &copy; {new Date().getFullYear()} Daily Work Log System. All rights reserved.
                </footer>
            </div>
        </>
    );
}