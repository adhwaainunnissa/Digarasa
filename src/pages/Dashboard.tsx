import { useEffect, useState } from "react";
import {
    Activity,
    Database,
    Users,
    ShieldCheck,
    Server,
    ChevronRight,
    AlertCircle,
    BarChart3,
    Clock,
    Cpu
} from "lucide-react";
import api from "../api/axios";

interface DashboardStats {
    totalTables: number;
    totalUsers: number;
    databaseStatus: string;
}

function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const currentDate = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    useEffect(() => {
        const getDashboardStats = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/dashboard/stats");
                setStats(response.data);
            } catch (error) {
                console.error(
                    "Gagal mengambil statistik dashboard:",
                    error
                );
                setError(
                    "Failed to establish connection with telemetry server."
                );
            } finally {
                setLoading(false);
            }
        };

        getDashboardStats();
    }, []);

    const isDbConnected =
        stats?.databaseStatus === "Connected";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">

            {/* ================= ANIMATION STYLE ================= */}
            <style>
                {`
                    @keyframes fadeDown {
                        from {
                            opacity: 0;
                            transform: translateY(-15px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(25px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scale(0.92);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-4px);
                        }
                    }

                    @keyframes pulseGlow {
                        0%, 100% {
                            opacity: 1;
                            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                        }
                        50% {
                            opacity: 0.7;
                            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
                        }
                    }

                    @keyframes shimmer {
                        0% {
                            background-position: -500px 0;
                        }
                        100% {
                            background-position: 500px 0;
                        }
                    }

                    .animate-fade-down {
                        animation: fadeDown 0.7s ease-out both;
                    }

                    .animate-fade-up {
                        animation: fadeUp 0.7s ease-out both;
                    }

                    .animate-scale {
                        animation: scaleIn 0.6s ease-out both;
                    }

                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }

                    .animate-glow {
                        animation: pulseGlow 2s ease-in-out infinite;
                    }

                    .animate-delay-100 {
                        animation-delay: 100ms;
                    }

                    .animate-delay-200 {
                        animation-delay: 200ms;
                    }

                    .animate-delay-300 {
                        animation-delay: 300ms;
                    }

                    .animate-delay-400 {
                        animation-delay: 400ms;
                    }

                    .animate-delay-500 {
                        animation-delay: 500ms;
                    }

                    .skeleton {
                        background: linear-gradient(
                            90deg,
                            #f1f5f9 25%,
                            #e2e8f0 50%,
                            #f1f5f9 75%
                        );
                        background-size: 1000px 100%;
                        animation: shimmer 1.8s infinite linear;
                    }
                `}
            </style>

            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm animate-fade-down">
                <div className="mx-auto flex max-w-7xl items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white transition-all duration-300 hover:scale-110 hover:rotate-3">
                            <Activity className="h-5 w-5 animate-float" />
                        </div>

                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900">
                                FASOP Monitoring System
                            </h1>

                            <p className="text-xs font-medium text-slate-500">
                                PLN UP2B Ungaran
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">

                        <div className="hidden items-center gap-2 text-slate-500 md:flex">
                            <Clock className="h-4 w-4 animate-float" />
                            <span>{currentDate}</span>
                        </div>

                        <div className="h-5 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-2 font-medium">

                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:scale-110 hover:bg-blue-100 hover:text-blue-600">
                                {user?.username?.charAt(0).toUpperCase() || "A"}
                            </div>

                            <span className="hidden sm:inline-block">
                                {user?.nama_lengkap ||
                                    user?.username ||
                                    "Administrator"}
                            </span>

                        </div>
                    </div>
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* PAGE TITLE */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end animate-fade-up">

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            System Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Real-time telemetry and administrative control center.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">

                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-glow"></span>
                            </span>

                            System Online
                        </span>

                    </div>
                </div>

                {/* ================= ERROR ================= */}
                {error && (
                    <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-scale">

                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600 animate-pulse" />

                        <span className="font-medium">
                            {error}
                        </span>
                    </div>
                )}

                {/* ================= KPI ================= */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-28 rounded-xl border border-slate-200 bg-white skeleton"
                            ></div>
                        ))
                    ) : (
                        <>
                            {/* TABLE */}
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm opacity-0 animate-fade-up animate-delay-100 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

                                <div className="flex items-center justify-between">

                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Monitored Tables
                                    </h3>

                                    <Database className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />

                                </div>

                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-slate-900 transition-all duration-300 group-hover:text-blue-600">
                                        {stats?.totalTables ?? 0}
                                    </span>
                                </div>

                            </div>

                            {/* USERS */}
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm opacity-0 animate-fade-up animate-delay-200 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

                                <div className="flex items-center justify-between">

                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Active Admins
                                    </h3>

                                    <Users className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />

                                </div>

                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-slate-900 transition-all duration-300 group-hover:text-blue-600">
                                        {stats?.totalUsers ?? 0}
                                    </span>
                                </div>

                            </div>

                            {/* DATABASE */}
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm opacity-0 animate-fade-up animate-delay-300 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl">

                                <div className="flex items-center justify-between">

                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Database Status
                                    </h3>

                                    <Server
                                        className={`h-4 w-4 transition-transform duration-300 group-hover:scale-125 ${
                                            isDbConnected
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                        }`}
                                    />

                                </div>

                                <div className="mt-4 flex items-center gap-2">

                                    <div
                                        className={`h-2.5 w-2.5 rounded-full ${
                                            isDbConnected
                                                ? "bg-emerald-500"
                                                : "bg-red-500"
                                        }`}
                                    />

                                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                                        {stats?.databaseStatus || "Unknown"}
                                    </span>

                                </div>
                            </div>

                            {/* ACCESS */}
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm opacity-0 animate-fade-up animate-delay-400 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

                                <div className="flex items-center justify-between">

                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Access Level
                                    </h3>

                                    <ShieldCheck className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />

                                </div>

                                <div className="mt-4 flex items-baseline gap-2">

                                    <span className="text-lg font-semibold capitalize tracking-tight text-slate-900">
                                        {user?.role || "-"}
                                    </span>

                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ================= LOWER SECTION ================= */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* INFRASTRUCTURE */}
                    <div className="lg:col-span-2 opacity-0 animate-fade-up animate-delay-300">

                        <div className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Infrastructure Status
                                </h3>
                            </div>

                            <div className="p-6">

                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                                    <div className="flex items-start gap-4">

                                        <div
                                            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 ${
                                                isDbConnected
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            <Server className="h-5 w-5" />
                                        </div>

                                        <div>

                                            <h4 className="text-sm font-medium text-slate-900">
                                                Primary Database Node
                                            </h4>

                                            <p className="mt-1 text-sm text-slate-500">
                                                PostgreSQL instance running at local cluster.
                                            </p>

                                            <div className="mt-4 flex items-center gap-2">

                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        isDbConnected
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {isDbConnected
                                                        ? "Operational"
                                                        : "Critical Failure"}
                                                </span>

                                                <span className="text-xs text-slate-400">
                                                    Latency: ~12ms
                                                </span>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 border-t border-slate-100 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                                CPU Usage
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                <Cpu className="h-4 w-4 text-slate-400 animate-float" />
                                                <span className="font-mono text-sm font-medium text-slate-900">
                                                    14%
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                                Memory
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-slate-400 animate-pulse" />
                                                <span className="font-mono text-sm font-medium text-slate-900">
                                                    2.4 GB
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex flex-col gap-6 lg:col-span-1">

                        {/* QUICK OPERATIONS */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm opacity-0 animate-fade-up animate-delay-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Quick Operations
                                </h3>
                            </div>

                            <div className="p-2">

                                <a
                                    href="/database"
                                    className="group flex items-center justify-between rounded-md p-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:pl-5 hover:text-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <Database className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:scale-125" />
                                        Database Explorer
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>

                                <a
                                    href="/grafana"
                                    className="group flex items-center justify-between rounded-md p-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:pl-5 hover:text-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="h-4 w-4 text-orange-500 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-3" />
                                        Grafana Dashboards
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>

                            </div>
                        </div>

                        {/* CURRENT SESSION */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm opacity-0 animate-fade-up animate-delay-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Current Session
                                </h3>
                            </div>

                            <div className="p-6">

                                <dl className="space-y-4 text-sm">

                                    <div className="flex justify-between transition-transform duration-300 hover:translate-x-1">
                                        <dt className="text-slate-500">
                                            Username
                                        </dt>

                                        <dd className="font-medium text-slate-900">
                                            {user?.username || "-"}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between transition-transform duration-300 hover:translate-x-1">
                                        <dt className="text-slate-500">
                                            Full Name
                                        </dt>

                                        <dd className="font-medium text-slate-900">
                                            {user?.nama_lengkap || "-"}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between transition-transform duration-300 hover:translate-x-1">
                                        <dt className="text-slate-500">
                                            Role
                                        </dt>

                                        <dd className="font-medium capitalize text-slate-900">
                                            {user?.role || "-"}
                                        </dd>
                                    </div>

                                </dl>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;