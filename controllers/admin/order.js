const { order } = require('paypal-rest-sdk');
const orderCLTN = require('../../models/users/order');
const moment = require('moment');


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
            });
      } catch (error) {
            console.log("Error in Order Admin Page : " + error);
      }
};


// deliver order
exports.deliver = async(req, res) => {
      try {
            await orderCLTN.findByIdAndUpdate(req.body.id, {
                  $set:{
                        delivered : true,
                        deliveredOn : Date.now(),
                  }
            });

            res.json({
                  data : {
                        delivered : 1,
                  }
            });
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