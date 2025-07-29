const express = require("express");
const router = express.Router();
const assessment = require("../controllers/assessmentController");


router.route("/").post(assessment.createAssessment);
router.route("/:id").get(assessment.getAssessmentById);
router.route("/:id").put(assessment.updateAssessment);
router.route("/:id").delete(assessment.deleteAssessment);

module.exports = router;
