const express = require("express");
const router = express.Router();
const facility = require("../controllers/facilityController");


router.route("/").post(facility.createFacility);
router.route("/:id").get(facility.getFacilityById);
router.route("/:id").put(facility.updateFacility);
router.route("/:id").delete(facility.deleteFacility);

module.exports = router;
