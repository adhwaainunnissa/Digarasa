interface CardProps {
  title: string;
  value: string;
  color: string;
}

export default function Card({
  title,
  value,
  color,
}: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className={`w-12 h-12 rounded-full ${color} mb-4`} />

      <h3 className="text-gray-500">
        {title}
      </h3>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}