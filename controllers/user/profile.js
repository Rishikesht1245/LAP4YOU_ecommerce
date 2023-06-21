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
                              "address.primary" : true
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
     }
}