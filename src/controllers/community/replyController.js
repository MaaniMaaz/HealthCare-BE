const SuccessHandler = require("../../utils/SuccessHandler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Comment = require("../../models/community/comments");


const createComment = async (req, res) => {
  // #swagger.tags = ['comment']
  try {
    const { comment , article } = req.body;
    const { _id } = req.user;



    const newComment = await Comment.create({
      comment,
      article,
      user: _id,
    });

    return SuccessHandler(newComment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateComment = async (req, res) => {
  // #swagger.tags = ['comment']
  try {
    const { id } = req.params;
     const { comment   } = req.body;
  

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return ErrorHandler("Comment not found", 404, req, res);
    }

    existingArticle.comment = comment ||  existingArticle.comment;
   

    await existingComment.save();

    return SuccessHandler(existingComment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
