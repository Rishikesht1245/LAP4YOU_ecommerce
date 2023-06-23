const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
      customer:{
            type : mongoose.Types.ObjectId,
            ref:"UserDetails",
      },
      totalPrice : Number,
      totalQuantity : Number,
      products : [
            {
                  name:{
                        type: mongoose.Types.ObjectId,
                        ref: "products",
                  },
                  quantity:{
                        type:Number,
                        default :1,
                        min:1,
                  },
                  ramCapacity : String,
                  ssdCapacity : String,
                  price:Number,

            },
      ],
});

const cartCLTN = new mongoose.model("Cart", cartSchema);
module.exports = cartCLTN;