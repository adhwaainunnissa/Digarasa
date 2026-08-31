const { Pool } = require("pg");

require("dotenv").config();

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // Batasi jumlah koneksi dari aplikasi
    max: 10,

    // Tutup koneksi idle setelah 30 detik
    idleTimeoutMillis: 30000,

    // Gagal cepat kalau database penuh/tidak bisa diakses
    connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
    console.log("✅ PostgreSQL client terhubung");
});

pool.on("error", (err) => {
    console.error(
        "❌ PostgreSQL pool error:",
        err.message
    );
});

// Tes koneksi tanpa menahan client
pool.query("SELECT 1")
    .then(() => {
        console.log(
            "✅ Berhasil terhubung ke PostgreSQL"
        );
    })
    .catch((err) => {
        console.error(
            "❌ Gagal terhubung ke PostgreSQL"
        );
        console.error(err.message);
    });

module.exports = pool;