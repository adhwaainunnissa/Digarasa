interface CardProps {
    title: string;
    value: string | number;
    color: string;
}

export default function Card({
    title,
    value,
    color,
}: CardProps) {

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {title}
                </p>
                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
            </div>

            <div className="mt-4 flex items-baseline gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    {value}
                </h2>
            </div>
        </div>
    );
}