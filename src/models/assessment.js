const mongoose = require("mongoose");
const { Schema } = mongoose;

const assessmentSchema = new Schema(
  {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    phone:{
        type:Number,
        required:true
    },
    relationship:{
        type:String,
        required:true
    },
    currentSituation:{
        type:String,
        required:true
    },
    careType:{
        type:String,
        required:true
    },
    condition:{
        type:[String],
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    priorities:{
        type:[String],
        required:true
    },
    urgency:{
        type:String,
        required:true
    },
    budget:{
        type:String,
        required:true
    },
    document:{
        type:String,
    },

  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;