import { useEffect, useState } from "react";
import api from "../api/axios";

interface AdminUser {
    id: number;
    username: string;
    nama_lengkap: string;
    role: string;
    created_at: string;
}

function Users() {

    const [users, setUsers] =
        useState<AdminUser[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [error, setError] =
        useState("");

    // ========================================
    // MODAL
    // ========================================

    const [showForm, setShowForm] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    // ========================================
    // FORM
    // ========================================

    const [username, setUsername] =
        useState("");

    const [nama, setNama] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [role, setRole] =
        useState("operator");


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

            const response =
                await api.get(
                    "/admin/users"
                );

            setUsers(
                response.data || []
            );

        } catch (error: any) {

            console.error(
                "Gagal mengambil user:",
                error
            );

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

    const filteredUsers =
        users.filter((user) => {

            const keyword =
                search.toLowerCase();

            return (
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
        });


    // ========================================
    // STATISTIK
    // ========================================

    const totalAdmin =
        users.filter(
            (user) =>
                user.role.toLowerCase() ===
                "admin"
        ).length;

    const totalOperator =
        users.filter(
            (user) =>
                user.role.toLowerCase() ===
                "operator"
        ).length;


    // ========================================
    // ROLE STYLE
    // ========================================

    const getRoleStyle = (
        role: string
    ) => {

        switch (
            role.toLowerCase()
        ) {

            case "admin":
                return "bg-blue-100 text-blue-700";

            case "operator":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";

        }
    };


    // ========================================
    // RESET FORM
    // ========================================

    const resetForm = () => {

        setUsername("");
        setNama("");
        setPassword("");
        setRole("operator");

    };


    // ========================================
    // OPEN FORM
    // ========================================

    const openAddForm = () => {

        resetForm();

        setShowForm(true);

    };


    // ========================================
    // CLOSE FORM
    // ========================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        resetForm();

        setShowForm(false);

    };


    // ========================================
    // ADD USER
    // ========================================

    const handleAddUser = async () => {

        if (!username.trim()) {

            alert(
                "Username wajib diisi."
            );

            return;
        }

        if (!nama.trim()) {

            alert(
                "Nama lengkap wajib diisi."
            );

            return;
        }

        if (!password) {

            alert(
                "Password wajib diisi."
            );

            return;
        }

        if (password.length < 8) {

            alert(
                "Password minimal 8 karakter."
            );

            return;
        }

        try {

            setSaving(true);

            await api.post(
                "/admin/users",
                {
                    username:
                        username.trim(),

                    nama_lengkap:
                        nama.trim(),

                    password,

                    role,
                }
            );

            alert(
                "User berhasil ditambahkan."
            );

            closeForm();

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Gagal menambahkan user:",
                error
            );

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

    const handleDeleteUser = async (
        user: AdminUser
    ) => {

        /*
         * Jangan menghapus akun yang sedang
         * digunakan untuk login.
         */

        const currentUser =
            JSON.parse(
                localStorage.getItem(
                    "user"
                ) || "null"
            );

        if (
            currentUser?.id === user.id
        ) {

            alert(
                "Akun yang sedang digunakan tidak dapat dihapus."
            );

            return;
        }


        const confirmed =
            window.confirm(
                `Yakin ingin menghapus user "${user.username}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/admin/users/${user.id}`
            );

            alert(
                "User berhasil dihapus."
            );

            await loadUsers();

        } catch (error: any) {

            console.error(
                "Gagal menghapus user:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Gagal menghapus user."
            );
        }
    };


    return (
        <div className="min-h-full bg-gray-50 p-6 md:p-8">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        User Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kelola pengguna sistem FASOP.
                    </p>

                </div>


                <button
                    onClick={
                        openAddForm
                    }
                    className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
                >
                    + Tambah User
                </button>

            </div>


            {/* ========================================
                ERROR
            ======================================== */}

            {error && (

                <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>

            )}


            {/* ========================================
                MODAL TAMBAH USER
            ======================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Tambah User
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Buat akun pengguna baru.
                                </p>

                            </div>


                            <button
                                onClick={
                                    closeForm
                                }
                                className="text-2xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>

                        </div>


                        <div className="space-y-4">

                            {/* Username */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={
                                        username
                                    }
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    placeholder="contoh: operator1"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Nama */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Nama Lengkap
                                </label>

                                <input
                                    type="text"
                                    value={
                                        nama
                                    }
                                    onChange={(e) =>
                                        setNama(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={
                                        password
                                    }
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Minimal 8 karakter"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Role */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Role
                                </label>

                                <select
                                    value={
                                        role
                                    }
                                    onChange={(e) =>
                                        setRole(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="operator">
                                        Operator
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={
                                    closeForm
                                }
                                disabled={
                                    saving
                                }
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Batal
                            </button>


                            <button
                                onClick={
                                    handleAddUser
                                }
                                disabled={
                                    saving
                                }
                                className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                            >
                                {saving
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ========================================
                STATISTIK
            ======================================== */}

            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total User
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        {
                            users.length
                        }
                    </h2>

                </div>


                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Administrator
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {
                            totalAdmin
                        }
                    </h2>

                </div>


                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Operator
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        {
                            totalOperator
                        }
                    </h2>

                </div>

            </div>


            {/* ========================================
                TABLE
            ======================================== */}

            <div className="rounded-xl bg-white shadow-sm">

                <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-gray-800">
                            Daftar Pengguna
                        </h2>

                        <p className="text-sm text-gray-500">
                            Daftar pengguna yang terdaftar pada sistem.
                        </p>

                    </div>


                    <div className="relative">

                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={
                                search
                            }
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-72"
                        />

                        <span className="absolute left-3 top-2.5 text-gray-400">
                            🔍
                        </span>

                    </div>

                </div>


                {loading ? (

                    <div className="p-12 text-center">

                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                        <p className="text-sm text-gray-500">
                            Memuat data user...
                        </p>

                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="mb-3 text-5xl">
                            👤
                        </div>

                        <h3 className="font-semibold text-gray-700">
                            Tidak ada user
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            {search
                                ? "User yang kamu cari tidak ditemukan."
                                : "Belum ada user yang terdaftar."}
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse">

                            <thead>

                                <tr className="bg-gray-50 text-sm text-gray-600">

                                    <th className="border-b px-6 py-4 text-left font-semibold">
                                        #
                                    </th>

                                    <th className="border-b px-6 py-4 text-left font-semibold">
                                        User
                                    </th>

                                    <th className="border-b px-6 py-4 text-left font-semibold">
                                        Nama Lengkap
                                    </th>

                                    <th className="border-b px-6 py-4 text-left font-semibold">
                                        Role
                                    </th>

                                    <th className="border-b px-6 py-4 text-left font-semibold">
                                        Dibuat
                                    </th>

                                    <th className="border-b px-6 py-4 text-center font-semibold">
                                        Aksi
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                user.id
                                            }
                                            className="transition hover:bg-gray-50"
                                        >

                                            <td className="border-b px-6 py-4 text-sm text-gray-500">
                                                {
                                                    index +
                                                    1
                                                }
                                            </td>


                                            <td className="border-b px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                                                        {(
                                                            user.nama_lengkap ||
                                                            user.username ||
                                                            "U"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-gray-800">
                                                            {
                                                                user.username
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            ID #
                                                            {
                                                                user.id
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            <td className="border-b px-6 py-4 text-sm text-gray-700">
                                                {
                                                    user.nama_lengkap
                                                }
                                            </td>


                                            <td className="border-b px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    {
                                                        user.role
                                                    }
                                                </span>

                                            </td>


                                            <td className="border-b px-6 py-4 text-sm text-gray-500">

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


                                            <td className="border-b px-6 py-4">

                                                <div className="flex justify-center">

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Users;