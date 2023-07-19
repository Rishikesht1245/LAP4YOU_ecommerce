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
      	                 $match : {
                              delivered : true,
                        },
                  },
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
                  session : req.session.admin || req.session.manager,
                  recentOrders,
                  moment,
                  orderCount,
                  customerCount,
                  productCount,
                  totalRevenue,
                  documentTitle : 'Admin Dashboard | LAP4YOU',
                  admin : req.admin,
                  flash : req.flash(),
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
            const today = moment().startOf('day'); // Get the start of the current day
            const todayFormatted = today.format('YYYY-MM-DD'); // Format the date as string

            let orders = await orderCLTN.aggregate([
                  {
                        $match :{
                              orderedOn:{
                                   $gte: new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000)))
                             }
                        }  
                  },{
                       $group:{
                             _id : "$status",
                             status : {$sum : 1}, // {$sum : 1}  -- sum count of documents.
                       },
                 },
            ]);
            let inTransit, cancelled, delivered, returnedOrders, refunded;
            orders.forEach((order, i) => {
                  if(order._id === "In-transit"){
                        inTransit = order.status;
                  }else if(order._id === "Cancelled"){
                        cancelled = order.status;
                  }else if(order._id === "Delivered"){
                        delivered = order.status;
                  }else if(order._id === "Refunded"){
                        refunded = order.status;
                  }else{
                        returnedOrders = order.status;
                  }
            });
           
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
      
             let orders = await orderCLTN.aggregate([
                   {
                         $match :{
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

            let inTransit, cancelled, delivered, returnedOrders, refunded;
            orders.forEach((order, i) => {
                  if(order._id === "In-transit"){
                        inTransit = order.status;
                  }else if(order._id === "Cancelled"){
                        cancelled = order.status;
                  }else if(order._id === "Delivered"){
                        delivered = order.status;
                  }else if(order._id === "Refunded"){
                        refunded = order.status;
                  }else{
                        returnedOrders = order.status;
                  }
            });
      
             res.json({
                  data:{inTransit, cancelled, delivered, returnedOrders, refunded}
             });
            
      } catch (error) {
            console.log("Error in doughNut Chart : " + error);
      }
};
