const mongoose = require("mongoose");
const { Schema } = mongoose;

const facilitySchema = new Schema(
  {
    assessment :{
type: Schema.Types.ObjectId,
      ref: "Assessment",
    },
    facilityId:{
        type:String,
        required:true
    },
    facilityName:{
        type:String,
        required:true
    },
    realName:{
        type:String,
        required:true
    },
    
    starRating:{
        type:Number,
    },
    distance:{
        type:String,
    },
    monthlyCost:{
        type:String,
    },
    priceCategory:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
   
    pros:{
        type:[String],
        required:true
    },
    cons:{
        type:[String],
        required:true
    },
    recommendationReason:{
        type:String,
        required:true
    },
    mapUrl:{
        type:String,
    },
    score:{
        type:{}
    },
    
  },
  { timestamps: true }
);

const Facility = mongoose.model("Facility", facilitySchema);
module.exports = Facility;