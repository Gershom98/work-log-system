import { useI18n } from '@/i18n';
import { useEffect, useRef } from 'react';

const tones = {
    danger: {
        icon: 'bg-rose-100 text-rose-600',
        button: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    },
    primary: {
        icon: 'bg-indigo-100 text-indigo-600',
        button: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    },
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    tone = 'danger',
    processing = false,
    onConfirm,
    onClose,
}) {
    const cancelRef = useRef(null);
    const { t } = useI18n();
    const previouslyFocusedRef = useRef(null);
    const processingRef = useRef(processing);
    processingRef.current = processing;

    useEffect(() => {
        if (!open) {
            return;
        }

        previouslyFocusedRef.current = document.activeElement;
        cancelRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !processingRef.current) {
                onClose();
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);

            const previous = previouslyFocusedRef.current;
            if (previous instanceof HTMLElement && document.contains(previous)) {
                previous.focus();
            }
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const styles = tones[tone] ?? tones.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={processing ? undefined : onClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby={description ? 'confirm-dialog-description' : undefined}
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2.5 ${styles.icon}`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <h3 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">
                            {title}
                        </h3>
                        {description && (
                            <p id="confirm-dialog-description" className="mt-1 text-sm text-slate-600">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                        {t(cancelLabel)}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
                    >
                        {processing && (
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {t(confirmLabel)}
                    </button>
                </div>
            </div>
        </div>
    );
}
