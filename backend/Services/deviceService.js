const db = require("../config/db");

// ========================================
// GET DEVICE LIST
// ========================================

exports.getDevices = async ({
    page = 1,
    limit = 20,
    search = "",
}) => {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (Number.isNaN(page) || page < 1) {
        page = 1;
    }

    if (Number.isNaN(limit) || limit < 1) {
        limit = 20;
    }

    if (limit > 100) {
        limit = 100;
    }

    const offset = (page - 1) * limit;

    const searchValue = search.trim();
    const keyword = `%${searchValue}%`;

    // ========================================
    // TOTAL DATA
    // ========================================

    const countResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM "DEVICE_PROSIS"
        WHERE
            $1 = ''
            OR CAST(no AS TEXT) ILIKE $2
            OR COALESCE(tag_name, '') ILIKE $2
            OR COALESCE(gi, '') ILIKE $2
            OR COALESCE(jenis, '') ILIKE $2
            OR COALESCE(keterangan, '') ILIKE $2
            OR COALESCE(merek, '') ILIKE $2
            OR COALESCE(tipe, '') ILIKE $2
        `,
        [
            searchValue,
            keyword,
        ]
    );

    const total =
        Number(countResult.rows[0].total);

    // ========================================
    // DATA DEVICE
    // ========================================

    const result = await db.query(
        `
        SELECT
            no,
            tag_name,
            gi,
            jenis,
            keterangan,
            merek,
            tipe
        FROM "DEVICE_PROSIS"
        WHERE
            $1 = ''
            OR CAST(no AS TEXT) ILIKE $2
            OR COALESCE(tag_name, '') ILIKE $2
            OR COALESCE(gi, '') ILIKE $2
            OR COALESCE(jenis, '') ILIKE $2
            OR COALESCE(keterangan, '') ILIKE $2
            OR COALESCE(merek, '') ILIKE $2
            OR COALESCE(tipe, '') ILIKE $2
        ORDER BY no
        LIMIT $3
        OFFSET $4
        `,
        [
            searchValue,
            keyword,
            limit,
            offset,
        ]
    );

    return {
        data: result.rows,

        pagination: {
            page,
            limit,
            total,
            totalPages:
                Math.ceil(total / limit),
        },
    };
};


// ========================================
// GET DEVICE BY NO
// ========================================

exports.getDeviceByNo = async (no) => {

    const result = await db.query(
        `
        SELECT
            no,
            tag_name,
            gi,
            jenis,
            keterangan,
            merek,
            tipe
        FROM "DEVICE_PROSIS"
        WHERE no = $1
        `,
        [no]
    );

    if (result.rows.length === 0) {
        throw new Error(
            `Device dengan nomor ${no} tidak ditemukan.`
        );
    }

    return result.rows[0];
};


// ========================================
// GET DEVICE USAGE
// ========================================
//
// DEVICE_PROSIS.no
//      ↓
// SKEMA_MT.no
//      ↓
// SKEMA_MT.id_skema
//      ↓
// SKEMA.id_skema
//
// DEVICE_PROSIS.no
//      ↓
// SKEMA_RELE.no
//      ↓
// SKEMA_RELE.id_skema
//      ↓
// SKEMA.id_skema
//
// ========================================

exports.getDeviceUsage = async (no) => {

    // ========================================
    // VALIDASI DEVICE
    // ========================================

    await exports.getDeviceByNo(no);


    // ========================================
    // MT
    // ========================================

    const mtResult = await db.query(
        `
        SELECT DISTINCT
            s.id_skema,
            s.skema AS skema_name,
            s.id_ss,
            ss.subsistem,
            sm.no,
            sm.jenis
        FROM "SKEMA_MT" sm
        INNER JOIN "SKEMA" s
            ON sm.id_skema = s.id_skema
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE sm.no = $1
        ORDER BY
            s.id_skema
        `,
        [no]
    );


    // ========================================
    // RELE
    // ========================================

    const releResult = await db.query(
        `
        SELECT DISTINCT
            s.id_skema,
            s.skema AS skema_name,
            s.id_ss,
            ss.subsistem,
            sr.no
        FROM "SKEMA_RELE" sr
        INNER JOIN "SKEMA" s
            ON sr.id_skema = s.id_skema
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE sr.no = $1
        ORDER BY
            s.id_skema
        `,
        [no]
    );


    return {
        mt: mtResult.rows,
        rele: releResult.rows,
    };
};