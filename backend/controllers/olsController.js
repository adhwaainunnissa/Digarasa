const olsService = require("../Services/olsService");

exports.getOlsStatus = async (req, res, next) => {
    try {
        const data = await olsService.getOlsStatus();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

exports.getOlsConfig = async (req, res, next) => {
    try {
        const data = await olsService.getOlsConfig();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

exports.getOlsHistory = async (req, res, next) => {
    try {
        const { page, limit, search, startDate, endDate } = req.query;
        const result = await olsService.getOlsHistory({
            page,
            limit,
            search,
            startDate,
            endDate,
        });
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

exports.updateOls = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await olsService.updateOls(id, req.body);

        res.status(200).json({
            success: true,
            message: "Data OLS berhasil diperbarui",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteOls = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await olsService.deleteOls(id);

        res.status(200).json({
            success: true,
            message: "Data OLS berhasil dihapus",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// CREATE OLS
// ========================================
exports.createOls = async (req, res, next) => {
    try {
        const data = await olsService.createOls(req.body);

        res.status(201).json({
            success: true,
            message: "Data OLS berhasil ditambahkan",
            data,
        });
    } catch (error) {
        next(error);
    }
};
