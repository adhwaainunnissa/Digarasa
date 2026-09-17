import { useEffect, useState } from "react";
import api from "../api/axios";
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
    Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
    totalTables: number;
    totalUsers: number;
    databaseStatus: string;
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const currentDate = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/dashboard/stats");
                setStats(response.data);
            } catch (err) {
                console.error(err);
                setError(
                    "Failed to establish connection with telemetry server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const isDbConnected = stats?.databaseStatus === "Connected";

    return (
        <div className="min-h-screen overflow-hidden bg-[#F5F9FF] text-slate-800 relative">
            {/* =========================================================
                BACKGROUND DECORATION
            ========================================================= */}

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Blue Glow */}
                <motion.div
                    className="absolute -top-48 -right-40 h-[520px] w-[520px] rounded-full bg-[#0066FF]/10 blur-3xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Yellow Glow */}
                <motion.div
                    className="absolute top-[30%] -left-48 h-[480px] w-[480px] rounded-full bg-[#FFD600]/10 blur-3xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, 25, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Light Blue Glow */}
                <motion.div
                    className="absolute bottom-[-220px] right-[20%] h-[430px] w-[430px] rounded-full bg-[#00BFFF]/10 blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Small floating circles */}
                <motion.div
                    className="absolute top-[18%] right-[18%] h-3 w-3 rounded-full bg-[#FFD600]/50"
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                />

                <motion.div
                    className="absolute top-[65%] left-[15%] h-2 w-2 rounded-full bg-[#0066FF]/40"
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                    }}
                />
            </div>

            {/* =========================================================
                HEADER
            ========================================================= */}

            <motion.header
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/90 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* LOGO */}

                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{
                                scale: 1.08,
                                rotate: 3,
                            }}
                            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#FFD600] shadow-lg shadow-blue-500/20"
                        >
                            <Activity className="h-6 w-6 text-white" />

                            <motion.div
                                className="absolute inset-0 rounded-xl border-2 border-white/50"
                                animate={{
                                    scale: [1, 1.18, 1],
                                    opacity: [0.7, 0, 0.7],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        </motion.div>

                        <div>
                            <h1 className="text-lg font-bold text-[#082B5F]">
                                FASOP Monitoring System
                            </h1>

                            <p className="text-xs text-slate-500">
                                PLN UP2B Ungaran
                            </p>
                        </div>
                    </div>

                    {/* RIGHT HEADER */}

                    <div className="flex items-center gap-6">
                        <div className="hidden text-right md:block">
                            <p className="text-xs text-slate-400">
                                {currentDate}
                            </p>

                            <div className="mt-1 flex items-center justify-end gap-2">
                                <motion.span
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                    }}
                                    className="h-2 w-2 rounded-full bg-[#FFD600]"
                                />

                                <span className="text-xs font-bold text-[#0066FF]">
                                    SYSTEM ONLINE
                                </span>
                            </div>
                        </div>

                        <div className="hidden h-8 w-px bg-blue-100 md:block" />

                        <motion.div
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0066FF] to-[#00BFFF] font-bold text-white shadow-md shadow-blue-500/20">
                                {(user?.username || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-[#082B5F]">
                                    {user?.full_name ||
                                        user?.username ||
                                        "Admin"}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Administrator
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            {/* =========================================================
                MAIN
            ========================================================= */}

            <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
                {/* =====================================================
                    TITLE
                ===================================================== */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <motion.div
                                    animate={{
                                        scaleY: [1, 1.15, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#00BFFF] via-[#0066FF] to-[#FFD600]"
                                />

                                <h2 className="text-3xl font-extrabold tracking-tight text-[#082B5F]">
                                    System Overview
                                </h2>
                            </div>

                            <p className="ml-5 text-slate-500">
                                Real-time telemetry and administrative control
                                center.
                            </p>
                        </div>

                        {/* SYSTEM STATUS */}

                        <motion.div
                            whileHover={{
                                scale: 1.03,
                                y: -2,
                            }}
                            className="flex items-center gap-3 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.6, 1],
                                        opacity: [0.7, 0, 0.7],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="absolute inset-0 rounded-full bg-[#FFD600]"
                                />

                                <div className="relative h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
                            </div>

                            <span className="text-sm font-bold text-[#0066FF]">
                                All Systems Operational
                            </span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="mb-6"
                    >
                        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600">
                            <AlertCircle className="h-5 w-5" />

                            <span className="text-sm font-medium">
                                {error}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* =====================================================
                    KPI CARDS
                ===================================================== */}

                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* =================================================
                        TOTAL TABLES
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.15,
                        }}
                        whileHover={{
                            y: -7,
                            scale: 1.015,
                            boxShadow:
                                "0 20px 45px rgba(0,102,255,0.14)",
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                    >
                        {/* TOP LINE */}

                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00BFFF] to-[#0066FF]" />

                        {/* DECORATION */}

                        <motion.div
                            className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#0066FF]/5"
                            animate={{
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Monitored Tables
                                </p>

                                <motion.p
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        delay: 0.5,
                                    }}
                                    className="mt-2 text-3xl font-extrabold text-[#082B5F]"
                                >
                                    {loading
                                        ? "—"
                                        : stats?.totalTables ?? 0}
                                </motion.p>
                            </div>

                            <motion.div
                                whileHover={{
                                    rotate: 8,
                                    scale: 1.08,
                                }}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF] transition-all duration-300 group-hover:bg-[#0066FF] group-hover:text-white"
                            >
                                <Database className="h-5 w-5" />
                            </motion.div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className="rounded-md bg-blue-50 px-2 py-1 font-bold text-[#0066FF]">
                                Database
                            </span>

                            <span className="text-slate-400">
                                Active monitoring
                            </span>
                        </div>
                    </motion.div>

                    {/* =================================================
                        ACTIVE ADMINS
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.25,
                        }}
                        whileHover={{
                            y: -7,
                            scale: 1.015,
                            boxShadow:
                                "0 20px 45px rgba(255,214,0,0.18)",
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                    >
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#0066FF] to-[#FFD600]" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Active Admins
                                </p>

                                <motion.p
                                    initial={{
                                        opacity: 0,
                                        scale: 0.8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    transition={{
                                        delay: 0.6,
                                    }}
                                    className="mt-2 text-3xl font-extrabold text-[#082B5F]"
                                >
                                    {loading
                                        ? "—"
                                        : stats?.totalUsers ?? 0}
                                </motion.p>
                            </div>

                            <motion.div
                                whileHover={{
                                    rotate: -8,
                                    scale: 1.08,
                                }}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-[#D6A900] transition-all duration-300 group-hover:bg-[#FFD600] group-hover:text-[#082B5F]"
                            >
                                <Users className="h-5 w-5" />
                            </motion.div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className="rounded-md bg-yellow-50 px-2 py-1 font-bold text-[#B58900]">
                                Users
                            </span>

                            <span className="text-slate-400">
                                Registered access
                            </span>
                        </div>
                    </motion.div>

                    {/* =================================================
                        DATABASE
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.35,
                        }}
                        whileHover={{
                            y: -7,
                            scale: 1.015,
                            boxShadow:
                                "0 20px 45px rgba(0,102,255,0.14)",
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                    >
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FFD600] to-[#0066FF]" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Database Status
                                </p>

                                <motion.p
                                    animate={
                                        isDbConnected
                                            ? {
                                                  opacity: [
                                                      1,
                                                      0.6,
                                                      1,
                                                  ],
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className={`mt-3 text-xl font-extrabold ${
                                        isDbConnected
                                            ? "text-[#0066FF]"
                                            : "text-red-500"
                                    }`}
                                >
                                    {loading
                                        ? "Checking..."
                                        : stats?.databaseStatus ||
                                          "Unknown"}
                                </motion.p>
                            </div>

                            <motion.div
                                whileHover={{
                                    rotate: 8,
                                    scale: 1.08,
                                }}
                                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                                    isDbConnected
                                        ? "bg-blue-50 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                <Server className="h-5 w-5" />
                            </motion.div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span
                                className={`rounded-md px-2 py-1 font-bold ${
                                    isDbConnected
                                        ? "bg-yellow-50 text-[#B58900]"
                                        : "bg-red-50 text-red-500"
                                }`}
                            >
                                {isDbConnected
                                    ? "Healthy"
                                    : "Attention"}
                            </span>

                            <span className="text-slate-400">
                                Primary node
                            </span>
                        </div>
                    </motion.div>

                    {/* =================================================
                        ACCESS LEVEL
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.45,
                        }}
                        whileHover={{
                            y: -7,
                            scale: 1.015,
                            boxShadow:
                                "0 20px 45px rgba(255,214,0,0.18)",
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                    >
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00BFFF] to-[#FFD600]" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Access Level
                                </p>

                                <p className="mt-3 text-xl font-extrabold text-[#082B5F]">
                                    Administrator
                                </p>
                            </div>

                            <motion.div
                                whileHover={{
                                    rotate: -8,
                                    scale: 1.08,
                                }}
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-[#D6A900] transition-all duration-300 group-hover:bg-[#FFD600] group-hover:text-[#082B5F]"
                            >
                                <ShieldCheck className="h-5 w-5" />
                            </motion.div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs">
                            <span className="rounded-md bg-blue-50 px-2 py-1 font-bold text-[#0066FF]">
                                Secure
                            </span>

                            <span className="text-slate-400">
                                Full system access
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* =====================================================
                    INFRASTRUCTURE
                ===================================================== */}

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* LEFT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -30,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.5,
                        }}
                        className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm lg:col-span-2"
                    >
                        {/* TITLE */}

                        <div className="flex items-center justify-between border-b border-blue-50 px-6 py-5">
                            <div>
                                <h3 className="font-bold text-[#082B5F]">
                                    Infrastructure Status
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Core services and resource utilization
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                                <motion.span
                                    animate={{
                                        scale: [1, 1.4, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                    className="h-2 w-2 rounded-full bg-[#0066FF]"
                                />

                                <span className="text-xs font-bold text-[#0066FF]">
                                    LIVE
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* DATABASE NODE */}

                            <motion.div
                                whileHover={{
                                    scale: 1.01,
                                    x: 2,
                                }}
                                className="flex items-center justify-between rounded-xl border border-blue-50 bg-[#F5F9FF] p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        whileHover={{
                                            rotate: 8,
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#0066FF] shadow-sm"
                                    >
                                        <Database className="h-6 w-6" />
                                    </motion.div>

                                    <div>
                                        <p className="font-semibold text-[#082B5F]">
                                            Primary Database Node
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            PostgreSQL instance
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <motion.span
                                            animate={
                                                isDbConnected
                                                    ? {
                                                          scale: [
                                                              1,
                                                              1.4,
                                                              1,
                                                          ],
                                                      }
                                                    : {}
                                            }
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                            className={`h-2 w-2 rounded-full ${
                                                isDbConnected
                                                    ? "bg-[#FFD600]"
                                                    : "bg-red-500"
                                            }`}
                                        />

                                        <span
                                            className={`text-sm font-semibold ${
                                                isDbConnected
                                                    ? "text-[#0066FF]"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {isDbConnected
                                                ? "Operational"
                                                : "Critical Failure"}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Latency ~12ms
                                    </p>
                                </div>
                            </motion.div>

                            {/* RESOURCE */}

                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* CPU */}

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                    }}
                                    className="rounded-xl border border-blue-50 bg-white p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="h-4 w-4 text-[#0066FF]" />

                                            <span className="text-sm font-medium text-slate-600">
                                                CPU Utilization
                                            </span>
                                        </div>

                                        <span className="text-sm font-bold text-[#082B5F]">
                                            14%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-blue-50">
                                        <motion.div
                                            initial={{
                                                width: 0,
                                            }}
                                            animate={{
                                                width: "14%",
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                delay: 0.7,
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] to-[#0066FF]"
                                        />
                                    </div>
                                </motion.div>

                                {/* MEMORY */}

                                <motion.div
                                    whileHover={{
                                        y: -3,
                                    }}
                                    className="rounded-xl border border-blue-50 bg-white p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-[#D6A900]" />

                                            <span className="text-sm font-medium text-slate-600">
                                                Memory Usage
                                            </span>
                                        </div>

                                        <span className="text-sm font-bold text-[#082B5F]">
                                            2.4 GB
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-yellow-50">
                                        <motion.div
                                            initial={{
                                                width: 0,
                                            }}
                                            animate={{
                                                width: "32%",
                                            }}
                                            transition={{
                                                duration: 1.2,
                                                delay: 0.8,
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-[#FFD600] to-[#0066FF]"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* =================================================
                        QUICK OPERATIONS
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 30,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.55,
                        }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#082B5F] p-6 text-white shadow-xl shadow-blue-500/20"
                    >
                        {/* DECORATION */}

                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-white/10"
                        />

                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#FFD600]/10 blur-2xl"
                        />

                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                            }}
                            className="absolute right-10 top-10 h-20 w-20 rounded-full bg-white/5 blur-xl"
                        />

                        <div className="relative z-10">
                            <div className="mb-2 flex items-center gap-3">
                                <motion.div
                                    whileHover={{
                                        rotate: 8,
                                        scale: 1.08,
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD600] text-[#082B5F] shadow-lg shadow-yellow-500/20"
                                >
                                    <Activity className="h-5 w-5" />
                                </motion.div>

                                <div>
                                    <h3 className="font-bold">
                                        Quick Operations
                                    </h3>

                                    <p className="text-xs text-blue-100">
                                        Access system modules
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {/* DATABASE */}

                                <motion.a
                                    href="/database"
                                    whileHover={{
                                        x: 5,
                                        scale: 1.015,
                                    }}
                                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15"
                                >
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-[#FFD600]" />

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Database Management
                                            </p>

                                            <p className="text-xs text-blue-100">
                                                Manage system tables
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-blue-100" />
                                </motion.a>

                                {/* GRAFANA */}

                                <motion.a
                                    href="/grafana"
                                    whileHover={{
                                        x: 5,
                                        scale: 1.015,
                                    }}
                                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15"
                                >
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="h-5 w-5 text-[#FFD600]" />

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Grafana Monitoring
                                            </p>

                                            <p className="text-xs text-blue-100">
                                                View telemetry dashboards
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight className="h-4 w-4 text-blue-100" />
                                </motion.a>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-5">
                                <div className="flex items-center gap-2 text-xs text-blue-100">
                                    <Clock className="h-4 w-4 text-[#FFD600]" />

                                    <span>
                                        Data refreshes automatically
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* =====================================================
                    CURRENT SESSION
                ===================================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.65,
                    }}
                    whileHover={{
                        scale: 1.005,
                    }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#082B5F] via-[#0066FF] to-[#00AEEF] p-6 text-white shadow-lg shadow-blue-500/20"
                >
                    {/* GLOW */}

                    <motion.div
                        animate={{
                            x: [0, 40, 0],
                            opacity: [0.15, 0.3, 0.15],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-[#FFD600]/20 blur-3xl"
                    />

                    <motion.div
                        animate={{
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#00BFFF]/20 blur-3xl"
                    />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <motion.div
                                    whileHover={{
                                        rotate: 8,
                                        scale: 1.08,
                                    }}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFD600] text-[#082B5F]"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                </motion.div>

                                <h3 className="text-lg font-bold">
                                    Current Session
                                </h3>
                            </div>

                            <p className="text-sm text-blue-100">
                                Your administrative session is active and
                                secured.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* USERNAME */}

                            <motion.div
                                whileHover={{
                                    y: -3,
                                }}
                                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-blue-200">
                                    Username
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {user?.username || "—"}
                                </p>
                            </motion.div>

                            {/* FULL NAME */}

                            <motion.div
                                whileHover={{
                                    y: -3,
                                }}
                                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-blue-200">
                                    Full Name
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {user?.full_name || "—"}
                                </p>
                            </motion.div>

                            {/* ROLE */}

                            <motion.div
                                whileHover={{
                                    y: -3,
                                    scale: 1.03,
                                }}
                                className="rounded-xl bg-[#FFD600] px-4 py-3 text-[#082B5F] shadow-lg shadow-yellow-500/20"
                            >
                                <p className="text-[10px] uppercase tracking-wider text-[#6B5600]">
                                    Role
                                </p>

                                <p className="mt-1 text-sm font-bold">
                                    Administrator
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* =========================================================
                FOOTER
            ========================================================= */}

            <motion.footer
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 1,
                }}
                className="relative z-10 mx-auto max-w-7xl px-6 py-6"
            >
                <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
                    <p>
                        FASOP Monitoring System • PLN UP2B Ungaran
                    </p>

                    <div className="flex items-center gap-2">
                        <span>Powered by</span>

                        <span className="font-bold text-[#0066FF]">
                            FASOP
                        </span>

                        <motion.span
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.5, 1],
                            }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                            }}
                            className="text-[#FFD600]"
                        >
                            ●
                        </motion.span>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default Dashboard;