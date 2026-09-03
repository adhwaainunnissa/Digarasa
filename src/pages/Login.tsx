import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

import api from "../api/axios";
import AuthForm from "../components/AuthForm";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [showTransition, setShowTransition] = useState(false);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                username,
                password,
            });

            const { token, user } = response.data;

            // ========================================
            // SIMPAN TOKEN
            // ========================================
            localStorage.setItem("token", token);

            // ========================================
            // SIMPAN DATA USER
            // ========================================
            localStorage.setItem("user", JSON.stringify(user));

            // ========================================
            // SUCCESS TRANSITION & REDIRECT
            // ========================================
            setLoginSuccess(true);
            
            // Allow a small delay to show the success state in the form button
            setTimeout(() => {
                setShowTransition(true);
                
                // Navigate after the transition animation
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1200);
            }, 600);

        } catch (error: any) {
            console.error("Login gagal:", error);
            setError(
                error?.response?.data?.message || "Username atau password salah."
            );
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-white font-sans text-gray-900 overflow-hidden">
            
            {/* Full-screen Success Overlay Transition */}
            <div 
                className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-900 text-white transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] motion-reduce:transition-opacity motion-reduce:duration-500 ${
                    showTransition 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0'
                }`}
            >
                <div className="relative flex flex-col items-center">
                    <div className="absolute inset-0 -m-20 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-black/20">
                        <CheckCircle2 className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Authentication Successful</h2>
                    <p className="mt-2 text-blue-200">Preparing your secure environment...</p>
                    
                    <div className="mt-10 flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div 
                                key={i} 
                                className="h-1.5 w-1.5 rounded-full bg-white" 
                                style={{ 
                                    animation: `pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                                    animationDelay: `${i * 200}ms`
                                }} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

                {/* ====================================
                    BAGIAN KIRI (Form)
                ==================================== */}
                <div className="relative flex items-center justify-center bg-white">
                    {/* Subtle background decorative element for left side */}
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden opacity-30">
                        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-blue-50 blur-[100px]" />
                        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-yellow-50 blur-[100px]" />
                    </div>
                    
                    <div className="relative z-10 w-full max-w-2xl">
                        <AuthForm
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            onSubmit={handleLogin}
                            loading={loading}
                            error={error}
                            isSuccess={loginSuccess}
                        />
                    </div>
                    
                    {/* Footer text */}
                    <div className="absolute bottom-6 left-0 w-full text-center text-xs font-medium text-gray-400">
                        &copy; {new Date().getFullYear()} PLN Persero. All rights reserved.
                    </div>
                </div>


                {/* ====================================
                    BAGIAN KANAN (Visual/Branding)
                ==================================== */}
                <div className="relative hidden items-center justify-center overflow-hidden bg-slate-900 lg:flex">
                    
                    {/* Background Gradients and Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950" />
                    
                    {/* Grid Pattern / Electrical Visual */}
                    <div 
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    />
                    
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
                    <div className="absolute bottom-0 right-0 h-[800px] w-[800px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-600/10 blur-[120px]" />
                    <div className="absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-cyan-500/10 blur-[100px]" />

                    {/* Content */}
                    <div className="relative z-10 flex max-w-lg flex-col items-start px-12 xl:px-16 animate-in fade-in slide-in-from-right-8 duration-1000">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                            </span>
                            Secure Enterprise Network
                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl xl:text-6xl">
                            Intelligence<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Beyond Data
                            </span>
                        </h1>
                        
                        <p className="mt-6 text-lg leading-relaxed text-slate-300">
                            FASOP Monitoring System delivers real-time oversight, unparalleled reliability, and secure integrated data management for critical infrastructure.
                        </p>

                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10">
                                <ShieldCheck className="h-8 w-8 text-cyan-400" />
                                <h4 className="font-semibold text-white">Bank-grade Security</h4>
                                <p className="text-sm text-slate-400">End-to-end encrypted monitoring protocols.</p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10">
                                <Zap className="h-8 w-8 text-yellow-400" />
                                <h4 className="font-semibold text-white">Real-time Telemetry</h4>
                                <p className="text-sm text-slate-400">Sub-second latency for critical operations.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;