export default function Field({ label, htmlFor, required = false, error, hint, children, className = '' }) {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="ml-0.5 text-rose-500">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
        </div>
    );
}
