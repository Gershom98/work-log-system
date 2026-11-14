import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            prefetch
            aria-current={active ? 'page' : undefined}
            className={
                'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition duration-200 ease-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
                (active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900') +
                className
            }
        >
            {children}
        </Link>
    );
}
