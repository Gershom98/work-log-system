import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create User</h2>}
        >
            <Head title="Create User" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_admin"
                                    checked={data.is_admin}
                                    onChange={(e) => setData('is_admin', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <label htmlFor="is_admin" className="ml-2 text-sm text-gray-700 font-medium">
                                    Grant Admin Privileges
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Link href={route('admin.users.index')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>Save User</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}