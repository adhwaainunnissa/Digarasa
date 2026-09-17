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
    Zap,
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
// MAIN COMPONENT
// ========================================

export default function Device() {
    // ========================================
    // STATE: MAIN
    // ========================================

    const [data, setData] = useState<DeviceProsis[]>([]);
    const [pagination, setPagination] =
        useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ========================================
    // STATE: DETAIL
    // ========================================

    const [selectedDevice, setSelectedDevice] =
        useState<DeviceProsis | null>(null);

    const [activeTab, setActiveTab] =
        useState<DetailTab>("info");

    const [detailLoading, setDetailLoading] =
        useState(false);

    const [usageMT, setUsageMT] =
        useState<any[]>([]);

    const [usageRele, setUsageRele] =
        useState<any[]>([]);

    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async (
        page = 1,
        searchValue = search
    ) => {
        try {
            setLoading(true);

            const response = await api.get(
                "/device",
                {
                    params: {
                        page,
                        limit: 20,
                        search: searchValue,
                    },
                }
            );

            setData(
                response.data.data || []
            );

            setPagination(
                response.data.pagination || null
            );
        } catch (error) {
            console.error(
                "Gagal mengambil data DEVICE_PROSIS:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // SELECT DEVICE
    // ========================================

    const handleSelectDevice = (
        item: DeviceProsis
    ) => {
        setSelectedDevice(item);
        setActiveTab("info");
        setUsageMT([]);
        setUsageRele([]);
    };

    const handleTabChange = async (
        tab: DetailTab
    ) => {
        if (!selectedDevice) return;

        setActiveTab(tab);

        if (tab === "usage") {
            await loadUsage(selectedDevice);
        }
    };

    // ========================================
    // LOAD USAGE
    // ========================================

    const loadUsage = async (
        device: DeviceProsis
    ) => {
        setDetailLoading(true);

        try {
            const response =
                await api.get(
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
    // PAGINATION
    // ========================================

    const pageNumbers = useMemo(() => {
        if (!pagination) return [];

        const {
            totalPages,
            page,
        } = pagination;

        if (totalPages <= 5) {
            return Array.from(
                {
                    length: totalPages,
                },
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
            {/* ========================================
                ANIMATIONS
            ======================================== */}

            <style>{`
                @keyframes devicePageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes deviceBlobFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(20px, -15px) scale(1.05);
                    }
                }

                @keyframes devicePulse {
                    0%, 100% {
                        box-shadow:
                            0 0 0 rgba(0, 102, 255, 0);
                    }
                    50% {
                        box-shadow:
                            0 0 22px rgba(0, 102, 255, .14);
                    }
                }

                @keyframes deviceShimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                .device-page-enter {
                    animation:
                        devicePageEnter
                        .55s
                        cubic-bezier(.22,1,.36,1)
                        both;
                }

                .device-blob {
                    animation:
                        deviceBlobFloat
                        8s
                        ease-in-out
                        infinite;
                }

                .device-pulse {
                    animation:
                        devicePulse
                        3s
                        ease-in-out
                        infinite;
                }

                .device-shimmer {
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,.35),
                            transparent
                        );
                    background-size: 200% 100%;
                    animation:
                        deviceShimmer
                        2.5s
                        linear
                        infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .device-page-enter,
                    .device-blob,
                    .device-pulse,
                    .device-shimmer {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* ========================================
                BACKGROUND DECORATION
            ======================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="device-blob absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00BFFF]/10 blur-3xl" />

                <div
                    className="device-blob absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#0066FF]/8 blur-3xl"
                    style={{
                        animationDelay: "2s",
                    }}
                />

                <div
                    className="device-blob absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#FFD600]/10 blur-3xl"
                    style={{
                        animationDelay: "4s",
                    }}
                />
            </div>

            {/* ========================================
                LEFT: DEVICE LIST
            ======================================== */}

            <aside className="relative z-10 flex w-full shrink-0 flex-col border-b border-blue-100 bg-white/95 shadow-[4px_0_24px_rgba(0,102,255,.05)] backdrop-blur-xl md:w-96 md:border-b-0 md:border-r">
                {/* HEADER */}

                <div className="border-b border-blue-50 bg-gradient-to-r from-white via-[#F5F9FF] to-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#082B5F] text-white shadow-lg shadow-blue-500/20">
                                <Cpu className="relative z-10 h-5 w-5" />

                                <div className="device-shimmer absolute inset-0" />
                            </div>

                            <div>
                                <h1 className="text-sm font-extrabold tracking-tight text-[#082B5F]">
                                    Device Module
                                </h1>

                                <p className="text-[11px] font-medium text-slate-500">
                                    Peralatan Prosis
                                </p>
                            </div>
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-[#B58900]">
                            <Zap className="h-4 w-4" />
                        </div>
                    </div>

                    {/* SEARCH */}

                    <div className="relative mt-5">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0066FF]" />

                        <input
                            type="text"
                            placeholder="Cari No, Tag Name, GI, Jenis..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                loadDevices(
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
                                    loadDevices(
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

                {/* DEVICE LIST */}

                <div className="flex-1 overflow-y-auto p-3">
                    {loading ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                                <RefreshCw className="h-5 w-5 animate-spin text-[#0066FF]" />
                            </div>

                            <span className="text-xs font-semibold">
                                Memuat data...
                            </span>
                        </div>
                    ) : data.length ===
                      0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                                <AlertCircle className="h-6 w-6 text-[#B58900]" />
                            </div>

                            <span className="text-xs font-semibold">
                                Tidak ada device
                                ditemukan.
                            </span>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {data.map(
                                (item) => {
                                    const isActive =
                                        selectedDevice?.no ===
                                        item.no;

                                    return (
                                        <li
                                            key={
                                                item.no
                                            }
                                            onClick={() =>
                                                handleSelectDevice(
                                                    item
                                                )
                                            }
                                            className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3.5 transition-all duration-300 ${
                                                isActive
                                                    ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50/50 shadow-md shadow-blue-500/10"
                                                    : "border-transparent bg-white hover:-translate-y-0.5 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-md"
                                            }`}
                                        >
                                            {/* ACTIVE INDICATOR */}

                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />
                                            )}

                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1 pr-2">
                                                    <h3
                                                        className={`truncate text-sm font-bold ${
                                                            isActive
                                                                ? "text-[#082B5F]"
                                                                : "text-slate-800"
                                                        }`}
                                                    >
                                                        {item.gi ||
                                                            "Unknown GI"}
                                                    </h3>

                                                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-slate-500">
                                                        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[#0066FF]">
                                                            #
                                                            {
                                                                item.no
                                                            }
                                                        </span>

                                                        <span className="text-slate-300">
                                                            •
                                                        </span>

                                                        <span className="truncate">
                                                            {item.jenis ||
                                                                "No Jenis"}
                                                        </span>
                                                    </div>

                                                    {item.tag_name && (
                                                        <div className="mt-2 flex items-center gap-1.5 truncate text-[10px] text-slate-400">
                                                            <Activity className="h-3 w-3 shrink-0 text-[#00AEEF]" />

                                                            <span className="truncate font-mono">
                                                                {
                                                                    item.tag_name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    )}
                </div>

                {/* PAGINATION */}

                {pagination &&
                    data.length > 0 && (
                        <div className="flex shrink-0 items-center justify-between border-t border-blue-50 bg-[#F5F9FF] p-3">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                                {pagination.total}{" "}
                                Devices
                            </span>

                            <div className="flex gap-1">
                                <button
                                    disabled={
                                        pagination.page <=
                                        1
                                    }
                                    onClick={() =>
                                        loadDevices(
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
                                            key={
                                                num
                                            }
                                            onClick={() =>
                                                loadDevices(
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
                                            {
                                                num
                                            }
                                        </button>
                                    )
                                )}

                                <button
                                    disabled={
                                        pagination.page >=
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        loadDevices(
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
                RIGHT: DETAIL PANEL
            ======================================== */}

            <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-white/70 backdrop-blur-sm">
                {!selectedDevice ? (
                    <div className="device-page-enter flex flex-1 flex-col items-center justify-center bg-[#F5F9FF]/70 p-8 text-center">
                        <div className="relative mb-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-yellow-50 shadow-inner">
                                <Cpu className="h-9 w-9 text-[#0066FF]" />
                            </div>

                            <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD600] text-[#082B5F] shadow-md">
                                <Zap className="h-3.5 w-3.5 fill-current" />
                            </div>
                        </div>

                        <h2 className="text-xl font-extrabold text-[#082B5F]">
                            Tidak Ada Device
                            Terpilih
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Pilih peralatan
                            (device) dari daftar
                            di panel navigasi
                            untuk melihat
                            detail informasi
                            dan pemakaian
                            dalam skema.
                        </p>
                    </div>
                ) : (
                    <div className="device-page-enter flex h-full flex-1 flex-col overflow-hidden">
                        {/* ========================================
                            DETAIL HEADER
                        ======================================== */}

                        <div className="relative shrink-0 overflow-hidden border-b border-blue-100 bg-gradient-to-r from-[#F5F9FF] via-white to-blue-50/50 px-8 py-6">
                            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#00BFFF]/8 blur-3xl" />

                            <div className="relative">
                                <div className="mb-2.5 flex items-center gap-2">
                                    <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 font-mono text-[10px] font-bold text-[#0066FF]">
                                        No:{" "}
                                        {
                                            selectedDevice.no
                                        }
                                    </span>

                                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#B58900]">
                                        {selectedDevice.jenis ||
                                            "UNKNOWN JENIS"}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold tracking-tight text-[#082B5F]">
                                    {selectedDevice.gi ||
                                        "-"}
                                </h2>

                                <div className="mt-2 flex items-center gap-4 text-sm font-medium text-slate-500">
                                    <span className="flex items-center gap-1.5 font-mono">
                                        <Activity className="h-4 w-4 text-[#0066FF]" />

                                        {selectedDevice.tag_name ||
                                            "Tanpa Tag Name"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ========================================
                            TABS
                        ======================================== */}

                        <div className="flex shrink-0 gap-6 overflow-x-auto border-b border-blue-100 bg-white px-8 pt-2">
                            {[
                                {
                                    id: "info",
                                    label: "Informasi",
                                    icon: Info,
                                },
                                {
                                    id: "usage",
                                    label: "Digunakan Dalam",
                                    icon: Server,
                                },
                            ].map(
                                (tab) => (
                                    <button
                                        key={
                                            tab.id
                                        }
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

                                        {
                                            tab.label
                                        }

                                        {activeTab ===
                                            tab.id && (
                                            <span className="absolute bottom-[-2px] left-1/2 h-1 w-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#FFD600]" />
                                        )}
                                    </button>
                                )
                            )}
                        </div>

                        {/* ========================================
                            CONTENT
                        ======================================== */}

                        <div className="flex-1 overflow-y-auto bg-[#F5F9FF]/40 p-8">
                            {/* ========================================
                                INFO TAB
                            ======================================== */}

                            {activeTab ===
                                "info" && (
                                <div className="max-w-3xl space-y-6">
                                    <div className="device-pulse overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                                        <div className="h-1 bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                                        <div className="p-6">
                                            <div className="mb-5 flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                                    <Info className="h-4 w-4 text-[#0066FF]" />
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-extrabold text-[#082B5F]">
                                                        Detail
                                                        Perangkat
                                                    </h3>

                                                    <p className="text-[10px] font-medium text-slate-400">
                                                        Informasi
                                                        lengkap
                                                        device
                                                    </p>
                                                </div>
                                            </div>

                                            <dl className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        No (ID)
                                                    </dt>

                                                    <dd className="mt-1.5 font-mono text-sm font-bold text-[#0066FF]">
                                                        {
                                                            selectedDevice.no
                                                        }
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Tag Name
                                                    </dt>

                                                    <dd className="mt-1.5 break-all font-mono text-sm font-semibold text-[#082B5F]">
                                                        {selectedDevice.tag_name ||
                                                            "-"}
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Gardu Induk
                                                        (GI)
                                                    </dt>

                                                    <dd className="mt-1.5 text-sm font-bold text-[#082B5F]">
                                                        {selectedDevice.gi ||
                                                            "-"}
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Jenis
                                                    </dt>

                                                    <dd className="mt-1.5">
                                                        <span className="inline-flex items-center rounded-lg border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-bold text-[#B58900]">
                                                            {selectedDevice.jenis ||
                                                                "-"}
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Merek
                                                    </dt>

                                                    <dd className="mt-1.5 text-sm font-bold text-[#082B5F]">
                                                        {selectedDevice.merek ||
                                                            "-"}
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Tipe
                                                    </dt>

                                                    <dd className="mt-1.5 text-sm font-bold text-[#082B5F]">
                                                        {selectedDevice.tipe ||
                                                            "-"}
                                                    </dd>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <dt className="text-xs font-semibold text-slate-400">
                                                        Keterangan
                                                    </dt>

                                                    <dd className="mt-1.5 rounded-xl border border-blue-50 bg-[#F5F9FF] p-4 text-sm leading-relaxed text-slate-600">
                                                        {selectedDevice.keterangan ||
                                                            "Tidak ada keterangan."}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ========================================
                                USAGE TAB
                            ======================================== */}

                            {activeTab ===
                                "usage" && (
                                <div>
                                    <div className="mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                                                <Server className="h-4 w-4 text-[#0066FF]" />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-extrabold text-[#082B5F]">
                                                    Digunakan
                                                    Dalam Skema
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Daftar skema
                                                    yang
                                                    menggunakan
                                                    device ini
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {detailLoading ? (
                                        <div className="flex flex-col items-center justify-center gap-3 py-16">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                                                <RefreshCw className="h-5 w-5 animate-spin text-[#0066FF]" />
                                            </div>

                                            <span className="text-xs font-semibold text-slate-400">
                                                Memuat data
                                                penggunaan...
                                            </span>
                                        </div>
                                    ) : usageMT.length ===
                                          0 &&
                                      usageRele.length ===
                                          0 ? (
                                        <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-4 py-14 text-center">
                                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-yellow-50">
                                                <Server className="h-7 w-7 text-[#0066FF]" />
                                            </div>

                                            <p className="text-sm font-bold text-[#082B5F]">
                                                Belum Ada Data
                                                Penggunaan
                                            </p>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                                                Saat ini tidak
                                                ada informasi
                                                atau API yang
                                                menghubungkan
                                                perangkat ini
                                                dengan tabel
                                                SKEMA_MT atau
                                                SKEMA_RELE.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* MT */}

                                            {usageMT.length >
                                                0 && (
                                                <div>
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-[#00BFFF]" />

                                                        <h4 className="text-sm font-extrabold text-[#082B5F]">
                                                            Skema
                                                            MT
                                                        </h4>

                                                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0066FF]">
                                                            {
                                                                usageMT.length
                                                            }{" "}
                                                            data
                                                        </span>
                                                    </div>

                                                    <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
                                                        <table className="w-full whitespace-nowrap text-left text-sm">
                                                            <thead className="border-b border-blue-100 bg-[#F5F9FF] text-[10px] font-extrabold uppercase tracking-wider text-[#082B5F]">
                                                                <tr>
                                                                    <th className="px-4 py-3">
                                                                        Nama
                                                                        Skema
                                                                    </th>

                                                                    <th className="px-4 py-3">
                                                                        Subsistem
                                                                    </th>

                                                                    <th className="px-4 py-3">
                                                                        Peran
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-blue-50 bg-white">
                                                                {usageMT.map(
                                                                    (
                                                                        row,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={`mt-${index}`}
                                                                            className="transition-colors hover:bg-blue-50/50"
                                                                        >
                                                                            <td className="px-4 py-3 font-bold text-[#082B5F]">
                                                                                {row.skema_name ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-slate-600">
                                                                                {row.subsistem ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-4 py-3">
                                                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#0066FF]">
                                                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]" />

                                                                                    MT
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* RELE */}

                                            {usageRele.length >
                                                0 && (
                                                <div>
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-[#FFD600]" />

                                                        <h4 className="text-sm font-extrabold text-[#082B5F]">
                                                            Skema
                                                            RELE
                                                        </h4>

                                                        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-[#B58900]">
                                                            {
                                                                usageRele.length
                                                            }{" "}
                                                            data
                                                        </span>
                                                    </div>

                                                    <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-sm">
                                                        <table className="w-full whitespace-nowrap text-left text-sm">
                                                            <thead className="border-b border-blue-100 bg-[#F5F9FF] text-[10px] font-extrabold uppercase tracking-wider text-[#082B5F]">
                                                                <tr>
                                                                    <th className="px-4 py-3">
                                                                        Nama
                                                                        Skema
                                                                    </th>

                                                                    <th className="px-4 py-3">
                                                                        Subsistem
                                                                    </th>

                                                                    <th className="px-4 py-3">
                                                                        Peran
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y divide-blue-50 bg-white">
                                                                {usageRele.map(
                                                                    (
                                                                        row,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={`rele-${index}`}
                                                                            className="transition-colors hover:bg-blue-50/50"
                                                                        >
                                                                            <td className="px-4 py-3 font-bold text-[#082B5F]">
                                                                                {row.skema_name ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-4 py-3 text-slate-600">
                                                                                {row.subsistem ||
                                                                                    "-"}
                                                                            </td>

                                                                            <td className="px-4 py-3">
                                                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-bold text-[#B58900]">
                                                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />

                                                                                    RELE
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
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