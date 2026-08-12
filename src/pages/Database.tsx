import { useEffect, useState } from "react";
import api from "../api/axios";

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

function Database() {
const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

const isAdmin = user?.role === "admin";
    // ========================================
    // STATE
    // ========================================

    const [tables, setTables] = useState<Table[]>([]);

    const [selectedTable, setSelectedTable] =
        useState("");

    const [data, setData] =
        useState<TableData[]>([]);

    const [pagination, setPagination] =
        useState<Pagination | null>(null);

    const [tableInfo, setTableInfo] =
        useState<TableInfo | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingRow, setEditingRow] =
        useState<TableData | null>(null);

    const [formData, setFormData] =
        useState<TableData>({});

    const [saving, setSaving] =
        useState(false);


    // ========================================
    // GET SEMUA TABEL
    // ========================================

    const getTables = async () => {

        try {

            const response =
                await api.get("/tables");

            setTables(response.data);

        } catch (error) {

            console.error(
                "Gagal mengambil tabel:",
                error
            );

            alert(
                "Gagal mengambil daftar tabel."
            );
        }
    };


    // ========================================
    // GET TABLE INFO
    // ========================================

    const getTableInfo = async (
        table: string
    ) => {

        try {

            const response =
                await api.get(
                    `/tables/${encodeURIComponent(table)}/info`
                );

            setTableInfo(response.data);

        } catch (error) {

            console.error(
                "Gagal mengambil informasi tabel:",
                error
            );

            setTableInfo(null);

            alert(
                "Gagal mengambil informasi tabel."
            );
        }
    };


    // ========================================
    // GET DATA TABEL
    // ========================================

    const getTableData = async (
        table: string,
        page = 1,
        searchValue = search
    ) => {

        if (!table) return;

        try {

            setLoading(true);

            const response =
                await api.get(
                    `/tables/${encodeURIComponent(table)}`,
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
                "Gagal mengambil data:",
                error
            );

            setData([]);
            setPagination(null);

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // LOAD TABLES
    // ========================================

    useEffect(() => {

        getTables();

    }, []);


    // ========================================
    // PILIH TABEL
    // ========================================

    const handleSelectTable = async (
        table: string
    ) => {

        setSelectedTable(table);

        setSearch("");

        setData([]);

        setPagination(null);

        setTableInfo(null);

        setShowForm(false);

        setEditingRow(null);

        setFormData({});

        if (!table) return;

        await getTableInfo(table);

        await getTableData(
            table,
            1,
            ""
        );
    };


    // ========================================
    // SEARCH
    // ========================================

    const handleSearch = () => {

        if (!selectedTable) return;

        getTableData(
            selectedTable,
            1,
            search
        );
    };


    // ========================================
    // ENTER UNTUK SEARCH
    // ========================================

    const handleSearchKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        if (e.key === "Enter") {
            handleSearch();
        }
    };


    // ========================================
    // GET PRIMARY KEY
    // ========================================

    const getPrimaryKey = () => {

        if (!tableInfo) {
            return null;
        }

        const primaryKey =
            tableInfo.columns.find(
                (column) =>
                    column.is_primary_key === true
            );

        return primaryKey?.column_name || null;
    };


    // ========================================
    // BUKA FORM TAMBAH
    // ========================================

    const handleAdd = () => {

        if (!tableInfo) {
            alert(
                "Informasi tabel belum tersedia."
            );

            return;
        }

        setEditingRow(null);

        setFormData({});

        setShowForm(true);
    };


    // ========================================
    // BUKA FORM EDIT
    // ========================================

    const handleEdit = (
        row: TableData
    ) => {

        setEditingRow(row);

        setFormData({
            ...row,
        });

        setShowForm(true);
    };


    // ========================================
    // HANDLE INPUT FORM
    // ========================================

    const handleFormChange = (
        column: string,
        value: string
    ) => {

        setFormData((prev) => ({
            ...prev,
            [column]: value,
        }));
    };


    // ========================================
    // SUBMIT FORM
    // ========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!selectedTable) {
            alert(
                "Silakan pilih tabel terlebih dahulu."
            );

            return;
        }

        if (!tableInfo) {
            alert(
                "Informasi tabel belum tersedia."
            );

            return;
        }

        try {

            setSaving(true);

            // ====================================
            // UPDATE
            // ====================================

            if (editingRow) {

                const primaryKey =
                    getPrimaryKey();

                if (!primaryKey) {

                    alert(
                        "Tabel ini tidak memiliki primary key."
                    );

                    return;
                }

                const id =
                    editingRow[primaryKey];

                await api.put(
                    `/tables/${encodeURIComponent(
                        selectedTable
                    )}/${encodeURIComponent(id)}`,
                    formData
                );

                alert(
                    "Data berhasil diperbarui."
                );

            }

            // ====================================
            // INSERT
            // ====================================

            else {

                await api.post(
                    `/tables/${encodeURIComponent(
                        selectedTable
                    )}`,
                    formData
                );

                alert(
                    "Data berhasil ditambahkan."
                );
            }

            // ====================================
            // RESET
            // ====================================

            setShowForm(false);

            setEditingRow(null);

            setFormData({});

            await getTableData(
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
                "Gagal menyimpan data.";

            alert(message);

        } finally {

            setSaving(false);

        }
    };


    // ========================================
    // DELETE DATA
    // ========================================

    const handleDelete = async (
        row: TableData
    ) => {

        if (!selectedTable) return;

        const primaryKey =
            getPrimaryKey();

        if (!primaryKey) {

            alert(
                "Tabel ini tidak memiliki primary key."
            );

            return;
        }

        const id =
            row[primaryKey];

        if (
            id === undefined ||
            id === null
        ) {

            alert(
                "Primary key data tidak ditemukan."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Yakin ingin menghapus data dengan ${primaryKey} = ${id}?`
            );

        if (!confirmed) return;

        try {

            setLoading(true);

            await api.delete(
                `/tables/${encodeURIComponent(
                    selectedTable
                )}/${encodeURIComponent(id)}`
            );

            alert(
                "Data berhasil dihapus."
            );

            await getTableData(
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
                "Gagal menghapus data.";

            alert(message);

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // TUTUP FORM
    // ========================================

    const handleCancelForm = () => {

        setShowForm(false);

        setEditingRow(null);

        setFormData({});
    };


    // ========================================
    // RENDER
    // ========================================

    return (

        <div
            style={{
                padding: "24px",
            }}
        >

            <h1>
                Database
            </h1>


            {/* ================================== */}
            {/* PILIH TABEL */}
            {/* ================================== */}

            <div
                style={{
                    marginBottom: "20px",
                }}
            >

                <h3>
                    Daftar Tabel
                </h3>

                <select
                    value={selectedTable}
                    onChange={(e) =>
                        handleSelectTable(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "8px",
                        minWidth: "250px",
                    }}
                >

                    <option value="">
                        -- Pilih Tabel --
                    </option>

                    {tables.map(
                        (table) => (

                            <option
                                key={
                                    table.table_name
                                }
                                value={
                                    table.table_name
                                }
                            >
                                {
                                    table.table_name
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================== */}
            {/* INFO TABEL */}
            {/* ================================== */}

            {selectedTable &&
                tableInfo && (

                    <div
                        style={{
                            marginBottom:
                                "20px",
                            padding: "15px",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "8px",
                        }}
                    >

                        <h3>
                            Informasi Tabel
                        </h3>

                        <p>
                            <strong>
                                Nama:
                            </strong>{" "}
                            {
                                tableInfo.table
                                    .table_name
                            }
                        </p>

                        <p>
                            <strong>
                                Tipe:
                            </strong>{" "}
                            {
                                tableInfo.table
                                    .table_type
                            }
                        </p>

                        <p>
                            <strong>
                                Jumlah Kolom:
                            </strong>{" "}
                            {
                                tableInfo
                                    .columns
                                    .length
                            }
                        </p>

                        <p>
                            <strong>
                                Primary Key:
                            </strong>{" "}

                            {getPrimaryKey() ||
                                "Tidak ada"}
                        </p>

                    </div>

                )}


            {/* ================================== */}
            {/* SEARCH + TAMBAH */}
            {/* ================================== */}

            {selectedTable && (

                <div
                    style={{
                        marginBottom:
                            "20px",
                        display: "flex",
                        gap: "8px",
                        alignItems:
                            "center",
                    }}
                >

                    <input
                        type="text"
                        placeholder="Cari data..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={
                            handleSearchKeyDown
                        }
                        style={{
                            padding: "8px",
                            width: "300px",
                        }}
                    />

                    <button
                        onClick={
                            handleSearch
                        }
                    >
                        Search
                    </button>

                    {isAdmin && (
                            <button onClick={handleAdd}>
                                + Tambah Data
                            </button>
                        )}

                </div>

            )}


            {/* ================================== */}
            {/* FORM TAMBAH / EDIT */}
            {/* ================================== */}

            {showForm &&
                tableInfo && (

                    <div
                        style={{
                            marginBottom:
                                "25px",
                            padding: "20px",
                            border:
                                "1px solid #ddd",
                            borderRadius:
                                "8px",
                        }}
                    >

                        <h2>
                            {editingRow
                                ? "Edit Data"
                                : "Tambah Data"}
                        </h2>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {tableInfo.columns.map(
                                (column) => {

                                    const isPrimaryKey =
                                        column.is_primary_key;

                                    const isAutoIncrement =
                                        column.column_default
                                            ?.includes(
                                                "nextval"
                                            );

                                    /*
                                     * Primary key auto increment
                                     * tidak perlu diinput user
                                     */

                                    if (
                                        !editingRow &&
                                        isAutoIncrement
                                    ) {
                                        return null;
                                    }

                                    return (

                                        <div
                                            key={
                                                column.column_name
                                            }
                                            style={{
                                                marginBottom:
                                                    "12px",
                                            }}
                                        >

                                            <label
                                                style={{
                                                    display:
                                                        "block",
                                                    marginBottom:
                                                        "5px",
                                                }}
                                            >

                                                <strong>
                                                    {
                                                        column.column_name
                                                    }
                                                </strong>

                                                {" "}

                                                <small>
                                                    (
                                                    {
                                                        column.data_type
                                                    }
                                                    )
                                                </small>

                                                {column.is_nullable ===
                                                    "NO" &&
                                                    !isPrimaryKey && (
                                                        <span>
                                                            {" "}
                                                            *
                                                        </span>
                                                    )}

                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    formData[
                                                        column
                                                            .column_name
                                                    ] ??
                                                    ""
                                                }
                                                disabled={
                                                    editingRow
                                                        ? isPrimaryKey
                                                        : false
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleFormChange(
                                                        column.column_name,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "8px",
                                                    width:
                                                        "100%",
                                                    maxWidth:
                                                        "500px",
                                                    boxSizing:
                                                        "border-box",
                                                }}
                                            />

                                        </div>

                                    );

                                }
                            )}


                            <div
                                style={{
                                    marginTop:
                                        "20px",
                                }}
                            >

                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : editingRow
                                        ? "Simpan Perubahan"
                                        : "Tambah Data"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleCancelForm
                                    }
                                    style={{
                                        marginLeft:
                                            "8px",
                                    }}
                                >
                                    Batal
                                </button>

                            </div>

                        </form>

                    </div>

                )}


            {/* ================================== */}
            {/* DATA */}
            {/* ================================== */}

            {loading ? (

                <p>
                    Loading...
                </p>

            ) : selectedTable &&
                data.length > 0 ? (

                <div
                    style={{
                        overflowX:
                            "auto",
                    }}
                >

                    <table
                        border={1}
                        cellPadding={8}
                        style={{
                            borderCollapse:
                                "collapse",
                            width:
                                "100%",
                        }}
                    >

                        <thead>

                            <tr>

                                {Object.keys(
                                    data[0]
                                ).map(
                                    (column) => (

                                        <th
                                            key={
                                                column
                                            }
                                        >
                                            {
                                                column
                                            }
                                        </th>

                                    )
                                )}

                                <th>
                                    Aksi
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {data.map(
                                (
                                    row,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            index
                                        }
                                    >

                                        {Object.keys(
                                            data[0]
                                        ).map(
                                            (
                                                column
                                            ) => (

                                                <td
                                                    key={
                                                        column
                                                    }
                                                >
                                                    {
                                                        row[
                                                            column
                                                        ] ??
                                                        "-"
                                                    }
                                                </td>

                                            )
                                        )}


                                        <td
                                            style={{
                                                whiteSpace:
                                                    "nowrap",
                                            }}
                                        >

                                            {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(row)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(row)}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            ) : selectedTable ? (

                <p>
                    Tidak ada data.
                </p>

            ) : (

                <p>
                    Silakan pilih tabel.
                </p>

            )}


            {/* ================================== */}
            {/* PAGINATION */}
            {/* ================================== */}

            {pagination && (

                <div
                    style={{
                        marginTop:
                            "20px",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "15px",
                    }}
                >

                    <button
                        disabled={
                            pagination.page <=
                            1
                        }
                        onClick={() =>
                            getTableData(
                                selectedTable,
                                pagination.page -
                                    1,
                                search
                            )
                        }
                    >
                        ← Previous
                    </button>


                    <span>

                        Page{" "}
                        {
                            pagination.page
                        }{" "}

                        dari{" "}

                        {
                            pagination.totalPages
                        }

                    </span>


                    <button
                        disabled={
                            pagination.page >=
                            pagination.totalPages
                        }
                        onClick={() =>
                            getTableData(
                                selectedTable,
                                pagination.page +
                                    1,
                                search
                            )
                        }
                    >
                        Next →
                    </button>


                    <span>
                        Total:{" "}
                        {
                            pagination.total
                        }
                    </span>

                </div>

            )}

        </div>

    );
}

export default Database;