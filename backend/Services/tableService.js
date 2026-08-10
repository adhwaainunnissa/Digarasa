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
// GET TABLE INFO
// ========================================

exports.getTableInfo = async (table) => {

    // ------------------------------------
    // Cek apakah tabel ada
    // ------------------------------------

    const tableResult = await db.query(
        `
        SELECT
            table_name,
            table_type
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
        `,
        [table]
    );

    if (tableResult.rows.length === 0) {
        throw new Error(
            `Tabel "${table}" tidak ditemukan`
        );
    }


    // ------------------------------------
    // Ambil informasi kolom
    // ------------------------------------

    const columnResult = await db.query(
        `
        SELECT
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,

            CASE
                WHEN tc.constraint_type = 'PRIMARY KEY'
                THEN true
                ELSE false
            END AS is_primary_key

        FROM information_schema.columns c

        LEFT JOIN information_schema.key_column_usage kcu
            ON c.table_schema = kcu.table_schema
            AND c.table_name = kcu.table_name
            AND c.column_name = kcu.column_name

        LEFT JOIN information_schema.table_constraints tc
            ON kcu.constraint_name = tc.constraint_name
            AND kcu.table_schema = tc.table_schema
            AND kcu.table_name = tc.table_name

        WHERE c.table_schema = 'public'
          AND c.table_name = $1

        ORDER BY c.ordinal_position
        `,
        [table]
    );


    // ------------------------------------
    // Return
    // ------------------------------------

    return {
        table: tableResult.rows[0],
        columns: columnResult.rows,
    };
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

    if (limit > 100) {
        limit = 100;
    }


    // ------------------------------------
    // Pastikan tabel ada
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
        throw new Error(
            `Tabel "${table}" tidak ditemukan`
        );
    }


    // ------------------------------------
    // Ambil kolom
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
    // Escape identifier
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
    // COUNT TOTAL
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
    // OFFSET
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

    const totalPages = Math.ceil(
        total / limit
    );


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

exports.insertData = async (table, data) => {

    // ========================================
    // CEK TABEL
    // ========================================

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
        throw new Error(
            `Tabel "${table}" tidak ditemukan`
        );
    }


    // ========================================
    // AMBIL KOLOM TABEL
    // ========================================

    const columnResult = await db.query(
        `
        SELECT
            column_name,
            column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position
        `,
        [table]
    );


    // ========================================
    // KOLOM YANG BOLEH DIISI
    // ========================================

    const allowedColumns = columnResult.rows
        .filter((column) => {
            return !(
                column.column_default &&
                column.column_default.includes(
                    "nextval"
                )
            );
        })
        .map((column) => column.column_name);


    // ========================================
    // FILTER DATA USER
    // ========================================

    const inputColumns = Object.keys(data).filter(
        (column) =>
            allowedColumns.includes(column)
    );


    if (inputColumns.length === 0) {
        throw new Error(
            "Tidak ada data yang dapat dimasukkan"
        );
    }


    // ========================================
    // BUAT QUERY
    // ========================================

    const values = inputColumns.map(
        (column) => data[column]
    );

    const placeholders = inputColumns.map(
        (_, index) => `$${index + 1}`
    );


    const quoteIdentifier = (identifier) => {
        return `"${identifier.replace(/"/g, '""')}"`;
    };


    const quotedTable =
        quoteIdentifier(table);

    const quotedColumns =
        inputColumns
            .map(quoteIdentifier)
            .join(", ");


    const query = `
        INSERT INTO ${quotedTable}
        (${quotedColumns})
        VALUES (${placeholders.join(", ")})
        RETURNING *
    `;


    // ========================================
    // EXECUTE
    // ========================================

    const result = await db.query(
        query,
        values
    );


    return result.rows[0];
};
};