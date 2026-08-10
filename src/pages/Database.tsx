import { useEffect, useState } from "react";
import api from "../api/axios";

type Table = {
    table_name: string;
};

type Column = {
    column_name: string;
    data_type: string;
};

type RowData = Record<string, unknown>;

type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

function Database() {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const [columns, setColumns] = useState<Column[]>([]);
    const [data, setData] = useState<RowData[]>([]);

    const [search, setSearch] = useState("");

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const [loadingTables, setLoadingTables] = useState(true);
    const [loadingData, setLoadingData] = useState(false);


    // ========================================
    // AMBIL DAFTAR TABEL
    // ========================================

    useEffect(() => {
        const getTables = async () => {
            try {
                const response = await api.get("/tables");

                setTables(response.data);
            } catch (error) {
                console.error("Gagal mengambil tabel:", error);
            } finally {
                setLoadingTables(false);
            }
        };

        getTables();
    }, []);


    // ========================================
    // AMBIL DATA TABEL
    // ========================================

    const getTableData = async (
        tableName: string,
        page = 1,
        searchValue = search
    ) => {
        try {
            setLoadingData(true);

            // Ambil schema
            const schemaResponse = await api.get(
                `/tables/${encodeURIComponent(tableName)}/schema`
            );

            setColumns(schemaResponse.data);


            // Ambil data
            const dataResponse = await api.get(
                `/tables/${encodeURIComponent(tableName)}`,
                {
                    params: {
                        page,
                        limit: 10,
                        search: searchValue,
                    },
                }
            );


            setData(dataResponse.data.data);

            setPagination(dataResponse.data.pagination);

        } catch (error) {
            console.error(
                "Gagal mengambil data tabel:",
                error
            );

            setData([]);

        } finally {
            setLoadingData(false);
        }
    };


    // ========================================
    // KLIK TABEL
    // ========================================

    const handleTableClick = async (tableName: string) => {
        setSelectedTable(tableName);

        setSearch("");

        setPagination({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        });

        await getTableData(tableName, 1, "");
    };


    // ========================================
    // SEARCH
    // ========================================

    const handleSearch = async () => {
        if (!selectedTable) return;

        await getTableData(
            selectedTable,
            1,
            search
        );
    };


    // ========================================
    // GANTI HALAMAN
    // ========================================

    const handlePageChange = async (page: number) => {
        if (!selectedTable) return;

        if (
            page < 1 ||
            page > pagination.totalPages
        ) {
            return;
        }

        await getTableData(
            selectedTable,
            page,
            search
        );
    };


    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
        >

            {/* ========================================
                JUDUL
            ======================================== */}

            <h1>Database Explorer</h1>


            {/* ========================================
                DAFTAR TABEL
            ======================================== */}

            <section>
                <h2>Daftar Tabel</h2>

                {loadingTables ? (
                    <p>Memuat tabel...</p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                        }}
                    >

                        {tables.map((table) => (
                            <button
                                key={table.table_name}
                                onClick={() =>
                                    handleTableClick(
                                        table.table_name
                                    )
                                }
                                style={{
                                    padding:
                                        "8px 12px",
                                    cursor: "pointer",

                                    background:
                                        selectedTable ===
                                        table.table_name
                                            ? "#2563eb"
                                            : "#f3f4f6",

                                    color:
                                        selectedTable ===
                                        table.table_name
                                            ? "white"
                                            : "black",

                                    border:
                                        "1px solid #ccc",

                                    borderRadius:
                                        "5px",
                                }}
                            >
                                {table.table_name}
                            </button>
                        ))}

                    </div>
                )}
            </section>


            <hr
                style={{
                    margin: "30px 0",
                }}
            />


            {/* ========================================
                DATA TABEL
            ======================================== */}

            {selectedTable && (
                <section>

                    <h2>
                        Data: {selectedTable}
                    </h2>


                    {/* SEARCH */}

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "15px",
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Cari data..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            style={{
                                padding: "10px",
                                width: "300px",
                                border:
                                    "1px solid #ccc",
                                borderRadius:
                                    "5px",
                            }}
                        />

                        <button
                            onClick={handleSearch}
                            style={{
                                padding:
                                    "10px 15px",
                                cursor: "pointer",
                            }}
                        >
                            Cari
                        </button>

                    </div>


                    {/* INFO PAGINATION */}

                    <p>
                        Menampilkan{" "}
                        {data.length} data dari{" "}
                        {pagination.total} data
                    </p>


                    {/* LOADING */}

                    {loadingData ? (
                        <p>Memuat data...</p>
                    ) : data.length === 0 ? (

                        <p>
                            Tidak ada data ditemukan.
                        </p>

                    ) : (

                        /* ========================================
                           TABLE
                        ======================================== */

                        <div
                            style={{
                                overflowX: "auto",
                                border:
                                    "1px solid #ddd",
                            }}
                        >

                            <table
                                style={{
                                    borderCollapse:
                                        "collapse",
                                    width: "100%",
                                }}
                            >

                                <thead>

                                    <tr>

                                        {columns.map(
                                            (column) => (
                                                <th
                                                    key={
                                                        column.column_name
                                                    }
                                                    style={{
                                                        border:
                                                            "1px solid #ddd",
                                                        padding:
                                                            "10px",
                                                        textAlign:
                                                            "left",
                                                        whiteSpace:
                                                            "nowrap",
                                                        background:
                                                            "#f3f4f6",
                                                    }}
                                                >
                                                    {
                                                        column.column_name
                                                    }
                                                </th>
                                            )
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {data.map(
                                        (
                                            row,
                                            rowIndex
                                        ) => (

                                            <tr
                                                key={
                                                    rowIndex
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
                                                                column
                                                                    .column_name
                                                            ] !==
                                                                null &&
                                                            row[
                                                                column
                                                                    .column_name
                                                            ] !==
                                                                undefined
                                                                ? String(
                                                                      row[
                                                                          column
                                                                              .column_name
                                                                      ]
                                                                  )
                                                                : "-"}

                                                        </td>

                                                    )
                                                )}

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

                    {pagination.totalPages >
                        1 && (

                        <div
                            style={{
                                display: "flex",
                                gap: "5px",
                                marginTop: "20px",
                                alignItems:
                                    "center",
                            }}
                        >

                            <button
                                onClick={() =>
                                    handlePageChange(
                                        pagination.page -
                                            1
                                    )
                                }
                                disabled={
                                    pagination.page ===
                                    1
                                }
                            >
                                ←
                            </button>


                            {Array.from(
                                {
                                    length:
                                        pagination.totalPages,
                                },
                                (_, index) => {

                                    const page =
                                        index + 1;

                                    return (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(
                                                    page
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "5px 10px",

                                                background:
                                                    pagination.page ===
                                                    page
                                                        ? "#2563eb"
                                                        : "#f3f4f6",

                                                color:
                                                    pagination.page ===
                                                    page
                                                        ? "white"
                                                        : "black",

                                                border:
                                                    "1px solid #ccc",

                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )}


                            <button
                                onClick={() =>
                                    handlePageChange(
                                        pagination.page +
                                            1
                                    )
                                }
                                disabled={
                                    pagination.page ===
                                    pagination.totalPages
                                }
                            >
                                →
                            </button>

                        </div>

                    )}

                </section>
            )}

        </div>
    );
}

export default Database;