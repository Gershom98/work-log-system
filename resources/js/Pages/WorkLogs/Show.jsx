import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ workLog }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this work log?')) {
            const deleteUrl = typeof route === 'function' && workLog?.id 
                ? route('work-logs.destroy', workLog.id) 
                : `/work-logs/${workLog?.id}`;
            router.delete(deleteUrl);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'assigned':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Assigned
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Rejected
                    </span>
                );
            case 'no data':
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        No Data
                    </span>
                );
            case 'submitted':
            default:
                return (
                    <span className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        Submitted
                    </span>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Work Log Details #{workLog?.id}
                    </h2>
                    <Link
                        href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                        <svg className="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Work Logs List
                    </Link>
                </div>
            }
        >
            <Head title={`Work Log: ${workLog?.title || ''}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-100 p-6 sm:p-8 space-y-6">
                        
                        {/* Title and Status Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-5">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                                    Task / Issue Title
                                </span>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {workLog?.title}
                                </h3>
                            </div>
                            <div>
                                {getStatusBadge(workLog?.status)}
                            </div>
                        </div>

                        {/* Metadata Grid Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50/80 rounded-lg p-4 border border-gray-100">
                                <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                                    Requester / Department
                                </span>
                                <span className="text-base font-semibold text-gray-900 mt-1 block">
                                    {workLog?.requester_name || 'N/A'}
                                </span>
                            </div>

                            <div className="bg-gray-50/80 rounded-lg p-4 border border-gray-100">
                                <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                                    Work Date
                                </span>
                                <span className="text-base font-semibold text-gray-900 mt-1 block">
                                    {workLog?.log_date}
                                </span>
                            </div>

                            <div className="bg-gray-50/80 rounded-lg p-4 border border-gray-100">
                                <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
                                    Hours Spent
                                </span>
                                <span className="text-base font-semibold text-gray-900 mt-1 block">
                                    {workLog?.hours_spent} {workLog?.hours_spent === 1 ? 'Hour' : 'Hours'}
                                </span>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Description / Actions Taken
                            </h4>
                            <div className="p-4 bg-gray-50/60 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap text-sm border border-gray-100 min-h-[100px]">
                                {workLog?.description || (
                                    <span className="italic text-gray-400">No detailed description provided.</span>
                                )}
                            </div>
                        </div>

                        {/* Supervisor Comment (if available) */}
                        {workLog?.supervisor_comment && (
                            <div className="border-l-4 border-indigo-500 bg-indigo-50/60 p-4 rounded-r-lg">
                                <h4 className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">
                                    Supervisor Comment
                                </h4>
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    {workLog.supervisor_comment}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 me-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                            <Link
                                href={typeof route === 'function' && workLog?.id ? route('work-logs.edit', workLog.id) : `/work-logs/${workLog?.id}/edit`}
                                className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 me-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}