const { order } = require('paypal-rest-sdk');
const orderCLTN = require('../../models/users/order');
const moment = require('moment');
const orderReviewCLTN = require('../../models/users/orderReview');
const returnCLTN = require('../../models/users/return');
const productCLTN = require('../../models/admin/productDetails');
const mongoose = require('mongoose');


//view orders
exports.viewAll = async(req, res) => {
      try {
            const allOrders = await orderCLTN
                  .find()
                  .populate('customer', 'name email')
                  .populate('couponUsed', 'name')
                  .populate('summary.product', 'category name brand RAMSSD')
                  .populate('summary.product.category')
                  .populate('summary.product.brand')
                  .sort({_id : -1});

            const totalPrice = allOrders.map((order) => order.summary.reduce((total, value)=> total += value.totalPrice, 0));
            allOrders.price = totalPrice;
            console.log(allOrders);
            res.render('admin/partials/orders', {
                  documentTitle : "LAP4YOU | eCommerce",
                  session : req.session.admin,
                  allOrders,
                  moment,
            });
      } catch (error) {
            console.log("Error in Order Admin Page : " + error);
      }
};


// deliver order
exports.changeOrderStatus = async(req, res) => {
      try {
            // update the data to orderCLTN for all status
            await orderCLTN.findByIdAndUpdate(req.body.id, {
                  $set:{
                        delivered : req.body.delivered,
                        status : req.body.status,
                        deliveredOn : req.body.deliveredOn,
                  }
            });
           
            // if status is refunded increase the stock, change access to review 
            if(req.body.status == "Refunded"){
                 
                  const currentOrder = await orderCLTN.findById(req.body.id);
                  console.log(currentOrder)
                  const quantity = currentOrder.totalQuantity;
                  const userId = currentOrder.customer;
                  const returnedProducts  = await returnCLTN.findOne({customer : userId, isReturned : false});
                  
                  const returnedProductId = returnedProducts._id; // document id
                  const productId = returnedProducts.product; // product id
                  const price = req.body.price;
                 
                  // increasing the stock once order is returned
                  await productCLTN.updateOne(
                        {
                          _id: productId,
                          "RAMSSD.price": price,
                        },
                        {
                          $inc: {
                            "RAMSSD.$.quantity": quantity,
                          }
                        }
                      );
                  console.log('Increased the count');

                  // changeing returned status to true
                  await returnCLTN.findByIdAndUpdate(returnedProductId, {
                        $set :{
                              isReturned : true,
                        }
                  });

                  // change review access to false 

                  await orderReviewCLTN.updateOne({customer : userId, product : productId}, 
                        {delivered : false}
                  );

                  res.json({
                        data : {
                              delivered : 1,
                        }
                  });
            } else{

                   // find the order by Id 
                  const order = await orderCLTN.findById(req.body.id)
                                                .populate('customer', 'name, email');

                  //extract product id and customer id
                  const productIds = order.summary.map(product => product.product);
      
                  const customerId = order.customer._id;

                  // insert data to the order reviewCLTN when product is delivered
                  if(req.body.status === "Delivered"){
                        const orderReviews = productIds.map((productId) => {
                               return  new orderReviewCLTN({
                                     customer : customerId,
                                     product : productId,
                                     delivered : true,
                               });
                        });

                        await orderReviewCLTN.insertMany(orderReviews);
                  }
                  
                  res.json({
                        data : {
                              delivered : 1,
                        }
                  });
            }

      } catch (error) {
            console.log('Error in Product Delivery :  '+ error);
      }
};

// order details
exports.details = async(req, res) => {
      try {
            const currentOrder = await orderCLTN
                  .findById(req.params.id)
                  .populate('summary.product')
                  .populate('couponUsed');
            const totalPrice = currentOrder.summary.reduce((total, order) => total += order.totalPrice, 0);
            currentOrder.totalPrice = totalPrice;
            res.render('admin/partials/orderDetails', {
                  session : req.session.admin,
                  moment,
                  documentTitle : 'LAP4YOU | eCommerce',
                  currentOrder,
            });
      } catch (error) {
            console.log('Error in Order Details Page : ' + error);
      }
}

// cancel Orders
exports.cancelOrder = async(req, res) => {
      try {
            const orderDetails = await orderCLTN.findById(req.params.id);
          
                  await orderCLTN.findByIdAndUpdate(req.params.id, {
                        $set : {
                              status : "Cancelled",
                              delivered : null,
                        }
                  });
      
                  res.json({
                        success:{
                              message : 'cancelled'
                        }
                  });   
      } catch (error) {
            console.log("Error in Cancel Order Admin Side :" + error);
      }
}