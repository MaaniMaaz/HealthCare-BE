const mongoose = require("mongoose");
const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    user :{
    type: Schema.Types.ObjectId,
      ref: "user",
      required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes:{
        type:[String],
        default:null
    },
    dislikes:{
        type:[String],
        default:null
    },
    
    files:{
        type:[String],
    },
   
    
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;