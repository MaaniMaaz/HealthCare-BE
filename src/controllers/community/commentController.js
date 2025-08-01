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

    existingComment.comment = comment ||  existingComment.comment;
   

    await existingComment.save();

    return SuccessHandler(existingComment, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const getCommentById = async (req, res) => {
//   // #swagger.tags = ['comment']
//   try {
//     const { id } = req.params;

//     const article = await Article.findById(id)

//     if (!article) {
//       return ErrorHandler("Article not found", 404, req, res);
//     }

//     return SuccessHandler(article, 200, res);
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

const deleteComment = async (req, res) => {
  // #swagger.tags = ['comment']
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return ErrorHandler("Comment not found", 404, req, res);
    }

    return SuccessHandler({ message: "Comment deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllComments = async (req, res) => {
  // #swagger.tags = ['comment']
  try {
    
    const { id } = req.params;
     
    const comments = await Comment.find({"article":id}).populate('user', 'firstName lastName email').populate('replies')

    return SuccessHandler({message:"Comments fetched successfully",comments}, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, res);
  }
};


const likeComment = async (req, res) => {
  // #swagger.tags = ['comment']
  try {
    const { id } = req.params;
    const { _id } = req.user;

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return ErrorHandler("Comment not found", 404, req, res);
    }

    const alreadyLiked = existingComment.likes.includes(_id);
  
   

    if (alreadyLiked) {
      // Toggle: remove like
      existingComment.likes.pull(_id);
    } else {
      // Add like
      existingComment.likes.push(_id);
    }

    await existingComment.save();

    return SuccessHandler(
      {
        message: alreadyLiked
          ? "Like removed from comment"
          : "Comment liked successfully",
        comment: existingComment,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};






module.exports = {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getAllComments
};