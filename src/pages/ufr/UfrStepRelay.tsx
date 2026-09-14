import { useEffect, useState } from "react";
import { Activity, RefreshCw, Search, ShieldAlert } from "lucide-react";
import { getUfrStepRelay } from "../../services/api/ufrService";
import type { UfrStepData, PaginationMeta } from "../../services/api/ufrService";

export default function UfrStepRelay() {
    const [step, setStep] = useState<number>(1);
    const [data, setData] = useState<UfrStepData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0,
    });

    const steps = [1, 4, 5, 6, 7];

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadData(1);
        }, 500);
        return () => clearTimeout(debounce);
    }, [search, step]);

    const loadData = async (pageToLoad: number = pagination.page) => {
        setLoading(true);
        try {
            const result = await getUfrStepRelay(step, pageToLoad, pagination.limit, search);
            setData(result.data);
            setPagination(result.pagination);
        } catch (error) {
            console.error("Gagal memuat data UFR Step Relay:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm border border-red-100">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">UFR Step Relay</h1>
                            <p className="mt-1 text-sm font-medium text-slate-500">Under Frequency Relay - Monitoring Tahapan (Read Only)</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => loadData(pagination.page)}
                        className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col mx-auto w-full max-w-7xl p-8">
                
                {/* Controls */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        {steps.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStep(s)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    step === s
                                        ? "bg-red-50 text-red-700 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                Step {s}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-72">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 shadow-sm"
                            placeholder="Cari Tag, GI, atau Target..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                    <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                <tr>
                                    <th className="px-6 py-4">Tag Name</th>
                                    <th className="px-6 py-4">Gardu Induk (GI)</th>
                                    <th className="px-6 py-4">Target / TRF</th>
                                    <th className="px-6 py-4">Value</th>
                                    <th className="px-6 py-4">Quality</th>
                                    <th className="px-6 py-4">Waktu</th>
                                    {step === 1 && (
                                        <>
                                            <th className="px-6 py-4">Value CB</th>
                                            <th className="px-6 py-4">Time CB</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <RefreshCw className="h-6 w-6 animate-spin text-red-500 mb-2" />
                                                <span className="font-medium">Memuat data UFR Step {step}...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Activity className="h-8 w-8 text-slate-300 mb-3" />
                                                <span className="text-sm font-medium">Tidak ada data ditemukan untuk Step {step}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50/30">
                                                {row.tag_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {row.gi_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                {row.target || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono">{row.value ?? "-"}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                                                    String(row.quality) === "1" || String(row.quality).toLowerCase() === "good" 
                                                    ? "bg-green-50 text-green-700 border-green-200" 
                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}>
                                                    {row.quality ?? "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {row.time ? new Date(row.time).toLocaleString('id-ID') : "-"}
                                            </td>
                                            {step === 1 && (
                                                <>
                                                    <td className="px-6 py-4 font-mono">{row.value_cb ?? "-"}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                                        {row.time_cb ? new Date(row.time_cb).toLocaleString('id-ID') : "-"}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between shrink-0">
                        <div className="text-sm text-slate-500">
                            Menampilkan <span className="font-medium text-slate-900">{data.length}</span> dari <span className="font-medium text-slate-900">{pagination.total}</span> data
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadData(pagination.page - 1)}
                                disabled={pagination.page <= 1 || loading}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            <div className="px-3 py-1.5 text-sm font-medium text-slate-700">
                                Halaman {pagination.page} dari {pagination.totalPages || 1}
                            </div>
                            <button
                                onClick={() => loadData(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages || loading}
                                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
