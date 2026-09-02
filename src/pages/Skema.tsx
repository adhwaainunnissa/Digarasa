import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../api/axios";


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

interface SkemaMT {
    no: number;
    id_skema: number;
    gi: string | null;
    keterangan: string | null;
    merek: string | null;
    tipe: string | null;
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

type DetailTab =
    | "info"
    | "mt"
    | "rele"
    | "rtac";


// ========================================
// COMPONENT
// ========================================

function Skema() {

    // ========================================
    // DATA UTAMA
    // ========================================

    const [data, setData] =
        useState<SkemaData[]>([]);

    const [pagination, setPagination] =
        useState<Pagination | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    // ========================================
    // SUBSISTEM
    // ========================================

    const [subsistem, setSubsistem] =
        useState<Subsistem[]>([]);

    const [subsistemLoading, setSubsistemLoading] =
        useState(false);

    const [subsistemSearch, setSubsistemSearch] =
        useState("");

    const [showSubsistemDropdown, setShowSubsistemDropdown] =
        useState(false);

    // ========================================
    // DETAIL
    // ========================================

    const [selectedSkema, setSelectedSkema] =
        useState<SkemaData | null>(null);

    const [activeTab, setActiveTab] =
        useState<DetailTab>("info");

    const [detailLoading, setDetailLoading] =
        useState(false);

    const [skemaMT, setSkemaMT] =
        useState<SkemaMT[]>([]);

    const [skemaRele, setSkemaRele] =
        useState<SkemaRele[]>([]);

    const [skemaRTAC, setSkemaRTAC] =
        useState<SkemaRTAC[]>([]);

    // ========================================
    // FORM
    // ========================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [namaSkema, setNamaSkema] =
        useState("");

    const [selectedSubsistem, setSelectedSubsistem] =
        useState<number | "">("");

    const [aktif, setAktif] =
        useState<number | "">("");

    const [saving, setSaving] =
        useState(false);

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

    const isAdmin =
        user?.role === "admin";


    // ========================================
    // LOAD SKEMA
    // ========================================

    const loadSkema = async (
        page = 1,
        searchValue = search
    ) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/skema",
                    {
                        params: {
                            page,
                            limit: 20,
                            search:
                                searchValue,
                        },
                    }
                );

            setData(
                response.data.data || []
            );

            setPagination(
                response.data.pagination ||
                null
            );

        } catch (error: any) {

            console.error(
                "Gagal mengambil data SKEMA:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Gagal mengambil data SKEMA."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // LOAD SUBSISTEM
    // ========================================

    const loadSubsistem = async (
        searchValue = ""
    ) => {

        try {

            setSubsistemLoading(true);

            const response =
                await api.get(
                    "/skema/subsistem",
                    {
                        params: {
                            search:
                                searchValue,
                        },
                    }
                );

            setSubsistem(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Gagal mengambil subsistem:",
                error
            );

        } finally {

            setSubsistemLoading(false);

        }
    };


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        loadSkema();
        loadSubsistem();

    }, []);


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


    // ========================================
    // LOAD DETAIL MT
    // ========================================

    const loadMT = async (
        idSkema: number
    ) => {

        try {

            setDetailLoading(true);

            const response =
                await api.get(
                    `/skema/${idSkema}/mt`
                );

            setSkemaMT(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Gagal mengambil detail MT:",
                error
            );

            setSkemaMT([]);

        } finally {

            setDetailLoading(false);

        }
    };


    // ========================================
    // LOAD DETAIL RELE
    // ========================================

    const loadRele = async (
        idSkema: number
    ) => {

        try {

            setDetailLoading(true);

            const response =
                await api.get(
                    `/skema/${idSkema}/rele`
                );

            setSkemaRele(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Gagal mengambil detail RELE:",
                error
            );

            setSkemaRele([]);

        } finally {

            setDetailLoading(false);

        }
    };


    // ========================================
    // LOAD DETAIL RTAC
    // ========================================

    const loadRTAC = async (
        skemaName: string
    ) => {

        try {

            setDetailLoading(true);

            const response =
                await api.get(
                    `/skema/rtac/${encodeURIComponent(
                        skemaName
                    )}`
                );

            setSkemaRTAC(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Gagal mengambil detail RTAC:",
                error
            );

            setSkemaRTAC([]);

        } finally {

            setDetailLoading(false);

        }
    };


    // ========================================
    // DETAIL TAB
    // ========================================

    const handleTabChange = (
        tab: DetailTab
    ) => {

        if (!selectedSkema) {
            return;
        }

        setActiveTab(tab);

        if (
            tab === "mt"
        ) {

            loadMT(
                selectedSkema.id_skema
            );

        }

        if (
            tab === "rele"
        ) {

            loadRele(
                selectedSkema.id_skema
            );

        }

        if (
            tab === "rtac"
        ) {

            loadRTAC(
                selectedSkema.skema
            );

        }

    };


    // ========================================
    // SEARCH
    // ========================================

    const handleSearch = () => {

        loadSkema(
            1,
            search
        );

    };


    const handleResetSearch = () => {

        setSearch("");

        loadSkema(
            1,
            ""
        );

    };


    // ========================================
    // OPEN ADD
    // ========================================

    const openAddForm = () => {

        if (!isAdmin) {

            alert(
                "Anda tidak memiliki izin untuk menambah skema."
            );

            return;
        }

        setEditingId(null);

        setNamaSkema("");

        setSelectedSubsistem("");

        setAktif("");

        setSubsistemSearch("");

        setShowSubsistemDropdown(false);

        setShowForm(true);

    };


    // ========================================
    // OPEN EDIT
    // ========================================

    const openEditForm = (
        item: SkemaData
    ) => {

        if (!isAdmin) {

            alert(
                "Anda tidak memiliki izin untuk mengedit skema."
            );

            return;
        }

        setEditingId(
            item.id_skema
        );

        setNamaSkema(
            item.skema || ""
        );

        setSelectedSubsistem(
            item.id_ss ?? ""
        );

        setAktif(
            item.aktif ?? ""
        );

        setSubsistemSearch(
            item.subsistem || ""
        );

        setShowSubsistemDropdown(
            false
        );

        setShowForm(true);

    };


    // ========================================
    // CLOSE FORM
    // ========================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

    };


    // ========================================
    // SELECT SUBSISTEM
    // ========================================

    const selectSubsistem = (
        item: Subsistem
    ) => {

        setSelectedSubsistem(
            item.id_ss
        );

        setSubsistemSearch(
            item.subsistem
        );

        setShowSubsistemDropdown(
            false
        );

    };


    // ========================================
    // CHANGE SUBSISTEM SEARCH
    // ========================================

    const handleSubsistemSearch = (
        value: string
    ) => {

        setSubsistemSearch(value);

        setSelectedSubsistem("");

        setShowSubsistemDropdown(
            true
        );

        loadSubsistem(value);

    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!isAdmin) {

            alert(
                "Anda tidak memiliki izin."
            );

            return;
        }

        if (!namaSkema.trim()) {

            alert(
                "Nama skema wajib diisi."
            );

            return;
        }

        try {

            setSaving(true);

            const payload = {
                skema:
                    namaSkema.trim(),

                id_ss:
                    selectedSubsistem === ""
                        ? null
                        : selectedSubsistem,

                aktif:
                    aktif === ""
                        ? null
                        : aktif,
            };


            if (
                editingId === null
            ) {

                await api.post(
                    "/skema",
                    payload
                );

                alert(
                    "Skema berhasil ditambahkan."
                );

            } else {

                await api.put(
                    `/skema/${editingId}`,
                    payload
                );

                alert(
                    "Skema berhasil diperbarui."
                );

            }

            closeForm();

            await loadSkema(
                pagination?.page || 1,
                search
            );

            setSelectedSkema(null);

        } catch (error: any) {

            console.error(
                "Gagal menyimpan SKEMA:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Gagal menyimpan SKEMA."
            );

        } finally {

            setSaving(false);

        }
    };


    // ========================================
    // DELETE
    // ========================================

    const handleDelete = async (
        item: SkemaData
    ) => {

        if (!isAdmin) {

            alert(
                "Anda tidak memiliki izin untuk menghapus skema."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Yakin ingin menghapus skema "${item.skema}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/skema/${item.id_skema}`
            );

            alert(
                "Skema berhasil dihapus."
            );

            if (
                selectedSkema?.id_skema ===
                item.id_skema
            ) {
                setSelectedSkema(null);
            }

            await loadSkema(
                pagination?.page || 1,
                search
            );

        } catch (error: any) {

            console.error(
                "Gagal menghapus SKEMA:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Gagal menghapus SKEMA."
            );
        }
    };


    // ========================================
    // STATUS LABEL
    // ========================================

    const getStatusLabel = (
        value: number | null
    ) => {

        if (value === 1) {
            return "Aktif";
        }

        if (value === 0) {
            return "Tidak Aktif";
        }

        return "Belum Ditentukan";
    };


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (
        value: number | null
    ) => {

        if (value === 1) {
            return "bg-green-100 text-green-700";
        }

        if (value === 0) {
            return "bg-red-100 text-red-700";
        }

        return "bg-gray-100 text-gray-600";

    };


    // ========================================
    // PAGINATION
    // ========================================

    const pageNumbers = useMemo(() => {

        if (!pagination) {
            return [];
        }

        const totalPages =
            pagination.totalPages;

        const currentPage =
            pagination.page;

        const maxVisible = 7;

        if (
            totalPages <=
            maxVisible
        ) {

            return Array.from(
                {
                    length:
                        totalPages,
                },
                (_, index) =>
                    index + 1
            );

        }

        let start =
            Math.max(
                1,
                currentPage - 3
            );

        let end =
            Math.min(
                totalPages,
                currentPage + 3
            );

        if (
            currentPage <= 3
        ) {

            start = 1;
            end = 7;

        }

        if (
            currentPage >=
            totalPages - 2
        ) {

            start =
                totalPages - 6;

            end =
                totalPages;

        }

        return Array.from(
            {
                length:
                    end - start + 1,
            },
            (_, index) =>
                start + index
        );

    }, [pagination]);


    // ========================================
    // RENDER
    // ========================================

    return (

        <div className="min-h-full bg-gray-50 p-6 md:p-8">
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }

                .fasop-fade-down {
                    animation: fadeInDown 0.45s ease-out both;
                }

                .fasop-fade-up {
                    animation: fadeInUp 0.5s ease-out both;
                }

                .fasop-scale-in {
                    animation: scaleIn 0.35s ease-out both;
                }

                .fasop-row {
                    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
                }

                .fasop-row:hover {
                    transform: translateY(-1px);
                    box-shadow: inset 3px 0 0 rgb(37 99 235 / 0.7);
                }

                .fasop-button {
                    transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
                }

                .fasop-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 12px rgb(15 23 42 / 0.10);
                }

                .fasop-button:active {
                    transform: scale(0.96);
                }

                .fasop-badge {
                    transition: transform 0.2s ease;
                }

                .fasop-badge:hover {
                    transform: scale(1.04);
                }

                @media (prefers-reduced-motion: reduce) {
                    .fasop-fade-down,
                    .fasop-fade-up,
                    .fasop-scale-in,
                    .fasop-row,
                    .fasop-button,
                    .fasop-badge {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="fasop-fade-down mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Data SKEMA
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola skema, subsistem,
                        MT, RELE, dan RTAC.
                    </p>

                </div>


                {isAdmin && (

                    <button
                        onClick={openAddForm}
                        className="fasop-button rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-800"
                    >
                        + Tambah Skema
                    </button>

                )}

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                    {error}
                </div>

            )}


            {/* ========================================
                SEARCH
            ======================================== */}

            <div className="mb-6 flex flex-col gap-3 md:flex-row">

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    onKeyDown={(e) => {

                        if (
                            e.key ===
                            "Enter"
                        ) {
                            handleSearch();
                        }

                    }}
                    placeholder="Cari ID, nama skema, atau subsistem..."
                    className="w-full max-w-xl rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                    onClick={handleSearch}
                    className="fasop-button rounded-lg border border-blue-600 bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Cari
                </button>

                <button
                    onClick={
                        handleResetSearch
                    }
                    className="fasop-button rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Reset
                </button>

            </div>


            {/* ========================================
                MAIN GRID
            ======================================== */}

            <div className="fasop-fade-up grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">

                {/* ====================================
                    LIST SKEMA
                ==================================== */}

                <div className="min-w-0">

                    <div className="fasop-scale-in overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="border-b p-5">

                            <h2 className="text-lg font-bold text-gray-800">
                                Daftar Skema
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Pilih skema untuk melihat
                                detail.
                            </p>

                        </div>


                        {loading ? (

                            <div className="p-10 text-center text-gray-500">
                                Memuat data SKEMA...
                            </div>

                        ) : data.length === 0 ? (

                            <div className="p-10 text-center">

                                <div className="mb-3 text-5xl">
                                    📋
                                </div>

                                <p className="font-semibold text-gray-700">
                                    Tidak ada data SKEMA.
                                </p>

                            </div>

                        ) : (

                            <div className="w-full overflow-x-auto">

                                <table className="w-full table-fixed">

                                    <thead>

                                        <tr className="bg-gray-50">

                                            <th className="w-[6%] whitespace-nowrap border-b px-3 py-3 text-left text-xs font-semibold text-gray-600">
                                                ID
                                            </th>

                                            <th className="w-[40%] whitespace-nowrap border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">
                                                Skema
                                            </th>

                                            <th className="w-[22%] whitespace-nowrap border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">
                                                Subsistem
                                            </th>

                                            <th className="w-[16%] whitespace-nowrap border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">
                                                Status
                                            </th>

                                            {isAdmin && (

                                                <th className="w-[16%] whitespace-nowrap border-b px-3 py-3 text-center text-xs font-semibold text-gray-600">
                                                    Aksi
                                                </th>

                                            )}

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {data.map(
                                            (
                                                item
                                            ) => (

                                                <tr
                                                    key={
                                                        item.id_skema
                                                    }
                                                    onClick={() =>
                                                        handleSelectSkema(
                                                            item
                                                        )
                                                    }
                                                    className={`fasop-row cursor-pointer hover:bg-blue-50 ${
                                                        selectedSkema?.id_skema ===
                                                        item.id_skema
                                                            ? "bg-blue-50"
                                                            : ""
                                                    }`}
                                                >

                                                    <td className="border-b px-3 py-4 text-sm font-medium text-gray-500">
                                                        {
                                                            item.id_skema
                                                        }
                                                    </td>


                                                    <td className="border-b px-4 py-4">

                                                        <p className="font-medium leading-6 text-gray-800">
                                                            {
                                                                item.skema
                                                            }
                                                        </p>

                                                    </td>


                                                    <td className="border-b px-4 py-4">

                                                        {item.subsistem ? (

                                                            <span className="inline-block whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                                {
                                                                    item.subsistem
                                                                }
                                                            </span>

                                                        ) : (

                                                            <span className="text-sm text-gray-400">
                                                                -
                                                            </span>

                                                        )}

                                                    </td>


                                                    <td className="border-b px-4 py-4">

                                                        <span
                                                            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                                item.aktif
                                                            )}`}
                                                        >
                                                            {
                                                                getStatusLabel(
                                                                    item.aktif
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    {isAdmin && (

                                                        <td
                                                            className="whitespace-nowrap border-b px-3 py-5 align-middle"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                e.stopPropagation()
                                                            }
                                                        >

                                                            <div className="flex items-center justify-center gap-2">

                                                                <button
                                                                    onClick={() =>
                                                                        openEditForm(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="fasop-button rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100"
                                                                >
                                                                    Edit
                                                                </button>


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="fasop-button rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                                                                >
                                                                    Hapus
                                                                </button>

                                                            </div>

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


                    {/* PAGINATION */}

                    {pagination && (
                        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                            <p className="text-sm text-gray-500">

                                Menampilkan{" "}
                                {data.length}{" "}
                                dari{" "}
                                {pagination.total}{" "}
                                skema

                            </p>


                            <div className="flex items-center gap-1">

                                <button
                                    disabled={
                                        pagination.page <=
                                        1
                                    }
                                    onClick={() =>
                                        loadSkema(
                                            pagination.page -
                                                1,
                                            search
                                        )
                                    }
                                    className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40"
                                >
                                    ←
                                </button>


                                {pageNumbers.map(
                                    (
                                        page
                                    ) => (

                                        <button
                                            key={
                                                page
                                            }
                                            onClick={() =>
                                                loadSkema(
                                                    page,
                                                    search
                                                )
                                            }
                                            className={`rounded-lg border px-3 py-2 text-sm ${
                                                pagination.page ===
                                                page
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {
                                                page
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
                                        loadSkema(
                                            pagination.page +
                                                1,
                                            search
                                        )
                                    }
                                    className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40"
                                >
                                    →
                                </button>

                            </div>

                        </div>
                    )}

                </div>


                {/* ====================================
                    DETAIL
                ==================================== */}

                <div className="min-w-0">

                    <div className="fasop-scale-in rounded-xl bg-white shadow-sm">

                        {!selectedSkema ? (

                            <div className="p-10 text-center">

                                <div className="mb-3 text-5xl">
                                    📌
                                </div>

                                <h3 className="font-semibold text-gray-700">
                                    Pilih Skema
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Pilih salah satu skema
                                    untuk melihat
                                    informasi detail.
                                </p>

                            </div>

                        ) : (

                            <>

                                {/* DETAIL HEADER */}

                                <div className="border-b p-5">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                                ID Skema
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-gray-800">
                                                {
                                                    selectedSkema.id_skema
                                                }
                                            </p>

                                        </div>


                                        <span
                                            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                selectedSkema.aktif
                                            )}`}
                                        >
                                            {
                                                getStatusLabel(
                                                    selectedSkema.aktif
                                                )
                                            }
                                        </span>

                                    </div>


                                    <h2 className="mt-4 text-lg font-bold text-gray-800">
                                        {
                                            selectedSkema.skema
                                        }
                                    </h2>

                                </div>


                                {/* TABS */}

                                <div className="border-b px-4">

                                    <div className="flex gap-1 overflow-x-auto">

                                        {[
                                            {
                                                id: "info",
                                                label: "Informasi",
                                            },
                                            {
                                                id: "mt",
                                                label: "MT",
                                            },
                                            {
                                                id: "rele",
                                                label: "RELE",
                                            },
                                            {
                                                id: "rtac",
                                                label: "RTAC",
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
                                                    className={`fasop-button border-b-2 px-4 py-3 text-sm font-semibold ${
                                                        activeTab ===
                                                        tab.id
                                                            ? "border-blue-600 text-blue-600"
                                                            : "border-transparent text-gray-500 hover:text-gray-800"
                                                    }`}
                                                >
                                                    {
                                                        tab.label
                                                    }
                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* TAB CONTENT */}

                                <div className="p-5">

                                    {/* INFO */}

                                    {activeTab ===
                                        "info" && (

                                        <div className="space-y-5">

                                            <div>

                                                <p className="text-xs font-semibold uppercase text-gray-400">
                                                    Nama Skema
                                                </p>

                                                <p className="mt-1 font-medium text-gray-800">
                                                    {
                                                        selectedSkema.skema
                                                    }
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs font-semibold uppercase text-gray-400">
                                                    Subsistem
                                                </p>

                                                <p className="mt-1 font-medium text-gray-800">
                                                    {
                                                        selectedSkema.subsistem ||
                                                        "-"
                                                    }
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs font-semibold uppercase text-gray-400">
                                                    Status
                                                </p>

                                                <p className="mt-1 font-medium text-gray-800">
                                                    {
                                                        getStatusLabel(
                                                            selectedSkema.aktif
                                                        )
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    {/* MT */}

                                    {activeTab ===
                                        "mt" && (

                                        detailLoading ? (

                                            <p className="text-sm text-gray-500">
                                                Memuat detail MT...
                                            </p>

                                        ) : skemaMT.length ===
                                          0 ? (

                                            <p className="text-sm text-gray-500">
                                                Belum ada detail MT untuk skema ini.
                                            </p>

                                        ) : (

                                            <div className="overflow-x-auto">

                                                <table className="w-full">

                                                 <thead>
                                                <tr className="bg-gray-50">
                                                        <th className="border-b p-3 text-left text-xs">
                                                         No
                                                        </th>

                                                        <th className="border-b p-3 text-left text-xs">
                                                        GI
                                                        </th>

                                                        <th className="border-b p-3 text-left text-xs">
                                                          Keterangan
                                                        </th>

                                                         <th className="border-b p-3 text-left text-xs">
                                                             Merek
                                                         </th>

                                                         <th className="border-b p-3 text-left text-xs">
                                                          Tipe
                                                         </th>

                                                         <th className="border-b p-3 text-center text-xs">
                                                          Aksi
                                                         </th>
                                                  </tr>
                                            </thead>


                                        <tbody>
                                            
                                         {skemaMT.map(
                                            (item) => (
                                                <tr key={item.no}>

                                                     <td className="border-b p-3 text-sm">
                                                         {item.no}
                                                    </td>

                                                    <td className="border-b p-3 text-sm">
                                                         {item.gi || "-"}
                                                    </td>

                                                    <td className="border-b p-3 text-sm">
                                                            {item.keterangan || "-"}
                                                    </td>

                                                    <td className="border-b p-3 text-sm">
                                                         {item.merek || "-"}
                                                     </td>

                                                    <td className="border-b p-3 text-sm">
                                                          {item.tipe || "-"}
                                                     </td>

                                                     <td className="border-b p-3 text-center">

                                                   <button
                                                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
                                                        > Aksi
                                                 </button>
                                             </td>
                                            </tr>
                                          )
    )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        )

                                    )}


                                    {/* RELE */}

                                    {activeTab ===
                                        "rele" && (

                                        detailLoading ? (

                                            <p className="text-sm text-gray-500">
                                                Memuat detail RELE...
                                            </p>

                                        ) : skemaRele.length ===
                                          0 ? (

                                            <p className="text-sm text-gray-500">
                                                Belum ada detail RELE untuk skema ini.
                                            </p>

                                        ) : (

                                            <div className="overflow-x-auto">

                                                <table className="w-full">

                                                    <thead>

                                                        <tr className="bg-gray-50">

                                                            <th className="border-b p-3 text-left text-xs">
                                                                No
                                                            </th>

                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {skemaRele.map(
                                                            (
                                                                item
                                                            ) => (

                                                                <tr
                                                                    key={
                                                                        item.no
                                                                    }
                                                                >

                                                                    <td className="border-b p-3 text-sm">
                                                                        {
                                                                            item.no
                                                                        }
                                                                    </td>

                                                                </tr>

                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        )

                                    )}


                                    {/* RTAC */}

                                    {activeTab ===
                                        "rtac" && (

                                        detailLoading ? (

                                            <p className="text-sm text-gray-500">
                                                Memuat detail RTAC...
                                            </p>

                                        ) : skemaRTAC.length ===
                                          0 ? (

                                            <p className="text-sm text-gray-500">
                                                Belum ada data RTAC untuk skema ini.
                                            </p>

                                        ) : (

                                            <div className="overflow-x-auto">

                                                <table className="w-full">

                                                    <thead>

                                                        <tr className="bg-gray-50">

                                                            <th className="border-b p-3 text-left text-xs">
                                                                Tag
                                                            </th>

                                                            <th className="border-b p-3 text-left text-xs">
                                                                Gardu Induk
                                                            </th>

                                                            <th className="border-b p-3 text-left text-xs">
                                                                Bay Target
                                                            </th>

                                                            <th className="border-b p-3 text-left text-xs">
                                                                Tahap
                                                            </th>

                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {skemaRTAC.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (

                                                                <tr
                                                                    key={
                                                                        index
                                                                    }
                                                                >

                                                                    <td className="border-b p-3 text-sm">
                                                                        {
                                                                            item.Tag_Name ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                    <td className="border-b p-3 text-sm">
                                                                        {
                                                                            item.Gardu_Induk ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                    <td className="border-b p-3 text-sm">
                                                                        {
                                                                            item.Bay_Target ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                    <td className="border-b p-3 text-sm">
                                                                        {
                                                                            item.Tahap ||
                                                                            "-"
                                                                        }
                                                                    </td>

                                                                </tr>

                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        )

                                    )}

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </div>


            {/* ========================================
                ADD / EDIT MODAL
            ======================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-xl overflow-visible rounded-2xl bg-white p-6 shadow-2xl">

                        {/* HEADER */}

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">

                                    {editingId ===
                                    null
                                        ? "Tambah Skema"
                                        : "Edit Skema"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Masukkan informasi skema.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5"
                        >

                            {/* NAMA SKEMA */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Nama Skema
                                </label>

                                <input
                                    type="text"
                                    value={
                                        namaSkema
                                    }
                                    onChange={(e) =>
                                        setNamaSkema(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: OLS SUTT WONOSARI - PEDAN 1,2"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            {/* SUBSISTEM */}

                            <div className="relative">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Subsistem
                                </label>

                                <input
                                    type="text"
                                    value={
                                        subsistemSearch
                                    }
                                    onChange={(e) =>
                                        handleSubsistemSearch(
                                            e.target.value
                                        )
                                    }
                                    onFocus={() => {

                                        setShowSubsistemDropdown(
                                            true
                                        );

                                        if (
                                            subsistem.length ===
                                            0
                                        ) {
                                            loadSubsistem();
                                        }

                                    }}
                                    placeholder="Cari dan pilih subsistem..."
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />


                                {showSubsistemDropdown && (

                                    <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">

                                        {subsistemLoading ? (

                                            <div className="p-4 text-sm text-gray-500">
                                                Memuat subsistem...
                                            </div>

                                        ) : subsistem.length ===
                                          0 ? (

                                            <div className="p-4 text-sm text-gray-500">
                                                Subsistem tidak ditemukan.
                                            </div>

                                        ) : (

                                            subsistem.map(
                                                (
                                                    item
                                                ) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            item.id_ss
                                                        }
                                                        onClick={() =>
                                                            selectSubsistem(
                                                                item
                                                            )
                                                        }
                                                        className="block w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-blue-50"
                                                    >

                                                        <p className="font-medium text-gray-800">
                                                            {
                                                                item.subsistem
                                                            }
                                                        </p>

                                                    </button>

                                                )
                                            )

                                        )}

                                    </div>

                                )}

                            </div>


                            {/* STATUS */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Status
                                </label>

                                <select
                                    value={
                                        aktif
                                    }
                                    onChange={(e) =>
                                        setAktif(
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
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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


                            {/* BUTTON */}

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : editingId ===
                                          null
                                        ? "Simpan"
                                        : "Simpan Perubahan"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Skema;