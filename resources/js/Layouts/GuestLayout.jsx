import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useI18n } from '@/i18n';
import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children, showBack = true }) {
    const flashError = usePage().props.flash?.error;
    const { t } = useI18n();

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-100 font-sans antialiased selection:bg-indigo-600 selection:text-white">
            <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl sm:h-96 sm:w-96"></div>
            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl sm:h-96 sm:w-96"></div>

            <header className="z-20 border-b border-slate-200/70 bg-white/80 px-4 py-2 backdrop-blur sm:px-6 sm:py-3">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-extrabold text-white shadow-sm">
                            WL
                        </div>
                        <span className="text-sm font-semibold tracking-wide text-slate-800">WorkLog</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        {showBack && (
                            <Link
                                href={route('login')}
                                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                                {t('Back to sign in')}
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area: Centered Card Layout */}
            <main className="z-10 flex flex-1 items-center justify-center p-3 sm:p-6">
                <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lift sm:rounded-3xl">

                    {/* Card Header (Branding Banner) */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-4 py-3 text-center sm:px-7 sm:py-6">
                        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-white">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                                {t('Daily Work & Task Tracking System')}
                            </span>

                            <h1 className="text-sm font-black tracking-[0.18em] text-white sm:text-xl">
                                {t('WORKLOG PORTAL')}
                            </h1>
                        </div>
                    </div>

                    {/* Card Body (Form Container) */}
                    <div className="bg-white p-3 sm:p-7">
                        {flashError && (
                            <div
                                role="alert"
                                className="mb-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
                            >
                                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                <span>{flashError}</span>
                            </div>
                        )}
                        {children}
                    </div>

                    {/* Card Footer Info */}
                    <div className="hidden items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-2.5 text-[11px] text-slate-500 sm:flex">
                        <span>WorkLog Portal v1.0</span>
                        <span className="inline-flex items-center gap-1">
                            <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            {t('Secure sign-in')}
                        </span>
                    </div>
                </div>
            </main>

            {/* Bottom Footer Bar */}
            <footer className="z-10 hidden border-t border-slate-200/70 bg-white/70 py-2 text-center text-[10px] font-medium text-slate-500 backdrop-blur sm:block">
                &copy; {new Date().getFullYear()} WorkLog System. {t('All rights reserved.')}
            </footer>
        </div>
    );
}