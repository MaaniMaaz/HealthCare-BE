const express = require("express");
const router = express.Router();
const assessment = require("./assessment")
const facility = require("./facility")
const booking = require("./booking")
const tour = require("./tour")
const auth = require("./auth")
const article = require("./community/article")
const admin = require("./admin/article")
const comment = require("./community/comment")
const reply = require("./community/reply")
const dashboard = require("./dashboard")


router.use("/auth", auth);
router.use("/assessment", assessment);
router.use("/facility", facility);
router.use("/booking", booking);
router.use("/tour", tour);
router.use("/article", article);
router.use("/comment", comment);
router.use("/reply", reply);
router.use("/community", article); 
router.use("/admin", admin); 
router.use("/dashboard", dashboard); 

module.exports = router;
