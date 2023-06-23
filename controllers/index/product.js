const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');
const reviewCLTN = require('../../models/users/review');
const wishlistCLTN = require('../../models/users/wishlist');
const moment = require('moment');
const { category } = require('./productListing');

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
            const categoryId = productDetails.category._id;
            let similarProducts = await productCLTN.find({ 'category': categoryId }).populate(['category', 'brand']);
            similarProducts = similarProducts.filter((product) => product.name != productDetails.name)
            res.render('index/product', {
                  session : req.session.userId,
                  documentTitle : productDetails.name,
                  productDetails,
                  currentUser,
                  productExistInWishlist,
                  reviews,
                  numberOfReviews,
                  moment,
                  similarProducts,
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