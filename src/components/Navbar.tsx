import { useState } from "react";
import {
    User,
    Bell,
    CheckCircle2,
    X,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const notifications = [
        {
            id: 1,
            title: "Sistem Monitoring Aktif",
            message:
                "Dashboard monitoring PLN UP2B Ungaran berjalan normal.",
            time: "Baru saja",
        },
        {
            id: 2,
            title: "Data Terbaru Tersedia",
            message: "Data telemetry berhasil diperbarui.",
            time: "5 menit lalu",
        },
        {
            id: 3,
            title: "Status Server Normal",
            message: "Koneksi server dalam kondisi normal.",
            time: "10 menit lalu",
        },
    ];

    const handleAdminClick = () => {
        setShowNotifications(false);
        navigate("/profile");
    };

    return (
        <>
            {/* =====================================================
                NAVBAR STYLE
            ===================================================== */}

            <style>{`
                @keyframes navbarShimmer {
                    0% {
                        transform: translateX(-120%);
                    }
                    100% {
                        transform: translateX(120%);
                    }
                }

                @keyframes notificationPulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.25);
                        opacity: 0.75;
                    }
                }

                @keyframes profileGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 rgba(0, 102, 255, 0);
                    }
                    50% {
                        box-shadow: 0 0 16px rgba(0, 191, 255, 0.2);
                    }
                }

                .navbar-shimmer {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                }

                .navbar-shimmer::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 30%;
                    transform: translateX(-120%) skewX(-20deg);
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(0, 191, 255, 0.08),
                        transparent
                    );
                    animation: navbarShimmer 5s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .navbar-shimmer::after {
                        animation: none;
                    }
                }
            `}</style>

            <header
                className="
                    sticky
                    top-0
                    z-20
                    flex
                    h-16
                    w-full
                    shrink-0
                    items-center
                    justify-between
                    overflow-visible
                    border-b
                    border-[#CFE2FF]
                    bg-white/90
                    px-6
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    shadow-[0_4px_20px_rgba(0,102,255,0.05)]
                "
            >
                {/* =====================================================
                    DECORATIVE TOP LINE
                ===================================================== */}

                <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-0
                        h-[2px]
                        bg-gradient-to-r
                        from-[#00BFFF]
                        via-[#0066FF]
                        to-[#FFD600]
                    "
                />

                <div className="navbar-shimmer" />

                {/* =====================================================
                    LEFT SIDE
                ===================================================== */}

                <div className="relative flex items-center gap-4">
                    {/* Mobile title */}

                    <div className="md:hidden">
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-gradient-to-br
                                    from-[#00BFFF]
                                    to-[#0066FF]
                                    text-white
                                    shadow-[0_4px_12px_rgba(0,102,255,0.2)]
                                "
                            >
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <div>
                                <h1 className="text-sm font-extrabold text-[#082B5F]">
                                    PLN UP2B Ungaran
                                </h1>

                                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#0066FF]">
                                    FASOP Monitoring
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    RIGHT SIDE
                ===================================================== */}

                <div className="relative flex items-center gap-3">
                    {/* =================================================
                        NOTIFICATION
                    ================================================= */}

                    <div className="relative">
                        <motion.button
                            type="button"
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() =>
                                setShowNotifications((prev) => !prev)
                            }
                            aria-label="Notifications"
                            className={`
                                group
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                transition-all
                                duration-300
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#00BFFF]/20

                                ${
                                    showNotifications
                                        ? "border-[#BFD9FF] bg-[#F0F7FF] text-[#0066FF] shadow-[0_5px_15px_rgba(0,102,255,0.1)]"
                                        : "border-transparent bg-transparent text-[#7189A5] hover:border-[#D8E8FA] hover:bg-[#F5F9FF] hover:text-[#0066FF]"
                                }
                            `}
                        >
                            {/* Icon glow */}

                            <span
                                className="
                                    absolute
                                    inset-2
                                    rounded-full
                                    bg-[#00BFFF]/10
                                    opacity-0
                                    blur-md
                                    transition-opacity
                                    duration-300
                                    group-hover:opacity-100
                                "
                            />

                            <Bell
                                className={`
                                    relative
                                    z-10
                                    h-5
                                    w-5
                                    transition-all
                                    duration-300
                                    ${
                                        showNotifications
                                            ? "text-[#0066FF]"
                                            : "text-[#7189A5] group-hover:text-[#00AEEF]"
                                    }
                                `}
                            />

                            {/* NOTIFICATION DOT */}

                            <span
                                className="
                                    absolute
                                    right-2
                                    top-1.5
                                    flex
                                    h-2.5
                                    w-2.5
                                "
                            >
                                <span
                                    className="
                                        absolute
                                        inline-flex
                                        h-full
                                        w-full
                                        animate-ping
                                        rounded-full
                                        bg-[#FFD600]
                                        opacity-60
                                    "
                                />

                                <span
                                    className="
                                        relative
                                        inline-flex
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                        border-2
                                        border-white
                                        bg-[#FFD600]
                                        shadow-[0_0_8px_rgba(255,214,0,0.9)]
                                    "
                                />
                            </span>
                        </motion.button>

                        {/* =================================================
                            NOTIFICATION DROPDOWN
                        ================================================= */}

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -8,
                                        scale: 0.97,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -8,
                                        scale: 0.97,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className="
                                        absolute
                                        right-0
                                        top-12
                                        z-50
                                        w-80
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-[#CFE2FF]
                                        bg-white
                                        shadow-[0_15px_40px_rgba(0,82,180,0.15)]
                                    "
                                >
                                    {/* Dropdown accent */}

                                    <div
                                        className="
                                            h-[3px]
                                            w-full
                                            bg-gradient-to-r
                                            from-[#00BFFF]
                                            via-[#0066FF]
                                            to-[#FFD600]
                                        "
                                    />

                                    {/* HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            border-b
                                            border-[#E3EEFC]
                                            bg-gradient-to-r
                                            from-[#F5FAFF]
                                            to-white
                                            px-4
                                            py-3
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-gradient-to-br
                                                    from-[#00BFFF]
                                                    to-[#0066FF]
                                                    text-white
                                                    shadow-[0_4px_12px_rgba(0,102,255,0.2)]
                                                "
                                            >
                                                <Bell className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-extrabold text-[#082B5F]">
                                                    Notifications
                                                </h3>

                                                <p className="mt-0.5 text-[11px] text-[#7C95B3]">
                                                    Informasi terbaru sistem
                                                </p>
                                            </div>
                                        </div>

                                        <motion.button
                                            type="button"
                                            whileHover={{
                                                scale: 1.08,
                                            }}
                                            whileTap={{
                                                scale: 0.95,
                                            }}
                                            onClick={() =>
                                                setShowNotifications(false)
                                            }
                                            aria-label="Close notifications"
                                            className="
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-transparent
                                                text-[#8AA4C2]
                                                transition-all
                                                hover:border-[#CFE2FF]
                                                hover:bg-[#F0F7FF]
                                                hover:text-[#0066FF]
                                            "
                                        >
                                            <X className="h-4 w-4" />
                                        </motion.button>
                                    </div>

                                    {/* NOTIFICATION LIST */}

                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map(
                                            (notification, index) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: 8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                    }}
                                                    className="
                                                        group
                                                        cursor-pointer
                                                        border-b
                                                        border-[#EAF1F9]
                                                        px-4
                                                        py-3.5
                                                        transition-all
                                                        duration-200
                                                        hover:bg-[#F5FAFF]
                                                    "
                                                >
                                                    <div className="flex gap-3">
                                                        {/* STATUS ICON */}

                                                        <div
                                                            className="
                                                                mt-0.5
                                                                flex
                                                                h-9
                                                                w-9
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-xl
                                                                border
                                                                border-[#CFE8FF]
                                                                bg-[#EFF8FF]
                                                                text-[#0066FF]
                                                                transition-all
                                                                duration-300
                                                                group-hover:border-[#B8D8FF]
                                                                group-hover:bg-[#E6F4FF]
                                                                group-hover:text-[#00AEEF]
                                                            "
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </div>

                                                        {/* CONTENT */}

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p
                                                                    className="
                                                                        text-xs
                                                                        font-bold
                                                                        text-[#082B5F]
                                                                        transition-colors
                                                                        group-hover:text-[#0066FF]
                                                                    "
                                                                >
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </p>

                                                                <span
                                                                    className="
                                                                        mt-1
                                                                        h-1.5
                                                                        w-1.5
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-[#FFD600]
                                                                        shadow-[0_0_6px_rgba(255,214,0,0.8)]
                                                                    "
                                                                />
                                                            </div>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[11px]
                                                                    leading-relaxed
                                                                    text-[#7189A5]
                                                                "
                                                            >
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1.5
                                                                    text-[10px]
                                                                    font-semibold
                                                                    text-[#9AAFC5]
                                                                "
                                                            >
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        )}
                                    </div>

                                    {/* FOOTER */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNotifications(false)
                                        }
                                        className="
                                            relative
                                            w-full
                                            overflow-hidden
                                            border-t
                                            border-[#DCEBFA]
                                            bg-[#F8FBFF]
                                            px-4
                                            py-3
                                            text-xs
                                            font-bold
                                            text-[#0066FF]
                                            transition-all
                                            hover:bg-[#EFF7FF]
                                            hover:text-[#0052CC]
                                        "
                                    >
                                        <span className="relative z-10">
                                            Tandai semua sudah dibaca
                                        </span>

                                        <span
                                            className="
                                                absolute
                                                bottom-0
                                                left-0
                                                h-[2px]
                                                w-0
                                                bg-gradient-to-r
                                                from-[#00BFFF]
                                                to-[#FFD600]
                                                transition-all
                                                duration-300
                                                hover:w-full
                                            "
                                        />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* =================================================
                        DIVIDER
                    ================================================= */}

                    <div
                        className="
                            h-7
                            w-px
                            bg-gradient-to-b
                            from-transparent
                            via-[#CFE2FF]
                            to-transparent
                        "
                    />

                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <motion.button
                        type="button"
                        whileHover={{
                            scale: 1.01,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        onClick={handleAdminClick}
                        className="
                            group
                            relative
                            flex
                            cursor-pointer
                            items-center
                            gap-3
                            overflow-hidden
                            rounded-xl
                            border
                            border-transparent
                            py-1.5
                            pl-1.5
                            pr-3
                            transition-all
                            duration-300
                            hover:border-[#D8E8FA]
                            hover:bg-[#F5F9FF]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#00BFFF]/20
                        "
                        title="Buka Profile & Security"
                    >
                        {/* Profile shimmer */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                -translate-x-full
                                bg-gradient-to-r
                                from-transparent
                                via-[#00BFFF]/5
                                to-transparent
                                transition-transform
                                duration-700
                                group-hover:translate-x-full
                            "
                        />

                        {/* AVATAR */}

                        <div className="relative">
                            <motion.div
                                whileHover={{
                                    scale: 1.08,
                                }}
                                className="
                                    relative
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    overflow-hidden
                                    rounded-full
                                    bg-gradient-to-br
                                    from-[#00BFFF]
                                    via-[#0066FF]
                                    to-[#082B5F]
                                    text-white
                                    shadow-[0_4px_14px_rgba(0,102,255,0.25)]
                                "
                            >
                                <User className="relative z-10 h-4.5 w-4.5" />

                                {/* Avatar shine */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-tr
                                        from-transparent
                                        via-white/15
                                        to-white/25
                                    "
                                />
                            </motion.div>

                            {/* ONLINE DOT */}

                            <motion.span
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="
                                    absolute
                                    bottom-0
                                    right-0
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    border-2
                                    border-white
                                    bg-[#FFD600]
                                    shadow-[0_0_8px_rgba(255,214,0,0.9)]
                                "
                            />
                        </div>

                        {/* PROFILE INFO */}

                        <div className="relative hidden min-w-0 flex-col text-left md:flex">
                            <p
                                className="
                                    max-w-[170px]
                                    truncate
                                    text-xs
                                    font-extrabold
                                    leading-none
                                    text-[#082B5F]
                                    transition-colors
                                    group-hover:text-[#0066FF]
                                "
                            >
                                {user?.nama_lengkap ||
                                    user?.username ||
                                    "Administrator"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#00BFFF]
                                        shadow-[0_0_5px_rgba(0,191,255,0.6)]
                                    "
                                />

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-[#0066FF]
                                    "
                                >
                                    {user?.role || "Operator"}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                </div>
            </header>
        </>
    );
}