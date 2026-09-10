import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import {
    Users as UsersIcon,
    Shield,
    User,
    Search,
    Plus,
    Trash2,
    X,
    AlertCircle,
    RefreshCw,
    CheckCircle2
} from "lucide-react";

interface AdminUser {
    id: number;
    username: string;
    nama_lengkap: string;
    role: string;
    created_at: string;
}

export default function Users() {
    // ========================================
    // STATE: MAIN
    // ========================================
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    // ========================================
    // STATE: MODAL (ADD USER)
    // ========================================
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // FORM FIELDS
    const [username, setUsername] = useState("");
    const [nama, setNama] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("operator");

    // ========================================
    // STATE: MODAL (DELETE CONFIRM)
    // ========================================
    const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
    const [deleting, setDeleting] = useState(false);

    // ========================================
    // CURRENT USER (Untuk proteksi hapus diri sendiri)
    // ========================================
    const currentUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user") || "null"); }
        catch { return null; }
    }, []);

    // ========================================
    // LOAD USERS
    // ========================================
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/admin/users");
            setUsers(response.data || []);
        } catch (error: any) {
            console.error("Gagal mengambil user:", error);
            setError(error?.response?.data?.message || "Gagal mengambil data user.");
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // SEARCH & FILTERING
    // ========================================
    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase();
        return users.filter((user) =>
            user.username.toLowerCase().includes(keyword) ||
            user.nama_lengkap.toLowerCase().includes(keyword) ||
            user.role.toLowerCase().includes(keyword)
        );
    }, [users, search]);

    // ========================================
    // STATISTIK
    // ========================================
    const totalAdmin = users.filter((user) => user.role.toLowerCase() === "admin").length;
    const totalOperator = users.filter((user) => user.role.toLowerCase() === "operator").length;

    // ========================================
    // ROLE STYLE
    // ========================================
    const getRoleStyle = (role: string) => {
        if (role.toLowerCase() === "admin") {
            return "bg-blue-50 text-blue-700 border-blue-200";
        }
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    // ========================================
    // ADD USER ACTIONS
    // ========================================
    const openAddForm = () => {
        setUsername("");
        setNama("");
        setPassword("");
        setRole("operator");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) return;
        setShowForm(false);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return alert("Username wajib diisi.");
        if (!nama.trim()) return alert("Nama lengkap wajib diisi.");
        if (!password) return alert("Password wajib diisi.");
        if (password.length < 8) return alert("Password minimal 8 karakter.");

        try {
            setSaving(true);
            await api.post("/admin/users", {
                username: username.trim(),
                nama_lengkap: nama.trim(),
                password,
                role,
            });

            closeForm();
            await loadUsers();

            // Optional: Show a temporary success toast instead of native alert if we had a toast system
            // For now, we just reload cleanly without an alert for a more seamless feel.
        } catch (error: any) {
            console.error("Gagal menambahkan user:", error);
            alert(error?.response?.data?.message || "Gagal menambahkan user.");
        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // DELETE USER ACTIONS
    // ========================================
    const confirmDelete = (user: AdminUser) => {
        if (currentUser?.id === user.id) {
            return alert("Akun yang sedang Anda gunakan tidak dapat dihapus.");
        }
        setUserToDelete(user);
    };

    const executeDelete = async () => {
        if (!userToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/admin/users/${userToDelete.id}`);
            setUserToDelete(null);
            await loadUsers();
        } catch (error: any) {
            console.error("Gagal menghapus user:", error);
            alert(error?.response?.data?.message || "Gagal menghapus user.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">

            {/* ========================================
                HEADER SECTION
            ======================================== */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
                            <p className="mt-1 text-sm font-medium text-slate-500">Kelola akses dan akun pengguna sistem FASOP.</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddForm}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah User
                    </button>
                </div>
            </header>

            {/* ========================================
                MAIN CONTENT
            ======================================== */}
            <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="mx-auto max-w-7xl space-y-6">

                    {/* ERROR ALERT */}
                    {error && (
                        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* STATISTIK CARDS */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                                <UsersIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total User</p>
                                <h2 className="mt-1 text-3xl font-bold text-slate-900">{users.length}</h2>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Administrator</p>
                                <h2 className="mt-1 text-3xl font-bold text-blue-700">{totalAdmin}</h2>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Operator</p>
                                <h2 className="mt-1 text-3xl font-bold text-slate-700">{totalOperator}</h2>
                            </div>
                        </div>
                    </div>

                    {/* TABLE SECTION */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">

                        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between bg-slate-50/50 rounded-t-xl">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Daftar Pengguna</h2>
                                <p className="text-sm font-medium text-slate-500">Kelola semua akun yang terdaftar pada sistem.</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari username, nama, atau role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:w-80 shadow-sm"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-16 text-slate-400 space-y-3">
                                <RefreshCw className="h-8 w-8 animate-spin" />
                                <span className="text-sm font-medium">Memuat data user...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-16 text-slate-500 space-y-3">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                    <UsersIcon className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-700">Tidak ada user ditemukan</h3>
                                <p className="text-sm text-slate-500">
                                    {search ? "Coba gunakan kata kunci pencarian yang lain." : "Belum ada user yang terdaftar di sistem."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 w-16">#</th>
                                            <th className="px-6 py-4">Informasi User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Tanggal Dibuat</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {filteredUsers.map((user, index) => {
                                            const isSelf = currentUser?.id === user.id;
                                            return (
                                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold shadow-sm border ${user.role.toLowerCase() === 'admin' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                                {(user.nama_lengkap || user.username || "U").charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                                                    {user.nama_lengkap}
                                                                    {isSelf && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded uppercase font-semibold border border-slate-200">Anda</span>}
                                                                </span>
                                                                <span className="text-xs font-medium text-slate-500">@{user.username}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getRoleStyle(user.role)}`}>
                                                            {user.role.toLowerCase() === 'admin' && <Shield className="mr-1 h-3 w-3" />}
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {new Date(user.created_at).toLocaleString("id-ID", {
                                                            day: "2-digit", month: "short", year: "numeric"
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => confirmDelete(user)}
                                                            disabled={isSelf}
                                                            className="inline-flex items-center justify-center rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                                            title={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus User"}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ========================================
                MODAL: TAMBAH USER
            ======================================== */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeForm} />
                    <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Tambah User Baru</h3>
                                <p className="text-xs font-medium text-slate-500">Buat akun untuk memberi akses sistem.</p>
                            </div>
                            <button onClick={closeForm} className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Contoh: John Doe"
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="contoh: johndoe"
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="operator">Operator (Akses Terbatas)</option>
                                    <option value="admin">Administrator (Akses Penuh)</option>
                                </select>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={closeForm} disabled={saving} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">
                                    Batal
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 transition-colors">
                                    {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    {saving ? "Menyimpan..." : "Simpan User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================
                MODAL: DELETE CONFIRMATION
            ======================================== */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => !deleting && setUserToDelete(null)} />
                    <div className="relative w-full max-w-sm transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                                <AlertCircle className="h-7 w-7 text-red-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900">Hapus Pengguna?</h3>
                            <p className="text-sm text-slate-500">
                                Apakah Anda yakin ingin menghapus <strong>{userToDelete.nama_lengkap}</strong> (@{userToDelete.username})? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={() => setUserToDelete(null)}
                                disabled={deleting}
                                className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                            >
                                Batal
                            </button>
                            <div className="w-px bg-slate-100"></div>
                            <button
                                onClick={executeDelete}
                                disabled={deleting}
                                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                                {deleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                                {deleting ? "Menghapus..." : "Hapus Akun"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}