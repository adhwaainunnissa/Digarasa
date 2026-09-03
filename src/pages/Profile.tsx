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
    Zap
} from "lucide-react";

export default function Profile() {
    // ========================================
    // STATE: USER
    // ========================================
    const user = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); } 
        catch { return null; }
    }, []);

    // ========================================
    // STATE: FORM
    // ========================================
    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

    // VISIBILITY
    const [showLama, setShowLama] = useState(false);
    const [showBaru, setShowBaru] = useState(false);
    const [showKonf, setShowKonf] = useState(false);

    // STATUS
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ========================================
    // HANDLERS
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
            
            // Simulate API Call since the original code only had an alert()
            // In a real scenario, this would be an api.put('/admin/users/password', ...)
            await new Promise(resolve => setTimeout(resolve, 800)); 

            setSuccess(true);
            setPasswordLama("");
            setPasswordBaru("");
            setKonfirmasiPassword("");
            
            // Reset success message after a few seconds
            setTimeout(() => setSuccess(false), 5000);
            
        } catch (err) {
            setError("Terjadi kesalahan saat mengubah password. Silakan coba lagi.");
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

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
            
            {/* ========================================
                HEADER SECTION
            ======================================== */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">
                <div className="mx-auto flex max-w-5xl items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                        <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile & Security</h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">Kelola informasi akun dan preferensi keamanan Anda.</p>
                    </div>
                </div>
            </header>

            {/* ========================================
                MAIN CONTENT
            ======================================== */}
            <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ========================================
                        LEFT: INFORMASI AKUN
                    ======================================== */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col relative">
                            {/* PLN Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                            
                            <div className="p-6 pt-8">
                                <div className="mb-6 flex items-center justify-center">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 border-4 border-white shadow-md text-3xl font-bold text-slate-400">
                                        {(user?.nama_lengkap || user?.username || "U").charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Username</p>
                                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                                            <p className="font-mono text-sm font-medium text-slate-900">@{user?.username || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</p>
                                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                                            <p className="text-sm font-semibold text-slate-900">{user?.nama_lengkap || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Role & Permissions</p>
                                        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 flex items-center">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getRoleStyle(user?.role)}`}>
                                                {user?.role?.toLowerCase() === 'admin' && <Shield className="mr-1.5 h-3.5 w-3.5" />}
                                                {user?.role || "user"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========================================
                            FOOTER INFO
                        ======================================== */}
                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                            <Zap className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">FASOP Monitoring System</p>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">PLN UP2B Ungaran • Enterprise Control</p>
                            </div>
                        </div>
                    </div>

                    {/* ========================================
                        RIGHT: GANTI PASSWORD
                    ======================================== */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
                            {/* PLN Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                            
                            <div className="p-6 pt-8 md:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Ganti Password</h2>
                                        <p className="text-sm text-slate-500 font-medium">Perbarui password Anda secara berkala untuk menjaga keamanan akun.</p>
                                    </div>
                                </div>

                                {/* STATUS ALERTS */}
                                {error && (
                                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="h-5 w-5 shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                                        <p className="text-sm font-medium">Password berhasil diubah dengan aman.</p>
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="space-y-5">
                                    
                                    {/* PASSWORD LAMA */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password Lama</label>
                                        <div className="relative">
                                            <input
                                                type={showLama ? "text" : "password"}
                                                value={passwordLama}
                                                onChange={(e) => setPasswordLama(e.target.value)}
                                                placeholder="Masukkan password saat ini"
                                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLama(!showLama)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showLama ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* PASSWORD BARU */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password Baru</label>
                                        <div className="relative">
                                            <input
                                                type={showBaru ? "text" : "password"}
                                                value={passwordBaru}
                                                onChange={(e) => setPasswordBaru(e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowBaru(!showBaru)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showBaru ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* KONFIRMASI PASSWORD */}
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Konfirmasi Password Baru</label>
                                        <div className="relative">
                                            <input
                                                type={showKonf ? "text" : "password"}
                                                value={konfirmasiPassword}
                                                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                                                placeholder="Ketik ulang password baru"
                                                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowKonf(!showKonf)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            >
                                                {showKonf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                            {loading ? "Menyimpan Perubahan..." : "Update Password"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}