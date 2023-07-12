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
      action : {
            type : String,
            required : true,
      },
      address : {
            type : mongoose.Types.ObjectId,
            required : true,
      },
      accountNo : {
            type : String,
      },
      bankName : {
            type : String,
      },
      ifscCode : {
            type : String,
      },
      isReturned: {
            type : Boolean,
            default : false,
      },
});


const returnCLTN = new mongoose.model("return", returnSchema);
module.exports = returnCLTN;