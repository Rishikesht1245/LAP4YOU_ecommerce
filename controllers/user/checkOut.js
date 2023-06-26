const userCLTN = require('../../models/users/userDetails');
const cartCLTN = require('../../models/users/cart');
const mongoose = require('mongoose');
const couponCLTN = require('../../models/admin/coupon');


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
exports.checkOut = async (req, res) => {

}


