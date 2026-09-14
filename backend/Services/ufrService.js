const db = require("../config/db");

// ========================================
// HELPERS
// ========================================
const normalizePagination = (page, limit) => {
    let safePage = parseInt(page, 10);
    let safeLimit = parseInt(limit, 10);

    if (Number.isNaN(safePage) || safePage < 1) safePage = 1;
    if (Number.isNaN(safeLimit) || safeLimit < 1) safeLimit = 100;
    if (safeLimit > 1000) safeLimit = 1000;

    return { page: safePage, limit: safeLimit };
};

// ========================================
// UFR STEP RELAY
// ========================================
exports.getUfrStepRelay = async ({
    step = 1,
    page = 1,
    limit = 100,
    search = ""
}) => {
    const validSteps = [1, 4, 5, 6, 7];
    const safeStep = parseInt(step, 10);
    
    if (!validSteps.includes(safeStep)) {
        throw new Error("Invalid UFR step. Must be 1, 4, 5, 6, or 7.");
    }

    const tableName = `UFR_${safeStep}`;
    const normalized = normalizePagination(page, limit);
    const offset = (normalized.page - 1) * normalized.limit;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    let whereClause = "";

    if (search && search.trim() !== "") {
        const keyword = `%${search.trim()}%`;
        
        // Handle column name differences for searching
        if (safeStep === 1) {
            conditions.push(`(tag_name ILIKE $${paramIndex} OR gi_name ILIKE $${paramIndex} OR trf ILIKE $${paramIndex})`);
        } else {
            conditions.push(`(tag_name ILIKE $${paramIndex} OR "GI" ILIKE $${paramIndex} OR "Target" ILIKE $${paramIndex})`);
        }
        
        params.push(keyword);
        paramIndex++;
        whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    // Get count
    const countResult = await db.query(
        `SELECT COUNT(*) AS total FROM "${tableName}" ${whereClause}`,
        params
    );
    const total = Number(countResult.rows[0].total);

    // Add pagination to params
    params.push(normalized.limit);
    const limitParamIndex = paramIndex++;
    params.push(offset);
    const offsetParamIndex = paramIndex;

    // Normalizing columns based on the step table schema
    let selectCols = "";
    if (safeStep === 1) {
        selectCols = `
            tag_name,
            gi_name,
            trf AS target,
            value,
            quality,
            time,
            value_cb,
            time_cb
        `;
    } else {
        selectCols = `
            tag_name,
            "GI" AS gi_name,
            "Target" AS target,
            "Value" AS value,
            "Quality" AS quality,
            "Waktu" AS time,
            NULL AS value_cb,
            NULL AS time_cb
        `;
    }

    const result = await db.query(
        `
        SELECT ${selectCols}
        FROM "${tableName}"
        ${whereClause}
        ORDER BY tag_name ASC
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

// ========================================
// UFR BEBAN
// ========================================
exports.getUfrBeban = async ({
    beban = 1,
    page = 1,
    limit = 100,
    search = ""
}) => {
    const validBeban = [1, 2, 3];
    const safeBeban = parseInt(beban, 10);
    
    if (!validBeban.includes(safeBeban)) {
        throw new Error("Invalid UFR beban. Must be 1, 2, or 3.");
    }

    const tableName = `UP2D_UFR${safeBeban}`;
    const normalized = normalizePagination(page, limit);
    const offset = (normalized.page - 1) * normalized.limit;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    let whereClause = "";

    if (search && search.trim() !== "") {
        const keyword = `%${search.trim()}%`;
        conditions.push(`(tag_name ILIKE $${paramIndex} OR trf ILIKE $${paramIndex})`);
        params.push(keyword);
        paramIndex++;
        whereClause = `WHERE ${conditions.join(" AND ")}`;
    }

    // Get count
    const countResult = await db.query(
        `SELECT COUNT(*) AS total FROM "${tableName}" ${whereClause}`,
        params
    );
    const total = Number(countResult.rows[0].total);

    // Add pagination to params
    params.push(normalized.limit);
    const limitParamIndex = paramIndex++;
    params.push(offset);
    const offsetParamIndex = paramIndex;

    const result = await db.query(
        `
        SELECT
            tag_name,
            trf AS target,
            value,
            quality,
            time
        FROM "${tableName}"
        ${whereClause}
        ORDER BY time DESC, tag_name ASC
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
