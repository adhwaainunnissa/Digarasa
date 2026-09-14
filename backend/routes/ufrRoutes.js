const express = require("express");
const router = express.Router();
const ufrController = require("../controllers/ufrController");

router.get("/step/:step", ufrController.getUfrStepRelay);
router.get("/beban/:beban", ufrController.getUfrBeban);

module.exports = router;
