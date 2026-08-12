const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET belum diset di .env");
}

exports.login = async (username, password) => {
    // Cari user berdasarkan username
    const result = await db.query(
        `
        SELECT
            id,
            username,
            password,
            nama_lengkap,
            role
        FROM "admin"
        WHERE username = $1
        LIMIT 1
        `,
        [username]
    );

    if (result.rows.length === 0) {
        throw new Error("Username atau password salah");
    }

    const user = result.rows[0];

    let passwordValid = false;

    // =========================================
    // SEMENTARA:
    // Database sekarang masih plaintext
    // =========================================

    if (
        typeof user.password === "string" &&
        (
            user.password.startsWith("$2a$") ||
            user.password.startsWith("$2b$") ||
            user.password.startsWith("$2y$")
        )
    ) {
        // Kalau sudah bcrypt hash
        passwordValid = await bcrypt.compare(
            password,
            user.password
        );
    } else {
        // Sementara untuk data plaintext lama
        passwordValid = password === user.password;
    }

    if (!passwordValid) {
        throw new Error("Username atau password salah");
    }

    // Jangan kirim password ke frontend
    const userData = {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
    };

    // Buat JWT
    const token = jwt.sign(
        userData,
        JWT_SECRET,
        {
            expiresIn: "8h",
        }
    );

    return {
        user: userData,
        token,
    };
};