const orderCLTN = require('../../models/users/order');
const moment = require('moment');


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
            console.log(totalPrice);
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



