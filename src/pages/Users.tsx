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

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/admin/users"
            );

            setUsers(response.data);

        } catch (error) {
            console.error(
                "Gagal mengambil user:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    User Management
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Kelola akun administrator sistem.
                </p>
            </div>

            <div className="rounded-xl bg-white shadow-sm">

                {loading ? (

                    <div className="p-8 text-center">
                        Memuat data user...
                    </div>

                ) : users.length === 0 ? (

                    <div className="p-8 text-center text-gray-500">
                        Belum ada user.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse">

                            <thead>
                                <tr className="bg-gray-50">

                                    <th className="border-b p-3 text-left">
                                        Username
                                    </th>

                                    <th className="border-b p-3 text-left">
                                        Nama Lengkap
                                    </th>

                                    <th className="border-b p-3 text-left">
                                        Role
                                    </th>

                                    <th className="border-b p-3 text-left">
                                        Dibuat
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {users.map(
                                    (user) => (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >

                                            <td className="border-b p-3">
                                                {
                                                    user.username
                                                }
                                            </td>

                                            <td className="border-b p-3">
                                                {
                                                    user.nama_lengkap
                                                }
                                            </td>

                                            <td className="border-b p-3">
                                                {
                                                    user.role
                                                }
                                            </td>

                                            <td className="border-b p-3">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleString(
                                                    "id-ID"
                                                )}
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