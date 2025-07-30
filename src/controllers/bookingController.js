const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Booking = require("../models/booking");

const createBooking = async (req,res) => {
  // #swagger.tags = ['booking']
  try {
    const {
      facility,
      type,
      preferredDays,
      preferredTimes,
      notes,
      status,
    } = req.body;
        const newBooking = await Booking.create({
    facility,
      type,
      preferredDays,
      preferredTimes,
      notes,
      status,
    });
    newBooking.save();
    return SuccessHandler(newBooking, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const { id } = req.params;
    const {
      type,
      preferredDays,
      preferredTimes,
      notes,
      status,
    } = req.body;

    const existingBooking = await Booking.findById(id);

    if (!existingBooking) {
      return ErrorHandler("Booking not found", 404, req, res);
    }

    existingBooking.type = type ||  existingBooking.type;
    existingBooking.preferredDays = preferredDays ||  existingBooking.preferredDays;
    existingBooking.preferredTimes = preferredTimes || existingBooking.preferredTimes;
    existingBooking.notes = notes ||   existingBooking.notes;
    existingBooking.status = status || existingBooking.status;
    

    await existingBooking.save();

    return SuccessHandler(existingBooking, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getBookingById = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const { id } = req.params;

    const facility = await Booking.findById(id).populate({
    path: "facility",
    populate: {
      path: "assessment",
    },
  });;

    if (!facility) {
      return ErrorHandler("Booking not found", 404, req, res);
    }

    return SuccessHandler(facility, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteBooking = async (req, res) => {
  // #swagger.tags = ['booking']
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return ErrorHandler("Booking not found", 404, req, res);
    }

    return SuccessHandler({ message: "Booking deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const changeBookingStatus = async (req , res) => {
    // #swagger.tags = ['booking']
    try{
          const { id } = req.params;
          const {status} = req.body
          const existingBooking = await Booking.findById(id);

    if (!existingBooking) {
      return ErrorHandler("Booking not found", 404, req, res);
    }
    existingBooking.status = status ||  existingBooking?.status
    await existingBooking.save()


 return SuccessHandler({ message: "Booking deleted successfully" }, 200, res);
    }catch(error){
         return ErrorHandler(error.message, 500, req, res);
    }
}


module.exports = {
  createBooking,
  updateBooking,
  getBookingById,
  deleteBooking,
  changeBookingStatus
};