const express = require("express");
const router = express.Router();
const assessment = require("./assessment")

router.use("/assessment", assessment);

module.exports = router;
