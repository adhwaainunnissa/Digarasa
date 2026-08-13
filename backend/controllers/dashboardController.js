const dashboardService = require("../services/dashboardService");

exports.getStats = async (req, res) => {
    try {
        const stats =
            await dashboardService.getStats();

        res.json(stats);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Gagal mengambil statistik dashboard",
            error: err.message,
        });
    }
};