const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const tableRoutes = require("./routes/tableRoutes");
const authRoutes = require("./routes/authRoutes");

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
// BASIC ROUTES
// ========================================

app.get("/", (req, res) => {
    res.send("Backend berjalan 🚀");
});

// Test koneksi database
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT NOW()"
        );

        res.status(200).json({
            status: "success",
            waktu_server: result.rows[0].now,
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

// ========================================
// AUTH ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

// ========================================
// DATABASE/TABLE ROUTES
// ========================================

app.use(
    "/api",
    tableRoutes
);

// ========================================
// SERVER
// ========================================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server berjalan di http://localhost:${PORT}`
    );
});