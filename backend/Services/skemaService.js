const db = require("../config/db");

// ========================================
// GET SUBSISTEM
// ========================================

exports.getSubsistem = async (search = "") => {
    const result = await db.query(
        `
        SELECT
            id_ss,
            subsistem
        FROM "subsistem"
        WHERE
            $1 = ''
            OR subsistem ILIKE $2
        ORDER BY subsistem
        `,
        [
            search.trim(),
            `%${search.trim()}%`,
        ]
    );

    return result.rows;
};


// ========================================
// GET SKEMA
// ========================================

exports.getSkema = async ({
    page = 1,
    limit = 20,
    search = "",
}) => {

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) {
        page = 1;
    }

    if (isNaN(limit) || limit < 1) {
        limit = 20;
    }

    if (limit > 100) {
        limit = 100;
    }

    const offset = (page - 1) * limit;
    const keyword = `%${search.trim()}%`;

    const countResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM "SKEMA" s
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE
            $1 = ''
            OR CAST(s.id_skema AS TEXT) ILIKE $2
            OR s.skema ILIKE $2
            OR ss.subsistem ILIKE $2
        `,
        [
            search.trim(),
            keyword,
        ]
    );

    const total =
        Number(countResult.rows[0].total);

    const result = await db.query(
        `
        SELECT
            s.id_skema,
            s.skema,
            s.id_ss,
            ss.subsistem,
            s.aktif
        FROM "SKEMA" s
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE
            $1 = ''
            OR CAST(s.id_skema AS TEXT) ILIKE $2
            OR s.skema ILIKE $2
            OR ss.subsistem ILIKE $2
        ORDER BY s.id_skema
        LIMIT $3
        OFFSET $4
        `,
        [
            search.trim(),
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
// GET 1 SKEMA
// ========================================

exports.getSkemaById = async (id) => {

    const result = await db.query(
        `
        SELECT
            s.id_skema,
            s.skema,
            s.id_ss,
            ss.subsistem,
            s.aktif
        FROM "SKEMA" s
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE s.id_skema = $1
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error(
            `Skema dengan ID ${id} tidak ditemukan`
        );
    }

    return result.rows[0];
};


// ========================================
// GET DETAIL MT
// ========================================

exports.getSkemaMT = async (idSkema) => {

    const result = await db.query(
        `
        SELECT
            sm.no,
            sm.id_skema,
            sm.jenis
        FROM "SKEMA_MT" sm
        WHERE sm.id_skema = $1
        ORDER BY sm.no
        `,
        [idSkema]
    );

    return result.rows;
};


// ========================================
// GET DETAIL RELE
// ========================================

exports.getSkemaRele = async (idSkema) => {

    const result = await db.query(
        `
        SELECT
            sr.no,
            sr.id_skema
        FROM "SKEMA_RELE" sr
        WHERE sr.id_skema = $1
        ORDER BY sr.no
        `,
        [idSkema]
    );

    return result.rows;
};


// ========================================
// GET DETAIL RTAC
// ========================================
//
// RTAC TIDAK MEMPUNYAI id_skema.
// Relasi berdasarkan nama pada kolom Skema.
//

exports.getSkemaRTAC = async (skemaName) => {

    const result = await db.query(
        `
        SELECT
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        FROM "Skema_RTAC"
        WHERE "Skema" = $1
        ORDER BY
            "Tahap",
            "Gardu_Induk",
            "Bay_Target"
        `,
        [skemaName]
    );

    return result.rows;
};


// ========================================
// CREATE
// ========================================

exports.createSkema = async ({
    skema,
    id_ss,
    aktif,
}) => {

    if (!skema || !skema.trim()) {
        throw new Error(
            "Nama skema wajib diisi."
        );
    }

    if (
        id_ss !== null &&
        id_ss !== undefined &&
        id_ss !== ""
    ) {

        const subsistemResult =
            await db.query(
                `
                SELECT id_ss
                FROM "subsistem"
                WHERE id_ss = $1
                `,
                [id_ss]
            );

        if (
            subsistemResult.rows.length === 0
        ) {
            throw new Error(
                "Subsistem yang dipilih tidak ditemukan."
            );
        }
    }

    if (
        aktif !== null &&
        aktif !== undefined &&
        ![0, 1].includes(Number(aktif))
    ) {
        throw new Error(
            "Status aktif tidak valid."
        );
    }

    const result = await db.query(
        `
        INSERT INTO "SKEMA"
        (
            skema,
            id_ss,
            aktif
        )
        VALUES
        ($1, $2, $3)
        RETURNING
            id_skema,
            skema,
            id_ss,
            aktif
        `,
        [
            skema.trim(),
            id_ss === ""
                ? null
                : id_ss ?? null,
            aktif === ""
                ? null
                : aktif ?? null,
        ]
    );

    return result.rows[0];
};


// ========================================
// UPDATE
// ========================================

exports.updateSkema = async (
    id,
    {
        skema,
        id_ss,
        aktif,
    }
) => {

    if (!skema || !skema.trim()) {
        throw new Error(
            "Nama skema wajib diisi."
        );
    }

    if (
        id_ss !== null &&
        id_ss !== undefined &&
        id_ss !== ""
    ) {

        const subsistemResult =
            await db.query(
                `
                SELECT id_ss
                FROM "subsistem"
                WHERE id_ss = $1
                `,
                [id_ss]
            );

        if (
            subsistemResult.rows.length === 0
        ) {
            throw new Error(
                "Subsistem yang dipilih tidak ditemukan."
            );
        }
    }

    if (
        aktif !== null &&
        aktif !== undefined &&
        ![0, 1].includes(Number(aktif))
    ) {
        throw new Error(
            "Status aktif tidak valid."
        );
    }

    const result = await db.query(
        `
        UPDATE "SKEMA"
        SET
            skema = $1,
            id_ss = $2,
            aktif = $3
        WHERE id_skema = $4
        RETURNING
            id_skema,
            skema,
            id_ss,
            aktif
        `,
        [
            skema.trim(),
            id_ss === ""
                ? null
                : id_ss ?? null,
            aktif === ""
                ? null
                : aktif ?? null,
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error(
            `Skema dengan ID ${id} tidak ditemukan`
        );
    }

    return result.rows[0];
};


// ========================================
// DELETE
// ========================================

exports.deleteSkema = async (id) => {

    const result = await db.query(
        `
        DELETE FROM "SKEMA"
        WHERE id_skema = $1
        RETURNING
            id_skema,
            skema,
            id_ss,
            aktif
        `,
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error(
            `Skema dengan ID ${id} tidak ditemukan`
        );
    }

    return result.rows[0];
};