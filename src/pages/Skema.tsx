<<<<<<< HEAD
import { useEffect, useMemo, useState, useRef } from "react";
import api from "../api/axios";
import { 
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
=======
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
>>>>>>> a0daa5f9b7c9d998dd689d11f873c346ef440b5e

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
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
}

<<<<<<< HEAD
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
=======
interface SkemaMT {
  no: number;
  id_skema: number;
  skema: string | null;
  id_ss: number | null;
  subsistem: string | null;
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
>>>>>>> a0daa5f9b7c9d998dd689d11f873c346ef440b5e
}

interface SkemaRele {
  no: number;
  id_skema: number;
  skema: string | null;
  id_ss: number | null;
  subsistem: string | null;
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
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
<<<<<<< HEAD

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
=======
type DetailMode = "add" | "edit" | null;
type DeviceMode = "mt" | "rele";

function Skema() {
  const [data, setData] = useState<SkemaData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [subsistem, setSubsistem] = useState<Subsistem[]>([]);
  const [subsistemLoading, setSubsistemLoading] = useState(false);
  const [subsistemSearch, setSubsistemSearch] = useState("");
  const [showSubsistemDropdown, setShowSubsistemDropdown] = useState(false);

  const [selectedSkema, setSelectedSkema] = useState<SkemaData | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("info");
  const [detailLoading, setDetailLoading] = useState(false);
  const [skemaMT, setSkemaMT] = useState<SkemaMT[]>([]);
  const [skemaRele, setSkemaRele] = useState<SkemaRele[]>([]);
  const [skemaRTAC, setSkemaRTAC] = useState<SkemaRTAC[]>([]);

  const [devices, setDevices] = useState<DeviceProsis[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mt");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [namaSkema, setNamaSkema] = useState("");
  const [selectedSubsistem, setSelectedSubsistem] = useState<number | "">("");
  const [aktif, setAktif] = useState<number | "">("");

  const [detailForm, setDetailForm] = useState<DetailMode>(null);
  const [detailSaving, setDetailSaving] = useState(false);
  const [editingMTNo, setEditingMTNo] = useState<number | null>(null);
  const [editingReleNo, setEditingReleNo] = useState<number | null>(null);
  const [editingRTACTag, setEditingRTACTag] = useState<string | null>(null);
  const [detailDeviceNo, setDetailDeviceNo] = useState<number | "">("");
  const [detailJenis, setDetailJenis] = useState("");
  const [rtacForm, setRtacForm] = useState({
    Tag_Name: "",
    Gardu_Induk: "",
    Bay_Target: "",
    Skema: "",
    Tahap: "",
  });

  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const isAdmin = user?.role === "admin";

  const selectedDevice = useMemo(
    () => devices.find((item) => item.no === detailDeviceNo) || null,
    [devices, detailDeviceNo]
  );

  const filteredDevices = useMemo(() => {
    const keyword = deviceSearch.trim().toLowerCase();
    if (!keyword) return devices.slice(0, 50);
    return devices
      .filter((item) =>
        [
          item.no,
          item.tag_name,
          item.gi,
          item.jenis,
          item.keterangan,
          item.merek,
          item.tipe,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 50);
  }, [devices, deviceSearch]);

  const loadSkema = async (page = 1, searchValue = search) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/skema", {
        params: { page, limit: 20, search: searchValue },
      });
      setData(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      console.error("Gagal mengambil data SKEMA:", err);
      setError(err?.response?.data?.message || "Gagal mengambil data SKEMA.");
    } finally {
      setLoading(false);
    }
  };

  const loadSubsistem = async (searchValue = "") => {
    try {
      setSubsistemLoading(true);
      const response = await api.get("/skema/subsistem", {
        params: { search: searchValue },
      });
      setSubsistem(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil subsistem:", err);
    } finally {
      setSubsistemLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      setDevicesLoading(true);
      const response = await api.get("/skema/devices");
      setDevices(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil DEVICE_PROSIS:", err);
    } finally {
      setDevicesLoading(false);
    }
  };

  const loadMT = async (idSkema: number) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/${idSkema}/mt`);
      setSkemaMT(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail MT:", err);
      setSkemaMT([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadRele = async (idSkema: number) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/${idSkema}/rele`);
      setSkemaRele(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail RELE:", err);
      setSkemaRele([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadRTAC = async (skemaName: string) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/rtac/${encodeURIComponent(skemaName)}`);
      setSkemaRTAC(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail RTAC:", err);
      setSkemaRTAC([]);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadSkema();
    loadSubsistem();
    loadDevices();
  }, []);

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
    if (tab === "mt") await loadMT(selectedSkema.id_skema);
    if (tab === "rele") await loadRele(selectedSkema.id_skema);
    if (tab === "rtac") await loadRTAC(selectedSkema.skema);
  };

  const handleSearch = () => loadSkema(1, search);
  const handleResetSearch = () => {
    setSearch("");
    loadSkema(1, "");
  };

  const resetSkemaForm = () => {
    setEditingId(null);
    setNamaSkema("");
    setSelectedSubsistem("");
    setAktif("");
    setSubsistemSearch("");
    setShowSubsistemDropdown(false);
  };

  const openAddForm = () => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk menambah skema.");
    resetSkemaForm();
    setShowForm(true);
  };

  const openEditForm = (item: SkemaData) => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk mengedit skema.");
    setEditingId(item.id_skema);
    setNamaSkema(item.skema || "");
    setSelectedSubsistem(item.id_ss ?? "");
    setAktif(item.aktif ?? "");
    setSubsistemSearch(item.subsistem || "");
    setShowSubsistemDropdown(false);
    setShowForm(true);
  };

  const closeForm = () => {
    if (!saving) setShowForm(false);
  };

  const selectSubsistem = (item: Subsistem) => {
    setSelectedSubsistem(item.id_ss);
    setSubsistemSearch(item.subsistem);
    setShowSubsistemDropdown(false);
  };

  const handleSubsistemSearch = (value: string) => {
    setSubsistemSearch(value);
    setSelectedSubsistem("");
    setShowSubsistemDropdown(true);
    loadSubsistem(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return alert("Anda tidak memiliki izin.");
    if (!namaSkema.trim()) return alert("Nama skema wajib diisi.");

    try {
      setSaving(true);
      const payload = {
        skema: namaSkema.trim(),
        id_ss: selectedSubsistem === "" ? null : selectedSubsistem,
        aktif: aktif === "" ? null : aktif,
      };
      if (editingId === null) {
        await api.post("/skema", payload);
        alert("Skema berhasil ditambahkan.");
      } else {
        await api.put(`/skema/${editingId}`, payload);
        alert("Skema berhasil diperbarui.");
      }
      setShowForm(false);
      await loadSkema(pagination?.page || 1, search);
      setSelectedSkema(null);
    } catch (err: any) {
      console.error("Gagal menyimpan SKEMA:", err);
      alert(err?.response?.data?.message || "Gagal menyimpan SKEMA.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SkemaData) => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk menghapus skema.");
    if (!window.confirm(`Yakin ingin menghapus skema "${item.skema}"?`)) return;
    try {
      await api.delete(`/skema/${item.id_skema}`);
      alert("Skema berhasil dihapus.");
      if (selectedSkema?.id_skema === item.id_skema) setSelectedSkema(null);
      await loadSkema(pagination?.page || 1, search);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus skema.");
    }
  };

  const openMTForm = (item?: SkemaMT) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDeviceMode("mt");
    setDetailForm(item ? "edit" : "add");
    setEditingMTNo(item?.no ?? null);
    setDetailDeviceNo(item?.no ?? "");
    setDetailJenis(item?.jenis ?? "");
    setDeviceSearch(item?.tag_name || item?.gi || item?.keterangan || "");
    setShowDeviceDropdown(false);
  };

  const openReleForm = (item?: SkemaRele) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDeviceMode("rele");
    setDetailForm(item ? "edit" : "add");
    setEditingReleNo(item?.no ?? null);
    setDetailDeviceNo(item?.no ?? "");
    setDetailJenis(item?.jenis ?? "");
    setDeviceSearch(item?.tag_name || item?.gi || item?.keterangan || "");
    setShowDeviceDropdown(false);
  };

  const openRTACForm = (item?: SkemaRTAC) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDetailForm(item ? "edit" : "add");
    setEditingRTACTag(item?.Tag_Name ?? null);
    setRtacForm({
      Tag_Name: item?.Tag_Name || "",
      Gardu_Induk: item?.Gardu_Induk || "",
      Bay_Target: item?.Bay_Target || "",
      Skema: selectedSkema.skema,
      Tahap: item?.Tahap || "",
    });
  };

  const closeDetailForm = () => {
    if (detailSaving) return;
    setDetailForm(null);
    setEditingMTNo(null);
    setEditingReleNo(null);
    setEditingRTACTag(null);
    setDetailDeviceNo("");
    setDetailJenis("");
    setDeviceSearch("");
    setRtacForm({ Tag_Name: "", Gardu_Induk: "", Bay_Target: "", Skema: "", Tahap: "" });
  };

  const selectDevice = (item: DeviceProsis) => {
    setDetailDeviceNo(item.no);
    setDeviceSearch(item.tag_name || item.keterangan || `${item.no}`);
    setDetailJenis(deviceMode === "mt" ? item.jenis || "" : "");
    setShowDeviceDropdown(false);
  };

  const submitDetailForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin || !selectedSkema || !detailForm) return;

    try {
      setDetailSaving(true);

      if (deviceMode === "mt" || deviceMode === "rele") {
        if (detailDeviceNo === "") return alert("Perangkat wajib dipilih.");
        const payload: Record<string, unknown> = { no: detailDeviceNo };
        if (deviceMode === "mt") payload.jenis = detailJenis.trim() || null;

        const base = `/skema/${selectedSkema.id_skema}/${deviceMode}`;
        if (detailForm === "add") {
          await api.post(base, payload);
          alert(`${deviceMode.toUpperCase()} berhasil ditambahkan.`);
        } else {
          const oldNo = deviceMode === "mt" ? editingMTNo : editingReleNo;
          if (oldNo === null) throw new Error("ID detail tidak ditemukan.");
          await api.put(`${base}/${oldNo}`, payload);
          alert(`${deviceMode.toUpperCase()} berhasil diperbarui.`);
        }

        closeDetailForm();
        if (deviceMode === "mt") await loadMT(selectedSkema.id_skema);
        else await loadRele(selectedSkema.id_skema);
        return;
      }

      if (!rtacForm.Tag_Name.trim() || !rtacForm.Gardu_Induk.trim() || !rtacForm.Bay_Target.trim() || !rtacForm.Tahap.trim()) {
        return alert("Tag Name, Gardu Induk, Bay Target, dan Tahap wajib diisi.");
      }

      const payload = {
        Tag_Name: rtacForm.Tag_Name.trim(),
        Gardu_Induk: rtacForm.Gardu_Induk.trim(),
        Bay_Target: rtacForm.Bay_Target.trim(),
        Skema: selectedSkema.skema,
        Tahap: rtacForm.Tahap.trim(),
      };

      if (detailForm === "add") {
        await api.post("/skema/rtac", payload);
        alert("RTAC berhasil ditambahkan.");
      } else {
        if (!editingRTACTag) throw new Error("Tag Name lama tidak ditemukan.");
        await api.put(`/skema/rtac/${encodeURIComponent(editingRTACTag)}`, payload);
        alert("RTAC berhasil diperbarui.");
      }

      closeDetailForm();
      await loadRTAC(selectedSkema.skema);
    } catch (err: any) {
      console.error("Gagal menyimpan detail SKEMA:", err);
      alert(err?.response?.data?.message || err?.message || "Gagal menyimpan detail.");
    } finally {
      setDetailSaving(false);
    }
  };

  const deleteMT = async (item: SkemaMT) => {
    if (!selectedSkema || !isAdmin) return;
    if (!window.confirm(`Hapus MT No ${item.no} - ${item.gi || "GI tidak diketahui"}?`)) return;
    try {
      await api.delete(`/skema/${selectedSkema.id_skema}/mt/${item.no}`);
      await loadMT(selectedSkema.id_skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus MT.");
    }
  };

  const deleteRele = async (item: SkemaRele) => {
    if (!selectedSkema || !isAdmin) return;
    if (!window.confirm(`Hapus RELE No ${item.no} - ${item.gi || "GI tidak diketahui"}?`)) return;
    try {
      await api.delete(`/skema/${selectedSkema.id_skema}/rele/${item.no}`);
      await loadRele(selectedSkema.id_skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus RELE.");
    }
  };

  const deleteRTAC = async (item: SkemaRTAC) => {
    if (!isAdmin || !selectedSkema || !item.Tag_Name) return;
    if (!window.confirm(`Hapus RTAC "${item.Tag_Name}"?`)) return;
    try {
      await api.delete(`/skema/rtac/${encodeURIComponent(item.Tag_Name)}`);
      await loadRTAC(selectedSkema.skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus RTAC.");
    }
  };

  const getStatusLabel = (value: number | null) => {
    if (value === 1) return "Aktif";
    if (value === 0) return "Tidak Aktif";
    return "Belum Ditentukan";
  };

  const getStatusStyle = (value: number | null) => {
    if (value === 1) return "bg-green-100 text-green-700";
    if (value === 0) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const maxVisible = 7;
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, currentPage + 3);
    if (currentPage <= 3) {
      start = 1;
      end = 7;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 6;
      end = totalPages;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination]);

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fasop-fade-down { animation: fadeInDown 0.45s ease-out both; }
        .fasop-fade-up { animation: fadeInUp 0.5s ease-out both; }
        .fasop-row { transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
        .fasop-row:hover { transform: translateY(-1px); box-shadow: inset 3px 0 0 rgb(37 99 235 / 0.7); }
        @media (prefers-reduced-motion: reduce) { .fasop-fade-down, .fasop-fade-up, .fasop-row { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="fasop-fade-down mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data SKEMA</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola skema, subsistem, MT, RELE, dan RTAC.</p>
        </div>
        {isAdmin && (
          <button onClick={openAddForm} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            + Tambah Skema
          </button>
        )}
      </div>

      {error && <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Cari ID, nama skema, atau subsistem..."
          className="w-full max-w-xl rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button onClick={handleSearch} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Cari</button>
        <button onClick={handleResetSearch} className="rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Reset</button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-lg font-bold text-gray-800">Daftar Skema</h2>
              <p className="mt-1 text-sm text-gray-500">Pilih skema untuk melihat detail.</p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">Memuat data SKEMA...</div>
            ) : data.length === 0 ? (
              <div className="p-10 text-center text-gray-500">Tidak ada data SKEMA.</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[7%] border-b px-3 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                      <th className="w-[42%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Skema</th>
                      <th className="w-[21%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Subsistem</th>
                      <th className="w-[14%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      {isAdmin && <th className="w-[16%] border-b px-3 py-3 text-center text-xs font-semibold text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr
                        key={item.id_skema}
                        onClick={() => handleSelectSkema(item)}
                        className={`fasop-row cursor-pointer hover:bg-blue-50 ${selectedSkema?.id_skema === item.id_skema ? "bg-blue-50" : ""}`}
                      >
                        <td className="border-b px-3 py-4 text-sm font-medium text-gray-500">{item.id_skema}</td>
                        <td className="border-b px-4 py-4"><p className="font-medium leading-6 text-gray-800">{item.skema}</p></td>
                        <td className="border-b px-4 py-4">
                          {item.subsistem ? <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.subsistem}</span> : <span className="text-sm text-gray-400">-</span>}
                        </td>
                        <td className="border-b px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(item.aktif)}`}>{getStatusLabel(item.aktif)}</span></td>
                        {isAdmin && (
                          <td className="border-b px-3 py-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-center gap-2">
                              <button onClick={() => openEditForm(item)} className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100">Edit</button>
                              <button onClick={() => handleDelete(item)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Hapus</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {pagination && (
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-500">Menampilkan {data.length} dari {pagination.total} skema</p>
              <div className="flex items-center gap-1">
                <button disabled={pagination.page <= 1} onClick={() => loadSkema(pagination.page - 1, search)} className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40">←</button>
                {pageNumbers.map((page) => (
                  <button key={page} onClick={() => loadSkema(page, search)} className={`rounded-lg border px-3 py-2 text-sm ${pagination.page === page ? "border-blue-600 bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}>{page}</button>
                ))}
                <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadSkema(pagination.page + 1, search)} className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40">→</button>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="rounded-xl bg-white shadow-sm">
            {!selectedSkema ? (
              <div className="p-10 text-center">
                <div className="mb-3 text-5xl">📌</div>
                <h3 className="font-semibold text-gray-700">Pilih Skema</h3>
                <p className="mt-1 text-sm text-gray-500">Pilih salah satu skema untuk melihat informasi detail.</p>
              </div>
            ) : (
              <>
                <div className="border-b p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">ID Skema</p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">{selectedSkema.id_skema}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedSkema.aktif)}`}>{getStatusLabel(selectedSkema.aktif)}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-gray-800">{selectedSkema.skema}</h2>
                  <p className="mt-1 text-sm text-gray-500">Subsistem: {selectedSkema.subsistem || "-"}</p>
                </div>

                <div className="border-b px-4">
                  <div className="flex gap-1 overflow-x-auto">
                    {[
                      ["info", "Informasi"],
                      ["mt", "MT"],
                      ["rele", "RELE"],
                      ["rtac", "RTAC"],
                    ].map(([id, label]) => (
                      <button key={id} onClick={() => handleTabChange(id as DetailTab)} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  {activeTab === "info" && (
                    <div className="space-y-4">
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Nama Skema</p><p className="mt-1 font-medium text-gray-800">{selectedSkema.skema}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Subsistem</p><p className="mt-1 font-medium text-gray-800">{selectedSkema.subsistem || "-"}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Status</p><p className="mt-1 font-medium text-gray-800">{getStatusLabel(selectedSkema.aktif)}</p></div>
                    </div>
                  )}

                  {activeTab === "mt" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div><h3 className="font-bold text-gray-800">Detail MT</h3><p className="text-xs text-gray-500">Perangkat ditampilkan lengkap dari DEVICE_PROSIS.</p></div>
                        {isAdmin && <button onClick={() => openMTForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah MT</button>}
                      </div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail MT...</p> : skemaMT.length === 0 ? <p className="text-sm text-gray-500">Belum ada detail MT untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[900px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">No</th><th className="border-b p-3 text-left text-xs">GI</th><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Jenis</th><th className="border-b p-3 text-left text-xs">Keterangan</th><th className="border-b p-3 text-left text-xs">Merek</th><th className="border-b p-3 text-left text-xs">Tipe</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaMT.map((item) => <tr key={item.no} className="hover:bg-gray-50"><td className="border-b p-3 text-sm">{item.no}</td><td className="border-b p-3 text-sm">{item.gi || "-"}</td><td className="border-b p-3 text-sm break-all">{item.tag_name || "-"}</td><td className="border-b p-3 text-sm">{item.jenis || "-"}</td><td className="border-b p-3 text-sm">{item.keterangan || "-"}</td><td className="border-b p-3 text-sm">{item.merek || "-"}</td><td className="border-b p-3 text-sm">{item.tipe || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openMTForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteMT(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "rele" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-gray-800">Detail RELE</h3><p className="text-xs text-gray-500">Informasi perangkat diperkaya dari DEVICE_PROSIS.</p></div>{isAdmin && <button onClick={() => openReleForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah RELE</button>}</div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail RELE...</p> : skemaRele.length === 0 ? <p className="text-sm text-gray-500">Belum ada detail RELE untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[900px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">No</th><th className="border-b p-3 text-left text-xs">GI</th><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Jenis</th><th className="border-b p-3 text-left text-xs">Keterangan</th><th className="border-b p-3 text-left text-xs">Merek</th><th className="border-b p-3 text-left text-xs">Tipe</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaRele.map((item) => <tr key={item.no} className="hover:bg-gray-50"><td className="border-b p-3 text-sm">{item.no}</td><td className="border-b p-3 text-sm">{item.gi || "-"}</td><td className="border-b p-3 text-sm break-all">{item.tag_name || "-"}</td><td className="border-b p-3 text-sm">{item.jenis || "-"}</td><td className="border-b p-3 text-sm">{item.keterangan || "-"}</td><td className="border-b p-3 text-sm">{item.merek || "-"}</td><td className="border-b p-3 text-sm">{item.tipe || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openReleForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteRele(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "rtac" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-gray-800">Detail RTAC</h3><p className="text-xs text-gray-500">Data RTAC terhubung ke nama skema.</p></div>{isAdmin && <button onClick={() => openRTACForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah RTAC</button>}</div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail RTAC...</p> : skemaRTAC.length === 0 ? <p className="text-sm text-gray-500">Belum ada data RTAC untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[850px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Gardu Induk</th><th className="border-b p-3 text-left text-xs">Bay Target</th><th className="border-b p-3 text-left text-xs">Skema</th><th className="border-b p-3 text-left text-xs">Tahap</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaRTAC.map((item, index) => <tr key={`${item.Tag_Name}-${index}`} className="hover:bg-gray-50"><td className="border-b p-3 text-sm break-all">{item.Tag_Name || "-"}</td><td className="border-b p-3 text-sm">{item.Gardu_Induk || "-"}</td><td className="border-b p-3 text-sm">{item.Bay_Target || "-"}</td><td className="border-b p-3 text-sm">{item.Skema || "-"}</td><td className="border-b p-3 text-sm">{item.Tahap || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openRTACForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteRTAC(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">{editingId === null ? "Tambah Skema" : "Edit Skema"}</h2><p className="mt-1 text-sm text-gray-500">Informasi utama skema.</p></div><button type="button" onClick={closeForm} className="text-2xl text-gray-400">×</button></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="mb-2 block text-sm font-semibold text-gray-700">Nama Skema</label><input type="text" value={namaSkema} onChange={(e) => setNamaSkema(e.target.value)} placeholder="Contoh: OLS SUTT WONOSARI - PEDAN 1,2" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" required /></div>
              <div className="relative"><label className="mb-2 block text-sm font-semibold text-gray-700">Subsistem</label><input type="text" value={subsistemSearch} onChange={(e) => handleSubsistemSearch(e.target.value)} onFocus={() => { setShowSubsistemDropdown(true); if (subsistem.length === 0) loadSubsistem(); }} placeholder="Cari dan pilih subsistem..." className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />{showSubsistemDropdown && <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-56 overflow-y-auto rounded-lg border bg-white shadow-xl">{subsistemLoading ? <div className="p-4 text-sm text-gray-500">Memuat subsistem...</div> : subsistem.length === 0 ? <div className="p-4 text-sm text-gray-500">Subsistem tidak ditemukan.</div> : subsistem.map((item) => <button type="button" key={item.id_ss} onClick={() => selectSubsistem(item)} className="block w-full border-b px-4 py-3 text-left hover:bg-blue-50"><p className="font-medium text-gray-800">{item.subsistem}</p></button>)}</div>}</div>
              <div><label className="mb-2 block text-sm font-semibold text-gray-700">Status</label><select value={aktif} onChange={(e) => setAktif(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3"><option value="">Belum Ditentukan</option><option value="1">Aktif</option><option value="0">Tidak Aktif</option></select></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={closeForm} disabled={saving} className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-600">Batal</button><button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Menyimpan..." : editingId === null ? "Simpan" : "Simpan Perubahan"}</button></div>
            </form>
          </div>
        </div>
      )}

      {detailForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">{detailForm === "add" ? "Tambah" : "Edit"} {deviceMode === "mt" ? "MT" : deviceMode === "rele" ? "RELE" : "RTAC"}</h2><p className="mt-1 text-sm text-gray-500">Skema: {selectedSkema?.skema}</p></div><button type="button" onClick={closeDetailForm} className="text-2xl text-gray-400">×</button></div>

            <form onSubmit={submitDetailForm} className="space-y-5">
              {deviceMode !== "mt" && deviceMode !== "rele" ? (
                <>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Tag Name</label><input value={rtacForm.Tag_Name} onChange={(e) => setRtacForm((v) => ({ ...v, Tag_Name: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-gray-700">Gardu Induk</label><input value={rtacForm.Gardu_Induk} onChange={(e) => setRtacForm((v) => ({ ...v, Gardu_Induk: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div><div><label className="mb-2 block text-sm font-semibold text-gray-700">Bay Target</label><input value={rtacForm.Bay_Target} onChange={(e) => setRtacForm((v) => ({ ...v, Bay_Target: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div></div>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Skema</label><input value={selectedSkema?.skema || ""} readOnly className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-600" /></div>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Tahap</label><input value={rtacForm.Tahap} onChange={(e) => setRtacForm((v) => ({ ...v, Tahap: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Pilih Perangkat</label>
                    <input
                      value={deviceSearch}
                      onChange={(e) => { setDeviceSearch(e.target.value); setShowDeviceDropdown(true); }}
                      onFocus={() => setShowDeviceDropdown(true)}
                      placeholder="Cari Tag Name, GI, jenis, keterangan, merek, atau tipe..."
                      className="w-full rounded-lg border px-4 py-3"
                    />
                    {showDeviceDropdown && (
                      <div className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-72 overflow-y-auto rounded-lg border bg-white shadow-xl">
                        {devicesLoading ? <div className="p-4 text-sm text-gray-500">Memuat perangkat...</div> : filteredDevices.length === 0 ? <div className="p-4 text-sm text-gray-500">Perangkat tidak ditemukan.</div> : filteredDevices.map((item) => (
                          <button key={item.no} type="button" onClick={() => selectDevice(item)} className="block w-full border-b px-4 py-3 text-left hover:bg-blue-50">
                            <div className="flex items-start justify-between gap-3"><p className="font-semibold text-gray-800">#{item.no} · {item.gi || "GI -"}</p>{item.jenis && <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">{item.jenis}</span>}</div>
                            <p className="mt-1 text-xs text-gray-700">{item.tag_name || item.keterangan || "Tanpa Tag Name"}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.keterangan || "Tanpa keterangan"}{item.merek || item.tipe ? ` · ${item.merek || "-"} ${item.tipe || ""}` : ""}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedDevice && (
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <p className="mb-3 text-sm font-bold text-gray-800">Preview Perangkat</p>
                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                        <div><span className="text-gray-400">No</span><p className="font-medium">{selectedDevice.no}</p></div>
                        <div><span className="text-gray-400">GI</span><p className="font-medium">{selectedDevice.gi || "-"}</p></div>
                        <div><span className="text-gray-400">Tag Name</span><p className="font-medium break-all">{selectedDevice.tag_name || "-"}</p></div>
                        <div><span className="text-gray-400">Jenis</span><p className="font-medium">{selectedDevice.jenis || "-"}</p></div>
                        <div><span className="text-gray-400">Keterangan</span><p className="font-medium">{selectedDevice.keterangan || "-"}</p></div>
                        <div><span className="text-gray-400">Merek / Tipe</span><p className="font-medium">{selectedDevice.merek || "-"} / {selectedDevice.tipe || "-"}</p></div>
                      </div>
                    </div>
                  )}

                  {deviceMode === "mt" && <div><label className="mb-2 block text-sm font-semibold text-gray-700">Jenis MT</label><input value={detailJenis} onChange={(e) => setDetailJenis(e.target.value)} placeholder="Jenis yang disimpan di SKEMA_MT" className="w-full rounded-lg border px-4 py-3" /></div>}
                </>
              )}

              <div className="flex gap-3 pt-2"><button type="button" onClick={closeDetailForm} disabled={detailSaving} className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-600">Batal</button><button type="submit" disabled={detailSaving} className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{detailSaving ? "Menyimpan..." : detailForm === "add" ? "Simpan" : "Simpan Perubahan"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Skema;
>>>>>>> a0daa5f9b7c9d998dd689d11f873c346ef440b5e
