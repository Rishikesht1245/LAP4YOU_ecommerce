const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');
const reviewCLTN = require('../../models/users/review');
const wishlistCLTN = require('../../models/users/wishlist');
const moment = require('moment');

// single Product page
exports.view = async(req, res) => {
      try{
            const currentUser = await userCLTN.findById(req.session.userId);
            const productDetails = await productCLTN
                  .findById(req.params.id)
                  .populate(['category', 'brand']);
            let productExistInWishlist = null;
            if(currentUser){
                  productExistInWishlist = await wishlistCLTN.findOne({
                        customer : currentUser._id,
                        product : productDetails._id,
                  });
            }
            let reviews = await reviewCLTN.find({product: productDetails._id})
                  .sort({_createdAt : -1})
                  .populate({
                        path : 'customer',
                        select : 'name photo',
                  });
            console.log(reviews);
            const numberOfReviews = reviews.length;
            reviews = reviews.slice(0,6);
            if(reviews == ""){
                  reviews = null;
            }
            res.render('index/product', {
                  session : req.session.userId,
                  documentTitle : productDetails.name,
                  productDetails,
                  currentUser,
                  productExistInWishlist,
                  reviews,
                  numberOfReviews,
                  moment
            });
      } catch(error){
            console.log('Error in Single Product Page : ' + error);
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