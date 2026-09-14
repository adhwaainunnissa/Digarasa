const ufrService = require("../Services/ufrService");

exports.getUfrStepRelay = async (req, res) => {
    try {
        const { step } = req.params;
        const { page = 1, limit = 100, search = "" } = req.query;

        const result = await ufrService.getUfrStepRelay({
            step,
            page,
            limit,
            search
        });

        res.json(result);
    } catch (error) {
        console.error("Error fetching UFR Step Relay:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

exports.getUfrBeban = async (req, res) => {
    try {
        const { beban } = req.params;
        const { page = 1, limit = 100, search = "" } = req.query;

        const result = await ufrService.getUfrBeban({
            beban,
            page,
            limit,
            search
        });

        res.json(result);
    } catch (error) {
        console.error("Error fetching UFR Beban:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};
