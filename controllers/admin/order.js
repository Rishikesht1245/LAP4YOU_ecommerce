const { order } = require('paypal-rest-sdk');
const orderCLTN = require('../../models/users/order');
const moment = require('moment');
const orderReviewCLTN = require('../../models/users/orderReview');
const returnCLTN = require('../../models/users/return');
const productCLTN = require('../../models/admin/productDetails');
const mongoose = require('mongoose');
const sendMail = require('../../utilities/nodeMailer');

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
            res.render('admin/partials/orders', {
                  documentTitle : "LAP4YOU | eCommerce",
                  session : req.session.admin,
                  allOrders,
                  moment,
                  admin : req.admin,
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
                        delivered : req.body.delivered, // ture or false
                        status : req.body.status,   // cancelled , returned, refunded , delivered, out for delivery, replaced
                        deliveredOn : req.body.deliveredOn, // date
                        updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
                  }
            });



            const currentOrder = await orderCLTN.findById(req.body.id).populate('customer');
            const customerEmail = currentOrder.customer.email;
            //send email
            const adminSubject = `Order has been ${req.body.status} for user ${customerEmail}`;
            const userSubject = `Orders has been ${req.body.status} successfully Order ID : ${req.body.id}`;
            sendMail ('lap4you.ecommerce@gmail.com', adminSubject, `${req.body.status}` , 'admin', req.body.id);
            sendMail(`${customerEmail}`, userSubject,`${req.body.status}` ,'users', req.body.id );


           
            
	    // if status is refunded or cancelled increase the stock, change access to review 

            if(req.body.status == "Refunded"){
                  const currentOrder = await orderCLTN.findById(req.body.id);
                 
                  // retruned product details 
                  const productIds = currentOrder.summary.map((order) => order.product);
                  const quantity = currentOrder.summary.map((order) => order.quantity);
                  const price = currentOrder.summary.map((order) => order.totalPrice);
                  
                  // customer id for changing review access
                  const userId = currentOrder.customer;
                  
                  // returned collection details for making isReturned to true.
                  const returnedProducts  = await returnCLTN.findOne({customer : userId, isReturned : false});
                  const returnedProductId = returnedProducts._id; // document id
                  const productId = returnedProducts.product; // product id
                 
                  // increasing the stock once order is returned
                  for(let i = 0; i< productIds.length; i++){
                        await productCLTN.updateOne(
                              {_id : productIds[i], 'RAMSSD.price': price[i]},
                              {
                                     $inc : {
                                          'RAMSSD.$.quantity' : quantity[i]
                                     }
                              });
                  }

                 
                  // changing returned status to true
                  await returnCLTN.findByIdAndUpdate(returnedProductId, {
                        $set :{
                              isReturned : true,
                        }
                  });

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
                  admin : true,
            });
      } catch (error) {
            console.log('Error in Order Details Page : ' + error);
      }
}

// cancel Orders
exports.cancelOrder = async(req, res) => {
      try {
            const orderDetails = await orderCLTN.findById(req.params.id);
            const productIds = orderDetails.summary.map((order) => order.product);
            const quantity = orderDetails.summary.map((order) => order.quantity);
            const price = orderDetails.summary.map((order) => order.totalPrice);
           
            for(let i = 0; i< productIds.length; i++){
                  await productCLTN.updateOne(
                        {_id : productIds[i], 'RAMSSD.price': price[i]},
                        {
                               $inc : {
                                    'RAMSSD.$.quantity' : quantity[i]
                               }
                        });
            }
            
                  await orderCLTN.findByIdAndUpdate(req.params.id, {
                        $set : {
                              status : "Cancelled",
                              delivered : null,
                              updatedBy : req.session.manager? req.session.manager.name : req.session.admin.name,
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
