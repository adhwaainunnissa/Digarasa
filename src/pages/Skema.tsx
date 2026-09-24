import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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
    Check,
    Zap,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Tag,
    Layers,
    Shield,
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
    tag_name: string | null;
    gi: string | null;
    jenis: string | null;
    keterangan: string | null;
    merek: string | null;
    tipe: string | null;
}

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

interface Toast {
    id: number;
    type: "success" | "error" | "warning" | "info";
    message: string;
}

interface ConfirmDialogState {
    open: boolean;
    title: string;
    message: string;
    detail?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

// ========================================
// TOAST COMPONENT
// ========================================

let _toastId = 0;

const ToastContainer = ({
    toasts,
    onRemove,
}: {
    toasts: Toast[];
    onRemove: (id: number) => void;
}) => (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5">
        {toasts.map((t) => (
            <div
                key={t.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-2xl backdrop-blur-sm transition-all duration-300 ${
                    t.type === "success"
                        ? "border-green-200 bg-white/95 text-green-800"
                        : t.type === "error"
                          ? "border-red-200 bg-white/95 text-red-800"
                          : t.type === "warning"
                            ? "border-amber-200 bg-white/95 text-amber-800"
                            : "border-blue-200 bg-white/95 text-blue-800"
                }`}
                style={{ minWidth: 280, maxWidth: 380 }}
            >
                <div className="mt-0.5 shrink-0">
                    {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {t.type === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {t.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    {t.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="flex-1 text-sm font-semibold leading-snug">{t.message}</p>
                <button onClick={() => onRemove(t.id)} className="ml-1 shrink-0 text-slate-400 transition-colors hover:text-slate-700">
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
        ))}
    </div>
);

// ========================================
// CONFIRM DIALOG COMPONENT
// ========================================

const ConfirmDialogModal = ({ dialog }: { dialog: ConfirmDialogState }) => {
    if (!dialog.open) return null;
    return (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#082B5F]/60 backdrop-blur-sm" onClick={dialog.onCancel} />
            <div className="skema-modal relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="p-6">
                    <div className="mb-4 flex items-start gap-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${dialog.danger ? "bg-red-50" : "bg-blue-50"}`}>
                            {dialog.danger ? <AlertTriangle className="h-5 w-5 text-red-600" /> : <Info className="h-5 w-5 text-[#0066FF]" />}
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-[#082B5F]">{dialog.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600">{dialog.message}</p>
                        </div>
                    </div>
                    {dialog.detail && (
                        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <div className="mb-1 flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 text-amber-600" />
                                <span className="text-xs font-bold text-amber-700">Informasi Penting</span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed text-amber-800">{dialog.detail}</p>
                        </div>
                    )}
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={dialog.onCancel} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100">Batal</button>
                        <button onClick={dialog.onConfirm} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 ${dialog.danger ? "bg-red-600 hover:bg-red-700" : "bg-[#0066FF] hover:bg-[#0055DD]"}`}>
                            <Check className="h-4 w-4" />
                            {dialog.danger ? "Ya, Hapus" : "Konfirmasi"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========================================
// SEARCHABLE SELECT
// ========================================

const SearchableSelect = ({
    options,
    value,
    onChange,
    placeholder,
    renderOption,
    displayValue,
}: {
    options: any[];
    value: any;
    onChange: (val: any) => void;
    placeholder: string;
    renderOption: (opt: any) => React.ReactNode;
    displayValue: (val: any) => string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((opt) =>
        displayValue(opt).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-blue-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "font-medium text-[#082B5F]" : "text-slate-400"}>
                    {value ? displayValue(options.find((o) => o === value) || value) : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 text-[#0066FF] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-blue-100 bg-white shadow-2xl shadow-blue-900/10">
                    <div className="border-b border-blue-50 bg-[#F5F9FF] p-2.5">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#0066FF]" />
                            <input autoFocus type="text" className="w-full rounded-lg border border-blue-100 bg-white py-2 pl-8 pr-3 text-xs text-slate-800 outline-none transition-all focus:border-[#0066FF]" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <ul className="max-h-60 overflow-y-auto p-1.5">
                        {filteredOptions.length === 0 ? (
                            <li className="p-4 text-center text-xs text-slate-500">Tidak ada hasil ditemukan</li>
                        ) : (
                            filteredOptions.map((opt, i) => (
                                <li key={i} className="group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-blue-50 hover:text-[#0066FF]" onClick={() => { onChange(opt); setIsOpen(false); setSearch(""); }}>
                                    {renderOption(opt)}
                                    {value === opt && <Check className="h-4 w-4 text-[#0066FF]" />}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

// ========================================
// HIERARCHICAL DEVICE PICKER
// ========================================
// Progressive device selection:
//   MT:   GI → Device (pre-filtered by jenis=MT)
//   RELE: Jenis → GI → Device

const HierarchicalDevicePicker = ({
    tabType,
    value,
    onChange,
}: {
    tabType: "mt" | "rele";
    value: DeviceProsis | null;
    onChange: (device: DeviceProsis | null) => void;
}) => {
    const defaultJenis = tabType === "mt" ? "MT" : "";
    const [selectedJenis, setSelectedJenis] = useState<string>(defaultJenis);
    const [selectedGI, setSelectedGI] = useState<string>("");
    const [giList, setGIList] = useState<string[]>([]);
    const [deviceList, setDeviceList] = useState<DeviceProsis[]>([]);
    const [loadingGI, setLoadingGI] = useState(false);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [deviceSearch, setDeviceSearch] = useState("");
    const [jenisList, setJenisList] = useState<string[]>([]);
    const [loadingJenis, setLoadingJenis] = useState(false);

    useEffect(() => {
        if (tabType === "rele") {
            setLoadingJenis(true);
            api.get("/skema/devices/jenis")
                .then((r) => setJenisList((r.data || []).filter((j: string) => j.toLowerCase().includes("rele") || j.toLowerCase().includes("test"))))
                .catch(() => setJenisList([]))
                .finally(() => setLoadingJenis(false));
        } else {
            // MT: load GI immediately filtered by jenis=MT
            setLoadingGI(true);
            api.get("/skema/devices/gi", { params: { jenis: "MT" } })
                .then((r) => setGIList(r.data || []))
                .catch(() => setGIList([]))
                .finally(() => setLoadingGI(false));
        }
    }, [tabType]);

    useEffect(() => {
        if (tabType === "rele" && !selectedJenis) { setGIList([]); return; }
        if (tabType === "mt") return; // already loaded on mount
        setLoadingGI(true);
        setSelectedGI("");
        setDeviceList([]);
        onChange(null);
        api.get("/skema/devices/gi", { params: { jenis: selectedJenis } })
            .then((r) => setGIList(r.data || []))
            .catch(() => setGIList([]))
            .finally(() => setLoadingGI(false));
    }, [selectedJenis]);

    useEffect(() => {
        if (!selectedGI) { setDeviceList([]); return; }
        setLoadingDevices(true);
        onChange(null);
        api.get("/skema/devices/filter", { params: { gi: selectedGI, jenis: selectedJenis, search: deviceSearch } })
            .then((r) => setDeviceList(r.data || []))
            .catch(() => setDeviceList([]))
            .finally(() => setLoadingDevices(false));
    }, [selectedGI, selectedJenis]);

    useEffect(() => {
        if (!selectedGI) return;
        const timer = setTimeout(() => {
            setLoadingDevices(true);
            api.get("/skema/devices/filter", { params: { gi: selectedGI, jenis: selectedJenis, search: deviceSearch } })
                .then((r) => setDeviceList(r.data || []))
                .catch(() => setDeviceList([]))
                .finally(() => setLoadingDevices(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [deviceSearch]);

    const step1Done = tabType === "mt" ? true : !!selectedJenis;
    const step2Done = !!selectedGI;
    const step3Done = !!value;

    const StepBadge = ({ n, label, done, active }: { n: number; label: string; done: boolean; active: boolean }) => (
        <div className="flex items-center gap-1.5">
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-green-500 text-white" : active ? "bg-[#0066FF] text-white" : "bg-slate-100 text-slate-400"}`}>
                {done ? <Check className="h-2.5 w-2.5" /> : n}
            </div>
            <span className={`text-[11px] font-semibold ${done ? "text-green-600" : active ? "text-[#0066FF]" : "text-slate-400"}`}>{label}</span>
            {n < 3 && <ArrowRight className="h-3 w-3 text-slate-200" />}
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F5F9FF] px-3 py-2">
                <StepBadge n={1} label={tabType === "mt" ? "Jenis: MT" : "Pilih Jenis"} done={step1Done} active={!step1Done} />
                <StepBadge n={2} label={step2Done ? `GI: ${selectedGI}` : "Pilih GI"} done={step2Done} active={step1Done && !step2Done} />
                <StepBadge n={3} label={step3Done ? `No: ${value?.no}` : "Pilih Perangkat"} done={step3Done} active={step2Done && !step3Done} />
            </div>

            {/* Step 1: Jenis — only for RELE */}
            {tabType === "rele" && (
                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"><Tag className="h-3 w-3" /> Langkah 1 — Jenis</label>
                    {loadingJenis ? (
                        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5"><RefreshCw className="h-4 w-4 animate-spin text-[#0066FF]" /><span className="text-sm text-slate-500">Memuat...</span></div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {jenisList.map((j) => (
                                <button key={j} type="button" onClick={() => setSelectedJenis(j)} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${selectedJenis === j ? "border-[#0066FF] bg-[#0066FF] text-white" : "border-blue-100 bg-white text-slate-600 hover:border-blue-300 hover:text-[#0066FF]"}`}>{j}</button>
                            ))}
                            {selectedJenis && <button type="button" onClick={() => { setSelectedJenis(""); setSelectedGI(""); onChange(null); }} className="rounded-lg border border-slate-100 bg-white p-1.5 text-slate-400 hover:bg-slate-50"><X className="h-3 w-3" /></button>}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: GI */}
            {(tabType === "mt" || (tabType === "rele" && selectedJenis)) && (
                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"><MapPin className="h-3 w-3" /> Langkah {tabType === "mt" ? "1" : "2"} — Gardu Induk</label>
                    {loadingGI ? (
                        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5"><RefreshCw className="h-4 w-4 animate-spin text-[#0066FF]" /><span className="text-sm text-slate-500">Memuat GI...</span></div>
                    ) : giList.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-3 text-center text-xs font-semibold text-slate-400">Tidak ada Gardu Induk tersedia</div>
                    ) : (
                        <div className="max-h-36 overflow-y-auto rounded-xl border border-blue-100 bg-white">
                            {giList.map((gi) => (
                                <button key={gi} type="button" onClick={() => setSelectedGI(gi)} className={`flex w-full items-center justify-between px-3.5 py-2 text-sm transition-all first:rounded-t-xl last:rounded-b-xl ${selectedGI === gi ? "bg-blue-50 font-bold text-[#0066FF]" : "font-medium text-slate-700 hover:bg-blue-50/50"}`}>
                                    <span>{gi}</span>
                                    {selectedGI === gi && <Check className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Device */}
            {selectedGI && (
                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500"><Layers className="h-3 w-3" /> Langkah {tabType === "mt" ? "2" : "3"} — Perangkat</label>
                    <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Cari tag name, merek, tipe..." value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)} className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] py-2 pl-9 pr-3 text-xs outline-none transition-all focus:border-[#0066FF] focus:bg-white" />
                    </div>
                    {loadingDevices ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-[#F5F9FF] py-6">
                            <RefreshCw className="h-4 w-4 animate-spin text-[#0066FF]" /><span className="text-sm text-slate-500">Memuat perangkat...</span>
                        </div>
                    ) : deviceList.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-4 text-center text-xs font-semibold text-slate-400">Tidak ada perangkat di {selectedGI}</div>
                    ) : (
                        <div className="max-h-48 overflow-y-auto rounded-xl border border-blue-100 bg-white">
                            {deviceList.map((d) => {
                                const sel = value?.no === d.no;
                                return (
                                    <button key={d.no} type="button" onClick={() => onChange(sel ? null : d)} className={`flex w-full items-start justify-between border-b border-blue-50 px-3.5 py-2.5 text-left text-xs transition-all last:border-b-0 first:rounded-t-xl last:rounded-b-xl ${sel ? "bg-blue-50" : "hover:bg-blue-50/40"}`}>
                                        <div>
                                            <div className={`font-mono font-bold ${sel ? "text-[#0066FF]" : "text-[#082B5F]"}`}>#{d.no}{d.tag_name && <span className="ml-1 font-mono text-[10px] text-slate-400">{d.tag_name}</span>}</div>
                                            <div className="mt-0.5 text-[10px] text-slate-500">{[d.jenis, d.merek, d.tipe].filter(Boolean).join(" · ")}</div>
                                            {d.keterangan && <div className="mt-0.5 truncate text-[10px] text-slate-400">{d.keterangan}</div>}
                                        </div>
                                        {sel && <Check className="ml-2 mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066FF]" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {value && (
                        <div className="mt-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                            <div className="mb-1 flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /><span className="text-xs font-bold text-green-700">Perangkat Terpilih</span></div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div><span className="text-slate-400">No: </span><span className="font-mono font-bold text-[#082B5F]">{value.no}</span></div>
                                <div><span className="text-slate-400">GI: </span><span className="font-semibold text-[#082B5F]">{value.gi || "-"}</span></div>
                                {value.merek && <div><span className="text-slate-400">Merek: </span><span className="font-semibold text-[#082B5F]">{value.merek}</span></div>}
                                {value.tipe && <div><span className="text-slate-400">Tipe: </span><span className="font-semibold text-[#082B5F]">{value.tipe}</span></div>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ========================================
// MAIN
// ========================================

export default function Skema() {
    // ========================================
    // STATE
    // ========================================

    const [data, setData] = useState<SkemaData[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [subsistem, setSubsistem] = useState<Subsistem[]>([]);

    // ========================================
    // TOAST STATE
    // ========================================

    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: Toast["type"], message: string, duration = 4500) => {
        const id = ++_toastId;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // ========================================
    // CONFIRM DIALOG STATE
    // ========================================

    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        open: false,
        title: "",
        message: "",
        onConfirm: () => {},
        onCancel: () => {},
    });

    const openConfirm = (opts: Omit<ConfirmDialogState, "open">) =>
        setConfirmDialog({ ...opts, open: true });

    const closeConfirm = () =>
        setConfirmDialog((prev) => ({ ...prev, open: false }));

    const [selectedSkema, setSelectedSkema] =
        useState<SkemaData | null>(null);

    const [activeTab, setActiveTab] =
        useState<DetailTab>("info");

    const [detailLoading, setDetailLoading] = useState(false);

    const [skemaMT, setSkemaMT] = useState<SkemaMT[]>([]);
    const [skemaRele, setSkemaRele] =
        useState<SkemaRele[]>([]);
    const [skemaRTAC, setSkemaRTAC] =
        useState<SkemaRTAC[]>([]);

    // ========================================
    // MODALS
    // ========================================

    const [showSkemaForm, setShowSkemaForm] =
        useState(false);

    const [editingSkemaId, setEditingSkemaId] =
        useState<number | null>(null);

    const [formSkemaName, setFormSkemaName] =
        useState("");

    const [formSkemaSub, setFormSkemaSub] =
        useState<Subsistem | null>(null);

    const [formSkemaAktif, setFormSkemaAktif] =
        useState<number | "">("");

    const [showTabForm, setShowTabForm] =
        useState<"mt" | "rele" | "rtac" | null>(null);

    const [editingTabItem, setEditingTabItem] =
        useState<any | null>(null);

    const [formTabDevice, setFormTabDevice] =
        useState<DeviceProsis | null>(null);

    const [formTabJenis, setFormTabJenis] =
        useState("");

    const [formTabRtac, setFormTabRtac] =
        useState<any>({});

    const [saving, setSaving] = useState(false);

    // ========================================
    // USER
    // ========================================

    const user = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch {
            return null;
        }
    }, []);

    const isAdmin = user?.role === "admin";

    // ========================================
    // LOAD
    // ========================================

    useEffect(() => {
        loadSkema();
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const subRes = await api.get("/skema/subsistem");
            setSubsistem(subRes.data || []);
        } catch (error) {
            console.error("Gagal memuat master data:", error);
        }
    };

    const loadSkema = async (
        page = 1,
        searchValue = search
    ) => {
        try {
            setLoading(true);

            const response = await api.get("/skema", {
                params: {
                    page,
                    limit: 20,
                    search: searchValue,
                },
            });

            setData(response.data.data || []);
            setPagination(
                response.data.pagination || null
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data SKEMA:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // SELECT SKEMA
    // ========================================

    const handleSelectSkema = (
        item: SkemaData
    ) => {
        setSelectedSkema(item);
        setActiveTab("info");
        setSkemaMT([]);
        setSkemaRele([]);
        setSkemaRTAC([]);
    };

    const handleTabChange = async (
        tab: DetailTab
    ) => {
        if (!selectedSkema) return;

        setActiveTab(tab);

        await reloadTab(tab, selectedSkema);
    };

    const reloadTab = async (
        tab: DetailTab,
        skema: SkemaData
    ) => {
        setDetailLoading(true);

        try {
            if (tab === "mt") {
                const res = await api.get(
                    `/skema/${skema.id_skema}/mt`
                );

                setSkemaMT(res.data || []);
            } else if (tab === "rele") {
                const res = await api.get(
                    `/skema/${skema.id_skema}/rele`
                );

                setSkemaRele(res.data || []);
            } else if (tab === "rtac") {
                const res = await api.get(
                    `/skema/rtac/${encodeURIComponent(
                        skema.skema
                    )}`
                );

                setSkemaRTAC(res.data || []);
            }
        } catch (error) {
            console.error(
                `Gagal memuat detail ${tab}:`,
                error
            );
        } finally {
            setDetailLoading(false);
        }
    };

    // MT and RELE data is now enriched by the backend via JOIN,
    // so enrichedMT and enrichedRele are just aliases for the state.

    // ========================================
    // CRUD SKEMA
    // ========================================

    const openAddSkema = () => {
        if (!isAdmin) { showToast("warning", "Anda tidak memiliki izin admin."); return; }
        setEditingSkemaId(null);
        setFormSkemaName("");
        setFormSkemaSub(null);
        setFormSkemaAktif("");
        setShowSkemaForm(true);
    };

    const openEditSkema = (e: React.MouseEvent, item: SkemaData) => {
        e.stopPropagation();
        if (!isAdmin) { showToast("warning", "Anda tidak memiliki izin admin."); return; }
        // Pre-fill all SKEMA fields — this ONLY edits the SKEMA table, not DEVICE_PROSIS
        setEditingSkemaId(item.id_skema);
        setFormSkemaName(item.skema);
        setFormSkemaSub(subsistem.find((s) => s.id_ss === item.id_ss) || null);
        setFormSkemaAktif(item.aktif ?? "");
        setShowSkemaForm(true);
    };

    const handleSaveSkema = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formSkemaName.trim()) { showToast("warning", "Nama skema wajib diisi."); return; }

        try {
            setSaving(true);
            // Payload targets SKEMA table ONLY. DEVICE_PROSIS is never touched here.
            const payload = {
                skema: formSkemaName.trim(),
                id_ss: formSkemaSub ? formSkemaSub.id_ss : null,
                aktif: formSkemaAktif === "" ? null : formSkemaAktif,
            };

            if (editingSkemaId) {
                await api.put(`/skema/${editingSkemaId}`, payload);
                showToast("success", `Skema "${formSkemaName.trim()}" berhasil diperbarui.`);
            } else {
                await api.post("/skema", payload);
                showToast("success", `Skema "${formSkemaName.trim()}" berhasil ditambahkan.`);
            }

            setShowSkemaForm(false);
            if (selectedSkema && selectedSkema.id_skema === editingSkemaId) setSelectedSkema(null);
            await loadSkema(pagination?.page || 1, search);
        } catch (error: any) {
            showToast("error", error?.response?.data?.message || "Gagal menyimpan SKEMA.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkema = (e: React.MouseEvent, item: SkemaData) => {
        e.stopPropagation();
        if (!isAdmin) return;

        openConfirm({
            title: "Hapus Skema",
            message: `Anda akan menghapus skema "${item.skema}".`,
            detail:
                "Sebelum dihapus, seluruh data skema (termasuk relasi MT, RELE, dan RTAC) akan dicatat ke dalam log audit sebagai backup. Data dapat dipulihkan dari backup oleh administrator. Tindakan penghapusan dari database tidak dapat dibatalkan secara langsung.",
            danger: true,
            onCancel: closeConfirm,
            onConfirm: async () => {
                closeConfirm();
                try {
                    await api.delete(`/skema/${item.id_skema}`);
                    if (selectedSkema?.id_skema === item.id_skema) setSelectedSkema(null);
                    showToast("success", `Skema "${item.skema}" berhasil dihapus. Backup disimpan di log audit.`);
                    await loadSkema(pagination?.page || 1, search);
                } catch (error: any) {
                    showToast("error", error?.response?.data?.message || "Gagal menghapus SKEMA.");
                }
            },
        });
    };

    // ========================================
    // CRUD TAB
    // ========================================

    const openAddTab = (type: "mt" | "rele" | "rtac") => {
        if (!isAdmin) { showToast("warning", "Anda tidak memiliki izin admin."); return; }
        setShowTabForm(type);
        setEditingTabItem(null);
        setFormTabDevice(null);
        setFormTabJenis("");
        setFormTabRtac({});
    };

    const openEditTab = (type: "mt" | "rele" | "rtac", row: any) => {
        if (!isAdmin) { showToast("warning", "Anda tidak memiliki izin admin."); return; }

        setShowTabForm(type);
        setEditingTabItem(row);

        if (
            type === "mt" ||
            type === "rele"
        ) {
            setFormTabDevice({
                no: row.no,
                tag_name: row.tag_name,
                gi: row.gi,
                jenis: row.jenis,
                keterangan: row.keterangan,
                merek: row.merek,
                tipe: row.tipe,
            } as DeviceProsis);

            setFormTabJenis(row.jenis || "");
        } else if (type === "rtac") {
            setFormTabRtac(row);
        }
    };

    const handleSaveTab = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!selectedSkema || !showTabForm)
            return;

        try {
            setSaving(true);

            let payload: any = {};

            if (showTabForm === "mt") {
                if (!formTabDevice) { showToast("warning", "Pilih peralatan terlebih dahulu."); return; }
                payload = { no: formTabDevice.no, id_skema: selectedSkema.id_skema, jenis: formTabJenis || null };

                if (editingTabItem) {
                    await api.put(`/skema/${selectedSkema.id_skema}/mt/${editingTabItem.no}`, payload);
                } else {
                    await api.post(`/skema/${selectedSkema.id_skema}/mt`, payload);
                }
                showToast("success", `MT berhasil ${editingTabItem ? "diperbarui" : "ditambahkan"}.`);
            } else if (showTabForm === "rele") {
                if (!formTabDevice) { showToast("warning", "Pilih peralatan terlebih dahulu."); return; }
                payload = { no: formTabDevice.no, id_skema: selectedSkema.id_skema };

                if (editingTabItem) {
                    await api.put(`/skema/${selectedSkema.id_skema}/rele/${editingTabItem.no}`, payload);
                } else {
                    await api.post(`/skema/${selectedSkema.id_skema}/rele`, payload);
                }
                showToast("success", `RELE berhasil ${editingTabItem ? "diperbarui" : "ditambahkan"}.`);
            } else if (showTabForm === "rtac") {
                payload = { ...formTabRtac, Skema: selectedSkema.skema };

                if (editingTabItem) {
                    await api.put(`/skema/rtac/item/${encodeURIComponent(editingTabItem.Tag_Name)}`, payload);
                } else {
                    await api.post(`/skema/rtac`, payload);
                }
                showToast("success", `RTAC berhasil ${editingTabItem ? "diperbarui" : "ditambahkan"}.`);
            }

            setShowTabForm(null);
            setEditingTabItem(null);
            await reloadTab(showTabForm, selectedSkema);
        } catch (error: any) {
            showToast("error", error?.response?.data?.error || error?.response?.data?.message || `Gagal menyimpan data ${showTabForm?.toUpperCase()}.`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTab = (
        type: "mt" | "rele" | "rtac",
        row: any
    ) => {
        if (!isAdmin || !selectedSkema) return;

        openConfirm({
            title: `Hapus ${type.toUpperCase()} Record`,
            message: `Yakin ingin menghapus record ini dari ${type.toUpperCase()}?`,
            danger: true,
            onCancel: closeConfirm,
            onConfirm: async () => {
                closeConfirm();
                try {
                    if (type === "mt") {
                        await api.delete(`/skema/${selectedSkema.id_skema}/mt/${row.no}`);
                    } else if (type === "rele") {
                        await api.delete(`/skema/${selectedSkema.id_skema}/rele/${row.no}`);
                    } else if (type === "rtac") {
                        await api.delete(`/skema/rtac/item/${encodeURIComponent(row.Tag_Name)}`);
                    }
                    showToast("success", `Record ${type.toUpperCase()} berhasil dihapus.`);
                    await reloadTab(type, selectedSkema);
                } catch (error: any) {
                    showToast("error", error?.response?.data?.error || error?.response?.data?.message || "Gagal menghapus data.");
                }
            },
        });
    };

    // ========================================
    // HELPERS
    // ========================================

    const getStatusStyle = (
        value: number | null
    ) => {
        if (value === 1) {
            return "bg-blue-50 text-[#0066FF] border-blue-200";
        }

        if (value === 0) {
            return "bg-slate-100 text-slate-600 border-slate-200";
        }

        return "bg-yellow-50 text-[#B58900] border-yellow-200";
    };

    const getStatusLabel = (
        value: number | null
    ) => {
        if (value === 1) return "Aktif";
        if (value === 0)
            return "Tidak Aktif";

        return "Unknown";
    };

    const pageNumbers = useMemo(() => {
        if (!pagination) return [];

        const {
            totalPages,
            page,
        } = pagination;

        if (totalPages <= 5) {
            return Array.from(
                { length: totalPages },
                (_, i) => i + 1
            );
        }

        const start = Math.max(
            1,
            page - 2
        );

        const end = Math.min(
            totalPages,
            page + 2
        );

        return Array.from(
            {
                length:
                    end - start + 1,
            },
            (_, i) => start + i
        );
    }, [pagination]);

    // ========================================
    // RENDER
    // ========================================

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F5F9FF] md:flex-row">
            <style>{`
                @keyframes skemaPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes blobFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(20px, -15px) scale(1.05);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow:
                            0 0 0 rgba(0, 102, 255, 0);
                    }
                    50% {
                        box-shadow:
                            0 0 22px rgba(0, 102, 255, .16);
                    }
                }

                @keyframes modalEnter {
                    from {
                        opacity: 0;
                        transform: translateY(14px) scale(.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .skema-page-enter {
                    animation:
                        skemaPageEnter
                        .55s
                        cubic-bezier(.22,1,.36,1)
                        both;
                }

                .skema-blob {
                    animation:
                        blobFloat
                        8s
                        ease-in-out
                        infinite;
                }

                .skema-modal {
                    animation:
                        modalEnter
                        .25s
                        cubic-bezier(.22,1,.36,1)
                        both;
                }

                .skema-pulse {
                    animation:
                        pulseGlow
                        3s
                        ease-in-out
                        infinite;
                }

                .skema-shimmer {
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,.35),
                            transparent
                        );
                    background-size:
                        200% 100%;
                    animation:
                        shimmer
                        2.5s
                        linear
                        infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .skema-page-enter,
                    .skema-blob,
                    .skema-modal,
                    .skema-pulse,
                    .skema-shimmer {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* ========================================
                BACKGROUND DECORATION
            ======================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="skema-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00BFFF]/10 blur-3xl" />

                <div
                    className="skema-blob absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#0066FF]/8 blur-3xl"
                    style={{
                        animationDelay: "2s",
                    }}
                />

                <div
                    className="skema-blob absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#FFD600]/10 blur-3xl"
                    style={{
                        animationDelay: "4s",
                    }}
                />
            </div>

            {/* ========================================
                LEFT SIDEBAR
            ======================================== */}

            <aside className="relative z-10 flex w-full shrink-0 flex-col border-b border-blue-100 bg-white/95 shadow-[4px_0_24px_rgba(0,102,255,.05)] backdrop-blur-xl md:w-96 md:border-b-0 md:border-r">
                {/* HEADER */}

                <div className="border-b border-blue-50 bg-gradient-to-r from-white via-[#F5F9FF] to-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#082B5F] text-white shadow-lg shadow-blue-500/20">
                                <Server className="relative z-10 h-5 w-5" />

                                <div className="skema-shimmer absolute inset-0" />
                            </div>

                            <div>
                                <h1 className="text-sm font-extrabold tracking-tight text-[#082B5F]">
                                    Skema Module
                                </h1>

                                <p className="text-[11px] font-medium text-slate-500">
                                    Business Control System
                                </p>
                            </div>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={openAddSkema}
                                className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0066FF] to-[#00BFFF] text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30"
                                title="Tambah Skema"
                            >
                                <Plus className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />

                                <div className="skema-shimmer absolute inset-0" />
                            </button>
                        )}
                    </div>

                    {/* SEARCH */}

                    <div className="relative mt-5">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0066FF]" />

                        <input
                            type="text"
                            placeholder="Cari ID, Skema, Subsistem..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                loadSkema(
                                    1,
                                    search
                                )
                            }
                            className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] py-2.5 pl-10 pr-9 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                        />

                        {search && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    loadSkema(
                                        1,
                                        ""
                                    );
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#0066FF]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* LIST */}

                <div className="relative flex-1 overflow-y-auto p-3">
                    {loading ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                                <RefreshCw className="h-5 w-5 animate-spin text-[#0066FF]" />
                            </div>

                            <span className="text-xs font-semibold">
                                Memuat data...
                            </span>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                                <AlertCircle className="h-6 w-6 text-[#B58900]" />
                            </div>

                            <span className="text-xs font-semibold">
                                Tidak ada skema ditemukan.
                            </span>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {data.map((item) => {
                                const isActive =
                                    selectedSkema?.id_skema ===
                                    item.id_skema;

                                return (
                                    <li
                                        key={
                                            item.id_skema
                                        }
                                        onClick={() =>
                                            handleSelectSkema(
                                                item
                                            )
                                        }
                                        className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 transition-all duration-300 ${
                                            isActive
                                                ? "border-blue-200 bg-gradient-to-r from-blue-50 to-[#F5F9FF] shadow-md shadow-blue-500/10"
                                                : "border-transparent bg-white hover:-translate-y-0.5 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-md"
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />
                                        )}

                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0 flex-1 pr-12">
                                                <h3
                                                    className={`truncate text-sm font-bold ${
                                                        isActive
                                                            ? "text-[#082B5F]"
                                                            : "text-slate-800"
                                                    }`}
                                                >
                                                    {
                                                        item.skema
                                                    }
                                                </h3>

                                                <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                                                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[#0066FF]">
                                                        ID:
                                                        {
                                                            item.id_skema
                                                        }
                                                    </span>

                                                    <span className="text-slate-300">
                                                        •
                                                    </span>

                                                    <span className="truncate">
                                                        {item.subsistem ||
                                                            "No Subsistem"}
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(
                                                    item.aktif
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    item.aktif
                                                )}
                                            </span>
                                        </div>

                                        {isAdmin && (
                                            <div
                                                className={`absolute right-2 top-2 flex gap-1 transition-all ${
                                                    isActive
                                                        ? "opacity-100"
                                                        : "opacity-0 group-hover:opacity-100"
                                                }`}
                                            >
                                                <button
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        openEditSkema(
                                                            e,
                                                            item
                                                        )
                                                    }
                                                    className="rounded-lg border border-blue-100 bg-white p-1.5 text-slate-400 shadow-sm transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </button>

                                                <button
                                                    onClick={(
                                                        e
                                                    ) =>
                                                        handleDeleteSkema(
                                                            e,
                                                            item
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-100 bg-white p-1.5 text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                                                    title="Hapus"
                                                >
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

                {/* PAGINATION */}

                {pagination &&
                    data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-blue-50 bg-[#F5F9FF] p-3">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                                {pagination.total} Skema
                            </span>

                            <div className="flex gap-1">
                                <button
                                    disabled={
                                        pagination.page <=
                                        1
                                    }
                                    onClick={() =>
                                        loadSkema(
                                            pagination.page -
                                                1
                                        )
                                    }
                                    className="rounded-lg border border-blue-100 bg-white p-1.5 text-[#0066FF] transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                </button>

                                {pageNumbers.map(
                                    (num) => (
                                        <button
                                            key={num}
                                            onClick={() =>
                                                loadSkema(
                                                    num
                                                )
                                            }
                                            className={`min-w-[26px] rounded-lg border px-1.5 py-1 text-[10px] font-bold transition-all ${
                                                pagination.page ===
                                                num
                                                    ? "border-[#0066FF] bg-[#0066FF] text-white shadow-md shadow-blue-500/20"
                                                    : "border-blue-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#0066FF]"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                <button
                                    disabled={
                                        pagination.page >=
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        loadSkema(
                                            pagination.page +
                                                1
                                        )
                                    }
                                    className="rounded-lg border border-blue-100 bg-white p-1.5 text-[#0066FF] transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
            </aside>

            {/* ========================================
                RIGHT DETAIL
            ======================================== */}

            <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-white/70 backdrop-blur-sm">
                {!selectedSkema ? (
                    <div className="flex flex-1 flex-col items-center justify-center bg-[#F5F9FF]/70 p-8 text-center skema-page-enter">
                        <div className="relative mb-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-yellow-50 shadow-inner">
                                <Server className="h-9 w-9 text-[#0066FF]" />
                            </div>

                            <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD600] text-[#082B5F] shadow-md">
                                <Zap className="h-3.5 w-3.5 fill-current" />
                            </div>
                        </div>

                        <h2 className="text-xl font-extrabold text-[#082B5F]">
                            Tidak Ada Skema Terpilih
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Pilih skema dari daftar di
                            panel navigasi untuk
                            melihat detail informasi,
                            MT, RELE, dan RTAC.
                        </p>
                    </div>
                ) : (
                    <div className="flex h-full flex-1 flex-col overflow-hidden skema-page-enter">
                        {/* DETAIL HEADER */}

                        <div className="relative shrink-0 overflow-hidden border-b border-blue-100 bg-gradient-to-r from-[#F5F9FF] via-white to-blue-50/50 px-8 py-6">
                            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#00BFFF]/8 blur-3xl" />

                            <div className="relative">
                                <div className="mb-2.5 flex items-center gap-2">
                                    <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-[#0066FF]">
                                        ID:{" "}
                                        {
                                            selectedSkema.id_skema
                                        }
                                    </span>

                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(
                                            selectedSkema.aktif
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            selectedSkema.aktif
                                        )}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold tracking-tight text-[#082B5F]">
                                    {
                                        selectedSkema.skema
                                    }
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50">
                                        <Activity className="h-3.5 w-3.5 text-[#0066FF]" />
                                    </div>

                                    {
                                        selectedSkema.subsistem ||
                                        "Tanpa Subsistem"
                                    }
                                </div>
                            </div>
                        </div>

                        {/* TABS */}

                        <div className="flex shrink-0 gap-6 overflow-x-auto border-b border-blue-100 bg-white px-8 pt-2">
                            {[
                                {
                                    id: "info",
                                    label: "Informasi",
                                    icon: Info,
                                },
                                {
                                    id: "mt",
                                    label: "MT (Metering)",
                                    icon: Settings2,
                                },
                                {
                                    id: "rele",
                                    label: "RELE",
                                    icon: Cpu,
                                },
                                {
                                    id: "rtac",
                                    label: "RTAC",
                                    icon: Server,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() =>
                                        handleTabChange(
                                            tab.id as DetailTab
                                        )
                                    }
                                    className={`group relative flex items-center gap-2 border-b-2 py-3 text-sm font-bold transition-all ${
                                        activeTab ===
                                        tab.id
                                            ? "border-[#0066FF] text-[#0066FF]"
                                            : "border-transparent text-slate-400 hover:text-[#082B5F]"
                                    }`}
                                >
                                    <tab.icon
                                        className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                                            activeTab ===
                                            tab.id
                                                ? "text-[#0066FF]"
                                                : ""
                                        }`}
                                    />

                                    {tab.label}

                                    {activeTab ===
                                        tab.id && (
                                        <span className="absolute bottom-[-2px] left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#FFD600]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 overflow-y-auto bg-[#F5F9FF]/40 p-8">
                            {/* INFO */}

                            {activeTab ===
                                "info" && (
                                <div className="max-w-2xl space-y-6">
                                    <div className="skema-pulse overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                                        <div className="h-1 bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                                        <div className="p-6">
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                                    <Info className="h-4 w-4 text-[#0066FF]" />
                                                </div>

                                                <h3 className="text-sm font-extrabold text-[#082B5F]">
                                                    Properties
                                                </h3>
                                            </div>

                                            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Nama Skema
                                                    </dt>

                                                    <dd className="mt-1.5 text-sm font-bold text-[#082B5F]">
                                                        {
                                                            selectedSkema.skema
                                                        }
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Subsistem
                                                    </dt>

                                                    <dd className="mt-1.5 text-sm font-bold text-[#082B5F]">
                                                        {
                                                            selectedSkema.subsistem ||
                                                            "-"
                                                        }
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        ID Internal
                                                    </dt>

                                                    <dd className="mt-1.5 font-mono text-sm font-semibold text-[#0066FF]">
                                                        {
                                                            selectedSkema.id_skema
                                                        }
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Status Aktif
                                                    </dt>

                                                    <dd className="mt-1.5">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusStyle(
                                                                selectedSkema.aktif
                                                            )}`}
                                                        >
                                                            {
                                                                getStatusLabel(
                                                                    selectedSkema.aktif
                                                                )
                                                            }
                                                        </span>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MT */}

                            {activeTab ===
                                "mt" && (
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-[#082B5F]">
                                                Perangkat MT
                                                (Metering)
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Daftar perangkat
                                                metering pada
                                                skema ini
                                            </p>
                                        </div>

                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    openAddTab(
                                                        "mt"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Tambah MT
                                            </button>
                                        )}
                                    </div>

                                    {detailLoading ? (
                                        <div className="flex justify-center py-16">
                                            <RefreshCw className="h-6 w-6 animate-spin text-[#0066FF]" />
                                        </div>
                                    ) : skemaMT.length ===
                                      0 ? (
                                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white py-16 text-center">
                                            <Settings2 className="mx-auto mb-3 h-8 w-8 text-blue-200" />

                                            <p className="text-sm font-semibold text-slate-500">
                                                Tidak ada
                                                perangkat MT
                                                untuk skema
                                                ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
                                            <table className="w-full whitespace-nowrap text-left text-sm">
                                                <thead className="border-b border-blue-100 bg-[#F5F9FF] text-[10px] font-extrabold uppercase tracking-wider text-[#082B5F]">
                                                    <tr>
                                                        <th className="px-4 py-3">
                                                            No
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Gardu Induk
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Merek / Tipe
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Jenis
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Keterangan
                                                        </th>

                                                        {isAdmin && (
                                                            <th className="px-4 py-3 text-right">
                                                                Aksi
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-blue-50 bg-white">
                                                    {skemaMT.map(
                                                        (
                                                            row
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    row.no
                                                                }
                                                                className="transition-colors hover:bg-blue-50/50"
                                                            >
                                                                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0066FF]">
                                                                    {
                                                                        row.no
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 font-bold text-[#082B5F]">
                                                                    {row.gi ||
                                                                        "-"}
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-slate-800">
                                                                            {row.merek ||
                                                                                "-"}
                                                                        </span>

                                                                        <span className="text-xs text-slate-400">
                                                                            {row.tipe ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <span className="rounded-lg border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-bold text-[#B58900]">
                                                                        {row.jenis ||
                                                                            "-"}
                                                                    </span>
                                                                </td>

                                                                <td
                                                                    className="max-w-xs truncate px-4 py-3 text-slate-500"
                                                                    title={
                                                                        row.keterangan ||
                                                                        ""
                                                                    }
                                                                >
                                                                    {row.keterangan ||
                                                                        "-"}
                                                                </td>

                                                                {isAdmin && (
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            onClick={() =>
                                                                                openEditTab(
                                                                                    "mt",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="mr-1 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteTab(
                                                                                    "mt",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RELE */}

                            {activeTab ===
                                "rele" && (
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-[#082B5F]">
                                                Perangkat RELE
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Daftar perangkat
                                                relay pada skema
                                                ini
                                            </p>
                                        </div>

                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    openAddTab(
                                                        "rele"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Tambah RELE
                                            </button>
                                        )}
                                    </div>

                                    {detailLoading ? (
                                        <div className="flex justify-center py-16">
                                            <RefreshCw className="h-6 w-6 animate-spin text-[#0066FF]" />
                                        </div>
                                    ) : skemaRele.length ===
                                      0 ? (
                                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white py-16 text-center">
                                            <Cpu className="mx-auto mb-3 h-8 w-8 text-blue-200" />

                                            <p className="text-sm font-semibold text-slate-500">
                                                Tidak ada
                                                perangkat RELE
                                                untuk skema
                                                ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
                                            <table className="w-full whitespace-nowrap text-left text-sm">
                                                <thead className="border-b border-blue-100 bg-[#F5F9FF] text-[10px] font-extrabold uppercase tracking-wider text-[#082B5F]">
                                                    <tr>
                                                        <th className="px-4 py-3">
                                                            No
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Gardu Induk
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Merek / Tipe
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Keterangan
                                                        </th>

                                                        {isAdmin && (
                                                            <th className="px-4 py-3 text-right">
                                                                Aksi
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-blue-50 bg-white">
                                                    {skemaRele.map(
                                                        (
                                                            row
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    row.no
                                                                }
                                                                className="transition-colors hover:bg-blue-50/50"
                                                            >
                                                                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0066FF]">
                                                                    {
                                                                        row.no
                                                                    }
                                                                </td>

                                                                <td className="px-4 py-3 font-bold text-[#082B5F]">
                                                                    {row.gi ||
                                                                        "-"}
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-slate-800">
                                                                            {row.merek ||
                                                                                "-"}
                                                                        </span>

                                                                        <span className="text-xs text-slate-400">
                                                                            {row.tipe ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td
                                                                    className="max-w-xs truncate px-4 py-3 text-slate-500"
                                                                    title={
                                                                        row.keterangan ||
                                                                        ""
                                                                    }
                                                                >
                                                                    {row.keterangan ||
                                                                        "-"}
                                                                </td>

                                                                {isAdmin && (
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            onClick={() =>
                                                                                openEditTab(
                                                                                    "rele",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="mr-1 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteTab(
                                                                                    "rele",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* RTAC */}

                            {activeTab ===
                                "rtac" && (
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-[#082B5F]">
                                                Data RTAC
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Data RTAC yang
                                                terhubung dengan
                                                skema
                                            </p>
                                        </div>

                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    openAddTab(
                                                        "rtac"
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Tambah RTAC
                                            </button>
                                        )}
                                    </div>

                                    {detailLoading ? (
                                        <div className="flex justify-center py-16">
                                            <RefreshCw className="h-6 w-6 animate-spin text-[#0066FF]" />
                                        </div>
                                    ) : skemaRTAC.length ===
                                      0 ? (
                                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white py-16 text-center">
                                            <Server className="mx-auto mb-3 h-8 w-8 text-blue-200" />

                                            <p className="text-sm font-semibold text-slate-500">
                                                Tidak ada data
                                                RTAC untuk
                                                skema ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
                                            <table className="w-full whitespace-nowrap text-left text-sm">
                                                <thead className="border-b border-blue-100 bg-[#F5F9FF] text-[10px] font-extrabold uppercase tracking-wider text-[#082B5F]">
                                                    <tr>
                                                        <th className="px-4 py-3">
                                                            Tag Name
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Gardu Induk
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Bay Target
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            Tahap
                                                        </th>

                                                        {isAdmin && (
                                                            <th className="px-4 py-3 text-right">
                                                                Aksi
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-blue-50 bg-white">
                                                    {skemaRTAC.map(
                                                        (
                                                            row,
                                                            idx
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    idx
                                                                }
                                                                className="transition-colors hover:bg-blue-50/50"
                                                            >
                                                                <td className="px-4 py-3 font-mono text-xs font-bold text-[#0066FF]">
                                                                    {row.Tag_Name ||
                                                                        "-"}
                                                                </td>

                                                                <td className="px-4 py-3 font-bold text-[#082B5F]">
                                                                    {row.Gardu_Induk ||
                                                                        "-"}
                                                                </td>

                                                                <td className="px-4 py-3 text-slate-600">
                                                                    {row.Bay_Target ||
                                                                        "-"}
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <span className="rounded-lg border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-bold text-[#B58900]">
                                                                        {row.Tahap ||
                                                                            "-"}
                                                                    </span>
                                                                </td>

                                                                {isAdmin && (
                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            onClick={() =>
                                                                                openEditTab(
                                                                                    "rtac",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="mr-1 rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteTab(
                                                                                    "rtac",
                                                                                    row
                                                                                )
                                                                            }
                                                                            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
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

            {/* ========================================
                MODAL SKEMA
            ======================================== */}

            {showSkemaForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#082B5F]/65 backdrop-blur-md"
                        onClick={() =>
                            !saving &&
                            setShowSkemaForm(false)
                        }
                    />

                    <div className="skema-modal relative w-full max-w-lg overflow-visible rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-950/20">
                        <div className="relative overflow-hidden rounded-t-2xl border-b border-blue-100 bg-gradient-to-r from-[#F5F9FF] via-white to-blue-50 px-6 py-5">
                            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#00BFFF]/10 blur-2xl" />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                            <Server className="h-4 w-4 text-[#0066FF]" />
                                        </div>

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                                            Skema Module
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-extrabold text-[#082B5F]">
                                        {editingSkemaId
                                            ? "Edit Skema"
                                            : "Tambah Skema Baru"}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSkemaForm(
                                            false
                                        )
                                    }
                                    className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <form
                            onSubmit={
                                handleSaveSkema
                            }
                            className="space-y-5 px-6 py-6"
                        >
                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                    Nama Skema{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formSkemaName
                                    }
                                    onChange={(e) =>
                                        setFormSkemaName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: OLS SUTT WONOSARI"
                                    className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                    Subsistem
                                </label>

                                <SearchableSelect
                                    options={
                                        subsistem
                                    }
                                    value={
                                        formSkemaSub
                                    }
                                    onChange={
                                        setFormSkemaSub
                                    }
                                    placeholder="Pilih Subsistem..."
                                    displayValue={(
                                        s
                                    ) =>
                                        s.subsistem
                                    }
                                    renderOption={(
                                        s
                                    ) => (
                                        <span className="font-semibold">
                                            {
                                                s.subsistem
                                            }{" "}
                                            <span className="ml-2 font-mono text-xs text-slate-400">
                                                ID:
                                                {
                                                    s.id_ss
                                                }
                                            </span>
                                        </span>
                                    )}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                    Status Aktif
                                </label>

                                <select
                                    value={
                                        formSkemaAktif
                                    }
                                    onChange={(e) =>
                                        setFormSkemaAktif(
                                            e.target
                                                .value ===
                                                ""
                                                ? ""
                                                : Number(
                                                      e
                                                          .target
                                                          .value
                                                  )
                                        )
                                    }
                                    className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                >
                                    <option value="">
                                        Belum Ditentukan
                                    </option>

                                    <option value="1">
                                        Aktif
                                    </option>

                                    <option value="0">
                                        Tidak Aktif
                                    </option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-blue-50 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSkemaForm(
                                            false
                                        )
                                    }
                                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}

                                    {saving
                                        ? "Menyimpan..."
                                        : "Simpan Skema"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================
                MODAL TAB
            ======================================== */}

            {showTabForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#082B5F]/65 backdrop-blur-md"
                        onClick={() =>
                            !saving &&
                            setShowTabForm(null)
                        }
                    />

                    <div className="skema-modal relative w-full max-w-lg overflow-visible rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-950/20">
                        <div className="relative overflow-hidden rounded-t-2xl border-b border-blue-100 bg-gradient-to-r from-[#F5F9FF] via-white to-blue-50 px-6 py-5">
                            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#FFD600]/10 blur-2xl" />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                            {showTabForm ===
                                            "mt" ? (
                                                <Settings2 className="h-4 w-4 text-[#0066FF]" />
                                            ) : showTabForm ===
                                              "rele" ? (
                                                <Cpu className="h-4 w-4 text-[#0066FF]" />
                                            ) : (
                                                <Server className="h-4 w-4 text-[#0066FF]" />
                                            )}
                                        </div>

                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                                            {showTabForm.toUpperCase()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-extrabold text-[#082B5F]">
                                        {editingTabItem
                                            ? "Edit"
                                            : "Tambah"}{" "}
                                        {showTabForm.toUpperCase()}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowTabForm(
                                            null
                                        )
                                    }
                                    className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSaveTab}
                            className="space-y-5 px-6 py-6"
                        >
                            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-yellow-50 p-3.5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                    <Info className="h-4 w-4 text-[#0066FF]" />
                                </div>

                                <div className="text-sm">
                                    <span className="font-bold text-[#082B5F]">
                                        Skema:{" "}
                                    </span>

                                    <span className="font-medium text-[#0066FF]">
                                        {
                                            selectedSkema?.skema
                                        }
                                    </span>
                                </div>
                            </div>

                            {(showTabForm ===
                                "mt" ||
                                showTabForm ===
                                    "rele") && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Peralatan
                                            (Device){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        {/* Show current device info when editing */}
                                        {editingTabItem && (
                                            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                                <p className="text-xs font-bold text-amber-700 mb-1">Perangkat Saat Ini</p>
                                                <p className="text-xs text-amber-800 font-mono">
                                                    #{editingTabItem.no}
                                                    {editingTabItem.gi && ` · ${editingTabItem.gi}`}
                                                    {editingTabItem.merek && ` · ${editingTabItem.merek}`}
                                                </p>
                                                <p className="mt-1 text-[10px] text-amber-600">Gunakan pemilih di bawah untuk mengganti perangkat.</p>
                                            </div>
                                        )}

                                        <HierarchicalDevicePicker
                                            tabType={showTabForm as "mt" | "rele"}
                                            value={formTabDevice}
                                            onChange={setFormTabDevice}
                                        />
                                    </div>

                                    {showTabForm ===
                                        "mt" && (
                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                                Jenis
                                                <span className="ml-2 text-[11px] font-normal text-slate-400">(opsional)</span>
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    formTabJenis
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormTabJenis(
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Diisi otomatis dari device..."
                                                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {showTabForm ===
                                "rtac" && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Tag Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formTabRtac.Tag_Name ||
                                                ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFormTabRtac(
                                                    {
                                                        ...formTabRtac,
                                                        Tag_Name:
                                                            e
                                                                .target
                                                                .value,
                                                    }
                                                )
                                            }
                                            required
                                            disabled={
                                                !!editingTabItem
                                            }
                                            className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10 disabled:bg-slate-100 disabled:text-slate-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                                Gardu
                                                Induk
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    formTabRtac.Gardu_Induk ||
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormTabRtac(
                                                        {
                                                            ...formTabRtac,
                                                            Gardu_Induk:
                                                                e
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                                Bay Target
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    formTabRtac.Bay_Target ||
                                                    ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormTabRtac(
                                                        {
                                                            ...formTabRtac,
                                                            Bay_Target:
                                                                e
                                                                    .target
                                                                    .value,
                                                        }
                                                    )
                                                }
                                                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Tahap
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                formTabRtac.Tahap ||
                                                ""
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setFormTabRtac(
                                                    {
                                                        ...formTabRtac,
                                                        Tahap: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                            className="w-full rounded-xl border border-blue-100 bg-[#F5F9FF] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-end gap-3 border-t border-blue-50 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowTabForm(
                                            null
                                        )
                                    }
                                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        ((showTabForm === "mt" || showTabForm === "rele") && !formTabDevice)
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00BFFF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4" />
                                    )}

                                    {saving
                                        ? "Menyimpan..."
                                        : "Simpan Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* CONFIRM DIALOG */}
            <ConfirmDialogModal dialog={confirmDialog} />

            {/* TOAST SYSTEM */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}