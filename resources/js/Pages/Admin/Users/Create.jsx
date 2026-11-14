import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Field from '@/Components/ui/Field';
import PageHeader from '@/Components/ui/PageHeader';
import { errorInputClass, inputClass } from '@/utils/format';
import { Head, Link, useForm } from '@inertiajs/react';

const ROLE_HINTS = {
    user: 'Can create and manage their own work logs.',
    supervisor: 'Can view every log and update statuses or rejection reasons.',
    admin: 'Full access, including user management.',
};

export default function Create({ roles = ['admin', 'supervisor', 'user'] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.users.store'));
    };

    const fieldClass = (name) => `${inputClass} ${errors[name] ? errorInputClass : ''}`;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Add user"
                    description="Create an account and choose what the user is allowed to do."
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
            <Head title="Add User" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                        <div className="space-y-6 p-6 sm:p-8">
                            <Field label="Full name" htmlFor="name" required error={errors.name}>
                                <input id="name" type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} className={fieldClass('name')} required autoFocus />
                            </Field>

                            <Field label="Email address" htmlFor="email" required error={errors.email}>
                                <input id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className={fieldClass('email')} required />
                            </Field>

                            <Field label="Role" htmlFor="role" required error={errors.role} hint={ROLE_HINTS[data.role]}>
                                <select id="role" value={data.role} onChange={(event) => setData('role', event.target.value)} className={fieldClass('role')}>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 8 characters.">
                                    <input id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} className={fieldClass('password')} required autoComplete="new-password" />
                                </Field>

                                <Field label="Confirm password" htmlFor="password_confirmation" required error={errors.password_confirmation}>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(event) => setData('password_confirmation', event.target.value)}
                                        className={fieldClass('password_confirmation')}
                                        required
                                        autoComplete="new-password"
                                    />
                                </Field>
                            </div>
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
                                {processing ? 'Creating...' : 'Create user'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
