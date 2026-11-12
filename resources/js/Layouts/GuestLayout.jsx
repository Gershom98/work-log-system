import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100/50 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 -mb-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Navigation Bar */}
            <header className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-3 flex items-center justify-between shadow-md z-20">
                <div className="flex items-center gap-2 font-bold tracking-wide">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-extrabold text-sm sm:text-base shadow-sm">
                        WL
                    </div>
                    <span className="text-white font-semibold tracking-wider text-sm">WorkLog</span>
                </div>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 text-[11px] sm:text-xs font-medium text-blue-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
            </header>

            {/* Main Content Area: Centered Card Layout */}
            <main className="flex-1 flex items-center justify-center p-2 sm:p-6 z-10">
                <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 overflow-hidden">
                    
                    {/* Card Header (Branding Banner) */}
                    <div className="bg-blue-600 text-white px-4 py-1.5 sm:p-7 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700/80 border border-blue-400/40 text-white text-[10px] font-medium mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Daily Work & Task Tracking System
                            </div>

                            <h1 className="text-sm sm:text-xl font-black tracking-[0.18em] text-white">
                                WORKLOG PORTAL
                            </h1>
                        </div>
                    </div>

                    {/* Card Body (Form Container) */}
                    <div className="p-3 sm:p-7 bg-white">
                        {children}
                    </div>

                    {/* Card Footer Info */}
                    <div className="hidden sm:flex bg-gray-50/80 px-6 py-2.5 border-t border-gray-100 text-[11px] text-gray-500 justify-between items-center">
                        <span>WorkLog Portal v1.0</span>
                        <span>High Security • Encrypted Data</span>
                    </div>
                </div>
            </main>

            {/* Bottom Footer Bar */}
            <footer className="hidden sm:block bg-white text-blue-600 text-[10px] py-2 px-6 text-center border-t border-blue-100 font-medium z-10">
                &copy; {new Date().getFullYear()} WorkLog System. All rights reserved.
            </footer>
        </div>
    );
}