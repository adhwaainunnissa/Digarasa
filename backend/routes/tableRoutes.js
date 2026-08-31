const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");
const roleMiddleware = require("../middleware/roleMiddleware");
const tablePermissionMiddleware = require("../middleware/tablePermissionMiddleware");

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
    tablePermissionMiddleware,
    tableController.insertData
);



// ========================================
// PUT
// ADMIN SAJA
// ========================================

router.put(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tablePermissionMiddleware,
    tableController.updateData
);


// ========================================
// DELETE
// ADMIN SAJA
// ========================================

router.delete(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tablePermissionMiddleware,
    tableController.deleteData
);

module.exports = router;