import { User, Bell, Search } from "lucide-react";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-all">
            
            {/* LEFT SIDE / BREADCRUMBS OR TITLE */}
            <div className="flex items-center gap-4">
                <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-500 md:flex">
                    <Search className="h-4 w-4 text-slate-400" />
                    <span className="w-48 truncate placeholder-slate-400">Search telemetry, logs, or nodes...</span>
                    <span className="ml-2 rounded border border-slate-200 bg-white px-1 text-[10px] font-bold text-slate-400">⌘K</span>
                </div>
                
                {/* Fallback title for smaller screens */}
                <div className="md:hidden">
                    <h1 className="text-sm font-bold text-slate-900">
                        PLN UP2B Ungaran
                    </h1>
                </div>
            </div>

            {/* RIGHT SIDE / USER AREA */}
            <div className="flex items-center gap-4">
                
                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                    </span>
                </button>

                <div className="h-6 w-px bg-slate-200"></div>

                {/* User Profile */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-slate-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-inner">
                        <User className="h-4 w-4" />
                    </div>

                    <div className="hidden flex-col md:flex">
                        <p className="text-xs font-semibold leading-none text-slate-900 group-hover:text-blue-600 transition-colors">
                            {user?.nama_lengkap || user?.username || "Administrator"}
                        </p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            {user?.role || "Operator"}
                        </p>
                    </div>
                </div>

            </div>
        </header>
    );
}