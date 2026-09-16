import { useEffect, useState } from "react";
import api from "../api/axios";

import {
    Zap,
    Settings,
    Activity,
    RefreshCw,
    Info,
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

        alert(`Edit data dengan ID: ${item.id}`);
    };

    // ======================================================
    // DELETE
    // ======================================================

    const handleDelete = async (item: any) => {
        const confirmDelete = window.confirm(
            "Apakah kamu yakin ingin menghapus data ini?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/ols/${item.id}`);

            alert("Data berhasil dihapus");

            loadData();
        } catch (error) {
            console.error("Gagal menghapus data:", error);
            alert("Gagal menghapus data");
        }
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">

                <div className="mx-auto flex max-w-7xl items-center justify-between">

                    {/* TITLE */}

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-xl
                                border border-orange-100
                                bg-orange-50
                                text-orange-600
                                shadow-sm
                            "
                        >
                            <Zap className="h-6 w-6" />
                        </div>

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                OLS Monitoring
                            </h1>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Pemantauan dan konfigurasi Over Load Shedding
                            </p>

                        </div>

                    </div>

                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="
                            flex items-center gap-2
                            rounded-md
                            border border-slate-300
                            bg-white
                            px-4 py-2
                            text-sm font-semibold
                            text-slate-700
                            shadow-sm
                            transition-all
                            duration-300
                            hover:border-blue-300
                            hover:bg-slate-50
                            hover:text-blue-600
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <RefreshCw
                            className={`h-4 w-4 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />

                        {loading ? "Memuat..." : "Refresh Data"}

                    </button>

                </div>

            </header>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main
                className="
                    mx-auto
                    flex w-full max-w-7xl
                    flex-1 flex-col
                    overflow-hidden
                    p-8
                "
            >

                {/* ==================================================
                    TABS
                ================================================== */}

                <div
                    className="
                        mb-6
                        flex shrink-0
                        gap-4
                        border-b border-slate-200
                    "
                >

                    {/* STATUS */}

                    <button
                        type="button"
                        onClick={() => setActiveTab("status")}
                        className={`
                            flex items-center gap-2
                            border-b-2
                            px-4 py-3
                            text-sm font-semibold
                            transition-all
                            duration-300
                            ${
                                activeTab === "status"
                                    ? `
                                        rounded-t-lg
                                        border-blue-600
                                        bg-blue-50/50
                                        text-blue-700
                                    `
                                    : `
                                        border-transparent
                                        text-slate-500
                                        hover:border-slate-300
                                        hover:text-slate-800
                                    `
                            }
                        `}
                    >

                        <Activity
                            className={`
                                h-4 w-4
                                ${
                                    activeTab === "status"
                                        ? "text-blue-600"
                                        : "text-slate-400"
                                }
                            `}
                        />

                        Status (Real-time)

                    </button>

                    {/* CONFIG */}

                    <button
                        type="button"
                        onClick={() => setActiveTab("config")}
                        className={`
                            flex items-center gap-2
                            border-b-2
                            px-4 py-3
                            text-sm font-semibold
                            transition-all
                            duration-300
                            ${
                                activeTab === "config"
                                    ? `
                                        rounded-t-lg
                                        border-blue-600
                                        bg-blue-50/50
                                        text-blue-700
                                    `
                                    : `
                                        border-transparent
                                        text-slate-500
                                        hover:border-slate-300
                                        hover:text-slate-800
                                    `
                            }
                        `}
                    >

                        <Settings
                            className={`
                                h-4 w-4
                                ${
                                    activeTab === "config"
                                        ? "text-blue-600"
                                        : "text-slate-400"
                                }
                            `}
                        />

                        Konfigurasi

                    </button>

                    {/* HISTORY */}

                    <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className={`
                            flex items-center gap-2
                            border-b-2
                            px-4 py-3
                            text-sm font-semibold
                            transition-all
                            duration-300
                            ${
                                activeTab === "history"
                                    ? `
                                        rounded-t-lg
                                        border-blue-600
                                        bg-blue-50/50
                                        text-blue-700
                                    `
                                    : `
                                        border-transparent
                                        text-slate-500
                                        hover:border-slate-300
                                        hover:text-slate-800
                                    `
                            }
                        `}
                    >

                        <Info
                            className={`
                                h-4 w-4
                                ${
                                    activeTab === "history"
                                        ? "text-blue-600"
                                        : "text-slate-400"
                                }
                            `}
                        />

                        Riwayat

                    </button>

                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div
                    className="
                        flex-1
                        overflow-hidden
                        rounded-xl
                        border border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    {/* LOADING */}

                    {loading && activeTab !== "history" ? (

                        <div
                            className="
                                flex h-full
                                flex-col
                                items-center
                                justify-center
                                gap-2
                                text-slate-400
                            "
                        >

                            <RefreshCw
                                className="
                                    h-6 w-6
                                    animate-spin
                                    text-blue-500
                                "
                            />

                            <span className="text-sm font-medium">
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

            </main>

        </div>
    );
}