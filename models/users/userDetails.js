const mongoose = require('mongoose');

//schema design and creation
const userSchema =  new mongoose.Schema({
      name: {
            type : String,
            required : true,
      },
      number : {
            type : Number,
            required : true,
      },
      email :{
            type : String,
            required : true,
            unique:true,
      },
      photo : {
            type:String,
            default:'default_userPhoto.jpg'
      },
      password : {
            type : String,
            required : true,
      },
      access : {
            type : Boolean,
            default : true,
      },
      addresses : [
          {
            building : String,
            address : String,
            pincode : Number,
            country : String,
            contactNumber : String,
            primary: Boolean,
           },
      ],
      cart : {
            type : mongoose.Types.ObjectId,
            ref : "Cart",
      },
      wishlist : {
            type : mongoose.Types.ObjectId,
            ref : "Wishlist",
      },
      orders : [
         {
            type : mongoose.Types.ObjectId,
            ref : "Orders",
         },
      ],
      couponsUsed : [
            {
                  type : mongoose.Types.ObjectId,
                  ref : "Coupons",
            },
      ],
  },
  {timestamps:true}
);

const userCLTN = new mongoose.model("users", userSchema);

module.exports = userCLTN;