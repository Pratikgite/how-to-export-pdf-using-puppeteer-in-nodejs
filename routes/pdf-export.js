const router = require("express").Router();
const { pdfExport } = require("../controller/functions");

router.get("/", pdfExport);

module.exports = router;