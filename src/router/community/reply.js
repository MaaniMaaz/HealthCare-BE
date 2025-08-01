const express = require("express");
const router = express.Router();
const reply = require("../../controllers/community/replyController");
const { isAuthenticated } = require("../../middleware/auth");

router.route("/:id").get(isAuthenticated, reply.getAllReplies);
router
  .route("/")
  .post(
    isAuthenticated,
    reply.createReply
  );
router
  .route("/:id")
  .put(
    isAuthenticated,
    reply.updateReply
  );
router.route("/:id").delete(isAuthenticated, reply.deleteReply);

module.exports = router;