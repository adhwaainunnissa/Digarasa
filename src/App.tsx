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

        <div
            className="
                relative
                flex
                min-h-full
                items-center
                justify-center
                overflow-hidden
                bg-gradient-to-br
                from-blue-50
                via-gray-50
                to-yellow-50
                p-8
            "
        >

            {/* ==================================================
                BACKGROUND DECORATION
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    animate-pulse
                    rounded-full
                    bg-yellow-200
                    opacity-40
                    blur-3xl
                "
            ></div>


            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    -left-20
                    h-72
                    w-72
                    animate-pulse
                    rounded-full
                    bg-blue-200
                    opacity-40
                    blur-3xl
                "
            ></div>


            {/* ==================================================
                MAIN CARD
            ================================================== */}

            <div
                className="
                    relative
                    w-full
                    max-w-3xl
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-100
                    bg-white
                    shadow-xl
                    shadow-blue-900/10
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                "
            >

                {/* ==================================================
                    YELLOW PLN LINE
                ================================================== */}

                <div
                    className="
                        h-2
                        w-full
                        bg-[#F7E92A]
                    "
                ></div>


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="p-12 text-center">


                    {/* ==================================================
                        GRAFANA LOGO
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            mb-6
                            flex
                            h-20
                            w-20
                            animate-bounce
                            items-center
                            justify-center
                            rounded-2xl
                            bg-orange-50
                            shadow-md
                        "
                    >

                        <img
                            src="/logo gravana.png"
                            alt="Grafana"
                            className="
                                h-12
                                w-12
                                object-contain
                                transition
                                duration-300
                                hover:scale-125
                                hover:rotate-12
                            "
                        />

                    </div>


                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <h1
                        className="
                            text-4xl
                            font-bold
                            text-blue-950
                        "
                    >
                        Grafana
                    </h1>


                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-xl
                            text-lg
                            leading-relaxed
                            text-gray-500
                        "
                    >
                        Akses dashboard monitoring Grafana untuk melihat
                        data dan visualisasi sistem secara real-time.
                    </p>


                    {/* ==================================================
                        INFORMATION CARDS
                    ================================================== */}

                    <div
                        className="
                            mx-auto
                            mt-8
                            grid
                            max-w-xl
                            grid-cols-1
                            gap-4
                            sm:grid-cols-3
                        "
                    >


                        {/* ==================================================
                            MONITORING
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-blue-100
                                bg-blue-50
                                p-4
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:scale-105
                                hover:shadow-lg
                            "
                        >

                            <div className="text-2xl">
                                📈
                            </div>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-blue-900
                                "
                            >
                                Monitoring
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Dashboard
                            </p>

                        </div>


                        {/* ==================================================
                            REAL-TIME
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-yellow-200
                                bg-yellow-50
                                p-4
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:scale-105
                                hover:shadow-lg
                            "
                        >

                            <div
                                className="
                                    animate-pulse
                                    text-2xl
                                "
                            >
                                ⚡
                            </div>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-yellow-900
                                "
                            >
                                Real-time
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Data
                            </p>

                        </div>


                        {/* ==================================================
                            VISUALISASI
                        ================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                p-4
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:scale-105
                                hover:shadow-lg
                            "
                        >

                            <div className="text-2xl">
                                📊
                            </div>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    font-semibold
                                    text-gray-800
                                "
                            >
                                Visualisasi
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Sistem
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        BUTTON GRAFANA
                    ================================================== */}

                    <button
                        onClick={bukaGrafana}
                        className="
                            mt-10
                            inline-flex
                            items-center
                            justify-center
                            gap-3
                            rounded-xl
                            bg-blue-700
                            px-10
                            py-4
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-700/20
                            transition-all
                            duration-300
                            hover:-translate-y-2
                            hover:bg-blue-800
                            hover:shadow-xl
                            active:scale-95
                        "
                    >

                        <img
                            src="/logo gravana.png"
                            alt="Grafana"
                            className="
                                h-8
                                w-8
                                object-contain
                                transition
                                duration-300
                            "
                        />

                        <span>
                            Buka Grafana
                        </span>

                    </button>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <p
                        className="
                            mt-6
                            text-xs
                            text-gray-400
                        "
                    >
                        FASOP Monitoring System • PLN UP2B Ungaran
                    </p>

                </div>

            </div>

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