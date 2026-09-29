import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ workLog }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this work log?')) {
            const deleteUrl = typeof route === 'function' ? route('work-logs.destroy', workLog.id) : `/work-logs/${workLog.id}`;
            router.delete(deleteUrl);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Approved</span>;
            case 'rejected':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Rejected</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Work Log Details #{workLog.id}
                    </h2>
                    <Link
                        href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                        &larr; Back to List
                    </Link>
                </div>
            }
        >
            <Head title={`Work Log: ${workLog.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg space-y-6">
                        
                        {/* Title and Status */}
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{workLog.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Requester: <span className="font-medium text-gray-700">{workLog.requester_name}</span>
                                </p>
                            </div>
                            <div>{getStatusBadge(workLog.status)}</div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                            <div>
                                <span className="text-gray-500 block">Work Date:</span>
                                <span className="font-semibold text-gray-800">{workLog.log_date}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Hours Spent:</span>
                                <span className="font-semibold text-gray-800">
                                    {workLog.hours_spent} {workLog.hours_spent === 1 ? 'Hour' : 'Hours'}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Work Description</h4>
                            <div className="p-4 bg-gray-50 rounded-md text-gray-800 leading-relaxed whitespace-pre-wrap text-sm border">
                                {workLog.description}
                            </div>
                        </div>

                        {/* Supervisor Comment (if available) */}
                        {workLog.supervisor_comment && (
                            <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-md">
                                <h4 className="text-sm font-semibold text-indigo-900 mb-1">Supervisor Comment:</h4>
                                <p className="text-sm text-indigo-800">{workLog.supervisor_comment}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                            >
                                Delete Work Log
                            </button>
                            <Link
                                href={typeof route === 'function' ? route('work-logs.edit', workLog.id) : `/work-logs/${workLog.id}/edit`}
                                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                            >
                                Edit Work Log
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}