const mongoose = require('mongoose');
const productCLTN = require('../../models/admin/productDetails');
const cartCLTN = require('../../models/users/cart');
const wishlistCLTN = require('../../models/users/wishlist');


// cart Page

exports.viewAll = async (req, res) => {
      try {
        const userCart = await cartCLTN
          .findOne({ customer: req.session.userId })
          .populate("products.name");
          
        console.log(userCart);
        
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
                        $elemMatch : {name : new mongoose.Types.ObjectId(productId)}
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
                              totalPrice : product.RAMSSD[0].price,
                              totalQuantity : 1,
                              'products.$.price' : product.price
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
                                          price : product.RAMSSD[0].price,
                                    },
                              ]
                        },
                        $inc : {
                              totalPrice : product.RAMSSD[0].price,
                              quantity : 1,
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