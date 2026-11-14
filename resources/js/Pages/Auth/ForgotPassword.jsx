import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status, mail_ready = true, dev_reset_url }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-3 text-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    Forgot Password?
                </h2>
            </div>

            {!mail_ready && !dev_reset_url && (
                <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                    Email delivery is off on this server, so no reset email can be sent. Contact your administrator.
                </div>
            )}

            {dev_reset_url ? (
                <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px]">
                    <p className="font-semibold text-emerald-800">Reset link ready</p>
                    <p className="mt-0.5 text-emerald-700">
                        Email delivery is off (MAIL_MAILER=log), so use this link directly.
                    </p>
                    <Link
                        href={dev_reset_url}
                        className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                    >
                        Reset password
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            ) : (
                status &&
                mail_ready && (
                    <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 border border-emerald-200 text-center">
                        {status}
                    </div>
                )
            )}

            <form onSubmit={submit} className="space-y-3">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-slate-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-9 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 sm:py-2"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <PrimaryButton
                    className="w-full justify-center py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-md shadow-indigo-100 transition"
                    disabled={processing}
                >
                    {processing ? 'Sending...' : 'Email Password Reset Link'}
                </PrimaryButton>
            </form>

            <div className="mt-3 flex items-center justify-start border-t border-slate-100 pt-3 text-xs">
                <Link
                    href={route('login')}
                    className="flex items-center gap-1 font-medium text-slate-500 hover:text-indigo-600 transition"
                >
                    &larr; Back to login
                </Link>
            </div>
        </GuestLayout>
    );
}
