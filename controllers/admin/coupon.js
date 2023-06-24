const couponCLTN = require('../../models/admin/coupon');
const moment = require('moment');


// view all coupons
exports.page = async(req, res) => {
      try {
            const coupons = await couponCLTN.find();
            res.render('admin/partials/coupons', {
                  session: req.session.adminId,
                  documentTitle : 'Coupon Management | LAP4YOU',
                  coupons,
                  moment
            })
      } catch (error) {
            console.log('Error in Coupon Management Page '+error);
      }
};

// adding new coupon
exports.addNew = async(req,res) => {
      try {
            const newCoupon = new couponCLTN({
                  name : req.body.name,
                  code : req.body.code,
                  discount : req.body.discount,
                  startingDate : req.body.startingDate,
                  expiryDate : req.body.expiryDate,
            });
            await newCoupon.save();

            res.redirect('/admin/coupon_management');
      } catch (error) {
            console.log('Error in Adding new coupon : ' + error);
      }
};


//change activity
exports.changeActivity = async(req, res) => {
      try {
            const currentCoupon = await couponCLTN.findById(req.query.id);
            let currentActivity = currentCoupon.active;
            if(currentActivity == true){
                  currentActivity = false;
            } else{
                  currentActivity = true;
            }

            // converting current activity to boolean
            currentActivity = Boolean(currentActivity);
            await couponCLTN.findByIdAndUpdate(currentCoupon._id, {
                  active: currentActivity ,
                });

            res.redirect('/admin/coupon_management');
      } catch (error) {
            console.log('Error in Change Activity Of Coupon ' + error);
      }
};