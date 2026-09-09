import { useState, useMemo } from "react";
import {
    User as UserIcon,
    Lock,
    Shield,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Zap,
    KeyRound,
    Sparkles,
} from "lucide-react";

export default function Profile() {
    // ========================================
    // USER
    // ========================================
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    }, []);

    // ========================================
    // FORM
    // ========================================
    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

    // ========================================
    // PASSWORD VISIBILITY
    // ========================================
    const [showLama, setShowLama] = useState(false);
    const [showBaru, setShowBaru] = useState(false);
    const [showKonf, setShowKonf] = useState(false);

    // ========================================
    // STATUS
    // ========================================
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ========================================
    // PASSWORD STRENGTH
    // ========================================
    const passwordStrength = useMemo(() => {
        if (!passwordBaru) {
            return {
                score: 0,
                label: "",
            };
        }

        let score = 0;

        if (passwordBaru.length >= 8) score++;
        if (/[A-Z]/.test(passwordBaru)) score++;
        if (/[0-9]/.test(passwordBaru)) score++;
        if (/[^A-Za-z0-9]/.test(passwordBaru)) score++;

        const labels = [
            "",
            "Sangat lemah",
            "Lemah",
            "Cukup kuat",
            "Sangat kuat",
        ];

        return {
            score,
            label: labels[score],
        };
    }, [passwordBaru]);

    // ========================================
    // CHANGE PASSWORD
    // ========================================
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
            setError("Semua field password harus diisi.");
            return;
        }

        if (passwordBaru !== konfirmasiPassword) {
            setError("Konfirmasi password tidak cocok dengan password baru.");
            return;
        }

        if (passwordBaru.length < 8) {
            setError("Password baru minimal 8 karakter.");
            return;
        }

        try {
            setLoading(true);

            // Simulasi proses API
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSuccess(true);

            setPasswordLama("");
            setPasswordBaru("");
            setKonfirmasiPassword("");

            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch {
            setError(
                "Terjadi kesalahan saat mengubah password. Silakan coba lagi."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // ROLE STYLE
    // ========================================
    const getRoleStyle = (role: string = "") => {
        if (role.toLowerCase() === "admin") {
            return "bg-blue-50 text-blue-700 border-blue-200";
        }

        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    // ========================================
    // PASSWORD INPUT
    // ========================================
    const PasswordInput = ({
        label,
        value,
        onChange,
        show,
        setShow,
        placeholder,
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        show: boolean;
        setShow: (value: boolean) => void;
        placeholder: string;
    }) => {
        return (
            <div className="group">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {label}
                </label>

                <div className="relative">
                    {/* LEFT ICON */}
                    <div
                        className={`pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 transition-all duration-300 ${
                            value
                                ? "text-blue-600"
                                : "text-slate-400 group-focus-within:text-blue-600"
                        }`}
                    >
                        <KeyRound className="h-4 w-4" />
                    </div>

                    {/* INPUT */}
                    <input
                        type={show ? "text" : "password"}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="input-animation w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 hover:border-blue-200 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    {/* SHOW PASSWORD */}
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="eye-animation absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 active:scale-90"
                    >
                        {show ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* ========================================
                ANIMATION CSS
            ======================================== */}
            <style>{`
                @keyframes pageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes floatSoft {
                    0%, 100% {
                        transform: translateY(0px);
                    }

                    50% {
                        transform: translateY(-6px);
                    }
                }

                @keyframes floatIcon {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }

                    50% {
                        transform: translateY(-5px) rotate(3deg);
                    }
                }

                @keyframes glowPulse {
                    0%, 100% {
                        opacity: .25;
                        transform: scale(1);
                    }

                    50% {
                        opacity: .55;
                        transform: scale(1.12);
                    }
                }

                @keyframes gradientMove {
                    0% {
                        transform: translateX(-100%);
                    }

                    100% {
                        transform: translateX(300%);
                    }
                }

                @keyframes shine {
                    0% {
                        transform: translateX(-150%);
                    }

                    45%, 100% {
                        transform: translateX(450%);
                    }
                }

                @keyframes pulseSecure {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(16, 185, 129, .15);
                    }

                    50% {
                        transform: scale(1.04);
                        box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
                    }
                }

                @keyframes subtleCard {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes iconBounce {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes borderGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 rgba(37, 99, 235, 0);
                    }

                    50% {
                        box-shadow: 0 0 30px rgba(37, 99, 235, .08);
                    }
                }

                @keyframes statusDot {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }

                    50% {
                        transform: scale(1.25);
                        opacity: .7;
                    }
                }

                @keyframes lineMove {
                    0% {
                        transform: translateX(-120%);
                    }

                    100% {
                        transform: translateX(450%);
                    }
                }

                .page-enter {
                    animation: pageEnter .7s cubic-bezier(.22,1,.36,1) both;
                }

                .floating-card {
                    animation: subtleCard 4s ease-in-out infinite;
                }

                .floating-icon {
                    animation: floatIcon 3.5s ease-in-out infinite;
                }

                .glow-animation {
                    animation: glowPulse 4s ease-in-out infinite;
                }

                .secure-animation {
                    animation: pulseSecure 3s ease-in-out infinite;
                }

                .status-dot {
                    animation: statusDot 2s ease-in-out infinite;
                }

                .security-glow {
                    animation: borderGlow 3s ease-in-out infinite;
                }

                .moving-line {
                    position: relative;
                    overflow: hidden;
                }

                .moving-line::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 25%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.95),
                        transparent
                    );
                    animation: gradientMove 3s linear infinite;
                }

                .shine-button {
                    position: relative;
                    overflow: hidden;
                }

                .shine-button::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 20%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.35),
                        transparent
                    );
                    transform: translateX(-150%);
                    animation: shine 3.5s ease-in-out infinite;
                }

                .input-animation {
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease,
                        border-color .25s ease,
                        background-color .25s ease;
                }

                .input-animation:hover {
                    transform: translateY(-2px);
                }

                .eye-animation:hover {
                    animation: iconBounce .5s ease-in-out;
                }

                @media (prefers-reduced-motion: reduce) {
                    .page-enter,
                    .floating-card,
                    .floating-icon,
                    .glow-animation,
                    .secure-animation,
                    .status-dot,
                    .security-glow,
                    .moving-line::after,
                    .shine-button::after {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* ========================================
                MAIN PAGE
            ======================================== */}
            <div className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-50">
                {/* ========================================
                    BACKGROUND GLOW
                ======================================== */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl glow-animation" />

                <div
                    className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-yellow-200/20 blur-3xl glow-animation"
                    style={{ animationDelay: "1.5s" }}
                />

                {/* ========================================
                    HEADER
                ======================================== */}
                <header className="relative z-10 shrink-0 border-b border-slate-200/80 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-xl md:px-8">
                    <div className="mx-auto flex max-w-6xl items-center gap-4 page-enter">
                        {/* HEADER ICON */}
                        <div className="group relative">
                            <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-md transition-all duration-500 group-hover:bg-blue-400/30" />

                            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                                <UserIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Profile & Security
                                </h1>

                                <Sparkles className="h-4 w-4 text-yellow-500" />
                            </div>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Kelola informasi akun dan keamanan sistem Anda.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ========================================
                    MAIN CONTENT
                ======================================== */}
                <main className="relative z-10 flex-1 overflow-y-auto p-5 md:p-8">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 lg:grid-cols-12">
                        {/* ========================================
                            LEFT - ACCOUNT
                        ======================================== */}
                        <div className="space-y-5 lg:col-span-5">
                            {/* ACCOUNT CARD */}
                            <div className="card-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
                                {/* ACCENT LINE */}
                                <div className="moving-line relative h-1.5 overflow-hidden bg-slate-100">
                                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-500" />
                                </div>

                                <div className="p-6 md:p-7">
                                    {/* AVATAR */}
                                    <div className="mb-7 flex justify-center">
                                        <div className="relative floating-icon">
                                            <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl glow-animation" />

                                            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 text-4xl font-bold text-blue-600 shadow-xl">
                                                {(
                                                    user?.nama_lengkap ||
                                                    user?.username ||
                                                    "U"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            {/* ONLINE */}
                                            <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 shadow-md">
                                                <div className="status-dot h-2 w-2 rounded-full bg-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* USER NAME */}
                                    <div className="mb-7 text-center">
                                        <h2 className="text-xl font-bold text-slate-900">
                                            {user?.nama_lengkap || "User"}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            @{user?.username || "username"}
                                        </p>
                                    </div>

                                    {/* ACCOUNT INFO */}
                                    <div className="space-y-4">
                                        {/* USERNAME */}
                                        <div className="group">
                                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Username
                                            </p>

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-100 group-hover:bg-blue-50/40 group-hover:shadow-sm">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                                    <UserIcon className="h-4 w-4" />
                                                </div>

                                                <p className="font-mono text-sm font-semibold text-slate-800">
                                                    @{user?.username || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* NAMA */}
                                        <div className="group">
                                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Nama Lengkap
                                            </p>

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-100 group-hover:bg-blue-50/40 group-hover:shadow-sm">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                                    <Shield className="h-4 w-4" />
                                                </div>

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {user?.nama_lengkap || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ROLE */}
                                        <div className="group">
                                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Role & Permissions
                                            </p>

                                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-blue-100 group-hover:bg-blue-50/40 group-hover:shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                                        <Shield className="h-4 w-4" />
                                                    </div>

                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getRoleStyle(
                                                            user?.role
                                                        )}`}
                                                    >
                                                        {user?.role?.toLowerCase() ===
                                                            "admin" && (
                                                            <Shield className="mr-1.5 h-3.5 w-3.5" />
                                                        )}

                                                        {user?.role || "user"}
                                                    </span>
                                                </div>

                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 transition-transform duration-300 group-hover:scale-125" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ========================================
                                SYSTEM INFO
                            ======================================== */}
                            <div className="card-enter group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-yellow-50/50 p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-700 group-hover:scale-150" />

                                <div className="relative flex items-center gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-yellow-500 shadow-sm ring-1 ring-blue-100 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                                        <Zap className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            FASOP Monitoring System
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            PLN UP2B Ungaran • Enterprise
                                            Control
                                        </p>
                                    </div>

                                    <div className="ml-auto">
                                        <div className="status-dot h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========================================
                            RIGHT - CHANGE PASSWORD
                        ======================================== */}
                        <div className="lg:col-span-7">
                            <div className="card-enter card-delay-2 floating-card security-glow overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
                                {/* ACCENT */}
                                <div className="moving-line relative h-1.5 overflow-hidden bg-slate-100">
                                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-yellow-400" />
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* TITLE */}
                                    <div className="mb-7 flex items-start gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md glow-animation" />

                                            <div className="floating-icon relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 text-blue-600 shadow-sm">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-xl font-bold text-slate-900">
                                                    Ganti Password
                                                </h2>

                                                <span className="secure-animation inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                                    Secure
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                                                Perbarui password secara berkala
                                                untuk menjaga keamanan akun.
                                            </p>
                                        </div>
                                    </div>

                                    {/* ========================================
                                        ERROR
                                    ======================================== */}
                                    {error && (
                                        <div className="page-enter mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
                                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                                            <div>
                                                <p className="text-sm font-bold">
                                                    Perhatian
                                                </p>

                                                <p className="mt-0.5 text-sm font-medium">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================
                                        SUCCESS
                                    ======================================== */}
                                    {success && (
                                        <div className="page-enter mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                                            <div>
                                                <p className="text-sm font-bold">
                                                    Berhasil!
                                                </p>

                                                <p className="mt-0.5 text-sm font-medium">
                                                    Password berhasil diubah
                                                    dengan aman.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* ========================================
                                        FORM
                                    ======================================== */}
                                    <form
                                        onSubmit={handleChangePassword}
                                        className="space-y-5"
                                    >
                                        {/* PASSWORD LAMA */}
                                        <PasswordInput
                                            label="Password Lama"
                                            value={passwordLama}
                                            onChange={setPasswordLama}
                                            show={showLama}
                                            setShow={setShowLama}
                                            placeholder="Masukkan password saat ini"
                                        />

                                        {/* PASSWORD BARU */}
                                        <div>
                                            <PasswordInput
                                                label="Password Baru"
                                                value={passwordBaru}
                                                onChange={setPasswordBaru}
                                                show={showBaru}
                                                setShow={setShowBaru}
                                                placeholder="Minimal 8 karakter"
                                            />

                                            {/* PASSWORD STRENGTH */}
                                            {passwordBaru && (
                                                <div className="mt-3 rounded-xl bg-slate-50 p-3 page-enter">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-slate-500">
                                                            Kekuatan password
                                                        </span>

                                                        <span
                                                            className={`text-xs font-bold ${
                                                                passwordStrength.score >=
                                                                4
                                                                    ? "text-emerald-600"
                                                                    : passwordStrength.score >=
                                                                      3
                                                                    ? "text-blue-600"
                                                                    : "text-orange-500"
                                                            }`}
                                                        >
                                                            {
                                                                passwordStrength.label
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* STRENGTH BAR */}
                                                    <div className="flex gap-1.5">
                                                        {[1, 2, 3, 4].map(
                                                            (item) => (
                                                                <div
                                                                    key={item}
                                                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                                                        item <=
                                                                        passwordStrength.score
                                                                            ? "bg-blue-500"
                                                                            : "bg-slate-200"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    {/* REQUIREMENTS */}
                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                                        <span
                                                            className={`text-[11px] ${
                                                                passwordBaru.length >=
                                                                8
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            ✓ 8+ karakter
                                                        </span>

                                                        <span
                                                            className={`text-[11px] ${
                                                                /[A-Z]/.test(
                                                                    passwordBaru
                                                                )
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            ✓ Huruf besar
                                                        </span>

                                                        <span
                                                            className={`text-[11px] ${
                                                                /[0-9]/.test(
                                                                    passwordBaru
                                                                )
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            ✓ Angka
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* KONFIRMASI */}
                                        <PasswordInput
                                            label="Konfirmasi Password Baru"
                                            value={konfirmasiPassword}
                                            onChange={setKonfirmasiPassword}
                                            show={showKonf}
                                            setShow={setShowKonf}
                                            placeholder="Ketik ulang password baru"
                                        />

                                        {/* MATCH STATUS */}
                                        {konfirmasiPassword && (
                                            <div
                                                className={`page-enter flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                                                    passwordBaru ===
                                                    konfirmasiPassword
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                {passwordBaru ===
                                                konfirmasiPassword ? (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Password cocok
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4" />
                                                        Password belum cocok
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* ========================================
                                            BUTTON
                                        ======================================== */}
                                        <div className="border-t border-slate-100 pt-5">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="shine-button group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                                            >
                                                {loading ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Lock className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                                                )}

                                                <span className="relative z-10">
                                                    {loading
                                                        ? "Menyimpan Perubahan..."
                                                        : "Update Password"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>

                                    {/* ========================================
                                        SECURITY NOTE
                                    ======================================== */}
                                    <div className="security-glow mt-6 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/40">
                                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                                        <p className="text-xs font-medium leading-relaxed text-slate-500">
                                            Pastikan password baru tidak
                                            digunakan pada akun lain dan
                                            jangan membagikan password kepada
                                            siapa pun.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}