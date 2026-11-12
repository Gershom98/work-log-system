import { STATUS_META, statusLabel } from '@/utils/format';

export default function StatusBadge({ status, size = 'sm' }) {
    const meta = STATUS_META[status] ?? STATUS_META.submitted;
    const sizing = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2.5 py-1 text-[11px]';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset ${meta.badge} ${sizing}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {statusLabel(status)}
        </span>
    );
}
