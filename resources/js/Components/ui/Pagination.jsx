import { Link } from '@inertiajs/react';

function decodeLabel(label) {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

export default function Pagination({ paginator, label = 'records' }) {
    if (!paginator || !paginator.links) {
        return null;
    }

    const { from, to, total, links } = paginator;
    const visible = links.length > 3;

    return (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
            <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{total === 0 ? 0 : from}</span> to{' '}
                <span className="font-semibold text-slate-700">{total === 0 ? 0 : to}</span> of{' '}
                <span className="font-semibold text-slate-700">{total}</span> {label}
            </p>

            {visible && (
                <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
                    {links.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                preserveState
                                preserveScroll
                                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {decodeLabel(link.label)}
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="cursor-not-allowed rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 opacity-60"
                            >
                                {decodeLabel(link.label)}
                            </span>
                        ),
                    )}
                </nav>
            )}
        </div>
    );
}
