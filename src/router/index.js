const express = require("express");
const router = express.Router();
const assessment = require("./assessment")
const facility = require("./facility")
const booking = require("./booking")
const tour = require("./tour")

router.use("/assessment", assessment);
router.use("/facility", facility);
router.use("/booking", booking);
router.use("/tour", tour);

module.exports = router;
