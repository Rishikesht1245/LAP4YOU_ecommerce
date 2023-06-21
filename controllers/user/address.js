const userCLTN = require('../../models/users/userDetails');

// get address page
exports.viewAll = async (req, res) => {
      try {
            const userId = req.session.userId;
            const currentUser = await userCLTN.findById(userId);
            let allAddresses = currentUser.addresses;
            if(allAddresses == ''){
                  allAddresses = null;
            }
            res.render('user/profile/partials/address', {
                  documentTitle : 'User Address | LAP4YOU',
                  allAddresses,
            });  
      } catch (error) {
            console.log('Error in Address Page : ' + error);
      }
}

// add new address
exports.addNewAddress = async(req, res) => {
      try {
            const userId = req.session.userId;
            await userCLTN.updateMany(
                  {_id : userId, 'addresses.primary' : true},
                  {$set : {'addresses.$.primary' : false,}},
            );

            await userCLTN.updateOne(
                  {_id : userId},
                  {
                        $push : {
                              addresses : {
                                     building : req.body.building,
                                     address : req.body.address,
                                     pincode : req.body.pincode,
                                     country : req.body.country,
                                     contactNumber : req.body.contactNumber,
                                     primary : true,
                                    },
                              }
                        }
                  );
            res.redirect('/users/addresses');
      } catch (error) {
            console.log('Error in Add New Address : ' + error);
      }
};

// edit address
exports.editAddress = async(req, res) => {
      try {
            const userId = req.session.userId;
            const addressId = req.query.addressID;
            await userCLTN.updateOne(
                  {_id : userId, 'addresses._id' : addressId},
                  {
                        $set: {
                              'addresses.$.building':req.body.building,
                              'addresses.$.address': req.body.address,
                              'addresses.$.pincode ': req.body.pincode,
                              'addresses.$.country ': req.body.country,
                              'addresses.$.contactNumber' : req.body.contactNumber,
                        },
                  },
            );
            res.redirect('/users/addresses');
      } catch (error) {
            console.log('Error in Edit Address : ' + error);
      }
};


// delete Address

exports.deleteAddress = async(req, res) => {
      try {
            const userId = req.session.userId;
            const addressId = req.query.addressID;
            await userCLTN.updateOne(
                  {_id : userId},
                  {$pull : {addresses : {_id : addressId}}}
            );

            res.redirect('/users/addresses');
      } catch (error) {
            console.log('Error in Removing Address : ' + error);
      }
};


// default address toggler
exports.defaultToggler = async(req, res) =>{
      try {
            const userId = req.session.userId;
            const addressId = req.query.addressID;
            await userCLTN.updateMany(
                  {_id : userId, 'addresses.primary' : true},
                  {$set: {'addresses.$.primary' : false}}
            );

            await userCLTN.updateMany(
                  {_id : userId, 'addresses._id' : addressId},
                  {$set : {'addresses.$.primary' : true}}
            );

            res.redirect('/users/addresses');
      } catch (error) {
            console.log('Error in Default Address Toggler :' + error);
      }
};