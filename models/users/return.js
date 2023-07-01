const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
      customer : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      orderId : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      product : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      reason : {
            type : String,
            required : true,
      },
      accountNo : {
            type : String,
            required : true,
      },
      bankName : {
            type : String,
            required : true,
      },
      ifscCode : {
            type : String,
            required : true,
      },
      isReturned: {
            type : Boolean,
            default : false,
      },
});


const returnCLTN = new mongoose.model("return", returnSchema);
module.exports = returnCLTN;