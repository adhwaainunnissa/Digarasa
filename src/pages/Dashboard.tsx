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

    // Format current date/time for the header
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const getDashboardStats = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/dashboard/stats");
                setStats(response.data);
            } catch (error) {
                console.error("Gagal mengambil statistik dashboard:", error);
                setError("Failed to establish connection with telemetry server.");
            } finally {
                setLoading(false);
            }
        };

        getDashboardStats();
    }, []);

    const isDbConnected = stats?.databaseStatus === "Connected";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
            {/* Header Navigation / Topbar */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white">
                            <Activity className="h-5 w-5" />
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
                            <Clock className="h-4 w-4" />
                            <span>{currentDate}</span>
                        </div>
                        <div className="h-5 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2 font-medium">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                {user?.username?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <span className="hidden sm:inline-block">{user?.nama_lengkap || user?.username || "Administrator"}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* Page Title & Actions */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Overview</h2>
                        <p className="mt-1 text-sm text-slate-500">Real-time telemetry and administrative control center.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            System Online
                        </span>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* KPI Statistics Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white"></div>
                        ))
                    ) : (
                        <>
                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Monitored Tables</h3>
                                    <Database className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-slate-900">{stats?.totalTables ?? 0}</span>
                                </div>
                            </div>

                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Active Admins</h3>
                                    <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-slate-900">{stats?.totalUsers ?? 0}</span>
                                </div>
                            </div>

                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Database Status</h3>
                                    <Server className={`h-4 w-4 ${isDbConnected ? 'text-emerald-600' : 'text-red-600'}`} />
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${isDbConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                                        {stats?.databaseStatus || "Unknown"}
                                    </span>
                                </div>
                            </div>

                            <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">Access Level</h3>
                                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-lg font-semibold capitalize tracking-tight text-slate-900">{user?.role || "-"}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* Database & Infrastructure */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">Infrastructure Status</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isDbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <Server className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900">Primary Database Node</h4>
                                            <p className="mt-1 text-sm text-slate-500">PostgreSQL instance running at local cluster.</p>

                                            <div className="mt-4 flex items-center gap-2">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isDbConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {isDbConnected ? 'Operational' : 'Critical Failure'}
                                                </span>
                                                <span className="text-xs text-slate-400">Latency: ~12ms</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 border-t border-slate-100 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">CPU Usage</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Cpu className="h-4 w-4 text-slate-400" />
                                                <span className="font-mono text-sm font-medium text-slate-900">14%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Memory</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Activity className="h-4 w-4 text-slate-400" />
                                                <span className="font-mono text-sm font-medium text-slate-900">2.4 GB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access & System Info */}
                    <div className="flex flex-col gap-6 lg:col-span-1">

                        {/* Quick Access */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">Quick Operations</h3>
                            </div>
                            <div className="p-2">
                                <a
                                    href="/database"
                                    className="flex items-center justify-between rounded-md p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <Database className="h-4 w-4 text-blue-600" />
                                        Database Explorer
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </a>
                                <a
                                    href="/grafana"
                                    className="flex items-center justify-between rounded-md p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="h-4 w-4 text-orange-500" />
                                        Grafana Dashboards
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </a>
                            </div>
                        </div>

                        {/* Admin Info */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4">
                                <h3 className="text-sm font-semibold text-slate-900">Current Session</h3>
                            </div>
                            <div className="p-6">
                                <dl className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Username</dt>
                                        <dd className="font-medium text-slate-900">{user?.username || "-"}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Full Name</dt>
                                        <dd className="font-medium text-slate-900">{user?.nama_lengkap || "-"}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-slate-500">Role</dt>
                                        <dd className="font-medium capitalize text-slate-900">{user?.role || "-"}</dd>
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