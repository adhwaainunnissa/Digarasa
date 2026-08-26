const db = require("../config/db");
const bcrypt = require("bcrypt");

// ========================================
// GET SEMUA ADMIN
// ========================================

exports.getUsers = async () => {
    const result = await db.query(`
        SELECT
            id,
            username,
            nama_lengkap,
            role,
            created_at
        FROM "admin"
        ORDER BY id
    `);

    return result.rows;
};


// ========================================
// TAMBAH ADMIN
// ========================================

exports.createUser = async ({
    username,
    password,
    nama_lengkap,
    role,
}) => {

    // ----------------------------------------
    // Validasi dasar
    // ----------------------------------------

    if (!username || !password || !nama_lengkap || !role) {
        throw new Error(
            "Username, password, nama lengkap, dan role wajib diisi."
        );
    }

    if (password.length < 8) {
        throw new Error(
            "Password minimal 8 karakter."
        );
    }


    // ----------------------------------------
    // Cek username
    // ----------------------------------------

    const existingUser = await db.query(
        `
        SELECT id
        FROM "admin"
        WHERE username = $1
        LIMIT 1
        `,
        [username]
    );

    if (existingUser.rows.length > 0) {
        throw new Error(
            "Username sudah digunakan."
        );
    }


    // ----------------------------------------
    // Validasi role
    // ----------------------------------------

    const allowedRoles = [
        "admin",
        "operator",
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error(
            "Role tidak valid."
        );
    }


    // ----------------------------------------
    // HASH PASSWORD
    // ----------------------------------------

    const passwordHash = await bcrypt.hash(
        password,
        10
    );


    // ----------------------------------------
    // INSERT
    // ----------------------------------------

    const result = await db.query(
        `
        INSERT INTO "admin"
        (
            username,
            password,
            nama_lengkap,
            role
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            username,
            nama_lengkap,
            role,
            created_at
        `,
        [
            username,
            passwordHash,
            nama_lengkap,
            role,
        ]
    );

    return result.rows[0];
};


// ========================================
// DELETE ADMIN
// ========================================

exports.deleteUser = async (id, currentUserId) => {

    // ----------------------------------------
    // Validasi ID
    // ----------------------------------------

    if (!id) {
        throw new Error(
            "ID user tidak valid."
        );
    }


    // ----------------------------------------
    // Jangan hapus akun sendiri
    // ----------------------------------------

    if (
        currentUserId !== undefined &&
        Number(id) === Number(currentUserId)
    ) {
        throw new Error(
            "Akun yang sedang digunakan tidak dapat dihapus."
        );
    }


    // ----------------------------------------
    // Cek user
    // ----------------------------------------

    const userResult = await db.query(
        `
        SELECT
            id,
            username,
            role
        FROM "admin"
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    if (userResult.rows.length === 0) {
        throw new Error(
            "User tidak ditemukan."
        );
    }


    // ----------------------------------------
    // Optional: cegah hapus admin terakhir
    // ----------------------------------------

    if (
        userResult.rows[0].role === "admin"
    ) {

        const adminCountResult = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM "admin"
            WHERE role = 'admin'
            `
        );

        const adminCount =
            Number(
                adminCountResult.rows[0].total
            );

        if (adminCount <= 1) {
            throw new Error(
                "Admin terakhir tidak dapat dihapus."
            );
        }
    }


    // ----------------------------------------
    // DELETE
    // ----------------------------------------

    const result = await db.query(
        `
        DELETE FROM "admin"
        WHERE id = $1
        RETURNING
            id,
            username,
            nama_lengkap,
            role,
            created_at
        `,
        [id]
    );

    return result.rows[0];
};