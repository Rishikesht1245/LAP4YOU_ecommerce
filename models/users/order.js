const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
      customer : {
            type : mongoose.Types.ObjectId,
            ref : "users",
      },
      totalQuantity : Number,
      summary : [
            {
                  product : {
                        type : mongoose.Types.ObjectId,
                        ref : "products",
                  },
                  quantity : Number,
                  totalPrice : Number,
            },
      ],
      shippingAddress : {
            building : String,
            address : String,
            pincode : String,
            country : String,
            contactNumber : Number,
      },
      delivered : { type : Boolean, default : false},
      status : {
            type : String,
            default : "In-transit",
      },
      modeOfPayment : String,
      couponUsed : {type : mongoose.Types.ObjectId, ref : "Coupons"},
      price : Number,
      finalPrice : Number,
      discountPrice : {type : Number, default : 0},
      orderedOn : {type : Date, default : new Date()},
      deliveredOn : {type : Date, default:null},
      returnedOn : {type : Date, default:null},
      updatedBy : String,
});

const orderCLTN = new mongoose.model('Orders', orderSchema);
module.exports = orderCLTN;