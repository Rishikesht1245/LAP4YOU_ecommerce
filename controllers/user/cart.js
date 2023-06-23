const mongoose = require('mongoose');
const productCLTN = require('../../models/admin/productDetails');
const cartCLTN = require('../../models/users/cart');
const wishlistCLTN = require('../../models/users/wishlist');


// cart Page

exports.viewAll = async (req, res) => {
      try {
        const userCart = await cartCLTN
          .findOne({ customer: req.session.userId })
          .populate({
            path: "products.name",
            populate: {
              path: "brand",
              model: "brands",
            },
          })
          .exec();
        res.render("user/profile/partials/cart", {
          userCart,
          documentTitle: "Your Cart | LAP4YOU",
        });
      } catch (error) {
        console.log("Error rendering all addresses: " + error);
      }
};
    


// adding products to the cart

exports.addToCart = async (req, res) => {
      try {
            const userId = req.session.userId;
            const productId = req.body.id;
            const price = parseInt(req.body.price);
            const ramCapacity = req.body.ramCapacity;
            const ssdCapacity = req.body.ssdCapacity;
            // check if product present wishlist
            const wishlistCheck = await wishlistCLTN.findOne({
                        customer : userId, 
                        products : new mongoose.Types.ObjectId(productId),
                  });
            
            if(wishlistCheck){
                  await wishlistCLTN.findByIdAndUpdate( wishlist._id, // particular users wishlist document
                        {$pull : {products : productId}},
                  );
            }
      
            const userCart = await cartCLTN.findOne({customer : userId});
            const product = await productCLTN.findOne({_id : productId});
            //checking if product already exist in cart
            const productExist = await cartCLTN.findOne({
                  _id : userCart._id, 
                  products:{
                        $elemMatch : {name : new mongoose.Types.ObjectId(productId), ramCapacity: ramCapacity}
                  }
            });
      
            if(productExist){
                  await cartCLTN.updateOne({
                        _id : userCart._id, 
                        products:{
                              $elemMatch : {name : new mongoose.Types.ObjectId(productId)}
                        }
                  },{
                        $inc:{
                              'products.$.quantity' : 1,
                              totalPrice : price,
                              totalQuantity : 1,
                              'products.$.price' : price
                        },
                  });
                  res.json({
                        success:'countAdded',
                        message : 1,
                  });
            } else{
                  await cartCLTN.findByIdAndUpdate(userCart._id, {
                        $push : {
                              products : [
                                    {
                                          name: new mongoose.Types.ObjectId(productId),
                                          price : price,
                                          ramCapacity : ramCapacity,
                                          ssdCapacity: ssdCapacity,
                                    },
                              ]
                        },
                        $inc : {
                              totalPrice : price,
                              totalQuantity : 1,
                        } 
                  });
            }
            res.json({
                  success : 'addedToCart',
                  message : 1,
            });
      } catch (error) {
            console.log('Error in Add Cart Page : ' + error);
      }
};


// remove product from cart
exports.remove = async(req, res) => {
      try {
            const removeProductId = req.body.id;
            const userId = req.session.userId;
            const productToRemove = await cartCLTN.aggregate([
                  {
                        $match: {customer : new mongoose.Types.ObjectId(userId)}
                  },
                  {
                        $unwind : "$products"
                  },
                  {
                        $match : {'products._id' : new mongoose.Types.ObjectId(req.body.id)}
                  },
            ]);
            await cartCLTN.updateOne
                  ({customer : new mongoose.Types.ObjectId(userId)}, 
                        {
                              $pull : {
                                    products : {
                                          _id : new mongoose.Types.ObjectId(removeProductId),
                                    },
                               },
                               $inc : {
                                    totalPrice : -productToRemove[0].products.price,
                                    totalQuantity : -productToRemove[0].products.quantity,
                               },
                        });
            res.json({
                  success : 'removed'
            });
      } catch (error) {
            console.log('Error in removing Product from Cart : ' + error);
      }
};


// add count product in cart 
exports.addCount = async(req, res) => {
     
      try{
            const productIdInCart = req.body.cartId; // products._id
            const userId = req.session.userId;
            const ramCapacity = req.body.ramCapacity;
            const productId = req.body.productId;  // products.name._id
            
            const product = await productCLTN.findById(productId);
            const productPrice = product.RAMSSD.find((item) => item.ramCapacity == ramCapacity).price;
            // updating the count in cart collection
            await cartCLTN.findOneAndUpdate(
                  { 
                        customer : userId,
                        products : {
                              $elemMatch:{_id : new mongoose.Types.ObjectId(productIdInCart)}
                        },
                  }, {
                        $inc: {
                              'products.$.quantity' : 1,
                              totalQuantity : 1,
                              totalPrice : productPrice,
                              'products.$.price' : productPrice,
                        }
                  },
            );

            const userCart = await cartCLTN.findOne({
                  customer: userId
            });
            const allProducts = await userCart.products;
            //current product 
            const currentProduct = allProducts.find((item) => 
                  item._id == productIdInCart);
            res.json({
                  data: {
                        currentProduct,
                        userCart,
                  },
            });
      } catch(error){
            console.log('Error in Add product count in Cart : ' + error);
      }
};

// reduce count of products in cart
exports.reduceCount = async(req, res) => {
      try {
            const cartId = req.body.cartId; // product._id
            const userId = req.session.userId;

            const currentProduct = await cartCLTN.aggregate([
                  {
                        $match : {
                              customer : new mongoose.Types.ObjectId(userId),
                        }
                  }, {
                        $unwind : '$products'
                  },{
                        $match : {
                              'products._id': new mongoose.Types.ObjectId(cartId)
                        }
                  }
            ]);

            const productPrice = currentProduct[0].products.price; // total price 
            const currentProductQuantity  = currentProduct[0].products.quantity;
            const currentProductPrice = productPrice/currentProductQuantity;  //

            if(currentProductQuantity > 1){
                  await cartCLTN.findOneAndUpdate({
                        customer : new mongoose.Types.ObjectId(userId),
                        'products._id' : new mongoose.Types.ObjectId(cartId)
                  }, {
                        $inc:{
                              'products.$.quantity' : -1,
                              'products.$.price' : -currentProductPrice,
                              totalPrice : -currentProductPrice,
                              totalQuantity : -1
                        }
                  });
            }

            const userCart = await cartCLTN.findOne({customer : new mongoose.Types.ObjectId(userId)});
            const allProducts = await userCart.products;
            const currentItem = allProducts.find((item) => item._id == cartId);
            res.json({
                  data :{
                        userCart,
                        currentProduct : currentItem,
                  }
            });
      } catch (error) {
            console.log('Error in Reduce Product count in Cart : ' + error);
      }
}