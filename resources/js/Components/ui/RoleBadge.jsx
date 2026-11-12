const roles = {
    admin: { label: 'Admin', className: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' },
    supervisor: { label: 'Supervisor', className: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
    user: { label: 'User', className: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
};

export default function RoleBadge({ role }) {
    const meta = roles[role] ?? roles.user;

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${meta.className}`}
        >
            {meta.label}
        </span>
    );
}
