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
import Device from "./pages/Device";
import Ols from "./pages/Ols";
import UfrStepRelay from "./pages/ufr/UfrStepRelay";
import UfrBeban from "./pages/ufr/UfrBeban";

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

                        {/* DEVICE */}

                        <Route
                            path="/device"
                            element={<Device />}
                        />

                        {/* OLS */}

                        <Route
                            path="/ols"
                            element={<Ols />}
                        />

                        {/* UFR */}

                        <Route
                            path="/ufr/step-relay"
                            element={<UfrStepRelay />}
                        />

                        <Route
                            path="/ufr/beban"
                            element={<UfrBeban />}
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
