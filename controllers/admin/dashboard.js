const moment = require('moment');
const userCLTN = require('../../models/users/userDetails');


// view admin dashboard ----- PENDING TO COMPLETE -----
exports.view = (req, res)=> {
      if(req.session.admin){
            res.render('admin/partials/dashboard', {
                        session: req.session.admin,
                        recentOrders : [{_id : 10, customer:{email :'rishi@gmail.com'}, finalPrice:'330' }],
                        moment,
                        orderCount : 12,
                        customerCount : 25,
                        productCount : 54,
                        totalRevenue :67,
                        documentTitle: 'Admin Dashboard | TIMELESS'
                      });
      }
}