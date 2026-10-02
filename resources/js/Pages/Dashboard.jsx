import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats = {}, recentLogs = [] }) {
    // Helper ya kupata URL ya Download PDF
    const getDownloadPdfUrl = () => {
        if (typeof route === 'function') {
            try {
                return route('work-logs.downloadPdf');
            } catch (e) {
                return '/work-logs/download-pdf';
            }
        }
        return '/work-logs/download-pdf';
    };

    // Helper ya kutoa Status Badge
    const renderStatusBadge = (status) => {
        const normalizedStatus = status ? status.toLowerCase() : 'submitted';

        switch (normalizedStatus) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Rejected
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Submitted
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Total Logs */}
                        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Work Logs</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.total_logs || 0}</p>
                                </div>
                                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Submitted Logs */}
                        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted Logs</p>
                                    <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.submitted_logs || 0}</p>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Approved Logs */}
                        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Logs</p>
                                    <p className="mt-2 text-3xl font-bold text-emerald-600">{stats?.approved_logs || 0}</p>
                                </div>
                                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending Logs */}
                        <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Logs</p>
                                    <p className="mt-2 text-3xl font-bold text-amber-600">{stats?.pending_logs || 0}</p>
                                </div>
                                <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recent Work Activity Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Recent Work Activity</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Overview of the latest submitted work activities.</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <a
                                        href={getDownloadPdfUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                    >
                                        <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export PDF Report
                                    </a>
                                    <Link
                                        href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                                        className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        View All Logs
                                        <svg className="ml-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Submitted By</th>
                                            <th className="px-6 py-3">Requester / Client</th>
                                            <th className="px-6 py-3">Task Title</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white text-sm">
                                        {recentLogs && recentLogs.length > 0 ? (
                                            recentLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-50/80 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium text-xs">
                                                        {log.log_date}
                                                    </td>

                                                    {/* User Details */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                                                                {log.user?.name ? log.user.name.charAt(0) : 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900 text-xs">
                                                                    {log.user?.name || 'N/A'}
                                                                </div>
                                                                <div className="text-[11px] text-gray-500">
                                                                    {log.user?.email || ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium text-xs">
                                                        {log.requester_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate text-xs font-medium">
                                                        {log.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {renderStatusBadge(log.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                                                        <Link
                                                            href={typeof route === 'function' && log?.id ? route('work-logs.show', log.id) : `/work-logs/${log?.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900 font-semibold inline-flex items-center gap-1"
                                                        >
                                                            View
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                                                    No recent work activity found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}