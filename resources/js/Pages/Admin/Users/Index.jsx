import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, users, flash }) {
    const { delete: destroy } = useForm();

    // Handle both Paginated (users.data) and Simple Array (users) responses
    const userList = Array.isArray(users) ? users : users?.data || [];

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete user "${name}"?`)) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            User Management
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage all system users, their roles, and access permissions.
                        </p>
                    </div>
                    <div>
                        <Link
                            href={typeof route === 'function' ? route('admin.users.create') : '/admin/users/create'}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New User
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Notification Messages */}
                    {flash?.message && (
                        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{flash.message}</span>
                            </div>
                        </div>
                    )}

                    {/* Main Users Table Card */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <h3 className="text-base font-semibold text-gray-900">All System Users</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-semibold">User Details</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                                        <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                                        <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userList.length > 0 ? (
                                        userList.map((userItem) => (
                                            <tr key={userItem.id} className="transition-colors hover:bg-gray-50/50">
                                                {/* Name & Avatar */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 uppercase">
                                                            {userItem.name ? userItem.name.charAt(0) : 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{userItem.name}</div>
                                                            <div className="text-xs text-gray-400 sm:hidden">{userItem.email}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="px-6 py-4 text-gray-600 font-medium">
                                                    {userItem.email}
                                                </td>

                                                {/* Role Badge */}
                                                <td className="px-6 py-4">
                                                    {userItem.role === 'admin' ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/10">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                                                            User
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link
                                                            href={typeof route === 'function' ? route('admin.users.edit', userItem.id) : `/admin/users/${userItem.id}/edit`}
                                                            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </Link>

                                                        {/* Prevent logged-in user from deleting themselves */}
                                                        {auth?.user?.id !== userItem.id && (
                                                            <button
                                                                onClick={() => handleDelete(userItem.id, userItem.name)}
                                                                className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-900 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}