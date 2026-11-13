import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import FlashMessage from '@/Components/ui/FlashMessage';
import RoleBadge from '@/Components/ui/RoleBadge';
import { initials } from '@/utils/format';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isManager = isAdmin || user?.role === 'supervisor';

    const navigation = [
        ...(isManager
            ? [{ label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard') }]
            : []),
        {
            label: 'Daily Work Logs',
            href: route('work-logs.index'),
            active: route().current('work-logs.*'),
        },
        ...(isAdmin
            ? [{ label: 'Users', href: route('admin.users.index'), active: route().current('admin.users.*') }]
            : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex min-w-0">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('work-logs.index')} className="flex items-center gap-2.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                                        WL
                                    </span>
                                    <span className="text-lg font-bold tracking-tight text-slate-900">
                                        Work<span className="text-indigo-600">Log</span>
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {navigation.map((item) => (
                                    <NavLink key={item.label} href={item.href} active={item.active}>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-white px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                                {initials(user?.name)}
                                            </span>
                                            <span className="flex flex-col items-start leading-tight">
                                                <span className="max-w-[140px] truncate">{user?.name}</span>
                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    {user?.role}
                                                </span>
                                            </span>
                                            <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="border-b border-slate-100 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                                            <p className="truncate text-xs text-slate-500">{user?.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Toggle navigation"
                                aria-expanded={showingNavigationDropdown}
                                aria-controls="mobile-navigation"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
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

                <div id="mobile-navigation" className={(showingNavigationDropdown ? 'block' : 'hidden') + ' border-t border-slate-100 sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {navigation.map((item) => (
                            <ResponsiveNavLink
                                key={item.label}
                                href={item.href}
                                active={item.active}
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4">
                        <div className="flex items-center gap-3 px-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                {initials(user?.name)}
                            </span>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-800">{user?.name}</div>
                                <div className="truncate text-xs text-slate-500">{user?.email}</div>
                            </div>
                            <div className="ms-auto">
                                <RoleBadge role={user?.role} />
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')} onClick={() => setShowingNavigationDropdown(false)}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" onClick={() => setShowingNavigationDropdown(false)}>
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <FlashMessage />

            {header && (
                <header className="border-b border-slate-200/80 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
