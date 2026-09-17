import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    User,
    ArrowRight,
    CheckCircle2,
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

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#005BAA]">

            {/* =====================================================
                FULL BACKGROUND IMAGE
            ===================================================== */}

            <motion.img
                src={up2bImage}
                alt="PLN UP2B Ungaran"
                initial={{
                    scale: 1.08,
                }}
                animate={{
                    scale: 1,
                }}
                transition={{
                    duration: 2,
                    ease: "easeOut",
                }}
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* =====================================================
                BLUE OVERLAY
            ===================================================== */}

            <div className="absolute inset-0 bg-[#0072BC]/35" />

            {/* =====================================================
                WHITE / BLUE SOFT OVERLAY
            ===================================================== */}

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-[#0072BC]/25 to-[#003B70]/65" />

            {/* =====================================================
                BOTTOM DARK GRADIENT
            ===================================================== */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#003B70]/70 via-transparent to-transparent" />

            {/* =====================================================
                ANIMATED YELLOW GLOW
            ===================================================== */}

            <motion.div
                animate={{
                    x: [0, 80, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FFD100]/30 blur-[120px]"
            />

            {/* =====================================================
                ANIMATED BLUE GLOW
            ===================================================== */}

            <motion.div
                animate={{
                    x: [0, -70, 0],
                    y: [0, 40, 0],
                    scale: [1, 0.9, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-40 right-[20%] h-[450px] w-[450px] rounded-full bg-[#00AEEF]/30 blur-[120px]"
            />

            {/* =====================================================
                DECORATIVE LIGHT
            ===================================================== */}

            <motion.div
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
                className="absolute left-[42%] top-[25%] h-2 w-2 rounded-full bg-[#FFD100]"
            />

            <motion.div
                animate={{
                    y: [0, 20, 0],
                    opacity: [0.3, 0.9, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                }}
                className="absolute left-[10%] top-[55%] h-3 w-3 rounded-full bg-white"
            />

            <motion.div
                animate={{
                    x: [0, 20, 0],
                    opacity: [0.2, 0.7, 0.2],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                }}
                className="absolute right-[40%] top-[18%] h-2 w-2 rounded-full bg-white"
            />

            {/* =====================================================
                TOP LEFT PLN LOGO
                SEKARANG MENGGUNAKAN PLN.jpeg
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
                className="absolute left-8 top-8 z-30 sm:left-12 sm:top-10 lg:left-20 lg:top-10"
            >
                <motion.img
                    src={plnLogo}
                    alt="PLN"
                    whileHover={{
                        scale: 1.05,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    className="h-14 w-auto max-w-[180px] object-contain drop-shadow-lg sm:h-16"
                />
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

                <motion.p
                    variants={fadeUp}
                    className="text-lg font-medium text-white/90 lg:text-xl"
                >
                    Welcome to
                </motion.p>

                {/* Main Title */}

                <motion.h1
                    variants={fadeUp}
                    className="mt-1 max-w-[620px] text-4xl font-extrabold leading-[1.05] tracking-tight text-white lg:text-6xl"
                >
                    PLN UP2B Ungaran
                </motion.h1>

                {/* Subtitle */}

                <motion.p
                    variants={fadeUp}
                    className="mt-4 text-sm font-bold tracking-[0.35em] text-[#FFD100] lg:text-base"
                >
                    FASOP MONITORING SYSTEM
                </motion.p>

                {/* Yellow Blue Line */}

                <motion.div
                    variants={fadeUp}
                    className="mt-6 flex items-center gap-0"
                >
                    <div className="h-[4px] w-14 rounded-l-full bg-[#FFD100]" />
                    <div className="h-[4px] w-12 rounded-r-full bg-[#0072BC]" />
                </motion.div>

                {/* Description */}

                <motion.p
                    variants={fadeUp}
                    className="mt-7 max-w-[390px] text-sm leading-6 text-white/85 lg:text-base"
                >
                    Monitor system performance,
                    infrastructure, and real-time
                    operational data in one secure
                    environment.
                </motion.p>

                {/* =================================================
                    SYSTEM ONLINE
                ================================================= */}

                <motion.div
                    variants={fadeUp}
                    whileHover={{
                        scale: 1.04,
                        y: -2,
                    }}
                    className="mt-7 flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/15 px-5 py-3 shadow-lg backdrop-blur-md"
                >
                    <motion.span
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                        }}
                        className="h-2.5 w-2.5 rounded-full bg-[#42E85A] shadow-[0_0_12px_rgba(66,232,90,0.8)]"
                    />

                    <span className="text-xs font-semibold text-white">
                        System Online
                    </span>
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
                <p className="text-sm font-medium text-white/80">
                    Welcome to
                </p>

                <h1 className="mt-1 text-3xl font-extrabold text-white">
                    PLN UP2B Ungaran
                </h1>

                <p className="mt-2 text-[10px] font-bold tracking-[0.25em] text-[#FFD100]">
                    FASOP MONITORING SYSTEM
                </p>
            </motion.div>

            {/* =====================================================
                LOGIN CARD
            ===================================================== */}

            <div className="relative z-30 flex min-h-screen items-center justify-end px-5 py-8 sm:px-10 lg:px-16 xl:px-24">

                <motion.div
                    initial={{
                        opacity: 0,
                        x: 60,
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

                    <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/95 px-7 py-8 shadow-[0_30px_80px_rgba(0,40,90,0.25)] backdrop-blur-xl sm:px-10 sm:py-10 lg:px-12 lg:py-11">

                        {/* =================================================
                            CARD DECORATION
                        ================================================= */}

                        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#FFD100]/10 blur-[60px]" />

                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#0072BC]/10 blur-[70px]" />

                        {/* =================================================
                            MINI PLN LOGO
                            MENGGUNAKAN PLN.jpeg
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
                            className="relative z-10"
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 2,
                                }}
                                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_20px_rgba(0,91,170,0.15)]"
                            >
                                <img
                                    src={plnLogo}
                                    alt="PLN"
                                    className="h-full w-full object-contain p-1"
                                />
                            </motion.div>
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
                            <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1730] sm:text-4xl">
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
                                <label className="mb-2 block text-sm font-bold text-[#101828]">
                                    Username
                                </label>

                                <div className="group relative">

                                    <User
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91A0B5] transition-colors group-focus-within:text-[#0072BC]"
                                    />

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
                                        className="h-14 w-full rounded-2xl border border-[#DCE3EC] bg-white pl-12 pr-4 text-sm text-[#101828] outline-none transition-all placeholder:text-[#B8C2D0] hover:border-[#AFC0D3] focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10"
                                    />

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
                                <label className="mb-2 block text-sm font-bold text-[#101828]">
                                    Password
                                </label>

                                <div className="group relative">

                                    <Lock
                                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91A0B5] transition-colors group-focus-within:text-[#0072BC]"
                                    />

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
                                        className="h-14 w-full rounded-2xl border border-[#DCE3EC] bg-white pl-12 pr-12 text-sm text-[#101828] outline-none transition-all placeholder:text-[#B8C2D0] hover:border-[#AFC0D3] focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#91A0B5] transition-colors hover:text-[#0072BC]"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>

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
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-[#E31E24]">
                                            {error}
                                        </div>
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
                                        scale: 1.01,
                                        y: -1,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#006BB6] text-sm font-bold text-white shadow-[0_12px_25px_rgba(0,107,182,0.25)] transition-all hover:bg-[#005BAA] disabled:cursor-not-allowed disabled:opacity-70"
                                >

                                    {/* ANIMATED YELLOW SHINE */}

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
                                                    repeatDelay: 1.8,
                                                    ease: "linear",
                                                }}
                                                className="absolute inset-y-0 w-24 rotate-12 bg-gradient-to-r from-transparent via-[#FFD100]/80 to-transparent blur-md"
                                            />
                                        )}

                                    {/* BUTTON CONTENT */}

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
                            <div className="h-px flex-1 bg-[#E2E7EE]" />

                            <span className="text-[11px] font-medium text-[#A0ACBC]">
                                secure access
                            </span>

                            <div className="h-px flex-1 bg-[#E2E7EE]" />
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
                            className="relative z-10 flex items-center justify-center gap-2 text-xs text-[#8C9AAF]"
                        >
                            <Lock className="h-4 w-4 text-[#0072BC]" />

                            <span>
                                Your connection is securely
                                protected
                            </span>
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
                            <div className="h-2 w-2 rounded-full bg-[#0072BC]" />

                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B3BFCE]">
                                PLN UP2B UNGARAN
                            </span>

                            <div className="h-2 w-2 rounded-full bg-[#FFD100]" />
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
                            className="relative z-10 mt-3 text-center text-[10px] text-[#C1CBD8]"
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
                        className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#005BAA]"
                    >

                        {/* Yellow Glow */}

                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.15, 0.45, 0.15],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute h-[550px] w-[550px] rounded-full bg-[#FFD100]/30 blur-[130px]"
                        />

                        {/* Blue Glow */}

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
                            className="absolute h-[400px] w-[400px] rounded-full bg-[#00AEEF]/30 blur-[110px]"
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

                            {/* =================================================
                                PLN LOGO SUCCESS
                                MENGGUNAKAN PLN.jpeg
                            ================================================= */}

                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 0 rgba(255,209,0,0)",
                                        "0 0 60px rgba(255,209,0,0.45)",
                                        "0 0 0 rgba(255,209,0,0)",
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] bg-white"
                            >
                                <img
                                    src={plnLogo}
                                    alt="PLN"
                                    className="h-20 w-20 object-contain"
                                />
                            </motion.div>

                            <h2 className="mt-7 text-3xl font-bold text-white">
                                Login Successful
                            </h2>

                            <p className="mt-2 text-sm text-blue-100">
                                Preparing your dashboard...
                            </p>

                            {/* Progress */}

                            <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/20">
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
                                    className="h-full bg-[#FFD100]"
                                />
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default Login;