const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (username, password) => {
    const result = await db.query(
        `
        SELECT
            id,
            username,
            password,
            nama_lengkap,
            role
        FROM admin
        WHERE username = $1
        LIMIT 1
        `,
        [username]
    );

    console.log("USERNAME INPUT:", username);
    console.log("JUMLAH ROW:", result.rows.length);

    if (result.rows.length === 0) {
        throw new Error("Username atau password salah");
    }

    const user = result.rows[0];

    console.log(
        "USERNAME DB:",
        user.username
    );

    console.log(
        "PASSWORD HASH PREFIX:",
        String(user.password).substring(0, 4)
    );

    console.log(
        "PASSWORD HASH LENGTH:",
        String(user.password).length
    );

    const passwordValid =
        await bcrypt.compare(
            password,
            user.password
        );

    console.log(
        "HASIL BCRYPT COMPARE:",
        passwordValid
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