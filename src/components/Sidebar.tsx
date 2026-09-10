import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Database,
    Waypoints,
    LineChart,
    UserCircle,
    Users,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    Cpu,
} from "lucide-react";
import { useState } from "react";

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
            name: "Grafana",
            path: "/grafana",
            icon: <LineChart className="h-5 w-5" />,
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
        <aside
            className={`
                sticky top-0
                z-50
                flex
                h-screen
                shrink-0
                flex-col
                border-r
                border-slate-800
                bg-slate-950
                text-slate-300
                transition-all
                duration-300
                ease-in-out
                ${isOpen ? "w-64" : "w-0 border-r-0"}
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
                            : "-translate-x-4 opacity-0"
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
                        border-b
                        border-slate-800/60
                        px-6
                    "
                >
                    {/* LOGO */}
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-gradient-to-br
                            from-blue-500
                            to-blue-700
                            text-white
                            shadow-sm
                            shadow-blue-900/50
                            transition-all
                            duration-300
                            hover:scale-110
                            hover:rotate-3
                        "
                    >
                        <Waypoints className="h-4 w-4" />
                    </div>

                    {/* BRAND */}
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold tracking-wide text-slate-100">
                            FASOP
                        </h2>

                        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                            Monitoring
                        </p>
                    </div>

                    {/* ========================================
                        TOGGLE BUTTON - POJOK KANAN ATAS
                    ======================================== */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="
                            absolute
                            right-3
                            top-1/2
                            flex
                            h-8
                            w-8
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-500
                            transition-all
                            duration-200
                            hover:bg-slate-800
                            hover:text-slate-200
                            hover:scale-105
                        "
                        title="Tutup sidebar"
                    >
                        <PanelLeftClose className="h-5 w-5" />
                    </button>
                </div>

                {/* ========================================
                    MENU
                ======================================== */}
                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        px-3
                        py-6
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-slate-800
                        [&::-webkit-scrollbar]:w-1
                        [&::-webkit-scrollbar-track]:bg-transparent
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-slate-800
                        hover:[&::-webkit-scrollbar-thumb]:bg-slate-700
                    "
                >
                    {/* TITLE */}
                    <div
                        className="
                            mb-3
                            px-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-500
                        "
                    >
                        Main Navigation
                    </div>

                    {/* MENU LIST */}
                    <ul className="relative space-y-1">

                        {/* ========================================
                            SLIDING ACTIVE BACKGROUND
                        ======================================== */}
                        {activeIndex >= 0 && (
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    left-0
                                    top-0
                                    h-11
                                    w-full
                                    rounded-lg
                                    bg-blue-600/10
                                    transition-transform
                                    duration-300
                                    ease-out
                                "
                                style={{
                                    transform: `translateY(${activeIndex * 48}px)`,
                                }}
                            >
                                {/* BLUE LINE */}
                                <div
                                    className="
                                        absolute
                                        left-0
                                        top-1/2
                                        h-6
                                        w-0.5
                                        -translate-y-1/2
                                        rounded-r-full
                                        bg-blue-500
                                        shadow-[0_0_8px_rgba(59,130,246,0.8)]
                                    "
                                />
                            </div>
                        )}

                        {/* ========================================
                            MENU ITEMS
                        ======================================== */}
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                className="relative h-11"
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `
                                        group
                                        relative
                                        z-10
                                        flex
                                        h-11
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        text-sm
                                        font-medium
                                        transition-all
                                        duration-200

                                        ${
                                            isActive
                                                ? "text-blue-400"
                                                : "text-slate-400 hover:text-slate-200"
                                        }
                                        `
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {/* ICON */}
                                            <div
                                                className={`
                                                    transition-all
                                                    duration-300

                                                    ${
                                                        isActive
                                                            ? "scale-110 text-blue-500"
                                                            : "text-slate-500 group-hover:scale-110 group-hover:text-slate-300"
                                                    }
                                                `}
                                            >
                                                {item.icon}
                                            </div>

                                            {/* TEXT */}
                                            <span
                                                className="
                                                    transition-transform
                                                    duration-300
                                                    group-hover:translate-x-0.5
                                                "
                                            >
                                                {item.name}
                                            </span>

                                            {/* ACTIVE DOT */}
                                            <div
                                                className={`
                                                    ml-auto
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    transition-all
                                                    duration-300

                                                    ${
                                                        isActive
                                                            ? "scale-100 bg-blue-500 opacity-100 shadow-[0_0_8px_rgba(59,130,246,0.9)]"
                                                            : "scale-0 opacity-0"
                                                    }
                                                `}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ========================================
                    LOGOUT
                ======================================== */}
                <div
                    className="
                        shrink-0
                        border-t
                        border-slate-800/60
                        p-4
                    "
                >
                    <button
                        onClick={handleLogout}
                        className="
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-400
                            transition-all
                            duration-300
                            hover:bg-red-500/10
                            hover:text-red-400
                        "
                    >
                        <div
                            className="
                                transition-all
                                duration-300
                                group-hover:-translate-x-1
                                group-hover:scale-110
                            "
                        >
                            <LogOut className="h-5 w-5" />
                        </div>

                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* ========================================
                OPEN SIDEBAR BUTTON
                MUNCUL DI POJOK KANAN ATAS
                SAAT SIDEBAR DITUTUP
            ======================================== */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="
                        fixed
                        left-4
                        top-4
                        z-[100]
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        text-slate-600
                        shadow-sm
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:bg-slate-50
                        hover:text-blue-600
                    "
                    title="Buka sidebar"
                >
                    <PanelLeftOpen className="h-5 w-5" />
                </button>
            )}
        </aside>
    );
}