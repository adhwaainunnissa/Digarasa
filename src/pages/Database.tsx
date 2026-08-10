import { useEffect, useState } from "react";
import api from "../api/axios";

type TableInfo = {
    table_name: string;
};

type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

function Database() {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const [data, setData] = useState<Record<string, any>[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(false);

    // ==============================
    // AMBIL DAFTAR TABEL
    // ==============================

    useEffect(() => {
        const getTables = async () => {
            try {
                const response = await api.get("/tables");

                setTables(response.data);
            } catch (error) {
                console.error("Gagal mengambil tabel:", error);
            }
        };

        getTables();
    }, []);

    // ==============================
    // AMBIL DATA TABEL
    // ==============================

    const getTableData = async (
        tableName: string,
        page: number = 1
    ) => {
        try {
            setLoading(true);

            const response = await api.get(
                `/tables/${tableName}?page=${page}&limit=5`
            );

            setData(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Gagal mengambil data tabel:", error);

            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // KLIK TABEL
    // ==============================

    const handleTableClick = (tableName: string) => {
        setSelectedTable(tableName);

        getTableData(tableName, 1);
    };

    // ==============================
    // PAGINATION
    // ==============================

    const handlePrevious = () => {
        if (!selectedTable) return;

        if (pagination.page > 1) {
            getTableData(
                selectedTable,
                pagination.page - 1
            );
        }
    };

    const handleNext = () => {
        if (!selectedTable) return;

        if (
            pagination.page < pagination.totalPages
        ) {
            getTableData(
                selectedTable,
                pagination.page + 1
            );
        }
    };

    // ==============================
    // RENDER
    // ==============================

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "Arial",
            }}
        >
            {/* =========================
                SIDEBAR
            ========================= */}

            <div
                style={{
                    width: "250px",
                    borderRight: "1px solid #ddd",
                    padding: "20px",
                }}
            >
                <h2>Database Explorer</h2>

                <p>
                    {tables.length} tabel
                </p>

                {tables.map((table) => (
                    <button
                        key={table.table_name}
                        onClick={() =>
                            handleTableClick(
                                table.table_name
                            )
                        }
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "10px",
                            marginBottom: "5px",
                            textAlign: "left",
                            cursor: "pointer",
                            border: "1px solid #ddd",
                            background:
                                selectedTable ===
                                table.table_name
                                    ? "#eee"
                                    : "white",
                        }}
                    >
                        🗄️ {table.table_name}
                    </button>
                ))}
            </div>

            {/* =========================
                CONTENT
            ========================= */}

            <div
                style={{
                    flex: 1,
                    padding: "30px",
                    overflowX: "auto",
                }}
            >
                {!selectedTable ? (
                    <div>
                        <h1>Database Explorer</h1>

                        <p>
                            Pilih tabel di sebelah kiri
                            untuk melihat data.
                        </p>
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h1>
                                    {selectedTable}
                                </h1>

                                <p>
                                    Total data:{" "}
                                    {
                                        pagination.total
                                    }
                                </p>
                            </div>
                        </div>

                        {/* =====================
                            LOADING
                        ===================== */}

                        {loading ? (
                            <p>
                                Loading data...
                            </p>
                        ) : data.length === 0 ? (
                            <p>
                                Tidak ada data.
                            </p>
                        ) : (
                            <>
                                {/* =====================
                                    TABLE
                                ===================== */}

                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse:
                                            "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {Object.keys(
                                                data[0]
                                            ).map(
                                                (
                                                    column
                                                ) => (
                                                    <th
                                                        key={
                                                            column
                                                        }
                                                        style={{
                                                            border:
                                                                "1px solid #ddd",
                                                            padding:
                                                                "10px",
                                                            textAlign:
                                                                "left",
                                                            background:
                                                                "#f5f5f5",
                                                        }}
                                                    >
                                                        {
                                                            column
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
                                                                style={{
                                                                    border:
                                                                        "1px solid #ddd",
                                                                    padding:
                                                                        "10px",
                                                                }}
                                                            >
                                                                {row[
                                                                    column
                                                                ] ===
                                                                null
                                                                    ? "-"
                                                                    : String(
                                                                          row[
                                                                              column
                                                                          ]
                                                                      )}
                                                            </td>
                                                        )
                                                    )}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {/* =====================
                                    PAGINATION
                                ===================== */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center",
                                        gap: "15px",
                                        marginTop:
                                            "20px",
                                    }}
                                >
                                    <button
                                        onClick={
                                            handlePrevious
                                        }
                                        disabled={
                                            pagination.page ===
                                            1
                                        }
                                    >
                                        ← Previous
                                    </button>

                                    <span>
                                        Page{" "}
                                        {
                                            pagination.page
                                        }{" "}
                                        of{" "}
                                        {
                                            pagination.totalPages
                                        }
                                    </span>

                                    <button
                                        onClick={
                                            handleNext
                                        }
                                        disabled={
                                            pagination.page ===
                                            pagination.totalPages
                                        }
                                    >
                                        Next →
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Database;