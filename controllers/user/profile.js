const mongoose = require('mongoose');
const userCLTN = require('../../models/users/userDetails');


exports.profilePafge = async (req, res) => {
      try {
            const userId = req.session.userId;
            const currentUser = await userCLTN.findById(userId);
      
            const defaultAddress = await userCLTN.aggregate([
                  {
                        $match : {
                              _id : new mongoose.Types.ObjectId(userId),
                        },
                  },{
                        $unwind : '$addresses'
                  },{
                        $match:{
                              "addresses.primary" : true
                        },
                  },
            ]);
            res.render('user/profile/partials/profile', {
                  documentTitle : 'User profile |  LAP4YOU',
                  currentUser,
                  defaultAddress,
            });
      } catch (error) {
            console.log('Error in User Profile Page : ' + error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};


// update profile
exports.updateProfile = async (req, res) => {
     try {
            const userId = req.session.userId;
            const newName = req.body.name;
            const updatedBody = {name : newName};
            if(req.file){
                  updatedBody.photo = req.file.filename;
            }
            await userCLTN.findByIdAndUpdate(userId, updatedBody);
            res.redirect('/users/profile');
     } catch (error) {
            console.log('Error in Update user profile :' +error);
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
     }
}