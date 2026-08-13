import { useState } from "react";
import api from "../api/axios";

function Profile() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleChangePassword = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "Konfirmasi password tidak cocok"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await api.put(
                    "/auth/change-password",
                    {
                        currentPassword,
                        newPassword,
                    }
                );

            setMessage(
                response.data.message
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Gagal mengubah password"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-gray-800">
                Profile
            </h1>

            <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">

                {/* INFO USER */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-xl font-semibold">
                        Informasi Akun
                    </h2>

                    <div className="mt-6 space-y-4">

                        <div>
                            <p className="text-sm text-gray-500">
                                Username
                            </p>

                            <p className="font-semibold">
                                {user?.username || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Nama Lengkap
                            </p>

                            <p className="font-semibold">
                                {user?.nama_lengkap || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Role
                            </p>

                            <p className="font-semibold capitalize">
                                {user?.role || "-"}
                            </p>
                        </div>

                    </div>

                </div>


                {/* GANTI PASSWORD */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-xl font-semibold">
                        Ganti Password
                    </h2>

                    {message && (
                        <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={
                            handleChangePassword
                        }
                        className="mt-6 space-y-4"
                    >

                        <input
                            type="password"
                            placeholder="Password lama"
                            value={
                                currentPassword
                            }
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border p-3"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password baru"
                            value={
                                newPassword
                            }
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border p-3"
                            minLength={8}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Konfirmasi password baru"
                            value={
                                confirmPassword
                            }
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border p-3"
                            minLength={8}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                            {loading
                                ? "Menyimpan..."
                                : "Ubah Password"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Profile;