const wishlistCLTN = require('../../models/users/wishlist');
const mongoose = require('mongoose');


// wishlist page 
exports.viewAll = async(req, res) => {
      try {
            const userWishlist = await wishlistCLTN
                  .findOne({customer : req.session.userId})
                  .populate({
                        path : 'products',
                        populate:{
                              path : 'brand',
                              model : 'brands'
                        }
                  });
            res.render('user/profile/partials/wishlist', {
                  documentTitle : 'User Wishlist | LAP4YOU',
                  session : req.session.userId,
                  userWishlist,
            });
      } catch (error) {
            console.log('Error in User Wishlist Page : ' + error);
      }
}

// add or remove products from wishlist
exports.addOrRemove = async (req, res) => {
      try {
            const userWishlist = await wishlistCLTN.findOne({customer : req.session.userId});

            if(userWishlist){
                  const productExist = await wishlistCLTN.findOne(
                        {_id :userWishlist._id, products:req.body.id});
                  
                  if(!productExist){
                        await wishlistCLTN.findByIdAndUpdate(userWishlist._id, {
                              $push:{
                                    products : [req.body.id]
                              }
                        });
                        res.json({
                              data :{
                                    message : 1
                              }
                        });
                  } else{
                        await wishlistCLTN.findByIdAndUpdate(userWishlist._id, {
                              $pull : {
                                    products : req.body.id
                              }
                        });
                        res.json({
                              data :{
                                    message : 0
                              }
                        });
                  }
            }else{
                  res.json({
                        data :{
                              message : null
                        }
                  });
            }
      } catch (error) {
            console.log('Error in Add wishlist : ' + error);
      }
};


// remove product from wishlist
exports.remove = async(req, res) => {
      try {
            const userWishlist = await wishlistCLTN.findOne({
                  customer : req.session.userId
            });
      
            await wishlistCLTN.updateOne({
                  _id:userWishlist._id,
            },{
                  $pull:{
                        products : req.body.id
                  }
            });
      
            res.json({
                  data:{
                        deleted : true
                  }
            });
      } catch (error) {
            console.log('Error in Remove From wishlist : ' + error);
      }
};