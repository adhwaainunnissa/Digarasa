import { Settings } from "lucide-react";

interface OlsConfigRow {
    id_sw: number;
    skema: string;
    gi: string;
    target: string;
    tahap: string;
    tag_name: string;
}

export default function OlsConfig({ data }: { data: OlsConfigRow[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                <Settings className="h-8 w-8 text-slate-300 mb-3" />
                <span className="text-sm font-medium">Tidak ada data konfigurasi OLS.</span>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Skema</th>
                        <th className="px-6 py-4">Gardu Induk (GI)</th>
                        <th className="px-6 py-4">Target</th>
                        <th className="px-6 py-4">Tahap</th>
                        <th className="px-6 py-4">Datapoint (Tag Name)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                {row.id_sw}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                                {row.skema}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-800">
                                {row.gi || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                                {row.target || "-"}
                            </td>
                            <td className="px-6 py-4">
                                <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                                    {row.tahap || "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50/30">
                                {row.tag_name || "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
