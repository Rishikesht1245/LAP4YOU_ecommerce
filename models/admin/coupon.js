const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
      name : String,
      code : String,
      discount : Number,
      product :[ {   type: mongoose.Types.ObjectId,
                     ref: "products",},],
      category : {type : mongoose.Types.ObjectId, ref : "categories"},
      startingDate : Date,
      expiryDate : Date,
      active: {
            type : Boolean,
            default : true,
      },
      updatedBy : String,
});

const couponCLTN = new mongoose.model("Coupons", couponSchema);

module.exports = couponCLTN;