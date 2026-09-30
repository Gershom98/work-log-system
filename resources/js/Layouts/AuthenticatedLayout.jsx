import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Helper ya kupata URL ya Download PDF
    const getDownloadPdfUrl = () => {
        if (typeof route === 'function') {
            try {
                return route('work-logs.downloadPdf');
            } catch (e) {
                return '/work-logs/download-pdf';
            }
        }
        return '/work-logs/download-pdf';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* Brand Logo - Inampeleka user kwenye Daily Work Logs */}
                            <div className="flex shrink-0 items-center">
                                <Link href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                                            TL
                                        </div>
                                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                                            Task<span className="text-indigo-600">Log</span>
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                
                                {/* DASHBOARD LINK: Inaonyeshwa kwa ADMIN pekee */}
                                {user?.role === 'admin' && (
                                    <NavLink
                                        href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                        active={typeof route === 'function' ? route().current('dashboard') : false}
                                    >
                                        Dashboard
                                    </NavLink>
                                )}

                                {/* DAILY WORK LOGS LINK: Kila mtu anaiona */}
                                <NavLink
                                    href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                                    active={typeof route === 'function' ? route().current('work-logs.index') : false}
                                >
                                    Daily Work Logs
                                </NavLink>
                            </div>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={typeof route === 'function' ? route('profile.edit') : '/profile'}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={typeof route === 'function' ? route('logout') : '/logout'}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger Button kwa ajili ya Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {/* Dashboard kwa Admin tu kwenye Mobile */}
                        {user?.role === 'admin' && (
                            <ResponsiveNavLink
                                href={typeof route === 'function' ? route('dashboard') : '/dashboard'}
                                active={typeof route === 'function' ? route().current('dashboard') : false}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink
                            href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                            active={typeof route === 'function' ? route().current('work-logs.index') : false}
                        >
                            Daily Work Logs
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={typeof route === 'function' ? route('profile.edit') : '/profile'}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={typeof route === 'function' ? route('logout') : '/logout'}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}