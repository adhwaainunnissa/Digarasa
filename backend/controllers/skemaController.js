const skemaService = require("../services/skemaService");

// ========================================
// HELPER ERROR HANDLER
// ========================================

const sendError = (res, err, fallbackMessage, status = 400) => {
    console.error(err);

    return res.status(status).json({
        message: err?.message || fallbackMessage,
    });
};


// ========================================
// GET SUBSISTEM
// ========================================

exports.getSubsistem = async (req, res) => {
    try {
        const result = await skemaService.getSubsistem(
            req.query.search || ""
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil subsistem",
            500
        );
    }
};


// ========================================
// GET DEVICES - DEVICE_PROSIS
// ========================================

exports.getDevices = async (req, res) => {
    try {
        const result = await skemaService.getDevices(
            req.query.search || ""
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil data device",
            500
        );
    }
};


// ========================================
// GET SKEMA
// ========================================

exports.getSkema = async (req, res) => {
    try {
        const result = await skemaService.getSkema({
            page: req.query.page || 1,
            limit: req.query.limit || 20,
            search: req.query.search || "",
        });

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil SKEMA",
            500
        );
    }
};


// ========================================
// GET 1 SKEMA
// ========================================

exports.getSkemaById = async (req, res) => {
    try {
        const result = await skemaService.getSkemaById(
            req.params.id
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Skema tidak ditemukan",
            404
        );
    }
};


// ========================================
// GET DETAIL MT
// ========================================

exports.getSkemaMT = async (req, res) => {
    try {
        const result = await skemaService.getSkemaMT(
            req.params.id
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil detail MT",
            500
        );
    }
};


// ========================================
// CREATE MT
// ========================================

exports.createSkemaMT = async (req, res) => {
    try {
        const result = await skemaService.createSkemaMT(
            req.params.id,
            req.body
        );

        return res.status(201).json({
            message: "Detail MT berhasil ditambahkan.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menambahkan detail MT",
            400
        );
    }
};


// ========================================
// UPDATE MT
// ========================================

exports.updateSkemaMT = async (req, res) => {
    try {
        const result = await skemaService.updateSkemaMT(
            req.params.id,
            req.params.no,
            req.body
        );

        return res.json({
            message: "Detail MT berhasil diperbarui.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal memperbarui detail MT",
            400
        );
    }
};


// ========================================
// DELETE MT
// ========================================

exports.deleteSkemaMT = async (req, res) => {
    try {
        const result = await skemaService.deleteSkemaMT(
            req.params.id,
            req.params.no
        );

        return res.json({
            message: "Detail MT berhasil dihapus.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menghapus detail MT",
            400
        );
    }
};


// ========================================
// GET DETAIL RELE
// ========================================

exports.getSkemaRele = async (req, res) => {
    try {
        const result = await skemaService.getSkemaRele(
            req.params.id
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil detail RELE",
            500
        );
    }
};


// ========================================
// CREATE RELE
// ========================================

exports.createSkemaRele = async (req, res) => {
    try {
        const result = await skemaService.createSkemaRele(
            req.params.id,
            req.body
        );

        return res.status(201).json({
            message: "Detail RELE berhasil ditambahkan.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menambahkan detail RELE",
            400
        );
    }
};


// ========================================
// UPDATE RELE
// ========================================

exports.updateSkemaRele = async (req, res) => {
    try {
        const result = await skemaService.updateSkemaRele(
            req.params.id,
            req.params.no,
            req.body
        );

        return res.json({
            message: "Detail RELE berhasil diperbarui.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal memperbarui detail RELE",
            400
        );
    }
};


// ========================================
// DELETE RELE
// ========================================

exports.deleteSkemaRele = async (req, res) => {
    try {
        const result = await skemaService.deleteSkemaRele(
            req.params.id,
            req.params.no
        );

        return res.json({
            message: "Detail RELE berhasil dihapus.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menghapus detail RELE",
            400
        );
    }
};


// ========================================
// GET DETAIL RTAC
// ========================================

exports.getSkemaRTAC = async (req, res) => {
    try {
        const result = await skemaService.getSkemaRTAC(
            req.params.skemaName
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil detail RTAC",
            500
        );
    }
};


// ========================================
// CREATE RTAC
// ========================================

exports.createSkemaRTAC = async (req, res) => {
    try {
        const result = await skemaService.createSkemaRTAC(
            req.body
        );

        return res.status(201).json({
            message: "Data RTAC berhasil ditambahkan.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menambahkan data RTAC",
            400
        );
    }
};


// ========================================
// UPDATE RTAC
// ========================================

exports.updateSkemaRTAC = async (req, res) => {
    try {
        const result = await skemaService.updateSkemaRTAC(
            req.params.tagName,
            req.body
        );

        return res.json({
            message: "Data RTAC berhasil diperbarui.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal memperbarui data RTAC",
            400
        );
    }
};


// ========================================
// DELETE RTAC
// ========================================

exports.deleteSkemaRTAC = async (req, res) => {
    try {
        const result = await skemaService.deleteSkemaRTAC(
            req.params.tagName
        );

        return res.json({
            message: "Data RTAC berhasil dihapus.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menghapus data RTAC",
            400
        );
    }
};


// ========================================
// CREATE SKEMA
// ========================================

exports.createSkema = async (req, res) => {
    try {
        const result = await skemaService.createSkema(
            req.body
        );

        return res.status(201).json({
            message: "Skema berhasil ditambahkan.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menambahkan SKEMA",
            400
        );
    }
};


// ========================================
// UPDATE SKEMA
// ========================================

exports.updateSkema = async (req, res) => {
    try {
        const result = await skemaService.updateSkema(
            req.params.id,
            req.body
        );

        return res.json({
            message: "Skema berhasil diperbarui.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal memperbarui SKEMA",
            400
        );
    }
};


// ========================================
// DELETE SKEMA
// ========================================

exports.deleteSkema = async (req, res) => {
    try {
        const result = await skemaService.deleteSkema(
            req.params.id
        );

        return res.json({
            message: "Skema berhasil dihapus.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menghapus SKEMA",
            400
        );
    }
};
