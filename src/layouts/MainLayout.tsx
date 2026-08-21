import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR UTAMA */}
            <Sidebar />

            {/* AREA KANAN */}
            <div className="flex min-w-0 flex-1 flex-col">

                {/* NAVBAR */}
                <Navbar />

                {/* CONTENT */}
                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;