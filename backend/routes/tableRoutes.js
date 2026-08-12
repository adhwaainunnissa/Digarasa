const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// ========================================
// SEMUA ROUTE TABLE WAJIB LOGIN
// ========================================

router.use("/tables", authenticateToken);

// ========================================
// GET
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
// ========================================

router.post(
    "/tables/:table",
    authorizeRole("admin"),
    tableController.insertData
);

// ========================================
// PUT
// ========================================

router.put(
    "/tables/:table/:id",
    authorizeRole("admin"),
    tableController.updateData
);

// ========================================
// DELETE
// ========================================

router.delete(
    "/tables/:table/:id",
    authorizeRole("admin"),
    tableController.deleteData
);

module.exports = router;