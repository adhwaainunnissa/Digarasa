import { useEffect, useState } from "react";

import Card from "../components/Card";
import api from "../api/axios";

interface DashboardStats {
    totalTables: number;
    totalUsers: number;
    databaseStatus: string;
}

function Dashboard() {

    const [stats, setStats] =
        useState<DashboardStats | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    // ========================================
    // GET DASHBOARD STATS
    // ========================================

    useEffect(() => {

        const getDashboardStats = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/dashboard/stats"
                    );

                setStats(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Gagal mengambil statistik dashboard:",
                    error
                );

                setError(
                    "Gagal mengambil data dashboard."
                );

            } finally {

                setLoading(false);

            }

        };

        getDashboardStats();

    }, []);


    return (

        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-gradient-to-br
                from-blue-50
                via-gray-50
                to-yellow-50
            "
        >

            {/* ========================================
                BACKGROUND DECORATION
            ======================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-72
                    w-72
                    animate-pulse
                    rounded-full
                    bg-yellow-200
                    opacity-30
                    blur-3xl
                "
            ></div>


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-20
                    h-80
                    w-80
                    animate-pulse
                    rounded-full
                    bg-blue-200
                    opacity-30
                    blur-3xl
                "
            ></div>


            <div
                className="
                    pointer-events-none
                    absolute
                    right-1/3
                    top-1/3
                    h-40
                    w-40
                    animate-pulse
                    rounded-full
                    bg-yellow-100
                    opacity-20
                    blur-3xl
                "
            ></div>


            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <div className="relative z-10 flex min-w-0 flex-1 flex-col">

                <main className="p-6 md:p-8">


                    {/* ========================================
                        HEADER
                    ======================================== */}

                    <div
                        className="
                            mb-8
                            rounded-2xl
                            border
                            border-blue-100
                            bg-white/80
                            p-6
                            shadow-sm
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:shadow-md
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    animate-pulse
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-700
                                    text-2xl
                                    shadow-lg
                                    shadow-blue-700/20
                                "
                            >
                                ⚡
                            </div>


                            <div>

                                <h1
                                    className="
                                        text-3xl
                                        font-bold
                                        text-blue-950
                                    "
                                >
                                    Dashboard Monitoring
                                </h1>

                                <p className="mt-2 text-gray-500">

                                    Selamat datang,{" "}

                                    <span
                                        className="
                                            font-semibold
                                            text-blue-700
                                        "
                                    >
                                        {user?.nama_lengkap ||
                                            user?.username ||
                                            "Administrator"}
                                    </span>

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ========================================
                        ERROR
                    ======================================== */}

                    {error && (

                        <div
                            className="
                                mb-6
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-4
                                text-red-700
                                shadow-sm
                            "
                        >

                            <span className="text-xl">
                                ⚠️
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ========================================
                        STATISTICS
                    ======================================== */}

                    {loading ? (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            <div
                                className="
                                    h-36
                                    animate-pulse
                                    rounded-2xl
                                    bg-white
                                    shadow-sm
                                "
                            />

                            <div
                                className="
                                    h-36
                                    animate-pulse
                                    rounded-2xl
                                    bg-white
                                    shadow-sm
                                "
                            />

                            <div
                                className="
                                    h-36
                                    animate-pulse
                                    rounded-2xl
                                    bg-white
                                    shadow-sm
                                "
                            />

                            <div
                                className="
                                    h-36
                                    animate-pulse
                                    rounded-2xl
                                    bg-white
                                    shadow-sm
                                "
                            />

                        </div>

                    ) : (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {/* TOTAL TABEL */}

                            <div
                                className="
                                    rounded-2xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:scale-[1.02]
                                    hover:shadow-xl
                                "
                            >

                                <Card
                                    title="Total Tabel"
                                    value={
                                        stats?.totalTables ?? 0
                                    }
                                    color="bg-blue-500"
                                />

                            </div>


                            {/* TOTAL ADMIN */}

                            <div
                                className="
                                    rounded-2xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:scale-[1.02]
                                    hover:shadow-xl
                                "
                            >

                                <Card
                                    title="Total Admin"
                                    value={
                                        stats?.totalUsers ?? 0
                                    }
                                    color="bg-green-500"
                                />

                            </div>


                            {/* DATABASE */}

                            <div
                                className="
                                    rounded-2xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:scale-[1.02]
                                    hover:shadow-xl
                                "
                            >

                                <Card
                                    title="Database"
                                    value={
                                        stats?.databaseStatus ||
                                        "Unknown"
                                    }
                                    color={
                                        stats?.databaseStatus ===
                                        "Connected"
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                    }
                                />

                            </div>


                            {/* ROLE */}

                            <div
                                className="
                                    rounded-2xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:scale-[1.02]
                                    hover:shadow-xl
                                "
                            >

                                <Card
                                    title="Role Anda"
                                    value={
                                        user?.role || "-"
                                    }
                                    color="bg-yellow-500"
                                />

                            </div>

                        </div>

                    )}


                    {/* ========================================
                        DATABASE STATUS + SYSTEM INFO
                    ======================================== */}

                    <div
                        className="
                            mt-8
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-2
                        "
                    >


                        {/* DATABASE STATUS */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >

                            <div className="flex items-center justify-between">

                                <h2
                                    className="
                                        text-xl
                                        font-semibold
                                        text-blue-950
                                    "
                                >
                                    Database Status
                                </h2>

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-green-50
                                        transition-transform
                                        duration-300
                                        group-hover:rotate-12
                                    "
                                >
                                    🗄️
                                </div>

                            </div>


                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    gap-4
                                "
                            >

                                <div
                                    className={`
                                        h-5
                                        w-5
                                        rounded-full
                                        ${
                                            stats?.databaseStatus ===
                                            "Connected"
                                                ? "animate-pulse bg-green-500 shadow-lg shadow-green-500/40"
                                                : "animate-pulse bg-red-500 shadow-lg shadow-red-500/40"
                                        }
                                    `}
                                />

                                <div>

                                    <p
                                        className="
                                            font-semibold
                                            text-gray-800
                                        "
                                    >
                                        {stats?.databaseStatus ||
                                            "Checking..."}
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        PostgreSQL database
                                    </p>

                                </div>

                            </div>


                            {/* STATUS BAR */}

                            <div
                                className="
                                    mt-6
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-gray-100
                                "
                            >

                                <div
                                    className={`
                                        h-full
                                        rounded-full
                                        transition-all
                                        duration-1000
                                        ${
                                            stats?.databaseStatus ===
                                            "Connected"
                                                ? "w-full bg-green-500"
                                                : "w-1/3 bg-red-500"
                                        }
                                    `}
                                ></div>

                            </div>

                        </div>


                        {/* INFORMASI SISTEM */}

                        <div
                            className="
                                group
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >

                            <div className="flex items-center justify-between">

                                <h2
                                    className="
                                        text-xl
                                        font-semibold
                                        text-blue-950
                                    "
                                >
                                    Informasi Sistem
                                </h2>

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-yellow-50
                                        transition-transform
                                        duration-300
                                        group-hover:rotate-12
                                    "
                                >
                                    👤
                                </div>

                            </div>


                            <div className="mt-6 space-y-4">


                                {/* USERNAME */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        bg-gray-50
                                        px-4
                                        py-3
                                        transition-all
                                        duration-300
                                        hover:bg-blue-50
                                    "
                                >

                                    <span className="text-gray-500">
                                        Username
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {user?.username || "-"}
                                    </span>

                                </div>


                                {/* NAMA LENGKAP */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        bg-gray-50
                                        px-4
                                        py-3
                                        transition-all
                                        duration-300
                                        hover:bg-blue-50
                                    "
                                >

                                    <span className="text-gray-500">
                                        Nama Lengkap
                                    </span>

                                    <span className="font-semibold text-gray-800">
                                        {user?.nama_lengkap || "-"}
                                    </span>

                                </div>


                                {/* ROLE */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        bg-gray-50
                                        px-4
                                        py-3
                                        transition-all
                                        duration-300
                                        hover:bg-yellow-50
                                    "
                                >

                                    <span className="text-gray-500">
                                        Role
                                    </span>

                                    <span
                                        className="
                                            font-semibold
                                            capitalize
                                            text-gray-800
                                        "
                                    >
                                        {user?.role || "-"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ========================================
                        QUICK ACCESS
                    ======================================== */}

                    <div
                        className="
                            group
                            mt-8
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-100
                            bg-white
                            p-6
                            shadow-sm
                            transition-all
                            duration-300
                            hover:shadow-xl
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <h2
                                    className="
                                        text-xl
                                        font-semibold
                                        text-blue-950
                                    "
                                >
                                    Quick Access
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    Akses cepat ke fitur utama
                                    sistem.
                                </p>

                            </div>


                            <div
                                className="
                                    hidden
                                    h-12
                                    w-12
                                    animate-pulse
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-yellow-100
                                    text-2xl
                                    sm:flex
                                "
                            >
                                ⚡
                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                gap-4
                            "
                        >

                            {/* DATABASE */}

                            <a
                                href="/database"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-700
                                    px-6
                                    py-3
                                    font-semibold
                                    text-white
                                    shadow-md
                                    shadow-blue-700/20
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-blue-800
                                    hover:shadow-xl
                                    active:scale-95
                                "
                            >

                                <span className="text-lg">
                                    🗄️
                                </span>

                                <span>
                                    Database Explorer
                                </span>

                            </a>


                            {/* ========================================
                                GRAFANA
                            ======================================== */}

                            <a
                                href="/grafana"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    bg-gray-900
                                    px-6
                                    py-3
                                    font-semibold
                                    text-white
                                    shadow-md
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-gray-800
                                    hover:shadow-xl
                                    active:scale-95
                                "
                            >

                                {/* LOGO GRAFANA */}

                                <img
                                    src="/logo gravana.png"
                                    alt="Grafana"
                                    className="
                                        h-7
                                        w-7
                                        object-contain
                                        transition-all
                                        duration-300
                                        group-hover:scale-110
                                        group-hover:rotate-6
                                    "
                                />

                                <span>
                                    Buka Grafana
                                </span>

                            </a>

                        </div>

                    </div>


                    {/* ========================================
                        FOOTER
                    ======================================== */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-xs
                            text-gray-400
                        "
                    >

                        <span
                            className="
                                h-2
                                w-2
                                animate-pulse
                                rounded-full
                                bg-green-500
                            "
                        ></span>

                        <span>
                            FASOP Monitoring System • PLN UP2B Ungaran
                        </span>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;