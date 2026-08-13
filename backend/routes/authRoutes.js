const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

// LOGIN TIDAK BOLEH MEMERLUKAN TOKEN
router.post(
    "/login",
    authController.login
);

// endpoint untuk mengecek user yang sedang login
router.get(
    "/me",
    authenticateToken,
    authController.me
);

router.put(
    "/change-password",
    authenticateToken,
    authController.changePassword
);

module.exports = router;