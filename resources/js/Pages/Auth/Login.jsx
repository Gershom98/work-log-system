import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { useI18n } from '@/i18n';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { t } = useI18n();
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(typeof route === 'function' ? route('login') : '/login', {
            onFinish: () => reset('password'),
        });
    };

    const features = [
        ['Log daily tasks', 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'],
        ['Status tracking', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'],
        ['PDF reports', 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
    ];

    return (
        <GuestLayout showBack={false}>
            <Head title={t('Log in')} />

            {/* Header Section */}
            <div className="mb-3 text-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    {t('Welcome Back')}
                </h2>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500">
                    {t('Sign in to track, manage and export your daily work logs.')}
                </p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700 border border-emerald-200 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-3">
                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value={t('Email Address')} className="text-slate-700 text-xs font-semibold" />

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

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value={t('Password')} className="text-slate-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="pl-9 pr-10 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1.5 sm:py-2"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        {/* Toggle Password View */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? t('Hide password') : t('Show password')}
                            aria-pressed={showPassword}
                            aria-controls="password"
                            className="absolute inset-y-0 right-0 flex items-center rounded pr-3 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.782 1.782L3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ms-2 text-xs text-slate-600 font-medium">
                            {t('Remember me')}
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={typeof route === 'function' ? route('password.request') : '/forgot-password'}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                        >
                            {t('Forgot password?')}
                        </Link>
                    )}
                </div>

                {/* Submit Action */}
                <div>
                    <PrimaryButton
                        className="w-full justify-center py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-md shadow-indigo-100 transition"
                        disabled={processing}
                    >
                        {processing ? t('Logging in...') : t('Log in')}
                    </PrimaryButton>
                </div>

                {/* Feature Highlights */}
                <ul className="mt-3 grid grid-cols-3 gap-1.5">
                    {features.map(([label, path]) => (
                        <li
                            key={label}
                            className="flex flex-col items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/70 px-1 py-1.5 text-center text-[10px] font-medium text-slate-600"
                        >
                            <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
                            </svg>
                            {t(label)}
                        </li>
                    ))}
                </ul>

                {/* Footer Navigation */}
                <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3 text-xs">
                    <Link
                        href={typeof route === 'function' ? route('register') : '/register'}
                        className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                        {t('Create an account')} &rarr;
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}