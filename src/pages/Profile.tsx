import { useState } from "react";

export default function Profile() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
            alert("Semua password harus diisi!");
            return;
        }

        if (passwordBaru !== konfirmasiPassword) {
            alert("Konfirmasi password tidak sesuai!");
            return;
        }

        alert("Password berhasil diubah!");

        setPasswordLama("");
        setPasswordBaru("");
        setKonfirmasiPassword("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-yellow-50 p-8">

            {/* ========================================
                TITLE
            ======================================== */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-blue-950">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Kelola informasi akun dan keamanan Anda
                </p>

            </div>


            {/* ========================================
                CONTENT
            ======================================== */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">


                {/* ========================================
                    INFORMASI AKUN
                ======================================== */}

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

                    {/* Aksen PLN */}
                    <div className="h-2 bg-[#F7E92A]"></div>

                    <div className="p-8">

                        {/* Header */}

                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                                👤
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Informasi Akun
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Informasi pengguna yang sedang login
                                </p>

                            </div>

                        </div>


                        {/* Username */}

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">

                            <p className="mb-1 text-sm font-medium text-gray-500">
                                Username
                            </p>

                            <p className="text-base font-semibold text-gray-900">
                                {user?.username || "-"}
                            </p>

                        </div>


                        {/* Nama Lengkap */}

                        <div className="mb-6 rounded-xl bg-gray-50 p-4">

                            <p className="mb-1 text-sm font-medium text-gray-500">
                                Nama Lengkap
                            </p>

                            <p className="text-base font-semibold text-gray-900">
                                {user?.nama_lengkap || "-"}
                            </p>

                        </div>


                        {/* Role */}

                        <div className="rounded-xl bg-gray-50 p-4">

                            <p className="mb-1 text-sm font-medium text-gray-500">
                                Role
                            </p>

                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                                {user?.role || "user"}
                            </span>

                        </div>

                    </div>

                </div>



                {/* ========================================
                    GANTI PASSWORD
                ======================================== */}

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">

                    {/* Aksen PLN */}
                    <div className="h-2 bg-[#F7E92A]"></div>

                    <div className="p-8">

                        {/* Header */}

                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                                🔐
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Ganti Password
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Perbarui password akun Anda
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-5"
                        >

                            {/* Password Lama */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Password Lama
                                </label>

                                <input
                                    type="password"
                                    value={passwordLama}
                                    onChange={(e) =>
                                        setPasswordLama(e.target.value)
                                    }
                                    placeholder="Masukkan password lama"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Password Baru */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Password Baru
                                </label>

                                <input
                                    type="password"
                                    value={passwordBaru}
                                    onChange={(e) =>
                                        setPasswordBaru(e.target.value)
                                    }
                                    placeholder="Masukkan password baru"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Konfirmasi Password */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Konfirmasi Password Baru
                                </label>

                                <input
                                    type="password"
                                    value={konfirmasiPassword}
                                    onChange={(e) =>
                                        setKonfirmasiPassword(e.target.value)
                                    }
                                    placeholder="Konfirmasi password baru"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* Button */}

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-800 active:scale-[0.98]"
                            >
                                Ubah Password
                            </button>

                        </form>

                    </div>

                </div>

            </div>


            {/* ========================================
                FOOTER INFO
            ======================================== */}

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">

                <span className="text-xl">
                    ⚡
                </span>

                <p className="text-sm text-gray-600">
                    FASOP Monitoring System — PLN UP2B Ungaran
                </p>

            </div>

        </div>
    );
}