import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import PageHeader from '@/Components/ui/PageHeader';
import StatusBadge from '@/Components/ui/StatusBadge';
import { formatDate, formatDateTime, initials } from '@/utils/format';
import { useI18n } from '@/i18n';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ workLog, canManageStatus }) {
    const { t, locale } = useI18n();
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [generating, setGenerating] = useState(false);

    const generateSolutions = () => {
        setGenerating(true);
        router.post(route('work-logs.solutions', workLog.id), {}, {
            preserveScroll: true,
            onFinish: () => setGenerating(false),
        });
    };

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
        { label: 'Work date', value: formatDate(workLog.log_date, locale) },
        { label: 'Submitted by', value: workLog.user?.name || '—', sub: workLog.user?.email },
        { label: 'Last updated', value: formatDateTime(workLog.updated_at, locale) },
    ];

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={t('Work Log #:id', { id: workLog.id })}
                    description={workLog.title}
                    actions={
                        <>
                            <Link href={route('work-logs.index')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {t('Back')}
                            </Link>
                            {workLog.can?.delete && (
                                <button
                                    type="button"
                                    onClick={() => setConfirmingDelete(true)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t('Delete')}
                                </button>
                            )}
                            {workLog.can?.update && (
                                <Link href={route('work-logs.edit', workLog.id)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {t('Edit')}
                                </Link>
                            )}
                        </>
                    }
                />
            }
        >
            <Head title={t('Work Log #:id', { id: workLog.id })} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">{t('Task / issue')}</p>
                                <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900">{workLog.title}</h1>
                            </div>
                            <StatusBadge status={workLog.status} size="lg" />
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
                            {meta.map((item) => (
                                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{t(item.label)}</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                                    {item.sub && <p className="text-xs text-slate-500">{item.sub}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 px-6 pb-8 sm:px-8">
                            <div>
                                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t('Description / actions taken')}</h2>
                                <div className="min-h-[120px] whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
                                    {workLog.description || <span className="italic text-slate-400">{t('No detailed description provided.')}</span>}
                                </div>
                            </div>

                            {workLog.status === 'rejected' && workLog.rejection_reason && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">{t('Reason for rejection')}</h2>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-rose-800">{workLog.rejection_reason}</p>
                                </div>
                            )}

                            {workLog.supervisor_comment && (
                                <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/70 p-4">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-indigo-900">{t('Supervisor comment')}</h2>
                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-indigo-800">{workLog.supervisor_comment}</p>
                                </div>
                            )}

                            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 3l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            {t('AI solutions')}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {t("Resolution note written from the supervisor's perspective.")}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateSolutions}
                                        disabled={generating}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {generating ? t('Generating…') : workLog.ai_solutions ? t('Regenerate') : t('Generate')}
                                    </button>
                                </div>

                                {workLog.ai_solutions ? (
                                    <div className="mt-3 rounded-lg bg-white/80 p-3">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{workLog.ai_solutions}</p>
                                        <p className="mt-2 text-[11px] text-slate-400">
                                            {t('Generated :date · Review before acting on it.', { date: formatDateTime(workLog.ai_solutions_generated_at, locale) })}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-500">{t('No suggestions yet.')}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                    {initials(workLog.user?.name)}
                                </span>
                                <div className="text-xs text-slate-500">
                                    <p>
                                        {t('Submitted by')} <span className="font-semibold text-slate-700">{workLog.user?.name || 'N/A'}</span>
                                    </p>
                                    <p>{t('Created :date', { date: formatDateTime(workLog.created_at, locale) })}</p>
                                </div>
                                {canManageStatus && (
                                    <span className="ms-auto rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                        {t('Manager view')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmingDelete}
                title={t('Delete work log')}
                description={t('This work log will be permanently deleted. This action cannot be undone.')}
                confirmLabel={t('Delete log')}
                processing={deleting}
                onConfirm={handleDelete}
                onClose={() => setConfirmingDelete(false)}
            />
        </AuthenticatedLayout>
    );
}
