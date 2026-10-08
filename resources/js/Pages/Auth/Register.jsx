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
        if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500 text-red-600' };
        if (pass.length < 10) return { label: 'Medium', color: 'bg-yellow-500 text-yellow-600' };
        return { label: 'Strong', color: 'bg-green-500 text-green-600' };
    };

    const strength = getPasswordStrength(data.password);

    return (
        <GuestLayout>
            <Head title="Register - Daily Work Log System" />

            {/* Header Section */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl shadow-md shadow-blue-200">
                    WL
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Create Account
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                    Get started with your Daily Work Log account
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Full Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="pl-9 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-sm"
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
                    <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-9 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-sm"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="pl-9 pr-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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

                    {/* Password Strength Indicator */}
                    {data.password && (
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]} ${data.password.length < 6 ? 'w-1/3' : data.password.length < 10 ? 'w-2/3' : 'w-full'}`}></div>
                            </div>
                            <span className={`text-[10px] font-bold ${strength.color.split(' ')[1]}`}>
                                {strength.label}
                            </span>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 text-xs font-semibold" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="pl-9 pr-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 text-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
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

                {/* Submit Action */}
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-md shadow-blue-100 transition"
                        disabled={processing}
                    >
                        {processing ? 'Registering...' : 'Register'}
                    </PrimaryButton>
                </div>

                {/* Footer Navigation */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs">
                    <Link
                        href="/"
                        className="flex items-center gap-1 font-medium text-gray-500 hover:text-blue-600 transition"
                    >
                        &larr; Home
                    </Link>

                    <Link
                        href={typeof route === 'function' ? route('login') : '/login'}
                        className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                        Already registered? Log in &rarr;
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}