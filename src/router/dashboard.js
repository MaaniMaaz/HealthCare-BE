const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboardController");


router.route("/").get(dashboard.stats);

module.exports = router;
