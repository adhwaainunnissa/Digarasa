import { NavLink, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Database, 
    Waypoints, 
    LineChart, 
    UserCircle, 
    Users, 
    LogOut 
} from "lucide-react";

export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const navigate = useNavigate();

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

    return (
        <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300">
            
            {/* ========================================
                LOGO & BRANDING
            ======================================== */}
            <div className="flex h-16 items-center gap-3 border-b border-slate-800/60 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-900/50">
                    <Waypoints className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold tracking-wide text-slate-100">
                        FASOP
                    </h2>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                        Monitoring
                    </p>
                </div>
            </div>

            {/* ========================================
                MENU
            ======================================== */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
                <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Main Navigation
                </div>
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            {item.icon}
                                        </div>
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                        )}
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
            <div className="border-t border-slate-800/60 p-4">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                >
                    <div className="transition-transform duration-200 group-hover:-translate-x-0.5">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}