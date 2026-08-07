const tableService = require("../services/tableService");

exports.getTables = async (req, res) => {
    try {
        const tables = await tableService.getTables();
        res.json(tables);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getSchema = async (req, res) => {
    try {
        const schema = await tableService.getSchema(req.params.table);
        res.json(schema);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getData = async (req, res) => {
    try {
        const data = await tableService.getData(req.params.table);
        res.json(data);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};