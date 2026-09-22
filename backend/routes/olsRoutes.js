const express = require("express");
const router = express.Router();

const olsController = require("../controllers/olsController");
const verifyToken = require("../middleware/authMiddleware");

// All OLS routes require authentication
router.use(verifyToken);

router.get("/status", olsController.getOlsStatus);
router.get("/config", olsController.getOlsConfig);
router.get("/history", olsController.getOlsHistory);



// EDIT OLS
router.put("/:id", olsController.updateOls);

// DELETE OLS
router.delete("/:id", olsController.deleteOls);

// CREATE OLS
router.post("/", olsController.createOls);

module.exports = router;