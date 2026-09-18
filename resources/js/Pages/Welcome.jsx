import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome - Daily Task Log System" />
            <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
                {/* Header Navigation */}
                <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-md">
                            TL
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            Task<span className="text-indigo-600">Log</span>
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition shadow-sm"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
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
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase border border-indigo-200 mb-6">
                        Daily Work & Task Tracking System
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Track & Manage <br />
                        <span className="text-indigo-600">
                            Your Daily Tasks Effortlessly
                        </span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Boost your daily productivity. Log work activities, monitor progress, and streamline task management in one centralized platform.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5"
                            >
                                Go to Dashboard &rarr;
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold shadow-sm transition"
                                >
                                    Log In to Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                                📝
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Log Daily Tasks</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Easily record details, time spent, and descriptions of tasks completed throughout the day.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                                📊
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Monitor task statuses (Pending, In Progress, or Completed) with real-time updates and metrics.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                                🚀
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Overview</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Assign responsibilities and review daily activity logs across your entire team efficiently.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-gray-500 border-t border-gray-200">
                    &copy; {new Date().getFullYear()} Daily Task Log System. All rights reserved.
                </footer>
            </div>
        </>
    );
}