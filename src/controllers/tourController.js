const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Tour = require("../models/tour");
const { default: mongoose } = require("mongoose");

const createTour = async (req,res) => {
  // #swagger.tags = ['tour']
  try {
    const {
      booking,
      familyContactName,
      tourDate,
      tourTime,
      alternateDate,
      facilityNotes,
      facilityCallbackRequired,
      status,
    } = req.body;
        const newTour = await Tour.create({
     booking,
      familyContactName,
      tourDate,
      tourTime,
      alternateDate,
      facilityNotes,
      facilityCallbackRequired,
      status,
    });
    newTour.save();
    return SuccessHandler(newTour, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateTour = async (req, res) => {
  // #swagger.tags = ['tour']
  try {
    const { id } = req.params;
    const {
      familyContactName,
      tourDate,
      tourTime,
      alternateDate,
      facilityNotes,
      facilityCallbackRequired,
      status,
    } = req.body;

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
      return ErrorHandler("Tour not found", 404, req, res);
    }

    existingTour.familyContactName = familyContactName ||  existingTour.familyContactName;
    existingTour.tourDate = tourDate ||  existingTour.tourDate;
    existingTour.tourTime = tourTime ||  existingTour.tourTime;
    existingTour.alternateDate = alternateDate ||  existingTour.alternateDate;
    existingTour.facilityNotes = facilityNotes || existingTour.facilityNotes;
    existingTour.facilityCallbackRequired = facilityCallbackRequired ||   existingTour.facilityCallbackRequired;
    existingTour.status = status || existingTour.status;
    

    await existingTour.save();

    return SuccessHandler(existingTour, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getTourById = async (req, res) => {
  // #swagger.tags = ['tour']
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id).populate({
    path: "booking",
    populate: {
      path: "facility",
    },
  });;

    if (!tour) {
      return ErrorHandler("Tour not found", 404, req, res);
    }

    return SuccessHandler(tour, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteTour = async (req, res) => {
  // #swagger.tags = ['tour']
  try {
    const { id } = req.params;

    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return ErrorHandler("Tour not found", 404, req, res);
    }

    return SuccessHandler({ message: "Tour deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const changeTourStatus = async (req , res) => {
    // #swagger.tags = ['tour']
    try{
          const { id } = req.params;
          const {status} = req.body
          const existingTour = await Tour.findById(id);

    if (!existingTour) {
      return ErrorHandler("Tour not found", 404, req, res);
    }
    existingTour.status = status ||  existingTour?.status
    await existingTour.save()


 return SuccessHandler({ message: "Tour deleted successfully" }, 200, res);
    }catch(error){
         return ErrorHandler(error.message, 500, req, res);
    }
}

const getAllTours = async (req, res) => {
  // #swagger.tags = ['tour']
  try {
    const { email } = req.user;
    
    const { title, page = 1, limit = 10 } = req.query;

    const matchStage = title
      ? { "facility.facilityName": { $regex: title, $options: "i" } }
      : {};

    // Alternative approach - assuming Tour has a booking field that's already an ObjectId
    const tours = await Tour.aggregate([
   {
  $addFields: {
    bookingObjectId: {
      $convert: {
        input: "$booking",
        to: "objectId",
        onError: null,       // <-- prevents aggregation failure
        onNull: null
      }
    }
  }
},
{
  $lookup: {
    from: "bookings",
    localField: "bookingObjectId",
    foreignField: "_id",
    as: "booking"
  }
},
      {
        $unwind: "$booking"
      },
      {
        $lookup: {
          from: "facilities",
          localField: "booking.facility",
          foreignField: "_id",
          as: "facility"
        }
      },
      {
        $unwind: "$facility"
      },
      {
        $lookup: {
          from: "assessments",
          localField: "facility.assessment",
          foreignField: "_id",
          as: "assessment"
        }
      },
      {
        $unwind: "$assessment"
      },
      {
        $match: {
          ...(email && { "assessment.email": email }),
          ...matchStage 
        }
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) }
          ]
        }
      }
    ]);

    return SuccessHandler({ message: "Tours fetched successfully", tours }, 200, res);
  } catch (error) {
    console.error('Error in getAllTours:', error);
    return ErrorHandler(error.message, 500, req,res);
  }
};


module.exports = {
  createTour,
  updateTour,
  getTourById,
  deleteTour,
  changeTourStatus,
  getAllTours
};