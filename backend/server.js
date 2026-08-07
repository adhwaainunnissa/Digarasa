const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const tableRoutes = require("./routes/tableRoutes");
app.use("/api", tableRoutes);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend berjalan 🚀");
});

// Test koneksi database
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
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

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});