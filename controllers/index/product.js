const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');
const reviewCLTN = require('../../models/users/review');
const wishlistCLTN = require('../../models/users/wishlist');
const moment = require('moment');
const category = require('./productListing');
const orderReviewCLTN = require('../../models/users/orderReview');
const couponCLTN = require('../../models/admin/coupon');

// single Product page
exports.view = async(req, res) => {
      try{
            const currentUser = await userCLTN.findById(req.session.userId);
            const productDetails = await productCLTN
                  .findById(req.params.id)
                  .populate(['category', 'brand']);
           
            const categoryId = productDetails.category._id;

            // for displaying available coupon in product page
            const coupons = await couponCLTN.find({
                  $or: [
                    { category: categoryId },
                    { product: req.params.id }
                  ],
                  active : true,
                });
                
            let productExistInWishlist = null;
           
            if(currentUser){
                  productExistInWishlist = await wishlistCLTN.findOne({
                        customer: currentUser._id,
                        products: { $in: [productDetails._id] },
                      });                      
                  productExistInWishlist = productExistInWishlist ? productExistInWishlist.products : null;
            }
            
            let reviews = await reviewCLTN.find({product: productDetails._id})
                  .sort({_createdAt : -1})
                  .populate({
                        path : 'customer',
                        select : 'name photo',
                  });
           
            const numberOfReviews = reviews.length;
            reviews = reviews.slice(0,6);
            if(reviews == ""){
                  reviews = null;
            }
           
            let similarProducts = await productCLTN.find({ 'category': categoryId }).populate(['category', 'brand']);
            similarProducts = similarProducts.filter((product) => product.name != productDetails.name)
            const accessToReview = await orderReviewCLTN.findOne({customer : req.session.userId, product : req.params.id, deliverd : true});
            res.render('index/product', {
                  cartCount : req.session.cartCount,
                  wishlistCount : req.session.wishlistCount,
                  session : req.session.userId,
                  documentTitle : productDetails.name,
                  productDetails,
                  currentUser,
                  productExistInWishlist,
                  reviews,
                  numberOfReviews,
                  moment,
                  similarProducts,
                  accessToReview,
                  coupons : coupons[0],
            });
      } catch(error){
            console.log('Error in Single Product Page : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                      documentTitle : '404 | Page Not Found',
                      url: req.originalUrl,
                      session: req.session.userId,
                      currentUser,
            });
      }
};


// checking if product is listed or not
exports.listedCheck = async(req, res) => {
      const productId = req.body.id;
      const productDetails = await productCLTN.findById(productId);
      if(productDetails.listed){
            res.json({
                  message:'listed',
            });
      } else{
            res.json({
                  message : 'unlisted'
            });
      }
}