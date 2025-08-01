const SuccessHandler = require("../../utils/SuccessHandler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Comment = require("../../models/community/comments");
const Reply = require("../../models/community/replies");

const createReply = async (req, res) => {
  // #swagger.tags = ['reply']
  try {
    const { reply, comment } = req.body;
    const { _id } = req.user;

    const newReply = await Reply.create({
      reply,
      comment,
      user: _id,
    });

    // Add reply to comment's replies array
    await Comment.findByIdAndUpdate(comment, {
      $push: { replies: newReply._id }
    });

    return SuccessHandler(newReply, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateReply = async (req, res) => {
  // #swagger.tags = ['reply']
  try {
    const { id } = req.params;
    const { reply } = req.body;
  
    const existingReply = await Reply.findById(id);

    if (!existingReply) {
      return ErrorHandler("Reply not found", 404, req, res);
    }

    existingReply.reply = reply || existingReply.reply;
   
    await existingReply.save();

    return SuccessHandler(existingReply, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteReply = async (req, res) => {
  // #swagger.tags = ['reply']
  try {
    const { id } = req.params;

    const deletedReply = await Reply.findByIdAndDelete(id);

    if (!deletedReply) {
      return ErrorHandler("Reply not found", 404, req, res);
    }

    // Remove reply from comment's replies array
    await Comment.findByIdAndUpdate(deletedReply.comment, {
      $pull: { replies: id }
    });

    return SuccessHandler({ message: "Reply deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllReplies = async (req, res) => {
  // #swagger.tags = ['reply']
  try {
    const { id } = req.params; // comment id
     
    const replies = await Reply.find({"comment":id}).populate('user', 'firstName lastName email')

    return SuccessHandler({message:"Replies fetched successfully", replies}, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, res);
  }
};

module.exports = {
  createReply,
  updateReply,
  deleteReply,
  getAllReplies
};
