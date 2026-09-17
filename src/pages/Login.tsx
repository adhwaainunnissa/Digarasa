import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    User,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    Activity,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import up2bImage from "../assets/up2b.jpg";
import plnLogo from "../assets/PLN.jpeg";

function Login() {
    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [showTransition, setShowTransition] = useState(false);

    // =========================================================
    // LOGIN
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
            localStorage.setItem("user", JSON.stringify(user));

            setLoginSuccess(true);
            setLoading(false);

            // Success animation
            setTimeout(() => {
                setShowTransition(true);

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1300);
            }, 500);
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
    // ANIMATION VARIANTS
    // =========================================================
    const fadeUp = {
        hidden: {
            opacity: 0,
            y: 25,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.65,
                ease: "easeOut",
            },
        },
    };

    const floatingParticle = {
        animate: {
            y: [0, -18, 0],
            x: [0, 8, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
        },
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#082B5F]">

            {/* =====================================================
                BACKGROUND IMAGE
            ===================================================== */}
            <motion.img
                src={up2bImage}
                alt="PLN UP2B Ungaran"
                initial={{
                    scale: 1.1,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                transition={{
                    duration: 1.8,
                    ease: "easeOut",
                }}
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* =====================================================
                BLUE OVERLAY
            ===================================================== */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-[#0066FF]/30"
            />

            {/* =====================================================
                MAIN GRADIENT
            ===================================================== */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/25 via-[#00AEEF]/15 to-[#082B5F]/80" />

            {/* =====================================================
                BOTTOM DARK GRADIENT
            ===================================================== */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B3D]/85 via-transparent to-[#082B5F]/20" />

            {/* =====================================================
                ANIMATED BLUE GLOW
            ===================================================== */}
            <motion.div
                animate={{
                    x: [0, 90, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#00BFFF]/35 blur-[130px]"
            />

            {/* =====================================================
                ANIMATED YELLOW GLOW
            ===================================================== */}
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 50, 0],
                    scale: [1, 0.9, 1],
                    opacity: [0.1, 0.28, 0.1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-40 right-[10%] h-[500px] w-[500px] rounded-full bg-[#FFD600]/30 blur-[130px]"
            />

            {/* =====================================================
                DECORATIVE GLOW RIGHT
            ===================================================== */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.08, 0.2, 0.08],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute right-[20%] top-[15%] h-[280px] w-[280px] rounded-full bg-[#0066FF]/25 blur-[100px]"
            />

            {/* =====================================================
                FLOATING PARTICLES
            ===================================================== */}
            <motion.span
                {...floatingParticle}
                className="absolute left-[8%] top-[25%] h-2 w-2 rounded-full bg-[#FFD600]"
            />

            <motion.span
                {...floatingParticle}
                transition={{
                    ...floatingParticle.transition,
                    delay: 1,
                    duration: 5,
                }}
                className="absolute left-[35%] top-[15%] h-1.5 w-1.5 rounded-full bg-white"
            />

            <motion.span
                {...floatingParticle}
                transition={{
                    ...floatingParticle.transition,
                    delay: 2,
                    duration: 4.5,
                }}
                className="absolute right-[35%] top-[25%] h-2 w-2 rounded-full bg-[#00BFFF]"
            />

            <motion.span
                {...floatingParticle}
                transition={{
                    ...floatingParticle.transition,
                    delay: 0.5,
                    duration: 5.5,
                }}
                className="absolute bottom-[25%] left-[18%] h-2 w-2 rounded-full bg-white/70"
            />

            <motion.span
                {...floatingParticle}
                transition={{
                    ...floatingParticle.transition,
                    delay: 1.5,
                    duration: 4,
                }}
                className="absolute bottom-[18%] right-[25%] h-1.5 w-1.5 rounded-full bg-[#FFD600]"
            />

            {/* =====================================================
                DECORATIVE LINES
            ===================================================== */}
            <motion.div
                initial={{
                    opacity: 0,
                    scaleX: 0,
                }}
                animate={{
                    opacity: 0.6,
                    scaleX: 1,
                }}
                transition={{
                    delay: 1,
                    duration: 1,
                }}
                className="absolute left-[45%] top-[18%] hidden h-px w-32 origin-left bg-gradient-to-r from-[#FFD600] to-transparent lg:block"
            />

            <motion.div
                initial={{
                    opacity: 0,
                    scaleX: 0,
                }}
                animate={{
                    opacity: 0.5,
                    scaleX: 1,
                }}
                transition={{
                    delay: 1.2,
                    duration: 1,
                }}
                className="absolute bottom-[20%] left-[45%] hidden h-px w-40 origin-left bg-gradient-to-r from-[#00BFFF] to-transparent lg:block"
            />

            {/* =====================================================
                TOP LEFT PLN LOGO
            ===================================================== */}
            <motion.div
                initial={{
                    opacity: 0,
                    x: -30,
                    y: -10,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                }}
                transition={{
                    duration: 0.8,
                    delay: 0.3,
                }}
                className="absolute left-7 top-7 z-30 sm:left-12 sm:top-9 lg:left-20 lg:top-10"
            >
                <motion.div
                    whileHover={{
                        scale: 1.05,
                        y: -2,
                    }}
                    className="group relative"
                >
                    <div className="absolute -inset-2 rounded-2xl bg-[#00BFFF]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">

                        <img
                            src={plnLogo}
                            alt="PLN"
                            className="h-11 w-auto max-w-[150px] object-contain drop-shadow-lg sm:h-13"
                        />

                        <div className="hidden border-l border-white/20 pl-3 sm:block">
                            <p className="text-[9px] font-semibold tracking-[0.18em] text-white/60">
                                FASOP
                            </p>

                            <p className="text-[10px] font-bold text-white">
                                MONITORING
                            </p>
                        </div>

                    </div>
                </motion.div>
            </motion.div>

            {/* =====================================================
                LEFT CONTENT
            ===================================================== */}
            <motion.div
                initial="hidden"
                animate="visible"
                className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 md:block sm:left-12 lg:left-20"
            >

                {/* Welcome */}
                <motion.div
                    variants={fadeUp}
                    className="mb-3 flex items-center gap-2"
                >
                    <Sparkles className="h-4 w-4 text-[#FFD600]" />

                    <p className="text-lg font-medium text-white/90 lg:text-xl">
                        Welcome to
                    </p>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    variants={fadeUp}
                    className="max-w-[620px] text-4xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl"
                >
                    PLN UP2B
                    <br />

                    <span className="text-white">
                        Ungaran
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                    variants={fadeUp}
                    className="mt-5 flex items-center gap-3"
                >
                    <div className="h-[3px] w-10 rounded-full bg-[#FFD600]" />

                    <p className="text-sm font-bold tracking-[0.3em] text-[#FFD600] lg:text-base">
                        FASOP MONITORING SYSTEM
                    </p>
                </motion.div>

                {/* Description */}
                <motion.p
                    variants={fadeUp}
                    className="mt-6 max-w-[410px] text-sm leading-6 text-white/80 lg:text-base"
                >
                    Monitor system performance, infrastructure,
                    and real-time operational data in one secure
                    environment.
                </motion.p>

                {/* System Online */}
                <motion.div
                    variants={fadeUp}
                    whileHover={{
                        scale: 1.04,
                        y: -2,
                    }}
                    className="mt-7 flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 shadow-xl backdrop-blur-lg"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#42E85A] opacity-60" />

                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#42E85A] shadow-[0_0_15px_rgba(66,232,90,0.9)]" />
                    </span>

                    <span className="text-xs font-semibold text-white">
                        System Online
                    </span>

                    <Activity className="h-4 w-4 text-[#00BFFF]" />
                </motion.div>
            </motion.div>

            {/* =====================================================
                MOBILE TITLE
            ===================================================== */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.5,
                    duration: 0.7,
                }}
                className="absolute left-7 top-32 z-20 md:hidden"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#FFD600]" />

                    <p className="text-sm font-medium text-white/80">
                        Welcome to
                    </p>
                </div>

                <h1 className="max-w-[620px] text-4xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl">
                    PLN UP2B
                    <br />

                    <span className="text-white">
                        Ungaran
                    </span>
                </h1>

                <p className="mt-2 text-[10px] font-bold tracking-[0.25em] text-[#FFD600]">
                    FASOP MONITORING SYSTEM
                </p>
            </motion.div>

            {/* =====================================================
                LOGIN CARD WRAPPER
            ===================================================== */}
            <div className="relative z-30 flex min-h-screen items-center justify-end px-5 py-8 sm:px-10 lg:px-16 xl:px-24">

                <motion.div
                    initial={{
                        opacity: 0,
                        x: 70,
                        scale: 0.96,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.9,
                        delay: 0.2,
                        ease: "easeOut",
                    }}
                    className="w-full max-w-[510px]"
                >

                    {/* =================================================
                        CARD
                    ================================================= */}
                    <div className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/95 px-7 py-8 shadow-[0_30px_100px_rgba(0,40,90,0.35)] backdrop-blur-2xl sm:px-10 sm:py-10 lg:px-12 lg:py-11">

                        {/* Top animated accent */}
                        <motion.div
                            animate={{
                                x: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "linear",
                            }}
                            className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent"
                        />

                        {/* Card glow */}
                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#00BFFF]/10 blur-[80px]" />

                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#FFD600]/10 blur-[80px]" />

                        {/* =================================================
                            MINI LOGO
                        ================================================= */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 0.5,
                            }}
                            className="relative z-10 flex items-center justify-between"
                        >

                            <motion.div
                                whileHover={{
                                    scale: 1.06,
                                    rotate: 2,
                                }}
                                className="relative"
                            >
                                <div className="absolute -inset-2 rounded-2xl bg-[#0066FF]/10 blur-lg" />

                                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#DCEBFF] bg-white shadow-[0_8px_25px_rgba(0,102,255,0.15)]">
                                    <img
                                        src={plnLogo}
                                        alt="PLN"
                                        className="h-full w-full object-contain p-1"
                                    />
                                </div>
                            </motion.div>

                            {/* Secure Badge */}
                            <div className="flex items-center gap-2 rounded-full border border-[#CFE2FF] bg-[#F5F9FF] px-3 py-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00BFFF] opacity-50" />

                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
                                </span>

                                <span className="text-[10px] font-bold tracking-wide text-[#0066FF]">
                                    SECURE ACCESS
                                </span>
                            </div>
                        </motion.div>

                        {/* =================================================
                            HEADING
                        ================================================= */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.7,
                                duration: 0.6,
                            }}
                            className="relative z-10 mt-7"
                        >
                            <h2 className="text-3xl font-extrabold tracking-tight text-[#082B5F] sm:text-4xl">
                                Welcome back
                            </h2>

                            <p className="mt-2 max-w-[390px] text-sm leading-6 text-[#8090A8]">
                                Access your monitoring dashboard
                                and keep everything flowing in
                                one place.
                            </p>
                        </motion.div>

                        {/* =================================================
                            FORM
                        ================================================= */}
                        <form
                            onSubmit={handleLogin}
                            className="relative z-10 mt-8"
                        >

                            {/* =================================================
                                USERNAME
                            ================================================= */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.5,
                                }}
                            >
                                <label className="mb-2 block text-sm font-bold text-[#082B5F]">
                                    Username
                                </label>

                                <div className="group relative">

                                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91A0B5] transition-colors duration-300 group-focus-within:text-[#0066FF]" />

                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                        className="h-14 w-full rounded-2xl border border-[#CFE2FF] bg-[#F7FBFF] pl-12 pr-4 text-sm text-[#082B5F] outline-none transition-all duration-300 placeholder:text-[#B8C2D0] hover:border-[#8FC8FF] focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#00BFFF]/10"
                                    />

                                    {/* Focus accent */}
                                    <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-[#0066FF] via-[#00BFFF] to-[#FFD600] transition-transform duration-300 group-focus-within:scale-x-100" />
                                </div>
                            </motion.div>

                            {/* =================================================
                                PASSWORD
                            ================================================= */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.9,
                                    duration: 0.5,
                                }}
                                className="mt-5"
                            >
                                <label className="mb-2 block text-sm font-bold text-[#082B5F]">
                                    Password
                                </label>

                                <div className="group relative">

                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91A0B5] transition-colors duration-300 group-focus-within:text-[#0066FF]" />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError("");
                                        }}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="h-14 w-full rounded-2xl border border-[#CFE2FF] bg-[#F7FBFF] pl-12 pr-12 text-sm text-[#082B5F] outline-none transition-all duration-300 placeholder:text-[#B8C2D0] hover:border-[#8FC8FF] focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#00BFFF]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#91A0B5] transition-all duration-300 hover:scale-110 hover:text-[#0066FF]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>

                                    <div className="pointer-events-none absolute bottom-0 left-5 right-5 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-[#0066FF] via-[#00BFFF] to-[#FFD600] transition-transform duration-300 group-focus-within:scale-x-100" />
                                </div>
                            </motion.div>

                            {/* =================================================
                                ERROR
                            ================================================= */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                            y: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            y: -5,
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <motion.div
                                            animate={{
                                                x: [0, -4, 4, -3, 3, 0],
                                            }}
                                            transition={{
                                                duration: 0.4,
                                            }}
                                            className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#E31E24]"
                                        >
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                                                !
                                            </span>

                                            {error}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* =================================================
                                SIGN IN BUTTON
                            ================================================= */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 1,
                                    duration: 0.5,
                                }}
                                className="mt-7"
                            >
                                <motion.button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        loginSuccess
                                    }
                                    whileHover={{
                                        scale: 1.015,
                                        y: -2,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#0066FF] via-[#00AEEF] to-[#082B5F] text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,102,255,0.28)] transition-all duration-300 hover:shadow-[0_18px_38px_rgba(0,102,255,0.38)] disabled:cursor-not-allowed disabled:opacity-70"
                                >

                                    {/* Yellow shine */}
                                    {!loading &&
                                        !loginSuccess && (
                                            <motion.span
                                                animate={{
                                                    x: [
                                                        "-180%",
                                                        "180%",
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 2.8,
                                                    repeat: Infinity,
                                                    repeatDelay: 1.5,
                                                    ease: "linear",
                                                }}
                                                className="absolute inset-y-0 w-24 rotate-12 bg-gradient-to-r from-transparent via-[#FFD600]/80 to-transparent blur-md"
                                            />
                                        )}

                                    {/* Yellow top glow */}
                                    <span className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FFD600] to-transparent opacity-80" />

                                    {/* Button content */}
                                    <span className="relative z-10 flex items-center gap-3">

                                        {loading ? (
                                            <>
                                                <motion.span
                                                    animate={{
                                                        rotate: 360,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                                />

                                                Signing in...
                                            </>
                                        ) : loginSuccess ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5" />

                                                Success
                                            </>
                                        ) : (
                                            <>
                                                Sign In

                                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            </>
                                        )}

                                    </span>
                                </motion.button>
                            </motion.div>
                        </form>

                        {/* =================================================
                            DIVIDER
                        ================================================= */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: 1.1,
                                duration: 0.5,
                            }}
                            className="relative z-10 my-7 flex items-center gap-4"
                        >
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CFE2FF] to-[#CFE2FF]" />

                            <div className="flex items-center gap-2">
                                <Zap className="h-3 w-3 text-[#FFD600]" />

                                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8C9AAF]">
                                    SECURE ACCESS
                                </span>
                            </div>

                            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#CFE2FF] to-[#CFE2FF]" />
                        </motion.div>

                        {/* =================================================
                            SECURITY
                        ================================================= */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 10,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 1.2,
                                duration: 0.5,
                            }}
                            whileHover={{
                                scale: 1.01,
                            }}
                            className="relative z-10 flex items-center justify-center gap-2 rounded-xl border border-[#DCEBFF] bg-[#F5F9FF] px-4 py-3 text-xs text-[#6F8199]"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066FF] to-[#00BFFF] text-white shadow-md">
                                <ShieldCheck className="h-4 w-4" />
                            </div>

                            <span>
                                Your connection is securely
                                protected
                            </span>

                            <span className="ml-auto h-2 w-2 rounded-full bg-[#FFD600] shadow-[0_0_8px_rgba(255,214,0,0.7)]" />
                        </motion.div>

                        {/* =================================================
                            BRAND FOOTER
                        ================================================= */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: 1.3,
                                duration: 0.5,
                            }}
                            className="relative z-10 mt-8 flex items-center justify-center gap-3"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-[#0066FF]"
                            />

                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#A5B4C7]">
                                PLN UP2B UNGARAN
                            </span>

                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.5, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-[#FFD600]"
                            />
                        </motion.div>

                        <motion.p
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: 1.4,
                                duration: 0.5,
                            }}
                            className="relative z-10 mt-3 text-center text-[10px] text-[#B8C4D3]"
                        >
                            © {new Date().getFullYear()} PLN
                            Persero. All rights reserved.
                        </motion.p>

                    </div>
                </motion.div>
            </div>

            {/* =====================================================
                LOGIN SUCCESS OVERLAY
            ===================================================== */}
            <AnimatePresence>
                {showTransition && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#082B5F]"
                    >

                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/40 via-[#00AEEF]/20 to-[#082B5F]" />

                        {/* Yellow Glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.12, 0.4, 0.12],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute h-[550px] w-[550px] rounded-full bg-[#FFD600]/30 blur-[130px]"
                        />

                        {/* Cyan Glow */}
                        <motion.div
                            animate={{
                                scale: [1.2, 0.9, 1.2],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute h-[450px] w-[450px] rounded-full bg-[#00BFFF]/30 blur-[120px]"
                        />

                        {/* Rotating Ring */}
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute h-[500px] w-[500px] rounded-full border border-white/5"
                        />

                        <motion.div
                            animate={{
                                rotate: -360,
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute h-[350px] w-[350px] rounded-full border border-[#00BFFF]/10"
                        />

                        {/* Content */}
                        <motion.div
                            initial={{
                                scale: 0.7,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 16,
                            }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >

                            {/* PLN Logo */}
                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                    boxShadow: [
                                        "0 0 0 rgba(255,214,0,0)",
                                        "0 0 70px rgba(255,214,0,0.45)",
                                        "0 0 0 rgba(255,214,0,0)",
                                    ],
                                }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border border-white/30 bg-white"
                            >
                                <img
                                    src={plnLogo}
                                    alt="PLN"
                                    className="h-20 w-20 object-contain"
                                />
                            </motion.div>

                            {/* Check */}
                            <motion.div
                                initial={{
                                    scale: 0,
                                }}
                                animate={{
                                    scale: 1,
                                }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 250,
                                }}
                                className="mt-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#42E85A] text-white shadow-[0_0_25px_rgba(66,232,90,0.5)]"
                            >
                                <CheckCircle2 className="h-5 w-5" />
                            </motion.div>

                            <h2 className="mt-5 text-3xl font-bold text-white">
                                Login Successful
                            </h2>

                            <p className="mt-2 text-sm text-blue-100">
                                Preparing your dashboard...
                            </p>

                            {/* Progress */}
                            <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
                                <motion.div
                                    initial={{
                                        width: "0%",
                                    }}
                                    animate={{
                                        width: "100%",
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        ease: "easeInOut",
                                    }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#0066FF] via-[#00BFFF] to-[#FFD600]"
                                />
                            </div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                transition={{
                                    delay: 0.4,
                                }}
                                className="mt-4 flex items-center gap-2"
                            >
                                <motion.span
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                    }}
                                    className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]"
                                />

                                <span className="text-[10px] font-semibold tracking-[0.2em] text-white/50">
                                    FASOP MONITORING SYSTEM
                                </span>

                                <motion.span
                                    animate={{
                                        opacity: [1, 0.3, 1],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: 0.3,
                                    }}
                                    className="h-1.5 w-1.5 rounded-full bg-[#FFD600]"
                                />
                            </motion.div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Login;