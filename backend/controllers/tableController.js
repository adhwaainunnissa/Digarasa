const tableService = require("../services/tableService");

exports.getTables = async (req, res) => {
    try {
        const tables = await tableService.getTables();

        res.json(tables);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getSchema = async (req, res) => {
    try {
        const schema = await tableService.getSchema(
            req.params.table
        );

        res.json(schema);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getData = async (req, res) => {
    try {
        const table = req.params.table;

        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const search = req.query.search || "";

        const result = await tableService.getData(
            table,
            page,
            limit,
            search
        );

        res.json(result);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};