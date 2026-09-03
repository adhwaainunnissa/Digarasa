import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { ExternalLink, LineChart, Activity, Server, LayoutDashboard } from "lucide-react";

import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import Skema from "./pages/Skema";


// ======================================================
// GRAFANA PAGE
// ======================================================

function Grafana() {

    const bukaGrafana = () => {
        window.open(
            "http://10.6.30.133:3000/d/750a4536-c3c5-4dbb-b4c7-e0ab79210aee/kit-jtd?orgId=1&from=now-3h&to=now&timezone=browser&refresh=5s",
            "_blank"
        );
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
            {/* ========================================
                HEADER SECTION
            ======================================== */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">
                <div className="mx-auto flex max-w-6xl items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
                        <LineChart className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grafana Monitoring</h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">Akses dashboard analitik dan visualisasi real-time FASOP.</p>
                    </div>
                </div>
            </header>

            {/* ========================================
                MAIN CONTENT
            ======================================== */}
            <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
                <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* PLN Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>

                    <div className="p-10 md:p-14 flex flex-col items-center text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                            <img src="/logo gravana.png" alt="Grafana" className="h-12 w-12 object-contain opacity-90" />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Sistem Visualisasi Eksternal</h2>
                        <p className="text-slate-500 max-w-xl mb-12 leading-relaxed text-sm">
                            Modul pemantauan visual menggunakan Grafana berjalan pada environment terpisah. Anda akan diarahkan ke dashboard eksternal di tab baru untuk melihat metrik operasional secara real-time.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                            <div className="flex flex-col items-center p-6 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <Activity className="h-7 w-7 text-blue-600 mb-4" />
                                <h3 className="font-semibold text-slate-900 text-sm">Real-time Telemetri</h3>
                                <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">Monitoring status operasional dan kesehatan sistem secara langsung.</p>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <LayoutDashboard className="h-7 w-7 text-emerald-600 mb-4" />
                                <h3 className="font-semibold text-slate-900 text-sm">Analitik Lanjut</h3>
                                <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">Grafik interaktif, metrik historis, dan riwayat data perangkat.</p>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                <Server className="h-7 w-7 text-orange-600 mb-4" />
                                <h3 className="font-semibold text-slate-900 text-sm">Kinerja Jaringan</h3>
                                <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">Evaluasi beban server, latensi, dan respons perangkat keras.</p>
                            </div>
                        </div>

                        <button
                            onClick={bukaGrafana}
                            className="inline-flex items-center gap-2.5 rounded-md bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Buka Grafana Workspace
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}


// ======================================================
// APP
// ======================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ==================================================
                    LOGIN
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==================================================
                    PROTECTED AREA
                ================================================== */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>


                        {/* DASHBOARD */}

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />


                        {/* DATABASE */}

                        <Route
                            path="/database"
                            element={<Database />}
                        />


                        {/* SKEMA */}

                        <Route
                            path="/skema"
                            element={<Skema />}
                        />


                        {/* GRAFANA */}

                        <Route
                            path="/grafana"
                            element={<Grafana />}
                        />


                        {/* PROFILE */}

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />


                        {/* USERS */}

                        <Route
                            path="/users"
                            element={<Users />}
                        />

                    </Route>

                </Route>


                {/* ==================================================
                    DEFAULT
                ================================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    PAGE NOT FOUND
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;