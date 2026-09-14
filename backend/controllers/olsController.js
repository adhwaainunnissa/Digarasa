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
