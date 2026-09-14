import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw, X, AlertCircle } from "lucide-react";
import api from "../../api/axios";

interface HistoryRow {
    tag_name: string;
    value: string;
    quality: string;
    time: string;
    device_name: string;
}

export default function OlsHistory() {
    const [data, setData] = useState<HistoryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // For debounced/submitted search
    
    useEffect(() => {
        loadHistory();
    }, [page, searchQuery]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const res = await api.get("/ols/history", {
                params: {
                    page,
                    limit: 100,
                    search: searchQuery
                }
            });
            setData(res.data.data || []);
            setTotalPages(res.data.pagination?.totalPages || 1);
            setTotalItems(res.data.pagination?.total || 0);
        } catch (error) {
            console.error("Gagal memuat riwayat OLS:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearchQuery(search);
    };
    
    const handleClearSearch = () => {
        setSearch("");
        setSearchQuery("");
        setPage(1);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 shrink-0">
                <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari Tag Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    {search && (
                        <button type="button" onClick={handleClearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                    {loading ? (
                        <span className="flex items-center gap-2 text-blue-600">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Memuat...
                        </span>
                    ) : (
                        <span>Total: {totalItems.toLocaleString("id-ID")} records</span>
                    )}
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                {data.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
                        <AlertCircle className="h-8 w-8 text-slate-300 mb-3" />
                        <span className="text-sm font-medium">Tidak ada riwayat ditemukan.</span>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                            <tr>
                                <th className="px-6 py-4">Waktu (Time)</th>
                                <th className="px-6 py-4">Tag Name</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Quality</th>
                                <th className="px-6 py-4">Device Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                                        {row.time ? new Date(row.time).toLocaleString('id-ID') : "-"}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs text-blue-600 font-medium">
                                        {row.tag_name || "-"}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs font-semibold text-slate-800 bg-slate-50/50">
                                        {row.value || "-"}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold border ${
                                            row.quality?.toLowerCase() === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {row.quality || "-"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-700">
                                        {row.device_name || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between shrink-0">
                <span className="text-xs font-medium text-slate-500">
                    Menampilkan halaman {page} dari {totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={page <= 1 || loading} 
                        onClick={() => setPage(p => p - 1)} 
                        className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4"/> Prev
                    </button>
                    <button 
                        disabled={page >= totalPages || loading} 
                        onClick={() => setPage(p => p + 1)} 
                        className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                    >
                        Next <ChevronRight className="h-4 w-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
}
