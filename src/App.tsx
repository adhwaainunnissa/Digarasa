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


function Grafana() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">
                Grafana
            </h1>

            <p className="mt-2 text-gray-500">
                Halaman akses Grafana akan dibuat
                berikutnya.
            </p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================
                    LOGIN
                ========================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==========================
                    PROTECTED AREA
                ========================== */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        element={<MainLayout />}
                    >

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/database"
                            element={<Database />}
                        />

                        <Route
                            path="/grafana"
                            element={<Grafana />}
                        />

                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                    </Route>

                </Route>


                {/* ==========================
                    DEFAULT
                ========================== */}

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
            </Routes>

        </BrowserRouter>
    );
}

export default App;