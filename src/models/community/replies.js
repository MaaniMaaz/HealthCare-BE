const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema(
  {
    user :{
    type: Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    comment :{
    type: Schema.Types.ObjectId,
      ref: "Comment",
      required:true
    },
    comment:{
        type:String,
        required:true
    },
    
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;