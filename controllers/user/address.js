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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
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
            const currentUser = await userCLTN.findById(req.session.userId);
            res.render('index/404', {
                  documentTitle : '404 | Page Not Found',
                  url: req.originalUrl,
                  session: req.session.userId,
                  currentUser,
            });
      }
};