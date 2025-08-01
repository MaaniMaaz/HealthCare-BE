const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    facility :{
type: Schema.Types.ObjectId,
      ref: "Facility",
    },
    type:{
        type:String,
    },
    preferredDays:{
        type:[String],
        required:true
    },
    preferredTimes:{
        type:[String],
        required:true
    },
    
    notes:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending confirmation" , "confirmed" , "rejected"],
        default:"pending confirmation"
    },
   
    
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;