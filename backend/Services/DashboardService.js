const db = require("../config/db");

exports.getStats = async () => {
    const tableResult = await db.query(`
        SELECT COUNT(*) AS total
        FROM information_schema.tables
        WHERE table_schema = 'public'
    `);

    const userResult = await db.query(`
        SELECT COUNT(*) AS total
        FROM "admin"
    `);

    await db.query("SELECT 1");

    return {
        totalTables: Number(
            tableResult.rows[0].total
        ),

        totalUsers: Number(
            userResult.rows[0].total
        ),

        databaseStatus: "Connected",
    };
};