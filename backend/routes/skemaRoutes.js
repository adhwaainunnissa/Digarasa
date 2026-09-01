const express = require("express");

const router = express.Router();

const skemaController =
    require("../controllers/skemaController");

const authenticateToken =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


// ========================================
// SUBSISTEM
// ========================================

router.get(
    "/subsistem",
    authenticateToken,
    skemaController.getSubsistem
);


// ========================================
// LIST SKEMA
// ========================================

router.get(
    "/",
    authenticateToken,
    skemaController.getSkema
);


// ========================================
// DETAIL MT
// ========================================

router.get(
    "/:id/mt",
    authenticateToken,
    skemaController.getSkemaMT
);


// ========================================
// DETAIL RELE
// ========================================

router.get(
    "/:id/rele",
    authenticateToken,
    skemaController.getSkemaRele
);


// ========================================
// DETAIL RTAC
// ========================================

router.get(
    "/rtac/:skemaName",
    authenticateToken,
    skemaController.getSkemaRTAC
);


// ========================================
// GET ONE SKEMA
// ========================================

router.get(
    "/:id",
    authenticateToken,
    skemaController.getSkemaById
);


// ========================================
// CREATE
// ========================================

router.post(
    "/",
    authenticateToken,
    roleMiddleware("admin"),
    skemaController.createSkema
);


// ========================================
// UPDATE
// ========================================

router.put(
    "/:id",
    authenticateToken,
    roleMiddleware("admin"),
    skemaController.updateSkema
);


// ========================================
// DELETE
// ========================================

router.delete(
    "/:id",
    authenticateToken,
    roleMiddleware("admin"),
    skemaController.deleteSkema
);

module.exports = router;