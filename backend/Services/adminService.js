const db = require("../config/db");

// ========================================
// GET SEMUA ADMIN / USER
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