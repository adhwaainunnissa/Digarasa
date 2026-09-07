const db = require("../config/db");

// ========================================
// HELPERS
// ========================================

const normalizePagination = (page, limit) => {
    let safePage = parseInt(page, 10);
    let safeLimit = parseInt(limit, 10);

    if (Number.isNaN(safePage) || safePage < 1) safePage = 1;
    if (Number.isNaN(safeLimit) || safeLimit < 1) safeLimit = 20;
    if (safeLimit > 100) safeLimit = 100;

    return { page: safePage, limit: safeLimit };
};

const toNullable = (value) => {
    if (value === "" || value === undefined) return null;
    return value;
};

const validateStatus = (aktif) => {
    if (aktif === null || aktif === undefined || aktif === "") return;

    if (![0, 1].includes(Number(aktif))) {
        throw new Error("Status aktif tidak valid.");
    }
};

const validateSkemaExists = async (idSkema) => {
    const result = await db.query(
        `
        SELECT id_skema, skema
        FROM "SKEMA"
        WHERE id_skema = $1
        `,
        [idSkema]
    );

    if (result.rows.length === 0) {
        throw new Error(`Skema dengan ID ${idSkema} tidak ditemukan.`);
    }

    return result.rows[0];
};

const validateDeviceExists = async (no) => {
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
        throw new Error(`Device dengan nomor ${no} tidak ditemukan di DEVICE_PROSIS.`);
    }

    return result.rows[0];
};

// ========================================
// GET SUBSISTEM
// ========================================

exports.getSubsistem = async (search = "") => {
    const normalizedSearch = search.trim();

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
        [normalizedSearch, `%${normalizedSearch}%`]
    );

    return result.rows;
};

// ========================================
// GET DEVICE OPTIONS
// ========================================
// Dipakai oleh searchable picker MT / RELE.
// User memilih informasi device, backend tetap menyimpan kolom no.

exports.getDevices = async (search = "") => {
    const normalizedSearch = search.trim();
    const keyword = `%${normalizedSearch}%`;

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
        ORDER BY
            gi NULLS LAST,
            no
        LIMIT 100
        `,
        [normalizedSearch, keyword]
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
    const normalized = normalizePagination(page, limit);
    const offset = (normalized.page - 1) * normalized.limit;
    const normalizedSearch = search.trim();
    const keyword = `%${normalizedSearch}%`;

    const countResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM "SKEMA" s
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        WHERE
            $1 = ''
            OR CAST(s.id_skema AS TEXT) ILIKE $2
            OR COALESCE(s.skema, '') ILIKE $2
            OR COALESCE(ss.subsistem, '') ILIKE $2
        `,
        [normalizedSearch, keyword]
    );

    const total = Number(countResult.rows[0].total);

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
            OR COALESCE(s.skema, '') ILIKE $2
            OR COALESCE(ss.subsistem, '') ILIKE $2
        ORDER BY s.id_skema
        LIMIT $3
        OFFSET $4
        `,
        [normalizedSearch, keyword, normalized.limit, offset]
    );

    return {
        data: result.rows,
        pagination: {
            page: normalized.page,
            limit: normalized.limit,
            total,
            totalPages: Math.ceil(total / normalized.limit),
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
        throw new Error(`Skema dengan ID ${id} tidak ditemukan.`);
    }

    return result.rows[0];
};

// ========================================
// GET DETAIL MT
// ========================================
// Enrichment:
// SKEMA_MT -> SKEMA + DEVICE_PROSIS + subsistem

exports.getSkemaMT = async (idSkema) => {
    await validateSkemaExists(idSkema);

    const result = await db.query(
        `
        SELECT
            sm.no,
            sm.id_skema,
            sm.jenis,
            s.skema,
            s.id_ss,
            ss.subsistem,
            dp.tag_name,
            dp.gi,
            dp.jenis AS device_jenis,
            dp.keterangan,
            dp.merek,
            dp.tipe
        FROM "SKEMA_MT" sm
        INNER JOIN "SKEMA" s
            ON sm.id_skema = s.id_skema
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        LEFT JOIN "DEVICE_PROSIS" dp
            ON sm.no = dp.no
        WHERE sm.id_skema = $1
        ORDER BY sm.no
        `,
        [idSkema]
    );

    return result.rows;
};

// ========================================
// CREATE MT
// ========================================

exports.createSkemaMT = async (idSkema, { no, jenis }) => {
    await validateSkemaExists(idSkema);

    const device = await validateDeviceExists(no);

    if (no === null || no === undefined || no === "") {
        throw new Error("Device wajib dipilih.");
    }

    const duplicate = await db.query(
        `
        SELECT 1
        FROM "SKEMA_MT"
        WHERE id_skema = $1
          AND no = $2
        LIMIT 1
        `,
        [idSkema, no]
    );

    if (duplicate.rows.length > 0) {
        throw new Error("Device tersebut sudah terdaftar pada MT skema ini.");
    }

    const resolvedJenis =
        jenis === null || jenis === undefined || jenis === ""
            ? device.jenis
            : String(jenis).trim();

    const result = await db.query(
        `
        INSERT INTO "SKEMA_MT"
        (
            id_skema,
            no,
            jenis
        )
        VALUES ($1, $2, $3)
        RETURNING no, id_skema, jenis
        `,
        [idSkema, no, resolvedJenis || null]
    );

    return result.rows[0];
};

// ========================================
// UPDATE MT
// ========================================

exports.updateSkemaMT = async (idSkema, no, { newNo, jenis }) => {
    await validateSkemaExists(idSkema);
    await validateDeviceExists(newNo ?? no);

    const targetNo = newNo ?? no;

    const existing = await db.query(
        `
        SELECT no, id_skema, jenis
        FROM "SKEMA_MT"
        WHERE id_skema = $1
          AND no = $2
        `,
        [idSkema, no]
    );

    if (existing.rows.length === 0) {
        throw new Error("Detail MT tidak ditemukan.");
    }

    if (Number(targetNo) !== Number(no)) {
        const duplicate = await db.query(
            `
            SELECT 1
            FROM "SKEMA_MT"
            WHERE id_skema = $1
              AND no = $2
            LIMIT 1
            `,
            [idSkema, targetNo]
        );

        if (duplicate.rows.length > 0) {
            throw new Error("Device tersebut sudah terdaftar pada MT skema ini.");
        }
    }

    let resolvedJenis = jenis;

    if (resolvedJenis === undefined) {
        resolvedJenis = existing.rows[0].jenis;
    }

    if (resolvedJenis === null || resolvedJenis === "") {
        const device = await validateDeviceExists(targetNo);
        resolvedJenis = device.jenis || null;
    }

    const result = await db.query(
        `
        UPDATE "SKEMA_MT"
        SET
            no = $1,
            jenis = $2
        WHERE id_skema = $3
          AND no = $4
        RETURNING no, id_skema, jenis
        `,
        [targetNo, resolvedJenis, idSkema, no]
    );

    return result.rows[0];
};

// ========================================
// DELETE MT
// ========================================

exports.deleteSkemaMT = async (idSkema, no) => {
    await validateSkemaExists(idSkema);

    const result = await db.query(
        `
        DELETE FROM "SKEMA_MT"
        WHERE id_skema = $1
          AND no = $2
        RETURNING no, id_skema, jenis
        `,
        [idSkema, no]
    );

    if (result.rows.length === 0) {
        throw new Error("Detail MT tidak ditemukan.");
    }

    return result.rows[0];
};

// ========================================
// GET DETAIL RELE
// ========================================
// Enrichment:
// SKEMA_RELE -> SKEMA + DEVICE_PROSIS + subsistem

exports.getSkemaRele = async (idSkema) => {
    await validateSkemaExists(idSkema);

    const result = await db.query(
        `
        SELECT
            sr.no,
            sr.id_skema,
            s.skema,
            s.id_ss,
            ss.subsistem,
            dp.tag_name,
            dp.gi,
            dp.jenis,
            dp.keterangan,
            dp.merek,
            dp.tipe
        FROM "SKEMA_RELE" sr
        INNER JOIN "SKEMA" s
            ON sr.id_skema = s.id_skema
        LEFT JOIN "subsistem" ss
            ON s.id_ss = ss.id_ss
        LEFT JOIN "DEVICE_PROSIS" dp
            ON sr.no = dp.no
        WHERE sr.id_skema = $1
        ORDER BY sr.no
        `,
        [idSkema]
    );

    return result.rows;
};

// ========================================
// CREATE RELE
// ========================================

exports.createSkemaRele = async (idSkema, { no }) => {
    await validateSkemaExists(idSkema);
    await validateDeviceExists(no);

    if (no === null || no === undefined || no === "") {
        throw new Error("Device wajib dipilih.");
    }

    const duplicate = await db.query(
        `
        SELECT 1
        FROM "SKEMA_RELE"
        WHERE id_skema = $1
          AND no = $2
        LIMIT 1
        `,
        [idSkema, no]
    );

    if (duplicate.rows.length > 0) {
        throw new Error("Device tersebut sudah terdaftar pada RELE skema ini.");
    }

    const result = await db.query(
        `
        INSERT INTO "SKEMA_RELE"
        (
            id_skema,
            no
        )
        VALUES ($1, $2)
        RETURNING no, id_skema
        `,
        [idSkema, no]
    );

    return result.rows[0];
};

// ========================================
// UPDATE RELE
// ========================================

exports.updateSkemaRele = async (idSkema, no, { newNo }) => {
    await validateSkemaExists(idSkema);
    const targetNo = newNo ?? no;
    await validateDeviceExists(targetNo);

    const existing = await db.query(
        `
        SELECT no, id_skema
        FROM "SKEMA_RELE"
        WHERE id_skema = $1
          AND no = $2
        `,
        [idSkema, no]
    );

    if (existing.rows.length === 0) {
        throw new Error("Detail RELE tidak ditemukan.");
    }

    if (Number(targetNo) !== Number(no)) {
        const duplicate = await db.query(
            `
            SELECT 1
            FROM "SKEMA_RELE"
            WHERE id_skema = $1
              AND no = $2
            LIMIT 1
            `,
            [idSkema, targetNo]
        );

        if (duplicate.rows.length > 0) {
            throw new Error("Device tersebut sudah terdaftar pada RELE skema ini.");
        }
    }

    const result = await db.query(
        `
        UPDATE "SKEMA_RELE"
        SET no = $1
        WHERE id_skema = $2
          AND no = $3
        RETURNING no, id_skema
        `,
        [targetNo, idSkema, no]
    );

    return result.rows[0];
};

// ========================================
// DELETE RELE
// ========================================

exports.deleteSkemaRele = async (idSkema, no) => {
    await validateSkemaExists(idSkema);

    const result = await db.query(
        `
        DELETE FROM "SKEMA_RELE"
        WHERE id_skema = $1
          AND no = $2
        RETURNING no, id_skema
        `,
        [idSkema, no]
    );

    if (result.rows.length === 0) {
        throw new Error("Detail RELE tidak ditemukan.");
    }

    return result.rows[0];
};

// ========================================
// GET DETAIL RTAC
// ========================================
// RTAC tidak memiliki id_skema.
// Relasi ke SKEMA menggunakan nilai teks pada kolom "Skema".

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
            "Bay_Target",
            "Tag_Name"
        `,
        [skemaName]
    );

    return result.rows;
};

// ========================================
// CREATE RTAC
// ========================================

exports.createSkemaRTAC = async ({
    Tag_Name,
    Gardu_Induk,
    Bay_Target,
    Skema,
    Tahap,
}) => {
    if (!Tag_Name || !String(Tag_Name).trim()) {
        throw new Error("Tag Name wajib diisi.");
    }

    if (!Skema || !String(Skema).trim()) {
        throw new Error("Skema wajib diisi.");
    }

    await ensureSkemaNameExists(Skema);

    const duplicate = await db.query(
        `
        SELECT 1
        FROM "Skema_RTAC"
        WHERE "Tag_Name" = $1
        LIMIT 1
        `,
        [String(Tag_Name).trim()]
    );

    if (duplicate.rows.length > 0) {
        throw new Error("Tag Name RTAC sudah terdaftar.");
    }

    const result = await db.query(
        `
        INSERT INTO "Skema_RTAC"
        (
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        `,
        [
            String(Tag_Name).trim(),
            toNullable(Gardu_Induk),
            toNullable(Bay_Target),
            String(Skema).trim(),
            toNullable(Tahap),
        ]
    );

    return result.rows[0];
};

// ========================================
// UPDATE RTAC
// ========================================

exports.updateSkemaRTAC = async (oldTagName, {
    Tag_Name,
    Gardu_Induk,
    Bay_Target,
    Skema,
    Tahap,
}) => {
    if (!oldTagName) {
        throw new Error("Tag Name lama wajib dikirim.");
    }

    if (!Tag_Name || !String(Tag_Name).trim()) {
        throw new Error("Tag Name wajib diisi.");
    }

    if (!Skema || !String(Skema).trim()) {
        throw new Error("Skema wajib diisi.");
    }

    await ensureSkemaNameExists(Skema);

    const existing = await db.query(
        `
        SELECT
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        FROM "Skema_RTAC"
        WHERE "Tag_Name" = $1
        `,
        [oldTagName]
    );

    if (existing.rows.length === 0) {
        throw new Error("Data RTAC tidak ditemukan.");
    }

    if (String(Tag_Name).trim() !== oldTagName) {
        const duplicate = await db.query(
            `
            SELECT 1
            FROM "Skema_RTAC"
            WHERE "Tag_Name" = $1
            LIMIT 1
            `,
            [String(Tag_Name).trim()]
        );

        if (duplicate.rows.length > 0) {
            throw new Error("Tag Name RTAC sudah digunakan.");
        }
    }

    const result = await db.query(
        `
        UPDATE "Skema_RTAC"
        SET
            "Tag_Name" = $1,
            "Gardu_Induk" = $2,
            "Bay_Target" = $3,
            "Skema" = $4,
            "Tahap" = $5
        WHERE "Tag_Name" = $6
        RETURNING
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        `,
        [
            String(Tag_Name).trim(),
            toNullable(Gardu_Induk),
            toNullable(Bay_Target),
            String(Skema).trim(),
            toNullable(Tahap),
            oldTagName,
        ]
    );

    return result.rows[0];
};

// ========================================
// DELETE RTAC
// ========================================

exports.deleteSkemaRTAC = async (tagName) => {
    const result = await db.query(
        `
        DELETE FROM "Skema_RTAC"
        WHERE "Tag_Name" = $1
        RETURNING
            "Tag_Name",
            "Gardu_Induk",
            "Bay_Target",
            "Skema",
            "Tahap"
        `,
        [tagName]
    );

    if (result.rows.length === 0) {
        throw new Error("Data RTAC tidak ditemukan.");
    }

    return result.rows[0];
};

// ========================================
// VALIDASI NAMA SKEMA RTAC
// ========================================

async function ensureSkemaNameExists(skemaName) {
    const result = await db.query(
        `
        SELECT id_skema, skema
        FROM "SKEMA"
        WHERE skema = $1
        LIMIT 1
        `,
        [String(skemaName).trim()]
    );

    if (result.rows.length === 0) {
        throw new Error("Nama skema tidak ditemukan di tabel SKEMA.");
    }

    return result.rows[0];
}

// ========================================
// CREATE SKEMA UTAMA
// ========================================

exports.createSkema = async ({
    skema,
    id_ss,
    aktif,
}) => {
    if (!skema || !skema.trim()) {
        throw new Error("Nama skema wajib diisi.");
    }

    if (id_ss !== null && id_ss !== undefined && id_ss !== "") {
        const subsistemResult = await db.query(
            `
            SELECT id_ss
            FROM "subsistem"
            WHERE id_ss = $1
            `,
            [id_ss]
        );

        if (subsistemResult.rows.length === 0) {
            throw new Error("Subsistem yang dipilih tidak ditemukan.");
        }
    }

    validateStatus(aktif);

    const result = await db.query(
        `
        INSERT INTO "SKEMA"
        (
            skema,
            id_ss,
            aktif
        )
        VALUES ($1, $2, $3)
        RETURNING
            id_skema,
            skema,
            id_ss,
            aktif
        `,
        [
            skema.trim(),
            toNullable(id_ss),
            toNullable(aktif),
        ]
    );

    return result.rows[0];
};

// ========================================
// UPDATE SKEMA UTAMA
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
        throw new Error("Nama skema wajib diisi.");
    }

    if (id_ss !== null && id_ss !== undefined && id_ss !== "") {
        const subsistemResult = await db.query(
            `
            SELECT id_ss
            FROM "subsistem"
            WHERE id_ss = $1
            `,
            [id_ss]
        );

        if (subsistemResult.rows.length === 0) {
            throw new Error("Subsistem yang dipilih tidak ditemukan.");
        }
    }

    validateStatus(aktif);

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
            toNullable(id_ss),
            toNullable(aktif),
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error(`Skema dengan ID ${id} tidak ditemukan.`);
    }

    return result.rows[0];
};

// ========================================
// DELETE SKEMA UTAMA
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
        throw new Error(`Skema dengan ID ${id} tidak ditemukan.`);
    }

    return result.rows[0];
};
