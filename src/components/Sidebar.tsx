import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Database,
    Waypoints,
    UserCircle,
    Users,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Cpu,
    Zap,
    ShieldAlert,
    Gauge,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();
    const location = useLocation();

    // ========================================
    // SIDEBAR TOGGLE
    // ========================================

    const [isOpen, setIsOpen] = useState(true);

    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    // ========================================
    // MENU
    // ========================================

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: "Database",
            path: "/database",
            icon: <Database className="h-5 w-5" />,
        },
        {
            name: "Skema",
            path: "/skema",
            icon: <Waypoints className="h-5 w-5" />,
        },
        {
            name: "Device",
            path: "/device",
            icon: <Cpu className="h-5 w-5" />,
        },
        {
            name: "OLS",
            path: "/ols",
            icon: <Zap className="h-5 w-5" />,
        },
        {
            name: "UFR Step Relay",
            path: "/ufr/step-relay",
            icon: <ShieldAlert className="h-5 w-5" />,
        },
        {
            name: "UFR Beban",
            path: "/ufr/beban",
            icon: <Gauge className="h-5 w-5" />,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <UserCircle className="h-5 w-5" />,
        },
        ...(user?.role === "admin"
            ? [
                  {
                      name: "Users",
                      path: "/users",
                      icon: <Users className="h-5 w-5" />,
                  },
              ]
            : []),
    ];

    // ========================================
    // ACTIVE MENU
    // ========================================

    const activeIndex = menuItems.findIndex(
        (item) =>
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/")
    );

    return (
        <>
            <style>{`
                @keyframes sidebarGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 rgba(0, 102, 255, 0);
                    }
                    50% {
                        box-shadow: 0 0 18px rgba(0, 102, 255, 0.12);
                    }
                }

                @keyframes yellowPulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.75;
                    }
                    50% {
                        transform: scale(1.35);
                        opacity: 1;
                    }
                }

                @keyframes logoFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-2px);
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-120%);
                    }
                    100% {
                        transform: translateX(120%);
                    }
                }

                .sidebar-menu-item {
                    position: relative;
                    overflow: hidden;
                }

                .sidebar-menu-item::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(0, 191, 255, 0.08),
                        transparent
                    );
                    transform: translateX(-120%);
                    transition: transform 0.6s ease;
                    pointer-events: none;
                }

                .sidebar-menu-item:hover::before {
                    transform: translateX(120%);
                }

                .sidebar-card-hover {
                    transition:
                        transform 0.25s ease,
                        box-shadow 0.25s ease,
                        border-color 0.25s ease;
                }

                .sidebar-card-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(0, 102, 255, 0.1);
                    border-color: rgba(0, 102, 255, 0.2);
                }

                @media (prefers-reduced-motion: reduce) {
                    .sidebar-menu-item::before {
                        display: none;
                    }

                    .sidebar-card-hover {
                        transition: none;
                    }
                }
            `}</style>

            <aside
                className={`
                    sticky
                    top-0
                    z-50
                    flex
                    h-screen
                    shrink-0
                    flex-col
                    overflow-hidden
                    border-r
                    border-[#CFE2FF]
                    bg-white
                    text-[#082B5F]
                    shadow-[6px_0_25px_rgba(0,102,255,0.07)]
                    transition-all
                    duration-300
                    ease-in-out
                    ${
                        isOpen
                            ? "w-64"
                            : "w-0 border-r-0 shadow-none"
                    }
                `}
            >
                {/* ========================================
                    SIDEBAR CONTENT
                ======================================== */}

                <div
                    className={`
                        flex
                        h-full
                        w-64
                        flex-col
                        overflow-hidden
                        transition-all
                        duration-300
                        ${
                            isOpen
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-5 opacity-0"
                        }
                    `}
                >
                    {/* ========================================
                        HEADER / LOGO
                    ======================================== */}

                    <div
                        className="
                            relative
                            flex
                            h-16
                            shrink-0
                            items-center
                            gap-3
                            overflow-hidden
                            border-b
                            border-[#CFE2FF]
                            bg-white
                            px-5
                        "
                    >
                        {/* Decorative glow */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -left-8
                                top-0
                                h-20
                                w-20
                                rounded-full
                                bg-[#00BFFF]/10
                                blur-2xl
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                right-8
                                -top-10
                                h-20
                                w-20
                                rounded-full
                                bg-[#FFD600]/10
                                blur-2xl
                            "
                        />

                        {/* LOGO */}

                        <motion.div
                            whileHover={{
                                scale: 1.08,
                                rotate: 4,
                            }}
                            animate={{
                                y: [0, -1.5, 0],
                            }}
                            transition={{
                                y: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className="
                                relative
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-gradient-to-br
                                from-[#00BFFF]
                                via-[#0066FF]
                                to-[#082B5F]
                                text-white
                                shadow-[0_5px_15px_rgba(0,102,255,0.25)]
                            "
                        >
                            <Waypoints className="relative z-10 h-5 w-5" />

                            {/* Logo shine */}

                            <motion.div
                                animate={{
                                    x: ["-130%", "130%"],
                                }}
                                transition={{
                                    duration: 2.8,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    ease: "easeInOut",
                                }}
                                className="
                                    absolute
                                    inset-y-0
                                    w-1/2
                                    skew-x-[-20deg]
                                    bg-white/20
                                    blur-sm
                                "
                            />

                            {/* Logo glow */}

                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.45, 0, 0.45],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="
                                    absolute
                                    inset-0
                                    rounded-xl
                                    border-2
                                    border-white/40
                                "
                            />
                        </motion.div>

                        {/* BRAND */}

                        <div className="relative flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-sm font-extrabold tracking-wide text-[#082B5F]">
                                    FASOP
                                </h2>

                                <Sparkles className="h-3 w-3 text-[#FFD600]" />
                            </div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0066FF]">
                                Monitoring
                            </p>
                        </div>

                        {/* TOGGLE BUTTON */}

                        <motion.button
                            whileHover={{
                                scale: 1.08,
                            }}
                            whileTap={{
                                scale: 0.95,
                            }}
                            onClick={() => setIsOpen(false)}
                            className="
                                relative
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-transparent
                                text-[#8AA4C2]
                                transition-all
                                duration-200
                                hover:border-[#CFE2FF]
                                hover:bg-[#F5F9FF]
                                hover:text-[#0066FF]
                            "
                            title="Tutup sidebar"
                        >
                            <PanelLeftClose className="h-5 w-5" />
                        </motion.button>
                    </div>

                    {/* ========================================
                        MENU
                    ======================================== */}

                    <nav
                        className="
                            flex-1
                            overflow-y-auto
                            overflow-x-hidden
                            bg-gradient-to-b
                            from-white
                            to-[#F8FBFF]
                            px-3
                            py-6
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-[#CFE2FF]
                            hover:[&::-webkit-scrollbar-thumb]:bg-[#A9CCFF]
                        "
                    >
                        {/* TITLE */}

                        <div className="mb-3 flex items-center gap-2 px-3">
                            <div className="h-px w-3 bg-[#FFD600]" />

                            <span
                                className="
                                    text-[10px]
                                    font-extrabold
                                    uppercase
                                    tracking-[0.15em]
                                    text-[#7C95B3]
                                "
                            >
                                Main Navigation
                            </span>
                        </div>

                        {/* MENU LIST */}

                        <ul className="relative space-y-1">
                            {/* ACTIVE BACKGROUND */}

                            {activeIndex >= 0 && (
                                <motion.div
                                    initial={false}
                                    animate={{
                                        y: activeIndex * 48,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                    className="
                                        pointer-events-none
                                        absolute
                                        left-0
                                        top-0
                                        h-11
                                        w-full
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-[#BFD9FF]
                                        bg-gradient-to-r
                                        from-[#EAF4FF]
                                        via-[#F5FAFF]
                                        to-white
                                        shadow-[0_5px_15px_rgba(0,102,255,0.08)]
                                    "
                                >
                                    {/* TOP GLOW */}

                                    <div
                                        className="
                                            absolute
                                            left-0
                                            right-0
                                            top-0
                                            h-px
                                            bg-gradient-to-r
                                            from-[#00BFFF]
                                            via-[#0066FF]
                                            to-[#FFD600]
                                        "
                                    />

                                    {/* BLUE LINE */}

                                    <motion.div
                                        animate={{
                                            opacity: [0.55, 1, 0.55],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            h-6
                                            w-1
                                            -translate-y-1/2
                                            rounded-r-full
                                            bg-gradient-to-b
                                            from-[#00BFFF]
                                            to-[#0066FF]
                                            shadow-[0_0_12px_rgba(0,102,255,0.55)]
                                        "
                                    />

                                    {/* YELLOW DOT */}

                                    <motion.div
                                        animate={{
                                            scale: [1, 1.25, 1],
                                            opacity: [0.7, 1, 0.7],
                                        }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                        }}
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            h-1.5
                                            w-1.5
                                            -translate-y-1/2
                                            rounded-full
                                            bg-[#FFD600]
                                            shadow-[0_0_8px_rgba(255,214,0,0.9)]
                                        "
                                    />
                                </motion.div>
                            )}

                            {/* MENU ITEMS */}

                            {menuItems.map((item) => (
                                <li
                                    key={item.path}
                                    className="relative h-11"
                                >
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `
                                            sidebar-menu-item
                                            group
                                            relative
                                            z-10
                                            flex
                                            h-11
                                            w-full
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-3
                                            text-sm
                                            font-semibold
                                            transition-all
                                            duration-200

                                            ${
                                                isActive
                                                    ? "text-[#0066FF]"
                                                    : "text-[#667F9D] hover:bg-[#F0F7FF] hover:text-[#082B5F]"
                                            }
                                            `
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* ICON */}

                                                <motion.div
                                                    whileHover={{
                                                        scale: 1.12,
                                                    }}
                                                    className={`
                                                        relative
                                                        flex
                                                        items-center
                                                        justify-center
                                                        transition-all
                                                        duration-300

                                                        ${
                                                            isActive
                                                                ? "scale-110 text-[#0066FF]"
                                                                : "text-[#8AA4C2] group-hover:text-[#00AEEF]"
                                                        }
                                                    `}
                                                >
                                                    {item.icon}

                                                    {isActive && (
                                                        <motion.span
                                                            animate={{
                                                                scale: [
                                                                    1,
                                                                    1.5,
                                                                    1,
                                                                ],
                                                                opacity: [
                                                                    0.2,
                                                                    0,
                                                                    0.2,
                                                                ],
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                            }}
                                                            className="
                                                                absolute
                                                                inset-0
                                                                rounded-full
                                                                bg-[#00BFFF]
                                                            "
                                                        />
                                                    )}
                                                </motion.div>

                                                {/* TEXT */}

                                                <span
                                                    className="
                                                        relative
                                                        transition-all
                                                        duration-300
                                                        group-hover:translate-x-0.5
                                                    "
                                                >
                                                    {item.name}
                                                </span>

                                                {/* ACTIVE DOT */}

                                                <motion.div
                                                    animate={{
                                                        scale: isActive
                                                            ? 1
                                                            : 0,
                                                        opacity: isActive
                                                            ? 1
                                                            : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="
                                                        ml-auto
                                                        h-1.5
                                                        w-1.5
                                                        shrink-0
                                                        rounded-full
                                                        bg-[#FFD600]
                                                        shadow-[0_0_8px_rgba(255,214,0,0.85)]
                                                    "
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* ========================================
                        USER / LOGOUT AREA
                    ======================================== */}

                    <div
                        className="
                            relative
                            shrink-0
                            overflow-hidden
                            border-t
                            border-[#CFE2FF]
                            bg-gradient-to-b
                            from-[#F8FBFF]
                            to-[#F1F7FF]
                            p-4
                        "
                    >
                        {/* Decorative yellow line */}

                        <div
                            className="
                                absolute
                                left-4
                                right-4
                                top-0
                                h-px
                                bg-gradient-to-r
                                from-transparent
                                via-[#FFD600]
                                to-transparent
                                opacity-70
                            "
                        />

                        {/* USER MINI PROFILE */}

                        <div
                            className="
                                sidebar-card-hover
                                relative
                                mb-3
                                flex
                                items-center
                                gap-3
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#D8E8FA]
                                bg-white
                                p-3
                                shadow-[0_4px_14px_rgba(0,102,255,0.05)]
                            "
                        >
                            {/* Card glow */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-5
                                    -top-5
                                    h-14
                                    w-14
                                    rounded-full
                                    bg-[#00BFFF]/10
                                    blur-xl
                                "
                            />

                            {/* USER AVATAR */}

                            <div className="relative shrink-0">
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
                                        from-[#0066FF]
                                        via-[#00AEEF]
                                        to-[#082B5F]
                                        text-sm
                                        font-bold
                                        text-white
                                        shadow-[0_4px_12px_rgba(0,102,255,0.22)]
                                    "
                                >
                                    {(user?.username || "A")
                                        .charAt(0)
                                        .toUpperCase()}

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
                                        shadow-[0_0_7px_rgba(255,214,0,0.8)]
                                    "
                                />
                            </div>

                            {/* USER INFO */}

                            <div className="relative min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-[#082B5F]">
                                    {user?.full_name ||
                                        user?.username ||
                                        "Administrator"}
                                </p>

                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]" />

                                    <p className="text-[10px] font-semibold text-[#0066FF]">
                                        {user?.role === "admin"
                                            ? "Administrator"
                                            : "User"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* LOGOUT */}

                        <motion.button
                            whileHover={{
                                x: 2,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            onClick={handleLogout}
                            className="
                                group
                                relative
                                flex
                                w-full
                                items-center
                                gap-3
                                overflow-hidden
                                rounded-xl
                                border
                                border-transparent
                                px-3
                                py-2.5
                                text-sm
                                font-semibold
                                text-[#7189A5]
                                transition-all
                                duration-300
                                hover:border-red-100
                                hover:bg-red-50
                                hover:text-red-500
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-y-0
                                    left-0
                                    w-0
                                    bg-red-500/5
                                    transition-all
                                    duration-300
                                    group-hover:w-full
                                "
                            />

                            <div
                                className="
                                    relative
                                    transition-all
                                    duration-300
                                    group-hover:-translate-x-1
                                    group-hover:scale-110
                                "
                            >
                                <LogOut className="h-5 w-5" />
                            </div>

                            <span className="relative">Sign Out</span>
                        </motion.button>
                    </div>
                </div>

                {/* ========================================
                    OPEN SIDEBAR BUTTON
                ======================================== */}

                {!isOpen && (
                    <motion.button
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        whileHover={{
                            scale: 1.08,
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        onClick={() => setIsOpen(true)}
                        className="
                            fixed
                            left-4
                            top-4
                            z-[100]
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            border
                            border-[#CFE2FF]
                            bg-white
                            text-[#6E88A5]
                            shadow-[0_8px_25px_rgba(0,102,255,0.13)]
                            transition-all
                            duration-200
                            hover:border-[#A9CCFF]
                            hover:bg-[#F5F9FF]
                            hover:text-[#0066FF]
                        "
                        title="Buka sidebar"
                    >
                        {/* Button glow */}

                        <motion.div
                            animate={{
                                x: ["-120%", "120%"],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                            className="
                                absolute
                                inset-y-0
                                w-1/2
                                skew-x-[-20deg]
                                bg-[#00BFFF]/10
                                blur-sm
                            "
                        />

                        <PanelLeftOpen className="relative z-10 h-5 w-5" />

                        {/* Yellow accent */}

                        <span
                            className="
                                absolute
                                right-1
                                top-1
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#FFD600]
                                shadow-[0_0_6px_rgba(255,214,0,0.8)]
                            "
                        />
                    </motion.button>
                )}
            </aside>
        </>
    );
}