import { useEffect, useMemo, useState, useRef } from "react";
import api from "../api/axios";
import { 
    Database as DatabaseIcon, 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    ChevronLeft, 
    ChevronRight,
    Settings2,
    RefreshCw,
    Info,
    Server,
    Cpu,
    Activity,
    AlertCircle,
    Check
} from "lucide-react";

// ========================================
// TYPES
// ========================================

interface SkemaData {
    id_skema: number;
    skema: string;
    id_ss: number | null;
    subsistem: string | null;
    aktif: number | null;
}

interface Subsistem {
    id_ss: number;
    subsistem: string;
}

interface DeviceProsis {
    no: number;
    gi: string | null;
    keterangan: string | null;
    merek: string | null;
    tipe: string | null;
    // other fields ignored
}

interface SkemaMT {
    no: number;
    id_skema: number;
    jenis: string | null;
}

interface SkemaRele {
    no: number;
    id_skema: number;
}

interface SkemaRTAC {
    Tag_Name: string | null;
    Gardu_Induk: string | null;
    Bay_Target: string | null;
    Skema: string | null;
    Tahap: string | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

type DetailTab = "info" | "mt" | "rele" | "rtac";

// ========================================
// UI COMPONENTS
// ========================================

const SearchableSelect = ({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    renderOption,
    displayValue
}: { 
    options: any[], 
    value: any, 
    onChange: (val: any) => void, 
    placeholder: string,
    renderOption: (opt: any) => React.ReactNode,
    displayValue: (val: any) => string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => 
        displayValue(opt).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <div 
                className="w-full flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "text-slate-900 font-medium" : "text-slate-400"}>
                    {value ? displayValue(options.find(o => o === value) || value) : placeholder}
                </span>
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                className="w-full rounded bg-white border border-slate-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {filteredOptions.length === 0 ? (
                            <li className="p-3 text-center text-xs text-slate-500">No results found</li>
                        ) : (
                            filteredOptions.map((opt, i) => (
                                <li 
                                    key={i}
                                    className="px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-sm flex items-center justify-between group transition-colors"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    {renderOption(opt)}
                                    {value === opt && <Check className="h-4 w-4 text-blue-600" />}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function Skema() {

    // ========================================
    // STATE: MAIN
    // ========================================
    const [data, setData] = useState<SkemaData[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ========================================
    // STATE: RELATIONAL DATA (Master lists)
    // ========================================
    const [subsistem, setSubsistem] = useState<Subsistem[]>([]);
    const [devices, setDevices] = useState<DeviceProsis[]>([]);

    // ========================================
    // STATE: DETAIL
    // ========================================
    const [selectedSkema, setSelectedSkema] = useState<SkemaData | null>(null);
    const [activeTab, setActiveTab] = useState<DetailTab>("info");
    const [detailLoading, setDetailLoading] = useState(false);
    const [skemaMT, setSkemaMT] = useState<SkemaMT[]>([]);
    const [skemaRele, setSkemaRele] = useState<SkemaRele[]>([]);
    const [skemaRTAC, setSkemaRTAC] = useState<SkemaRTAC[]>([]);

    // ========================================
    // STATE: MODALS
    // ========================================
    const [showSkemaForm, setShowSkemaForm] = useState(false);
    const [editingSkemaId, setEditingSkemaId] = useState<number | null>(null);
    const [formSkemaName, setFormSkemaName] = useState("");
    const [formSkemaSub, setFormSkemaSub] = useState<Subsistem | null>(null);
    const [formSkemaAktif, setFormSkemaAktif] = useState<number | "">("");

    const [showTabForm, setShowTabForm] = useState<"mt" | "rele" | "rtac" | null>(null);
    const [editingTabRow, setEditingTabRow] = useState<any | null>(null);
    const [formTabDevice, setFormTabDevice] = useState<DeviceProsis | null>(null);
    const [formTabJenis, setFormTabJenis] = useState("");
    const [formTabRtac, setFormTabRtac] = useState<any>({});
    
    const [saving, setSaving] = useState(false);

    // ========================================
    // USER
    // ========================================
    const user = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); } 
        catch { return null; }
    }, []);
    const isAdmin = user?.role === "admin";

    // ========================================
    // INITIAL LOAD
    // ========================================
    useEffect(() => {
        loadSkema();
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [subRes, devRes] = await Promise.all([
                api.get("/skema/subsistem"),
                api.get("/tables/DEVICE_PROSIS", { params: { limit: 10000 } })
            ]);
            setSubsistem(subRes.data || []);
            setDevices(devRes.data?.data || []);
        } catch (error) {
            console.error("Gagal memuat master data:", error);
        }
    };

    const loadSkema = async (page = 1, searchValue = search) => {
        try {
            setLoading(true);
            const response = await api.get("/skema", { params: { page, limit: 20, search: searchValue } });
            setData(response.data.data || []);
            setPagination(response.data.pagination || null);
        } catch (error) {
            console.error("Gagal mengambil data SKEMA:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSkema = (item: SkemaData) => {
        setSelectedSkema(item);
        setActiveTab("info");
        setSkemaMT([]);
        setSkemaRele([]);
        setSkemaRTAC([]);
    };

    const handleTabChange = async (tab: DetailTab) => {
        if (!selectedSkema) return;
        setActiveTab(tab);
        await reloadTab(tab, selectedSkema);
    };

    const reloadTab = async (tab: DetailTab, skema: SkemaData) => {
        setDetailLoading(true);
        try {
            if (tab === "mt") {
                const res = await api.get(`/skema/${skema.id_skema}/mt`);
                setSkemaMT(res.data || []);
            } else if (tab === "rele") {
                const res = await api.get(`/skema/${skema.id_skema}/rele`);
                setSkemaRele(res.data || []);
            } else if (tab === "rtac") {
                const res = await api.get(`/skema/rtac/${encodeURIComponent(skema.skema)}`);
                setSkemaRTAC(res.data || []);
            }
        } catch (error) {
            console.error(`Gagal memuat detail ${tab}:`, error);
        } finally {
            setDetailLoading(false);
        }
    };

    // ========================================
    // ENRICH DATA (Client-side JOINs)
    // ========================================
    const enrichedMT = useMemo(() => {
        return skemaMT.map(mt => {
            const device = devices.find(d => d.no === mt.no);
            return { ...mt, ...device, skemaName: selectedSkema?.skema, subsistemName: selectedSkema?.subsistem };
        });
    }, [skemaMT, devices, selectedSkema]);

    const enrichedRele = useMemo(() => {
        return skemaRele.map(rele => {
            const device = devices.find(d => d.no === rele.no);
            return { ...rele, ...device, skemaName: selectedSkema?.skema, subsistemName: selectedSkema?.subsistem };
        });
    }, [skemaRele, devices, selectedSkema]);


    // ========================================
    // CRUD: SKEMA
    // ========================================
    const openAddSkema = () => {
        if (!isAdmin) return alert("Anda tidak memiliki izin.");
        setEditingSkemaId(null);
        setFormSkemaName("");
        setFormSkemaSub(null);
        setFormSkemaAktif("");
        setShowSkemaForm(true);
    };

    const openEditSkema = (e: React.MouseEvent, item: SkemaData) => {
        e.stopPropagation();
        if (!isAdmin) return alert("Anda tidak memiliki izin.");
        setEditingSkemaId(item.id_skema);
        setFormSkemaName(item.skema);
        setFormSkemaSub(subsistem.find(s => s.id_ss === item.id_ss) || null);
        setFormSkemaAktif(item.aktif ?? "");
        setShowSkemaForm(true);
    };

    const handleSaveSkema = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formSkemaName.trim()) return alert("Nama skema wajib diisi.");
        try {
            setSaving(true);
            const payload = { 
                skema: formSkemaName.trim(), 
                id_ss: formSkemaSub ? formSkemaSub.id_ss : null, 
                aktif: formSkemaAktif === "" ? null : formSkemaAktif 
            };
            if (editingSkemaId) {
                await api.put(`/skema/${editingSkemaId}`, payload);
            } else {
                await api.post("/skema", payload);
            }
            setShowSkemaForm(false);
            if (selectedSkema && selectedSkema.id_skema === editingSkemaId) {
                setSelectedSkema(null); // Reset selection to force fresh view
            }
            await loadSkema(pagination?.page || 1, search);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Gagal menyimpan SKEMA.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkema = async (e: React.MouseEvent, item: SkemaData) => {
        e.stopPropagation();
        if (!isAdmin) return;
        // Replaced window.confirm with a simpler alert style approach, or a robust UI dialog.
        // For simplicity in rewriting, we keep a functional confirm but format it cleanly in code.
        if (!window.confirm(`Yakin ingin menghapus skema "${item.skema}"?\nTindakan ini tidak dapat dibatalkan.`)) return;
        
        try {
            await api.delete(`/skema/${item.id_skema}`);
            if (selectedSkema?.id_skema === item.id_skema) setSelectedSkema(null);
            await loadSkema(pagination?.page || 1, search);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Gagal menghapus SKEMA.");
        }
    };


    // ========================================
    // CRUD: TAB DATA (MT / RELE / RTAC)
    // ========================================
    const openAddTab = (type: "mt" | "rele" | "rtac") => {
        if (!isAdmin) return alert("Anda tidak memiliki izin.");
        setShowTabForm(type);
        setEditingTabRow(null);
        setFormTabDevice(null);
        setFormTabJenis("");
        setFormTabRtac({});
    };

    const handleSaveTab = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSkema || !showTabForm) return;

        try {
            setSaving(true);
            const tableMap = { mt: "SKEMA_MT", rele: "SKEMA_RELE", rtac: "Skema_RTAC" };
            const tableName = tableMap[showTabForm];
            let payload: any = {};

            if (showTabForm === "mt" || showTabForm === "rele") {
                if (!formTabDevice) return alert("Pilih peralatan terlebih dahulu.");
                payload = { no: formTabDevice.no, id_skema: selectedSkema.id_skema };
                if (showTabForm === "mt") payload.jenis = formTabJenis || null;
                
                // Generic POST to /tables
                await api.post(`/tables/${tableName}`, payload);
            } else if (showTabForm === "rtac") {
                payload = { ...formTabRtac, Skema: selectedSkema.skema };
                await api.post(`/tables/${tableName}`, payload);
            }

            setShowTabForm(null);
            await reloadTab(showTabForm, selectedSkema);
        } catch (error: any) {
            alert(error?.response?.data?.error || error?.response?.data?.message || `Gagal menyimpan data ${showTabForm.toUpperCase()}.`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTab = async (type: "mt" | "rele" | "rtac", row: any) => {
        if (!isAdmin || !selectedSkema) return;
        
        const tableMap = { mt: "SKEMA_MT", rele: "SKEMA_RELE", rtac: "Skema_RTAC" };
        const tableName = tableMap[type];

        // Determing primary key value for generic deletion
        let pkValue = null;
        if (type === "mt" || type === "rele") pkValue = row.no; // Assuming 'no' is PK in these join tables
        if (type === "rtac") pkValue = row.Tag_Name; // Assuming Tag_Name is PK

        if (!pkValue) return alert("Gagal menghapus: Primary key tidak ditemukan.");
        if (!window.confirm(`Yakin ingin menghapus record ini dari ${type.toUpperCase()}?`)) return;

        try {
            await api.delete(`/tables/${tableName}/${encodeURIComponent(pkValue)}`);
            await reloadTab(type, selectedSkema);
        } catch (error: any) {
            alert(error?.response?.data?.error || error?.response?.data?.message || "Gagal menghapus data.");
        }
    };


    // ========================================
    // HELPERS
    // ========================================
    const getStatusStyle = (value: number | null) => {
        if (value === 1) return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (value === 0) return "bg-slate-100 text-slate-600 border-slate-200";
        return "bg-amber-50 text-amber-700 border-amber-200";
    };
    const getStatusLabel = (value: number | null) => {
        if (value === 1) return "Aktif";
        if (value === 0) return "Tidak Aktif";
        return "Unknown";
    };

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
                LEFT: LIST SKEMA
            ================================= */}
            <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:w-96 md:border-b-0 md:border-r shrink-0">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                <Server className="h-4 w-4" />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-slate-900">Skema Module</h1>
                                <p className="text-xs font-medium text-slate-500">Business Control System</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={openAddSkema} className="rounded-md bg-blue-600 p-1.5 text-white hover:bg-blue-700 transition-colors" title="New Skema">
                                <Plus className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari ID, Skema, Subsistem..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && loadSkema(1, search)}
                            className="w-full rounded-md border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                        />
                        {search && (
                            <button onClick={() => { setSearch(""); loadSkema(1, ""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
                            <span className="text-xs font-medium">Tidak ada skema ditemukan.</span>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {data.map((item) => {
                                const isActive = selectedSkema?.id_skema === item.id_skema;
                                return (
                                    <li 
                                        key={item.id_skema}
                                        onClick={() => handleSelectSkema(item)}
                                        className={`group relative rounded-lg p-3 text-left transition-all duration-200 cursor-pointer border ${
                                            isActive
                                                ? "border-blue-200 bg-blue-50 shadow-sm"
                                                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0 pr-8">
                                                <h3 className={`truncate font-semibold text-sm ${isActive ? "text-blue-900" : "text-slate-800"}`}>
                                                    {item.skema}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                    <span className="font-mono text-slate-400">ID:{item.id_skema}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{item.subsistem || "No Subsistem"}</span>
                                                </div>
                                            </div>
                                            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(item.aktif)}`}>
                                                {getStatusLabel(item.aktif)}
                                            </span>
                                        </div>
                                        
                                        {/* Row Actions overlay */}
                                        {isAdmin && (
                                            <div className={`absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity ${isActive ? "opacity-100" : "group-hover:opacity-100"}`}>
                                                <button onClick={(e) => openEditSkema(e, item)} className="rounded p-1 text-slate-400 hover:bg-blue-100 hover:text-blue-700 bg-white shadow-sm border border-slate-200">
                                                    <Edit2 className="h-3 w-3" />
                                                </button>
                                                <button onClick={(e) => handleDeleteSkema(e, item)} className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-700 bg-white shadow-sm border border-slate-200">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* List Pagination */}
                {pagination && data.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-500 uppercase">
                            {pagination.total} Skema
                        </span>
                        <div className="flex gap-1">
                            <button disabled={pagination.page <= 1} onClick={() => loadSkema(pagination.page - 1)} className="rounded border border-slate-200 bg-white p-1 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronLeft className="h-3 w-3"/></button>
                            {pageNumbers.map(num => (
                                <button key={num} onClick={() => loadSkema(num)} className={`min-w-[20px] rounded border text-[10px] font-semibold transition-colors ${pagination.page === num ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                                    {num}
                                </button>
                            ))}
                            <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadSkema(pagination.page + 1)} className="rounded border border-slate-200 bg-white p-1 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronRight className="h-3 w-3"/></button>
                        </div>
                    </div>
                )}
            </aside>

            {/* =================================
                RIGHT: DETAIL PANEL
            ================================= */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white relative">
                {!selectedSkema ? (
                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 shadow-inner">
                            <Server className="h-8 w-8 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Tidak Ada Skema Terpilih</h2>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">Pilih skema dari daftar di panel navigasi untuk melihat detail informasi, MT, RELE, dan RTAC.</p>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden h-full">
                        
                        {/* Detail Header */}
                        <div className="border-b border-slate-200 bg-slate-50/50 px-8 py-6 shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
                                    ID: {selectedSkema.id_skema}
                                </span>
                                <span className={`border px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${getStatusStyle(selectedSkema.aktif)}`}>
                                    {getStatusLabel(selectedSkema.aktif)}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedSkema.skema}</h2>
                            <div className="mt-2 flex items-center gap-4 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><Activity className="h-4 w-4" /> {selectedSkema.subsistem || "Tanpa Subsistem"}</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-6 border-b border-slate-200 px-8 shrink-0 bg-white pt-2">
                            {[
                                { id: "info", label: "Informasi", icon: Info },
                                { id: "mt", label: "MT (Metering)", icon: Settings2 },
                                { id: "rele", label: "RELE", icon: Cpu },
                                { id: "rtac", label: "RTAC", icon: Server },
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
                                <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Properties</h3>
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Nama Skema</dt>
                                                <dd className="mt-1 text-sm font-semibold text-slate-900">{selectedSkema.skema}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Subsistem</dt>
                                                <dd className="mt-1 text-sm font-semibold text-slate-900">{selectedSkema.subsistem || "-"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">ID Internal</dt>
                                                <dd className="mt-1 text-sm font-mono text-slate-600">{selectedSkema.id_skema}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium text-slate-500">Status Aktif</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusStyle(selectedSkema.aktif)}`}>
                                                        {getStatusLabel(selectedSkema.aktif)}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            )}

                            {/* MT TAB */}
                            {activeTab === "mt" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-900">Perangkat MT (Metering)</h3>
                                        {isAdmin && (
                                            <button onClick={() => openAddTab("mt")} className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200">
                                                <Plus className="h-4 w-4" /> Tambah MT
                                            </button>
                                        )}
                                    </div>
                                    
                                    {detailLoading ? (
                                        <div className="py-12 flex justify-center"><RefreshCw className="h-6 w-6 text-slate-300 animate-spin" /></div>
                                    ) : enrichedMT.length === 0 ? (
                                        <div className="rounded-xl border border-slate-200 border-dashed py-12 text-center text-slate-500">Tidak ada perangkat MT untuk skema ini.</div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3">No</th>
                                                        <th className="px-4 py-3">Gardu Induk (GI)</th>
                                                        <th className="px-4 py-3">Merek / Tipe</th>
                                                        <th className="px-4 py-3">Jenis</th>
                                                        <th className="px-4 py-3">Keterangan</th>
                                                        {isAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                    {enrichedMT.map((row) => (
                                                        <tr key={row.no} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-4 py-3 font-mono text-xs">{row.no}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">{row.gi || "-"}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-slate-800">{row.merek || "-"}</span>
                                                                    <span className="text-xs text-slate-500">{row.tipe || "-"}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">{row.jenis || "-"}</span></td>
                                                            <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={row.keterangan || ""}>{row.keterangan || "-"}</td>
                                                            {isAdmin && (
                                                                <td className="px-4 py-3 text-right">
                                                                    <button onClick={() => handleDeleteTab("mt", row)} className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RELE TAB */}
                            {activeTab === "rele" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-900">Perangkat RELE</h3>
                                        {isAdmin && (
                                            <button onClick={() => openAddTab("rele")} className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200">
                                                <Plus className="h-4 w-4" /> Tambah RELE
                                            </button>
                                        )}
                                    </div>
                                    
                                    {detailLoading ? (
                                        <div className="py-12 flex justify-center"><RefreshCw className="h-6 w-6 text-slate-300 animate-spin" /></div>
                                    ) : enrichedRele.length === 0 ? (
                                        <div className="rounded-xl border border-slate-200 border-dashed py-12 text-center text-slate-500">Tidak ada perangkat RELE untuk skema ini.</div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3">No</th>
                                                        <th className="px-4 py-3">Gardu Induk (GI)</th>
                                                        <th className="px-4 py-3">Merek / Tipe</th>
                                                        <th className="px-4 py-3">Keterangan</th>
                                                        {isAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                    {enrichedRele.map((row) => (
                                                        <tr key={row.no} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-4 py-3 font-mono text-xs">{row.no}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">{row.gi || "-"}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-slate-800">{row.merek || "-"}</span>
                                                                    <span className="text-xs text-slate-500">{row.tipe || "-"}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={row.keterangan || ""}>{row.keterangan || "-"}</td>
                                                            {isAdmin && (
                                                                <td className="px-4 py-3 text-right">
                                                                    <button onClick={() => handleDeleteTab("rele", row)} className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RTAC TAB */}
                            {activeTab === "rtac" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-slate-900">Data RTAC</h3>
                                        {isAdmin && (
                                            <button onClick={() => openAddTab("rtac")} className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200">
                                                <Plus className="h-4 w-4" /> Tambah RTAC
                                            </button>
                                        )}
                                    </div>
                                    
                                    {detailLoading ? (
                                        <div className="py-12 flex justify-center"><RefreshCw className="h-6 w-6 text-slate-300 animate-spin" /></div>
                                    ) : skemaRTAC.length === 0 ? (
                                        <div className="rounded-xl border border-slate-200 border-dashed py-12 text-center text-slate-500">Tidak ada data RTAC untuk skema ini.</div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3">Tag Name</th>
                                                        <th className="px-4 py-3">Gardu Induk</th>
                                                        <th className="px-4 py-3">Bay Target</th>
                                                        <th className="px-4 py-3">Tahap</th>
                                                        {isAdmin && <th className="px-4 py-3 text-right">Aksi</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                                                    {skemaRTAC.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-4 py-3 font-mono font-medium text-blue-700">{row.Tag_Name || "-"}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">{row.Gardu_Induk || "-"}</td>
                                                            <td className="px-4 py-3 text-slate-600">{row.Bay_Target || "-"}</td>
                                                            <td className="px-4 py-3"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">{row.Tahap || "-"}</span></td>
                                                            {isAdmin && (
                                                                <td className="px-4 py-3 text-right">
                                                                    <button onClick={() => handleDeleteTab("rtac", row)} className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </main>

            {/* =================================
                MODALS
            ================================= */}
            
            {/* Modal: Skema (Add/Edit) */}
            {showSkemaForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSkemaForm(false)} />
                    <div className="relative w-full max-w-lg transform overflow-visible rounded-xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 rounded-t-xl">
                            <h3 className="text-lg font-bold text-slate-900">{editingSkemaId ? "Edit Skema" : "Tambah Skema Baru"}</h3>
                            <button type="button" onClick={() => setShowSkemaForm(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSaveSkema} className="px-6 py-5 space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama Skema <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formSkemaName}
                                    onChange={(e) => setFormSkemaName(e.target.value)}
                                    placeholder="Contoh: OLS SUTT WONOSARI"
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Subsistem</label>
                                <SearchableSelect
                                    options={subsistem}
                                    value={formSkemaSub}
                                    onChange={setFormSkemaSub}
                                    placeholder="Pilih Subsistem..."
                                    displayValue={(s) => s.subsistem}
                                    renderOption={(s) => <span className="font-medium">{s.subsistem} <span className="text-xs text-slate-400 font-mono ml-2">ID:{s.id_ss}</span></span>}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Status Aktif</label>
                                <select
                                    value={formSkemaAktif}
                                    onChange={(e) => setFormSkemaAktif(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">Belum Ditentukan</option>
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowSkemaForm(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 transition-colors">
                                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                                    {saving ? "Menyimpan..." : "Simpan Skema"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Tab Data (MT/RELE/RTAC) Add */}
            {showTabForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTabForm(null)} />
                    <div className="relative w-full max-w-lg transform overflow-visible rounded-xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 rounded-t-xl">
                            <h3 className="text-lg font-bold text-slate-900">Tambah {showTabForm.toUpperCase()}</h3>
                            <button type="button" onClick={() => setShowTabForm(null)} className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSaveTab} className="px-6 py-5 space-y-5">
                            
                            <div className="rounded bg-blue-50 border border-blue-100 p-3 mb-2 flex items-center gap-3">
                                <Info className="h-5 w-5 text-blue-600" />
                                <div className="text-sm">
                                    <span className="font-semibold text-blue-900">Skema: </span>
                                    <span className="text-blue-800">{selectedSkema?.skema}</span>
                                </div>
                            </div>

                            {(showTabForm === "mt" || showTabForm === "rele") && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Peralatan (Device) <span className="text-red-500">*</span></label>
                                        <SearchableSelect
                                            options={devices}
                                            value={formTabDevice}
                                            onChange={setFormTabDevice}
                                            placeholder="Cari dan pilih peralatan..."
                                            displayValue={(d) => `${d.gi || 'Tanpa GI'} - ${d.merek || 'Tanpa Merek'} (${d.tipe || 'No Tipe'})`}
                                            renderOption={(d) => (
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-slate-800">{d.gi || 'Unknown GI'}</span>
                                                    <span className="text-xs text-slate-500">{d.merek} {d.tipe} <span className="font-mono ml-2 border px-1 rounded">No:{d.no}</span></span>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    {showTabForm === "mt" && (
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Jenis</label>
                                            <input
                                                type="text"
                                                value={formTabJenis}
                                                onChange={(e) => setFormTabJenis(e.target.value)}
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {showTabForm === "rtac" && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tag Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formTabRtac.Tag_Name || ""}
                                            onChange={(e) => setFormTabRtac({...formTabRtac, Tag_Name: e.target.value})}
                                            required
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Gardu Induk</label>
                                            <input
                                                type="text"
                                                value={formTabRtac.Gardu_Induk || ""}
                                                onChange={(e) => setFormTabRtac({...formTabRtac, Gardu_Induk: e.target.value})}
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Bay Target</label>
                                            <input
                                                type="text"
                                                value={formTabRtac.Bay_Target || ""}
                                                onChange={(e) => setFormTabRtac({...formTabRtac, Bay_Target: e.target.value})}
                                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tahap</label>
                                        <input
                                            type="text"
                                            value={formTabRtac.Tahap || ""}
                                            onChange={(e) => setFormTabRtac({...formTabRtac, Tahap: e.target.value})}
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowTabForm(null)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Batal</button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 transition-colors">
                                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                                    {saving ? "Menyimpan..." : "Simpan Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}