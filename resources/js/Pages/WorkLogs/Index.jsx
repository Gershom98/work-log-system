import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ logs }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this work log?')) {
            const deleteUrl = typeof route === 'function' ? route('work-logs.destroy', id) : `/work-logs/${id}`;
            router.delete(deleteUrl);
        }
    };

    // Helper for status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'submitted':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Submitted</span>;
            case 'approved':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
            case 'rejected':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
            case 'pending':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status || 'Submitted'}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Work Logs List
                    </h2>
                    <Link
                        href={typeof route === 'function' ? route('work-logs.create') : '/work-logs/create'}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                    >
                        + Add New Log
                    </Link>
                </div>
            }
        >
            <Head title="Work Logs List" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-4">

                    {/* Flash Success Message */}
                    {flash?.message && (
                        <div className="rounded-md bg-green-50 p-4 border border-green-200 text-sm text-green-800">
                            {flash.message}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {logs?.data && logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {log.log_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {log.requester_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 max-w-xs truncate">
                                                    {log.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                                                    {log.hours_spent} {log.hours_spent === 1 ? 'Hour' : 'Hours'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getStatusBadge(log.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                                    <Link
                                                        href={typeof route === 'function' ? route('work-logs.edit', log.id) : `/work-logs/${log.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                No work logs recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links */}
                            {logs?.links && logs.links.length > 3 && (
                                <div className="mt-6 flex justify-center space-x-1">
                                    {logs.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1 text-sm rounded border ${link.active
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-1 text-sm rounded border bg-white text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                                            />
                                        )
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}