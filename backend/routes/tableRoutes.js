const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");

// ========================================
// GET SEMUA TABEL
// ========================================

router.get(
    "/tables",
    tableController.getTables
);

// ========================================
// GET SCHEMA TABEL
// GET /api/tables/DEVICE_PROSIS/schema
// ========================================

router.get(
    "/tables/:table/schema",
    tableController.getSchema
);

// ========================================
// GET INFO TABEL
// GET /api/tables/DEVICE_PROSIS/info
// ========================================

router.get(
    "/tables/:table/info",
    tableController.getTableInfo
);

// ========================================
// GET DATA TABEL
// GET /api/tables/DEVICE_PROSIS
// ========================================

router.get(
    "/tables/:table",
    tableController.getData
);

// ========================================
// INSERT DATA
// POST /api/tables/DEVICE_PROSIS
// ========================================

router.post(
    "/tables/:table",
    tableController.insertData
);

// ========================================
// UPDATE DATA
// PUT /api/tables/DEVICE_PROSIS/1
// ========================================

router.put(
    "/tables/:table/:id",
    tableController.updateData
);

// ========================================
// DELETE DATA
// DELETE /api/tables/DEVICE_PROSIS/1
// ========================================

router.delete(
    "/tables/:table/:id",
    tableController.deleteData
);

module.exports = router;