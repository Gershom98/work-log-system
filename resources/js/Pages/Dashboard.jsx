import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentLogs }) {
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden rounded-lg bg-white p-5 shadow">
                            <div className="flex items-center">
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">Total Work Logs</dt>
                                        <dd className="text-3xl font-semibold text-gray-900">{stats?.totalLogs || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-5 shadow">
                            <div className="flex items-center">
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">Submitted Logs</dt>
                                        <dd className="text-3xl font-semibold text-blue-600">{stats?.submittedLogs || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-5 shadow">
                            <div className="flex items-center">
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">Completed / Approved</dt>
                                        <dd className="text-3xl font-semibold text-emerald-600">{stats?.completedLogs || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white p-5 shadow">
                            <div className="flex items-center">
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="truncate text-sm font-medium text-gray-500">Pending Logs</dt>
                                        <dd className="text-3xl font-semibold text-amber-600">{stats?.pendingLogs || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Work Activity Section */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800">Recent Work Activity</h3>
                                <div className="flex items-center space-x-4">
                                    <a
                                        href={getDownloadPdfUrl()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition duration-150"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download PDF
                                    </a>
                                    <Link
                                        href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                        View All Logs &rarr;
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester / Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Title</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                        {recentLogs && recentLogs.length > 0 ? (
                                            recentLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                        {log.log_date}
                                                    </td>

                                                    {/* Jina na Email ya Aliyetuma Log */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-900">
                                                            {log.user?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {log.user?.email || ''}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                                        {log.requester_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                                                        {log.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                                            {log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : 'Submitted'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={typeof route === 'function' ? route('work-logs.edit', log.id) : `/work-logs/${log.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
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