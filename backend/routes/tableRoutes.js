const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");


router.get("/tables", tableController.getTables);
router.get("/tables/:table/schema", tableController.getSchema);
router.get("/tables/:table", tableController.getData);
router.get("/tables/:table/info",tableController.getTableInfo);
router.post("/tables/:table",tableController.insertData);
router.put("/tables/:table/:id",tableController.updateData);
router.delete("/tables/:table/:id",tableController.deleteData);

module.exports = router;