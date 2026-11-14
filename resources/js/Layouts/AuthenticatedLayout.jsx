import Dropdown from '@/Components/Dropdown';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import FlashMessage from '@/Components/ui/FlashMessage';
import RoleBadge from '@/Components/ui/RoleBadge';
import { useI18n } from '@/i18n';
import { initials } from '@/utils/format';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const { t } = useI18n();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isManager = isAdmin || user?.role === 'supervisor';

    const navigation = [
        ...(isManager
            ? [{ label: t('Dashboard'), href: route('dashboard'), active: route().current('dashboard') }]
            : []),
        {
            label: t('Daily Work Logs'),
            href: route('work-logs.index'),
            active: route().current('work-logs.*'),
        },
        ...(isAdmin
            ? [{ label: t('Users'), href: route('admin.users.index'), active: route().current('admin.users.*') }]
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

                            <div className="hidden items-center gap-1 sm:ms-8 sm:flex">
                                {navigation.map((item) => (
                                    <NavLink key={item.label} href={item.href} active={item.active}>
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <a
                                href={route('manual.download')}
                                title={t('Training manual (PDF)')}
                                className="me-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                {t('Manual')}
                            </a>
                            <LanguageSwitcher className="me-2" />
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
                                                    {t(user?.role === 'admin' ? 'Admin' : user?.role === 'supervisor' ? 'Supervisor' : 'User')}
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
                                        <Dropdown.Link href={route('profile.edit')}>{t('Profile')}</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {t('Log Out')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label={t('Toggle navigation')}
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
                            <div className="px-4 pb-2">
                                <LanguageSwitcher />
                            </div>
                            <ResponsiveNavLink href={route('profile.edit')} onClick={() => setShowingNavigationDropdown(false)}>
                                {t('Profile')}
                            </ResponsiveNavLink>
                            <a
                                href={route('manual.download')}
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                {t('Training manual (PDF)')}
                            </a>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" onClick={() => setShowingNavigationDropdown(false)}>
                                {t('Log Out')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <FlashMessage />

            {header && (
                <header className="border-b border-slate-200/80 bg-gradient-to-r from-white via-white to-indigo-50/50">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
