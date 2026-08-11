import { useEffect, useState } from "react";
import api from "../api/axios";

// ========================================
// INTERFACE
// ========================================

interface Table {
    table_name: string;
}

interface Column {
    column_name: string;
    data_type: string;
    is_nullable?: string;
    column_default?: string | null;
    is_primary_key?: boolean;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ========================================
// COMPONENT
// ========================================

function Database() {

    // ========================================
    // STATE TABLE
    // ========================================

    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] =
        useState<string | null>(null);

    // ========================================
    // STATE COLUMN & DATA
    // ========================================

    const [columns, setColumns] =
        useState<Column[]>([]);

    const [data, setData] =
        useState<any[]>([]);

    // ========================================
    // STATE LOADING
    // ========================================

    const [loadingTables, setLoadingTables] =
        useState(true);

    const [loadingData, setLoadingData] =
        useState(false);

    // ========================================
    // PAGINATION
    // ========================================

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(20);

    const [total, setTotal] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    // ========================================
    // SEARCH
    // ========================================

    const [search, setSearch] =
        useState("");

    // ========================================
    // PRIMARY KEY
    // ========================================

    const [primaryKey, setPrimaryKey] =
        useState<string | null>(null);

    // ========================================
    // MODAL
    // ========================================

    const [showModal, setShowModal] =
        useState(false);

    const [modalMode, setModalMode] =
        useState<"add" | "edit">("add");

    // ========================================
    // FORM DATA
    // ========================================

    const [formData, setFormData] =
        useState<Record<string, any>>({});

    // ========================================
    // SELECTED ROW
    // ========================================

    const [selectedRow, setSelectedRow] =
        useState<any | null>(null);


    // ========================================
    // AMBIL SEMUA TABEL
    // ========================================

    useEffect(() => {
        getTables();
    }, []);


    const getTables = async () => {

        try {

            setLoadingTables(true);

            const response =
                await api.get("/tables");

            console.log(
                "Daftar tabel:",
                response.data
            );

            setTables(response.data);

        } catch (error) {

            console.error(
                "Gagal mengambil tabel:",
                error
            );

        } finally {

            setLoadingTables(false);

        }

    };


    // ========================================
    // AMBIL INFO TABEL
    // ========================================

    const getTableInfo = async (
        tableName: string
    ) => {

        const response =
            await api.get(
                `/tables/${encodeURIComponent(
                    tableName
                )}/info`
            );

        return response.data;

    };


    // ========================================
    // PILIH TABEL
    // ========================================

    const selectTable = async (
        tableName: string
    ) => {

        try {

            setSelectedTable(tableName);

            setLoadingData(true);

            // Reset
            setPage(1);
            setSearch("");
            setData([]);
            setColumns([]);
            setPrimaryKey(null);

            // ========================================
            // AMBIL INFO TABEL
            // ========================================

            const info =
                await getTableInfo(tableName);

            console.log(
                "Info tabel:",
                info
            );

            const tableColumns =
                info.columns || [];

            setColumns(tableColumns);

            // Cari primary key
            const pk =
                tableColumns.find(
                    (column: Column) =>
                        column.is_primary_key === true
                );

            if (pk) {

                setPrimaryKey(
                    pk.column_name
                );

            } else {

                setPrimaryKey(null);

            }

            // ========================================
            // AMBIL DATA
            // ========================================

            await fetchData(
                tableName,
                1,
                ""
            );

        } catch (error) {

            console.error(
                "Gagal mengambil informasi tabel:",
                error
            );

            setColumns([]);
            setData([]);
            setPrimaryKey(null);

        } finally {

            setLoadingData(false);

        }

    };


    // ========================================
    // AMBIL DATA
    // ========================================

    const fetchData = async (
        tableName: string,
        pageNumber: number,
        searchValue: string
    ) => {

        try {

            setLoadingData(true);

            const response =
                await api.get(
                    `/tables/${encodeURIComponent(
                        tableName
                    )}?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
                        searchValue
                    )}`
                );

            console.log(
                "Data tabel:",
                response.data
            );

            setData(
                response.data.data || []
            );

            const pagination:
                Pagination =
                response.data.pagination;

            setPage(
                pagination.page
            );

            setTotal(
                pagination.total
            );

            setTotalPages(
                pagination.totalPages
            );

        } catch (error) {

            console.error(
                "Gagal mengambil data:",
                error
            );

        } finally {

            setLoadingData(false);

        }

    };


    // ========================================
    // GANTI HALAMAN
    // ========================================

    const changePage = async (
        newPage: number
    ) => {

        if (!selectedTable) {
            return;
        }

        if (
            newPage < 1 ||
            newPage > totalPages
        ) {
            return;
        }

        await fetchData(
            selectedTable,
            newPage,
            search
        );

    };


    // ========================================
    // SEARCH
    // ========================================

    const handleSearch = async () => {

        if (!selectedTable) {
            return;
        }

        await fetchData(
            selectedTable,
            1,
            search
        );

    };


    // ========================================
    // RESET SEARCH
    // ========================================

    const handleResetSearch = async () => {

        if (!selectedTable) {
            return;
        }

        setSearch("");

        await fetchData(
            selectedTable,
            1,
            ""
        );

    };


    // ========================================
    // BUKA MODAL TAMBAH
    // ========================================

    const openAddModal = () => {

        if (!selectedTable) {
            return;
        }

        const initialData:
            Record<string, any> = {};

        columns.forEach(
            (column) => {

                // Jika primary key memiliki
                // default/sequence, tidak perlu
                // diisi user
                if (
                    column.is_primary_key &&
                    column.column_default
                ) {
                    return;
                }

                initialData[
                    column.column_name
                ] = "";

            }
        );

        setFormData(
            initialData
        );

        setSelectedRow(null);

        setModalMode("add");

        setShowModal(true);

    };


    // ========================================
    // BUKA MODAL EDIT
    // ========================================

    const openEditModal = (
        row: any
    ) => {

        setSelectedRow(row);

        const editData:
            Record<string, any> = {};

        columns.forEach(
            (column) => {

                editData[
                    column.column_name
                ] =
                    row[
                        column.column_name
                    ] ?? "";

            }
        );

        setFormData(
            editData
        );

        setModalMode("edit");

        setShowModal(true);

    };


    // ========================================
    // HANDLE FORM
    // ========================================

    const handleInputChange = (
        columnName: string,
        value: string
    ) => {

        setFormData(
            (previous) => ({
                ...previous,
                [columnName]:
                    value,
            })
        );

    };


    // ========================================
    // SUBMIT FORM
    // ========================================

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!selectedTable) {
            return;
        }

        try {

            // ========================================
            // TAMBAH DATA
            // ========================================

            if (
                modalMode === "add"
            ) {

                const response =
                    await api.post(
                        `/tables/${encodeURIComponent(
                            selectedTable
                        )}`,
                        formData
                    );

                console.log(
                    "Insert berhasil:",
                    response.data
                );

                alert(
                    "Data berhasil ditambahkan"
                );

            }

            // ========================================
            // EDIT DATA
            // ========================================

            else {

                if (!primaryKey) {

                    alert(
                        "Tabel ini tidak memiliki primary key."
                    );

                    return;

                }

                const id =
                    selectedRow[
                        primaryKey
                    ];

                const updateData = {
                    ...formData,
                };

                // Primary key jangan diubah
                delete updateData[
                    primaryKey
                ];

                const response =
                    await api.put(
                        `/tables/${encodeURIComponent(
                            selectedTable
                        )}/${encodeURIComponent(
                            id
                        )}`,
                        updateData
                    );

                console.log(
                    "Update berhasil:",
                    response.data
                );

                alert(
                    "Data berhasil diperbarui"
                );

            }

            // Tutup modal
            setShowModal(false);

            // Refresh data
            await fetchData(
                selectedTable,
                page,
                search
            );

        } catch (error: any) {

            console.error(
                "Gagal menyimpan data:",
                error
            );

            const message =
                error?.response?.data?.error ||
                "Gagal menyimpan data";

            alert(message);

        }

    };


    // ========================================
    // DELETE DATA
    // ========================================

    const handleDelete = async (
        row: any
    ) => {

        if (!selectedTable) {
            return;
        }

        if (!primaryKey) {

            alert(
                "Tabel ini tidak memiliki primary key sehingga data tidak dapat dihapus."
            );

            return;

        }

        const id =
            row[
                primaryKey
            ];

        const confirmation =
            window.confirm(
                `Yakin ingin menghapus data dengan ${primaryKey} = ${id}?`
            );

        if (!confirmation) {
            return;
        }

        try {

            await api.delete(
                `/tables/${encodeURIComponent(
                    selectedTable
                )}/${encodeURIComponent(
                    id
                )}`
            );

            alert(
                "Data berhasil dihapus"
            );

            // Refresh
            await fetchData(
                selectedTable,
                page,
                search
            );

        } catch (error: any) {

            console.error(
                "Gagal menghapus data:",
                error
            );

            const message =
                error?.response?.data?.error ||
                "Gagal menghapus data";

            alert(message);

        }

    };


    // ========================================
    // NOMOR HALAMAN
    // ========================================

    const getPageNumbers = () => {

        const pages: number[] = [];

        const maxPagesToShow = 7;

        if (
            totalPages <=
            maxPagesToShow
        ) {

            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {

                pages.push(i);

            }

        } else {

            let start =
                Math.max(
                    1,
                    page - 3
                );

            let end =
                Math.min(
                    totalPages,
                    page + 3
                );

            if (page <= 3) {

                start = 1;
                end = 7;

            }

            if (
                page >=
                totalPages - 2
            ) {

                start =
                    totalPages - 6;

                end =
                    totalPages;

            }

            for (
                let i = start;
                i <= end;
                i++
            ) {

                pages.push(i);

            }

        }

        return pages;

    };


    // ========================================
    // RENDER
    // ========================================

    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >

            {/* ========================================
                SIDEBAR TABEL
            ======================================== */}

            <div
                style={{
                    width: "260px",
                    minWidth: "260px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    height: "fit-content",
                    background: "#fff",
                }}
            >

                <h2>
                    Daftar Tabel
                </h2>

                {loadingTables ? (

                    <p>
                        Loading...
                    </p>

                ) : tables.length === 0 ? (

                    <p>
                        Tidak ada tabel.
                    </p>

                ) : (

                    <div>

                        {tables.map(
                            (table) => (

                                <button
                                    key={
                                        table.table_name
                                    }
                                    onClick={() =>
                                        selectTable(
                                            table.table_name
                                        )
                                    }
                                    style={{
                                        display:
                                            "block",
                                        width:
                                            "100%",
                                        textAlign:
                                            "left",
                                        padding:
                                            "10px",
                                        marginBottom:
                                            "5px",
                                        cursor:
                                            "pointer",
                                        border:
                                            "none",
                                        borderRadius:
                                            "5px",
                                        background:
                                            selectedTable ===
                                            table.table_name
                                                ? "#dbeafe"
                                                : "#f5f5f5",
                                        color:
                                            selectedTable ===
                                            table.table_name
                                                ? "#1d4ed8"
                                                : "#333",
                                        fontWeight:
                                            selectedTable ===
                                            table.table_name
                                                ? "bold"
                                                : "normal",
                                    }}
                                >

                                    {
                                        table.table_name
                                    }

                                </button>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ========================================
                CONTENT
            ======================================== */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    overflowX: "auto",
                }}
            >

                {!selectedTable ? (

                    <div>

                        <h1>
                            Database
                        </h1>

                        <p>
                            Pilih tabel di sebelah kiri
                            untuk melihat dan mengelola
                            data.
                        </p>

                    </div>

                ) : (

                    <>

                        {/* ========================================
                            HEADER
                        ======================================== */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "20px",
                            }}
                        >

                            <div>

                                <h1
                                    style={{
                                        margin:
                                            "0 0 5px 0",
                                    }}
                                >
                                    {
                                        selectedTable
                                    }
                                </h1>

                                <p
                                    style={{
                                        margin:
                                            "0",
                                        color:
                                            "#666",
                                    }}
                                >
                                    Total data:{" "}
                                    {total}
                                </p>

                            </div>


                            {/* BUTTON TAMBAH */}

                            <button
                                onClick={
                                    openAddModal
                                }
                                style={{
                                    padding:
                                        "10px 16px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "6px",
                                    background:
                                        "#2563eb",
                                    color:
                                        "white",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "bold",
                                }}
                            >
                                + Tambah Data
                            </button>

                        </div>


                        {/* ========================================
                            SEARCH
                        ======================================== */}

                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "10px",
                                marginBottom:
                                    "20px",
                            }}
                        >

                            <input
                                type="text"
                                placeholder="Cari data..."
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                                }
                                onKeyDown={(
                                    event
                                ) => {

                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {

                                        handleSearch();

                                    }

                                }}
                                style={{
                                    padding:
                                        "10px",
                                    width:
                                        "300px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius:
                                        "6px",
                                }}
                            />


                            <button
                                onClick={
                                    handleSearch
                                }
                                style={{
                                    padding:
                                        "10px 15px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Cari
                            </button>


                            <button
                                onClick={
                                    handleResetSearch
                                }
                                style={{
                                    padding:
                                        "10px 15px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Reset
                            </button>

                        </div>


                        {/* ========================================
                            LOADING
                        ======================================== */}

                        {loadingData ? (

                            <p>
                                Mengambil data...
                            </p>

                        ) : (

                            <>

                                {/* ========================================
                                    STRUKTUR TABEL
                                ======================================== */}

                                <h3>
                                    Struktur Tabel
                                </h3>

                                <div
                                    style={{
                                        overflowX:
                                            "auto",
                                        marginBottom:
                                            "30px",
                                    }}
                                >

                                    <table
                                        style={{
                                            borderCollapse:
                                                "collapse",
                                            width:
                                                "100%",
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                <th
                                                    style={{
                                                        border:
                                                            "1px solid #ddd",
                                                        padding:
                                                            "10px",
                                                        background:
                                                            "#f3f4f6",
                                                    }}
                                                >
                                                    Nama Kolom
                                                </th>

                                                <th
                                                    style={{
                                                        border:
                                                            "1px solid #ddd",
                                                        padding:
                                                            "10px",
                                                        background:
                                                            "#f3f4f6",
                                                    }}
                                                >
                                                    Tipe Data
                                                </th>

                                                <th
                                                    style={{
                                                        border:
                                                            "1px solid #ddd",
                                                        padding:
                                                            "10px",
                                                        background:
                                                            "#f3f4f6",
                                                    }}
                                                >
                                                    Primary Key
                                                </th>

                                                <th
                                                    style={{
                                                        border:
                                                            "1px solid #ddd",
                                                        padding:
                                                            "10px",
                                                        background:
                                                            "#f3f4f6",
                                                    }}
                                                >
                                                    Nullable
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {columns.map(
                                                (
                                                    column
                                                ) => (

                                                    <tr
                                                        key={
                                                            column.column_name
                                                        }
                                                    >

                                                        <td
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "10px",
                                                            }}
                                                        >
                                                            {
                                                                column.column_name
                                                            }
                                                        </td>

                                                        <td
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "10px",
                                                            }}
                                                        >
                                                            {
                                                                column.data_type
                                                            }
                                                        </td>

                                                        <td
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "10px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {column.is_primary_key
                                                                ? "✓"
                                                                : "-"}
                                                        </td>

                                                        <td
                                                            style={{
                                                                border:
                                                                    "1px solid #ddd",
                                                                padding:
                                                                    "10px",
                                                            }}
                                                        >
                                                            {
                                                                column.is_nullable
                                                            }
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {/* ========================================
                                    DATA
                                ======================================== */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        marginBottom:
                                            "10px",
                                    }}
                                >

                                    <h3>
                                        Data
                                    </h3>

                                    <span
                                        style={{
                                            color:
                                                "#666",
                                        }}
                                    >
                                        Halaman{" "}
                                        {page}{" "}
                                        dari{" "}
                                        {totalPages}
                                    </span>

                                </div>


                                {data.length === 0 ? (

                                    <p>
                                        Tidak ada data.
                                    </p>

                                ) : (

                                    <div
                                        style={{
                                            overflowX:
                                                "auto",
                                        }}
                                    >

                                        <table
                                            style={{
                                                borderCollapse:
                                                    "collapse",
                                                width:
                                                    "100%",
                                            }}
                                        >

                                            <thead>

                                                <tr>

                                                    {columns.map(
                                                        (
                                                            column
                                                        ) => (

                                                            <th
                                                                key={
                                                                    column.column_name
                                                                }
                                                                style={{
                                                                    border:
                                                                        "1px solid #ddd",
                                                                    padding:
                                                                        "10px",
                                                                    background:
                                                                        "#f3f4f6",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >
                                                                {
                                                                    column.column_name
                                                                }
                                                            </th>

                                                        )
                                                    )}

                                                    <th
                                                        style={{
                                                            border:
                                                                "1px solid #ddd",
                                                            padding:
                                                                "10px",
                                                            background:
                                                                "#f3f4f6",
                                                        }}
                                                    >
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

                                                            {columns.map(
                                                                (
                                                                    column
                                                                ) => (

                                                                    <td
                                                                        key={
                                                                            column.column_name
                                                                        }
                                                                        style={{
                                                                            border:
                                                                                "1px solid #ddd",
                                                                            padding:
                                                                                "10px",
                                                                            whiteSpace:
                                                                                "nowrap",
                                                                        }}
                                                                    >

                                                                        {row[
                                                                            column.column_name
                                                                        ] !==
                                                                        null &&
                                                                        row[
                                                                            column.column_name
                                                                        ] !==
                                                                        undefined
                                                                            ? String(
                                                                                  row[
                                                                                      column.column_name
                                                                                  ]
                                                                              )
                                                                            : "-"}

                                                                    </td>

                                                                )
                                                            )}


                                                            {/* AKSI */}

                                                            <td
                                                                style={{
                                                                    border:
                                                                        "1px solid #ddd",
                                                                    padding:
                                                                        "10px",
                                                                    whiteSpace:
                                                                        "nowrap",
                                                                }}
                                                            >

                                                                <button
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            row
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginRight:
                                                                            "5px",
                                                                        padding:
                                                                            "7px 10px",
                                                                        cursor:
                                                                            "pointer",
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            row
                                                                        )
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            "7px 10px",
                                                                        cursor:
                                                                            "pointer",
                                                                    }}
                                                                >
                                                                    Hapus
                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}


                                {/* ========================================
                                    PAGINATION
                                ======================================== */}

                                {totalPages > 0 && (

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginTop:
                                                "20px",
                                            flexWrap:
                                                "wrap",
                                            gap:
                                                "10px",
                                        }}
                                    >

                                        <div>

                                            Menampilkan{" "}
                                            {data.length}{" "}
                                            dari{" "}
                                            {total}{" "}
                                            data

                                        </div>


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                gap:
                                                    "5px",
                                            }}
                                        >

                                            {/* SEBELUMNYA */}

                                            <button
                                                disabled={
                                                    page ===
                                                    1
                                                }
                                                onClick={() =>
                                                    changePage(
                                                        page -
                                                            1
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "7px 10px",
                                                    cursor:
                                                        page ===
                                                        1
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                            >
                                                ←
                                            </button>


                                            {/* NOMOR HALAMAN */}

                                            {getPageNumbers().map(
                                                (
                                                    pageNumber
                                                ) => (

                                                    <button
                                                        key={
                                                            pageNumber
                                                        }
                                                        onClick={() =>
                                                            changePage(
                                                                pageNumber
                                                            )
                                                        }
                                                        style={{
                                                            padding:
                                                                "7px 10px",
                                                            cursor:
                                                                "pointer",
                                                            fontWeight:
                                                                page ===
                                                                pageNumber
                                                                    ? "bold"
                                                                    : "normal",
                                                            background:
                                                                page ===
                                                                pageNumber
                                                                    ? "#2563eb"
                                                                    : "#fff",
                                                            color:
                                                                page ===
                                                                pageNumber
                                                                    ? "#fff"
                                                                    : "#000",
                                                            border:
                                                                "1px solid #ccc",
                                                            borderRadius:
                                                                "4px",
                                                        }}
                                                    >
                                                        {
                                                            pageNumber
                                                        }
                                                    </button>

                                                )
                                            )}


                                            {/* BERIKUTNYA */}

                                            <button
                                                disabled={
                                                    page ===
                                                    totalPages
                                                }
                                                onClick={() =>
                                                    changePage(
                                                        page +
                                                            1
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "7px 10px",
                                                    cursor:
                                                        page ===
                                                        totalPages
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                            >
                                                →
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </>

                        )}

                    </>

                )}

            </div>


            {/* ========================================
                MODAL TAMBAH / EDIT
            ======================================== */}

            {showModal && (

                <div
                    style={{
                        position:
                            "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            "rgba(0,0,0,0.5)",
                        display:
                            "flex",
                        justifyContent:
                            "center",
                        alignItems:
                            "center",
                        zIndex: 999,
                        padding:
                            "20px",
                    }}
                >

                    <div
                        style={{
                            background:
                                "#fff",
                            borderRadius:
                                "10px",
                            width:
                                "600px",
                            maxWidth:
                                "100%",
                            maxHeight:
                                "90vh",
                            overflowY:
                                "auto",
                            padding:
                                "25px",
                        }}
                    >

                        {/* HEADER MODAL */}

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                marginBottom:
                                    "20px",
                            }}
                        >

                            <h2
                                style={{
                                    margin:
                                        "0",
                                }}
                            >
                                {modalMode ===
                                "add"
                                    ? "Tambah Data"
                                    : "Edit Data"}
                            </h2>


                            <button
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                                style={{
                                    border:
                                        "none",
                                    background:
                                        "transparent",
                                    fontSize:
                                        "20px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                ✕
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {columns.map(
                                (
                                    column
                                ) => {

                                    // Saat tambah:
                                    // skip primary key yang
                                    // memiliki default sequence
                                    if (
                                        modalMode ===
                                            "add" &&
                                        column.is_primary_key &&
                                        column.column_default
                                    ) {

                                        return null;

                                    }

                                    const isPrimaryKey =
                                        column.is_primary_key ===
                                        true;

                                    const disabled =
                                        modalMode ===
                                            "edit" &&
                                        isPrimaryKey;

                                    return (

                                        <div
                                            key={
                                                column.column_name
                                            }
                                            style={{
                                                marginBottom:
                                                    "15px",
                                            }}
                                        >

                                            <label
                                                style={{
                                                    display:
                                                        "block",
                                                    marginBottom:
                                                        "5px",
                                                    fontWeight:
                                                        "bold",
                                                }}
                                            >

                                                {
                                                    column.column_name
                                                }

                                                {column.is_nullable ===
                                                    "NO" && (
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
                                                        column.column_name
                                                    ] ??
                                                    ""
                                                }
                                                disabled={
                                                    disabled
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleInputChange(
                                                        column.column_name,
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder={
                                                    column.data_type
                                                }
                                                style={{
                                                    width:
                                                        "100%",
                                                    boxSizing:
                                                        "border-box",
                                                    padding:
                                                        "10px",
                                                    border:
                                                        "1px solid #ccc",
                                                    borderRadius:
                                                        "6px",
                                                    background:
                                                        disabled
                                                            ? "#f3f4f6"
                                                            : "#fff",
                                                }}
                                            />

                                            {disabled && (
                                                <small
                                                    style={{
                                                        color:
                                                            "#666",
                                                    }}
                                                >
                                                    Primary key tidak
                                                    dapat diubah.
                                                </small>
                                            )}

                                        </div>

                                    );

                                }
                            )}


                            {/* BUTTON FORM */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap:
                                        "10px",
                                    marginTop:
                                        "20px",
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                    style={{
                                        padding:
                                            "10px 15px",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    Batal
                                </button>


                                <button
                                    type="submit"
                                    style={{
                                        padding:
                                            "10px 15px",
                                        background:
                                            "#2563eb",
                                        color:
                                            "#fff",
                                        border:
                                            "none",
                                        borderRadius:
                                            "6px",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    {modalMode ===
                                    "add"
                                        ? "Simpan"
                                        : "Update"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Database;