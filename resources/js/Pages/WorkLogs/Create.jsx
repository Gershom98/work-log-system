import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        requester_name: '',
        title: '',
        // description: '',
        hours_spent: 1,
        status: 'submitted', // Default status imewekwa 'submitted'
        log_date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const targetUrl = typeof route === 'function' ? route('work-logs.store') : '/work-logs';
        post(targetUrl);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create New Work Log / Issue
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
            <Head title="Create Work Log" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Requester Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Requester Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.requester_name}
                                    onChange={(e) => setData('requester_name', e.target.value)}
                                    placeholder="e.g. John Doe or Accounting Department"
                                    className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.requester_name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.requester_name && (
                                    <p className="mt-1 text-xs text-red-600">{errors.requester_name}</p>
                                )}
                            </div>

                            {/* Task Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Task / Issue Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Printer Repair / Network Failure"
                                    className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Date, Hours Spent and Status */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.log_date}
                                        onChange={(e) => setData('log_date', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.log_date ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.log_date && (
                                        <p className="mt-1 text-xs text-red-600">{errors.log_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hours Spent <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={data.hours_spent}
                                        onChange={(e) => setData('hours_spent', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.hours_spent ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.hours_spent && (
                                        <p className="mt-1 text-xs text-red-600">{errors.hours_spent}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.status ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-xs text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Additional Description / Actions Taken <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Briefly describe how you resolved or are resolving this issue..."
                                    className={`mt-1 block w-full rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                                )}
                            </div> */}

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-3">
                                <Link
                                    href={typeof route === 'function' ? route('work-logs.index') : '/work-logs'}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Work Log'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}