const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET belum diset di .env");
}

exports.login = async (username, password) => {

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
        throw new Error(
            "Username atau password salah"
        );
    }

    const user = result.rows[0];

    const passwordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordValid) {
        throw new Error(
            "Username atau password salah"
        );
    }

    const userData = {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
    };

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
exports.changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const result = await db.query(
        `
        SELECT
            id,
            password
        FROM "admin"
        WHERE id = $1
        `,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error(
            "User tidak ditemukan"
        );
    }

    const user = result.rows[0];

    const valid =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!valid) {
        throw new Error(
            "Password lama salah"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

    await db.query(
        `
        UPDATE "admin"
        SET password = $1
        WHERE id = $2
        `,
        [
            hashedPassword,
            userId,
        ]
    );
};