import { useEffect, useState } from "react";
import api from "../api/axios";

import {
    Pencil,
    Trash2,
    Zap,
    Settings,
    Activity,
    RefreshCw,
    Info,
    X,
} from "lucide-react";

import OlsStatus from "../components/ols/OlsStatus";
import OlsConfig from "../components/ols/OlsConfig";
import OlsHistory from "../components/ols/OlsHistory";

type Tab = "status" | "config" | "history";

export default function Ols() {
    const [activeTab, setActiveTab] = useState<Tab>("status");
    const [loading, setLoading] = useState(false);

    const [statusData, setStatusData] = useState<any[]>([]);
    const [configData, setConfigData] = useState<any[]>([]);

    // Data untuk Edit
    const [selectedOls, setSelectedOls] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    // ======================================================
    // LOAD DATA
    // ======================================================

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            const [statusRes, configRes] = await Promise.all([
                api.get("/ols/status"),
                api.get("/ols/config"),
            ]);

            setStatusData(statusRes.data?.data || []);
            setConfigData(configRes.data?.data || []);
        } catch (error) {
            console.error("Gagal memuat data OLS:", error);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // EDIT
    // ======================================================

    const handleEdit = (item: any) => {
        console.log("Edit data:", item);

        setSelectedOls(item);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!selectedOls) return;

        try {
            setEditLoading(true);

            await api.put(`/ols/${selectedOls.id_sw}`, {
                skema: selectedOls.skema,
                gi: selectedOls.gi,
                target: selectedOls.target,
                tahap: selectedOls.tahap,
            });

            alert("Data OLS berhasil diperbarui");

            setShowEditModal(false);
            setSelectedOls(null);

            loadData();
        } catch (error) {
            console.error(
                "Gagal memperbarui data OLS:",
                error
            );

            alert("Data OLS gagal diperbarui");
        } finally {
            setEditLoading(false);
        }
    };

    // ======================================================
    // DELETE
    // ======================================================

    const handleDelete = async (item: any) => {
        const confirmDelete = window.confirm(
            `Apakah kamu yakin ingin menghapus data OLS dengan ID ${item.id_sw}?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/ols/${item.id_sw}`);

            alert("Data OLS berhasil dihapus");

            loadData();
        } catch (error) {
            console.error(
                "Gagal menghapus data:",
                error
            );

            alert("Gagal menghapus data OLS");
        }
    };

    // ======================================================
    // CLOSE EDIT MODAL
    // ======================================================

    const closeEditModal = () => {
        if (editLoading) return;

        setShowEditModal(false);
        setSelectedOls(null);
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F5F9FF]">

            {/* ==================================================
                ANIMATED BACKGROUND
            ================================================== */}

            <style>
                {`
                    @keyframes olsPageEnter {
                        from {
                            opacity: 0;
                            transform: translateY(8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes olsBlobFloat {
                        0%, 100% {
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                        50% {
                            transform: translate3d(15px, -12px, 0) scale(1.04);
                        }
                    }

                    @keyframes olsPulse {
                        0%, 100% {
                            opacity: .55;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 1;
                            transform: scale(1.08);
                        }
                    }

                    @keyframes olsShimmer {
                        0% {
                            transform: translateX(-130%);
                        }
                        100% {
                            transform: translateX(130%);
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }
                `}
            </style>

            {/* Background Blobs */}

            <div
                className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#00BFFF]/10 blur-3xl"
                style={{
                    animation:
                        "olsBlobFloat 8s ease-in-out infinite",
                }}
            />

            <div
                className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#0066FF]/10 blur-3xl"
                style={{
                    animation:
                        "olsBlobFloat 10s ease-in-out infinite reverse",
                }}
            />

            <div
                className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 rounded-full bg-[#FFD600]/5 blur-3xl"
                style={{
                    animation:
                        "olsBlobFloat 12s ease-in-out infinite",
                }}
            />

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#0066FF]/10 bg-white/95 px-6 py-5 shadow-[0_4px_25px_rgba(0,102,255,0.05)] backdrop-blur-xl md:px-8">

                {/* Top Gradient */}

                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

                    {/* TITLE */}

                    <div className="flex items-center gap-4">

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#082B5F] text-white shadow-[0_8px_25px_rgba(0,102,255,0.25)]">

                            <Zap className="h-6 w-6" />

                            {/* Yellow Badge */}

                            <span
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#FFD600]"
                                style={{
                                    animation:
                                        "olsPulse 2s ease-in-out infinite",
                                }}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#082B5F]" />
                            </span>

                        </div>

                        <div>

                            <h1 className="text-xl font-bold tracking-tight text-[#082B5F] md:text-2xl">
                                OLS Monitoring
                            </h1>

                            <p className="mt-1 text-xs font-medium text-[#0066FF]/65 md:text-sm">
                                Pemantauan dan konfigurasi Over Load Shedding
                            </p>

                        </div>

                    </div>

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-[#0066FF]/15 bg-white px-3 py-2 text-sm font-semibold text-[#0066FF] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0066FF]/30 hover:bg-[#F5F9FF] hover:shadow-[0_8px_22px_rgba(0,102,255,0.12)] disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
                    >

                        <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-[#00BFFF]/10 transition-all duration-700 group-hover:left-[130%]" />

                        <RefreshCw
                            className={`relative h-4 w-4 ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />

                        <span className="relative hidden sm:inline">
                            {loading
                                ? "Memuat..."
                                : "Refresh Data"}
                        </span>

                    </button>

                </div>

            </header>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main
                className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden p-5 md:p-8"
                style={{
                    animation:
                        "olsPageEnter .45s ease-out",
                }}
            >

                {/* ==================================================
                    TABS
                ================================================== */}

                <div className="mb-5 flex shrink-0 gap-1 overflow-x-auto border-b border-[#0066FF]/10 md:mb-6 md:gap-3">

                    {/* STATUS */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab("status")
                        }
                        className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                            activeTab === "status"
                                ? "text-[#0066FF]"
                                : "text-[#082B5F]/45 hover:text-[#082B5F]"
                        }`}
                    >

                        {activeTab === "status" && (
                            <span className="absolute inset-x-1 bottom-[-1px] h-[3px] rounded-t-full bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600] shadow-[0_0_10px_rgba(0,102,255,0.25)]" />
                        )}

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                                activeTab === "status"
                                    ? "bg-[#0066FF]/10 text-[#0066FF]"
                                    : "bg-transparent text-[#082B5F]/30 group-hover:bg-[#F5F9FF] group-hover:text-[#0066FF]"
                            }`}
                        >
                            <Activity className="h-4 w-4" />
                        </span>

                        Status (Real-time)

                    </button>

                    {/* CONFIG */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab("config")
                        }
                        className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                            activeTab === "config"
                                ? "text-[#0066FF]"
                                : "text-[#082B5F]/45 hover:text-[#082B5F]"
                        }`}
                    >

                        {activeTab === "config" && (
                            <span className="absolute inset-x-1 bottom-[-1px] h-[3px] rounded-t-full bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600] shadow-[0_0_10px_rgba(0,102,255,0.25)]" />
                        )}

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                                activeTab === "config"
                                    ? "bg-[#0066FF]/10 text-[#0066FF]"
                                    : "bg-transparent text-[#082B5F]/30 group-hover:bg-[#F5F9FF] group-hover:text-[#0066FF]"
                            }`}
                        >
                            <Settings className="h-4 w-4" />
                        </span>

                        Konfigurasi

                    </button>

                    {/* HISTORY */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveTab("history")
                        }
                        className={`group relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                            activeTab === "history"
                                ? "text-[#0066FF]"
                                : "text-[#082B5F]/45 hover:text-[#082B5F]"
                        }`}
                    >

                        {activeTab === "history" && (
                            <span className="absolute inset-x-1 bottom-[-1px] h-[3px] rounded-t-full bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600] shadow-[0_0_10px_rgba(0,102,255,0.25)]" />
                        )}

                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                                activeTab === "history"
                                    ? "bg-[#FFD600]/15 text-[#B58900]"
                                    : "bg-transparent text-[#082B5F]/30 group-hover:bg-[#F5F9FF] group-hover:text-[#0066FF]"
                            }`}
                        >
                            <Info className="h-4 w-4" />
                        </span>

                        Riwayat

                    </button>

                </div>

                {/* ==================================================
                    CONTENT CARD
                ================================================== */}

                <div className="relative flex-1 overflow-hidden rounded-2xl border border-[#0066FF]/12 bg-white shadow-[0_10px_35px_rgba(0,102,255,0.07)]">

                    {/* Top Accent */}

                    <div className="absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                    {/* LOADING */}

                    {loading &&
                    activeTab !== "history" ? (

                        <div className="flex h-full flex-col items-center justify-center gap-3">

                            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#0066FF]/10 bg-[#F5F9FF]">

                                <RefreshCw className="h-5 w-5 animate-spin text-[#0066FF]" />

                                <span
                                    className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#FFD600]"
                                    style={{
                                        animation:
                                            "olsPulse 1.8s ease-in-out infinite",
                                    }}
                                />

                            </div>

                            <span className="text-sm font-semibold text-[#082B5F]/55">
                                Memuat data...
                            </span>

                        </div>

                    ) : (

                        <div className="flex h-full flex-col overflow-hidden">

                            {/* STATUS */}

                            {activeTab === "status" && (
                                <OlsStatus
                                    data={statusData}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}

                            {/* CONFIG */}

                            {activeTab === "config" && (
                                <OlsConfig
                                    data={configData}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}

                            {/* HISTORY */}

                            {activeTab === "history" && (
                                <OlsHistory />
                            )}

                        </div>

                    )}

                </div>

                {/* ==================================================
                    MODAL EDIT OLS
                ================================================== */}

                {showEditModal &&
                    selectedOls && (

                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                            {/* Overlay */}

                            <div
                                className="absolute inset-0 bg-[#082B5F]/65 backdrop-blur-md"
                                onClick={
                                    closeEditModal
                                }
                            />

                            {/* Modal */}

                            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#0066FF]/15 bg-white shadow-[0_25px_80px_rgba(8,43,95,0.28)]">

                                {/* Top Gradient */}

                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                                {/* ==================================================
                                    MODAL HEADER
                                ================================================== */}

                                <div className="flex items-center justify-between border-b border-[#0066FF]/10 bg-gradient-to-r from-[#F5F9FF] to-white px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFFF]/15 to-[#0066FF]/10 text-[#0066FF]">

                                            <Pencil className="h-4.5 w-4.5" />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-bold text-[#082B5F]">
                                                Edit Data OLS
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-[#082B5F]/45">

                                                ID OLS:{" "}

                                                <span className="font-mono font-semibold text-[#0066FF]">
                                                    {
                                                        selectedOls.id_sw
                                                    }
                                                </span>

                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            closeEditModal
                                        }
                                        disabled={
                                            editLoading
                                        }
                                        className="rounded-xl border border-transparent p-2 text-[#082B5F]/35 transition-all hover:border-[#0066FF]/10 hover:bg-[#F5F9FF] hover:text-[#0066FF] disabled:opacity-50"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>

                                </div>

                                {/* ==================================================
                                    MODAL BODY
                                ================================================== */}

                                <div className="space-y-4 px-6 py-5">

                                    {/* ID */}

                                    <div>

                                        <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[#082B5F]">

                                            <span>
                                                ID Switch
                                            </span>

                                            <span className="rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#B58900]">
                                                Primary
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedOls.id_sw ??
                                                ""
                                            }
                                            disabled
                                            className="w-full rounded-xl border border-[#0066FF]/10 bg-[#F5F9FF] px-3 py-2.5 text-sm font-mono font-medium text-[#082B5F]/45 outline-none"
                                        />

                                    </div>

                                    {/* SKEMA */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Skema
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedOls.skema ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedOls(
                                                    {
                                                        ...selectedOls,
                                                        skema: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10"
                                        />

                                    </div>

                                    {/* GI */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            GI
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedOls.gi ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedOls(
                                                    {
                                                        ...selectedOls,
                                                        gi: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10"
                                        />

                                    </div>

                                    {/* TARGET */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Target
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedOls.target ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedOls(
                                                    {
                                                        ...selectedOls,
                                                        target: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10"
                                        />

                                    </div>

                                    {/* TAHAP */}

                                    <div>

                                        <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                            Tahap
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                selectedOls.tahap ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                setSelectedOls(
                                                    {
                                                        ...selectedOls,
                                                        tahap: e
                                                            .target
                                                            .value,
                                                    }
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10"
                                        />

                                    </div>

                                </div>

                                {/* ==================================================
                                    MODAL FOOTER
                                ================================================== */}

                                <div className="flex justify-end gap-3 border-t border-[#0066FF]/10 bg-[#F5F9FF]/60 px-6 py-4">

                                    <button
                                        type="button"
                                        onClick={
                                            closeEditModal
                                        }
                                        disabled={
                                            editLoading
                                        }
                                        className="rounded-xl border border-[#0066FF]/10 bg-white px-4 py-2 text-sm font-semibold text-[#082B5F]/60 transition-all hover:border-[#0066FF]/20 hover:bg-[#F5F9FF] hover:text-[#082B5F] disabled:opacity-50"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleUpdate
                                        }
                                        disabled={
                                            editLoading
                                        }
                                        className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,102,255,0.30)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover:left-[130%]" />

                                        {editLoading ? (

                                            <>
                                                <RefreshCw className="relative h-4 w-4 animate-spin" />

                                                <span className="relative">
                                                    Menyimpan...
                                                </span>
                                            </>

                                        ) : (

                                            <>
                                                <Pencil className="relative h-4 w-4" />

                                                <span className="relative">
                                                    Simpan
                                                </span>
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

            </main>

        </div>
    );
}