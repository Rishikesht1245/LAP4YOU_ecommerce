const productCLTN = require('../../models/admin/productDetails');
const userCLTN = require('../../models/users/userDetails');
const bannerCLTN = require('../../models/admin/banner');

// rendering landing page
exports.viewAll = async(req, res)=> {
      try{
            let currentUser = null;
            if(req.session.userId){
                  currentUser = await userCLTN.findById(req.session.userId);
            }
            const allProducts = await productCLTN.find({listed:true}).populate(['brand','category']).sort({_id:-1});
            let gaming = [];
            let student = [];
            let business = [];
            allProducts.forEach((product)=> {
                  if(product.category._id == "64888a004cb3b3a4b1bb8be3"){
                        gaming.push(product);
                  }else if(product.category._id == "648d930bca2707bb62f29e01"){
                        student.push(product);
                  }else if(product.category._id == "648d9311ca2707bb62f29e06"){
                        business.push(product);
                  }
            });
            gaming = gaming.slice(0,3);
            student = student.slice(0,3);
            business = business.slice(0,3);
            const newReleases =allProducts.slice(0,3);
            const allBanners = await bannerCLTN.find({active:true}).limit(3);
            console.log(req.session.cartCount)
            res.render('index/landingPage', {
                  cartCount : req.session.cartCount,
                  wishlistCount : req.session.wishlistCount,
                  session : req.session.userId,
                  currentUser,
                  newReleases,
                  gaming,
                  student,
                  business,
                  banners:allBanners,
            });
      } catch(error){
            console.log('Error in GET Landing Page ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};
