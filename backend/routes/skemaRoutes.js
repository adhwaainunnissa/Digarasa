const express = require("express");

const router = express.Router();

const skemaController = require("../controllers/skemaController");
const authenticateToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Semua endpoint SKEMA wajib login
router.use(authenticateToken);

// ========================================
// SUBSISTEM
// ========================================

router.get(
    "/subsistem",
    skemaController.getSubsistem
);

// ========================================
// DEVICE PROSIS
// Dipakai oleh form MT / RELE
// ========================================

router.get(
    "/devices",
    skemaController.getDevices
);

// ========================================
// LIST SKEMA
// ========================================

router.get(
    "/",
    skemaController.getSkema
);

// ========================================
// DETAIL RTAC
// Harus diletakkan sebelum /:id
// ========================================

router.get(
    "/rtac/:skemaName",
    skemaController.getSkemaRTAC
);

// ========================================
// CRUD RTAC
// Identifier RTAC menggunakan Tag_Name
// ========================================

router.post(
    "/rtac",
    roleMiddleware("admin"),
    skemaController.createSkemaRTAC
);

router.put(
    "/rtac/item/:tagName",
    roleMiddleware("admin"),
    skemaController.updateSkemaRTAC
);

router.delete(
    "/rtac/item/:tagName",
    roleMiddleware("admin"),
    skemaController.deleteSkemaRTAC
);

// ========================================
// DETAIL MT
// ========================================

router.get(
    "/:id/mt",
    skemaController.getSkemaMT
);

// ========================================
// CRUD MT
// no = DEVICE_PROSIS.no
// ========================================

router.post(
    "/:id/mt",
    roleMiddleware("admin"),
    skemaController.createSkemaMT
);

router.put(
    "/:id/mt/:no",
    roleMiddleware("admin"),
    skemaController.updateSkemaMT
);

router.delete(
    "/:id/mt/:no",
    roleMiddleware("admin"),
    skemaController.deleteSkemaMT
);

// ========================================
// DETAIL RELE
// ========================================

router.get(
    "/:id/rele",
    skemaController.getSkemaRele
);

// ========================================
// CRUD RELE
// no = DEVICE_PROSIS.no
// ========================================

router.post(
    "/:id/rele",
    roleMiddleware("admin"),
    skemaController.createSkemaRele
);

router.put(
    "/:id/rele/:no",
    roleMiddleware("admin"),
    skemaController.updateSkemaRele
);

router.delete(
    "/:id/rele/:no",
    roleMiddleware("admin"),
    skemaController.deleteSkemaRele
);

// ========================================
// GET ONE SKEMA
// ========================================

router.get(
    "/:id",
    skemaController.getSkemaById
);

// ========================================
// CREATE SKEMA
// ========================================

router.post(
    "/",
    roleMiddleware("admin"),
    skemaController.createSkema
);

// ========================================
// UPDATE SKEMA
// ========================================

router.put(
    "/:id",
    roleMiddleware("admin"),
    skemaController.updateSkema
);

// ========================================
// DELETE SKEMA
// ========================================

router.delete(
    "/:id",
    roleMiddleware("admin"),
    skemaController.deleteSkema
);

module.exports = router;
