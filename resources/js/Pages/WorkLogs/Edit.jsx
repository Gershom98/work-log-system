import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Field from '@/Components/ui/Field';
import PageHeader from '@/Components/ui/PageHeader';
import StatusBadge from '@/Components/ui/StatusBadge';
import { STATUS_OPTIONS, errorInputClass, formatDate, inputClass } from '@/utils/format';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ workLog, canManageStatus }) {
    const { data, setData, put, processing, errors } = useForm({
        requester_name: workLog?.requester_name || '',
        title: workLog?.title || '',
        description: workLog?.description || '',
        log_date: workLog?.log_date || '',
        status: workLog?.status || 'submitted',
        rejection_reason: workLog?.rejection_reason || '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('work-logs.update', workLog.id), { preserveScroll: true });
    };

    const handleStatusChange = (value) => {
        setData((current) => ({
            ...current,
            status: value,
            rejection_reason: value === 'rejected' ? current.rejection_reason : '',
        }));
    };

    const fieldClass = (name) => `${inputClass} ${errors[name] ? errorInputClass : ''}`;

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Edit Work Log #${workLog.id}`}
                    description={
                        canManageStatus
                            ? 'Update the log details and set any status.'
                            : 'Update the log details. Status can only be Submitted or Assigned; Rejected and No Data are set by supervisors and admins.'
                    }
                    actions={
                        <Link href={route('work-logs.index')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to logs
                        </Link>
                    }
                />
            }
        >
            <Head title={`Edit Work Log #${workLog.id}`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                                {(workLog.user?.name || 'U').charAt(0).toUpperCase()}
                            </span>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400">Submitted by</p>
                                <p className="text-sm font-semibold text-slate-800">{workLog.user?.name || 'N/A'}</p>
                                <p className="text-xs text-slate-500">{workLog.user?.email || ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div>
                                <p className="uppercase tracking-wide text-slate-400">Work date</p>
                                <p className="mt-0.5 font-semibold text-slate-700">{formatDate(workLog.log_date)}</p>
                            </div>
                            <div>
                                <p className="uppercase tracking-wide text-slate-400">Status</p>
                                <div className="mt-1"><StatusBadge status={workLog.status} /></div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                        <div className="space-y-6 p-6 sm:p-8">
                            <Field label="Requester name / department" htmlFor="requester_name" required error={errors.requester_name}>
                                <input
                                    id="requester_name"
                                    type="text"
                                    value={data.requester_name}
                                    onChange={(event) => setData('requester_name', event.target.value)}
                                    className={fieldClass('requester_name')}
                                    required
                                />
                            </Field>

                            <Field label="Task / issue title" htmlFor="title" required error={errors.title}>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    className={fieldClass('title')}
                                    required
                                />
                            </Field>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Field label="Work date" htmlFor="log_date" required error={errors.log_date}>
                                    <input
                                        id="log_date"
                                        type="date"
                                        value={data.log_date}
                                        onChange={(event) => setData('log_date', event.target.value)}
                                        className={fieldClass('log_date')}
                                        required
                                    />
                                </Field>

                                {canManageStatus ? (
                                    <Field label="Status" htmlFor="status" required error={errors.status}>
                                        <select id="status" value={data.status} onChange={(event) => handleStatusChange(event.target.value)} className={fieldClass('status')}>
                                            {STATUS_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </Field>
                                ) : (
                                    <Field label="Status" htmlFor="status" error={errors.status} hint="Rejected and No Data are set by supervisors and admins.">
                                        <select id="status" value={data.status} onChange={(event) => handleStatusChange(event.target.value)} className={fieldClass('status')}>
                                            <option value="submitted">Submitted</option>
                                            <option value="assigned">Assigned</option>
                                        </select>
                                    </Field>
                                )}
                            </div>

                            {canManageStatus && data.status === 'rejected' && (
                                <Field label="Reason for rejection" htmlFor="rejection_reason" required error={errors.rejection_reason}>
                                    <textarea
                                        id="rejection_reason"
                                        rows="3"
                                        value={data.rejection_reason}
                                        onChange={(event) => setData('rejection_reason', event.target.value)}
                                        className={`${fieldClass('rejection_reason')} border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500`}
                                        required
                                    />
                                </Field>
                            )}

                            <Field label="Description / actions taken" htmlFor="description" error={errors.description}>
                                <textarea
                                    id="description"
                                    rows="5"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    className={fieldClass('description')}
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
                            <Link href={route('work-logs.index')} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing && (
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {processing ? 'Updating...' : 'Update work log'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
