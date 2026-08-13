import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">

            {/* ========================================
                TITLE
            ======================================== */}

            <div>

                <h1 className="text-xl font-bold text-gray-800">
                    PLN UP2B Ungaran
                </h1>

                <p className="text-xs text-gray-500">
                    FASOP Monitoring System
                </p>

            </div>


            {/* ========================================
                USER
            ======================================== */}

            <div className="flex items-center gap-3">

                <FaUserCircle
                    className="text-2xl text-gray-500"
                />

                <div>

                    <p className="text-sm font-semibold text-gray-800">
                        {user?.nama_lengkap ||
                            user?.username ||
                            "User"}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                        {user?.role || "user"}
                    </p>

                </div>

            </div>

        </header>
    );
}