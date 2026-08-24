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
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form tambah user
  const [showForm, setShowForm] = useState(false);
  const [nama, setNama] = useState("");

  // =========================
  // AMBIL DATA USER
  // =========================
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil user:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH USER
  // =========================
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // STATISTIK
  // =========================
  const totalAdmin = users.filter(
    (user) => user.role.toLowerCase() === "admin"
  ).length;

  const totalOperator = users.filter(
    (user) => user.role.toLowerCase() === "operator"
  ).length;

  // =========================
  // STYLE ROLE
  // =========================
  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-700";

      case "operator":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // TAMBAH USER
  // =========================
  const handleAddUser = () => {
    if (!nama.trim()) {
      alert("Nama belum diisi!");
      return;
    }

    const newUser: AdminUser = {
      id: Date.now(),
      username: nama.toLowerCase().replace(/\s+/g, "."),
      nama_lengkap: nama,
      role: "operator",
      created_at: new Date().toISOString(),
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    setNama("");
    setShowForm(false);
  };

  // =========================
  // HAPUS USER
  // =========================
  const handleDeleteUser = (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus user ini?"
    );

    if (!confirmDelete) {
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* =========================
          HEADER
      ========================= */}
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
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          + Tambah User
        </button>

      </div>

      {/* =========================
          MODAL TAMBAH USER
      ========================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tambah User
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Masukkan nama pengguna baru.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setNama("");
                }}
                className="text-2xl text-gray-400 transition hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* Input Nama */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Tombol */}
            <div className="mt-6 flex gap-3">

              <button
                onClick={() => {
                  setShowForm(false);
                  setNama("");
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                onClick={handleAddUser}
                className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Simpan
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          STATISTIK
      ========================= */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Total User */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total User
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {users.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
              👥
            </div>

          </div>

        </div>

        {/* Administrator */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Administrator
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {totalAdmin}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
              🛡️
            </div>

          </div>

        </div>

        {/* Operator */}
        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Operator
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {totalOperator}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl">
              🖥️
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          USER TABLE
      ========================= */}
      <div className="rounded-xl bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Daftar Pengguna
            </h2>

            <p className="text-sm text-gray-500">
              Daftar pengguna yang terdaftar pada sistem.
            </p>
          </div>

          {/* Search */}
          <div className="relative">

            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-72"
            />

            <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>

          </div>

        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (

          <div className="p-12 text-center">

            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="text-sm text-gray-500">
              Memuat data user...
            </p>

          </div>

        ) : filteredUsers.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */
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

          /* =========================
             TABLE
          ========================= */
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

                {filteredUsers.map((user, index) => (

                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Nomor */}
                    <td className="border-b px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="border-b px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                          {user.nama_lengkap
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {user.username}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID #{user.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Nama */}
                    <td className="border-b px-6 py-4 text-sm text-gray-700">
                      {user.nama_lengkap}
                    </td>

                    {/* Role */}
                    <td className="border-b px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>

                    </td>

                    {/* Tanggal */}
                    <td className="border-b px-6 py-4 text-sm text-gray-500">

                      {new Date(user.created_at).toLocaleString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}

                    </td>

                    {/* Aksi */}
                    <td className="border-b px-6 py-4">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            alert(
                              `User: ${user.nama_lengkap}`
                            )
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                        >
                          👁️
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteUser(user.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Users;