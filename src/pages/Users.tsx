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
    CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // ========================================
    // STATE: MODAL ADD USER
    // ========================================

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [username, setUsername] = useState("");
    const [nama, setNama] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("operator");

    // ========================================
    // STATE: DELETE
    // ========================================

    const [userToDelete, setUserToDelete] =
        useState<AdminUser | null>(null);

    const [deleting, setDeleting] = useState(false);

    // ========================================
    // CURRENT USER
    // ========================================

    const currentUser = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch {
            return null;
        }
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

            setError(
                error?.response?.data?.message ||
                    "Gagal mengambil data user."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // SEARCH
    // ========================================

    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase();

        return users.filter(
            (user) =>
                user.username
                    .toLowerCase()
                    .includes(keyword) ||
                user.nama_lengkap
                    .toLowerCase()
                    .includes(keyword) ||
                user.role
                    .toLowerCase()
                    .includes(keyword)
        );
    }, [users, search]);

    // ========================================
    // STATISTIK
    // ========================================

    const totalAdmin = users.filter(
        (user) => user.role.toLowerCase() === "admin"
    ).length;

    const totalOperator = users.filter(
        (user) => user.role.toLowerCase() === "operator"
    ).length;

    // ========================================
    // ROLE STYLE
    // ========================================

    const getRoleStyle = (role: string) => {
        if (role.toLowerCase() === "admin") {
            return {
                wrapper:
                    "bg-blue-50 text-[#0066FF] border-blue-100",
                icon: "text-[#0066FF]",
            };
        }

        return {
            wrapper:
                "bg-yellow-50 text-[#B58900] border-yellow-100",
            icon: "text-[#D6A900]",
        };
    };

    // ========================================
    // ADD USER
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

        if (!username.trim()) {
            return alert("Username wajib diisi.");
        }

        if (!nama.trim()) {
            return alert("Nama lengkap wajib diisi.");
        }

        if (!password) {
            return alert("Password wajib diisi.");
        }

        if (password.length < 8) {
            return alert("Password minimal 8 karakter.");
        }

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
        } catch (error: any) {
            console.error("Gagal menambahkan user:", error);

            alert(
                error?.response?.data?.message ||
                    "Gagal menambahkan user."
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================================
    // DELETE USER
    // ========================================

    const confirmDelete = (user: AdminUser) => {
        if (currentUser?.id === user.id) {
            return alert(
                "Akun yang sedang Anda gunakan tidak dapat dihapus."
            );
        }

        setUserToDelete(user);
    };

    const executeDelete = async () => {
        if (!userToDelete) return;

        try {
            setDeleting(true);

            await api.delete(
                `/admin/users/${userToDelete.id}`
            );

            setUserToDelete(null);

            await loadUsers();
        } catch (error: any) {
            console.error("Gagal menghapus user:", error);

            alert(
                error?.response?.data?.message ||
                    "Gagal menghapus user."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#F5F9FF] text-slate-800">
            {/* ========================================================
                BACKGROUND DECORATION
            ======================================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                {/* BLUE GLOW */}

                <motion.div
                    className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#0066FF]/10 blur-3xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* YELLOW GLOW */}

                <motion.div
                    className="absolute -left-48 top-[45%] h-[450px] w-[450px] rounded-full bg-[#FFD600]/10 blur-3xl"
                    animate={{
                        x: [0, 25, 0],
                        y: [0, 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* CYAN GLOW */}

                <motion.div
                    className="absolute bottom-[-200px] right-[20%] h-[400px] w-[400px] rounded-full bg-[#00BFFF]/10 blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* SMALL DOT */}

                <motion.div
                    className="absolute right-[20%] top-[25%] h-2.5 w-2.5 rounded-full bg-[#FFD600]"
                    animate={{
                        y: [0, -12, 0],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                />
            </div>

            {/* ========================================================
                HEADER
            ======================================================== */}

            <motion.header
                initial={{
                    opacity: 0,
                    y: -25,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                }}
                className="relative z-10 shrink-0 border-b border-blue-100/80 bg-white/90 px-8 py-5 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
                    {/* TITLE */}

                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{
                                scale: 1.08,
                                rotate: 4,
                            }}
                            className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#00BFFF] via-[#0066FF] to-[#FFD600] text-white shadow-lg shadow-blue-500/20"
                        >
                            <UsersIcon className="relative z-10 h-6 w-6" />

                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 rounded-xl border-2 border-white/40"
                            />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-[#082B5F]">
                                User Management
                            </h1>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                Kelola akses dan akun pengguna
                                sistem FASOP.
                            </p>
                        </div>
                    </div>

                    {/* ADD BUTTON */}

                    <motion.button
                        whileHover={{
                            y: -3,
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        onClick={openAddForm}
                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00AEEF] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30"
                    >
                        <motion.div
                            whileHover={{
                                rotate: 90,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </motion.div>

                        Tambah User
                    </motion.button>
                </div>
            </motion.header>

            {/* ========================================================
                MAIN
            ======================================================== */}

            <main className="relative z-10 flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    {/* =================================================
                        ERROR
                    ================================================= */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-600 shadow-sm"
                            >
                                <AlertCircle className="h-5 w-5 shrink-0" />

                                <p className="text-sm font-semibold">
                                    {error}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* =================================================
                        STATISTIC CARDS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {/* TOTAL USER */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1,
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.015,
                                boxShadow:
                                    "0 20px 40px rgba(0,102,255,0.12)",
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
                        >
                            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#00BFFF] to-[#0066FF]" />

                            <motion.div
                                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50"
                                animate={{
                                    scale: [1, 1.15, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                            />

                            <div className="relative flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0066FF] ring-1 ring-blue-100 transition-all duration-300 group-hover:bg-[#0066FF] group-hover:text-white">
                                    <UsersIcon className="h-6 w-6" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Total User
                                    </p>

                                    <motion.h2
                                        initial={{
                                            opacity: 0,
                                            scale: 0.7,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        transition={{
                                            delay: 0.5,
                                        }}
                                        className="mt-1 text-3xl font-extrabold text-[#082B5F]"
                                    >
                                        {users.length}
                                    </motion.h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* ADMIN */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2,
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.015,
                                boxShadow:
                                    "0 20px 40px rgba(0,102,255,0.14)",
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"
                        >
                            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#0066FF] to-[#00BFFF]" />

                            <div className="relative flex items-center gap-4">
                                <motion.div
                                    whileHover={{
                                        rotate: 8,
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0066FF] ring-1 ring-blue-100 transition-all duration-300 group-hover:bg-[#0066FF] group-hover:text-white"
                                >
                                    <Shield className="h-6 w-6" />
                                </motion.div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Administrator
                                    </p>

                                    <h2 className="mt-1 text-3xl font-extrabold text-[#0066FF]">
                                        {totalAdmin}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* OPERATOR */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 25,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.3,
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.015,
                                boxShadow:
                                    "0 20px 40px rgba(255,214,0,0.16)",
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm"
                        >
                            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#FFD600] to-[#0066FF]" />

                            <div className="relative flex items-center gap-4">
                                <motion.div
                                    whileHover={{
                                        rotate: -8,
                                    }}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50 text-[#D6A900] ring-1 ring-yellow-100 transition-all duration-300 group-hover:bg-[#FFD600] group-hover:text-[#082B5F]"
                                >
                                    <User className="h-6 w-6" />
                                </motion.div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Operator
                                    </p>

                                    <h2 className="mt-1 text-3xl font-extrabold text-[#B58900]">
                                        {totalOperator}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.4,
                        }}
                        className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
                    >
                        {/* TABLE HEADER */}

                        <div className="flex flex-col justify-between gap-4 border-b border-blue-100 bg-[#F8FBFF] p-5 md:flex-row md:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#00BFFF] to-[#0066FF]" />

                                    <h2 className="text-base font-extrabold text-[#082B5F]">
                                        Daftar Pengguna
                                    </h2>
                                </div>

                                <p className="mt-1 pl-3 text-sm font-medium text-slate-500">
                                    Kelola semua akun yang terdaftar
                                    pada sistem.
                                </p>
                            </div>

                            {/* SEARCH */}

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0066FF]" />

                                <input
                                    type="text"
                                    placeholder="Cari username, nama, atau role..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-blue-100 bg-white py-2.5 pl-9 pr-9 text-sm font-medium text-slate-800 outline-none shadow-sm transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-500/10 md:w-80"
                                />

                                <AnimatePresence>
                                    {search && (
                                        <motion.button
                                            initial={{
                                                opacity: 0,
                                                scale: 0.7,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.7,
                                            }}
                                            onClick={() =>
                                                setSearch("")
                                            }
                                            className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 transition-all hover:bg-blue-50 hover:text-[#0066FF]"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center space-y-3 p-16 text-[#0066FF]">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <RefreshCw className="h-8 w-8" />
                                </motion.div>

                                <span className="text-sm font-semibold text-slate-500">
                                    Memuat data user...
                                </span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            /* =================================================
                                EMPTY
                            ================================================= */

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="flex flex-col items-center justify-center space-y-3 p-16 text-slate-500"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                                    <UsersIcon className="h-8 w-8 text-[#0066FF]/40" />
                                </div>

                                <h3 className="text-base font-bold text-[#082B5F]">
                                    Tidak ada user ditemukan
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {search
                                        ? "Coba gunakan kata kunci pencarian yang lain."
                                        : "Belum ada user yang terdaftar di sistem."}
                                </p>
                            </motion.div>
                        ) : (
                            /* =================================================
                                TABLE DATA
                            ================================================= */

                            <div className="overflow-x-auto">
                                <table className="w-full whitespace-nowrap text-left text-sm">
                                    <thead className="border-b border-blue-100 bg-[#F5F9FF] text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="w-16 px-6 py-4">
                                                #
                                            </th>

                                            <th className="px-6 py-4">
                                                Informasi User
                                            </th>

                                            <th className="px-6 py-4">
                                                Role
                                            </th>

                                            <th className="px-6 py-4">
                                                Tanggal Dibuat
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-blue-50 bg-white">
                                        {filteredUsers.map(
                                            (user, index) => {
                                                const isSelf =
                                                    currentUser?.id ===
                                                    user.id;

                                                const roleStyle =
                                                    getRoleStyle(
                                                        user.role
                                                    );

                                                return (
                                                    <motion.tr
                                                        key={user.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 8,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.35,
                                                            delay:
                                                                index *
                                                                0.05,
                                                        }}
                                                        onClick={() =>
                                                            setSelectedUserId(
                                                                selectedUserId ===
                                                                    user.id
                                                                    ? null
                                                                    : user.id
                                                            )
                                                        }
                                                        className={`
                                                            group cursor-pointer
                                                            transition-all
                                                            duration-200
                                                            ${
                                                                selectedUserId ===
                                                                user.id
                                                                    ? "bg-blue-50/80 shadow-[inset_4px_0_0_#0066FF]"
                                                                    : "hover:bg-[#F8FBFF]"
                                                            }
                                                        `}
                                                    >
                                                        {/* NUMBER */}

                                                        <td
                                                            className={`px-6 py-4 font-mono text-xs ${
                                                                selectedUserId ===
                                                                user.id
                                                                    ? "font-bold text-[#0066FF]"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </td>

                                                        {/* USER */}

                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {/* AVATAR */}

                                                                <motion.div
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                    }}
                                                                    className={`
                                                                        flex
                                                                        h-10
                                                                        w-10
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        border
                                                                        font-bold
                                                                        shadow-sm
                                                                        transition-all
                                                                        duration-300
                                                                        ${
                                                                            user.role.toLowerCase() ===
                                                                            "admin"
                                                                                ? "border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 text-[#0066FF]"
                                                                                : "border-yellow-100 bg-gradient-to-br from-yellow-50 to-yellow-100 text-[#B58900]"
                                                                        }
                                                                        ${
                                                                            selectedUserId ===
                                                                            user.id
                                                                                ? "shadow-[0_0_0_4px_rgba(0,102,255,0.08)]"
                                                                                : ""
                                                                        }
                                                                    `}
                                                                >
                                                                    {(
                                                                        user.nama_lengkap ||
                                                                        user.username ||
                                                                        "U"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </motion.div>

                                                                <div className="flex min-w-0 flex-col">
                                                                    <span className="flex items-center gap-2 font-bold text-[#082B5F]">
                                                                        {
                                                                            user.nama_lengkap
                                                                        }

                                                                        {isSelf && (
                                                                            <span className="rounded-md border border-yellow-100 bg-yellow-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#B58900]">
                                                                                Anda
                                                                            </span>
                                                                        )}
                                                                    </span>

                                                                    <span className="text-xs font-medium text-slate-400">
                                                                        @
                                                                        {
                                                                            user.username
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* ROLE */}

                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${roleStyle.wrapper}`}
                                                            >
                                                                {user.role.toLowerCase() ===
                                                                    "admin" && (
                                                                    <Shield
                                                                        className={`mr-1.5 h-3 w-3 ${roleStyle.icon}`}
                                                                    />
                                                                )}

                                                                {user.role}
                                                            </span>
                                                        </td>

                                                        {/* DATE */}

                                                        <td className="px-6 py-4 text-slate-500">
                                                            {new Date(
                                                                user.created_at
                                                            ).toLocaleString(
                                                                "id-ID",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </td>

                                                        {/* ACTION */}

                                                        <td className="px-6 py-4 text-right">
                                                            <motion.button
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.9,
                                                                }}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();

                                                                    confirmDelete(
                                                                        user
                                                                    );
                                                                }}
                                                                disabled={
                                                                    isSelf
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    justify-center
                                                                    rounded-lg
                                                                    border
                                                                    border-transparent
                                                                    p-2
                                                                    text-slate-400
                                                                    transition-all
                                                                    duration-200
                                                                    hover:border-red-100
                                                                    hover:bg-red-50
                                                                    hover:text-red-500
                                                                    disabled:cursor-not-allowed
                                                                    disabled:opacity-30
                                                                "
                                                                title={
                                                                    isSelf
                                                                        ? "Tidak dapat menghapus akun sendiri"
                                                                        : "Hapus User"
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </motion.button>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* ========================================================
                MODAL TAMBAH USER
            ======================================================== */}

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        {/* BACKDROP */}

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            className="absolute inset-0 bg-[#082B5F]/60 backdrop-blur-sm"
                            onClick={closeForm}
                        />

                        {/* MODAL */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.92,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl"
                        >
                            {/* TOP GRADIENT */}

                            <div className="h-1.5 w-full bg-gradient-to-r from-[#00BFFF] via-[#0066FF] to-[#FFD600]" />

                            {/* HEADER */}

                            <div className="flex items-center justify-between border-b border-blue-100 bg-[#F8FBFF] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF]">
                                        <Plus className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold text-[#082B5F]">
                                            Tambah User Baru
                                        </h3>

                                        <p className="text-xs font-medium text-slate-500">
                                            Buat akun untuk memberi
                                            akses sistem.
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{
                                        scale: 1.08,
                                        rotate: 90,
                                    }}
                                    whileTap={{
                                        scale: 0.9,
                                    }}
                                    onClick={closeForm}
                                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#0066FF]"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={handleAddUser}
                                className="space-y-4 px-6 py-5"
                            >
                                {/* NAMA */}

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                        Nama Lengkap
                                    </label>

                                    <input
                                        type="text"
                                        value={nama}
                                        onChange={(e) =>
                                            setNama(e.target.value)
                                        }
                                        placeholder="Contoh: John Doe"
                                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                {/* USERNAME */}

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        placeholder="contoh: johndoe"
                                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                {/* PASSWORD */}

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Minimal 8 karakter"
                                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                {/* ROLE */}

                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-[#082B5F]">
                                        Role
                                    </label>

                                    <select
                                        value={role}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#0066FF] focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="operator">
                                            Operator (Akses Terbatas)
                                        </option>

                                        <option value="admin">
                                            Administrator (Akses
                                            Penuh)
                                        </option>
                                    </select>
                                </div>

                                {/* BUTTON */}

                                <div className="mt-6 flex items-center justify-end gap-3 border-t border-blue-50 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        disabled={saving}
                                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                                    >
                                        Batal
                                    </button>

                                    <motion.button
                                        whileHover={{
                                            y: -2,
                                        }}
                                        whileTap={{
                                            scale: 0.97,
                                        }}
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#00AEEF] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}

                                        {saving
                                            ? "Menyimpan..."
                                            : "Simpan User"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========================================================
                DELETE MODAL
            ======================================================== */}

            <AnimatePresence>
                {userToDelete && (
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        {/* BACKDROP */}

                        <div
                            className="absolute inset-0 bg-[#082B5F]/60 backdrop-blur-sm"
                            onClick={() =>
                                !deleting &&
                                setUserToDelete(null)
                            }
                        />

                        {/* MODAL */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl"
                        >
                            {/* TOP */}

                            <div className="h-1.5 w-full bg-gradient-to-r from-[#FFD600] to-red-500" />

                            <div className="p-6 text-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100"
                                >
                                    <AlertCircle className="h-7 w-7 text-red-500" />
                                </motion.div>

                                <h3 className="mb-2 text-lg font-extrabold text-[#082B5F]">
                                    Hapus Pengguna?
                                </h3>

                                <p className="text-sm leading-6 text-slate-500">
                                    Apakah Anda yakin ingin
                                    menghapus{" "}
                                    <strong className="font-bold text-[#082B5F]">
                                        {
                                            userToDelete.nama_lengkap
                                        }
                                    </strong>{" "}
                                    (@
                                    {
                                        userToDelete.username
                                    }
                                    )? Tindakan ini tidak dapat
                                    dibatalkan.
                                </p>
                            </div>

                            {/* BUTTON */}

                            <div className="flex border-t border-blue-50 bg-[#F8FBFF]">
                                <button
                                    onClick={() =>
                                        setUserToDelete(null)
                                    }
                                    disabled={deleting}
                                    className="flex-1 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-white hover:text-slate-700 disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <div className="w-px bg-blue-50" />

                                <motion.button
                                    whileHover={{
                                        backgroundColor:
                                            "rgb(254 242 242)",
                                    }}
                                    onClick={executeDelete}
                                    disabled={deleting}
                                    className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 transition-colors disabled:opacity-50"
                                >
                                    {deleting && (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                    )}

                                    {deleting
                                        ? "Menghapus..."
                                        : "Hapus Akun"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}