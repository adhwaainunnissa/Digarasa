
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const tableRoutes = require("./routes/tableRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const skemaRoutes = require("./routes/skemaRoutes");
const olsRoutes = require("./routes/olsRoutes");
const ufrRoutes = require("./routes/ufrRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.6.31.161:5173",
    "http://10.6.30.133:5173",
    "http://10.6.30.133",
    "http://10.6.30.133:80"
];

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request tanpa Origin, misalnya curl atau
        // komunikasi server-ke-server.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn("Origin ditolak oleh CORS:", origin);
        return callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

// Parse request JSON
app.use(express.json());

// ========================================
// TEST DATABASE
// ========================================

db.query("SELECT current_database(), current_user")
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
    res.send("Backend Digarasa berjalan 🚀");
});

// ========================================
// AUTH
// Login tidak membutuhkan JWT
// ========================================

app.use("/api/auth", authRoutes);

// ========================================
// DASHBOARD
// ========================================

app.use("/api/dashboard", dashboardRoutes);

// ========================================
// ADMIN
// ========================================

app.use("/api/admin", adminRoutes);

// ========================================
// SKEMA
// ========================================

app.use("/api/skema", skemaRoutes);

// ========================================
// OLS
// ========================================

app.use("/api/ols", olsRoutes);

// ========================================
// UFR
// ========================================

app.use("/api/ufr", ufrRoutes);

// ========================================
// DATABASE
// ========================================

app.use("/api", authMiddleware, tableRoutes);

// ========================================
// DEVICE
// ========================================

app.use("/api/device", deviceRoutes);

// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `🚀 Backend Digarasa berjalan pada port ${PORT}`
    );
});
