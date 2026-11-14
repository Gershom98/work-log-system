import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useI18n } from '@/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { t } = useI18n();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('Reset Password')} />

            <div className="mb-3 text-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    {t('Reset Password')}
                </h2>
            </div>

            <form onSubmit={submit} className="space-y-2">
                <div>
                    <InputLabel htmlFor="email" value={t('Email Address')} className="text-slate-700 text-xs font-semibold" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-1 sm:py-2"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('New Password')} className="text-slate-700 text-xs font-semibold" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-1 sm:py-2"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('Confirm Password')} className="text-slate-700 text-xs font-semibold" />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-3 py-1 sm:py-2"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                <PrimaryButton
                    className="w-full justify-center py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-md shadow-indigo-100 transition"
                    disabled={processing}
                >
                    {processing ? t('Resetting...') : t('Reset Password')}
                </PrimaryButton>
            </form>

            <div className="mt-3 flex items-center justify-start border-t border-slate-100 pt-3 text-xs">
                <Link
                    href={route('login')}
                    className="flex items-center gap-1 font-medium text-slate-500 hover:text-indigo-600 transition"
                >
                    &larr; {t('Back to login')}
                </Link>
            </div>
        </GuestLayout>
    );
}
