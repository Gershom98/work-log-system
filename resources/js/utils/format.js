export const STATUS_META = {
    submitted: {
        label: 'Submitted',
        badge: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        dot: 'bg-blue-600',
        bar: 'bg-blue-500',
    },
    assigned: {
        label: 'Assigned',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        dot: 'bg-emerald-600',
        bar: 'bg-emerald-500',
    },
    rejected: {
        label: 'Rejected',
        badge: 'bg-rose-50 text-rose-700 ring-rose-600/20',
        dot: 'bg-rose-600',
        bar: 'bg-rose-500',
    },
    'no data': {
        label: 'No Data',
        badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        dot: 'bg-amber-500',
        bar: 'bg-amber-500',
    },
};

export const STATUS_OPTIONS = Object.keys(STATUS_META).map((value) => ({
    value,
    label: STATUS_META[value].label,
}));

export function capitalize(value) {
    if (!value) {
        return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function statusLabel(status) {
    return STATUS_META[status]?.label ?? capitalize(status || 'submitted');
}

export function formatDate(value) {
    if (!value) {
        return '—';
    }

    const raw = String(value);
    const date = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);

    if (Number.isNaN(date.getTime())) {
        return raw;
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

export function formatDateTime(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export function initials(name) {
    if (!name) {
        return 'U';
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}

function toLocalInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function todayInputValue() {
    return toLocalInputValue(new Date());
}

export function isoDateOffset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return toLocalInputValue(date);
}

export function monthStartInputValue() {
    const now = new Date();

    return toLocalInputValue(new Date(now.getFullYear(), now.getMonth(), 1));
}

export const inputClass =
    'block w-full rounded-lg border-slate-300 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500';

export const errorInputClass = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500';

export const btnPrimary =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const btnSecondary =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';

export const btnDanger =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
