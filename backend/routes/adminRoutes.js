const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/adminController");

const authenticateToken =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

// ========================================
// GET USERS
// ADMIN SAJA
// ========================================

router.get(
    "/users",
    authenticateToken,
    roleMiddleware("admin"),
    adminController.getUsers
);

module.exports = router;