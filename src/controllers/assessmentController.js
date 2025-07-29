const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Assessment = require("../models/assessment");

const createAssessment = async (req,res) => {
  // #swagger.tags = ['assessment']
  try {
    const {
      name,
      email,
      phone,
      relationship,
      currentSituation,
      careType,
      condition,
      zipcode,
      priorities,
      urgency,
      budget,
    } = req.body;

        const newAssessment = await Assessment.create({
      name,
      email,
     phone,
     relationship,
      currentSituation,
      careType,
      condition,
      zipcode,
      priorities,
      urgency,
      budget,
    });
    newAssessment.save();
    return SuccessHandler(newAssessment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateAssessment = async (req, res) => {
  // #swagger.tags = ['assessment']
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      relationship,
      currentSituation,
      careType,
      condition,
      zipcode,
      priorities,
      urgency,
      budget,
    } = req.body;

    const existingAssessment = await Assessment.findById(id);

    if (!existingAssessment) {
      return ErrorHandler("Assessment not found", 404, req, res);
    }

    existingAssessment.name = name ||  existingAssessment.name;
    existingAssessment.email = email || existingAssessment.email;
    existingAssessment.phone = phone ||   existingAssessment.phone;
    existingAssessment.relationship = relationship || existingAssessment.relationship;
    existingAssessment.currentSituation = currentSituation || existingAssessment.currentSituation;
    existingAssessment.careType = careType || existingAssessment.careType;
    existingAssessment.condition = condition || existingAssessment.condition;
    existingAssessment.zipcode = zipcode ||  existingAssessment.zipcode;
    existingAssessment.priorities = priorities ||  existingAssessment.priorities;
    existingAssessment.urgency = urgency || existingAssessment.urgency;
    existingAssessment.budget = budget || existingAssessment.budget;

    await existingAssessment.save();

    return SuccessHandler(existingAssessment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAssessmentById = async (req, res) => {
  // #swagger.tags = ['assessment']
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return ErrorHandler("Assessment not found", 404, req, res);
    }

    return SuccessHandler(assessment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};



const deleteAssessment = async (req, res) => {
  // #swagger.tags = ['assessment']
  try {
    const { id } = req.params;

    const deletedAssessment = await Assessment.findByIdAndDelete(id);

    if (!deletedAssessment) {
      return ErrorHandler("Assessment not found", 404, req, res);
    }

    return SuccessHandler({ message: "Assessment deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  createAssessment,
  updateAssessment,
  getAssessmentById,
  deleteAssessment
};