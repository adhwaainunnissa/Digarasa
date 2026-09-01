const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const tableRoutes = require("./routes/tableRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const skemaRoutes = require("./routes/skemaRoutes");

const authMiddleware =
    require("./middleware/authMiddleware");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());


// ========================================
// TEST DATABASE
// ========================================

db.query(
    "SELECT current_database(), current_user"
)
    .then((result) => {

        console.log(
            "✅ PostgreSQL terhubung:",
            result.rows[0]
        );

    })
    .catch((err) => {

        console.error(
            "❌ Gagal terhubung ke PostgreSQL:",
            err.message
        );

    });


// ========================================
// ROOT
// ========================================

app.get("/", (req, res) => {
    res.send(
        "Backend Digarasa berjalan 🚀"
    );
});


// ========================================
// AUTH
// Tidak membutuhkan JWT untuk login
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// DASHBOARD
// Endpoint di dalam route sudah memakai JWT
// ========================================

app.use(
    "/api/dashboard",
    dashboardRoutes
);


// ========================================
// ADMIN
// Endpoint di dalam route memakai JWT + role
// ========================================

app.use(
    "/api/admin",
    adminRoutes
);


// ========================================
// SKEMA
// Endpoint di dalam route memakai JWT
// ========================================

app.use(
    "/api/skema",
    skemaRoutes
);


// ========================================
// DATABASE
// Semua route database membutuhkan JWT
// ========================================

app.use(
    "/api",
    authMiddleware,
    tableRoutes
);


// ========================================
// SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server berjalan di http://localhost:${PORT}`
    );

});