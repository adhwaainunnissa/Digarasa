import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";

import ProtectedRoute from "./pages/ProtectedRoute";

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
                    PROTECTED ROUTES
                ========================== */}

                <Route
                    element={<ProtectedRoute />}
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/database"
                        element={<Database />}
                    />

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;