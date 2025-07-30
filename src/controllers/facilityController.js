const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Facility = require("../models/facility");

const createFacility = async (req,res) => {
  // #swagger.tags = ['facility']
  try {
    const {
      facilityName,
      facilityId,
      assessment,
      realName,
      starRating,
      distance,
      monthlyCost,
      priceCategory,
      phoneNumber,
      pros,
      cons,
      recommendationReason,
      mapUrl,
      score,
    } = req.body;
        const newFacility = await Facility.create({
     facilityName,
      facilityId,
      assessment,
      realName,
      starRating,
      distance,
      monthlyCost,
      priceCategory,
      phoneNumber,
      pros,
      cons,
      recommendationReason,
      mapUrl,
      score,
    });
    newFacility.save();
    return SuccessHandler(newFacility, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateFacility = async (req, res) => {
  // #swagger.tags = ['facility']
  try {
    const { id } = req.params;
    const {
    facilityName,
      facilityId,
      realName,
      starRating,
      distance,
      monthlyCost,
      priceCategory,
      phoneNumber,
      pros,
      cons,
      recommendationReason,
      mapUrl,
      score,
    } = req.body;

    const existingFacility = await Facility.findById(id);

    if (!existingFacility) {
      return ErrorHandler("Facility not found", 404, req, res);
    }

    existingFacility.facilityName = facilityName ||  existingFacility.facilityName;
    existingFacility.facilityId = facilityId ||  existingFacility.facilityId;
    existingFacility.realName = realName || existingFacility.realName;
    existingFacility.starRating = starRating ||   existingFacility.starRating;
    existingFacility.distance = distance || existingFacility.distance;
    existingFacility.monthlyCost = monthlyCost || existingFacility.monthlyCost;
    existingFacility.priceCategory = priceCategory || existingFacility.priceCategory;
    existingFacility.phoneNumber = phoneNumber || existingFacility.phoneNumber;
    existingFacility.pros = pros ||  existingFacility.pros;
    existingFacility.cons = cons ||  existingFacility.cons;
    existingFacility.recommendationReason = recommendationReason || existingFacility.recommendationReason;
    existingFacility.mapUrl = mapUrl || existingFacility.mapUrl;
    existingFacility.score = score || existingFacility.score;

    await existingFacility.save();

    return SuccessHandler(existingFacility, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getFacilityById = async (req, res) => {
  // #swagger.tags = ['facility']
  try {
    const { id } = req.params;

    const facility = await Facility.findById(id).populate("assessment");

    if (!facility) {
      return ErrorHandler("Facility not found", 404, req, res);
    }

    return SuccessHandler(facility, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteFacility = async (req, res) => {
  // #swagger.tags = ['facility']
  try {
    const { id } = req.params;

    const deletedFacility = await Facility.findByIdAndDelete(id);

    if (!deletedFacility) {
      return ErrorHandler("Facility not found", 404, req, res);
    }

    return SuccessHandler({ message: "Facility deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  createFacility,
  updateFacility,
  getFacilityById,
  deleteFacility
};