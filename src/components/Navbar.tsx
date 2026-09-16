import { useState } from "react";
import { User, Bell, Search, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const notifications = [
        {
            id: 1,
            title: "Sistem Monitoring Aktif",
            message: "Dashboard monitoring PLN UP2B Ungaran berjalan normal.",
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
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-all">
            {/* LEFT SIDE / SEARCH */}
            <div className="flex items-center gap-4">
               

                <div className="md:hidden">
                    <h1 className="text-sm font-bold text-slate-900">
                        PLN UP2B Ungaran
                    </h1>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
                {/* NOTIFICATION */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowNotifications((prev) => !prev)}
                        aria-label="Notifications"
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <Bell className="h-5 w-5" />

                        {/* RED NOTIFICATION DOT */}
                        <span className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full border border-white bg-red-500" />
                        </span>
                    </button>

                    {/* NOTIFICATION DROPDOWN */}
                    {showNotifications && (
                        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Notifications
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        Informasi terbaru sistem
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowNotifications(false)}
                                    aria-label="Close notifications"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="group cursor-pointer border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                                                    {notification.title}
                                                </p>
                                                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowNotifications(false)}
                                className="w-full border-t border-slate-100 px-4 py-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                Tandai semua sudah dibaca
                            </button>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-slate-200" />

                {/* ADMIN / PROFILE */}
                <button
                    type="button"
                    onClick={handleAdminClick}
                    className="group flex cursor-pointer items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Buka Profile & Security"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-inner transition-transform duration-200 group-hover:scale-105">
                        <User className="h-4 w-4" />
                    </div>

                    <div className="hidden flex-col text-left md:flex">
                        <p className="text-xs font-semibold leading-none text-slate-900 transition-colors group-hover:text-blue-600">
                            {user?.nama_lengkap || user?.username || "Administrator"}
                        </p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            {user?.role || "Operator"}
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}
