export default function PageHeader({ title, description, actions }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold leading-tight text-slate-900">{title}</h2>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
        </div>
    );
}
