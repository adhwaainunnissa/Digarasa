import { useEffect, useState } from "react";
import { Activity, RefreshCw, Search, Gauge } from "lucide-react";

import { getUfrBeban } from "../../services/api/ufrService";
import type {
    UfrBebanData,
    PaginationMeta,
} from "../../services/api/ufrService";

type BebanButtonProps = {
    value: number;
    active: boolean;
    onClick: () => void;
};

function BebanButton({ value, active, onClick }: BebanButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-lg px-4 py-2
                text-sm font-semibold transition-all duration-300
                ${
                    active
                        ? `
                            bg-gradient-to-r from-[#0066FF] to-[#00BFFF]
                            text-white shadow-md shadow-blue-200
                            hover:-translate-y-0.5
                            hover:shadow-lg hover:shadow-blue-300
                        `
                        : `
                            bg-white text-[#52627A]
                            hover:bg-[#F0F7FF]
                            hover:text-[#0066FF]
                        `
                }
            `}
        >
            {active && (
                <span
                    className="
                        absolute inset-0
                        bg-gradient-to-r from-transparent via-white/20 to-transparent
                        -translate-x-full
                        animate-[ufrShimmer_2.5s_infinite]
                    "
                />
            )}

            <span className="relative z-10 flex items-center gap-2">
                <span
                    className={`
                        h-1.5 w-1.5 rounded-full
                        ${
                            active
                                ? "bg-[#FFD600] shadow-[0_0_8px_rgba(255,214,0,0.9)]"
                                : "bg-[#00BFFF]"
                        }
                    `}
                />
                Beban {value}
            </span>
        </button>
    );
}

export default function UfrBeban() {
    const [beban, setBeban] = useState<number>(1);
    const [data, setData] = useState<UfrBebanData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>("");

    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0,
    });

    const bebans = [1, 2, 3];

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadData(1);
        }, 500);

        return () => clearTimeout(debounce);
    }, [search, beban]);

    const loadData = async (pageToLoad: number = pagination.page) => {
        setLoading(true);

        try {
            const result = await getUfrBeban(
                beban,
                pageToLoad,
                pagination.limit,
                search
            );

            setData(result.data);
            setPagination(result.pagination);
        } catch (error) {
            console.error("Gagal memuat data UFR Beban:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F5F9FF]">
            {/* =========================================================
                DECORATIVE BACKGROUND
            ========================================================= */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="
                        absolute -left-24 -top-24
                        h-72 w-72 rounded-full
                        bg-[#00BFFF]/10 blur-3xl
                        animate-[ufrBlobFloat_8s_ease-in-out_infinite]
                    "
                />

                <div
                    className="
                        absolute -right-20 top-32
                        h-64 w-64 rounded-full
                        bg-[#0066FF]/10 blur-3xl
                        animate-[ufrBlobFloat_10s_ease-in-out_infinite_reverse]
                    "
                />

                <div
                    className="
                        absolute bottom-0 left-1/3
                        h-56 w-56 rounded-full
                        bg-[#FFD600]/10 blur-3xl
                        animate-[ufrBlobFloat_9s_ease-in-out_infinite]
                    "
                />
            </div>

            {/* =========================================================
                HEADER
            ========================================================= */}
            <header
                className="
                    relative z-10 shrink-0
                    border-b border-[#CFE2FF]
                    bg-white/95 px-8 py-6
                    shadow-[0_4px_20px_rgba(0,102,255,0.06)]
                    backdrop-blur-sm
                "
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    {/* TITLE */}
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                relative flex h-12 w-12
                                items-center justify-center
                                overflow-hidden rounded-xl
                                bg-gradient-to-br
                                from-[#0066FF] via-[#00AEEF] to-[#082B5F]
                                text-white
                                shadow-lg shadow-blue-200
                            "
                        >
                            <Gauge className="relative z-10 h-6 w-6" />

                            <span
                                className="
                                    absolute -right-1 -top-1
                                    h-4 w-4 rounded-full
                                    bg-[#FFD600]
                                    shadow-[0_0_12px_rgba(255,214,0,0.9)]
                                    animate-pulse
                                "
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1
                                    className="
                                        text-2xl font-bold tracking-tight
                                        text-[#082B5F]
                                    "
                                >
                                    UFR Beban
                                </h1>

                                <span
                                    className="
                                        rounded-full
                                        border border-[#BFE9FF]
                                        bg-[#EAF9FF]
                                        px-2.5 py-1
                                        text-[10px] font-bold uppercase
                                        tracking-wider text-[#008FC7]
                                    "
                                >
                                    Read Only
                                </span>
                            </div>

                            <p className="mt-1 text-sm font-medium text-[#718096]">
                                Pemantauan Beban UFR - UP2D
                            </p>
                        </div>
                    </div>

                    {/* REFRESH */}
                    <button
                        type="button"
                        onClick={() => loadData(pagination.page)}
                        disabled={loading}
                        className="
                            group flex items-center gap-2
                            rounded-lg
                            border border-[#BFD8FF]
                            bg-white
                            px-4 py-2.5
                            text-sm font-semibold
                            text-[#0066FF]
                            shadow-sm
                            transition-all duration-300
                            hover:-translate-y-0.5
                            hover:border-[#00BFFF]
                            hover:bg-[#F0F8FF]
                            hover:shadow-md hover:shadow-blue-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <RefreshCw
                            className={`
                                h-4 w-4 transition-transform duration-300
                                ${
                                    loading
                                        ? "animate-spin"
                                        : "group-hover:rotate-180"
                                }
                            `}
                        />

                        {loading ? "Memuat..." : "Refresh Data"}
                    </button>
                </div>
            </header>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <main
                className="
                    relative z-10
                    mx-auto flex w-full max-w-7xl
                    flex-1 flex-col overflow-hidden
                    p-8
                "
            >
                {/* =====================================================
                    CONTROLS
                ===================================================== */}
                <div
                    className="
                        mb-6 flex shrink-0
                        items-center justify-between gap-4
                    "
                >
                    {/* BEBAN SELECTOR */}
                    <div
                        className="
                            flex gap-1.5
                            rounded-xl
                            border border-[#CFE2FF]
                            bg-white/95
                            p-1.5
                            shadow-[0_4px_18px_rgba(0,102,255,0.07)]
                            backdrop-blur-sm
                        "
                    >
                        {bebans.map((b) => (
                            <BebanButton
                                key={b}
                                value={b}
                                active={beban === b}
                                onClick={() => setBeban(b)}
                            />
                        ))}
                    </div>

                    {/* SEARCH */}
                    <div className="relative w-80">
                        <div
                            className="
                                pointer-events-none absolute inset-y-0
                                left-0 flex items-center pl-3
                            "
                        >
                            <Search className="h-4 w-4 text-[#00AEEF]" />
                        </div>

                        <input
                            type="text"
                            className="
                                block w-full rounded-lg
                                border border-[#CFE2FF]
                                bg-white
                                py-2.5 pl-10 pr-4
                                text-sm text-[#082B5F]
                                shadow-sm
                                outline-none
                                placeholder:text-[#9AA9BC]
                                transition-all duration-300
                                focus:border-[#00BFFF]
                                focus:ring-2
                                focus:ring-[#00BFFF]/20
                                focus:shadow-[0_0_0_1px_rgba(0,191,255,0.15)]
                            "
                            placeholder="Cari Tag atau TRF..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* =====================================================
                    TABLE AREA
                ===================================================== */}
                <div
                    className="
                        flex flex-1 flex-col overflow-hidden
                        rounded-xl
                        border border-[#CFE2FF]
                        bg-white/95
                        shadow-[0_8px_30px_rgba(0,102,255,0.08)]
                        backdrop-blur-sm
                        animate-[ufrPageEnter_0.5s_ease-out]
                    "
                >
                    {/* TABLE */}
                    <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-[#CFE2FF] scrollbar-track-transparent">
                        <table className="w-full whitespace-nowrap text-left text-sm">
                            <thead
                                className="
                                    sticky top-0 z-10
                                    border-b border-[#CFE2FF]
                                    bg-[#F3F8FF]
                                    text-xs font-bold
                                    uppercase tracking-wider
                                    text-[#49627E]
                                    shadow-sm
                                "
                            >
                                <tr>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]" />
                                            Tag Name
                                        </div>
                                    </th>

                                    <th className="px-6 py-4">
                                        Target / TRF
                                    </th>

                                    <th className="px-6 py-4">
                                        Value
                                    </th>

                                    <th className="px-6 py-4">
                                        Quality
                                    </th>

                                    <th className="px-6 py-4">
                                        Waktu
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E7F0FC]">
                                {/* LOADING */}
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center text-[#718096]"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="
                                                        relative mb-4
                                                        flex h-12 w-12
                                                        items-center justify-center
                                                        rounded-full
                                                        bg-[#EAF5FF]
                                                    "
                                                >
                                                    <RefreshCw
                                                        className="
                                                            h-6 w-6
                                                            animate-spin
                                                            text-[#0066FF]
                                                        "
                                                    />

                                                    <span
                                                        className="
                                                            absolute -right-1 -top-1
                                                            h-3 w-3 rounded-full
                                                            bg-[#FFD600]
                                                            shadow-[0_0_8px_rgba(255,214,0,0.8)]
                                                            animate-pulse
                                                        "
                                                    />
                                                </div>

                                                <span className="font-semibold text-[#49627E]">
                                                    Memuat data UFR Beban {beban}...
                                                </span>

                                                <span className="mt-1 text-xs text-[#94A3B8]">
                                                    Mengambil data monitoring
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    /* EMPTY */
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center text-[#718096]"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div
                                                    className="
                                                        mb-4 flex h-14 w-14
                                                        items-center justify-center
                                                        rounded-2xl
                                                        border border-[#D8EAFF]
                                                        bg-[#F0F7FF]
                                                    "
                                                >
                                                    <Activity className="h-7 w-7 text-[#7DB8FF]" />
                                                </div>

                                                <span className="text-sm font-semibold text-[#49627E]">
                                                    Tidak ada data ditemukan
                                                </span>

                                                <span className="mt-1 text-xs text-[#94A3B8]">
                                                    Tidak ada data untuk Beban {beban}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    /* DATA */
                                    data.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className="
                                                group
                                                transition-all duration-200
                                                hover:bg-[#F4F9FF]
                                            "
                                        >
                                            {/* TAG NAME */}
                                            <td
                                                className="
                                                    bg-[#F8FBFF]
                                                    px-6 py-4
                                                    font-mono text-xs
                                                    font-semibold text-[#0066FF]
                                                    transition-colors
                                                    group-hover:bg-[#EEF7FF]
                                                "
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="
                                                            h-1.5 w-1.5 rounded-full
                                                            bg-[#00BFFF]
                                                            shadow-[0_0_6px_rgba(0,191,255,0.6)]
                                                        "
                                                    />
                                                    {row.tag_name || "-"}
                                                </div>
                                            </td>

                                            {/* TARGET */}
                                            <td className="px-6 py-4 font-medium text-[#253B53]">
                                                {row.target || "-"}
                                            </td>

                                            {/* VALUE */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className="
                                                        inline-flex items-center
                                                        rounded-md
                                                        border border-[#D8E8FA]
                                                        bg-[#F3F8FF]
                                                        px-2.5 py-1
                                                        font-mono text-xs
                                                        font-semibold text-[#31506F]
                                                    "
                                                >
                                                    {row.value ?? "-"}
                                                </span>
                                            </td>

                                            {/* QUALITY */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`
                                                        inline-flex items-center gap-1.5
                                                        rounded-md
                                                        border px-2.5 py-1
                                                        text-xs font-bold
                                                        ${
                                                            String(row.quality) === "1" ||
                                                            String(row.quality).toLowerCase() ===
                                                                "good"
                                                                ? `
                                                                    border-[#B8E6D0]
                                                                    bg-[#ECFBF3]
                                                                    text-[#18804B]
                                                                `
                                                                : `
                                                                    border-[#D8E2EE]
                                                                    bg-[#F4F7FA]
                                                                    text-[#65758B]
                                                                `
                                                        }
                                                    `}
                                                >
                                                    <span
                                                        className={`
                                                            h-1.5 w-1.5 rounded-full
                                                            ${
                                                                String(row.quality) === "1" ||
                                                                String(row.quality).toLowerCase() ===
                                                                    "good"
                                                                    ? "bg-[#20B26B]"
                                                                    : "bg-[#94A3B8]"
                                                            }
                                                        `}
                                                    />

                                                    {row.quality ?? "-"}
                                                </span>
                                            </td>

                                            {/* TIME */}
                                            <td className="px-6 py-4 text-xs text-[#718096]">
                                                {row.time
                                                    ? new Date(row.time).toLocaleString(
                                                          "id-ID"
                                                      )
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* =================================================
                        PAGINATION
                    ================================================= */}
                    <div
                        className="
                            flex shrink-0
                            items-center justify-between
                            border-t border-[#DCE9F8]
                            bg-[#F7FAFE]
                            px-6 py-4
                        "
                    >
                        <div className="text-sm text-[#718096]">
                            Menampilkan{" "}
                            <span className="font-bold text-[#082B5F]">
                                {data.length}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-[#082B5F]">
                                {pagination.total}
                            </span>{" "}
                            data
                        </div>

                        <div className="flex items-center gap-2">
                            {/* PREV */}
                            <button
                                type="button"
                                onClick={() =>
                                    loadData(pagination.page - 1)
                                }
                                disabled={
                                    pagination.page <= 1 || loading
                                }
                                className="
                                    rounded-lg
                                    border border-[#C9DCF4]
                                    bg-white
                                    px-3.5 py-2
                                    text-sm font-semibold
                                    text-[#49627E]
                                    shadow-sm
                                    transition-all duration-200
                                    hover:border-[#00BFFF]
                                    hover:bg-[#F0F8FF]
                                    hover:text-[#0066FF]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Prev
                            </button>

                            {/* PAGE */}
                            <div
                                className="
                                    rounded-lg
                                    border border-[#CFE2FF]
                                    bg-[#EEF6FF]
                                    px-3.5 py-2
                                    text-sm font-bold
                                    text-[#0066FF]
                                "
                            >
                                Halaman {pagination.page} dari{" "}
                                {pagination.totalPages || 1}
                            </div>

                            {/* NEXT */}
                            <button
                                type="button"
                                onClick={() =>
                                    loadData(pagination.page + 1)
                                }
                                disabled={
                                    pagination.page >=
                                        pagination.totalPages ||
                                    loading
                                }
                                className="
                                    rounded-lg
                                    border border-[#C9DCF4]
                                    bg-white
                                    px-3.5 py-2
                                    text-sm font-semibold
                                    text-[#49627E]
                                    shadow-sm
                                    transition-all duration-200
                                    hover:border-[#00BFFF]
                                    hover:bg-[#F0F8FF]
                                    hover:text-[#0066FF]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* =========================================================
                ANIMATIONS
            ========================================================= */}
            <style>{`
                @keyframes ufrBlobFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(20px, -18px) scale(1.06);
                    }
                }

                @keyframes ufrPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes ufrShimmer {
                    0% {
                        transform: translateX(-120%);
                    }
                    60%, 100% {
                        transform: translateX(120%);
                    }
                }
            `}</style>
        </div>
    );
}