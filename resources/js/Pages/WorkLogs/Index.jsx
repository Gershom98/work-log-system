import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

export default function Index({ logs, filters = {} }) {
    const { flash, auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    // Filter States
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // Delete Confirmation Modal State
    const [deletingId, setDeletingId] = useState(null);

    // Track initial render to skip automatic debounced fetch on mount
    const isFirstRender = useRef(true);

    // Clean empty query parameters
    const getCleanFilters = useCallback(() => {
        const rawFilters = { search, status, start_date: startDate, end_date: endDate };
        return Object.fromEntries(
            Object.entries(rawFilters).filter(([_, val]) => val !== '' && val !== null && val !== undefined)
        );
    }, [search, status, startDate, endDate]);

    // Apply filters via Inertia
    const applyFilters = useCallback(() => {
        const routeUrl = typeof route === 'function' ? route('work-logs.index') : '/work-logs';
        router.get(
            routeUrl,
            getCleanFilters(),
            { preserveState: true, replace: true }
        );
    }, [getCleanFilters]);

    // Debounced filter execution on input change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            applyFilters();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, status, startDate, endDate, applyFilters]);

    // Manual Submit
    const handleFilter = (e) => {
        if (e) e.preventDefault();
        applyFilters();
    };

    // Reset Filters
    const handleReset = () => {
        setSearch('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        
        const routeUrl = typeof route === 'function' ? route('work-logs.index') : '/work-logs';
        router.get(routeUrl, {}, { preserveState: true, replace: true });
    };

    // Confirm Delete Action
    const confirmDelete = () => {
        if (!deletingId) return;
        const deleteUrl = typeof route === 'function' ? route('work-logs.destroy', deletingId) : `/work-logs/${deletingId}`;
        
        router.delete(deleteUrl, {
            onSuccess: () => setDeletingId(null),
        });
    };

    const getStatusBadge = (statusKey) => {
        const styles = {
            submitted: 'bg-blue-100 text-blue-800 border-blue-200',
            approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            rejected: 'bg-rose-100 text-rose-800 border-rose-200',
            pending: 'bg-amber-100 text-amber-800 border-amber-200',
        };

        const currentStyle = styles[statusKey] || 'bg-gray-100 text-gray-800 border-gray-200';
        const label = statusKey ? statusKey.charAt(0).toUpperCase() + statusKey.slice(1) : 'Submitted';

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
                {label}
            </span>
        );
    };

    const getDownloadPdfUrl = () => {
        const activeFilters = getCleanFilters();
        const queryParams = new URLSearchParams(activeFilters).toString();
        const baseUrl = typeof route === 'function' ? route('work-logs.downloadPdf') : '/work-logs/download-pdf';

        return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    };

    // Calculate total hours on current page
    const totalHoursCalculated = useMemo(() => {
        return logs?.data?.reduce((sum, item) => sum + Number(item.hours_spent || 0), 0) || 0;
    }, [logs?.data]);

    // Helper function to decode standard HTML entities safely for pagination
    const formatPaginationLabel = (label) => {
        return label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Work Logs List
                    </h2>

                    <div className="flex items-center space-x-3">
                        <a
                            href={getDownloadPdfUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none transition ease-in-out duration-150"
                        >
                            <svg className="me-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Report (PDF)
                        </a>

                        <Link
                            href={typeof route === 'function' ? route('work-logs.create') : '/work-logs/create'}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition ease-in-out duration-150"
                        >
                            <svg className="me-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Log
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Work Logs List" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {flash?.message && (
                        <div className="flex items-center rounded-md bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800 shadow-sm">
                            <svg className="w-5 h-5 me-2 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
                            </svg>
                            {flash.message}
                        </div>
                    )}

                    {/* METRICS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{logs?.total || logs?.data?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Page Hours Logged</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{totalHoursCalculated} {totalHoursCalculated === 1 ? 'Hour' : 'Hours'}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Filter</p>
                                <p className="text-sm font-semibold text-indigo-600 mt-1">
                                    {status ? status.toUpperCase() : 'ALL STATUSES'}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* FILTER FORM */}
                    <div className="bg-white p-4 shadow-sm sm:rounded-lg border border-gray-100">
                        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Search Keyword</label>
                                <input
                                    type="text"
                                    placeholder="Task title or client..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-md font-medium hover:bg-indigo-700 transition"
                                >
                                    Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md font-medium hover:bg-gray-200 transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        {isAdmin && (
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Submitted By
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requester / Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Title</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {logs?.data && logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {log.log_date}
                                                </td>

                                                {isAdmin && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">
                                                            {log.user?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {log.user?.email || ''}
                                                        </div>
                                                    </td>
                                                )}

                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {log.requester_name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 max-w-xs truncate" title={log.title}>
                                                    {log.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                                                    {log.hours_spent} {log.hours_spent === 1 ? 'Hour' : 'Hours'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getStatusBadge(log.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                    <Link
                                                        href={typeof route === 'function' ? route('work-logs.edit', log.id) : `/work-logs/${log.id}/edit`}
                                                        className="inline-flex items-center p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition"
                                                        title="Edit Log"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingId(log.id)}
                                                        className="inline-flex items-center p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-md transition"
                                                        title="Delete Log"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 6} className="px-6 py-10 text-center text-gray-500">
                                                No work logs recorded matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Counter & Pagination Container */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                <div className="text-xs text-gray-500">
                                    Showing <span className="font-semibold text-gray-700">{logs?.from || (logs?.data?.length ? 1 : 0)}</span> to{' '}
                                    <span className="font-semibold text-gray-700">{logs?.to || logs?.data?.length || 0}</span> of{' '}
                                    <span className="font-semibold text-gray-700">{logs?.total || logs?.data?.length || 0}</span> logs
                                </div>

                                {logs?.links && logs.links.length > 3 && (
                                    <div className="flex space-x-1">
                                        {logs.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    preserveState
                                                    preserveScroll
                                                    className={`px-3 py-1 text-xs rounded-md border transition ${
                                                        link.active
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {formatPaginationLabel(link.label)}
                                                </Link>
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-xs rounded-md border bg-white text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                                                >
                                                    {formatPaginationLabel(link.label)}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl transform transition-all space-y-4">
                        <div className="flex items-center space-x-3 text-rose-600">
                            <div className="p-2 bg-rose-100 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Delete Work Log</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this work log? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}