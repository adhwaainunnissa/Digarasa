import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    History,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Clock,
    Activity,
} from "lucide-react";

export default function OlsHistory() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    // ======================================================
    // LOAD HISTORY
    // ======================================================

    const loadHistory = async () => {
        setLoading(true);

        try {
            const response = await api.get("/ols/history");

            const result = response.data?.data;

            if (Array.isArray(result)) {
                setItems(result);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Gagal memuat riwayat OLS:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadHistory();
    }, []);

    // ======================================================
    // GET VALUE
    // ======================================================

    const getValue = (
        item: any,
        keys: string[],
        fallback = "-"
    ) => {
        for (const key of keys) {
            if (
                item?.[key] !== undefined &&
                item?.[key] !== null &&
                item?.[key] !== ""
            ) {
                return item[key];
            }
        }

        return fallback;
    };

    // ======================================================
    // PAGINATION
    // ======================================================

    const totalPages = Math.max(
        1,
        Math.ceil(items.length / ITEMS_PER_PAGE)
    );

    const startIndex =
        (page - 1) * ITEMS_PER_PAGE;

    const currentItems = items.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const goPrevious = () => {
        setPage((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    const goNext = () => {
        setPage((prev) =>
            Math.min(prev + 1, totalPages)
        );
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">

                <div className="flex flex-col items-center gap-3 text-slate-400">

                    <RefreshCw className="h-7 w-7 animate-spin text-blue-500" />

                    <p className="text-sm font-medium">
                        Memuat riwayat OLS...
                    </p>

                </div>

            </div>
        );
    }

    // ======================================================
    // EMPTY
    // ======================================================

    if (items.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">

                <div className="text-center">

                    <div className="
                        mx-auto
                        flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-slate-100
                        text-slate-400
                    ">
                        <History className="h-7 w-7" />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-700">
                        Belum Ada Riwayat
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        Belum terdapat aktivitas OLS yang tercatat.
                    </p>

                    <button
                        type="button"
                        onClick={loadHistory}
                        className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-slate-600
                            shadow-sm
                            transition-all
                            duration-500
                            hover:border-blue-300
                            hover:bg-blue-50
                            hover:text-blue-600
                        "
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>

                </div>

            </div>
        );
    }

    // ======================================================
    // TABLE
    // ======================================================

    return (
        <div className="flex h-full flex-col">

            {/* HEADER */}

            <div className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white
                px-6
                py-4
            ">

                <div className="flex items-center gap-3">

                    <div className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    ">
                        <History className="h-5 w-5" />
                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-slate-900">
                            Riwayat OLS
                        </h2>

                        <p className="text-xs text-slate-500">
                            Riwayat aktivitas dan perubahan sistem
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={loadHistory}
                    className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-slate-500
                        shadow-sm
                        transition-all
                        duration-500
                        hover:border-blue-300
                        hover:bg-blue-50
                        hover:text-blue-600
                    "
                    title="Refresh"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>

            </div>

            {/* TABLE */}

            <div className="flex-1 overflow-auto">

                <table className="w-full min-w-[950px] border-collapse">

                    <thead className="
                        sticky
                        top-0
                        z-10
                        bg-slate-50
                    ">

                        <tr className="border-b border-slate-200">

                            <th className="
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Waktu
                            </th>

                            <th className="
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                OLS / Skema
                            </th>

                            <th className="
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                GI
                            </th>

                            <th className="
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Aktivitas
                            </th>

                            <th className="
                                px-6
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {currentItems.map(
                            (item, index) => {

                                const waktu = getValue(
                                    item,
                                    [
                                        "created_at",
                                        "updated_at",
                                        "timestamp",
                                        "waktu",
                                        "date",
                                    ]
                                );

                                const nama = getValue(
                                    item,
                                    [
                                        "nama",
                                        "nama_ols",
                                        "skema",
                                        "name",
                                    ],
                                    "OLS"
                                );

                                const gi = getValue(
                                    item,
                                    [
                                        "gi",
                                        "nama_gi",
                                        "gardu_induk",
                                    ]
                                );

                                const aktivitas = getValue(
                                    item,
                                    [
                                        "aktivitas",
                                        "activity",
                                        "action",
                                        "keterangan",
                                        "event",
                                    ],
                                    "Aktivitas OLS"
                                );

                                const status = getValue(
                                    item,
                                    [
                                        "status",
                                        "status_ols",
                                    ],
                                    "Unknown"
                                );

                                const isNormal =
                                    String(status)
                                        .toLowerCase() ===
                                    "normal";

                                return (
                                    <tr
                                        key={
                                            String(
                                                getValue(
                                                    item,
                                                    [
                                                        "id",
                                                        "ID",
                                                        "history_id",
                                                    ],
                                                    index
                                                )
                                            )
                                        }
                                        className="
                                            border-b
                                            border-slate-100
                                            transition-all
                                            duration-700
                                            hover:bg-blue-50/40
                                        "
                                    >

                                        {/* WAKTU */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2">

                                                <Clock className="
                                                    h-4 w-4
                                                    text-slate-400
                                                " />

                                                <span className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                ">
                                                    {waktu}
                                                </span>

                                            </div>

                                        </td>

                                        {/* OLS */}

                                        <td className="px-6 py-5">

                                            <p className="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                            ">
                                                {nama}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            ">
                                                ID:{" "}
                                                {getValue(
                                                    item,
                                                    [
                                                        "id",
                                                        "ID",
                                                        "ols_id",
                                                    ],
                                                    "-"
                                                )}
                                            </p>

                                        </td>

                                        {/* GI */}

                                        <td className="px-6 py-5">

                                            <span className="
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            ">
                                                {gi}
                                            </span>

                                        </td>

                                        {/* AKTIVITAS */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-2">

                                                <Activity className="
                                                    h-4 w-4
                                                    text-blue-500
                                                " />

                                                <span className="
                                                    text-sm
                                                    text-slate-600
                                                ">
                                                    {aktivitas}
                                                </span>

                                            </div>

                                        </td>

                                        {/* STATUS */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    rounded-full
                                                    border
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    ${
                                                        isNormal
                                                            ? `
                                                                border-emerald-200
                                                                bg-emerald-50
                                                                text-emerald-600
                                                            `
                                                            : `
                                                                border-red-200
                                                                bg-red-50
                                                                text-red-600
                                                            `
                                                    }
                                                `}
                                            >

                                                <span
                                                    className={`
                                                        h-1.5
                                                        w-1.5
                                                        rounded-full
                                                        ${
                                                            isNormal
                                                                ? "bg-emerald-500"
                                                                : "bg-red-500"
                                                        }
                                                    `}
                                                />

                                                {status}

                                            </span>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}

            <div className="
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-slate-200
                bg-white
                px-6
                py-4
            ">

                <p className="text-xs text-slate-500">

                    Menampilkan{" "}

                    <span className="font-semibold text-slate-700">
                        {startIndex + 1}
                    </span>

                    {" - "}

                    <span className="font-semibold text-slate-700">
                        {Math.min(
                            startIndex +
                                ITEMS_PER_PAGE,
                            items.length
                        )}
                    </span>

                    {" "}dari{" "}

                    <span className="font-semibold text-slate-700">
                        {items.length}
                    </span>

                    {" "}data

                </p>

                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={goPrevious}
                        disabled={page === 1}
                        className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition-all
                            duration-500
                            hover:border-blue-300
                            hover:bg-blue-50
                            hover:text-blue-600
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="
                        min-w-20
                        text-center
                        text-xs
                        font-semibold
                        text-slate-600
                    ">
                        Halaman {page} / {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={goNext}
                        disabled={page >= totalPages}
                        className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition-all
                            duration-500
                            hover:border-blue-300
                            hover:bg-blue-50
                            hover:text-blue-600
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                </div>

            </div>

        </div>
    );
}