export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center space-x-2 ${props.className || ''}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-sm">
                WL
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
                Work<span className="text-indigo-600">Log</span>
            </span>
        </div>
    );
}