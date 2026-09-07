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
    RefreshCw
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
        Boolean(column.column_default && column.column_default.includes("nextval"))
    );
};

const getInputType = (dataType: string) => {
    const type = dataType.toLowerCase();
    if (type.includes("integer") || type.includes("numeric") || type.includes("double") || type.includes("real") || type.includes("decimal")) return "number";
    if (type.includes("date") || type.includes("timestamp")) return "text";
    if (type.includes("boolean")) return "checkbox";
    return "text";
};

export default function Database() {
    // STATE
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
    const [data, setData] = useState<TableData[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState("");
    
    // LOADING & UI STATE
    const [loadingTables, setLoadingTables] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRow, setEditingRow] = useState<TableData | null>(null);
    const [formData, setFormData] = useState<TableData>({});

    // USER / ROLE
    const user = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); } 
        catch { return null; }
    }, []);
    const isAdmin = user?.role === "admin";

    // PRIMARY KEY
    const primaryKey = useMemo(() => {
        if (!tableInfo) return null;
        const pk = tableInfo.columns.find((column) => column.is_primary_key === true);
        return pk?.column_name || null;
    }, [tableInfo]);

    // LOAD ALL TABLES
    useEffect(() => { loadTables(); }, []);

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

    // LOAD TABLE INFO & DATA
    const loadTableInfo = async (tableName: string) => {
        const response = await api.get(`/tables/${encodeURIComponent(tableName)}/info`);
        setTableInfo(response.data);
        return response.data;
    };

    const loadTableData = async (tableName: string, page = 1, searchValue = "") => {
        if (!tableName) return;
        try {
            setLoadingData(true);
            const response = await api.get(`/tables/${encodeURIComponent(tableName)}`, {
                params: { page, limit: 20, search: searchValue },
            });
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

    // SELECT TABLE
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

    // SEARCH & PAGINATION
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

    // MODAL HANDLERS
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
            editData[column.column_name] = row[column.column_name] ?? "";
        });
        setFormData(editData);
        setShowModal(true);
    };

    const handleFormChange = (column: ColumnInfo, value: any) => {
        setFormData((prev) => ({ ...prev, [column.column_name]: value }));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRow(null);
        setFormData({});
    };

    // CRUD SUBMIT & DELETE
    const preparePayload = () => {
        if (!tableInfo) return {};
        const payload: TableData = {};
        tableInfo.columns.forEach((column) => {
            if (!editingRow && isAutoIncrementColumn(column)) return;
            if (editingRow && column.is_primary_key) return;
            let value = formData[column.column_name];
            if (value === "" && column.is_nullable === "YES") value = null;
            payload[column.column_name] = value;
        });
        return payload;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isAdmin || !selectedTable) return;

        try {
            setSaving(true);
            const payload = preparePayload();

            if (editingRow) {
                if (!primaryKey) {
                    alert("Tabel ini tidak memiliki primary key.");
                    return;
                }
                const id = editingRow[primaryKey];
                await api.put(`/tables/${encodeURIComponent(selectedTable)}/${encodeURIComponent(id)}`, payload);
            } else {
                await api.post(`/tables/${encodeURIComponent(selectedTable)}`, payload);
            }
            closeModal();
            await loadTableData(selectedTable, pagination?.page || 1, search);
        } catch (error: any) {
            console.error("Gagal menyimpan data:", error);
            const message = error?.response?.data?.error || error?.response?.data?.message || "Gagal menyimpan data.";
            alert(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (row: TableData) => {
        if (!isAdmin || !selectedTable) return;
        if (!primaryKey) {
            alert("Tabel ini tidak memiliki primary key, sehingga data tidak dapat dihapus melalui interface ini.");
            return;
        }
        
        const id = row[primaryKey];
        if (id === null || id === undefined) {
            alert("Primary key data tidak ditemukan.");
            return;
        }
        if (!window.confirm(`Yakin ingin menghapus data dengan ${primaryKey} = ${id}?`)) return;

        try {
            setDeleting(true);
            await api.delete(`/tables/${encodeURIComponent(selectedTable)}/${encodeURIComponent(id)}`);
            await loadTableData(selectedTable, pagination?.page || 1, search);
        } catch (error: any) {
            console.error("Gagal menghapus data:", error);
            const message = error?.response?.data?.error || error?.response?.data?.message || "Gagal menghapus data.";
            alert(message);
        } finally {
            setDeleting(false);
        }
    };

    // PAGINATION CALCULATION
    const pageNumbers = useMemo(() => {
        if (!pagination) return [];
        const { totalPages, page: currentPage } = pagination;
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, currentPage + 3);
        if (currentPage <= 3) { start = 1; end = 7; }
        if (currentPage >= totalPages - 2) { start = totalPages - 6; end = totalPages; }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [pagination]);

    // RENDER
    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50 md:flex-row overflow-hidden">
            
            {/* =================================
                SIDEBAR TABLE NAV
            ================================= */}
            <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:w-72 md:border-b-0 md:border-r shrink-0">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <DatabaseIcon className="h-4 w-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900">Database Explorer</h1>
                        <p className="text-xs font-medium text-slate-500">PostgreSQL Schemas</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-200">
                    {loadingTables ? (
                        <div className="flex items-center gap-2 p-3 text-xs text-slate-500">
                            <RefreshCw className="h-3 w-3 animate-spin" /> Memuat tabel...
                        </div>
                    ) : tables.length === 0 ? (
                        <p className="p-3 text-xs text-slate-500">Tidak ada tabel.</p>
                    ) : (
                        <ul className="space-y-0.5">
                            {tables.map((table) => {
                                const isActive = selectedTable === table.table_name;
                                return (
                                    <li key={table.table_name}>
                                        <button
                                            onClick={() => handleSelectTable(table.table_name)}
                                            className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-all duration-200 ${
                                                isActive
                                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-inset ring-blue-500/20"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                        >
                                            <TableProperties className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                            <span className="truncate font-mono text-[13px]">{table.table_name}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </aside>

            {/* =================================
                MAIN CONTENT
            ================================= */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50/50 relative">
                {!selectedTable ? (
                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 shadow-inner">
                            <DatabaseIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Tidak Ada Tabel Terpilih</h2>
                        <p className="mt-1 max-w-sm text-sm text-slate-500">Pilih salah satu tabel pada panel navigasi di sebelah kiri untuk melihat skema dan mengelola datanya.</p>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden h-full">
                        
                        {/* HEADER & ACTIONS */}
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-mono text-lg font-bold text-slate-900">{selectedTable}</h2>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 border border-slate-200">
                                        {tableInfo?.table.table_type || "TABLE"}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Key className="h-3.5 w-3.5 text-amber-500" />
                                    <span>Primary Key: <strong className="font-mono text-slate-700">{primaryKey || "None"}</strong></span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search records..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                                        className="w-full min-w-[240px] rounded-md border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    {search && (
                                        <button onClick={handleResetSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                                
                                {isAdmin && (
                                    <button
                                        onClick={openAddModal}
                                        className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    >
                                        <Plus className="h-4 w-4" /> New Record
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* CONTENT AREA (SCROLLABLE) */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                            
                            {/* SCHEMA TABLE */}
                            {tableInfo && (
                                <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                                        <Settings2 className="h-4 w-4 text-slate-500" />
                                        <h3 className="text-sm font-semibold text-slate-800">Schema Definition</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50/50 text-slate-500">
                                                <tr>
                                                    <th className="border-b border-slate-100 px-4 py-2 font-medium">Column Name</th>
                                                    <th className="border-b border-slate-100 px-4 py-2 font-medium">Data Type</th>
                                                    <th className="border-b border-slate-100 px-4 py-2 font-medium text-center">PK</th>
                                                    <th className="border-b border-slate-100 px-4 py-2 font-medium text-center">Nullable</th>
                                                    <th className="border-b border-slate-100 px-4 py-2 font-medium">Default Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {tableInfo.columns.map((col) => (
                                                    <tr key={col.column_name} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-2 font-mono text-[13px] font-medium text-slate-900">{col.column_name}</td>
                                                        <td className="px-4 py-2 font-mono text-[12px] text-blue-600">{col.data_type}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            {col.is_primary_key ? <Key className="inline-block h-3.5 w-3.5 text-amber-500" /> : <span className="text-slate-300">-</span>}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${col.is_nullable === 'YES' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                                {col.is_nullable}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 font-mono text-[12px] text-slate-500">{col.column_default || <span className="text-slate-300 italic">null</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* DATA TABLE */}
                            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                {loadingData ? (
                                    <div className="flex flex-col items-center justify-center space-y-3 py-16 text-slate-400">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="text-sm font-medium">Loading data...</span>
                                    </div>
                                ) : data.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center space-y-2 py-16 text-slate-500">
                                        <AlertCircle className="h-8 w-8 text-slate-300" />
                                        <span className="text-sm font-medium">No records found.</span>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                <tr>
                                                    {Object.keys(data[0]).map((col) => (
                                                        <th key={col} className="border-b border-slate-200 px-4 py-3 font-mono">{col}</th>
                                                    ))}
                                                    {isAdmin && <th className="border-b border-slate-200 px-4 py-3 text-right sticky right-0 bg-slate-50 border-l border-slate-100">Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                                {data.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                        {Object.keys(data[0]).map((col) => (
                                                            <td key={col} className="px-4 py-2.5 font-mono text-[13px]">
                                                                {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-300 italic">null</span>}
                                                            </td>
                                                        ))}
                                                        {isAdmin && (
                                                            <td className="px-4 py-2.5 text-right sticky right-0 bg-white border-l border-slate-100 group-hover:bg-slate-50/80 transition-colors">
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        onClick={() => openEditModal(row)}
                                                                        disabled={deleting}
                                                                        className="rounded p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(row)}
                                                                        disabled={deleting}
                                                                        className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
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

                            {/* PAGINATION */}
                            {pagination && data.length > 0 && (
                                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                    <p className="text-xs text-slate-500">
                                        Showing <span className="font-medium text-slate-900">{data.length}</span> of <span className="font-medium text-slate-900">{pagination.total}</span> records
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={pagination.page <= 1}
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        
                                        {pageNumbers.map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => handlePageChange(num)}
                                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors ${
                                                    pagination.page === num
                                                        ? "border-blue-600 bg-blue-600 text-white"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        ))}

                                        <button
                                            disabled={pagination.page >= pagination.totalPages}
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50"
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

            {/* =================================
                MODAL (ADD / EDIT)
            ================================= */}
            {showModal && tableInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
                    
                    <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {editingRow ? "Edit Record" : "New Record"}
                                </h3>
                                <p className="text-xs font-medium text-slate-500">Table: <span className="font-mono text-slate-700">{selectedTable}</span></p>
                            </div>
                            <button type="button" onClick={closeModal} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-slate-200">
                            <form id="record-form" onSubmit={handleSubmit} className="space-y-5">
                                {tableInfo.columns.map((col) => {
                                    const isAutoInc = isAutoIncrementColumn(col);
                                    const isPk = col.is_primary_key;
                                    const inputType = getInputType(col.data_type);
                                    
                                    // Hidden on INSERT if it's auto-increment
                                    if (!editingRow && isAutoInc) return null;
                                    
                                    // Disabled on EDIT if it's the primary key
                                    const isDisabled = Boolean(editingRow && isPk);

                                    return (
                                        <div key={col.column_name} className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                                    <span className="font-mono">{col.column_name}</span>
                                                    {isPk && <Key className="h-3 w-3 text-amber-500" />}
                                                    {col.is_nullable === "NO" && !isPk && !isAutoInc && <span className="text-red-500 text-xs">*</span>}
                                                </label>
                                                {isAutoInc && <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">System Generated</span>}
                                            </div>
                                            
                                            {inputType === "checkbox" ? (
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(formData[col.column_name])}
                                                        disabled={isDisabled}
                                                        onChange={(e) => handleFormChange(col, e.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                                    />
                                                    <span className="text-sm text-slate-600 font-mono">
                                                        {formData[col.column_name] ? "true" : "false"}
                                                    </span>
                                                </div>
                                            ) : col.data_type.toLowerCase().includes("text") ? (
                                                <textarea
                                                    value={formData[col.column_name] ?? ""}
                                                    disabled={isDisabled}
                                                    onChange={(e) => handleFormChange(col, e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                                                    placeholder={col.is_nullable === "YES" ? "null" : ""}
                                                />
                                            ) : (
                                                <input
                                                    type={inputType}
                                                    value={formData[col.column_name] ?? ""}
                                                    disabled={isDisabled}
                                                    onChange={(e) => handleFormChange(col, e.target.value)}
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                                                    placeholder={col.is_nullable === "YES" ? "null" : ""}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="record-form"
                                disabled={saving}
                                className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 transition-colors"
                            >
                                {saving ? (
                                    <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    <>{editingRow ? "Save Changes" : "Create Record"}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}