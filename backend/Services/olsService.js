const db = require("../config/db");

// ========================================
// HELPERS
// ========================================
const normalizePagination = (page, limit) => {
    let safePage = parseInt(page, 10);
    let safeLimit = parseInt(limit, 10);

    if (Number.isNaN(safePage) || safePage < 1) safePage = 1;
    if (Number.isNaN(safeLimit) || safeLimit < 1) safeLimit = 100; // max limit for history
    if (safeLimit > 1000) safeLimit = 1000;

    return { page: safePage, limit: safeLimit };
};

// ========================================
// OLS STATUS (Real-time monitoring)
// ========================================
exports.getOlsStatus = async () => {
    // Join static config with list of tags, then with real-time status
    const result = await db.query(`
        SELECT
            o.id_sw,
            o.skema,
            o.gi,
            o.target,
            o.tahap,
            l.datapoint as tag_name,
            r.value,
            r.quality,
            r.time,
            r.device_name
        FROM "OLS_STATIK" o
        LEFT JOIN "LIST_SW_OLS" l ON o.id_sw = l.id_sw
        LEFT JOIN "RT_Sw_OLS" r ON l.datapoint = r.tag_name
        ORDER BY o.skema, o.tahap, o.gi
    `);
    
    return result.rows;
};

// ========================================
// OLS CONFIG (Static configuration)
// ========================================
exports.getOlsConfig = async () => {
    const result = await db.query(`
        SELECT
            o.id_sw,
            o.skema,
            o.gi,
            o.target,
            o.tahap,
            l.datapoint as tag_name
        FROM "OLS_STATIK" o
        LEFT JOIN "LIST_SW_OLS" l ON o.id_sw = l.id_sw
        ORDER BY o.skema, o.tahap, o.gi
    `);
    
    return result.rows;
};
    // ========================================
// UPDATE OLS
// ========================================
exports.updateOls = async (id, data) => {
    const { skema, gi, target, tahap } = data;

    const result = await db.query(
        `
        UPDATE "OLS_STATIK"
        SET
            skema = $1,
            gi = $2,
            target = $3,
            tahap = $4
        WHERE id_sw = $5
        RETURNING *
        `,
        [skema, gi, target, tahap, id]
    );

    if (result.rows.length === 0) {
        throw new Error("Data OLS tidak ditemukan");
    }

    return result.rows[0];
};


// ========================================
// DELETE OLS
// ========================================
exports.deleteOls = async (id) => {
    const result = await db.query(
        `
        DELETE FROM "OLS_STATIK"
        WHERE id_sw = $1
        RETURNING *
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Data OLS tidak ditemukan");
    }

    return result.rows[0];
};

// ========================================
// OLS HISTORY (Paginated with filters)
// ========================================
exports.getOlsHistory = async ({
    page = 1,
    limit = 100,
    search = "",
    startDate = "",
    endDate = ""
}) => {
    const normalized = normalizePagination(page, limit);
    const offset = (normalized.page - 1) * normalized.limit;
    const normalizedSearch = search.trim();
    const keyword = `%${normalizedSearch}%`;

    // Dynamic WHERE clause
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (normalizedSearch) {
        conditions.push(`tag_name ILIKE $${paramIndex}`);
        params.push(keyword);
        paramIndex++;
    }

    if (startDate) {
        conditions.push(`time >= $${paramIndex}::timestamp`);
        params.push(startDate);
        paramIndex++;
    }

    if (endDate) {
        conditions.push(`time <= $${paramIndex}::timestamp`);
        params.push(endDate);
        paramIndex++;
    }

    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    const countResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM "His_Sw_OLS"
        ${whereClause}
        `,
        params
    );

    const total = Number(countResult.rows[0].total);

    // Add pagination params
    params.push(normalized.limit);
    const limitParamIndex = paramIndex++;
    params.push(offset);
    const offsetParamIndex = paramIndex;

    const result = await db.query(
        `
        SELECT
            tag_name,
            value,
            quality,
            time,
            device_name
        FROM "His_Sw_OLS"
        ${whereClause}
        ORDER BY time DESC
        LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
        `,
        params
    );

    return {
        data: result.rows,
        pagination: {
            page: normalized.page,
            limit: normalized.limit,
            total,
            totalPages: Math.ceil(total / normalized.limit)
        }
    };
};
