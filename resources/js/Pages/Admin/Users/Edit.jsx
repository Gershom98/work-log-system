import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Field from '@/Components/ui/Field';
import PageHeader from '@/Components/ui/PageHeader';
import RoleBadge from '@/Components/ui/RoleBadge';
import { errorInputClass, formatDate, initials, inputClass } from '@/utils/format';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const ROLE_HINTS = {
    user: 'Can create and manage their own work logs.',
    supervisor: 'Can view every log and update statuses or rejection reasons.',
    admin: 'Full access, including user management.',
};

export default function Edit({ user, roles = ['admin', 'supervisor', 'user'] }) {
    const { auth } = usePage().props;
    const isSelf = auth?.user?.id === user.id;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'user',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const fieldClass = (name) => `${inputClass} ${errors[name] ? errorInputClass : ''}`;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Edit user"
                    description="Update account details, role and password."
                    actions={
                        <Link href={route('admin.users.index')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to users
                        </Link>
                    }
                />
            }
        >
            <Head title={`Edit ${user.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                            {initials(user.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-base font-semibold text-slate-900">{user.name}</p>
                                {isSelf && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">You</span>}
                            </div>
                            <p className="truncate text-sm text-slate-500">{user.email}</p>
                        </div>
                        <RoleBadge role={user.role} />
                    </div>

                    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="space-y-6 p-6 sm:p-8">
                            <Field label="Full name" htmlFor="name" required error={errors.name}>
                                <input id="name" type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} className={fieldClass('name')} required />
                            </Field>

                            <Field label="Email address" htmlFor="email" required error={errors.email}>
                                <input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className={fieldClass('email')} required />
                            </Field>

                            <Field
                                label="Role"
                                htmlFor="role"
                                required
                                error={errors.role}
                                hint={isSelf ? 'You cannot remove your own admin role.' : ROLE_HINTS[data.role]}
                            >
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(event) => setData('role', event.target.value)}
                                    className={fieldClass('role')}
                                    disabled={isSelf}
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Field label="New password" htmlFor="password" error={errors.password} hint="Leave blank to keep the current password.">
                                    <input id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} className={fieldClass('password')} autoComplete="new-password" />
                                </Field>

                                <Field label="Confirm new password" htmlFor="password_confirmation" error={errors.password_confirmation}>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(event) => setData('password_confirmation', event.target.value)}
                                        className={fieldClass('password_confirmation')}
                                        autoComplete="new-password"
                                    />
                                </Field>
                            </div>

                            <p className="text-xs text-slate-400">Account created on {formatDate(user.created_at)}.</p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                            <Link href={route('admin.users.index')} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
