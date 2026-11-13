import { cloneElement, isValidElement } from 'react';

export default function Field({ label, htmlFor, required = false, error, hint, children, className = '' }) {
    const messageId = htmlFor ? `${htmlFor}-message` : undefined;

    const control =
        isValidElement(children) && messageId
            ? cloneElement(children, {
                  'aria-invalid': error ? true : undefined,
                  'aria-describedby': error || hint ? messageId : undefined,
              })
            : children;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="ml-0.5 text-rose-500">*</span>}
                </label>
            )}
            {control}
            {hint && !error && (
                <p id={messageId} className="mt-1 text-xs text-slate-500">
                    {hint}
                </p>
            )}
            {error && (
                <p id={messageId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
                    {error}
                </p>
            )}
        </div>
    );
}
