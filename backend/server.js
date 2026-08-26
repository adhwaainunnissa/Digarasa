const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tableRoutes = require("./routes/tableRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());
app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);



app.get("/", (req, res) => {
    res.send("Backend Digarasa berjalan 🚀");
});

// Login tidak membutuhkan token
app.use("/api/auth", authRoutes);

// Semua API database membutuhkan token
app.use(
    "/api",
    authMiddleware,
    tableRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server berjalan di http://localhost:${PORT}`
    );
});