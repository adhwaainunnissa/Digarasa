const olsService = require("../Services/olsService");

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
// GET STATUS OLS
// ========================================

exports.getOlsStatus = async (req, res) => {
    try {
        const result = await olsService.getOlsStatus();

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil status OLS",
            500
        );
    }
};

exports.getOlsById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await olsService.getOlsById(id);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};
// ========================================
// GET CONFIG OLS
// ========================================

exports.getOlsConfig = async (req, res) => {
    try {
        const result = await olsService.getOlsConfig();

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil konfigurasi OLS",
            500
        );
    }
};

// ========================================
// GET HISTORY OLS
// ========================================

exports.getOlsHistory = async (req, res) => {
    try {
        const result = await olsService.getOlsHistory({
            page: req.query.page || 1,
            limit: req.query.limit || 20,
            search: req.query.search || "",
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        });

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal mengambil history OLS",
            500
        );
    }
};

// ========================================
// GET 1 OLS
// ========================================

exports.getOlsById = async (req, res) => {
    try {
        const result = await olsService.getOlsById(
            req.params.id
        );

        return res.json(result);
    } catch (err) {
        return sendError(
            res,
            err,
            "OLS tidak ditemukan",
            404
        );
    }
};

// ========================================
// CREATE OLS
// ========================================

exports.createOls = async (req, res) => {
    try {
        const result = await olsService.createOls(
            req.body
        );

        return res.status(201).json({
            message: "OLS berhasil ditambahkan.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menambahkan OLS",
            400
        );
    }
};

// ========================================
// UPDATE OLS
// ========================================

exports.updateOls = async (req, res) => {
    try {
        const result = await olsService.updateOls(
            req.params.id,
            req.body
        );

        return res.json({
            message: "OLS berhasil diperbarui.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal memperbarui OLS",
            400
        );
    }
};

// ========================================
// DELETE OLS
// ========================================

exports.deleteOls = async (req, res) => {
    try {
        const result = await olsService.deleteOls(
            req.params.id
        );

        return res.json({
            message: "OLS berhasil dihapus.",
            data: result,
        });
    } catch (err) {
        return sendError(
            res,
            err,
            "Gagal menghapus OLS",
            400
        );
    }
};