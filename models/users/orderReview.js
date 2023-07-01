const mongoose = require('mongoose');

const orderReviewSchema = new mongoose.Schema({
      customer : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      product : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      delivered :{
            type : Boolean,
            default : false,
      } 
});

const orderReviewCLTN = new mongoose.model("orderReview" , orderReviewSchema);
module.exports = orderReviewCLTN;