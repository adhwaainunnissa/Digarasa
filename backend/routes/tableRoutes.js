const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");
const roleMiddleware = require("../middleware/roleMiddleware");

// ========================================
// GET
// Semua user yang sudah login boleh melihat
// ========================================

router.get(
    "/tables",
    tableController.getTables
);

router.get(
    "/tables/:table/schema",
    tableController.getSchema
);

router.get(
    "/tables/:table/info",
    tableController.getTableInfo
);

router.get(
    "/tables/:table",
    tableController.getData
);


// ========================================
// POST
// ADMIN SAJA
// ========================================

router.post(
    "/tables/:table",
    roleMiddleware("admin"),
    tableController.insertData
);


// ========================================
// PUT
// ADMIN SAJA
// ========================================

router.put(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tableController.updateData
);


// ========================================
// DELETE
// ADMIN SAJA
// ========================================

router.delete(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tableController.deleteData
);

module.exports = router;