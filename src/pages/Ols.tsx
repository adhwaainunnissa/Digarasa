import { useEffect, useMemo, useState } from "react";
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
    Search,
    ChevronRight,
} from "lucide-react";

import OlsConfig from "../components/ols/OlsConfig";
import OlsHistory from "../components/ols/OlsHistory";

type Tab = "status" | "Konfigurasi" | "Riwayat";

interface OlsData {
    id_sw: number | string;
    skema: string | null;
    gi: string | null;
    target: string | null;
    tahap: string | null;
    tag_name: string | null;
    value: string | number | null;
    quality: string | number | null;
    time: string | null;
    device_name: string | null;
}

export default function Ols() {
    // =========================================================
    // TAB
    // =========================================================

    const [activeTab, setActiveTab] = useState<Tab>("status");

    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] = useState(false);

    // =========================================================
    // DATA OLS
    // =========================================================

    const [statusData, setStatusData] = useState<OlsData[]>([]);
    const [configData, setConfigData] = useState<any[]>([]);

    // =========================================================
    // DETAIL OLS
    // Dipakai untuk tampilan kiri -> kanan seperti Skema
    // =========================================================

    const [detailOls, setDetailOls] = useState<OlsData | null>(null);

    // =========================================================
    // SEARCH
    // =========================================================

    const [search, setSearch] = useState("");

    // =========================================================
    // EDIT
    // selectedOls tetap khusus untuk modal edit
    // =========================================================

    const [selectedOls, setSelectedOls] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    // =========================================================
    // LOAD DATA
    // =========================================================

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

 console.log("STATUS OLS RESPONSE:", statusRes);
        console.log("STATUS OLS DATA:", statusRes.data);

        console.log("CONFIG OLS RESPONSE:", configRes);
        console.log("CONFIG OLS DATA:", configRes.data);

       const newStatusData = statusRes.data || [];
       const newConfigData = configRes.data || [];

        console.log("HASIL STATUS DATA:", newStatusData);

        setStatusData(newStatusData);
        setConfigData(newConfigData);

        setDetailOls((current) => {
            if (!newStatusData.length) {
                return null;
            }

            if (!current) {
                return newStatusData[0];
            }

            const updatedSelected = newStatusData.find(
                (item: OlsData) =>
                    item.id_sw === current.id_sw
            );

            return updatedSelected || newStatusData[0];
        });

    } catch (error) {
        console.error("GAGAL MEMUAT DATA OLS:", error);
    } finally {
        setLoading(false);
    }
};

    // =========================================================
    // PILIH OLS
    // =========================================================

    const handleSelectOls = (item: OlsData) => {
        setDetailOls(item);
    };

    // =========================================================
    // FILTER SEARCH
    // =========================================================

    const filteredStatusData = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return statusData;
        }

        return statusData.filter((item) => {
            return (
                String(item.id_sw ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(item.skema ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(item.gi ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(item.target ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(item.tahap ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(item.tag_name ?? "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [statusData, search]);

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (item: any) => {
        console.log("Edit data:", item);

        setSelectedOls(item);
        setShowEditModal(true);
    };

    // =========================================================
    // UPDATE
    // =========================================================

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

            await loadData();
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

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (item: any) => {
        const confirmDelete = window.confirm(
            `Apakah kamu yakin ingin menghapus data OLS dengan ID ${item.id_sw}?`
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/ols/${item.id_sw}`);

            alert("Data OLS berhasil dihapus");

            // Kalau data yang dihapus sedang dipilih,
            // detail akan otomatis berpindah ke data berikutnya
            if (
                detailOls &&
                detailOls.id_sw === item.id_sw
            ) {
                setDetailOls(null);
            }

            await loadData();
        } catch (error) {
            console.error(
                "Gagal menghapus data:",
                error
            );

            alert("Gagal menghapus data OLS");
        }
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeEditModal = () => {
        if (editLoading) return;

        setShowEditModal(false);
        setSelectedOls(null);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <Zap
                                className="h-6 w-6"
                                strokeWidth={2}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                OLS Monitoring
                            </h1>

                            <p className="text-sm text-slate-500">
                                Monitoring dan pengelolaan data OLS
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />

                    Refresh
                </button>
            </div>

            {/* =================================================
                TAB
            ================================================= */}

            <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

                <button
                    type="button"
                    onClick={() => setActiveTab("status")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        activeTab === "status"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Activity className="h-4 w-4" />
                    Status
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("config")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        activeTab === "config"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Settings className="h-4 w-4" />
                    Config
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        activeTab === "history"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    <Info className="h-4 w-4" />
                    History
                </button>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* =================================================
                    STATUS
                ================================================= */}

                {activeTab === "status" && (
                    <div className="flex min-h-[650px] flex-col md:flex-row">

                        {/* =========================================
                            LEFT SIDE - LIST OLS
                        ========================================= */}

                        <div className="w-full shrink-0 border-b border-slate-200 md:w-96 md:border-b-0 md:border-r">

                            {/* SEARCH */}

                            <div className="border-b border-slate-200 p-4">

                                <div className="relative">

                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Cari OLS..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                                <div className="mt-3 flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-500">
                                        Daftar OLS
                                    </span>

                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                        {filteredStatusData.length}
                                    </span>

                                </div>

                            </div>

                            {/* LIST */}

                            <div className="max-h-[580px] overflow-y-auto p-3">

                                {loading ? (
                                    <div className="space-y-3">

                                        {[1, 2, 3, 4].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="h-24 animate-pulse rounded-xl bg-slate-100"
                                                />
                                            )
                                        )}

                                    </div>
                                ) : filteredStatusData.length === 0 ? (
                                    <div className="flex min-h-[250px] items-center justify-center px-4 text-center">

                                        <div>
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                <Activity className="h-5 w-5 text-slate-400" />
                                            </div>

                                            <p className="text-sm font-medium text-slate-600">
                                                Tidak ada data OLS
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Data OLS belum tersedia
                                            </p>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="space-y-2">

                                        {filteredStatusData.map(
                                            (item) => {
                                                const isSelected =
                                                    detailOls?.id_sw ===
                                                    item.id_sw;

                                                return (
                                                    <button
                                                        key={String(
                                                            item.id_sw
                                                        )}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectOls(
                                                                item
                                                            )
                                                        }
                                                        className={`group relative w-full rounded-xl border p-4 text-left transition-all ${
                                                            isSelected
                                                                ? "border-blue-200 bg-blue-50 shadow-sm"
                                                                : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                                        }`}
                                                    >

                                                        <div className="flex items-start justify-between gap-3">

                                                            <div className="min-w-0">

                                                                <p
                                                                    className={`truncate text-sm font-semibold ${
                                                                        isSelected
                                                                            ? "text-blue-700"
                                                                            : "text-slate-800"
                                                                    }`}
                                                                >
                                                                    {item.skema ||
                                                                        "Tanpa Skema"}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    ID SW:{" "}
                                                                    {item.id_sw}
                                                                </p>

                                                            </div>

                                                            <ChevronRight
                                                                className={`mt-0.5 h-4 w-4 shrink-0 transition ${
                                                                    isSelected
                                                                        ? "text-blue-600"
                                                                        : "text-slate-300 group-hover:text-slate-500"
                                                                }`}
                                                            />

                                                        </div>

                                                        <div className="mt-3 grid grid-cols-2 gap-2">

                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    GI
                                                                </p>

                                                                <p className="truncate text-xs font-medium text-slate-600">
                                                                    {item.gi ||
                                                                        "-"}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                    Tahap
                                                                </p>

                                                                <p className="truncate text-xs font-medium text-slate-600">
                                                                    {item.tahap ||
                                                                        "-"}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>
                        </div>

                        {/* =========================================
                            RIGHT SIDE - DETAIL OLS
                        ========================================= */}

                        <div className="min-w-0 flex-1">

                            {detailOls ? (
                                <div className="h-full">

                                    {/* DETAIL HEADER */}

                                    <div className="border-b border-slate-200 p-5 md:p-6">

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                            <div className="flex items-start gap-3">

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                    <Zap
                                                        className="h-6 w-6"
                                                        strokeWidth={2}
                                                    />
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Detail OLS
                                                    </p>

                                                    <h2 className="mt-1 truncate text-xl font-bold text-slate-800">
                                                        {detailOls.skema ||
                                                            "Tanpa Skema"}
                                                    </h2>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        ID Switch:{" "}
                                                        {detailOls.id_sw}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* ACTION */}

                                            <div className="flex shrink-0 gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            detailOls
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            detailOls
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                    {/* DETAIL CONTENT */}

                                    <div className="p-5 md:p-6">

                                        <div className="mb-5">
                                            <h3 className="text-base font-semibold text-slate-800">
                                                Informasi OLS
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Informasi berdasarkan data
                                                monitoring OLS.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                                            {/* ID SW */}

                                            <DetailCard
                                                label="ID Switch"
                                                value={
                                                    detailOls.id_sw
                                                }
                                            />

                                            {/* SKEMA */}

                                            <DetailCard
                                                label="Skema"
                                                value={
                                                    detailOls.skema
                                                }
                                            />

                                            {/* GI */}

                                            <DetailCard
                                                label="GI"
                                                value={
                                                    detailOls.gi
                                                }
                                            />

                                            {/* TARGET */}

                                            <DetailCard
                                                label="Target"
                                                value={
                                                    detailOls.target
                                                }
                                            />

                                            {/* TAHAP */}

                                            <DetailCard
                                                label="Tahap"
                                                value={
                                                    detailOls.tahap
                                                }
                                            />

                                            {/* TAG NAME */}

                                            <DetailCard
                                                label="Tag Name"
                                                value={
                                                    detailOls.tag_name
                                                }
                                            />

                                            {/* VALUE */}

                                            <DetailCard
                                                label="Value"
                                                value={
                                                    detailOls.value
                                                }
                                            />

                                            {/* QUALITY */}

                                            <DetailCard
                                                label="Quality"
                                                value={
                                                    detailOls.quality
                                                }
                                            />

                                            {/* TIME */}

                                            <DetailCard
                                                label="Time"
                                                value={
                                                    detailOls.time
                                                }
                                            />

                                            {/* DEVICE */}

                                            <DetailCard
                                                label="Device Name"
                                                value={
                                                    detailOls.device_name
                                                }
                                                fullWidth
                                            />

                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[650px] items-center justify-center p-6">

                                    <div className="text-center">

                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                            <Activity className="h-7 w-7 text-slate-400" />
                                        </div>

                                        <h3 className="text-base font-semibold text-slate-700">
                                            Pilih Data OLS
                                        </h3>

                                        <p className="mt-1 max-w-sm text-sm text-slate-400">
                                            Pilih salah satu data OLS pada
                                            daftar di sebelah kiri untuk
                                            melihat detailnya.
                                        </p>

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* =================================================
                    CONFIG
                ================================================= */}

                {activeTab === "config" && (
                    <div className="p-4 md:p-6">
                        <OlsConfig
                            data={configData}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>
                )}

                {/* =================================================
                    HISTORY
                ================================================= */}

                {activeTab === "history" && (
                    <div className="p-4 md:p-6">
                        <OlsHistory />
                    </div>
                )}

            </div>

            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {showEditModal && selectedOls && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Edit Data OLS
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    ID Switch:{" "}
                                    {selectedOls.id_sw}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={editLoading}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-4 p-5">

                            {/* ID */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                    ID Switch
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedOls.id_sw ?? ""
                                    }
                                    disabled
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                                />
                            </div>

                            {/* SKEMA */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                    Skema
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedOls.skema ?? ""
                                    }
                                    onChange={(e) =>
                                        setSelectedOls({
                                            ...selectedOls,
                                            skema: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* GI */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                    GI
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedOls.gi ?? ""
                                    }
                                    onChange={(e) =>
                                        setSelectedOls({
                                            ...selectedOls,
                                            gi: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* TARGET */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                    Target
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedOls.target ?? ""
                                    }
                                    onChange={(e) =>
                                        setSelectedOls({
                                            ...selectedOls,
                                            target: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* TAHAP */}

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-600">
                                    Tahap
                                </label>

                                <input
                                    type="text"
                                    value={
                                        selectedOls.tahap ?? ""
                                    }
                                    onChange={(e) =>
                                        setSelectedOls({
                                            ...selectedOls,
                                            tahap: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={editLoading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdate}
                                disabled={editLoading}
                                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {editLoading
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

// =============================================================
// DETAIL CARD
// =============================================================

interface DetailCardProps {
    label: string;
    value: any;
    fullWidth?: boolean;
}

function DetailCard({
    label,
    value,
    fullWidth = false,
}: DetailCardProps) {
    return (
        <div
            className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${
                fullWidth
                    ? "sm:col-span-2 xl:col-span-3"
                    : ""
            }`}
        >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-semibold text-slate-700">
                {value === null ||
                value === undefined ||
                value === ""
                    ? "-"
                    : String(value)}
            </p>
        </div>
    );
}