import { router, usePage } from '@inertiajs/react';

const LABELS = {
    en: 'English',
    sw: 'Kiswahili',
};

export default function LanguageSwitcher({ className = '' }) {
    const locale = usePage().props.locale ?? 'en';

    const change = (value) => {
        if (value === locale) {
            return;
        }

        router.post(route('language.switch', value), {}, { preserveScroll: true });
    };

    return (
        <div
            role="group"
            aria-label="Language"
            className={`inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-sm ${className}`}
        >
            {Object.entries(LABELS).map(([code, label]) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => change(code)}
                    aria-pressed={locale === code}
                    title={label}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                        locale === code
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                >
                    {code}
                </button>
            ))}
        </div>
    );
}
