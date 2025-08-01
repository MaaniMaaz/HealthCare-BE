const express = require("express");
const router = express.Router();
const comment = require("../../controllers/community/commentController");
const { isAuthenticated } = require("../../middleware/auth");

router.route("/:id").get(isAuthenticated, comment.getAllComments);
router
  .route("/")
  .post(
    isAuthenticated,
    comment.createComment
  );
router
  .route("/:id")
  .put(
    isAuthenticated,
    comment.updateComment
  );
router.route("/:id").delete(isAuthenticated,comment.deleteComment);

router.route("/like/:id").get(isAuthenticated, comment.likeComment);

module.exports = router;
