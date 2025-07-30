const express = require("express");
const router = express.Router();
const booking = require("../controllers/bookingController");


router.route("/").post(booking.createBooking);
router.route("/:id").get(booking.getBookingById);
router.route("/:id").put(booking.updateBooking);
router.route("/change-status/:id").post(booking.changeBookingStatus);
router.route("/:id").delete(booking.deleteBooking);

module.exports = router;
