const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");


router.get("/tables", tableController.getTables);
router.get("/tables/:table/schema", tableController.getSchema);
router.get("/tables/:table", tableController.getData);
router.post(
    "/tables/:table",
    tableController.createData
);

module.exports = router;