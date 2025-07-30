const mongoose = require("mongoose");
const { Schema } = mongoose;

const tourSchema = new Schema(
  {
    booking :{
type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    familyContactName:{
        type:String,
        required:true
    },
    tourDate:{
        type:String,
        required:true
    },
    alternateDate:{
        type:String,
    },
    tourTime:{
        type:String,
        required:true
    },
    
    facilityNotes:{
        type:String,
    },
    facilityCallbackRequired:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["pending confirmation" , "confirmed" , "rejected"],
        default:"pending confirmation"
    },
   
    
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;