import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const isManager = ['admin', 'supervisor'].includes(auth?.user?.role);
    const homeHref = isManager ? route('dashboard') : route('work-logs.index');
    const homeLabel = isManager ? 'Dashboard' : 'My Work Logs';

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col selection:bg-indigo-500 selection:text-white">

                {/* Header Navigation */}
                <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base sm:text-xl shadow-md">
                            WL
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                            Work<span className="text-indigo-600">Log</span>
                        </span>
                    </div>

                    <nav className="flex items-center gap-2 sm:gap-3">
                        {auth?.user ? (
                            <Link
                                href={homeHref}
                                className="px-4 sm:px-5 py-1.5 sm:py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm transition shadow-sm"
                            >
                                {homeLabel}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={typeof route === 'function' ? route('login') : '/login'}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition text-xs sm:text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={typeof route === 'function' ? route('register') : '/register'}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition shadow-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-12 flex-1 flex flex-col items-center justify-center text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-semibold tracking-wide uppercase border border-indigo-200/60 mb-3 sm:mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                        Daily Work & Task Tracking System
                    </span>

                    <h1 className="text-[26px] sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                        Track & Manage <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Your Daily Work Logs Effortlessly
                        </span>
                    </h1>

                    <div className="w-full mt-6 sm:mt-10 flex flex-col min-[420px]:flex-row items-center justify-center gap-3 sm:gap-4">
                        {auth?.user ? (
                            <Link
                                href={homeHref}
                                className="w-full min-[420px]:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                Open {homeLabel}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={typeof route === 'function' ? route('register') : '/register'}
                                    className="w-full min-[420px]:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href={typeof route === 'function' ? route('login') : '/login'}
                                    className="w-full min-[420px]:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-gray-100/80 text-gray-700 text-sm sm:text-base border border-gray-300 font-semibold shadow-sm transition"
                                >
                                    Log In to Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="w-full mt-8 sm:mt-20 grid grid-cols-3 gap-3 sm:gap-6 text-left">
                        <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-2 sm:mb-4">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3 className="text-xs sm:text-lg font-semibold text-gray-900">Log Daily Tasks</h3>
                        </div>

                        <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2 sm:mb-4">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xs sm:text-lg font-semibold text-gray-900">Status Tracking</h3>
                        </div>

                        <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2 sm:mb-4">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xs sm:text-lg font-semibold text-gray-900">Export PDF Reports</h3>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-6 text-center text-[10px] sm:text-xs text-gray-500 border-t border-gray-200/60">
                    &copy; {new Date().getFullYear()} Daily Work Log System. All rights reserved.
                </footer>
            </div>
        </>
    );
}