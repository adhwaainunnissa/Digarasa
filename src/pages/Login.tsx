import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import AuthForm from "../components/AuthForm";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleLogin = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        username,
                        password,
                    }
                );


            const {
                token,
                user,
            } = response.data;


            // ========================================
            // SIMPAN TOKEN
            // ========================================

            localStorage.setItem(
                "token",
                token
            );


            // ========================================
            // SIMPAN DATA USER
            // ========================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // ========================================
            // REDIRECT
            // ========================================

            navigate("/dashboard");

        } catch (error: any) {

            console.error(
                "Login gagal:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Username atau password salah."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-gray-100">

            <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">

                {/* ====================================
                    BAGIAN KIRI
                ==================================== */}

                <div className="flex items-center justify-center bg-white">

                    <AuthForm
                        username={username}
                        password={password}
                        setUsername={setUsername}
                        setPassword={setPassword}
                        onSubmit={handleLogin}
                        loading={loading}
                        error={error}
                    />

                </div>


                {/* ====================================
                    BAGIAN KANAN
                ==================================== */}

                <div className="hidden items-center justify-center bg-blue-700 md:flex">

                    <div className="px-10 text-center text-white">

                        <h1 className="text-4xl font-bold">
                            FASOP Monitoring System
                        </h1>

                        <p className="mt-4 text-lg text-blue-100">
                            Sistem monitoring dan
                            pengelolaan data secara
                            terintegrasi.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;