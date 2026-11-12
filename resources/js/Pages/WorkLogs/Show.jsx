import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import PageHeader from '@/Components/ui/PageHeader';
import StatusBadge from '@/Components/ui/StatusBadge';
import { formatDate, formatDateTime, initials } from '@/utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ workLog, canManageStatus }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('work-logs.destroy', workLog.id), {
            onFinish: () => {
                setDeleting(false);
                setConfirmingDelete(false);
            },
        });
    };

    const meta = [
        { label: 'Requester / department', value: workLog.requester_name || '—' },
        { label: 'Work date', value: formatDate(workLog.log_date) },
        { label: 'Submitted by', value: workLog.user?.name || '—', sub: workLog.user?.email },
        { label: 'Last updated', value: formatDateTime(workLog.updated_at) },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Work Log #${workLog.id}`}
                    description={workLog.title}
                    actions={
                        <>
                            <Link href={route('work-logs.index')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </Link>
                            <button
                                type="button"
                                onClick={() => setConfirmingDelete(true)}
                                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                            <Link href={route('work-logs.edit', workLog.id)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </Link>
                        </>
                    }
                />
            }
        >
            <Head title={`Work Log #${workLog.id}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Task / issue</p>
                                <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900">{workLog.title}</h1>
                            </div>
                            <StatusBadge status={workLog.status} size="lg" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
                            {meta.map((item) => (
                                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{item.label}</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                                    {item.sub && <p className="text-xs text-slate-500">{item.sub}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 px-6 pb-8 sm:px-8">
                            <div>
                                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description / actions taken</h2>
                                <div className="min-h-[120px] whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
                                    {workLog.description || <span className="italic text-slate-400">No detailed description provided.</span>}
                                </div>
                            </div>

                            {workLog.status === 'rejected' && workLog.rejection_reason && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">Reason for rejection</h2>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-rose-800">{workLog.rejection_reason}</p>
                                </div>
                            )}

                            {workLog.supervisor_comment && (
                                <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/70 p-4">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-indigo-900">Supervisor comment</h2>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-indigo-800">{workLog.supervisor_comment}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                    {initials(workLog.user?.name)}
                                </span>
                                <div className="text-xs text-slate-500">
                                    <p>
                                        Submitted by <span className="font-semibold text-slate-700">{workLog.user?.name || 'N/A'}</span>
                                    </p>
                                    <p>Created {formatDateTime(workLog.created_at)}</p>
                                </div>
                                {canManageStatus && (
                                    <span className="ms-auto rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                        Manager view
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmingDelete}
                title="Delete work log"
                description="This work log will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete log"
                processing={deleting}
                onConfirm={handleDelete}
                onClose={() => setConfirmingDelete(false)}
            />
        </AuthenticatedLayout>
    );
}
