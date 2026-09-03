interface InputProps {
  label: string;
  type?: string;
  placeholder: string;
}

export default function Input({
  label,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}