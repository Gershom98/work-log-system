import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Reusable Summary Card Component
function StatCard({ title, count = 0, color = 'indigo', iconPath }) {
    const colorClasses = {
        indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
        green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
        blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
        yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    };

    const activeColor = colorClasses[color] || colorClasses.indigo;

    return (
        <div className={`overflow-hidden rounded-lg bg-white p-5 shadow-sm border-l-4 ${activeColor.border}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{count ?? 0}</p>
                </div>
                <div className={`rounded-full p-3 ${activeColor.bg} ${activeColor.text}`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// Status Badge Component
function StatusBadge({ status }) {
    const styles = {
        completed: 'bg-green-100 text-green-800',
        approved: 'bg-green-100 text-green-800',
        in_progress: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const labels = {
        completed: 'Completed',
        approved: 'Approved',
        in_progress: 'In Progress',
        pending: 'Pending',
        rejected: 'Rejected',
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {labels[status] || status || 'N/A'}
        </span>
    );
}

export default function Dashboard({ stats = {}, recentLogs = [] }) {
    const getRoute = (routeName, param = null) => {
        if (typeof route === 'function') {
            return param ? route(routeName, param) : route(routeName);
        }
        return param ? `/work-logs/${param}` : '/work-logs';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Work Log Dashboard
                </h2>
            }
        >
            <Head title="Work Log Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total Work Logs"
                            count={stats?.totalLogs ?? 0}
                            color="indigo"
                            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                        <StatCard
                            title="Completed Tasks"
                            count={stats?.completedLogs ?? 0}
                            color="green"
                            iconPath="M5 13l4 4L19 7"
                        />
                        <StatCard
                            title="In Progress"
                            count={stats?.inProgressLogs ?? 0}
                            color="blue"
                            iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <StatCard
                            title="Pending Tasks"
                            count={stats?.pendingLogs ?? 0}
                            color="yellow"
                            iconPath="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </div>

                    {/* Recent Work Activity Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Work Activity</h3>
                                <Link
                                    href={getRoute('work-logs.index')}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                >
                                    View All Logs &rarr;
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Requester / Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Task Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {recentLogs && recentLogs.length > 0 ? (
                                            recentLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {log.log_date || log.date || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {log.requester_name || log.reported_by || log.client_name || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{log.title || '-'}</td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <StatusBadge status={log.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <Link
                                                            href={getRoute('work-logs.show', log.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No recent work logs recorded yet.
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