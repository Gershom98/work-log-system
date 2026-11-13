import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import EmptyState from '@/Components/ui/EmptyState';
import PageHeader from '@/Components/ui/PageHeader';
import Pagination from '@/Components/ui/Pagination';
import StatCard from '@/Components/ui/StatCard';
import StatusBadge from '@/Components/ui/StatusBadge';
import { STATUS_OPTIONS, formatDate, inputClass, isoDateOffset, monthStartInputValue, todayInputValue } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_PER_PAGE = 10;

export default function Index({ logs, summary = {}, filters = {}, perPageOptions = [5, 10, 25, 50], canManageStatus }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [perPage, setPerPage] = useState(Number(filters.per_page) || DEFAULT_PER_PAGE);

    const [deletingLog, setDeletingLog] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const isFirstRender = useRef(true);
    const skipDebounce = useRef(false);

    const buildParams = useCallback((values) => {
        const params = {
            search: (values.search || '').trim(),
            status: values.status || '',
            start_date: values.start_date || '',
            end_date: values.end_date || '',
            sort: values.sort === 'oldest' ? 'oldest' : '',
            per_page: Number(values.per_page) !== DEFAULT_PER_PAGE ? values.per_page : '',
        };

        return Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
        );
    }, []);

    const applyFilters = useCallback(
        (overrides = {}) => {
            const merged = {
                search,
                status,
                start_date: startDate,
                end_date: endDate,
                sort,
                per_page: perPage,
                ...overrides,
            };

            router.get(route('work-logs.index'), buildParams(merged), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        [search, status, startDate, endDate, sort, perPage, buildParams],
    );

    const applyFiltersRef = useRef(applyFilters);
    applyFiltersRef.current = applyFilters;

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (skipDebounce.current) {
            skipDebounce.current = false;
            return;
        }

        const timer = setTimeout(() => applyFiltersRef.current(), 450);

        return () => clearTimeout(timer);
    }, [search, startDate, endDate]);

    const applyImmediately = (overrides, { skip = false } = {}) => {
        if (skip) {
            skipDebounce.current = true;
        }
        applyFilters(overrides);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        applyFilters({ status: value });
    };

    const handleSortChange = (value) => {
        setSort(value);
        applyFilters({ sort: value });
    };

    const handlePerPageChange = (value) => {
        setPerPage(value);
        applyFilters({ per_page: value });
    };

    const handlePreset = (preset) => {
        const today = todayInputValue();
        let range = { start_date: '', end_date: '' };

        if (preset === 'today') {
            range = { start_date: today, end_date: today };
        } else if (preset === 'week') {
            range = { start_date: isoDateOffset(-6), end_date: today };
        } else if (preset === 'month') {
            range = { start_date: monthStartInputValue(), end_date: today };
        }

        setStartDate(range.start_date);
        setEndDate(range.end_date);
        applyImmediately(range, { skip: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setSort('newest');
        setPerPage(DEFAULT_PER_PAGE);
        skipDebounce.current = true;

        router.get(route('work-logs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const confirmDelete = () => {
        if (!deletingLog) {
            return;
        }

        setDeleting(true);
        router.delete(route('work-logs.destroy', deletingLog.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeletingLog(null);
            },
        });
    };

    const downloadPdfUrl = () => {
        const params = buildParams({ search, status, start_date: startDate, end_date: endDate, sort, per_page: perPage });
        const query = new URLSearchParams(params).toString();

        return query ? `${route('work-logs.downloadPdf')}?${query}` : route('work-logs.downloadPdf');
    };

    const activeChips = [
        search && { key: 'search', label: `Search: “${search}”`, clear: () => { setSearch(''); applyImmediately({ search: '' }, { skip: true }); } },
        status && { key: 'status', label: STATUS_OPTIONS.find((option) => option.value === status)?.label, clear: () => { setStatus(''); applyImmediately({ status: '' }); } },
        startDate && { key: 'start', label: `From ${formatDate(startDate)}`, clear: () => { setStartDate(''); applyImmediately({ start_date: '' }, { skip: true }); } },
        endDate && { key: 'end', label: `To ${formatDate(endDate)}`, clear: () => { setEndDate(''); applyImmediately({ end_date: '' }, { skip: true }); } },
    ].filter(Boolean);

    const total = summary.total ?? 0;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Daily Work Logs"
                    description={
                        canManageStatus
                            ? 'Review every submitted log, track statuses and export filtered reports.'
                            : 'Keep a record of your daily work and follow the review status of each log.'
                    }
                    actions={
                        <>
                            <a
                                href={downloadPdfUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export PDF
                            </a>
                            <Link href={route('work-logs.create')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                New Log
                            </Link>
                        </>
                    }
                />
            }
        >
            <Head title="Daily Work Logs" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Matching logs" value={total} hint="Based on current filters" tone="indigo" icon={<DocumentIcon />} />
                        <StatCard label="Active" value={summary.active ?? 0} hint="Submitted or assigned" tone="blue" icon={<ActivityIcon />} />
                        <StatCard label="Rejected" value={summary.rejected ?? 0} hint="Needs attention" tone="rose" icon={<RejectIcon />} />
                        <StatCard label="No data" value={summary.no_data ?? 0} hint="Awaiting information" tone="amber" icon={<NoDataIcon />} />
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label htmlFor="search" className="mb-1 block text-xs font-medium text-slate-600">Search</label>
                                    <input
                                        id="search"
                                        type="text"
                                        placeholder="Task title or requester"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                                    <select id="status" value={status} onChange={(event) => handleStatusChange(event.target.value)} className={inputClass}>
                                        <option value="">All statuses</option>
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="start_date" className="mb-1 block text-xs font-medium text-slate-600">From</label>
                                    <input id="start_date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClass} />
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="mb-1 block text-xs font-medium text-slate-600">To</label>
                                    <input id="end_date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Quick range</span>
                                <button type="button" onClick={() => handlePreset('all')} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700">All time</button>
                                <button type="button" onClick={() => handlePreset('today')} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700">Today</button>
                                <button type="button" onClick={() => handlePreset('week')} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700">Last 7 days</button>
                                <button type="button" onClick={() => handlePreset('month')} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700">This month</button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <select aria-label="Sort by date" value={sort} onChange={(event) => handleSortChange(event.target.value)} className="rounded-lg border-slate-300 text-xs text-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    <option value="newest">Newest first</option>
                                    <option value="oldest">Oldest first</option>
                                </select>
                                <select aria-label="Rows per page" value={perPage} onChange={(event) => handlePerPageChange(Number(event.target.value))} className="rounded-lg border-slate-300 text-xs text-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                    {perPageOptions.map((option) => (
                                        <option key={option} value={option}>{option} / page</option>
                                    ))}
                                </select>
                                <button type="button" onClick={handleReset} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
                                    Reset
                                </button>
                            </div>
                        </div>

                        {activeChips.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {activeChips.map((chip) => (
                                    <button
                                        key={chip.key}
                                        type="button"
                                        onClick={chip.clear}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                                    >
                                        {chip.label}
                                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="hidden md:block">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                        {canManageStatus && (
                                            <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Submitted by</th>
                                        )}
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Requester</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Task</th>
                                        <th className="px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {logs?.data?.length > 0 ? (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="transition hover:bg-slate-50/70">
                                                <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">{formatDate(log.log_date)}</td>
                                                {canManageStatus && (
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                                                                {(log.user?.name || 'U').charAt(0).toUpperCase()}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <div className="truncate text-xs font-semibold text-slate-800">{log.user?.name || 'N/A'}</div>
                                                                <div className="truncate text-[11px] text-slate-400">{log.user?.email || ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{log.requester_name}</td>
                                                <td className="max-w-xs px-6 py-4">
                                                    <Link href={route('work-logs.show', log.id)} className="block truncate text-sm font-medium text-slate-800 hover:text-indigo-700" title={log.title}>
                                                        {log.title}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center"><StatusBadge status={log.status} /></td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <IconLink href={route('work-logs.show', log.id)} label="View log">
                                                            <EyeIcon />
                                                        </IconLink>
                                                        {log.can?.update && (
                                                            <IconLink href={route('work-logs.edit', log.id)} label="Edit log">
                                                                <PencilIcon />
                                                            </IconLink>
                                                        )}
                                                        {log.can?.delete && (
                                                            <button type="button" onClick={() => setDeletingLog(log)} className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700" aria-label="Delete log">
                                                                <TrashIcon />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={canManageStatus ? 6 : 5}>
                                                <EmptyState
                                                    title="No work logs found"
                                                    description="Try adjusting the filters, or create a new work log to get started."
                                                    action={<Link href={route('work-logs.create')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">Create a work log →</Link>}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-slate-100 md:hidden">
                            {logs?.data?.length > 0 ? (
                                logs.data.map((log) => (
                                    <div key={log.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{formatDate(log.log_date)}</p>
                                                <Link href={route('work-logs.show', log.id)} className="mt-1 block truncate text-sm font-semibold text-slate-900">
                                                    {log.title}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-slate-500">Requester: {log.requester_name}</p>
                                                {canManageStatus && log.user && (
                                                    <p className="text-xs text-slate-400">By {log.user.name}</p>
                                                )}
                                            </div>
                                            <StatusBadge status={log.status} />
                                        </div>
                                        <div className="mt-3 flex items-center justify-end gap-2">
                                            <Link href={route('work-logs.show', log.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">View</Link>
                                            {log.can?.update && (
                                                <Link href={route('work-logs.edit', log.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">Edit</Link>
                                            )}
                                            {log.can?.delete && (
                                                <button type="button" onClick={() => setDeletingLog(log)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600">Delete</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState
                                    title="No work logs found"
                                    description="Try adjusting the filters, or create a new work log to get started."
                                />
                            )}
                        </div>

                        <div className="px-4 pb-4 sm:px-6">
                            <Pagination paginator={logs} label="logs" />
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={Boolean(deletingLog)}
                title="Delete work log"
                description={deletingLog ? `“${deletingLog.title}” will be permanently deleted. This action cannot be undone.` : ''}
                confirmLabel="Delete log"
                processing={deleting}
                onConfirm={confirmDelete}
                onClose={() => setDeletingLog(null)}
            />
        </AuthenticatedLayout>
    );
}

function IconLink({ href, label, children }) {
    return (
        <Link href={href} className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700" aria-label={label} title={label}>
            {children}
        </Link>
    );
}

function DocumentIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function ActivityIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    );
}

function RejectIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function NoDataIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01M5.062 20h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}
