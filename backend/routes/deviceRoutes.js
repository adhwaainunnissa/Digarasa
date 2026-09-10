const express = require("express");

const router = express.Router();

const deviceController =
    require("../controllers/deviceController");

const authenticateToken =
    require("../middleware/authMiddleware");

// Semua endpoint device wajib login
router.use(authenticateToken);

// ========================================
// LIST DEVICE
// ========================================

router.get(
    "/",
    deviceController.getDevices
);

// ========================================
// DEVICE DETAIL
// ========================================

router.get(
    "/:no",
    deviceController.getDeviceByNo
);

// ========================================
// DEVICE USAGE
// ========================================

router.get(
    "/:no/usage",
    deviceController.getDeviceUsage
);

module.exports = router;