import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import Skema from "./pages/Skema";

function Grafana() {

    const bukaGrafana = () => {
        window.open(
            "http://10.6.30.133:3000/d/750a4536-c3c5-4dbb-b4c7-e0ab79210aee/kit-jtd?orgId=1&from=now-3h&to=now&timezone=browser&refresh=5s",
            "_blank"
        );
    };

   return (
    <div className="min-h-full flex items-center justify-center p-8">

        <div
            className="
                relative
                bg-white/90
                backdrop-blur-sm
                p-12
                rounded-3xl
                shadow-xl
                shadow-slate-300/40
                text-center
                w-[560px]
                border
                border-white
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-2xl
            "
        >

            <h1 className="text-4xl font-bold text-gray-800">
                Grafana
            </h1>

            <p className="mt-5 text-gray-500 text-lg leading-relaxed">
                Akses dashboard monitoring Grafana untuk melihat
                data dan visualisasi sistem.
            </p>

            <button
                onClick={bukaGrafana}
                className="
                    group
                    mt-8
                    mx-auto
                    inline-flex
                    flex-row
                    items-center
                    justify-center
                    gap-3
                    px-8
                    py-4
                    bg-gradient-to-r
                    from-orange-500
                    to-orange-600
                    hover:from-orange-600
                    hover:to-orange-500
                    text-white
                    font-semibold
                    rounded-xl
                    shadow-lg
                    shadow-orange-500/20
                    hover:shadow-xl
                    hover:shadow-orange-500/40
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    active:scale-95
                "
            >
                <img
                    src="/logo gravana.png"
                    alt="Grafana"
                    className="
                        w-9
                        h-9
                        object-contain
                        shrink-0
                        transition-transform
                        duration-500
                        group-hover:rotate-12
                        group-hover:scale-110
                    "
                />

                <span className="whitespace-nowrap">
                    Buka Grafana
                </span>
            </button>

        </div>

    </div>
);
}    

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN */}
                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* PROTECTED AREA */}
                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/database"
                            element={<Database />}
                        />

                        <Route
                            path="/skema"
                            element={<Skema />}
                        />
                        
                        <Route
                            path="/grafana"
                            element={<Grafana />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/users"
                            element={<Users />}
                        />

                    </Route>

                </Route>


                {/* DEFAULT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

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