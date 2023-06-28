const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
      customer : {
            type : mongoose.Types.ObjectId,
            ref : 'users',
      },
      product : {
            type : mongoose.Types.ObjectId,
            ref:'Products'
      },
      rating:{
            type:Number,
            min: 1,
            max : 5
      },
      review : {
            type : String,
      },
      createdAt: {
            type : Date,
            default : Date.now(),
      },
      helpful : {
            type : Number,
            default :1,
      },
});

const reviewCLTN = new mongoose.model("Review" , reviewSchema);
module.exports = reviewCLTN;