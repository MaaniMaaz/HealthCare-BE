const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    user :{
    type: Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    article :{
    type: Schema.Types.ObjectId,
      ref: "Article",
      required:true
    },
    comment:{
        type:String,
        required:true
    },
    
    likes:{
        type:[String],
        required:false
    },
 
   
    
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;