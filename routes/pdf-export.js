const router = require("express").Router();
const { pdfExport, chatbot, mailReader } = require("../controller/functions");

router.get("/", pdfExport);
router.get("/chatbot", chatbot);
router.get("/mail-reader", mailReader);

module.exports = router;