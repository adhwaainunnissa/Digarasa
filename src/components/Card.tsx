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
        <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">

            <div
                className={`mb-4 h-3 w-3 rounded-full ${color}`}
            />

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {value}
            </h2>

        </div>
    );
}