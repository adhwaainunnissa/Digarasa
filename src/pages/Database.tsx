import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import {
    Database as DatabaseIcon,
    Search,
    Plus,
    Edit2,
    Trash2,
    Key,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight,
    TableProperties,
    Settings2,
    RefreshCw,
    Zap,
} from "lucide-react";

// ========================================
// TYPES
// ========================================

interface Table {
    table_name: string;
}

interface TableData {
    [key: string]: any;
}

interface ColumnInfo {
    column_name: string;
    data_type: string;
    is_nullable: string;
    column_default: string | null;
    is_identity: string;
    is_primary_key: boolean;
}

interface TableInfo {
    table: {
        table_name: string;
        table_type: string;
    };
    columns: ColumnInfo[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ========================================
// HELPERS
// ========================================

const isAutoIncrementColumn = (column: ColumnInfo) => {
    return (
        column.is_identity === "YES" ||
        Boolean(
            column.column_default &&
            column.column_default.includes("nextval")
        )
    );
};

const getInputType = (dataType: string) => {
    const type = dataType.toLowerCase();

    if (
        type.includes("integer") ||
        type.includes("numeric") ||
        type.includes("double") ||
        type.includes("real") ||
        type.includes("decimal")
    ) {
        return "number";
    }

    if (type.includes("date") || type.includes("timestamp")) {
        return "text";
    }

    if (type.includes("boolean")) {
        return "checkbox";
    }

    return "text";
};

// ========================================
// COMPONENT
// ========================================

export default function Database() {
    // ========================================
    // STATE
    // ========================================

    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
    const [data, setData] = useState<TableData[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState("");

    // ========================================
    // LOADING & UI STATE
    // ========================================

    const [loadingTables, setLoadingTables] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingRow, setEditingRow] = useState<TableData | null>(null);
    const [formData, setFormData] = useState<TableData>({});

    // ========================================
    // USER / ROLE
    // ========================================

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    const isAdmin = user?.role === "admin";

    // ========================================
    // PRIMARY KEY
    // ========================================

    const primaryKey = useMemo(() => {
        if (!tableInfo) return null;

        const pk = tableInfo.columns.find(
            (column) => column.is_primary_key === true
        );

        return pk?.column_name || null;
    }, [tableInfo]);

    // ========================================
    // LOAD ALL TABLES
    // ========================================

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            setLoadingTables(true);

            const response = await api.get("/tables");

            setTables(response.data || []);
        } catch (error) {
            console.error("Gagal mengambil daftar tabel:", error);
        } finally {
            setLoadingTables(false);
        }
    };

    // ========================================
    // LOAD TABLE INFO & DATA
    // ========================================

    const loadTableInfo = async (tableName: string) => {
        const response = await api.get(
            `/tables/${encodeURIComponent(tableName)}/info`
        );

        setTableInfo(response.data);

        return response.data;
    };

    const loadTableData = async (
        tableName: string,
        page = 1,
        searchValue = ""
    ) => {
        if (!tableName) return;

        try {
            setLoadingData(true);

            const response = await api.get(
                `/tables/${encodeURIComponent(tableName)}`,
                {
                    params: {
                        page,
                        limit: 20,
                        search: searchValue,
                    },
                }
            );

            setData(response.data.data || []);
            setPagination(response.data.pagination || null);
        } catch (error) {
            console.error("Gagal mengambil data tabel:", error);

            setData([]);
            setPagination(null);
        } finally {
            setLoadingData(false);
        }
    };

    // ========================================
    // SELECT TABLE
    // ========================================

    const handleSelectTable = async (tableName: string) => {
        setSelectedTable(tableName);
        setSearch("");
        setData([]);
        setPagination(null);
        setTableInfo(null);
        closeModal();

        if (!tableName) return;

        try {
            setLoadingData(true);

            await loadTableInfo(tableName);
            await loadTableData(tableName, 1, "");
        } catch (error) {
            console.error("Gagal memilih tabel:", error);

            setTableInfo(null);
            setData([]);
        } finally {
            setLoadingData(false);
        }
    };

    // ========================================
    // SEARCH & PAGINATION
    // ========================================

    const handleSearch = async () => {
        if (!selectedTable) return;

        await loadTableData(selectedTable, 1, search);
    };

    const handleResetSearch = async () => {
        if (!selectedTable) return;

        setSearch("");

        await loadTableData(selectedTable, 1, "");
    };

    const handlePageChange = async (page: number) => {
        if (!selectedTable || !pagination) return;

        if (page < 1 || page > pagination.totalPages) return;

        await loadTableData(selectedTable, page, search);
    };

    // ========================================
    // MODAL HANDLERS
    // ========================================

    const openAddModal = () => {
        if (!isAdmin) {
            alert("Anda tidak memiliki izin untuk menambah data.");
            return;
        }

        if (!tableInfo) return;

        const initialData: TableData = {};

        tableInfo.columns.forEach((column) => {
            if (isAutoIncrementColumn(column)) return;

            if (getInputType(column.data_type) === "checkbox") {
                initialData[column.column_name] = false;
            } else {
                initialData[column.column_name] = "";
            }
        });

        setEditingRow(null);
        setFormData(initialData);
        setShowModal(true);
    };

    const openEditModal = (row: TableData) => {
        if (!isAdmin) {
            alert("Anda tidak memiliki izin untuk mengedit data.");
            return;
        }

        setEditingRow(row);

        const editData: TableData = {};

        tableInfo?.columns.forEach((column) => {
            editData[column.column_name] =
                row[column.column_name] ?? "";
        });

        setFormData(editData);
        setShowModal(true);
    };

    const handleFormChange = (
        column: ColumnInfo,
        value: any
    ) => {
        setFormData((prev) => ({
            ...prev,
            [column.column_name]: value,
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRow(null);
        setFormData({});
    };

    // ========================================
    // CRUD SUBMIT & DELETE
    // ========================================

    const preparePayload = () => {
        if (!tableInfo) return {};

        const payload: TableData = {};

        tableInfo.columns.forEach((column) => {
            if (!editingRow && isAutoIncrementColumn(column)) {
                return;
            }

            if (editingRow && column.is_primary_key) {
                return;
            }

            let value = formData[column.column_name];

            if (
                value === "" &&
                column.is_nullable === "YES"
            ) {
                value = null;
            }

            payload[column.column_name] = value;
        });

        return payload;
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!isAdmin || !selectedTable) return;

        try {
            setSaving(true);

            const payload = preparePayload();

            if (editingRow) {
                if (!primaryKey) {
                    alert(
                        "Tabel ini tidak memiliki primary key."
                    );
                    return;
                }

                const id = editingRow[primaryKey];

                await api.put(
                    `/tables/${encodeURIComponent(
                        selectedTable
                    )}/${encodeURIComponent(id)}`,
                    payload
                );
            } else {
                await api.post(
                    `/tables/${encodeURIComponent(
                        selectedTable
                    )}`,
                    payload
                );
            }

            closeModal();

            await loadTableData(
                selectedTable,
                pagination?.page || 1,
                search
            );
        } catch (error: any) {
            console.error(
                "Gagal menyimpan data:",
                error
            );

            const message =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Gagal menyimpan data.";

            alert(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (row: TableData) => {
        if (!isAdmin || !selectedTable) return;

        if (!primaryKey) {
            alert(
                "Tabel ini tidak memiliki primary key, sehingga data tidak dapat dihapus melalui interface ini."
            );
            return;
        }

        const id = row[primaryKey];

        if (id === null || id === undefined) {
            alert("Primary key data tidak ditemukan.");
            return;
        }

        if (
            !window.confirm(
                `Yakin ingin menghapus data dengan ${primaryKey} = ${id}?`
            )
        ) {
            return;
        }

        try {
            setDeleting(true);

            await api.delete(
                `/tables/${encodeURIComponent(
                    selectedTable
                )}/${encodeURIComponent(id)}`
            );

            await loadTableData(
                selectedTable,
                pagination?.page || 1,
                search
            );
        } catch (error: any) {
            console.error(
                "Gagal menghapus data:",
                error
            );

            const message =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Gagal menghapus data.";

            alert(message);
        } finally {
            setDeleting(false);
        }
    };

    // ========================================
    // PAGINATION
    // ========================================

    const pageNumbers = useMemo(() => {
        if (!pagination) return [];

        const {
            totalPages,
            page: currentPage,
        } = pagination;

        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, i) => i + 1
            );
        }

        let start = Math.max(
            1,
            currentPage - 3
        );

        let end = Math.min(
            totalPages,
            currentPage + 3
        );

        if (currentPage <= 3) {
            start = 1;
            end = 7;
        }

        if (currentPage >= totalPages - 2) {
            start = totalPages - 6;
            end = totalPages;
        }

        return Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
        );
    }, [pagination]);

    // ========================================
    // RENDER
    // ========================================

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F5F9FF] md:flex-row">

            {/* ========================================
                ANIMATED BACKGROUND
            ======================================== */}

            <style>
                {`
                    @keyframes databasePageEnter {
                        from {
                            opacity: 0;
                            transform: translateY(8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes databaseBlobFloat {
                        0%, 100% {
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                        50% {
                            transform: translate3d(15px, -12px, 0) scale(1.04);
                        }
                    }

                    @keyframes databasePulse {
                        0%, 100% {
                            opacity: .55;
                        }
                        50% {
                            opacity: 1;
                        }
                    }

                    @keyframes databaseShimmer {
                        0% {
                            transform: translateX(-120%);
                        }
                        100% {
                            transform: translateX(120%);
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

            <div
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#00BFFF]/10 blur-3xl"
                style={{
                    animation:
                        "databaseBlobFloat 7s ease-in-out infinite",
                }}
            />

            <div
                className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#0066FF]/10 blur-3xl"
                style={{
                    animation:
                        "databaseBlobFloat 9s ease-in-out infinite reverse",
                }}
            />

            <div
                className="pointer-events-none absolute right-1/3 top-1/3 h-48 w-48 rounded-full bg-[#FFD600]/5 blur-3xl"
                style={{
                    animation:
                        "databaseBlobFloat 11s ease-in-out infinite",
                }}
            />

            {/* ========================================
                SIDEBAR
            ======================================== */}

            <aside className="relative z-10 flex w-full shrink-0 flex-col border-b border-[#0066FF]/15 bg-white/95 shadow-[4px_0_30px_rgba(0,102,255,0.06)] backdrop-blur-xl md:w-72 md:border-b-0 md:border-r">

                {/* Sidebar Header */}

                <div className="relative overflow-hidden border-b border-[#0066FF]/10 px-6 py-5">

                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                    <div className="flex items-center gap-3">

                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#082B5F] text-white shadow-[0_8px_25px_rgba(0,102,255,0.25)]">

                            <DatabaseIcon className="h-5 w-5" />

                            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FFD600]">
                                <Zap className="h-2.5 w-2.5 text-[#082B5F]" />
                            </div>

                        </div>

                        <div className="min-w-0">

                            <h1 className="truncate text-sm font-bold text-[#082B5F]">
                                Database Explorer
                            </h1>

                            <p className="text-xs font-medium text-[#0066FF]/65">
                                PostgreSQL Schemas
                            </p>

                        </div>

                    </div>

                </div>

                {/* Sidebar Table List */}

                <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-blue-100">

                    {loadingTables ? (

                        <div className="flex flex-col items-center justify-center gap-3 p-8 text-xs text-[#0066FF]/60">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F9FF] border border-[#0066FF]/10">

                                <RefreshCw
                                    className="h-4 w-4 animate-spin text-[#0066FF]"
                                />

                            </div>

                            <span className="font-medium">
                                Memuat tabel...
                            </span>

                        </div>

                    ) : tables.length === 0 ? (

                        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F9FF] border border-[#0066FF]/10">
                                <AlertCircle className="h-5 w-5 text-[#0066FF]/40" />
                            </div>

                            <p className="text-xs font-medium text-[#082B5F]/55">
                                Tidak ada tabel.
                            </p>

                        </div>

                    ) : (

                        <ul className="space-y-1">

                            {tables.map((table) => {

                                const isActive =
                                    selectedTable ===
                                    table.table_name;

                                return (

                                    <li
                                        key={
                                            table.table_name
                                        }
                                    >

                                        <button
                                            onClick={() =>
                                                handleSelectTable(
                                                    table.table_name
                                                )
                                            }
                                            className={`group relative flex w-full items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-300 ${
                                                isActive
                                                    ? "border-[#0066FF]/20 bg-gradient-to-r from-[#00BFFF]/10 via-[#0066FF]/8 to-[#FFD600]/10 text-[#082B5F] shadow-[0_6px_20px_rgba(0,102,255,0.10)]"
                                                    : "border-transparent text-[#082B5F]/65 hover:border-[#0066FF]/10 hover:bg-[#F5F9FF] hover:text-[#082B5F]"
                                            }`}
                                        >

                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />
                                            )}

                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                                                    isActive
                                                        ? "bg-[#0066FF] text-white shadow-[0_4px_12px_rgba(0,102,255,0.25)]"
                                                        : "bg-[#F5F9FF] text-[#0066FF]/55 group-hover:bg-blue-50 group-hover:text-[#0066FF]"
                                                }`}
                                            >
                                                <TableProperties className="h-3.5 w-3.5" />
                                            </div>

                                            <span className="truncate font-mono text-[12px] font-medium">
                                                {
                                                    table.table_name
                                                }
                                            </span>

                                        </button>

                                    </li>

                                );
                            })}

                        </ul>

                    )}

                </div>

                {/* Sidebar Footer */}

                <div className="border-t border-[#0066FF]/10 bg-[#F5F9FF]/70 px-4 py-3">

                    <div className="flex items-center justify-between">

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#082B5F]/45">
                            Tables
                        </span>

                        <span className="rounded-full border border-[#0066FF]/10 bg-white px-2 py-0.5 text-[10px] font-bold text-[#0066FF]">
                            {tables.length}
                        </span>

                    </div>

                </div>

            </aside>

            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main
                className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F5F9FF]/70"
                style={{
                    animation:
                        "databasePageEnter .45s ease-out",
                }}
            >

                {!selectedTable ? (

                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">

                        <div className="relative mb-6">

                            <div className="absolute inset-0 rounded-3xl bg-[#00BFFF]/20 blur-2xl" />

                            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-[#0066FF]/15 bg-gradient-to-br from-white via-[#F5F9FF] to-blue-50 shadow-[0_15px_45px_rgba(0,102,255,0.12)]">

                                <DatabaseIcon className="h-9 w-9 text-[#0066FF]" />

                                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#FFD600] shadow-lg">
                                    <Zap className="h-3.5 w-3.5 text-[#082B5F]" />
                                </div>

                            </div>

                        </div>

                        <h2 className="text-xl font-bold tracking-tight text-[#082B5F]">
                            Tidak Ada Tabel Terpilih
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#082B5F]/55">
                            Pilih salah satu tabel pada panel
                            navigasi di sebelah kiri untuk
                            melihat skema dan mengelola
                            datanya.
                        </p>

                        <div className="mt-6 flex items-center gap-2 rounded-full border border-[#0066FF]/10 bg-white px-4 py-2 shadow-sm">

                            <span
                                className="h-2 w-2 rounded-full bg-[#00BFFF]"
                                style={{
                                    animation:
                                        "databasePulse 2s ease-in-out infinite",
                                }}
                            />

                            <span className="text-xs font-semibold text-[#0066FF]">
                                Database Ready
                            </span>

                        </div>

                    </div>

                ) : (

                    <div className="flex h-full flex-1 flex-col overflow-hidden">

                        {/* ========================================
                            HEADER
                        ======================================== */}

                        <div className="relative shrink-0 overflow-hidden border-b border-[#0066FF]/10 bg-gradient-to-r from-[#F5F9FF] via-white to-blue-50/60 px-6 py-5">

                            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0066FF]/10 text-[#0066FF]">
                                            <DatabaseIcon className="h-4.5 w-4.5" />
                                        </div>

                                        <h2 className="truncate font-mono text-lg font-bold text-[#082B5F]">
                                            {selectedTable}
                                        </h2>

                                        <span className="rounded-full border border-[#FFD600]/40 bg-[#FFD600]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8A6A00]">
                                            {tableInfo?.table.table_type ||
                                                "TABLE"}
                                        </span>

                                    </div>

                                    <div className="mt-2 flex items-center gap-2 text-xs text-[#082B5F]/55">

                                        <Key className="h-3.5 w-3.5 text-[#B58900]" />

                                        <span>
                                            Primary Key:
                                        </span>

                                        <strong className="font-mono text-[#082B5F]">
                                            {primaryKey || "None"}
                                        </strong>

                                    </div>

                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                                    {/* Search */}

                                    <div className="relative">

                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0066FF]/45" />

                                        <input
                                            type="text"
                                            placeholder="Search records..."
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
                                            className="w-full min-w-[240px] rounded-xl border border-[#0066FF]/15 bg-white py-2 pl-9 pr-9 text-sm text-[#082B5F] shadow-sm outline-none transition-all placeholder:text-[#082B5F]/35 focus:border-[#0066FF]/50 focus:ring-4 focus:ring-[#0066FF]/10"
                                        />

                                        {search && (

                                            <button
                                                onClick={
                                                    handleResetSearch
                                                }
                                                className="absolute right-2 top-1/2 flex -translate-y-1/2 rounded-md p-1 text-[#082B5F]/35 transition-colors hover:bg-blue-50 hover:text-[#0066FF]"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>

                                        )}

                                    </div>

                                    {/* Add */}

                                    {isAdmin && (

                                        <button
                                            onClick={
                                                openAddModal
                                            }
                                            className="group relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(0,102,255,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,102,255,0.30)] focus:outline-none focus:ring-4 focus:ring-[#0066FF]/20"
                                        >

                                            <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/20 group-hover:left-[130%] transition-all duration-700" />

                                            <Plus className="relative h-4 w-4" />

                                            <span className="relative">
                                                New Record
                                            </span>

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* ========================================
                            CONTENT
                        ======================================== */}

                        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-blue-100 md:p-6">

                            {/* ========================================
                                SCHEMA TABLE
                            ======================================== */}

                            {tableInfo && (

                                <div className="mb-7 overflow-hidden rounded-2xl border border-[#0066FF]/12 bg-white shadow-[0_8px_30px_rgba(0,102,255,0.06)]">

                                    <div className="relative overflow-hidden border-b border-[#0066FF]/10 bg-gradient-to-r from-[#F5F9FF] to-white px-5 py-3.5">

                                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                                        <div className="flex items-center gap-2.5">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066FF]/10 text-[#0066FF]">
                                                <Settings2 className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-[#082B5F]">
                                                    Schema Definition
                                                </h3>

                                                <p className="text-[10px] font-medium text-[#082B5F]/45">
                                                    Struktur dan konfigurasi kolom tabel
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="overflow-x-auto">

                                        <table className="w-full text-left text-xs">

                                            <thead className="bg-[#F5F9FF] text-[#082B5F]/55">

                                                <tr>

                                                    <th className="border-b border-[#0066FF]/10 px-4 py-3 font-semibold">
                                                        Column Name
                                                    </th>

                                                    <th className="border-b border-[#0066FF]/10 px-4 py-3 font-semibold">
                                                        Data Type
                                                    </th>

                                                    <th className="border-b border-[#0066FF]/10 px-4 py-3 text-center font-semibold">
                                                        PK
                                                    </th>

                                                    <th className="border-b border-[#0066FF]/10 px-4 py-3 text-center font-semibold">
                                                        Nullable
                                                    </th>

                                                    <th className="border-b border-[#0066FF]/10 px-4 py-3 font-semibold">
                                                        Default Value
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody className="divide-y divide-[#0066FF]/5">

                                                {tableInfo.columns.map(
                                                    (col) => (

                                                        <tr
                                                            key={
                                                                col.column_name
                                                            }
                                                            className="group transition-colors hover:bg-[#F5F9FF]/70"
                                                        >

                                                            <td className="px-4 py-3 font-mono text-[13px] font-semibold text-[#082B5F]">
                                                                {
                                                                    col.column_name
                                                                }
                                                            </td>

                                                            <td className="px-4 py-3 font-mono text-[12px] font-medium text-[#0066FF]">
                                                                {
                                                                    col.data_type
                                                                }
                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                {col.is_primary_key ? (

                                                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFD600]/15">
                                                                        <Key className="h-3.5 w-3.5 text-[#B58900]" />
                                                                    </span>

                                                                ) : (

                                                                    <span className="text-[#082B5F]/15">
                                                                        -
                                                                    </span>

                                                                )}

                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                <span
                                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                                                                        col.is_nullable ===
                                                                        "YES"
                                                                            ? "border-[#0066FF]/15 bg-[#00BFFF]/8 text-[#0066FF]"
                                                                            : "border-[#082B5F]/10 bg-[#082B5F]/5 text-[#082B5F]/60"
                                                                    }`}
                                                                >
                                                                    {
                                                                        col.is_nullable
                                                                    }
                                                                </span>

                                                            </td>

                                                            <td className="px-4 py-3 font-mono text-[12px] text-[#082B5F]/55">

                                                                {col.column_default ? (
                                                                    col.column_default
                                                                ) : (
                                                                    <span className="italic text-[#082B5F]/20">
                                                                        null
                                                                    </span>
                                                                )}

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            )}

                            {/* ========================================
                                DATA TABLE
                            ======================================== */}

                            <div className="overflow-hidden rounded-2xl border border-[#0066FF]/12 bg-white shadow-[0_8px_30px_rgba(0,102,255,0.06)]">

                                {loadingData ? (

                                    <div className="flex flex-col items-center justify-center space-y-3 py-20">

                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F9FF] border border-[#0066FF]/10">

                                            <RefreshCw className="h-5 w-5 animate-spin text-[#0066FF]" />

                                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#FFD600]" />

                                        </div>

                                        <span className="text-sm font-semibold text-[#082B5F]/55">
                                            Loading data...
                                        </span>

                                    </div>

                                ) : data.length === 0 ? (

                                    <div className="flex flex-col items-center justify-center space-y-3 py-20 text-center">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0066FF]/10 bg-[#F5F9FF]">
                                            <AlertCircle className="h-7 w-7 text-[#0066FF]/35" />
                                        </div>

                                        <div>
                                            <span className="block text-sm font-bold text-[#082B5F]">
                                                No records found.
                                            </span>

                                            <span className="mt-1 block text-xs text-[#082B5F]/45">
                                                Belum ada data pada tabel ini.
                                            </span>
                                        </div>

                                    </div>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full whitespace-nowrap text-left text-sm">

                                            <thead className="bg-gradient-to-r from-[#F5F9FF] to-blue-50/60 text-xs font-semibold uppercase tracking-wider text-[#082B5F]/60">

                                                <tr>

                                                    {Object.keys(
                                                        data[0]
                                                    ).map(
                                                        (col) => (

                                                            <th
                                                                key={col}
                                                                className="border-b border-[#0066FF]/10 px-4 py-3.5 font-mono"
                                                            >
                                                                {
                                                                    col
                                                                }
                                                            </th>

                                                        )
                                                    )}

                                                    {isAdmin && (

                                                        <th className="sticky right-0 border-b border-l border-[#0066FF]/10 bg-[#F5F9FF] px-4 py-3.5 text-right">
                                                            Actions
                                                        </th>

                                                    )}

                                                </tr>

                                            </thead>

                                            <tbody className="divide-y divide-[#0066FF]/5 text-[#082B5F]/70">

                                                {data.map(
                                                    (
                                                        row,
                                                        idx
                                                    ) => (

                                                        <tr
                                                            key={idx}
                                                            className="group transition-all duration-200 hover:bg-[#F5F9FF]/70"
                                                        >

                                                            {Object.keys(
                                                                data[0]
                                                            ).map(
                                                                (
                                                                    col
                                                                ) => (

                                                                    <td
                                                                        key={
                                                                            col
                                                                        }
                                                                        className="px-4 py-3 font-mono text-[13px]"
                                                                    >

                                                                        {row[
                                                                            col
                                                                        ] !==
                                                                            null &&
                                                                        row[
                                                                            col
                                                                        ] !==
                                                                            undefined ? (
                                                                            String(
                                                                                row[
                                                                                    col
                                                                                ]
                                                                            )
                                                                        ) : (
                                                                            <span className="italic text-[#082B5F]/20">
                                                                                null
                                                                            </span>
                                                                        )}

                                                                    </td>

                                                                )
                                                            )}

                                                            {isAdmin && (

                                                                <td className="sticky right-0 border-l border-[#0066FF]/10 bg-white px-4 py-3 text-right transition-colors group-hover:bg-[#F5F9FF]">

                                                                    <div className="flex justify-end gap-1.5">

                                                                        <button
                                                                            onClick={() =>
                                                                                openEditModal(
                                                                                    row
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                deleting
                                                                            }
                                                                            className="rounded-lg border border-transparent p-2 text-[#0066FF]/45 transition-all hover:border-[#0066FF]/10 hover:bg-[#0066FF]/10 hover:text-[#0066FF] disabled:opacity-50"
                                                                            title="Edit"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    row
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                deleting
                                                                            }
                                                                            className="rounded-lg border border-transparent p-2 text-[#082B5F]/30 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
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

                            {/* ========================================
                                PAGINATION
                            ======================================== */}

                            {pagination &&
                                data.length > 0 && (

                                    <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">

                                        <p className="text-xs text-[#082B5F]/50">

                                            Showing{" "}

                                            <span className="font-bold text-[#0066FF]">
                                                {
                                                    data.length
                                                }
                                            </span>{" "}

                                            of{" "}

                                            <span className="font-bold text-[#082B5F]">
                                                {
                                                    pagination.total
                                                }
                                            </span>{" "}

                                            records

                                        </p>

                                        <div className="flex items-center gap-1">

                                            <button
                                                disabled={
                                                    pagination.page <=
                                                    1
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.page -
                                                            1
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0066FF]/10 bg-white text-[#0066FF]/60 shadow-sm transition-all hover:border-[#0066FF]/20 hover:bg-[#F5F9FF] hover:text-[#0066FF] disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

                                            {pageNumbers.map(
                                                (num) => (

                                                    <button
                                                        key={
                                                            num
                                                        }
                                                        onClick={() =>
                                                            handlePageChange(
                                                                num
                                                            )
                                                        }
                                                        className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-xs font-bold transition-all ${
                                                            pagination.page ===
                                                            num
                                                                ? "border-[#0066FF] bg-[#0066FF] text-white shadow-[0_4px_12px_rgba(0,102,255,0.22)]"
                                                                : "border-[#0066FF]/10 bg-white text-[#082B5F]/55 hover:border-[#0066FF]/20 hover:bg-[#F5F9FF] hover:text-[#0066FF]"
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
                                                    handlePageChange(
                                                        pagination.page +
                                                            1
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0066FF]/10 bg-white text-[#0066FF]/60 shadow-sm transition-all hover:border-[#0066FF]/20 hover:bg-[#F5F9FF] hover:text-[#0066FF] disabled:pointer-events-none disabled:opacity-30"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>

                                        </div>

                                    </div>

                                )}

                        </div>

                    </div>

                )}

            </main>

            {/* ========================================
                MODAL ADD / EDIT
            ======================================== */}

            {showModal && tableInfo && (

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">

                    {/* Overlay */}

                    <div
                        className="absolute inset-0 bg-[#082B5F]/65 backdrop-blur-md"
                        onClick={closeModal}
                    />

                    {/* Modal */}

                    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#0066FF]/15 bg-white shadow-[0_25px_80px_rgba(8,43,95,0.25)]">

                        {/* Top Accent */}

                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                        {/* ========================================
                            MODAL HEADER
                        ======================================== */}

                        <div className="flex items-center justify-between border-b border-[#0066FF]/10 bg-gradient-to-r from-[#F5F9FF] to-white px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                                    {editingRow ? (
                                        <Edit2 className="h-5 w-5" />
                                    ) : (
                                        <Plus className="h-5 w-5" />
                                    )}
                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-[#082B5F]">
                                        {editingRow
                                            ? "Edit Record"
                                            : "New Record"}
                                    </h3>

                                    <p className="text-xs font-medium text-[#082B5F]/50">

                                        Table:{" "}

                                        <span className="font-mono font-semibold text-[#0066FF]">
                                            {
                                                selectedTable
                                            }
                                        </span>

                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-xl border border-transparent p-2 text-[#082B5F]/35 transition-all hover:border-[#0066FF]/10 hover:bg-[#F5F9FF] hover:text-[#0066FF]"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* ========================================
                            MODAL BODY
                        ======================================== */}

                        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-blue-100">

                            <form
                                id="record-form"
                                onSubmit={
                                    handleSubmit
                                }
                                className="space-y-5"
                            >

                                {tableInfo.columns.map(
                                    (col) => {

                                        const isAutoInc =
                                            isAutoIncrementColumn(
                                                col
                                            );

                                        const isPk =
                                            col.is_primary_key;

                                        const inputType =
                                            getInputType(
                                                col.data_type
                                            );

                                        // Hidden INSERT auto increment

                                        if (
                                            !editingRow &&
                                            isAutoInc
                                        ) {
                                            return null;
                                        }

                                        const isDisabled =
                                            Boolean(
                                                editingRow &&
                                                    isPk
                                            );

                                        return (

                                            <div
                                                key={
                                                    col.column_name
                                                }
                                                className="group rounded-xl border border-[#0066FF]/8 bg-[#F5F9FF]/35 p-4 transition-all focus-within:border-[#0066FF]/20 focus-within:bg-white focus-within:shadow-[0_5px_20px_rgba(0,102,255,0.05)]"
                                            >

                                                <div className="mb-2.5 flex items-center justify-between">

                                                    <label className="flex items-center gap-2 text-sm font-bold text-[#082B5F]">

                                                        <span className="font-mono">
                                                            {
                                                                col.column_name
                                                            }
                                                        </span>

                                                        {isPk && (
                                                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFD600]/15">
                                                                <Key className="h-3 w-3 text-[#B58900]" />
                                                            </span>
                                                        )}

                                                        {col.is_nullable ===
                                                            "NO" &&
                                                            !isPk &&
                                                            !isAutoInc && (

                                                                <span className="text-xs font-bold text-red-500">
                                                                    *
                                                                </span>

                                                            )}

                                                    </label>

                                                    {isAutoInc && (

                                                        <span className="rounded-full border border-[#0066FF]/10 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#0066FF]/50">
                                                            System Generated
                                                        </span>

                                                    )}

                                                </div>

                                                {/* Checkbox */}

                                                {inputType ===
                                                "checkbox" ? (

                                                    <div className="flex items-center gap-3 rounded-lg border border-[#0066FF]/10 bg-white px-3 py-2.5">

                                                        <input
                                                            type="checkbox"
                                                            checked={Boolean(
                                                                formData[
                                                                    col.column_name
                                                                ]
                                                            )}
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleFormChange(
                                                                    col,
                                                                    e
                                                                        .target
                                                                        .checked
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-[#0066FF]/30 text-[#0066FF] accent-[#0066FF] focus:ring-[#0066FF] disabled:opacity-50"
                                                        />

                                                        <span className="text-sm font-mono font-medium text-[#082B5F]/65">
                                                            {formData[
                                                                col
                                                                    .column_name
                                                            ]
                                                                ? "true"
                                                                : "false"}
                                                        </span>

                                                    </div>

                                                ) : col.data_type
                                                      .toLowerCase()
                                                      .includes(
                                                          "text"
                                                      ) ? (

                                                    <textarea
                                                        value={
                                                            formData[
                                                                col
                                                                    .column_name
                                                            ] ?? ""
                                                        }
                                                        disabled={
                                                            isDisabled
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleFormChange(
                                                                col,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        rows={3}
                                                        className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10 disabled:cursor-not-allowed disabled:bg-[#F5F9FF] disabled:text-[#082B5F]/35"
                                                        placeholder={
                                                            col.is_nullable ===
                                                            "YES"
                                                                ? "null"
                                                                : ""
                                                        }
                                                    />

                                                ) : (

                                                    <input
                                                        type={
                                                            inputType
                                                        }
                                                        value={
                                                            formData[
                                                                col
                                                                    .column_name
                                                            ] ?? ""
                                                        }
                                                        disabled={
                                                            isDisabled
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleFormChange(
                                                                col,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-[#0066FF]/12 bg-white px-3 py-2.5 text-sm font-mono text-[#082B5F] outline-none transition-all placeholder:text-[#082B5F]/25 focus:border-[#0066FF]/45 focus:ring-4 focus:ring-[#0066FF]/10 disabled:cursor-not-allowed disabled:bg-[#F5F9FF] disabled:text-[#082B5F]/35"
                                                        placeholder={
                                                            col.is_nullable ===
                                                            "YES"
                                                                ? "null"
                                                                : ""
                                                        }
                                                    />

                                                )}

                                            </div>

                                        );
                                    }
                                )}

                            </form>

                        </div>

                        {/* ========================================
                            MODAL FOOTER
                        ======================================== */}

                        <div className="flex items-center justify-end gap-3 border-t border-[#0066FF]/10 bg-[#F5F9FF]/60 px-6 py-4">

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-xl border border-[#0066FF]/10 bg-white px-4 py-2 text-sm font-semibold text-[#082B5F]/60 transition-all hover:border-[#0066FF]/20 hover:bg-[#F5F9FF] hover:text-[#082B5F] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="record-form"
                                disabled={saving}
                                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,102,255,0.30)] disabled:opacity-50"
                            >

                                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/20 group-hover:left-[130%] transition-all duration-700" />

                                {saving ? (

                                    <>
                                        <RefreshCw className="relative h-4 w-4 animate-spin" />

                                        <span className="relative">
                                            Saving...
                                        </span>
                                    </>

                                ) : (

                                    <>

                                        <span className="relative">
                                            {editingRow
                                                ? "Save Changes"
                                                : "Create Record"}
                                        </span>

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}