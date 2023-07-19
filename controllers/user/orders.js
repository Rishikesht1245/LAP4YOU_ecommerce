const orderCLTN = require('../../models/users/order');
const moment = require('moment');
const returnCLTN = require('../../models/users/return');
const { order } = require('paypal-rest-sdk');
const productCLTN = require('../../models/admin/productDetails');
const sendMail = require('../../utilities/nodeMailer');
const userCLTN = require('../../models/users/userDetails');


// view orders page 
exports.viewAll = async( req, res) => {
      try {
            // user's all orders
            const allOrders = await orderCLTN
                  .find({customer : req.session.userId})
                  .sort({_id : -1})
                  .populate('customer')
                  .populate('couponUsed');
            res.render('user/profile/partials/orders', {
                  documentTitle : "LAP4YOU | eCommerce",
                  allOrders,
                  moment,
            });

      } catch (error) {
            console.log('Error in View all Orders Page : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};


// view order details
exports.viewOrderDetails = async (req,res) => {
      try {
            const currentOrder = await orderCLTN
                  .findOne({_id : req.params.id})
                  .populate('summary.product')
                  .populate('couponUsed')
                  .sort("");
            const totalPrice = currentOrder.summary.reduce((total, order) => total + order.totalPrice, 0);
            currentOrder.totalPrice = totalPrice;

            let allAddresses = await userCLTN.findById(req.session.userId);
            allAddresses = allAddresses.addresses;
            if(currentOrder){
                  res.render('user/profile/partials/orderDetails', {
                        documentTitle : "LAP4YOU | eCommerce",
                        currentOrder,
                        session:req.session.userId,
                        moment,
                        allAddresses,
                  });
            }else{
                  res.redirect('/pageNotFound');
            }
      } catch (error) {
            console.log("Error in Order Details Page : " + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};

exports.cancelOrder = async(req, res) => {
      try {
            const orderDetails = await orderCLTN.findById(req.params.id);
            const productIds = orderDetails.summary.map((order) => order.product);
            const quantity = orderDetails.summary.map((order) => order.quantity);
            const price = orderDetails.summary.map((order) => order.totalPrice);

            //Increasing the count of product when cancelled
            for(let i = 0; i< productIds.length; i++){
                  await productCLTN.updateOne(
                        {_id : productIds[i], 'RAMSSD.price': price[i]},
                        {
                               $inc : {
                                    'RAMSSD.$.quantity' : quantity[i]
                               }
                        });
            }

            await orderCLTN.findByIdAndUpdate(req.params.id, 
                 { $set : {
                        status : "Cancelled",
                        deliveredon : null,
                  }
            });

            res.json({
                  success:{
                        message : "cancelled"
                  }
            });

            const adminSubject = `Order has been cancelled by ${req.session.email}`;
            const userSubject = `Orders has been cancelled successfully Order ID : ${req.params.id}`;
            sendMail ('lap4you.ecommerce@gmail.com', adminSubject, 'cancelled', 'admin', req.params.id);
            sendMail(`${req.session.email}`, userSubject, 'cancelled' ,'users', req.params.id );
            sendMail(`${req.session.email}`, userSubject, 'cancelled', 'users', req.params.id );
            
      } catch (error) {
            console.log("Error in Cancel Order Page : " + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
}


// return order
exports.returnOrder = async(req, res) => {
    
      try {
            // insert return data to the return collection
            req.body.customer = req.session.userId;
            req.body.accountNo = req.body.accountNo[0];
            const newReturn = new returnCLTN(req.body);
            await newReturn.save();

            let status;
            if(req.body.action == "Replace"){
                  status = "Replace Requested"
            }else{
                  status = "Returned"
            }
      
            //change status of product to returned from order collection
            await orderCLTN.findByIdAndUpdate(req.body.orderId, {
                  $set : {
                        status : status,
                        returnedOn : Date.now(),
                  },
            });

            //redirece to the order details page after return
            res.redirect(`/users/orders/${req.body.orderId}`)
      } catch (error) {
            console.log("Error in Order Return : "+ error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
}



