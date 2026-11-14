import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import EmptyState from '@/Components/ui/EmptyState';
import PageHeader from '@/Components/ui/PageHeader';
import Pagination from '@/Components/ui/Pagination';
import RoleBadge from '@/Components/ui/RoleBadge';
import { formatDate, initials, inputClass } from '@/utils/format';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ROLE_OPTIONS = [
    { value: '', label: 'All roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'user', label: 'User' },
];

export default function Index({ users, filters = {} }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [deletingUser, setDeletingUser] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const isFirstRender = useRef(true);
    const skipDebounce = useRef(false);

    const applyFilters = useCallback(
        (overrides = {}) => {
            const params = {
                search: (overrides.search ?? search).trim(),
                role: overrides.role ?? role,
            };

            router.get(
                route('admin.users.index'),
                Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null)),
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
        [search, role],
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (skipDebounce.current) {
            skipDebounce.current = false;
            return;
        }

        const timer = setTimeout(() => applyFilters(), 450);

        return () => clearTimeout(timer);
    }, [search, applyFilters]);

    const handleRoleChange = (value) => {
        setRole(value);
        skipDebounce.current = true;
        applyFilters({ role: value });
    };

    const handleReset = () => {
        setSearch('');
        setRole('');
        skipDebounce.current = true;
        router.get(route('admin.users.index'), {}, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        if (!deletingUser) {
            return;
        }

        setDeleting(true);
        router.delete(route('admin.users.destroy', deletingUser.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeletingUser(null);
            },
        });
    };

    const userList = users?.data || [];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="User management"
                    description="Manage accounts, roles and access to the work log system."
                    actions={
                        <Link href={route('admin.users.create')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add user
                        </Link>
                    }
                />
            }
        >
            <Head title="User Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <label htmlFor="user-search" className="mb-1 block text-xs font-medium text-slate-600">Search users</label>
                                <input
                                    id="user-search"
                                    type="search"
                                    placeholder="Search by name or email"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div className="sm:w-52">
                                <label htmlFor="user-role" className="mb-1 block text-xs font-medium text-slate-600">Role</label>
                                <select id="user-role" value={role} onChange={(event) => handleRoleChange(event.target.value)} className={inputClass}>
                                    {ROLE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="button" onClick={handleReset} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                        <div className="hidden md:block">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">User</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Joined</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {userList.length > 0 ? (
                                        userList.map((user) => (
                                            <tr key={user.id} className="transition hover:bg-slate-50/70">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                                                            {initials(user.name)}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="truncate font-semibold text-slate-900">{user.name}</span>
                                                                {auth?.user?.id === user.id && (
                                                                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">You</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400">ID #{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                <td className="whitespace-nowrap px-6 py-4"><RoleBadge role={user.role} /></td>
                                                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">{formatDate(user.created_at)}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('admin.users.edit', user.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700" aria-label={`Edit ${user.name}`}>
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        {auth?.user?.id !== user.id && (
                                                            <button type="button" onClick={() => setDeletingUser(user)} className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${user.name}`}>
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">
                                                <EmptyState
                                                    title="No users found"
                                                    description="Try a different search term or add a new user."
                                                    action={<Link href={route('admin.users.create')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Add a user →</Link>}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-slate-100 md:hidden">
                            {userList.length > 0 ? (
                                userList.map((user) => (
                                    <div key={user.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                                                    {initials(user.name)}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                                                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <RoleBadge role={user.role} />
                                        </div>
                                        <div className="mt-3 flex items-center justify-end gap-2">
                                            <Link href={route('admin.users.edit', user.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Edit</Link>
                                            {auth?.user?.id !== user.id && (
                                                <button type="button" onClick={() => setDeletingUser(user)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600">Delete</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState title="No users found" description="Try a different search term or add a new user." />
                            )}
                        </div>

                        <div className="px-4 pb-4 sm:px-6">
                            <Pagination paginator={users} label="users" />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={Boolean(deletingUser)}
                title="Delete user"
                description={deletingUser ? `${deletingUser.name} will be permanently deleted. Their work logs will also be removed.` : ''}
                confirmLabel="Delete user"
                processing={deleting}
                onConfirm={confirmDelete}
                onClose={() => setDeletingUser(null)}
            />
        </AuthenticatedLayout>
    );
}
