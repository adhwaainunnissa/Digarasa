const db = require("../config/db");

// ========================================
// GET SEMUA TABEL
// ========================================

exports.getTables = async () => {
    const result = await db.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    `);

    return result.rows;
};


// ========================================
// GET SCHEMA TABEL
// ========================================

exports.getSchema = async (table) => {
    const result = await db.query(
        `
        SELECT
            column_name,
            data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position
        `,
        [table]
    );

    if (result.rows.length === 0) {
        throw new Error(`Tabel "${table}" tidak ditemukan`);
    }

    return result.rows;
};


// ========================================
// GET DATA + PAGINATION + SEARCH
// ========================================

exports.getData = async (
    table,
    page = 1,
    limit = 20,
    search = ""
) => {

    // ------------------------------------
    // Validasi page
    // ------------------------------------

    page = parseInt(page, 10);

    if (isNaN(page) || page < 1) {
        page = 1;
    }


    // ------------------------------------
    // Validasi limit
    // ------------------------------------

    limit = parseInt(limit, 10);

    if (isNaN(limit) || limit < 1) {
        limit = 20;
    }

    // Maksimal 100 data per request
    if (limit > 100) {
        limit = 100;
    }


    // ------------------------------------
    // Pastikan tabel memang ada
    // ------------------------------------

    const tableResult = await db.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
        `,
        [table]
    );

    if (tableResult.rows.length === 0) {
        throw new Error(`Tabel "${table}" tidak ditemukan`);
    }


    // ------------------------------------
    // Ambil nama kolom
    // ------------------------------------

    const columnResult = await db.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position
        `,
        [table]
    );

    const columns = columnResult.rows.map(
        (row) => row.column_name
    );


    if (columns.length === 0) {
        throw new Error(
            `Tabel "${table}" tidak memiliki kolom`
        );
    }


    // ------------------------------------
    // Escape identifier PostgreSQL
    // ------------------------------------

    const quoteIdentifier = (identifier) => {
        return `"${identifier.replace(/"/g, '""')}"`;
    };


    const quotedTable = quoteIdentifier(table);


    // ------------------------------------
    // SEARCH
    // ------------------------------------

    const values = [];
    let whereClause = "";

    if (search.trim() !== "") {

        const searchConditions = columns.map(
            (column, index) => {

                values.push(`%${search}%`);

                return `
                    CAST(
                        ${quoteIdentifier(column)}
                        AS TEXT
                    ) ILIKE $${index + 1}
                `;
            }
        );

        whereClause = `
            WHERE ${searchConditions.join(" OR ")}
        `;
    }


    // ------------------------------------
    // COUNT TOTAL DATA
    // ------------------------------------

    const countQuery = `
        SELECT COUNT(*) AS total
        FROM ${quotedTable}
        ${whereClause}
    `;

    const countResult = await db.query(
        countQuery,
        values
    );

    const total = parseInt(
        countResult.rows[0].total,
        10
    );


    // ------------------------------------
    // PAGINATION
    // ------------------------------------

    const offset = (page - 1) * limit;


    // ------------------------------------
    // GET DATA
    // ------------------------------------

    const dataQuery = `
        SELECT *
        FROM ${quotedTable}
        ${whereClause}
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

    const dataValues = [
        ...values,
        limit,
        offset,
    ];

    const dataResult = await db.query(
        dataQuery,
        dataValues
    );


    // ------------------------------------
    // TOTAL PAGES
    // ------------------------------------

    const totalPages =
        Math.ceil(total / limit);


    // ------------------------------------
    // RETURN
    // ------------------------------------

    return {
        data: dataResult.rows,

        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};