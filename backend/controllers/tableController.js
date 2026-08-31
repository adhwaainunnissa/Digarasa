const tableService = require("../services/tableService");
const auditService = require("../services/auditService");
// ========================================
// GET SEMUA TABEL
// ========================================

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


// ========================================
// GET SCHEMA
// ========================================

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


// ========================================
// GET TABLE INFO
// ========================================

exports.getTableInfo = async (req, res) => {
    try {
        console.log("PARAMS:", req.params);
        const table = req.params.table;

        console.log("TABLE DARI URL:", table);

        const info = await tableService.getTableInfo(table);

        res.json(info);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};


// ========================================
// GET DATA
// ========================================

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


// ========================================
// INSERT DATA
// ========================================

exports.insertData = async (req, res) => {
    try {
        const table = req.params.table;
        const data = req.body;

        const result = await tableService.insertData(
            table,
            data
        );

        await auditService.createLog({
             userId: req.user.id,
                username: req.user.username,
                action: "CREATE",
                tableName: table,
                recordId:
                    result?.id ??
                    result?.no ??
                    null,
                details: result,
            });

        res.status(201).json({
            message: "Data berhasil ditambahkan",
            data: result,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};


// ========================================
// UPDATE DATA
// ========================================

exports.updateData = async (req, res) => {
    try {
        const table = req.params.table;
        const id = req.params.id;
        const data = req.body;

        const result = await tableService.updateData(
            table,
            id,
            data
        );
            await auditService.createLog({
                userId: req.user.id,
                username: req.user.username,
                action: "UPDATE",
                tableName: table,
                recordId: id,
                details: {
                    changes: data,
                    result: result,
                },
            });

        res.json({
            message: "Data berhasil diperbarui",
            data: result,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};


// ========================================
// DELETE DATA
// ========================================

exports.deleteData = async (req, res) => {
    try {
        const table = req.params.table;
        const id = req.params.id;

        const result = await tableService.deleteData(
            table,
            id
        );

                await auditService.createLog({
            userId: req.user.id,
            username: req.user.username,
            action: "DELETE",
            tableName: table,
            recordId: id,
            details: result,
        });

        res.json({
            message: "Data berhasil dihapus",
            data: result,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message,
        });
    }
};