import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { 
    Search, 
    X, 
    ChevronLeft, 
    ChevronRight,
    RefreshCw,
    AlertCircle,
    Server,
    Cpu,
    Info,
    Activity,
} from "lucide-react";

// ========================================
// TYPES
// ========================================

interface DeviceProsis {
    no: number;
    tag_name: string | null;
    gi: string | null;
    jenis: string | null;
    keterangan: string | null;
    merek: string | null;
    tipe: string | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

type DetailTab = "info" | "usage";

// ========================================
// UI COMPONENT
// ========================================

export default function Device() {
    // ========================================
    // STATE: MAIN
    // ========================================
    const [data, setData] = useState<DeviceProsis[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ========================================
    // STATE: DETAIL
    // ========================================
    const [selectedDevice, setSelectedDevice] = useState<DeviceProsis | null>(null);
    const [activeTab, setActiveTab] = useState<DetailTab>("info");
    const [detailLoading, setDetailLoading] = useState(false);
    
    // Usage in Skema (Digunakan Dalam)
    const [usageMT, setUsageMT] = useState<any[]>([]);
    const [usageRele, setUsageRele] = useState<any[]>([]);

    // ========================================
    // INITIAL LOAD
    // ========================================
    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async (page = 1, searchValue = search) => {
        try {
            setLoading(true);
            const response = await api.get("/device", { 
                params: { page, limit: 20, search: searchValue } 
            });
            setData(response.data.data || []);
            setPagination(response.data.pagination || null);
        } catch (error) {
            console.error("Gagal mengambil data DEVICE_PROSIS:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDevice = (item: DeviceProsis) => {
        setSelectedDevice(item);
        setActiveTab("info");
        setUsageMT([]);
        setUsageRele([]);
    };

    const handleTabChange = async (tab: DetailTab) => {
        if (!selectedDevice) return;
        setActiveTab(tab);
        if (tab === "usage") {
            await loadUsage(selectedDevice);
        }
    };

    const loadUsage = async (device: DeviceProsis) => {
    setDetailLoading(true);

    try {
        const response = await api.get(
            `/devices/${device.no}/usage`
        );

        setUsageMT(
            response.data?.mt || []
        );

        setUsageRele(
            response.data?.rele || []
        );

    } catch (error) {
        console.error(
            "Gagal memuat detail usage:",
            error
        );

        setUsageMT([]);
        setUsageRele([]);

    } finally {
        setDetailLoading(false);
    }
};

    // ========================================
    // HELPERS
    // ========================================
    const pageNumbers = useMemo(() => {
        if (!pagination) return [];
        let { totalPages, page } = pagination;
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, page + 2);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [pagination]);


    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 md:flex-row overflow-hidden">
            
            {/* =================================
                LEFT: LIST DEVICE
            ================================= */}
            <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:w-96 md:border-b-0 md:border-r shrink-0">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                <Cpu className="h-4 w-4" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-900">Device Module</h1>
                                <p className="text-xs font-medium text-slate-500">Peralatan Prosis</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari No, Tag Name, GI, Jenis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && loadDevices(1, search)}
                            className="w-full rounded-md border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        />
                        {search && (
                            <button onClick={() => { setSearch(""); loadDevices(1, ""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            <span className="text-xs font-medium">Memuat data...</span>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                            <AlertCircle className="h-6 w-6 text-slate-300" />
                            <span className="text-xs font-medium">Tidak ada device ditemukan.</span>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {data.map((item) => {
                                const isActive = selectedDevice?.no === item.no;
                                return (
                                    <li 
                                        key={item.no}
                                        onClick={() => handleSelectDevice(item)}
                                        className={`group relative rounded-lg p-3 text-left transition-all duration-200 cursor-pointer border ${
                                            isActive
                                                ? "border-emerald-200 bg-emerald-50 shadow-sm"
                                                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h3 className={`truncate font-semibold text-sm ${isActive ? "text-emerald-900" : "text-slate-800"}`}>
                                                    {item.gi || "Unknown GI"}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                    <span className="font-mono text-slate-400">#{item.no}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{item.jenis || "No Jenis"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* List Pagination */}
                {pagination && data.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50 p-3 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-medium text-slate-500 uppercase">
                            {pagination.total} Devices
                        </span>
                        <div className="flex gap-1">
                            <button disabled={pagination.page <= 1} onClick={() => loadDevices(pagination.page - 1)} className="rounded border border-slate-200 bg-white p-1 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronLeft className="h-3 w-3"/></button>
                            {pageNumbers.map(num => (
                                <button key={num} onClick={() => loadDevices(num)} className={`min-w-[20px] rounded border text-[10px] font-semibold transition-colors ${pagination.page === num ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                                    {num}
                                </button>
                            ))}
                            <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadDevices(pagination.page + 1)} className="rounded border border-slate-200 bg-white p-1 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronRight className="h-3 w-3"/></button>
                        </div>
                    </div>
                )}
            </aside>

            {/* =================================
                RIGHT: DETAIL PANEL
            ================================= */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white relative">
                {!selectedDevice ? (
                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 shadow-inner">
                            <Cpu className="h-8 w-8 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Tidak Ada Device Terpilih</h2>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">Pilih peralatan (device) dari daftar di panel navigasi untuk melihat detail informasi dan pemakaian dalam skema.</p>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden h-full">
                        
                        {/* Detail Header */}
                        <div className="border-b border-slate-200 bg-slate-50/50 px-8 py-6 shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5">
                                    No: {selectedDevice.no}
                                </span>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 border border-slate-200">
                                    {selectedDevice.jenis || "UNKNOWN JENIS"}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedDevice.gi || "-"}</h2>
                            <div className="mt-2 flex items-center gap-4 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5 font-mono"><Activity className="h-4 w-4" /> {selectedDevice.tag_name || "Tanpa Tag Name"}</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-6 border-b border-slate-200 px-8 shrink-0 bg-white pt-2">
                            {[
                                { id: "info", label: "Informasi", icon: Info },
                                { id: "usage", label: "Digunakan Dalam", icon: Server },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as DetailTab)}
                                    className={`flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-700"
                                            : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                    }`}
                                >
                                    <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : ""}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200 bg-white">
                            
                            {/* INFO TAB */}
                            {activeTab === "info" && (
                                <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Detail Perangkat</h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">No (ID)</dt>
                                                <dd className="mt-1 text-sm font-mono text-slate-900">{selectedDevice.no}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Tag Name</dt>
                                                <dd className="mt-1 text-sm font-mono font-medium text-slate-900">{selectedDevice.tag_name || "-"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Gardu Induk (GI)</dt>
                                                <dd className="mt-1 text-sm font-semibold text-slate-900">{selectedDevice.gi || "-"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Jenis</dt>
                                                <dd className="mt-1">
                                                    <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 border border-slate-200">
                                                        {selectedDevice.jenis || "-"}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Merek</dt>
                                                <dd className="mt-1 text-sm font-semibold text-slate-900">{selectedDevice.merek || "-"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Tipe</dt>
                                                <dd className="mt-1 text-sm font-semibold text-slate-900">{selectedDevice.tipe || "-"}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-xs font-medium text-slate-500">Keterangan</dt>
                                                <dd className="mt-1 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedDevice.keterangan || "Tidak ada keterangan."}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {/* USAGE TAB */}
                            {activeTab === "usage" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-900">Digunakan Dalam Skema</h3>
                                    </div>
                                    
                                    {detailLoading ? (
                                        <div className="py-12 flex justify-center"><RefreshCw className="h-6 w-6 text-slate-300 animate-spin" /></div>
                                    ) : (usageMT.length === 0 && usageRele.length === 0) ? (
                                        <div className="rounded-xl border border-slate-200 border-dashed py-12 px-4 flex flex-col items-center text-center text-slate-500 bg-slate-50/50">
                                            <Server className="h-8 w-8 text-slate-300 mb-3" />
                                            <p className="font-medium text-slate-900 text-sm">Belum Ada Data Penggunaan</p>
                                            <p className="text-xs max-w-sm mt-1">
                                                Saat ini tidak ada informasi atau API yang menghubungkan perangkat ini dengan tabel SKEMA_MT atau SKEMA_RELE.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {usageMT.length > 0 && (
                                                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                                        <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                            <tr>
                                                                <th className="px-4 py-3">Nama Skema</th>
                                                                <th className="px-4 py-3">Subsistem</th>
                                                                <th className="px-4 py-3">Peran</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                            {usageMT.map((row, index) => (
                                                                <tr key={`mt-${index}`} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-3 font-semibold text-slate-900">{row.skema_name || "-"}</td>
                                                                    <td className="px-4 py-3">{row.subsistem || "-"}</td>
                                                                    <td className="px-4 py-3"><span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-xs font-semibold">MT</span></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {usageRele.length > 0 && (
                                                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                                        <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                            <tr>
                                                                <th className="px-4 py-3">Nama Skema</th>
                                                                <th className="px-4 py-3">Subsistem</th>
                                                                <th className="px-4 py-3">Peran</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                            {usageRele.map((row, index) => (
                                                                <tr key={`rele-${index}`} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-3 font-semibold text-slate-900">{row.skema_name || "-"}</td>
                                                                    <td className="px-4 py-3">{row.subsistem || "-"}</td>
                                                                    <td className="px-4 py-3"><span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-semibold">RELE</span></td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
