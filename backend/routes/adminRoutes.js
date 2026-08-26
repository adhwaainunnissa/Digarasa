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
// ========================================

router.get(
    "/users",
    authenticateToken,
    roleMiddleware("admin"),
    adminController.getUsers
);


// ========================================
// CREATE USER
// ========================================

router.post(
    "/users",
    authenticateToken,
    roleMiddleware("admin"),
    adminController.createUser
);


// ========================================
// DELETE USER
// ========================================

router.delete(
    "/users/:id",
    authenticateToken,
    roleMiddleware("admin"),
    adminController.deleteUser
);


module.exports = router;