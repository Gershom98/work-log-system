export default function EmptyState({ title, description, action, icon }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                {icon ?? (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                )}
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
