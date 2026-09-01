import {
    FaTachometerAlt,
    FaDatabase,
    FaChartLine,
    FaUser,
    FaSignOutAlt,
} from "react-icons/fa";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

export default function Sidebar() {
const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

    const navigate = useNavigate();

    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
            replace: true,
        });
    };


    // ========================================
    // MENU
    // ========================================

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <FaTachometerAlt />,
        },
        {
            name: "Database",
            path: "/database",
            icon: <FaDatabase />,
        },
        {
            name: "Skema",
            path: "/skema",
            icon: <FaDatabase />,
        },
        {
            name: "Grafana",
            path: "/grafana",
            icon: <FaChartLine />,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <FaUser />,
        },
        ...(user?.role === "admin"
    ? [
        {
            name: "Users",
            path: "/users",
            icon: <FaUser />,
        },
    ]
    : []),
    ];


    return (
        <aside className="flex min-h-screen w-64 flex-col bg-blue-700 text-white">

            {/* ========================================
                LOGO
            ======================================== */}

            <div className="px-6 py-6">

                <h2 className="text-2xl font-bold">
                    ⚡ FASOP
                </h2>

                <p className="mt-1 text-sm text-blue-200">
                    Monitoring System
                </p>

            </div>


            {/* ========================================
                MENU
            ======================================== */}

            <nav className="flex-1 px-4">

                <div className="space-y-2">

                    {menuItems.map(
                        (item) => (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    rounded-lg px-4 py-3
                                    transition
                                    ${
                                        isActive
                                            ? "bg-white text-blue-700"
                                            : "text-white hover:bg-blue-600"
                                    }
                                    `
                                }
                            >

                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>

                        )
                    )}

                </div>

            </nav>


            {/* ========================================
                LOGOUT
            ======================================== */}

            <div className="border-t border-blue-500 p-4">

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-white transition hover:bg-red-500"
                >

                    <FaSignOutAlt />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}