
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

// Sesuaikan base path untuk production dan development
const basename = import.meta.env.PROD ? "/Digarasa" : "/";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* HALAMAN YANG MEMERLUKAN LOGIN */}
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
              path="/device"
              element={<Device />}
            />

            <Route
              path="/ols"
              element={<Ols />}
            />

            <Route
              path="/ufr/step-relay"
              element={<UfrStepRelay />}
            />

            <Route
              path="/ufr/beban"
              element={<UfrBeban />}
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

        {/* HALAMAN AWAL */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* HALAMAN TIDAK DITEMUKAN */}
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

