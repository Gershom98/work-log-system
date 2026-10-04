import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';

export default function Edit({ workLog }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        requester_name: workLog?.requester_name || '',
        title: workLog?.title || '',
        description: workLog?.description || '',
        status: workLog?.status || 'submitted',
        rejection_reason: workLog?.rejection_reason || '',
        log_date: workLog?.log_date || new Date().toISOString().split('T')[0],
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setData((prevData) => ({
            ...prevData,
            status: newStatus,
            rejection_reason: newStatus === 'rejected' ? prevData.rejection_reason : '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const targetUrl = typeof route === 'function' && workLog?.id
            ? route('work-logs.update', workLog.id)
            : `/work-logs/${workLog?.id}`;

        post(targetUrl, {
            preserveScroll: true,
            onError: (err) => {
                console.error('Validation Errors:', JSON.stringify(err, null, 2));
            },
        });
    };

    const indexRoute = typeof route === 'function' ? route('work-logs.index') : '/work-logs';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Work Log #{workLog?.id}
                    </h2>
                    <Link
                        href={indexRoute}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
                    >
                        <svg className="me-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Work Logs List
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Work Log: ${workLog?.title || ''}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Requester Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Requester Name / Department <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.requester_name}
                                        onChange={(e) => setData('requester_name', e.target.value)}
                                        placeholder="e.g. John Doe or Accounting Department"
                                        className={`mt-1 block w-full rounded-md text-sm shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 ${
                                            errors.requester_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.requester_name && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.requester_name}</p>
                                    )}
                                </div>

                                {/* Task Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Task / Issue Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Printer Repair / Network Failure Resolution"
                                        className={`mt-1 block w-full rounded-md text-sm shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 ${
                                            errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Date and Status */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.log_date}
                                            onChange={(e) => setData('log_date', e.target.value)}
                                            className={`mt-1 block w-full rounded-md text-sm shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errors.log_date ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.log_date && (
                                            <p className="mt-1 text-xs text-rose-600">{errors.log_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status {!isAdmin && <span className="text-xs font-normal text-gray-400">(Admin only)</span>}
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={handleStatusChange}
                                            disabled={!isAdmin}
                                            className={`mt-1 block w-full rounded-md text-sm shadow-sm transition ${
                                                !isAdmin
                                                    ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500'
                                                    : errors.status
                                                    ? 'border-rose-500 ring-1 ring-rose-500'
                                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                            }`}
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="no data">No Data</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="assigned">Assigned</option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-xs text-rose-600">{errors.status}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Display Rejection Reason when status is 'rejected' */}
                                {data.status === 'rejected' && (
                                    <div className="rounded-md border border-rose-200 bg-rose-50 p-4">
                                        <label className="block text-sm font-medium text-rose-800">
                                            Reason for Rejection <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={data.rejection_reason}
                                            onChange={(e) => setData('rejection_reason', e.target.value)}
                                            disabled={!isAdmin}
                                            placeholder="Provide the reason why this work log was rejected..."
                                            className={`mt-1 block w-full rounded-md text-sm shadow-sm transition focus:border-rose-500 focus:ring-rose-500 ${
                                                !isAdmin ? 'cursor-not-allowed bg-gray-100 text-gray-600' : ''
                                            } ${
                                                errors.rejection_reason ? 'border-rose-500 ring-1 ring-rose-500' : 'border-rose-300'
                                            }`}
                                        />
                                        {errors.rejection_reason && (
                                            <p className="mt-1 text-xs text-rose-600">{errors.rejection_reason}</p>
                                        )}
                                    </div>
                                )}

                                {/* Description / Actions Taken */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description / Actions Taken
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Provide details about the issue or steps taken to resolve it..."
                                        className={`mt-1 block w-full rounded-md text-sm shadow-sm transition focus:border-indigo-500 focus:ring-indigo-500 ${
                                            errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
                                    <Link
                                        href={indexRoute}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="-ms-1 me-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Work Log'
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}