const { Pool } = require("pg");
require("dotenv").config();

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect()
    .then(() => {
        console.log("✅ Berhasil terhubung ke PostgreSQL");
    })
    .catch((err) => {
        console.error("❌ Gagal terhubung ke PostgreSQL");
        console.error(err);
    });

module.exports = pool;