import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [dismissed, setDismissed] = useState(false);

    const message = flash?.message;
    const error = flash?.error;

    useEffect(() => {
        setDismissed(false);

        if (!message && !error) {
            return;
        }

        const timer = setTimeout(() => setDismissed(true), 6000);

        return () => clearTimeout(timer);
    }, [message, error]);

    if (dismissed || (!message && !error)) {
        return null;
    }

    const isError = Boolean(error);
    const text = error || message;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 sm:justify-end sm:pr-6">
            <div
                role="status"
                className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg ${
                    isError
                        ? 'border-rose-200 bg-rose-50 text-rose-800'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
            >
                <svg
                    className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? 'text-rose-500' : 'text-emerald-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isError ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01M5.062 20h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                </svg>
                <p className="flex-1 text-sm font-medium">{text}</p>
                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className={`rounded p-1 transition ${
                        isError ? 'text-rose-500 hover:bg-rose-100' : 'text-emerald-600 hover:bg-emerald-100'
                    }`}
                    aria-label="Dismiss notification"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
