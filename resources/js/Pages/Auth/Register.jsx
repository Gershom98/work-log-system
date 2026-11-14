import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(typeof route === 'function' ? route('register') : '/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Helper to calculate basic password strength
    const getPasswordStrength = (pass) => {
        if (!pass) return { label: '', color: '' };
        if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500 text-rose-600' };
        if (pass.length < 10) return { label: 'Medium', color: 'bg-amber-500 text-amber-600' };
        return { label: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
    };

    const strength = getPasswordStrength(data.password);

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Header Section */}
            <div className="mb-4 text-center">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    Create Account
                </h2>
            </div>

            <form onSubmit={submit} className="space-y-2">
                {/* Full Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-slate-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="pl-9 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 sm:py-2"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                {/* Email Address */}
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
                            className="pl-9 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 sm:py-2"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 items-start">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <InputLabel htmlFor="password" value="Password" className="text-slate-700 text-xs font-semibold" />

                        {/* Password Strength Indicator */}
                        {data.password && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]} ${data.password.length < 6 ? 'w-1/3' : data.password.length < 10 ? 'w-2/3' : 'w-full'}`}></div>
                                </div>
                                <span className={`text-[9px] font-bold ${strength.color.split(' ')[1]}`}>
                                    {strength.label}
                                </span>
                            </div>
                        )}
                    </div>

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
                            className="pl-9 pr-10 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 sm:py-2"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                {/* Confirm Password Field */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="pl-9 pr-10 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1 sm:py-2"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                            aria-pressed={showConfirmPassword}
                            aria-controls="password_confirmation"
                            className="absolute inset-y-0 right-0 flex items-center rounded pr-3 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1"
                        >
                            {showConfirmPassword ? (
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

                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>
                </div>

                {/* Submit Action */}
                <div>
                    <PrimaryButton
                        className="w-full justify-center py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-md shadow-indigo-100 transition"
                        disabled={processing}
                    >
                        {processing ? 'Registering...' : 'Register'}
                    </PrimaryButton>
                </div>

                {/* Footer Navigation */}
                <div className="mt-2 flex items-center justify-end border-t border-slate-100 pt-2 text-xs">
                    <Link
                        href={typeof route === 'function' ? route('login') : '/login'}
                        className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                        Already registered? Log in &rarr;
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}