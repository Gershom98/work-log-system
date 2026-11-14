import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/ui/PageHeader';
import StatCard from '@/Components/ui/StatCard';
import StatusBadge from '@/Components/ui/StatusBadge';
import RoleBadge from '@/Components/ui/RoleBadge';
import { STATUS_META, formatDate, initials } from '@/utils/format';
import { useI18n } from '@/i18n';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats = {}, recentLogs = [], topContributors = [] }) {
    const { t, locale } = useI18n();

    const statusRows = [
        { key: 'submitted', label: 'Submitted', count: stats.submitted_logs || 0, filter: 'submitted' },
        { key: 'assigned', label: 'Assigned', count: stats.assigned_logs || 0, filter: 'assigned' },
        { key: 'rejected', label: 'Rejected', count: stats.rejected_logs || 0, filter: 'rejected' },
        { key: 'no data', label: 'No Data', count: stats.no_data_logs || 0, filter: 'no data' },
    ];

    const totalLogs = stats.total_logs || 0;
    const maxCount = Math.max(...statusRows.map((row) => row.count), 1);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={t('Dashboard')}
                    description={t('A quick overview of team activity, statuses and the latest submissions.')}
                    actions={
                        <>
                            <a
                                href={route('work-logs.downloadPdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {t('Export PDF')}
                            </a>
                            <Link href={route('work-logs.index')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                                {t('View all logs')}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </>
                    }
                />
            }
        >
            <Head title={t('Dashboard')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            label={t('Total logs')}
                            value={totalLogs}
                            hint={t('All recorded work')}
                            tone="indigo"
                            href={route('work-logs.index')}
                            icon={<LogsIcon />}
                        />
                        <StatCard
                            label={t('Submitted')}
                            value={stats.submitted_logs || 0}
                            hint={t('Awaiting review')}
                            tone="sky"
                            href={route('work-logs.index', { status: 'submitted' })}
                            icon={<SendIcon />}
                        />
                        <StatCard
                            label={t('Assigned')}
                            value={stats.assigned_logs || 0}
                            hint={t('In progress')}
                            tone="emerald"
                            href={route('work-logs.index', { status: 'assigned' })}
                            icon={<CheckIcon />}
                        />
                        <StatCard
                            label={t('Rejected')}
                            value={stats.rejected_logs || 0}
                            hint={t('Needs follow-up')}
                            tone="rose"
                            href={route('work-logs.index', { status: 'rejected' })}
                            icon={<RejectIcon />}
                        />
                        <StatCard
                            label={t('Team members')}
                            value={stats.total_users || 0}
                            hint={t('Registered users')}
                            tone="slate"
                            icon={<UsersIcon />}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card lg:col-span-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">{t('Status distribution')}</h3>
                                    <p className="text-xs text-slate-500">{t('Share of logs by current status.')}</p>
                                </div>
                                <Link href={route('work-logs.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">{t('View logs →')}</Link>
                            </div>

                            <div className="mt-5 space-y-4">
                                {statusRows.map((row) => {
                                    const percent = totalLogs > 0 ? Math.round((row.count / totalLogs) * 100) : 0;
                                    const barWidth = totalLogs > 0 ? Math.max((row.count / maxCount) * 100, row.count > 0 ? 4 : 0) : 0;
                                    const meta = STATUS_META[row.key];

                                    return (
                                        <Link key={row.key} href={route('work-logs.index', { status: row.filter })} className="block rounded-lg p-1 transition hover:bg-slate-50">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                                    {t(row.label)}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    <span className="font-semibold text-slate-700">{row.count}</span> · {percent}%
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${barWidth}%` }} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {totalLogs === 0 && (
                                <p className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                                    {t('No work logs yet. Create the first one from the Work Logs page.')}
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
                            <h3 className="text-base font-semibold text-slate-900">{t('Top contributors')}</h3>
                            <p className="text-xs text-slate-500">{t('Users with the most work logs.')}</p>

                            <div className="mt-4 space-y-3">
                                {topContributors.length > 0 ? (
                                    topContributors.map((contributor, index) => (
                                        <div key={contributor.id} className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                                                {initials(contributor.name)}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">{contributor.name}</p>
                                                <p className="truncate text-xs text-slate-400">{contributor.email}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-sm font-bold text-slate-700">{contributor.work_logs_count}</span>
                                                <RoleBadge role={contributor.role} />
                                            </div>
                                            <span className="sr-only">{t('Rank :rank', { rank: index + 1 })}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">{t('No contributors yet.')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
                        <div className="flex flex-col gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">{t('Recent activity')}</h3>
                                <p className="text-xs text-slate-500">{t('The latest six work logs.')}</p>
                            </div>
                            <Link href={route('work-logs.index')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">{t('View all →')}</Link>
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Date')}</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Submitted by')}</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Requester')}</th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Task')}</th>
                                        <th className="px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Status')}</th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {recentLogs.length > 0 ? (
                                        recentLogs.map((log) => (
                                            <tr key={log.id} className="transition hover:bg-slate-50/70">
                                                <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">{formatDate(log.log_date, locale)}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
                                                            {initials(log.user?.name)}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-slate-800">{log.user?.name || 'N/A'}</p>
                                                            <p className="truncate text-[11px] text-slate-400">{log.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">{log.requester_name}</td>
                                                <td className="max-w-xs px-6 py-4">
                                                    <Link href={route('work-logs.show', log.id)} className="block truncate text-sm font-medium text-slate-800 hover:text-indigo-700">
                                                        {log.title}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center"><StatusBadge status={log.status} /></td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Link href={route('work-logs.show', log.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">{t('View')}</Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-sm text-slate-500">{t('No recent activity.')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="divide-y divide-slate-100 md:hidden">
                            {recentLogs.length > 0 ? (
                                recentLogs.map((log) => (
                                    <Link key={log.id} href={route('work-logs.show', log.id)} className="block p-4 transition hover:bg-slate-50">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{formatDate(log.log_date, locale)}</p>
                                                <p className="mt-1 truncate text-sm font-semibold text-slate-900">{log.title}</p>
                                                <p className="text-xs text-slate-500">{log.user?.name || 'N/A'} · {log.requester_name}</p>
                                            </div>
                                            <StatusBadge status={log.status} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="p-6 text-center text-sm text-slate-500">{t('No recent activity.')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LogsIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function UsersIcon() {
    return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}
