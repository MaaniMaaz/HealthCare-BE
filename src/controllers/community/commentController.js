const SuccessHandler = require("../../utils/SuccessHandler");
const ErrorHandler = require("../../utils/ErrorHandler");
const Comment = require("../../models/community/comments");
const { default: mongoose } = require("mongoose");


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
    const { _id } = req.user;

   const comments = await Comment.aggregate([
  {
    $match: {
      article: new mongoose.Types.ObjectId(id)
    }
  },

  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "replies",
      localField: "replies",
      foreignField: "_id",
      as: "replies"
    }
  },
  { $unwind: { path: "$replies", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "users",
      localField: "replies.user",
      foreignField: "_id",
      as: "replies.user"
    }
  },
  {
    $unwind: {
      path: "$replies.user",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: "$_id",
      comment: { $first: "$comment" },
      user: { $first: "$user" },
      likes: { $first: "$likes" },
      createdAt: { $first: "$createdAt" },
      replies: {
        $push: {
          $cond: [
            { $gt: ["$replies._id", null] },
            "$replies",
            "$$REMOVE"
          ]
        }
      }
    }
  },
    {
        $addFields: {
          isLiked: {
            $or: [
              { $in: [_id, "$likes"] }, 
              { $in: [{ $toString: _id }, "$likes"] }, 
              { $in: [{ $toObjectId: _id }, "$likes"] }  ]
          },
          
         
        }
      },
  
  { $sort: { createdAt: -1 } }
]);


    return SuccessHandler(
      { message: "Comments fetched successfully", comments },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
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