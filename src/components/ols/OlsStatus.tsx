import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface OlsStatusRow {
    id_sw: number;
    skema: string;
    gi: string;
    target: string;
    tahap: string;
    tag_name: string;
    value: string | null;
    quality: string | null;
    time: string | null;
    device_name: string | null;
}

export default function OlsStatus({ data }: { data: OlsStatusRow[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                <Activity className="h-8 w-8 text-slate-300 mb-3" />
                <span className="text-sm font-medium">Tidak ada data status OLS.</span>
            </div>
        );
    }

    const getStatusBadge = (value: string | null) => {
        if (!value) return <span className="text-slate-400 italic text-xs">Unknown</span>;
        
        // Asumsi value "1" atau "ON" atau semacamnya, sesuaikan dengan data riil
        const isAlert = value.toLowerCase() === "trip" || value === "1" || value.toLowerCase() === "on";
        
        if (isAlert) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                    <AlertTriangle className="h-3 w-3" /> Aktif
                </span>
            );
        }
        
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Normal
            </span>
        );
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                    <tr>
                        <th className="px-6 py-4">ID / Skema</th>
                        <th className="px-6 py-4">GI / Target</th>
                        <th className="px-6 py-4">Tahap</th>
                        <th className="px-6 py-4">Tag Name</th>
                        <th className="px-6 py-4">Device</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4">Update Terakhir</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">{row.skema}</span>
                                    <span className="text-xs text-slate-500 font-mono">ID: {row.id_sw}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-800">{row.gi || "-"}</span>
                                    <span className="text-xs text-slate-500">{row.target || "-"}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                                    {row.tahap || "-"}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-600">
                                {row.tag_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                                {row.device_name || "-"}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {getStatusBadge(row.value)}
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                                {row.time ? new Date(row.time).toLocaleString('id-ID') : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
