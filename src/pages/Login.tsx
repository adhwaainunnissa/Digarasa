import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    ShieldCheck,
    Activity,
    Cpu,
    Zap,
    Database,
    Server,
    Gauge,
    Wifi,
    ChevronRight,
    BarChart3,
    CircleDot,
} from "lucide-react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

import api from "../api/axios";
import AuthForm from "../components/AuthForm";

function Login() {
    const navigate = useNavigate();

    // =========================================================
    // LOGIN STATE
    // =========================================================

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [showTransition, setShowTransition] = useState(false);

    // =========================================================
    // INTERACTIVE DASHBOARD STATE
    // =========================================================

    const [activeMenu, setActiveMenu] = useState("Overview");

    const [systemLoad, setSystemLoad] = useState(99.98);
    const [latency, setLatency] = useState(12);
    const [frequency, setFrequency] = useState(50.01);

    // =========================================================
    // MOUSE INTERACTION
    // =========================================================

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, {
        stiffness: 120,
        damping: 20,
        mass: 0.5,
    });

    const smoothY = useSpring(mouseY, {
        stiffness: 120,
        damping: 20,
        mass: 0.5,
    });

    const rotateX = useTransform(smoothY, [-1, 1], [5, -5]);
    const rotateY = useTransform(smoothX, [-1, 1], [-5, 5]);

    const glowX = useTransform(smoothX, [-1, 1], ["15%", "85%"]);
    const glowY = useTransform(smoothY, [-1, 1], ["15%", "85%"]);

    const handleMouseMove = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        const y =
            ((event.clientY - rect.top) / rect.height) * 2 - 1;

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // =========================================================
    // LIVE TELEMETRY
    // =========================================================

    useEffect(() => {
        const interval = setInterval(() => {
            setSystemLoad(
                Number((99.7 + Math.random() * 0.29).toFixed(2))
            );

            setLatency(
                Math.floor(9 + Math.random() * 7)
            );

            setFrequency(
                Number((49.98 + Math.random() * 0.06).toFixed(2))
            );
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    // =========================================================
    // LOGIN HANDLER
    // =========================================================

    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                username,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            setLoginSuccess(true);

            setTimeout(() => {
                setShowTransition(true);

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1200);
            }, 600);
        } catch (error: any) {
            console.error("Login gagal:", error);

            setError(
                error?.response?.data?.message ||
                    "Username atau password salah."
            );

            setLoading(false);
        }
    };

    // =========================================================
    // MENU DATA
    // =========================================================

    const menuItems = [
        {
            label: "Overview",
            icon: BarChart3,
        },
        {
            label: "Telemetry",
            icon: Activity,
        },
        {
            label: "Infrastructure",
            icon: Server,
        },
        {
            label: "Security",
            icon: ShieldCheck,
        },
    ];

    // =========================================================
    // CHART DATA
    // =========================================================

    const chartData = [
        38,
        52,
        45,
        67,
        58,
        76,
        62,
        84,
        70,
        91,
        78,
        96,
        82,
        88,
        73,
        94,
        81,
        98,
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-gray-100 selection:bg-blue-500 selection:text-white">

            {/* =====================================================
                SUCCESS TRANSITION
            ===================================================== */}

            <motion.div
                initial={{ y: "100%" }}
                animate={{
                    y: showTransition ? "0%" : "100%",
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.87, 0, 0.13, 1],
                }}
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-blue-950"
            >
                {/* Glow */}

                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                    className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]"
                />

                <div className="relative z-10 flex flex-col items-center text-center">

                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{
                            scale: showTransition ? 1 : 0,
                            rotate: showTransition ? 0 : -30,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 180,
                            damping: 15,
                        }}
                        className="mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl"
                    >
                        <CheckCircle2 className="h-12 w-12 text-blue-400" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: showTransition ? 1 : 0,
                            y: showTransition ? 0 : 20,
                        }}
                        className="text-3xl font-bold tracking-tight"
                    >
                        Authentication Successful
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: showTransition ? 1 : 0,
                        }}
                        transition={{ delay: 0.15 }}
                        className="mt-2 text-blue-200"
                    >
                        Preparing your secure environment...
                    </motion.p>

                    <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{
                                width: showTransition ? "100%" : "0%",
                            }}
                            transition={{
                                duration: 1.1,
                                ease: "easeInOut",
                            }}
                            className="h-full bg-blue-400"
                        />
                    </div>
                </div>
            </motion.div>

            {/* =====================================================
                MAIN GRID
            ===================================================== */}

            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

                {/* =================================================
                    LEFT - LOGIN
                ================================================= */}

                <div className="relative z-20 flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 lg:p-12">

                    {/* Background blobs */}

                    <div className="pointer-events-none absolute inset-0 overflow-hidden">

                        <motion.div
                            animate={{
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]"
                        />

                        <motion.div
                            animate={{
                                x: [0, -40, 0],
                                y: [0, 40, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 12,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-yellow-100/70 blur-[100px]"
                        />

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]" />
                    </div>

                    {/* Login Content */}

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
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                        className="relative z-10 w-full max-w-2xl"
                    >
                        <AuthForm
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            onSubmit={handleLogin}
                            loading={loading}
                            error={error}
                            isSuccess={loginSuccess}
                        />
                    </motion.div>

                    {/* Copyright */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-6 left-0 w-full text-center text-xs font-medium text-gray-400"
                    >
                        © {new Date().getFullYear()} PLN Persero. All rights reserved.
                    </motion.div>
                </div>

                {/* =================================================
                    RIGHT - INTERACTIVE SYSTEM
                ================================================= */}

                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#020617] p-10 lg:flex"
                >

                    {/* =================================================
                        BACKGROUND
                    ================================================= */}

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_60%)]" />

                    <motion.div
                        animate={{
                            scale: [1, 1.25, 1],
                            opacity: [0.25, 0.55, 0.25],
                            x: [0, 50, 0],
                            y: [0, -40, 0],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute left-[10%] top-[15%] h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[120px]"
                    />

                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.15, 0.4, 0.15],
                            x: [0, -60, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 11,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-[5%] right-[5%] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[130px]"
                    />

                    {/* Grid */}

                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                            backgroundSize: "45px 45px",
                        }}
                    />

                    {/* =================================================
                        CURSOR GLOW
                    ================================================= */}

                    <motion.div
                        style={{
                            left: glowX,
                            top: glowY,
                        }}
                        className="pointer-events-none absolute z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[90px]"
                    />

                    {/* =================================================
                        DECORATIVE FLOATING ELEMENTS
                    ================================================= */}

                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                            rotate: [0, 2, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute left-[7%] top-[20%] hidden xl:block"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md">
                            <CircleDot className="h-3 w-3 text-emerald-400" />
                            <span className="text-[10px] font-medium text-slate-300">
                                SYSTEM ONLINE
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-[20%] right-[7%] hidden xl:block"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-md">
                            <Wifi className="h-3 w-3 text-cyan-400" />
                            <span className="text-[10px] font-medium text-slate-300">
                                CONNECTED
                            </span>
                        </div>
                    </motion.div>

                    {/* =================================================
                        MAIN 3D DASHBOARD
                    ================================================= */}

                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0.88,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                        }}
                        className="relative z-20 w-full max-w-[650px] [transform-style:preserve-3d]"
                    >

                        {/* Outer glow */}

                        <div className="absolute -inset-6 rounded-[30px] bg-blue-500/10 blur-3xl" />

                        {/* Dashboard */}

                        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#080f22]/90 shadow-2xl shadow-blue-950/60 backdrop-blur-2xl">

                            {/* TOP LIGHT */}

                            <motion.div
                                animate={{
                                    x: ["-100%", "200%"],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                            />

                            {/* HEADER */}

                            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                    </div>

                                    <div className="h-4 w-px bg-white/10" />

                                    <div>
                                        <p className="text-[11px] font-semibold text-white">
                                            PLN UP2B Ungaran
                                        </p>
                                        <p className="text-[8px] tracking-wider text-slate-500">
                                            FASOP MONITORING SYSTEM
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-2">

                                    <motion.div
                                        animate={{
                                            opacity: [1, 0.3, 1],
                                        }}
                                        transition={{
                                            duration: 1.4,
                                            repeat: Infinity,
                                        }}
                                        className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                                    />

                                    <span className="text-[9px] font-medium text-emerald-400">
                                        LIVE
                                    </span>

                                </div>
                            </div>

                            {/* BODY */}

                            <div className="flex min-h-[430px]">

                                {/* SIDEBAR */}

                                <div className="hidden w-[150px] border-r border-white/[0.07] bg-black/10 p-3 sm:block">

                                    <div className="mb-5 px-2 pt-1">

                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                                                <Zap className="h-4 w-4 text-blue-400" />
                                            </div>

                                            <div>
                                                <p className="text-[9px] font-bold text-white">
                                                    FASOP
                                                </p>
                                                <p className="text-[7px] text-slate-500">
                                                    Monitoring
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    <p className="mb-2 px-2 text-[7px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                                        Navigation
                                    </p>

                                    <div className="space-y-1">

                                        {menuItems.map(
                                            (item) => {
                                                const Icon =
                                                    item.icon;

                                                const isActive =
                                                    activeMenu ===
                                                    item.label;

                                                return (
                                                    <motion.button
                                                        key={
                                                            item.label
                                                        }
                                                        whileHover={{
                                                            x: 3,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.97,
                                                        }}
                                                        onClick={() =>
                                                            setActiveMenu(
                                                                item.label
                                                            )
                                                        }
                                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-all ${
                                                            isActive
                                                                ? "bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/5"
                                                                : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
                                                        }`}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" />

                                                        <span className="text-[8px] font-medium">
                                                            {
                                                                item.label
                                                            }
                                                        </span>

                                                        {isActive && (
                                                            <ChevronRight className="ml-auto h-3 w-3" />
                                                        )}
                                                    </motion.button>
                                                );
                                            }
                                        )}

                                    </div>

                                    <div className="mt-8 border-t border-white/[0.06] pt-4">

                                        <p className="mb-2 px-2 text-[7px] uppercase tracking-wider text-slate-600">
                                            System
                                        </p>

                                        <div className="space-y-2 px-2">

                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[7px] text-slate-500">
                                                    Server
                                                </span>
                                                <span className="ml-auto text-[7px] text-emerald-400">
                                                    OK
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[7px] text-slate-500">
                                                    Database
                                                </span>
                                                <span className="ml-auto text-[7px] text-emerald-400">
                                                    OK
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                                {/* CONTENT */}

                                <div className="flex-1 p-4 sm:p-5">

                                    {/* TITLE */}

                                    <div className="mb-5 flex items-start justify-between">

                                        <div>
                                            <motion.p
                                                key={activeMenu}
                                                initial={{
                                                    opacity: 0,
                                                    x: -10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                className="text-[8px] text-slate-500"
                                            >
                                                Dashboard /{" "}
                                                <span className="text-blue-400">
                                                    {activeMenu}
                                                </span>
                                            </motion.p>

                                            <motion.h2
                                                initial={{
                                                    opacity: 0,
                                                    y: 5,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                className="mt-1 text-lg font-bold text-white"
                                            >
                                                {activeMenu ===
                                                "Overview"
                                                    ? "System Overview"
                                                    : activeMenu}
                                            </motion.h2>

                                            <p className="mt-1 text-[8px] text-slate-500">
                                                Real-time infrastructure
                                                monitoring
                                            </p>
                                        </div>

                                        <motion.div
                                            whileHover={{
                                                scale: 1.05,
                                            }}
                                            className="hidden rounded-lg border border-blue-400/10 bg-blue-500/10 px-3 py-2 sm:block"
                                        >
                                            <p className="text-[7px] text-slate-500">
                                                STATUS
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-[8px] font-semibold text-emerald-400">
                                                    Operational
                                                </span>
                                            </div>
                                        </motion.div>

                                    </div>

                                    {/* STAT CARDS */}

                                    <div className="grid grid-cols-3 gap-2">

                                        {/* LOAD */}

                                        <motion.div
                                            whileHover={{
                                                y: -5,
                                                scale: 1.02,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] p-3"
                                        >
                                            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />

                                            <div className="relative">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-[7px] text-slate-500">
                                                        System Load
                                                    </span>
                                                    <Gauge className="h-3 w-3 text-blue-400" />
                                                </div>

                                                <motion.p
                                                    key={systemLoad}
                                                    initial={{
                                                        opacity: 0.3,
                                                        y: 3,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="text-sm font-bold text-white"
                                                >
                                                    {systemLoad}%
                                                </motion.p>

                                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                                    <motion.div
                                                        animate={{
                                                            width: `${systemLoad}%`,
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                        }}
                                                        className="h-full rounded-full bg-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* LATENCY */}

                                        <motion.div
                                            whileHover={{
                                                y: -5,
                                                scale: 1.02,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] p-3"
                                        >
                                            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-cyan-500/10 blur-2xl" />

                                            <div className="relative">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-[7px] text-slate-500">
                                                        Latency
                                                    </span>
                                                    <Wifi className="h-3 w-3 text-cyan-400" />
                                                </div>

                                                <motion.p
                                                    key={latency}
                                                    initial={{
                                                        opacity: 0.3,
                                                        y: 3,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="text-sm font-bold text-white"
                                                >
                                                    &lt; {latency}ms
                                                </motion.p>

                                                <p className="mt-2 text-[7px] text-emerald-400">
                                                    ● Excellent
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* FREQUENCY */}

                                        <motion.div
                                            whileHover={{
                                                y: -5,
                                                scale: 1.02,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.025] p-3"
                                        >
                                            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-yellow-500/10 blur-2xl" />

                                            <div className="relative">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-[7px] text-slate-500">
                                                        Frequency
                                                    </span>
                                                    <Activity className="h-3 w-3 text-yellow-400" />
                                                </div>

                                                <motion.p
                                                    key={frequency}
                                                    initial={{
                                                        opacity: 0.3,
                                                        y: 3,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="text-sm font-bold text-white"
                                                >
                                                    {frequency}
                                                    <span className="ml-1 text-[7px] text-slate-500">
                                                        Hz
                                                    </span>
                                                </motion.p>

                                                <p className="mt-2 text-[7px] text-slate-500">
                                                    Stable
                                                </p>
                                            </div>
                                        </motion.div>

                                    </div>

                                    {/* CHART */}

                                    <motion.div
                                        whileHover={{
                                            scale: 1.01,
                                        }}
                                        className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                                    >

                                        <div className="mb-4 flex items-center justify-between">

                                            <div>
                                                <p className="text-[8px] font-semibold text-white">
                                                    Realtime Telemetry
                                                    Stream
                                                </p>

                                                <p className="mt-0.5 text-[7px] text-slate-600">
                                                    System activity
                                                    monitoring
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">

                                                <motion.span
                                                    animate={{
                                                        scale: [
                                                            1,
                                                            1.4,
                                                            1,
                                                        ],
                                                        opacity: [
                                                            1,
                                                            0.5,
                                                            1,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                    }}
                                                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                                                />

                                                <span className="text-[7px] text-emerald-400">
                                                    LIVE DATA
                                                </span>

                                            </div>
                                        </div>

                                        {/* BAR CHART */}

                                        <div className="relative h-[120px]">

                                            {/* Grid lines */}

                                            <div className="absolute inset-0 flex flex-col justify-between">

                                                {[1, 2, 3, 4].map(
                                                    (line) => (
                                                        <div
                                                            key={
                                                                line
                                                            }
                                                            className="h-px w-full bg-white/[0.035]"
                                                        />
                                                    )
                                                )}

                                            </div>

                                            {/* Bars */}

                                            <div className="absolute inset-0 flex items-end gap-1">

                                                {chartData.map(
                                                    (
                                                        height,
                                                        index
                                                    ) => (
                                                        <motion.div
                                                            key={
                                                                index
                                                            }
                                                            initial={{
                                                                height: "0%",
                                                            }}
                                                            animate={{
                                                                height: `${height}%`,
                                                            }}
                                                            transition={{
                                                                duration:
                                                                    0.8 +
                                                                    index *
                                                                        0.04,
                                                                delay:
                                                                    index *
                                                                    0.03,
                                                                ease: "easeOut",
                                                            }}
                                                            className="group relative flex-1 cursor-pointer"
                                                        >

                                                            <motion.div
                                                                animate={{
                                                                    opacity:
                                                                        [
                                                                            0.55,
                                                                            1,
                                                                            0.55,
                                                                        ],
                                                                }}
                                                                transition={{
                                                                    duration:
                                                                        2 +
                                                                        (index %
                                                                            3),
                                                                    repeat: Infinity,
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                }}
                                                                className="absolute inset-0 rounded-t-sm bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300"
                                                            />

                                                            {/* Hover glow */}

                                                            <div className="absolute -inset-x-1 -inset-y-1 rounded-md bg-blue-400/0 blur-md transition-all group-hover:bg-blue-400/30" />

                                                        </motion.div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                        <div className="mt-3 flex justify-between text-[6px] text-slate-600">
                                            <span>
                                                -30m
                                            </span>
                                            <span>
                                                -20m
                                            </span>
                                            <span>
                                                -10m
                                            </span>
                                            <span>
                                                NOW
                                            </span>
                                        </div>

                                    </motion.div>

                                    {/* BOTTOM CARDS */}

                                    <div className="mt-3 grid grid-cols-2 gap-2">

                                        {/* SECURITY */}

                                        <motion.div
                                            whileHover={{
                                                x: 3,
                                                y: -2,
                                            }}
                                            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                                <ShieldCheck className="h-4 w-4 text-blue-400" />
                                            </div>

                                            <div>
                                                <p className="text-[7px] text-slate-500">
                                                    Security
                                                </p>
                                                <p className="mt-0.5 text-[8px] font-semibold text-white">
                                                    Encrypted
                                                </p>
                                            </div>

                                            <div className="ml-auto">
                                                <span className="text-[7px] text-emerald-400">
                                                    SECURE
                                                </span>
                                            </div>
                                        </motion.div>

                                        {/* SERVER */}

                                        <motion.div
                                            whileHover={{
                                                x: 3,
                                                y: -2,
                                            }}
                                            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                                                <Database className="h-4 w-4 text-cyan-400" />
                                            </div>

                                            <div>
                                                <p className="text-[7px] text-slate-500">
                                                    Database
                                                </p>
                                                <p className="mt-0.5 text-[8px] font-semibold text-white">
                                                    Connected
                                                </p>
                                            </div>

                                            <div className="ml-auto">
                                                <motion.span
                                                    animate={{
                                                        opacity: [
                                                            1,
                                                            0.4,
                                                            1,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                    }}
                                                    className="text-[7px] text-emerald-400"
                                                >
                                                    ONLINE
                                                </motion.span>
                                            </div>
                                        </motion.div>

                                    </div>

                                </div>
                            </div>

                            {/* FOOTER */}

                            <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-2.5">

                                <div className="flex items-center gap-2">
                                    <Cpu className="h-3 w-3 text-blue-400" />

                                    <span className="text-[7px] text-slate-600">
                                        FASOP_CORE_ENGINE
                                    </span>
                                </div>

                                <span className="font-mono text-[7px] text-slate-600">
                                    v2.6.0 • SECURE
                                </span>

                            </div>

                        </div>
                    </motion.div>

                    {/* =================================================
                        SCAN LINE
                    ================================================= */}

                    <motion.div
                        animate={{
                            y: ["-100vh", "100vh"],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="pointer-events-none absolute left-0 top-0 z-30 h-px w-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
                    />

                </div>
            </div>
        </div>
    );
}

export default Login;