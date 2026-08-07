const db = require("../config/db");

exports.getTables = async () => {

    const result = await db.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
        ORDER BY table_name
    `);

    return result.rows;

};
exports.getSchema = async (table) => {

    const result = await db.query(`
        SELECT
            column_name,
            data_type
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
    `,[table]);

    return result.rows;

};
exports.getData = async (table) => {

    const result = await db.query(
        `SELECT * FROM "${table}" LIMIT 100`
    );

    return result.rows;

};