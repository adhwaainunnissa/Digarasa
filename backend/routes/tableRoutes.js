const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");
const roleMiddleware = require("../middleware/roleMiddleware");
const tablePermissionMiddleware = require("../middleware/tablePermissionMiddleware");
const tableAccessMiddleware =
    require("../middleware/tableAccessMiddleware");

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
     tableAccessMiddleware,
    tableController.getSchema
);

router.get(
    "/tables/:table/info",
    tableAccessMiddleware,
    tableController.getTableInfo
);

router.get(
    "/skema/mt",
    tableAccessMiddleware,
    tableController.getDataMT
);

router.get(
    "/tables/:table",
    tableAccessMiddleware,
    tableController.getData
);


// ========================================
// POST
// ADMIN SAJA
// ========================================

router.post(
    "/tables/:table",
    roleMiddleware("admin"),
    tableAccessMiddleware,
    tableController.insertData
);



// ========================================
// PUT
// ADMIN SAJA
// ========================================

router.put(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tableAccessMiddleware,
    tableController.updateData
);


// ========================================
// DELETE
// ADMIN SAJA
// ========================================

router.delete(
    "/tables/:table/:id",
    roleMiddleware("admin"),
    tableAccessMiddleware,
    tableController.deleteData
);

module.exports = router;