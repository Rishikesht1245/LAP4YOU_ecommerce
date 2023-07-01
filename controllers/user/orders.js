const orderCLTN = require('../../models/users/order');
const moment = require('moment');
const returnCLTN = require('../../models/users/return');
const { order } = require('paypal-rest-sdk');

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
            console.log(currentOrder);
            if(currentOrder){
                  res.render('user/profile/partials/orderDetails', {
                        documentTitle : "LAP4YOU | eCommerce",
                        currentOrder,
                        session:req.session.userId,
                        moment
                  });
            }else{
                  res.redirect('/pageNotFound');
            }
      } catch (error) {
            console.log("Error in Order Details Page : " + error);
      }
};

exports.cancelOrder = async(req, res) => {
      try {
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
            
      } catch (error) {
            console.log("Error in Cancel Order Page : " + error);
      }
}


// return order
exports.returnOrder = async(req, res) => {
    
      try {
            // insert return data to the return collection
            req.body.customer = req.session.userId;
            const newReturn = new returnCLTN(req.body);
            await newReturn.save();
            console.log('Returned Data saved')
      
            //change status of product to returned from order collection
            await orderCLTN.findByIdAndUpdate(req.body.orderId, {
                  $set : {
                        status : "Returned",
                        returnedOn : Date.now(),
                  },
            });
            console.log('Status Changed');

            //redirece to the order details page after return
            res.redirect(`/users/orders/${req.body.orderId}`)
      } catch (error) {
            console.log("Error in Order Return : "+ error);
      }
}



