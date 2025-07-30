const express = require("express");
const router = express.Router();
const tour = require("../controllers/tourController");


router.route("/").post(tour.createTour);
router.route("/:id").get(tour.getTourById);
router.route("/:id").put(tour.updateTour);
router.route("/change-status/:id").post(tour.changeTourStatus);
router.route("/:id").delete(tour.deleteTour);

module.exports = router;
