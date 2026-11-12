import { Link } from '@inertiajs/react';

const toneStyles = {
    indigo: { icon: 'bg-indigo-50 text-indigo-600 border-indigo-100', value: 'text-slate-900', accent: 'from-indigo-500 to-indigo-300' },
    blue: { icon: 'bg-blue-50 text-blue-600 border-blue-100', value: 'text-slate-900', accent: 'from-blue-500 to-sky-300' },
    emerald: { icon: 'bg-emerald-50 text-emerald-600 border-emerald-100', value: 'text-emerald-600', accent: 'from-emerald-500 to-emerald-300' },
    rose: { icon: 'bg-rose-50 text-rose-600 border-rose-100', value: 'text-rose-600', accent: 'from-rose-500 to-rose-300' },
    amber: { icon: 'bg-amber-50 text-amber-600 border-amber-100', value: 'text-amber-600', accent: 'from-amber-500 to-amber-300' },
    slate: { icon: 'bg-slate-100 text-slate-600 border-slate-200', value: 'text-slate-900', accent: 'from-slate-400 to-slate-300' },
};

export default function StatCard({ label, value, hint, icon, tone = 'indigo', href }) {
    const styles = toneStyles[tone] ?? toneStyles.indigo;

    const content = (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className={`mt-2 text-3xl font-bold tracking-tight ${styles.value}`}>{value}</p>
                    {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
                </div>
                {icon && (
                    <div className={`rounded-xl border p-2.5 ${styles.icon}`}>
                        {icon}
                    </div>
                )}
            </div>
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${styles.accent}`} />
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                {content}
            </Link>
        );
    }

    return content;
}
