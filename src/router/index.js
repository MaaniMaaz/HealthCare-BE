const express = require("express");
const router = express.Router();
const assessment = require("./assessment")
const facility = require("./facility")
const booking = require("./booking")
const tour = require("./tour")
const auth = require("./auth")
const article = require("./community/article")
const comment = require("./community/comment")


router.use("/auth", auth);
router.use("/assessment", assessment);
router.use("/facility", facility);
router.use("/booking", booking);
router.use("/tour", tour);
router.use("/auth", auth);
router.use("/article", article);
router.use("/comment", comment);

module.exports = router;
