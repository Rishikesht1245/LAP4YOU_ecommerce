const mongoose = require('mongoose');
const productCLTN = require('../../models/admin/productDetails');
const cartCLTN = require('../../models/users/cart');
const wishlistCLTN = require('../../models/users/wishlist');
const userCLTN = require('../../models/users/userDetails');


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
         
        const quantityInStock = userCart.products.map((item, i)=> item.name.RAMSSD[0].quantity);

        res.render("user/profile/partials/cart", {
          userCart,
          documentTitle: "Your Cart | LAP4YOU",
          quantityInStock,
        });
      } catch (error) {
        console.log("Error rendering all addresses: " + error);
        const currentUser = await userCLTN.findById(req.session.userId);
        res.render('index/404', {
              documentTitle : '404 | Page Not Found',
              url: req.originalUrl,
              session: req.session.userId,
              currentUser,
        });
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
            req.session.cartCount = req.session.cartCount + 1;

            if(!req.session.userId){
                  req.session.currentUrl = req.body.url;
                  res.json({
                        success : null,
                  })
            }
            //check if product in stock
            const productToAdd = await productCLTN.findOne({_id : productId, 'RAMSSD.price' : price});
            let isProductInStock = productToAdd.RAMSSD.find((ramssd) => ramssd.price == price);
            isProductInStock = isProductInStock.quantity;
            
            //current quantity of product in users cart
            let quantityInCart = await cartCLTN.findOne({customer : userId, 'products.name' : productId, 'products.ramCapacity' : ramCapacity});
            if(quantityInCart){
                  quantityInCart = quantityInCart.products.find((product) => product.ramCapacity == ramCapacity);
                  quantityInCart = quantityInCart.quantity;
            }
           
            // checking enough stock 
            if(isProductInStock > quantityInCart){
                  // check if product present wishlist
                  const wishlistCheck = await wishlistCLTN.findOne({
                              customer : userId, 
                              products : new mongoose.Types.ObjectId(productId),
                        });
                  
                  if(wishlistCheck){
                        await wishlistCLTN.findByIdAndUpdate( wishlistCheck._id, // particular users wishlist document
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
                                    $elemMatch : {name : new mongoose.Types.ObjectId(productId),ramCapacity: ramCapacity}
                              }
                        },{
                              $inc:{
                                    'products.$.quantity' : 1,
                                    totalPrice : price,
                                    totalQuantity : 1,
                                    'products.$.price' : price,
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
            }else{
                  res.json({
                        success : 'outOfStock',
                        message : 0,
                  });
            }
      } catch (error) {
            console.log('Error in Add Cart Page : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};


// remove product from cart
exports.remove = async(req, res) => {
      try {
            const removeProductId = req.body.id;
            const userId = req.session.userId;
            req.session.cartCount = req.session.cartCount - 1
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
            let productId = productToRemove[0].products.name;
            let quantity = productToRemove[0].products.quantity;
            let price = productToRemove[0].products.price
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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

            //check if product in stock
            const productToAdd = await productCLTN.findOne({_id : productId, 'RAMSSD.price' : productPrice});
            let isProductInStock = productToAdd.RAMSSD.find((ramssd) => ramssd.price == productPrice).quantity;

            //current quantity of product in users cart
            let quantityInCart = await cartCLTN.findOne({customer : userId, 'products.name' : productId});
            if(quantityInCart){
                  quantityInCart = quantityInCart.products.find((product) => product.ramCapacity == ramCapacity).quantity;
            }
            
            if(isProductInStock > quantityInCart){
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
                              message:'countAdded',
                              currentProduct,
                              userCart,
                        },
                  });
            }else{
                  res.json({
                        data :{
                              message:'outOfStock'
                        }
                  });
            }
      } catch(error){
            console.log('Error in Add product count in Cart : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
}