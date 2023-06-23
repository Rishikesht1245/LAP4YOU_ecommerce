const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
      customer : {
            type : mongoose.Types.ObjectId,
            ref : "UserDetails",
      },
      products: [{
            type: mongoose.Types.ObjectId,
            ref: "products",
          }],   
});


const wishlistCLTN = new mongoose.model("Wishlist", wishlistSchema);
module.exports = wishlistCLTN;