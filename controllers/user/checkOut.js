const userCLTN = require('../../models/users/userDetails');
const cartCLTN = require('../../models/users/cart');
const mongoose = require('mongoose');
const couponCLTN = require('../../models/admin/coupon');
const orderCLTN = require('../../models/users/order');
const paypal = require('paypal-rest-sdk');

// paypal configuration
paypal.configure({
      mode : 'sandbox',
      client_id: process.env.PAYPAL_CLIENTID,
      client_secret: process.env.PAYPAL_SECRET,
});


//view checkout page
exports.view = async(req, res) => {
      try {
            const userCart = await cartCLTN
                              .findOne({customer : req.session.userId})
                              .populate({
                                    path : 'products.name',
                                    populate:{
                                          path : 'brand',
                                          model : 'brands'
                                    },
                              });
            const products = await userCart.products;
      
            if(products.totalQuantity != 0){
                  let allAddresses = await userCLTN.findById(req.session.userId);
                  allAddresses = await allAddresses.addresses;

                  let defaultAddress = await userCLTN.aggregate([
                        {
                              $match: { _id: new mongoose.Types.ObjectId(req.session.userId) },
                            },
                            {
                              $unwind: "$addresses",
                            },
                            {
                              $match: {
                                "addresses.primary": true,
                              },
                            },{
                              $project :{
                                    address : "$addresses"
                              },
                            },
                  ]);

                  if(defaultAddress != ""){
                        defaultAddress = defaultAddress[0].address;
                  }else{
                        defaultAddress = 0;
                  }
                  res.render('user/profile/partials/checkout', {
                        documentTitle : 'Checkout | LAP4YOU',
                        defaultAddress,
                        allAddresses,
                        products,
                        userCart,
                  })
            } else{
                  res.redirect('/users/cart');
            }
            
      } catch (error) {
            console.log('Error in Check Out Page : ' + error);
      }
};


// checking coupons validity
exports.coupon = async (req, res) => {
      try {
            const couponCode = req.body.couponCode;
            const userCart = await cartCLTN.findOne({
                  customer : req.session.userId,
            });
            const cartPrice = userCart.totalPrice;
      
            if(couponCode == ''){
                  res.json({
                        data:{
                              couponCheck : null,
                              discountPrice : 0,
                              discountPercentage : 0,
                              finalPrice : cartPrice,
                        }
                  });
            }
      
            let couponCheck = '';
            let discountPercentage = 0;
            let discountPrice = 0;
            let finalPrice = cartPrice;
      
            const coupon = await couponCLTN.findOne({
                  code : couponCode,
            });
      
            if(coupon){
                  const alreadyUsedCoupon = await userCLTN.findOne({
                        _id : req.session.userId,
                        couponsUsed : coupon._id,
                  });
                  // id coupon is not used check coupons status, and validity
                  if(!alreadyUsedCoupon){
                        if(coupon.active == true){
                              // toJSON()returns JSON complaint string re[resentation]
                              const currentTime = new Date().toJSON();
                              if(currentTime > coupon.startingDate.toJSON()){
                                    if(currentTime < coupon.expiryDate.toJSON()){
                                          discountPercentage = coupon.discount;
                                          discountPrice = (discountPercentage/100)* cartPrice;
                                          discountPrice = Math.floor(discountPrice);
                                          finalPrice = cartPrice - discountPrice;
                                          //coupon applied Case
                                          couponCheck = 
                                                 '<b>Coupon Applied <i class="fa fa-check text-success" aria-hidden="true"></i></b></br>' +
                                                 coupon.name;
                                    } else{
                                          couponCheck =
                                                "<b style='font-size:0.75rem; color: red'>Coupon expired<i class='fa fa-stopwatch'></i></b>";
                                    }
                              }else{
                                    couponCheck = 
                                                `<b style='font-size:0.75rem; color: green'>Coupon starts on </b><br/><p style="font-size:0.75rem;">${coupon.startingDate}</p>`;
                              }
                        }else{
                              couponCheck =
                                          "<b style='font-size:0.75rem; color: red'>Invalid Coupon !</i></b>";
                        }
                  }else{
                        couponCheck =
                                    "<b style='font-size:0.75rem; color: grey'>Coupon already used !</i></b>";
                  }
            }else{
                  couponCheck = "<b style='font-size:0.75rem'>Coupon not found</b>";
            }
            
            res.json({
                  data:{
                        couponCheck,
                        discountPercentage,
                        discountPrice,
                        finalPrice,
                  }
            });
      } catch (error) {
            console.log('Error in Coupon Checking : ' + error);
      }

};


// changing default address
exports.defaultAddress = async(req, res) => {
      try {
            const userId = req.session.userId;
            const defaultAddressId = req.body.DefaultAddress;
            console.log(req.body.DefaultAddress);
            // chnage existing default address to false
            await userCLTN.updateMany(
                  {_id : userId, 'addresses.primary' : true},
                  {$set: {'addresses.$.primary' : false}}
            );

            // change current default address to true

            await userCLTN.updateOne(
                  {_id : userId, 'addresses._id' : defaultAddressId},
                  {$set : {'addresses.$.primary' : true}}
            );

            res.redirect('/users/cart/checkout');
      } catch (error) {
            console.log('Error in Change Address : ' + error);
      }
}


// proceeding to place order
let orderDetails;
exports.checkOut = async (req, res) => {
      try {
            // retrive address based on req.body.address._id
            let shippingAddress = await userCLTN.aggregate([
                  {
                        $match:{
                              _id : new mongoose.Types.ObjectId(req.session.userId),
                        },
                  },{
                        $unwind : '$addresses',
                  },{
                        $match : {
                              'addresses._id' : new mongoose.Types.ObjectId(req.body.addressID),
                        },
                  },
                  
            ]);
            // addresses will be an object inside shipping address array
            shippingAddress = shippingAddress[0].addresses;

            //coupon used if any
            let couponUsed = await couponCLTN.findOne({
                  code : req.body.couponCode,
                  active : true
            });
            if(couponUsed){
                  // checking validity of coupon used
                  const currentTime = new Date().toJSON();
                  if(currentTime > couponUsed.startingDate.toJSON()){
                        if(currentTime < couponUsed.expiryDate.toJSON()){
                              couponUsed = couponUsed._id;
                        } else{
                              req.body.couponDiscount = 0;
                        }
                  } else{
                        req.body.couponDiscount = 0;
                  }
            } else{
                  req.body.couponDiscount = 0;
            }
            if(!req.body.couponCode){
                  req.body.couponDiscount = 0;
                  couponUsed = null;
            }
            req.session.couponUsed = couponUsed;

            // cart summary of user
            const orderSummary = await cartCLTN.aggregate([
                  {
                        $match : {
                              customer : new mongoose.Types.ObjectId(req.session.userId),
                        },
                  }, {
                        $unwind : '$products',
                  },{
                        $project : {
                              _id : 0,
                              product : "$products.name",
                              quantity : "$products.quantity",
                              totalPrice : "$products.price",
                        },
                  },
            ]);

            const userCart = await cartCLTN.findOne({
                  customer : req.session.userId,
            });

            //creating order
            orderDetails = {
                  customer : req.session.userId,
                  shippingAddress : {
                        building : shippingAddress.building,
                        address : shippingAddress.address,
                        pincode : shippingAddress.pincode,
                        country : shippingAddress.country,
                        contactNumber : shippingAddress.contactNumber,
                  },
                  modeOfPayment : req.body.paymentMethod,
                  couponUsed : couponUsed,
                  summary : orderSummary,
                  totalQuantity : userCart.totalQuantity,
                  finalPrice: req.body.finalPrice,
                  discountPrice : req.body.couponDiscount,
            };
            console.log(orderDetails);
            console.log(orderDetails.totalQuantity);
            req.session.orderDetails = orderDetails;

            const transactionID = Math.floor(
                  Math.random() * (1000000000000 - 10000000000) + 10000000000
            );
            req.session.transactionID = transactionID;

            // payments 
            if(req.body.paymentMethod === "COD"){
                  res.redirect('/users/cart/checkout/' + transactionID);
            } else if(req.body.paymentMethod === "PayPal"){
                  const billAmount = (orderDetails.finalPrice * 0.012).toFixed(2);

                  
                  const create_payment_json = {
                        intent : "sale",
                        payer : {
                              payment_method : "paypal",
                        },
                        redirect_urls : {
                              return_url : `http://localhost:3000/users/cart/checkout/${transactionID}`,
                              cancel_url : 'http://localhost:3000/users/cart/checkout',
                        },
                        transactions : [
                              {
                                    item_list : {
                                          items:[
                                                {
                                                      name : `Order Number - ${transactionID}`,
                                                      sku : `Order Number - ${transactionID}`,
                                                      price : billAmount,
                                                      currency : "USD",
                                                      quantity :1,
                                                },
                                          ],
                                    },
                                    amount : {
                                          currency : "USD",
                                          total : billAmount,
                                    },
                                    description : "LAP4YOU eCommerce"
                              },
                        ],
                  };
                  paypal.payment.create(
                        create_payment_json,
                        async function (error, payment){
                              if(error){
                                    throw error;
                              }else{
                                    for(let i = 0; i < payment.links.length; i++){
                                          if(payment.links[i].rel === "approval_url"){
                                                res.redirect(payment.links[i].href);
                                          }
                                    } 
                              }
                        }
                  );
            }
      } catch (error) {
            console.log("Error checking out : " + error);
      }
}


exports.result = async (req, res) => {
      try {
            if(req.session.transactionID){
                  const couponUsed = req.session.couponUsed;
                  console.log(couponUsed);
                  req.session.transactionID = false;
                  const orderDetails = new orderCLTN(req.session.orderDetails);
                  orderDetails.save();
                  if(couponUsed){
                        await userCLTN.findByIdAndUpdate( req.session.userId, {
                              $push:{
                                    // pushing Id of order Details
                                    orders : [ new mongoose.Types.ObjectId(orderDetails)],
                                    couponsUsed : [couponUsed],
                              },
                        });
                  } else{
                        await userCLTN.findByIdAndUpdate(req.session.userId, {
                              $push : {
                                    orders : [new mongoose.Types.ObjectId(orderDetails)],
                              }
                        });
                  }

                  await cartCLTN.findOneAndUpdate(
                        {
                              customer : req.session.userId,
                        },
                        {
                              $set : { products : [], totalPrice : 0, totalQuantity : 0},
                        }
                  );
                  const orderResult = "Order Placed";
                  res.render("user/profile/partials/orderResult", {
                        documentTitle : orderResult,
                        orderID : orderDetails._id,
                        orderResult,
                  });
            } else{
                  res.redirect('/users/cart/checkout');
            }
      } catch (error) {
            console.log("Error rendering success page : " + error);
      }
};