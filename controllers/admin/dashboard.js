const moment = require('moment');
const userCLTN = require('../../models/users/userDetails');
const productCLTN = require('../../models/admin/productDetails');
const orderCLTN = require('../../models/users/order');
const { order } = require('paypal-rest-sdk');


// view admin dashboard 
exports.view = async (req, res)=> {
      try {
            const recentOrders = await orderCLTN
                              .find()
                              .sort({_id : -1})
                              .populate('customer', 'name email');
           
            const orderCount = recentOrders.length;
            const productCount = await productCLTN.countDocuments();
            const customerCount = await userCLTN.countDocuments();
            let totalRevenue;
            totalRevenue = await orderCLTN.aggregate([
                  {
                        $group : {
                              _id : 0,
                              totalRevenue : {$sum : '$finalPrice'},
                        },
                  },
            ]);
            if(totalRevenue){
                  totalRevenue = totalRevenue[0].totalRevenue;
            }else{
                  totalRevenue = 0
            }

            res.render('admin/partials/dashboard', {
                  session : req.session.admin,
                  recentOrders,
                  moment,
                  orderCount,
                  customerCount,
                  productCount,
                  totalRevenue,
                  documentTitle : 'Admin Dashboard | LAP4YOU',
            });
      } catch (error) {
            console.log("Error in DashBoard Page : " + error);
      }
}


// chart data

exports.chartData = async(req, res)=> {
      try {
            let currentYear = new Date();
            currentYear = currentYear.getFullYear();

            //collection order data based on month and year
            const orderData = await orderCLTN.aggregate([
                  {
                        $match :{
                              status : "Delivered"
                        },
                  },
                  {
                        $project:{
                              _id : 0,
                              totalProducts : "$totalQuantity",
                              billAmount : "$finalPrice",
                              month : {
                                    $month :"$orderedOn",
                              },
                              year : {
                                    $year : '$orderedOn'
                              }
                        }
                  },{
                        $group: {
                              _id : {month : "$month", year : "$year"},
                              totalProducts : {$sum : "$totalProducts"},
                              totalOrders : {$sum : 1},
                              revenue : {$sum : "$billAmount"},
                              avgBillPerOrder : {$avg : "$billAmount"},
                        },
                  },{
                        $match : {"_id.year" : currentYear},
                  },{
                        $sort:{"_id.month" : 1},
                  },
            ]);

            // dougnut chart initialization
             //collecting delivered orders
             const deliveredOrders = await orderCLTN.find({status : "Delivered"}).countDocuments();
             console.log(deliveredOrders)
             //collecting cancelled and in-transist orders 
             let returnedOrders = await orderCLTN.find({status : "Returned"}).countDocuments();
             console.log(returnedOrders);
             let notDelivered = await orderCLTN.aggregate([
                   {
                         $match :{
                               delivered : false,
                               orderedOn:{
                                    $gte: new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000)))
                              }
                         }  
                   },{
                        $group:{
                              _id : "$status",
                              status : {$sum : 1},
                        },
                  },
             ]);
           
             let inTransit;
             let cancelled;
             let refunded;
             notDelivered.forEach((order) => {
                   if(order._id === "In-transit"){
                         inTransit = order.status;
                   }else if(order._id === "Cancelled"){
                         cancelled = order.status;
                   }else if(order._id === "Refunded"){
                         refunded = order.status
                   }
             });
             console.log(notDelivered);
             const delivered = deliveredOrders;

           
            res.json({
                  data : {orderData, inTransit, delivered, cancelled, returnedOrders, refunded}
            });

      } catch (error) {
            console.log("Error in Chart Data : " + error);
      }
};

// select period for doughnut chart
exports.doughNutData = async(req, res) => {

      try {
            const period = req.params.id;
      
             //collecting delivered orders
             const deliveredOrders = await orderCLTN.find({status : "Delivered"}).countDocuments();
            
             //collecting cancelled and in-transist orders 
             let returnedOrders = await orderCLTN.find({status : "Returned"}).countDocuments();
             let notDelivered = await orderCLTN.aggregate([
                   {
                         $match :{
                               delivered : false,
                               orderedOn:{
                                    $gte: new Date((new Date().getTime() - (period * 24 * 60 * 60 * 1000)))
                              }
                         }  
                   },{
                        $group:{
                              _id : "$status",
                              status : {$sum : 1},
                        },
                  },
             ]);
           
             let inTransit;
             let cancelled;
             let refunded;
             notDelivered.forEach((order) => {
                   if(order._id === "In-transit"){
                         inTransit = order.status;
                   }else if(order._id === "Cancelled"){
                         cancelled = order.status;
                   }else if(order._id === "Refunded"){
                         refunded = order.status
                   }
             });
             console.log(notDelivered);
             const delivered = deliveredOrders;
      
             res.json({
                  data:{inTransit, cancelled, delivered, returnedOrders, refunded}
             });
            
      } catch (error) {
            console.log("Error in doughNut Chart : " + error);
      }
};