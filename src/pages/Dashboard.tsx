import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
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
        <div className="flex min-h-screen bg-gray-100">

            {/* ====================================
                SIDEBAR
            ==================================== */}

            <Sidebar />


            {/* ====================================
                MAIN CONTENT
            ==================================== */}

            <div className="flex min-w-0 flex-1 flex-col">

                {/* NAVBAR */}

                <Navbar />


                {/* CONTENT */}

                <main className="p-6 md:p-8">

                    {/* ====================================
                        HEADER
                    ==================================== */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Dashboard Monitoring
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Selamat datang,{" "}
                            <span className="font-semibold text-gray-700">
                                {user?.nama_lengkap ||
                                    user?.username ||
                                    "Administrator"}
                            </span>
                        </p>

                    </div>


                    {/* ====================================
                        ERROR
                    ==================================== */}

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                            {error}
                        </div>
                    )}


                    {/* ====================================
                        STATISTICS
                    ==================================== */}

                    {loading ? (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            <div className="h-32 animate-pulse rounded-xl bg-white" />
                            <div className="h-32 animate-pulse rounded-xl bg-white" />
                            <div className="h-32 animate-pulse rounded-xl bg-white" />
                            <div className="h-32 animate-pulse rounded-xl bg-white" />

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            <Card
                                title="Total Tabel"
                                value={
                                    stats?.totalTables ??
                                    0
                                }
                                color="bg-blue-500"
                            />

                            <Card
                                title="Total Admin"
                                value={
                                    stats?.totalUsers ??
                                    0
                                }
                                color="bg-green-500"
                            />

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

                            <Card
                                title="Role Anda"
                                value={
                                    user?.role ||
                                    "-"
                                }
                                color="bg-yellow-500"
                            />

                        </div>

                    )}


                    {/* ====================================
                        DATABASE STATUS
                    ==================================== */}

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Database Status
                            </h2>

                            <div className="mt-6 flex items-center gap-4">

                                <div
                                    className={`h-4 w-4 rounded-full ${
                                        stats?.databaseStatus ===
                                        "Connected"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                />

                                <div>

                                    <p className="font-semibold text-gray-800">
                                        {stats?.databaseStatus ||
                                            "Checking..."}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        PostgreSQL
                                        database
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-semibold text-gray-800">
                                Informasi Sistem
                            </h2>

                            <div className="mt-6 space-y-3 text-sm">

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Username
                                    </span>

                                    <span className="font-medium text-gray-800">
                                        {user?.username ||
                                            "-"}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Nama Lengkap
                                    </span>

                                    <span className="font-medium text-gray-800">
                                        {user?.nama_lengkap ||
                                            "-"}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Role
                                    </span>

                                    <span className="font-medium capitalize text-gray-800">
                                        {user?.role ||
                                            "-"}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ====================================
                        QUICK ACCESS
                    ==================================== */}

                    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Quick Access
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Akses cepat ke fitur utama
                            sistem.
                        </p>


                        <div className="mt-6 flex flex-wrap gap-4">

                            <a
                                href="/database"
                                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                Database Explorer
                            </a>

                            <a
                                href="/grafana"
                                className="rounded-lg bg-gray-800 px-5 py-3 font-medium text-white transition hover:bg-gray-900"
                            >
                                Buka Grafana
                            </a>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;